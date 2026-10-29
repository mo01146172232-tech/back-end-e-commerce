const mongoose=require('mongoose');

const addressSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true,
        minlength:3,
        maxlength:100
    },
    address:{
        type:String,
        required:true,
        trim:true,
        minlength:3,
        maxlength:100
    },
    isDefault:{
        type:Boolean,
        default:false
    },
    isDeleted:{
        type:Boolean,
        default:false
    }
},{timestamps:true})


module.exports=mongoose.model('Address',addressSchema);