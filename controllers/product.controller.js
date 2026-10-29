const Product=require('../model/product.model');
const Category=require('../model/category.model');
const SubCategory=require('../model/subcategory.model');
const catchAsync=require('../utilites/catchAsync.util')
const AppError=require('../utilites/appError.util')
const logger=require('../utilites/logger.util')

exports.getProducts=catchAsync(async(req,res,next)=>{

    const { category, subCategory, season, isActive } = req.query;
    
    let query = Product.find({ isDeleted: false }); 

    if (category) {
        query = query.where('category').equals(category);
    }
    if (subCategory) {
        query = query.where('subCategory').equals(subCategory);
    }
    if (season) {
        query = query.where('season').equals(season);
    }
    if (isActive !== undefined) {
        query = query.where('isActive').equals(isActive);
    }

    const myProducts = await query.populate('category subCategory');    
    res.status(200).json({message:'products list',data:myProducts});
})
exports.getProductBySlug=catchAsync(async(req,res,next)=>{
    const slug=req.params.slug;
    const myProduct=await Product.findOne({slug,isDeleted:false,isActive:true}).populate('category subCategory');
    if(myProduct){
        res.status(200).json({message:`get product by slug: ${slug}`,data:myProduct});
    }
    else{
        // res.status(404).json({error:`can't find product with slug:${slug}`})
        return next(new AppError(`can't find product with slug:${slug}`,404))
    }
})

exports.getRelatedProducts=catchAsync(async(req,res,next)=>{
    const slug=req.params.slug;
    const myProduct=await Product.find({slug:{$ne:slug},isDeleted:false,isActive:true});
    if(myProduct){
        res.status(200).json({message:`get related products`,data:myProduct});
    }
    else{
        // res.status(404).json({error:`can't find product with slug:${slug}`})
        return next(new AppError(`can't find product with slug:${slug}`,404))
    }
})
exports.addProduct=catchAsync(async(req,res,next)=>{
    const {name,desc,price,slug,stock,slugCategory,slugSubCategory,season}=req.body;
    const category=await Category.findOne({slug:slugCategory,isDeleted:false,isActive:true});
    const subCategory=await SubCategory.findOne({slug:slugSubCategory,isDeleted:false,isActive:true});
    if(!category){
        // return res.status(404).json({message:'category not found'});
        return next(new AppError(`category not found with slug: ${slugCategory}`,404))
    }
    if(!subCategory){
        // return res.status(404).json({message:'subcategory not found'});
        return next(new AppError(`subcategory not found with slug: ${slugSubCategory}`,404))
    }
    const check=await Product.findOne({slug});
    if(check){
        // return res.status(400).json({message:'slug already exists'});
        return next(new AppError(`slug already exists with slug: ${slug}`,400))
    }
    if (!req.file) {
    return next(new AppError('Product image is required', 400));
    }
    const imgURL=req.file.filename;
    const myProduct=await Product.create({name,desc,price,slug,imgURL,stock,category:category._id,subCategory:subCategory._id,
    season
    });
    logger.info(`Admin User ${req.user._id} created a new product: ${myProduct.name} (${myProduct._id})`);
    res.status(200).json({message:'product created',data:myProduct});
})

exports.updateProduct=catchAsync(async(req,res,next)=>{
    const slug=req.params.slug;
    const {name,desc,price,slugCategory,stock,slugSubCategory,season,isActive}=req.body;
    const check=await Product.findOne({slug,isDeleted:false});
    if(!check){
        // return res.status(400).json({message:'product not found'});
        return next(new AppError(`product not found with slug: ${slug}`,404))
    }

    if(slugCategory){
        const category=await Category.findOne({slug:slugCategory,isDeleted:false,isActive:true});

        if(!category){
            // return res.status(404).json({message:'category not found'});
            return next(new AppError(`category not found with slug: ${slugCategory}`,404))
        }
        check.category=category._id;
    }
    if(slugSubCategory){
        const subCategory=await SubCategory.findOne({slug:slugSubCategory,isDeleted:false,isActive:true});
        
        if(!subCategory){
            // return res.status(404).json({message:'subcategory not found'});
            return next(new AppError(`subcategory not found with slug: ${slugSubCategory}`,404))
        }
        check.subCategory=subCategory._id;
    }
    let imgURL=check.imgURL;
    if(req.file){
        imgURL=req.file.filename;
    }
    const myProduct=await Product.findOneAndUpdate({slug,isDeleted:false},{name,desc,price,stock,imgURL,category:check.category,subCategory:check.subCategory,
    season,isActive
    },{new:true}).populate('category subCategory');
    if(!myProduct){
        // return res.status(404).json({message:'product not found'});
        return next(new AppError(`product not found with slug: ${slug}`,404))
    }

    logger.info(`Admin User ${req.user._id} updated product: ${slug}`);
    res.status(200).json({message:'product updated',data:myProduct});
})

exports.deleteProduct=catchAsync(async(req,res,next)=>{
    const slug=req.params.slug;
    const myProduct=await Product.findOneAndUpdate({slug,isDeleted:false},{isDeleted:true,isActive:false},{new:true}).populate('category subCategory');
    if(!myProduct){
        // return res.status(404).json({message:'product not found'});
        return next(new AppError(`product not found with slug: ${slug}`,404))
    }
    logger.info(`Admin User ${req.user._id} deleted product: ${slug}`);
    res.status(200).json({message:'product deleted',data:myProduct});
})

exports.filterProduct = catchAsync(async (req, res, next) => {
    const { category, subCategory, season, isActive } = req.query;
    
    let query = Product.find({ isDeleted: false }); 

    if (category) {
        query = query.where('category').equals(category);
    }
    if (subCategory) {
        query = query.where('subCategory').equals(subCategory);
    }
    if (season) {
        query = query.where('season').equals(season);
    }
    if (isActive !== undefined) {
        query = query.where('isActive').equals(isActive);
    }

    const myProducts = await query.populate('category subCategory');
    
    res.status(200).json({ message: 'products list', data: myProducts });
});
exports.searchProducts = catchAsync(async (req, res, next) => {
    const { keyword } = req.query;

    if (!keyword) {
        return res.status(200).json({ 
            message: 'No keyword provided', 
            data: [] 
        });
    }

    const allProducts = await Product.find({ isActive: true, isDeleted: false });

    const searchKeyword = keyword.toLowerCase();
    
    const filteredProducts = allProducts.filter(product => {
        const nameMatch = product.name?.toLowerCase().includes(searchKeyword);
        return nameMatch;
    });

    res.status(200).json({
        message: 'Search results',
        data: filteredProducts
    });
});