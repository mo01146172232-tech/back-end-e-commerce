const Testimonial =require('../model/testimonial.model')
const catchAsync=require('../utilites/catchAsync.util')
const AppError=require('../utilites/appError.util')

exports.addTestimonial=catchAsync(async (req,res,next)=>{
    const {text,stars}=req.body;
    const userId=req.user._id;
    const myTestimonial=await Testimonial.create({text,stars,user:userId});

    res.status(201).json({message:'testimonial created',data:myTestimonial});
})

exports.getTestimonials=catchAsync(async (req,res,next)=>{
    const myTestimonial=await Testimonial.find({isDeleted:false}).populate('user','name imgURL email').sort({createdAt:-1});

    res.status(200).json({message:'testimonials list',data:myTestimonial});
})

exports.getApprovedTestimonials=catchAsync(async (req,res,next)=>{
    const myTestimonial=await Testimonial.find({isDeleted:false,testStatus:'approved'}).populate('user','name imgURL email');

    res.status(200).json({message:'approved testimonials list',data:myTestimonial});
})

exports.updateTestimonialStatus=catchAsync(async (req,res,next)=>{
    const id=req.params.id;
    const {testStatus}=req.body;
    const myTestimonial=await Testimonial.findByIdAndUpdate(id,{testStatus},{new:true}).populate('user','name email');
    if(!myTestimonial){
        // return res.status(404).json({message:'testimonial not found'});
        return next(new AppError(`testimonial not found with id: ${id}`,404))
    }
    res.status(200).json({message:'testimonial status updated',data:myTestimonial});
})

exports.deleteTestimonial=catchAsync(async (req,res,next)=>{
    const id=req.params.id;
    const myTestimonial=await Testimonial.findByIdAndUpdate(id,{isDeleted:true},{new:true}).populate('user','name email');
    if(!myTestimonial){
        // return res.status(404).json({message:'testimonial not found'});
        return next(new AppError(`testimonial not found with id: ${id}`,404))
    }
    res.status(200).json({message:'testimonial deleted',data:myTestimonial});
})