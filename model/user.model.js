const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        minlength:3,
        maxlength:50
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true,
        minlength:6
    },
    phone:{
        type:String,
        minlength:11,
        maxlength:11
    },
    imgURL:{
        type:String,
    },
    role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    isActive:{
        type:Boolean,
        default:true
    },
    addresses:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Address',
}]
},{
    timestamps:true
})

userSchema.pre('save',async function(){
    if(this.isModified('password')){
        this.password=await bcrypt.hash(this.password,10);
    }
})
userSchema.pre('findOneAndUpdate', async function () {
    const update = this.getUpdate();

    if (!update) return;

        if (update.password && update.password.length > 0) {
            update.password = await bcrypt.hash(update.password, 10);
        } 
        else if (update.$set && update.$set.password && update.$set.password.length > 0) {
            update.$set.password = await bcrypt.hash(update.$set.password, 10);
        }
        
    
});

userSchema.methods.isCorrectPassword=async function (inputPassword) {
    return await bcrypt.compare(inputPassword,this.password)
}

module.exports=mongoose.model('User',userSchema);