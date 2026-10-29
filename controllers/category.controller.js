const Category=require('../model/category.model');
const catchAsync=require('../utilites/catchAsync.util')
const AppError=require('../utilites/appError.util')

exports.getCategories=catchAsync(async(req,res,next)=>{
    const myCategories=await Category.find({isDeleted:false,isActive:true});
    res.status(200).json({message:'categories list',data:myCategories});
})
exports.getCategoryBySlug=catchAsync(async(req,res,next)=>{
    const slug=req.params.slug;
    const myCategory=await Category.findOne({slug,isDeleted:false,isActive:true});
    if(myCategory){
        res.status(200).json({message:`get category by slug: ${slug}`,data:myCategory});
    }
    else{
        // res.status(404).json({error:`can't find category with slug:${slug}`})
        return next(new AppError(`can't find category with slug:${slug}`,404))
    }
})

exports.addCategory=catchAsync(async(req,res,next)=>{
    const {gender,slug}=req.body;
    const check=await Category.findOne({slug});
    if(check){
        // return res.status(400).json({message:'slug already exists'});
        return next(new AppError(`slug already exists with slug: ${slug}`,400))
    }
    const myCategory=await Category.create({gender,slug});
    res.status(200).json({message:'category created',data:myCategory});
})
exports.updateCategory=catchAsync(async(req,res,next)=>{
    const slug=req.params.slug;
    const updateData=req.body;
    const myCategory=await Category.findOneAndUpdate({slug},updateData,{new:true});
    if(!myCategory){
        // return res.status(404).json({message:'category not found'});
        return next(new AppError(`category not found with slug: ${slug}`,404))
    }
    res.status(200).json({message:'category updated',data:myCategory});
})

exports.deleteCategory=catchAsync(async(req,res,next)=>{
    const slug=req.params.slug;
    const myCategory=await Category.findOneAndUpdate({slug,isDeleted:false,isActive:true},{isDeleted:true,isActive:false},{new:true});
    if(!myCategory){
        // return res.status(404).json({message:'category not found'});
        return next(new AppError(`category not found with slug: ${slug}`,404))
    }
    res.status(200).json({message:'category deleted',data:myCategory});
})