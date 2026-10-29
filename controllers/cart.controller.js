const Cart = require("../model/cart.model");
const Product = require("../model/product.model");
const catchAsync=require('../utilites/catchAsync.util')
const AppError=require('../utilites/appError.util')
const logger=require('../utilites/logger.util')


exports.addItemToCart = catchAsync(async (req, res,next) => {

    const {productId,quantity} = req.body;
    const userId=req.user._id;

    const myProduct = await Product.findOne({_id:productId,isActive:true,isDeleted:false});
    if(!myProduct){
        // return res.status(404).json({message:'Product not found'})
        return next(new AppError(`Product not found with id: ${productId}`,404))
    }
    if (quantity > myProduct.stock) {
        return next(new AppError(`Requested quantity exceeds available stock. Available: ${myProduct.stock}`, 400));
    }

    const myCart=await Cart.findOne({user:userId,isActive:true});
    if(!myCart){
        const newCart=await Cart.create({user:userId,items:[{product:productId,quantity:quantity,price:myProduct.price}]});
        res.status(201).json({message:'Product added to cart',cart:newCart})
    }else{
        const itemIndex=myCart.items.findIndex(item=>item.product.toString()===productId);
        if(itemIndex !=-1){
            myCart.items[itemIndex].quantity+=1;
        }else{
            
            const item= myCart.items.push({product:productId,quantity,
                price:myProduct.price
            })
        }
        await myCart.save();
        res.status(201).json({message:'Product added to cart',data:myCart})
    }

})

exports.getCart = catchAsync(async (req, res,next) => {
    const userId=req.user._id;
    const myCart=await Cart.findOne({user:userId,isActive:true}).populate({
            path: 'items.product',
            populate: [
                { path: 'category' },
                { path: 'subCategory' }
            ]
        });
    if(!myCart){
        // return res.status(404).json({message:'Cart not found'})
        return next(new AppError('Cart not found',404))
    }
    let isCartUpdated = false;
    let totalPrice = 0; 

    myCart.items.forEach(item => {
        if (item.product) {
            if (item.price !== item.product.price) {
                if (!item.isPriceChanged) {
                    item.isPriceChanged = true;
                    isCartUpdated = true;
                }
            } else {
                if (item.isPriceChanged) {
                    item.isPriceChanged = false;
                    isCartUpdated = true;
                }
            }
            if (!item.isPriceChanged){
            totalPrice += (item.product.price * item.quantity);
            }
        }
    });

    if (isCartUpdated) {
        await myCart.save();
    }
    const cartData = myCart.toObject();
    cartData.totalPrice = totalPrice;
    res.status(200).json({message:'Cart',data:cartData})
})

exports.removeItemFromCart = catchAsync(async (req, res,next) => {
    const userId=req.user._id;
    const productId=req.params.id;
    const myCart=await Cart.findOne({user:userId,isActive:true})
    if(!myCart){
        // return res.status(404).json({message:'Cart not found'})
        return next(new AppError('Cart not found',404))
    }

    myCart.items=myCart.items.filter(item=>item.product.toString()!==productId);
    myCart.markModified('items')
    await myCart.save();
    res.status(200).json({message:'Item removed from cart',cart:myCart})
})


exports.clearCart = catchAsync(async (req, res,next) => {
    const userId = req.user._id;

        const myCart = await Cart.findOneAndUpdate(
            { user: userId, isActive: true },
            { items: [] },
            { new: true }
        );

        if (!myCart) {
            // return res.status(404).json({ message: 'Cart not found' });
            return next(new AppError('Cart not found',404))
        }
        logger.info(`User: ${userId} cleared their cart`);
        res.status(200).json({ message: 'Cart cleared', data: myCart });
})

exports.updateQuantity = catchAsync(async (req, res,next) => {
    const userId = req.user._id;
    const { productId, action } = req.body;

    const myCart = await Cart.findOne({ user: userId, isActive: true });

    if (!myCart) {
        // return res.status(404).json({ message: 'Cart not found' });
        return next(new AppError('Cart not found',404))
    }
    const itemIndex = myCart.items.findIndex(item => item.product.toString() === productId);
    if (itemIndex == -1) {
        return res.status(404).json({ message: 'Item not found in cart' });
    }
    if(action==='decrease'){
        myCart.items[itemIndex].quantity -= 1;
    }else if(action==='increase'){
        myCart.items[itemIndex].quantity += 1;
    }
    if(myCart.items[itemIndex].quantity < 1){
        myCart.items.splice(itemIndex,1);
    }
    await myCart.save();
    res.status(200).json({ message: 'Item quantity updated', data: myCart });
})


exports.acceptPriceChange = catchAsync(async (req, res, next) => {
    const userId = req.user._id;
    const { productId } = req.body;

    const currentProduct = await Product.findById(productId);
    if (!currentProduct) {
        return next(new AppError('Product not found', 404));
    }

    const myCart = await Cart.findOneAndUpdate(
        {user: userId,isActive: true,"items.product": productId},
        {$set: {"items.$.price": currentProduct.price,"items.$.isPriceChanged": false}},
        { new: true }).populate('items.product');

    if (!myCart) {
        return next(new AppError('Cart or item not found', 404));
    }
    res.status(200).json({ message: 'Price change accepted successfully', data: myCart });
});

exports.syncCart = catchAsync(async (req, res, next) => {
    const { localItems } = req.body; 
    const userId = req.user._id;

    if (!localItems || localItems.length === 0) {
        const myCart = await Cart.findOne({ user: userId, isActive: true });
        return res.status(200).json({ message: 'No items to sync', data: myCart });
    }

    let myCart = await Cart.findOne({ user: userId, isActive: true });
    if (!myCart) {
        myCart = await Cart.create({ user: userId, items: [] });
    }

    const productIds = localItems.map(item => item.productId);
    const validProducts = await Product.find({ 
        _id: { $in: productIds }, 
        isActive: true, 
        isDeleted: false 
    });

    localItems.forEach(localItem => {
        const productDB = validProducts.find(p => p._id.toString() === localItem.productId);
        
        if (productDB) {
            const itemIndex = myCart.items.findIndex(item => item.product.toString() === localItem.productId);
            
            if (itemIndex !== -1) {
                myCart.items[itemIndex].quantity += localItem.quantity;
            } else {
                myCart.items.push({
                    product: localItem.productId,
                    quantity: localItem.quantity,
                    price: productDB.price
                });
            }
        }
    });
    await myCart.save();
    logger.info(`Guest cart synced successfully for User: ${userId}`);
    res.status(200).json({ message: 'Cart synced successfully', data: myCart });
});