const mongoose=require('mongoose');

const categorySchema=new mongoose.Schema({
    gender:{
        type:String,
        enum:['male','female'],
        required:true
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    isActive:{
        type:Boolean,
        default:true
    },
    slug:{
        type:String,
        required:true,
        unique:true
    }
},{
    timestamps:true
})

module.exports=mongoose.model('Category',categorySchema);