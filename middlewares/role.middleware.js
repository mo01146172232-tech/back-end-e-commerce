exports.authorize=(...allowedRoles)=>{
    return async(req,res,next)=>{
        if(!allowedRoles.includes(req.user.role)){
            return res.status(401).json({error:'Access denied'});
        }
        next();
    }
}