const express=require('express');
const router=express.Router();
const {addAndUpdateAbout,getAbout}=require('../controllers/about.controller');
const {authenticate}=require('../middlewares/auth.middleware');
const {authorize}=require('../middlewares/role.middleware')

router.get('/',getAbout);
router.post('/',authenticate,authorize('admin'),addAndUpdateAbout);

module.exports=router;