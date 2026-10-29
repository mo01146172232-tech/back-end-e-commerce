const User=require('../model/user.model');
const jwt=require('jsonwebtoken');
const catchAsync=require('../utilites/catchAsync.util')
const AppError=require('../utilites/appError.util')
const logger=require('../utilites/logger.util')

const signinToken=(myUser)=>{
    const {_id,role,name}=myUser;
    return jwt.sign({_id,role,name},
        process.env.SECRET_KEY,
        {expiresIn:process.env.JWT_EXPIRIES_IN}
    )
}

exports.login=catchAsync(async(req,res,next)=>{
    const {email,password}=req.body;
    const myUser=await User.findOne({email,isActive:true,isDeleted:false});
    if(!myUser){
        // return res.status(401).json({error:'unauthorized invalid email or password'})
        logger.warn(`Failed login attempt for non-existent email: ${email}`);
        return next(new AppError('unauthorized invalid email or password',401))
    }
    if(await myUser.isCorrectPassword(password)){
        const token= signinToken(myUser);

        logger.info(`User ${myUser._id} (${email}) logged in successfully.`);
        return res.status(200).json({message:'you logedin',data:token});
    }

    logger.warn(`Failed login attempt (wrong password): ${email}`);
    res.status(401).json({error:'unauthorized invalid email or password'});
})