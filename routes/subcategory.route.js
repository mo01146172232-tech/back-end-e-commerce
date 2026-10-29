const express=require('express');
const router=express.Router();
const {addSubCategory,getSubCategory,getSubCategoryBySlug,updateSubCategory,deleteSubCategory}=require('../controllers/subcategory.controller');
const {authenticate}=require('../middlewares/auth.middleware');
const {authorize}=require('../middlewares/role.middleware')


router.get('/',getSubCategory);
router.get('/:slug',getSubCategoryBySlug);
router.post('/',authenticate,authorize('admin'),addSubCategory);
router.put('/:slug',authenticate,authorize('admin'),updateSubCategory);
router.delete('/:slug',authenticate,authorize('admin'),deleteSubCategory);


module.exports=router;