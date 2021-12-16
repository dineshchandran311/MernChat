import React, { useState } from 'react';
import './Sidebar.css';
import DonutLargeIcon from '@mui/icons-material/DonutLarge';
import ChatIcon from '@mui/icons-material/Chat';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IconButton } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import SidebarChat from './SidebarChat';
import axios from './axios';

function Sidebar() {

    const [ room, setRoom ] = useState(null);

    const createRoom = (e)=>{
        e.preventDefault();
        axios.post("/messages/new/room",{
            room_name: room,
	        users_mailid: "cd311@gmail.com"
        });
        setRoom('');

    }

    return (
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
            <div className="sidebar__search">
                <div className='sidebar__searchContainer'>
                    <SearchOutlinedIcon/>
                </div>
                <form  onSubmit={createRoom}>
                    <input placeholder='Search or start new chat' value={room} onChange={ e => setRoom(e.target.value)} type="text"/>
                </form>
            </div>
            <div className='sidebar__chats'>
                <SidebarChat/>
            </div>
        </div>
    )
}

export default Sidebar;
