const mongoose=require('mongoose');

const contactSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        minlength:3,
        maxlength:100
    },
    email:{
        type:String,
        unique:true,
        required:true,
        tirm:true
    },
    message:{
        type:String,
        required:true,
        minlength:10,
        maxlength:1000,
        trim:true
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    isReaded:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
})

module.exports=mongoose.model('Contact',contactSchema);