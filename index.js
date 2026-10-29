const dotenv=require('dotenv');
dotenv.config();
const AppError=require('./utilites/appError.util');
const express=require('express');
const app=express();
const port=process.env.PORT;
const dbconfig=require('./config/db.config')
const path=require('path');

const corsMiddleware = require('./middlewares/cors.middleware');

app.use(corsMiddleware);
dbconfig.connectDB();
app.use(express.json());

app.use('/files',express.static(path.join(__dirname,'uploads')));

app.use('/api/v1/user',require('./routes/user.route'));
app.use('/api/v1/auth',require('./routes/auth.route'));
app.use('/api/v1/category',require('./routes/category.route'));
app.use('/api/v1/subcategory',require('./routes/subcategory.route'));
app.use('/api/v1/products',require('./routes/product.route'));
app.use('/api/v1/addresses',require('./routes/address.route'));
app.use('/api/v1/testimonials',require('./routes/testimonial.route'));
app.use('/api/v1/contact',require('./routes/contact.route'));
app.use('/api/v1/about',require('./routes/about.route'));
app.use('/api/v1/policy',require('./routes/policy.route'));
app.use('/api/v1/faq',require('./routes/faq.route'));
app.use('/api/v1/cart',require('./routes/cart.route'));
app.use('/api/v1/orders',require('./routes/order.route'));

app.use((req,res,next)=>{
    next(new AppError(`Can't find route for "${req.originalUrl}"`,404))
})
app.use(require('./middlewares/errorHandler.middleware'))

app.listen(port,_=>console.log(`server started at ${port}`));