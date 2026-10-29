const express=require('express')
const router=express.Router();
const {addCategory,getCategories,getCategoryBySlug,updateCategory,deleteCategory}=require('../controllers/category.controller');
const {authenticate}=require('../middlewares/auth.middleware');
const {authorize}=require('../middlewares/role.middleware')

router.get('/',getCategories);
router.get('/:slug',getCategoryBySlug);

router.post('/',authenticate,authorize('admin'),addCategory);
router.put('/:slug',authenticate,authorize('admin'),updateCategory);
router.delete('/:slug',authenticate,authorize('admin'),deleteCategory);

module.exports=router;