const express=require('express');
const router=express.Router();
const {getPolicy,getPolicyByType,addPolicy,updatePolicy,deletePolicy}=require('../controllers/policy.controller');
const {authenticate}=require('../middlewares/auth.middleware');
const {authorize}=require('../middlewares/role.middleware')

router.get('/',getPolicy);
router.get('/:type',getPolicyByType);

router.post('/',authenticate,authorize('admin'),addPolicy);
router.put('/:type',authenticate,authorize('admin'),updatePolicy);
router.delete('/:type',authenticate,authorize('admin'),deletePolicy);

module.exports=router;