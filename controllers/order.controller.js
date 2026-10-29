const Order = require("../model/order.model");
const Cart = require("../model/cart.model");
const Product = require("../model/product.model");
const User = require("../model/user.model");
const mongoose=require('mongoose')
const catchAsync=require('../utilites/catchAsync.util')
const AppError=require('../utilites/appError.util')
const logger=require('../utilites/logger.util')

exports.createOrder = catchAsync(async (req, res,next) => {
    const userId = req.user._id;

    const session=await mongoose.startSession()
    session.startTransaction()
    try{
    const myCart = await Cart.findOne({ user: userId, isActive: true}).populate("items.product").session(session);
    if(!myCart || myCart.items.length === 0){
        throw new Error('Cart is empty');
    }

    const myUser=await User.findById(userId).populate({
        path:'addresses',
        match:{isDefault:true,isDeleted:false}
    }).session(session);

    if(!myUser||myUser.addresses.length===0){
        throw new Error('Default address not found');
    }
    
    const myAddress=myUser.addresses[0];
    for (let item of myCart.items){
        if(item.product.stock < item.quantity){
            logger.warn(`Order blocked for user ${userId}: Insufficient stock for ${item.product.name}`);
            throw new Error(`Requested quantity for product ${item.product.name} is not available. Available: ${item.product.stock}`);
        }
    }
    const orderTotalPrice = myCart.items.reduce((total, item) => total + (item.quantity * item.product.price), 0);

    const order=await Order.create([{
        user: userId,
        items: myCart.items.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price
    })),
        totalPrice: orderTotalPrice,
        address: myAddress._id,
        snapshot: {
            mobile: myUser.phone,
            address: myAddress.address,
        }
    }],{session:session})
    
    for(let item of myCart.items){
        await Product.findByIdAndUpdate(item.product._id,{
            $inc:{stock:-item.quantity}
        },{session})
    }

    await Cart.findOneAndUpdate({user:userId,isActive:true},{$set:{items:[]}},{session})

    await session.commitTransaction();
    session.endSession()

    logger.info(`Order ${order[0]._id} created successfully by user ${userId}`);
    res.status(201).json({ message: 'Order created successfully', data: order[0] });
    }catch(err){
        await session.abortTransaction();
        session.endSession()
        // res.status(404).json({error:err.message})
        return next(new AppError(err.message,404))
    }
})

exports.updateIsReaded = catchAsync(async (req, res,next) => {
    const orderId=req.params.id;

    const updatedOrder=await Order.findOneAndUpdate({_id:orderId,isDeleted:false},{isReaded:true},{new:true})
    if(!updatedOrder){
        // return res.status(404).json({message:'Order not found'})
        return next(new AppError(`Order not found with id: ${orderId}`,404))
    }

    res.status(200).json({message:'Order marked as read',data:updatedOrder})
})

exports.updateOrderStatus = catchAsync(async (req, res,next) => {
    const orderId=req.params.id;
    const {status}=req.body;

    const updatedOrder=await Order.findOneAndUpdate({_id:orderId,isDeleted:false},{status:status},{new:true})
    if(!updatedOrder){
        // return res.status(404).json({message:'Order not found'})
        return next(new AppError(`Order not found with id: ${orderId}`,404))
    }
    logger.info(`Admin updated order ${orderId} status to: ${status}`);
    res.status(200).json({message:`Order status updated to ${status}`,data:updatedOrder})

})

exports.getUserOrders = catchAsync(async (req, res,next) => {
    const userId=req.user._id;

    const myOrders=await Order.find({user:userId,isDeleted:false}).populate('user', 'name email').populate('items.product', 'name price').sort({createdAt:-1})

    if(!myOrders){
        // return res.status(404).json({message:'Orders not found'})
        return next(new AppError('Orders not found',404))
    }
    res.status(200).json({message:'Orders retrieved successfully',data:myOrders})
})

exports.getAllOrders=catchAsync(async(req,res,next)=>{
    const isReaded=req.query.isReaded

    if(isReaded === undefined){
        const allOrders = await Order.find({ isDeleted: false })
        .populate('user', 'name email')
        .populate('items.product', 'name price').sort({ createdAt: -1 });

        return res.status(200).json({ message: 'All orders retrieved successfully', data: allOrders });
    }
    const myOrders=await Order.find({isDeleted:false,isReaded:isReaded}).populate('user', 'name email').populate('items.product', 'name price').sort({createdAt:-1})
    res.status(200).json({message:'Orders retrieved successfully',data:myOrders})
})