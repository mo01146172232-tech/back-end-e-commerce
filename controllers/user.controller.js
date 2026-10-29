const User = require("../model/user.model");
const catchAsync=require('../utilites/catchAsync.util')
const AppError=require('../utilites/appError.util')
const logger=require('../utilites/logger.util')
exports.addUser = (role) => {
  return catchAsync(async (req,res,next) => {
    const { name, email, password ,phone} = req.body;

    const myUser = await User.create({
      name,
      email,
      password,
      phone
    });
    
    res.status(200).json({ message: "user created", data: myUser });
  });
};

exports.getUsers = catchAsync(async (req,res,next) => {
  const myUser = await User.find({ isDeleted: false, isActive: true })
    .select("-password")
    .populate("addresses");
  res.status(200).json({ message: "list of all users", data: myUser });
});
exports.getUser = catchAsync(async (req, res,next) => {
  const id = req.user._id;
  const myUser = await User.findOne({_id:id,isDeleted:false,isActive:true})
    .select("-password")
    .populate("addresses");
  if (!myUser) {
    // return res.status(404).json({ message: "user not found" });
    return next(new AppError(`user not found with id: ${id}`,404))
  }
  res.status(200).json({ message: `get user`, data: myUser });
});

exports.deleteUser=catchAsync(async (req,res,next)=>{
    const id=req.user._id;
    const myUser=await User.findByIdAndUpdate(id,{isDeleted:true},{new:true}).select('-password').populate('addresses');
    if(!myUser){
        // return res.status(404).json({message:'user not found'});
        return next(new AppError(`user not found with id: ${id}`,404))
    }

    logger.info(`User ${id} account was deleted`);
    res.status(200).json({message:'user deleted',data:myUser})
})

exports.updateUser = catchAsync(async (req, res,next) => {
  const id = req.user._id;
  const {name,password,phone,email}=req.body;

  const myUser = await User.findById(id);
  if (!myUser) {
    // return res.status(404).json({ message: "user not found" });
    return next(new AppError(`user not found with id: ${id}`,404))
    
  }
  if(name) myUser.name=name
  if(password) myUser.password=password
  if(email) myUser.email=email
  if(phone) myUser.phone=phone
  if(req.file) myUser.imgURL=req.file.filename
  await myUser.save();
  res.status(200).json({ message: "user updated", data: myUser });
});

exports.blockUser = catchAsync(async (req, res,next) => {
  const id = req.params.id;
  const myUser = await User.findByIdAndUpdate(id, { isActive: false }, { new: true });
  if (!myUser) {
    // res.status(404).json({ message: "user not found" });
    return next(new AppError(`user not found with id: ${id}`,404))
  }
  logger.warn(`Admin ${req.user._id} blocked user: ${id}`);
  res.status(200).json({ message: "user blocked", data: myUser });
});