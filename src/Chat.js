import { AttachFile, InsertEmoticon, Mic, MoreVert, SearchOutlined } from '@mui/icons-material';
import { Avatar, IconButton } from '@mui/material';
import { Button, TextField } from '@mui/material';
import React, { useState, useEffect } from 'react';
import './Chat.css';
import axios from './axios';
import { useParams } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { useRef } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Modal from '@mui/material/Modal';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import DeleteIcon from '@mui/icons-material/Delete';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover'
import Picker, { SKIN_TONE_MEDIUM_DARK } from 'emoji-picker-react';


function Chat() {

    const [ input, setInput ] = useState('');
    const [ messages, setMessages ] = useState([]);
    const { roomid } = useParams();
    const { currentUser } = useAuth();
    const { currentUserPassword } = useAuth();
    const { currentUserName } = useAuth();
    const [ loading , setLoading ] = useState(false);
    const [ modal, setModal] = useState(false); 
    const [ removeModal, setRemoveModal] = useState(false); 
    const [ user, setUser ] = useState('');
    const [ notFound, setNotFound ] = useState('');
    const [ added, setAdded ] = useState('');
    const [ already, setAlready ] = useState('');
    const [ deleteM, setDelete ] = useState(false);
    const [ members, setMembers ] = useState([]); 
    const messageEl = useRef(null);

    let nameInput = null;
    

    const openModal = () => { setModal(true); }
    const openRemoveModal = () => { setRemoveModal(true); }
    const closeModal = () => { setModal(false); }
    const closeRemoveModal = () => { setRemoveModal(false); }


    const onEmojiClick = (event, emojiObject) => {
        event.preventDefault();
        setInput(input + emojiObject.emoji);
        nameInput.focus();
    };

    const Example = () => (
        <OverlayTrigger trigger="click" placement="top-start" overlay={popover}>
            <IconButton>
                <InsertEmoticon/>
            </IconButton>
        </OverlayTrigger>
    );

    const popover = (
        <Popover id="popover-basic">
            <Popover.Body>
                <Picker onEmojiClick={onEmojiClick} skinTone={SKIN_TONE_MEDIUM_DARK} />
            </Popover.Body>
        </Popover>
    );

    const deleteUser = (user, id)=>{
        closeRemoveModal();
        axios.post("/deleteuser",{
            _id: id,
            users_mailid: user
        })
        .then(data => {
            var m = [...members];
            var index = m.find(x => x===user);
            m = m.splice(index,1);
            setMembers(m);
            setDelete(true);
        })
        .catch( err => console.log(err))
    }

    const addUser = async() =>{
        setModal(false);
        await axios.post('/adduser',{
            _id: roomid,
            user_mailid: user
        })
        .then( data => {
            setUser('');
            if(data.data === "User Not found")
            {
                setNotFound(true);
            }
            else if(data.data == "User already there!"){
                setAlready(true);
            }
            else{
                setMembers([...members,user]);
                setAdded(true);
            }
        })
        .catch(e => console.log(e))
    }
 
    //pop up
    const handleDelete = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setDelete(false);
    };

    const handleNotFound = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setNotFound(false);
    };

    const handleAlready = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setAlready(false);
    };

    const handleAdded = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setAdded(false);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setLoading(false);
    };

    const Alert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });
   
    //scroll bottom
    const scrollToBottom = () => {
        messageEl.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(() => {
        scrollToBottom();
    }, [messages, roomid])


    // useEffect( () =>{
    //     const timer = setInterval(() => { 
    //         if(currentUser){
    //             axios.post('/login',{
    //                 user_mailid : currentUser,
    //                 password : currentUserPassword
    //             })
    //             .then( (res) => {
    //                 if(res.data === "logged in"){
    //                     axios.post('/messages/sync/room',{
    //                         _id: roomid
    //                     })
    //                     .then( response =>{
    //                         console.log(response.data);
    //                         setMessages(response.data);
    //                     })
    //                     .catch( e => console.log(e))
    //                 }
                   
    //             })
    //             .catch( e =>{
    //                 console.log(e);
    //             })
    //         }
    //       },500);
    //       return () => {
    //         clearInterval(timer);
    //       }
    // },[])

    useEffect(async() => {
        setLoading(true);
        if(currentUser){
            await axios.post('/login',{
                user_mailid : currentUser,
                password : currentUserPassword
            })
            .then( async(res) => {
                if(res.data.includes("logged in")){
                    await axios.post('/messages/sync/room',{
                        _id: roomid
                    })
                    .then( response =>{
                        setMembers(response.data[0].users_mailid);
                        setMessages(response.data);
                    })
                    .catch( e => console.log(e))
                }
               
            })
            .catch( e =>{
                console.log(e);
            })
        }
        setLoading(false);
    }, [roomid]);


    const sendMessage = async(e) =>{
        e.preventDefault();
        const value = input;
        var mess = messages;
        var useMess = {
            room_name : messages[0].room_name,
            user: currentUserName,
            user_mail: currentUser,
            message: value,
            timestamp: new Date().toISOString()
        }
        mess[0].chat.push(useMess);
        setMessages(mess);
        setInput('');
        await axios.post('/messages/new', {
            room_name : messages[0].room_name,
            user: currentUserName,
            user_mail: currentUser,
            message: value,
            timestamp: new Date().toISOString()
        })
        .then( data => {})
        .catch( e => console.log(e));
    }
    // console.log(messages);

    if(messages[0]?._id===roomid)
    {
        return (
            <div className='chat'>
                <div className='chat__header'>
                    <div className='chat__avatar'>
                        <Avatar/>
                    </div>
                    <div className='chat__headerInfo'>
                        <h3>{messages[0].room_name}</h3>
                    </div>
                    <div className='chat__headerRight'>
                        {/* <IconButton>
                            <SearchOutlined/>
                        </IconButton>
                        <IconButton>
                            <AttachFile/>
                        </IconButton>
                        <IconButton>
                            <MoreVert/>
                        </IconButton> */}
                        <IconButton>
                            <Button variant="contained" type="submit" sx={{width:200}} onClick={openRemoveModal} color="error" >Remove members</Button>
                        </IconButton>
                        <IconButton>
                            <Button variant="contained" type="submit" sx={{width:200}} onClick={openModal} >Add members</Button>
                        </IconButton>
                        
                    </div>
                </div>

                <Modal
                    open={modal}
                    onClose={closeModal}
                    sx={{ backgroundColor:"transparent", display: "flex", alignItems: "center", justifyContent: "center"}}
                >
                    <div className='modalContainer'>
                        <h1 style={{color : "rgba(0, 0, 0, 0.527)"}}>Add Member</h1>
                        <TextField id="outlined" label="User mail" value={user} onChange={e => setUser(e.target.value)}/>
                        <Button variant="contained" type="submit" onClick={ addUser } disable={user.length===''}>Add</Button>
                    </div>
                </Modal>

                <Modal
                    open={removeModal}
                    onClose={closeRemoveModal}
                    sx={{ backgroundColor:"transparent", display: "flex", alignItems: "center", justifyContent: "center", overflowY: "scroll"}}
                >
                    <div className='modalContainerDel'>
                        <h1 style={{color : "rgba(0, 0, 0, 0.527)"}}>Remove User</h1>
                        {/* <TextField id="outlined" label="User mail" value={user} onChange={e => setUser(e.target.value)}/>
                        <Button variant="contained" type="submit" onClick={addUser}>Add</Button> */}
                        
                        {members.map( data =>(
                            <div key={data} className='delete__container'>
                                <div>
                                    {data}
                                </div>
                                <Button variant="outlined" color='error' onClick={ () => deleteUser(data,roomid)}>
                                    <DeleteIcon />
                                </Button>
                            </div>
                                
                        ))}

                    </div>
                </Modal>
                <div className='chat__body'>
                    {messages[0].chat.map( message =>{
                        return(
                            <p ref={messageEl} className={`chat__message ${ message.user_mail === currentUser ? "chat__reciever":""} `} >
                                <span className='chat__name'>{message.user}</span>
                                {message.message}
                                <span className='chat__timestamp'>
                                    {new Intl.DateTimeFormat('en-US',{ month: 'short', day:'2-digit',hour:'numeric', minute:'numeric'}).format(new Date(Date.parse(message.timestamp)))}
                                    
                                </span>
                            </p>
                        )
                })}
                    
                </div>

                <div className='chat__footer'>
                    <Example/>
                    <form>
                        <input placeholder="Type a message" type="text" ref={(input) => {nameInput = input}} value={input} onChange={ e => setInput(e.target.value)}/>
                        <button type="submit" onClick={sendMessage}>Send a message</button>
                    </form>
                    <Mic/>
                </div>

                <Snackbar open={loading} autoHideDuration={10000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="info" sx={{ width: '100%' }}>
                       Opening new chat!
                    </Alert>
                </Snackbar>

                <Snackbar open={notFound} autoHideDuration={2000} onClose={handleNotFound}>
                    <Alert onClose={setNotFound} severity="error" sx={{ width: '100%' }}>
                        User not found!
                    </Alert>
                </Snackbar>

                <Snackbar open={added} autoHideDuration={2000} onClose={handleAdded}>
                    <Alert onClose={setAdded} severity="success" sx={{ width: '100%' }}>
                        User Added successfully!
                    </Alert>
                </Snackbar>

                <Snackbar open={already} autoHideDuration={2000} onClose={handleAlready}>
                    <Alert onClose={setAlready} severity="info" sx={{ width: '100%' }}>
                        User Already there!
                    </Alert>
                </Snackbar>

                <Snackbar open={deleteM} autoHideDuration={2000} onClose={handleDelete}>
                    <Alert onClose={deleteM} severity="info" sx={{ width: '100%' }}>
                        Deleted Successfully!
                    </Alert>
                </Snackbar>

            </div>
        )
    }
    return(
        <div className="progressBar">
            <CircularProgress/>
        </div>
    )
}

export default Chat;
