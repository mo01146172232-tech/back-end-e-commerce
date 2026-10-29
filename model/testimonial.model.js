const mongoose=require('mongoose');

const testimonialSchema= new mongoose.Schema({
    text:{
        type:String,
        required:true,
        minlength:10,
        maxlength:500,
        trim:true
    },
    stars:{
        type:Number,
        required:true,
        min:1,
        max:5,
        default:5
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    testStatus:{
        type:String,
        enum:['approved','pending','declined'],
        default:'pending'
    },
    isDeleted:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
})

module.exports=mongoose.model('Testimonial',testimonialSchema);