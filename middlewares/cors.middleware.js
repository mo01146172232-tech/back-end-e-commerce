const cors =require('cors');
const allowedOrigins=process.env.ALLOWED_ORIGINS?.split(',');

const corsOptions={
    origin:function(origin,cb){
        if(!origin) return cb(null,true);
        if(allowedOrigins.includes(origin)) return cb(null,true);
        return cb(new Error('Cors policy: Origin not allowed'))
    },
    credentials:true,
    methods:['GET','POST','PUT','DELETE'],
    allowedHeaders:['Content-Type','Authorization']
}

module.exports=cors(corsOptions);