const express=require('express');
const router=express.Router();
const {addTestimonial,getTestimonials,getApprovedTestimonials,updateTestimonialStatus,deleteTestimonial}=require('../controllers/testimonial.controller');
const {authenticate}=require('../middlewares/auth.middleware');
const {authorize}=require('../middlewares/role.middleware')

router.get('/',getApprovedTestimonials);
router.post('/',authenticate,addTestimonial);
router.get('/all',authenticate,authorize('admin'),getTestimonials);
router.put('/status/:id',authenticate,authorize('admin'),updateTestimonialStatus);
router.delete('/:id',authenticate,authorize('admin'),deleteTestimonial);

module.exports=router;