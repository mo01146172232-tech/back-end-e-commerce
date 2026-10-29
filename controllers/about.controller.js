const About=require('../model/about.model');
const catchAsync=require('../utilites/catchAsync.util')
const AppError=require('../utilites/appError.util')

exports.getAbout=catchAsync(async(req,res,next)=>{
    const myAbout=await About.find({isDeleted:false,isActive:true});
    res.status(200).json({message:'about list',data:myAbout});

})

exports.addAndUpdateAbout=catchAsync(async(req,res,next)=>{
    const {title,content,isActive}=req.body;
    const myAbout=await About.findOneAndUpdate({},{title,content,isActive},{new:true,upsert:true});
    res.status(201).json({message:'about created',data:myAbout});
})

