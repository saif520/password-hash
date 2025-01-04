const express=require('express');
const cors=require('cors');
require('dotenv').config();
const mongoose=require('mongoose');
const authRoutes=require('./routes/authRoutes');

const app=express();

const PORT=process.env.PORT||3000
const DB_URL=process.env.DB_URL;


app.use(cors());
app.use(express.json());
app.use('/api',authRoutes);

mongoose.connect(DB_URL).then((result)=>{
    console.log('database connected successfully!');
}).catch(err=>{
    console.log(err);
})

app.get('/',(req,res)=>{
    res.send("Hello World");
})

app.listen(PORT,()=>{
    console.log(`Server Running at http://localhost:${PORT}`)
})