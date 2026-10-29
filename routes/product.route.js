const express=require('express');
const router=express.Router();
const {addProduct,getProducts,getProductBySlug,getRelatedProducts,updateProduct,deleteProduct,filterProduct,searchProducts}=require('../controllers/product.controller');
const {authenticate}=require('../middlewares/auth.middleware');
const {authorize}=require('../middlewares/role.middleware')
const {upload}=require('../middlewares/upload.middleware');
const paginate=require('../middlewares/paginate.middleware')
const productModel=require('../model/product.model');


router.get('/',paginate(productModel),getProducts);
router.get('/filter',filterProduct);
router.get('/search',searchProducts);
router.get('/related/:slug',getRelatedProducts);
router.get('/:slug',getProductBySlug);

router.post('/',authenticate,authorize('admin'),upload.single('img'),addProduct);
router.put('/:slug',authenticate,authorize('admin'),upload.single('img'),updateProduct);
router.delete('/:slug',authenticate,authorize('admin'),deleteProduct);

module.exports=router;