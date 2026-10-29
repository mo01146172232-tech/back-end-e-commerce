const Contact=require('../model/contact.model')
const catchAsync=require('../utilites/catchAsync.util')
const AppError=require('../utilites/appError.util')


exports.sendContactMessage=catchAsync(async (req,res,next)=>{
    const {name,email,message}=req.body
    const myContact=await Contact.create({name,email,message})

    res.status(201).json({message:'Contact created successfully',data:myContact})
})

exports.getContacts=catchAsync(async (req,res,next)=>{
    const myContacts=await Contact.find({isDeleted:false})
    res.status(200).json({message:'Contacts retrieved successfully',data:myContacts})

})

exports.isReaded=catchAsync(async (req,res,next)=>{
    const id=req.params.id
    const myContact=await Contact.findOneAndUpdate({_id:id,isDeleted:false},{isReaded:true},{new:true})
    if(!myContact){
        // return res.status(404).json({message:'Contact not found'});
        return next(new AppError(`Contact not found with id: ${id}`,404))
    }
    res.status(200).json({message:'Contact marked as read successfully',data:myContact})
})

exports.deleteContact=catchAsync(async (req,res,next)=>{
    const id=req.params.id
    const myContact=await Contact.findOneAndUpdate({_id:id,isDeleted:false},{isDeleted:true},{new:true})
    if(!myContact){
        // return res.status(404).json({message:'Contact not found'});
        return next(new AppError(`Contact not found with id: ${id}`,404))
    }
    res.status(200).json({message:'Contact deleted successfully',data:myContact})
})