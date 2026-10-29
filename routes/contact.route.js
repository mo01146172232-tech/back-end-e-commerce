const express=require('express');
const router=express.Router();
const {sendContactMessage,getContacts,isReaded,deleteContact}=require('../controllers/contact.controller')
const {authenticate}=require('../middlewares/auth.middleware')
const {authorize}=require('../middlewares/role.middleware')

router.post('/',sendContactMessage)
router.get('/',authenticate,authorize('admin'),getContacts)
router.put('/:id',authenticate,authorize('admin'),isReaded)
router.delete('/:id',authenticate,authorize('admin'),deleteContact)

module.exports=router