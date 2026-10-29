const express = require("express");
const router = express.Router();
const {createOrder,updateIsReaded,updateOrderStatus,getUserOrders,getAllOrders}=require('../controllers/order.controller')
const {authenticate}=require('../middlewares/auth.middleware')
const {authorize}=require('../middlewares/role.middleware')

router.use(authenticate)

router.post('/',createOrder)
router.get('/my-orders',getUserOrders)

router.get('/',authorize('admin'),getAllOrders)
router.put('/is-readed/:id',authorize('admin'),updateIsReaded)
router.put('/status/:id',authorize('admin'),updateOrderStatus)

module.exports=router;
