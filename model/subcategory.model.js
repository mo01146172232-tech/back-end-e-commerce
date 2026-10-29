const mongoose=require('mongoose');

const subCategorySchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        minlegnth:3,
        maxlegnth:100
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category',
        required:true
    },
    slug:{
        type:String,
        required:true,
        unique:true
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    isActive:{
        type:Boolean,
        default:true
    }
    
},{
    timestamps:true
})

module.exports=mongoose.model('SubCategory',subCategorySchema);