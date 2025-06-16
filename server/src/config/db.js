import {connect} from "mongoose";

const connectDB = async(url) => {
    try{
        await connect(url);
        console.log("Database connected successfully");
        
    }catch(err) {
        console.log(err);
    }
}

export default connectDB;