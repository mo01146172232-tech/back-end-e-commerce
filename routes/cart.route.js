const express=require('express');
const router=express.Router();
const {addItemToCart,getCart,clearCart,removeItemFromCart,updateQuantity,acceptPriceChange,syncCart}=require('../controllers/cart.controller');
const {authenticate}=require('../middlewares/auth.middleware')

router.use(authenticate);

router.post('/',addItemToCart)
router.get('/',getCart)
router.delete('/:id',removeItemFromCart)
router.delete('/',clearCart)
router.put('/update-quantity', updateQuantity);
router.put('/accept-price', acceptPriceChange);
router.post('/sync', syncCart)

module.exports=router