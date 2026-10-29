const Faq=require('../model/faq.model');
const catchAsync=require('../utilites/catchAsync.util')
const AppError=require('../utilites/appError.util')
exports.getFaqs=catchAsync(async(req,res,next)=>{
    const myFaqs=await Faq.find({isDeleted:false,isActive:true});
    res.status(200).json({message:'faq list',data:myFaqs});
})

exports.addFaq=catchAsync(async(req,res,next)=>{
    const {question,answer}=req.body;
    const myFaq=await Faq.create({question,answer});
    res.status(201).json({message:'faq created',data:myFaq});
})

exports.updateFaq=catchAsync(async(req,res,next)=>{
    const id=req.params.id;
    const {question,answer,isActive}=req.body;
    const myFaq=await Faq.findOneAndUpdate({_id:id,isDeleted:false},{question,answer,isActive},{new:true});
    if(!myFaq){
        // return res.status(404).json({message:'faq not found'});
        return next(new AppError(`faq not found with id: ${id}`,404))
    }
    res.status(200).json({message:'faq updated',data:myFaq});
})

exports.deleteFaq = catchAsync(async (req, res, next) => {
        const id  = req.params.id;

        const deletedFaq = await Faq.findOneAndUpdate({ _id: id, isDeleted: false },{ isDeleted: true, isActive: false },{ new: true });

        if (!deletedFaq) {
            // return res.status(404).json({ message: 'FAQ not found' });
            return next(new AppError(`FAQ not found with id: ${id}`, 404));
        }

        res.status(200).json({ message: 'FAQ deleted successfully' });
})