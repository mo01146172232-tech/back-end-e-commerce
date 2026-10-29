const mongoose=require('mongoose');

async function connectDB(){
    try{
        const conn=await mongoose.connect(process.env.DATABASE_URL);
        console.log(`Database connected: ${conn.connection.host}`);
    }catch(err){
        comsole.log(err.message);
        process.exit(1);
    }
}

module.exports={connectDB};