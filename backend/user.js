import  mongoose  from "mongoose";

const userSchema = mongoose.Schema({
    user_name: String,
    user_mailid : String,
    password : String
})

export default mongoose.model('user', userSchema);