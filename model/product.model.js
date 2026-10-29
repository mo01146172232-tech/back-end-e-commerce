const mongoose=require('mongoose');

const productSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        minLength:3,
        maxLength:100

        
    },
    desc:{
        type:String,
        maxlength:1000,
        minlength:10,
        required:true
    },
    price:{
        type:Number,
        min:0,
        required:true
    },
    slug:{
        type:String,
        required:true,
        unique:true
    },
    imgURL:{
        type:String,
    },
    stock:{
        type:Number,
        default:1,
        min:0
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category',
    },
    subCategory:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'SubCategory',
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    isActive:{
        type:Boolean,
        default:true
    },
    season:{
        type:String,
        enum:['summer','winter','spring','autumn'],
        default:'summer'
    }
    
},{
    timestamps:true
})

module.exports=mongoose.model('Product',productSchema);