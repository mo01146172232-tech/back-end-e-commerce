const express=require('express');
const router=express.Router();
const {addAddress,getUserAddresses,updateAddress,deleteAddress,setDefaultAddress}=require('../controllers/address.controller');
const {authenticate}=require('../middlewares/auth.middleware');



router.get('/', authenticate,getUserAddresses);
router.post('/', authenticate,addAddress);     
router.put('/:id', authenticate,updateAddress);
router.delete('/:id', authenticate,deleteAddress);
router.get('/default/:id', authenticate,setDefaultAddress);
module.exports=router;