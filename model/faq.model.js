const mongoose=require('mongoose')

const faqSchema=new mongoose.Schema({
    question:{
        type:String,
        minlength:10,
        maxlength:100,
        required:true
    },
    answer:{
        type:String,
        minlength:10,
        maxlength:1000,
        required:true
    },
    isActive:{
        type:Boolean,
        default:true
    },
    isDeleted:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
})

module.exports=mongoose.model('Faq',faqSchema)