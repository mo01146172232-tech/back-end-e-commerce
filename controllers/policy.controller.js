const Policy=require('../model/policy.model');
const catchAsync=require('../utilites/catchAsync.util')
const AppError=require('../utilites/appError.util')


exports.getPolicy=catchAsync(async(req,res,next)=>{
    const myPolicy=await Policy.find({isDeleted:false,isActive:true});
    res.status(200).json({message:'policy list',data:myPolicy});
})

exports.getPolicyByType=catchAsync(async(req,res,next)=>{
    const type=req.params.type;
    const myPolicy=await Policy.findOne({isDeleted:false,isActive:true,type})
    if(!myPolicy){
        // return res.status(404).json({message:'policy not found'});
        return next(new AppError(`policy not found with type: ${type}`,404))
    }
    res.status(200).json({message:'policy found',data:myPolicy});
})

exports.addPolicy=catchAsync(async(req,res,next)=>{
    const {title,content,type}=req.body;
    const myPolicy=await Policy.create({title,content,type});
    
    res.status(201).json({message:'Policy created successfully',data:myPolicy});
})

exports.updatePolicy=catchAsync(async(req,res,next)=>{
    const type=req.params.type;
    const {title,content,isActive}=req.body;
    const myPolicy=await Policy.findOneAndUpdate({type},{title,content,isActive},{new:true});
    if(!myPolicy){
        // return res.status(404).json({message:'policy not found'});
        return next(new AppError(`policy not found with type: ${type}`,404))
    }
    res.status(200).json({message:'policy updated successfully',data:myPolicy});
})

exports.deletePolicy=catchAsync(async(req,res,next)=>{
    const type=req.params.type;
    const myPolicy=await Policy.findOneAndUpdate({type,isDeleted:false},{isDeleted:true},{new:true});
    if(!myPolicy){
        // return res.status(404).json({message:'policy not found'});
        return next(new AppError(`policy not found with type: ${type}`,404))
    }
    res.status(200).json({message:'policy deleted successfully',data:myPolicy});
})