const express=require('express');
const router=express.Router();
const {addUser,getUsers,getUser,updateUser,blockUser,deleteUser}=require('../controllers/user.controller');
const {authenticate}=require('../middlewares/auth.middleware');
const {authorize}=require('../middlewares/role.middleware')
const {upload}=require('../middlewares/upload.middleware');

router.get('/',getUsers);
router.get('/profile',authenticate,getUser);
router.post('/',addUser('user'))
router.post('/add-admin',authenticate,authorize('admin'),addUser('admin'))
router.put('/',authenticate,upload.single('img'),updateUser);
router.get('/block/:id', authenticate, authorize('admin'), blockUser);
router.delete('/',authenticate,deleteUser);

module.exports=router;