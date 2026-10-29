const express=require('express');
const router=express.Router();
const {getFaqs,addFaq,updateFaq,deleteFaq}=require('../controllers/faq.controller');
const {authenticate}=require('../middlewares/auth.middleware');
const {authorize}=require('../middlewares/role.middleware')

router.get('/',getFaqs);

router.post('/',authenticate,authorize('admin'),addFaq);
router.put('/:id',authenticate,authorize('admin'),updateFaq);
router.delete('/:id',authenticate,authorize('admin'),deleteFaq);

module.exports=router;