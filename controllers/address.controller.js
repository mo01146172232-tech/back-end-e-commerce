const Address=require('../model/address.model');
const User=require('../model/user.model');
const catchAsync=require('../utilites/catchAsync.util')
const AppError=require('../utilites/appError.util')


exports.addAddress=catchAsync(async(req,res,next)=>{
    const id=req.user._id;
    const {title,address}=req.body;

    const myUser = await User.findById(id);
    if (!myUser) {
        return next(new AppError('user not found', 404));
    }

    let newAddress = await Address.create({ title, address });
    myUser.addresses.push(newAddress._id);
    
    if (myUser.addresses.length === 1) {
        newAddress.isDefault = true;
        await newAddress.save();
    }
    
    await myUser.save();
    res.status(201).json({message:'address created',data:newAddress});
})

exports.getUserAddresses=catchAsync(async(req,res,next)=>{
    const id=req.user._id;
    const myUser=await User.findOne({_id:id,isDeleted:false}).populate('addresses');
    if(!myUser){
        // return res.status(404).json({message:'user not found'});
        return next(new AppError('user not found',404))
    }
    res.status(200).json({message:'user addresses',data:myUser.addresses});
})
exports.updateAddress=catchAsync(async(req,res,next)=>{
    const id=req.params.id;
    const {title,address}=req.body;
    const myAddress=await Address.findOneAndUpdate({_id:id,isDeleted:false},{title,address},{new:true});
    if(!myAddress){
        // return res.status(404).json({message:'address not found'});
        return next(new AppError('address not found',404))
    }
    res.status(200).json({message:'address updated',data:myAddress});
})

exports.deleteAddress=catchAsync(async(req,res,next)=>{
    const userId=req.user._id;
    const addressId=req.params.id;
    const myAddress=await Address.findOneAndUpdate({_id:addressId,isDeleted:false},{isDeleted:true},{new:true});
    if(!myAddress){
        // return res.status(404).json({message:'address not found'});
        return next(new AppError(`address not found with id: ${addressId}`,404))
    }
    await User.findOneAndUpdate({_id:userId,isDeleted:false},{$pull:{addresses:addressId}},{new:true});
    res.status(200).json({message:'address deleted',data:myAddress});
})

exports.setDefaultAddress=catchAsync(async(req,res,next)=>{
    const userId=req.user._id;
    const addressId=req.params.id;

    const myUser=await User.findOne({_id:userId,isDeleted:false,isActive:true,addresses:addressId});

    if(!myUser){
        // return res.status(404).json({message:'user not found'});
        return next(new AppError('user not found',404))
    }

    await Address.updateMany({_id:{$in:myUser.addresses}},{isDefault:false});

    await Address.findOneAndUpdate({_id:addressId,isDeleted:false},{isDefault:true});
    const allAddresses=await Address.find({_id:{$in:myUser.addresses}});

    res.status(200).json({message:'address set as default',data:allAddresses});
})