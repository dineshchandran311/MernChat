//import
import  express from "express";
import mongoose from 'mongoose';
import Messages from "./dbMessages.js";
// import Pusher from "pusher";
import Cors from 'cors';
import Users from './user.js';
import bcrypt from 'bcryptjs';

//app config
const app = express();
const port = process.env.PORT || 9000;
const connection_url = "mongodb+srv://admin:9iyl6ce7sSfUdBAU@cluster0.n5rfs.mongodb.net/whatsappdb?retryWrites=true&w=majority";

// const pusher = new Pusher({
//     appId: "1315822",
//     key: "92097ee7168e575c5784",
//     secret: "648553629d287a43a5f2",
//     cluster: "ap2",
//     useTLS: true
//   });



//middleware
app.use(express.json());

app.use(Cors());


//databaseconfig

mongoose.connect(connection_url, {
    useNewUrlParser:true,
    useUnifiedTopology: true 
});

// var userMail = '';
// var roomName = '';
// var userName = '';

// var roomName = "bois";
// var mailId = "cd311@gmail.com";

// const db = mongoose.connection;

// db.once('open', () => {
//     console.log('DB is connected');

//     const msgCollection = db.collection("messagecontents");
//     const changeStream = msgCollection.watch();

//     changeStream.on('change', (change) =>{
//         console.log("A change occurred",change);

//         if(change.operationType === 'insert'){
//             const messageDetails = change.fullDocument;
//             pusher.trigger('messages', 'inserted', {
//                 name: messageDetails.name,
//                 message: messageDetails.message,
//                 timestamp: messageDetails.timestamp,
//                 received: messageDetails.received
//             });
//         }

//     });
// });


//api route
app.get('/', (req,res) => res.status(200).send('Hello world'));

app.post('/deleteuser', (req,res)=>{

    Messages.updateOne({_id:req.body._id},{$pull:{'users_mailid':req.body.users_mailid}} ,(err,data)=>{
        if(err){
            res.status(500).send();
        }
        else{
            // console.log(data);
            res.status(200).send("Deleted Successfully!");
        }
    })

})

app.post('/adduser', (req,res)=> {

    Users.findOne({user_mailid:req.body.user_mailid}, (err,data)=>{
        if(err){
            res.status(500).send(err);
        }
        else if(data!=null)
        {
            // console.log(data);
            Messages.find({_id: req.body._id, users_mailid: {$in: [req.body.user_mailid]}},(err,data) => {
                if(err){
                    res.status(500).send(err);
                }
                else if(data.length==0 || data==null || data==[]){
                    Messages.update({_id: req.body._id},{$push:{users_mailid:req.body.user_mailid}}, (err,data)=>{
                        if(err){
                            res.status(500).send(err.message);
                        }
                        else{
                            res.status(201).send(data);
                        }
                    })
                }
                else{
                    console.log(data);
                    res.status(200).send("User already there!");
                }
            })
        }
        else{
            res.status(200).send("User Not found");
        }
    })

})


app.post('/signup', async(req,res)=>{

    try{
        const hashcode = await bcrypt.hash(req.body.password, 10);
        const user = { user_name : req.body.user_name, user_mailid: req.body.user_mailid, password: hashcode}
        // console.log(user);
        Users.create(user, (err,data) =>{
            if(err){
                res.status(500).send(err);
            }
            else{
                res.status(201).send("Created");
            }
        })
    }
    catch{
        // console.log("err");
        res.status(500).send();
    }
})


app.post('/login', (req,res) =>{
    Users.findOne({user_mailid:req.body.user_mailid}, async(err,data)=>{
        if(err){
            res.status(500).send(err);
        }
        else if(!data){
            res.status(200).send("User not found");
        }
        else if(data.length!=0){
            if(await bcrypt.compare(req.body.password, data.password)){
                var send = "logged in " + data.user_name;
                res.status(200).send(send);
            }
            else{
                res.status(200).send("Wrong password");
            }
        }
        else{
            res.status(500).send(err);
        }
    })

})


app.post('/messages/new', (req,res)=>{
    const roomName = req.body.room_name;
    Messages.update({room_name: roomName},{$push:{chat:req.body}}, (err,data)=>{
        if(err){
            res.status(404).send(err.message);
        }
        else{
            res.status(201).send(data);
        }
    })
    // Messages.find({room_name: roomName}, (err,data)=>{
    //     if(data.length!=0){
    //         Messages.update({room_name: roomName},{$push:{"room_name.chat":req.body}})
    //         console.log(req.body);
    //         res.status(201).send("successfully added");
    //     }
    //     else{
    //         res.status(404).send(err.message);
    //     }
    // })
    //res.status(201).send("successfully added");
    
})

app.post('/messages/new/room', (req,res) =>{
    const roomName = req.body.room_name;
    Messages.find({room_name:roomName}, (err,data)=>{
        if(data){
            Messages.create(req.body, (err, data)=>{
                if(err){
                    res.status(500).send(err.message);
                }
                else{
                    res.status(201).send(data);
                }
            })
        }
        else{
            const value = data + "It's already present";
            res.status(200).send(value);
        }
    })
})


app.post('/messages/sync', (req,res)=>{
    // console.log(req.body.users_mailid);
    Messages.find({users_mailid: {$in: [req.body.users_mailid]}},(err,data) => {
        if(err){
            res.status(500).send(err);
        }
        else{
            // console.log(data);
            res.status(200).send(data);
        }
    })
    
})

app.post('/messages/sync/room', (req,res)=>{
    // console.log(req.body._id);
    Messages.find({_id: req.body._id},(err,data) => {
        if(err){
            res.status(500).send(err);
        }
        else{
            // console.log(data);
            res.status(200).send(data);
        }
    })
    
})

//listener
app.listen( port, () => console.log(`Listening on localhost:${port}`));