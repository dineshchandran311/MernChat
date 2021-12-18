import React, { useState, useEffect } from 'react';
import './Sidebar.css';
import DonutLargeIcon from '@mui/icons-material/DonutLarge';
import ChatIcon from '@mui/icons-material/Chat';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Button, IconButton, TextField } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SidebarChat from './SidebarChat';
import axios from './axios';
import { useAuth } from './AuthProvider';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Chat from './Chat';
import Modal from '@mui/material/Modal';

function Sidebar({messages, chatAvail, check}) {

    const [ room, setRoom ] = useState(null);
    const { currentUser } = useAuth();
    const { currentUserPassword } = useAuth();
    const [ totalRooms, setTotalRooms] = useState([]);
    const [open, setOpen] = useState(false);
    const [ modal, setModal] = useState(false); 

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const Alert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

    const openModal = () => { setModal(true); }
    const closeModal = () => { setModal(false); }



    const createRoom = async(e)=>{
        e.preventDefault();
        setModal(false);
        setOpen(true);
        await axios.post('/login',{
            user_mailid : currentUser,
            password : currentUserPassword
        })
        .then( async(res) => {
            if(res.data.includes("logged in")){
                const value = room;
                setRoom('');
                await axios.post("/messages/new/room",{
                    room_name: value,
                    users_mailid: currentUser
                })
                .then( reponse => {
                    setTotalRooms([...totalRooms, reponse.data])
                    setOpen(false);
                })
                .catch( er => {
                    console.log(er)
                    setOpen(true);
                })
            }
           
        })
        .catch( e =>{
            setOpen(false);
            console.log(e);
        })
    }

    useEffect(() => {
        setTotalRooms(messages);
    }, [messages])


    return (
        <div className="home">
            <div className="sidebar">
                <div className="sidebar__header">
                    <div className='sidebar__headerLeft'>
                        <AccountCircleIcon src="" />
                    </div>
                    <div className="sidebar__headerRight">
                        <IconButton>
                            <DonutLargeIcon/>
                        </IconButton>
                        <IconButton>
                            <ChatIcon/>
                        </IconButton>
                        <IconButton>
                            <MoreVertIcon/>
                        </IconButton>
                    </div>
                </div>
    
                <div className='sidebar__chats'>
                    <SidebarChat messages={totalRooms} check={check}/>
                </div>

                <div className="sidebar__search">
                    <Button variant="contained" type="submit" sx={{width:150, height:50}} onClick={openModal} >Add room</Button>
                    <Modal
                        open={modal}
                        onClose={closeModal}
                        sx={{ backgroundColor:"transparent", display: "flex", alignItems: "center", justifyContent: "center"}}
                    >
                        <div className='modalContainer'>
                            <h1 style={{color : "rgba(0, 0, 0, 0.527)"}}>Add Room</h1>
                            <TextField id="outlined" label="Room name" value={room} onChange={e => setRoom(e.target.value)}/>
                            <Button variant="contained" type="submit" onClick={createRoom}>Add</Button>
                        </div>
                    </Modal>
                </div>

            </div>
            <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="info" sx={{ width: '100%' }}>
                    Adding a new Room!!
                </Alert>
            </Snackbar>
            {chatAvail? <Chat/> : <></>}
        </div>

    )
}

export default Sidebar;
