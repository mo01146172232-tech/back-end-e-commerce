const mongoose=require('mongoose');

const policySchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
        minlength:10,
        maxlength:100,
        trim:true
    },
    content:{
        type:String,
        required:true,
        minlength:10,
        maxlength:1000,
        trim:true
    },
    type: {
        type: String,
        required: true,
        unique: true,
        enum: ['privacy-policy', 'terms-and-conditions', 'return-policy', 'shipping-policy'], 
        trim: true
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

module.exports=mongoose.model('Policy',policySchema);