const SubCategory = require("../model/subcategory.model");
const Category = require("../model/category.model");
const AppError=require('../utilites/appError.util')
const catchAsync=require('../utilites/catchAsync.util')


exports.getSubCategory = catchAsync(async (req, res,next) => {
  const subcategory = await SubCategory.find({isDeleted:false,isActive:true}).populate('category');
  res.status(200).json({ message: "subcategories list", data: subcategory });
});

exports.getSubCategoryBySlug = catchAsync(async (req, res,next) => {
    const slug = req.params.slug;
    const subcategory = await SubCategory.findOne({slug:slug,isDeleted:false,isActive:true}).populate('category');
    if(!subcategory){
        return next(new AppError(`subcategory not found with slug: ${slug}`,404))
    }
    res.status(200).json({ message: "subcategory", data: subcategory });
});

exports.updateSubCategory = catchAsync(async (req, res,next) => {
    const slug = req.params.slug;
    const updateData = req.body;
    const updateSubCategory = await 
    
    SubCategory.findOneAndUpdate({slug,isDeleted:false},updateData,{new:true,runValidators:true}).populate('category');
    if(!updateSubCategory){
        return next(new AppError(`subcategory not found with slug: ${slug}`,404))
    }
    res.status(200).json({ message: "subcategory updated", data: updateSubCategory });
})

exports.deleteSubCategory=async (req,res,next)=>{
    const slug=req.params.slug;
    const deleteSubCategory=await SubCategory.findOneAndUpdate({slug,isDeleted:false},{isDeleted:true,isActive:false},{new:true}).populate('category');
    if(!deleteSubCategory){
        // return res.status(404).json({message:'subcategory not found'});
        return next(new AppError(`subcategory not found with slug: ${slug}`,404))
    }
    res.status(200).json({message:'subcategory deleted',data:deleteSubCategory});
}

exports.addSubCategory=async (req,res,next)=>{
    const {name,slug,slugCategory}=req.body;
    const category=await Category.findOne({slug:slugCategory,isDeleted:false,isActive:true});
    // const parentCategory=await Category.findOne({_id:categoryId,isDeleted:false,isActive:true});
    if(!category){
        // return res.status(404).json({message:'category not found'});
        return next(new AppError(`category not found with slug: ${slugCategory}`,404))
    }
    const check=await SubCategory.findOne({slug});
    if(check){
        // return res.status(400).json({message:'slug already exists'});
        return next(new AppError(`slug already exists with slug: ${slug}`,400))
    }
    const mySubCategory=await SubCategory.create({name,slug,category:category._id});
    res.status(200).json({message:'subcategory created',data:mySubCategory});
}