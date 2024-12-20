const  mongoose  = require("mongoose");

const connectDB = async() => {
        try {
           mongoose.set("strictQuery", false);
            await mongoose.connect(process.env.mongoURL);
            console.log('mongodb connection SUCCESS');
        } catch (error) {
            console.log('mongodb connection FAIL');
            console.log(error);
            process.exit(1);
        }
   
   }
   
module.exports = connectDB;
