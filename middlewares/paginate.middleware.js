module.exports=(Model)=> async(req,res)=>{
    const page=req.query.page || 1;
    const limit=req.query.limit || 3;
    const skip=(page-1)*limit;
    const sortBy=req.query.sortBy || 'createdAt';
    const order=req.query.order || 'desc' ? -1 : 1;

    const [results,total]=await Promise.all([
        Model.find().sort({[sortBy]:order}).skip(skip).limit(limit),
        Model.countDocuments()
    ])
    res.status(200).json({message:`Pagination for ${Model.modelName}`,page,limit,totalPages:Math.ceil(total/limit),totalResalts:total,data:results})
}