const mongoose = require('mongoose');


const connectDB = async(req,res) => {
    try{
        await mongoose.connect(process.env.MONGO_CONN)
        .then(() => {
            console.log('MongoDB Connected...');
        }).catch((err) => {
            console.log('MongoDB connection error:', err);
        })
    }catch(err){
        console.log('Error connecting to MongoDB:', err);
    }
}

module.exports = { connectDB };