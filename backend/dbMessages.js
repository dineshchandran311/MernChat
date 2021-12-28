import  mongoose  from "mongoose";

const detailsSchema = mongoose.Schema({
    room_name: String,
    user: String,
    user_mail: String,
    message: String,
    timestamp: String,
})

const whatsappSchema = mongoose.Schema({
    room_name: String,
    chat: [ detailsSchema ],
    users_mailid: [String]
})
// "room_name":"chit-chats"
export default mongoose.model('messagecontent', whatsappSchema);