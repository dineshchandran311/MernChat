import { Avatar } from '@mui/material';
import React from 'react';
import './SidebarChat.css';

function SidebarChat() {
    return (
        <div className="sidebarChat">
            <div className='.sidebarChat__avatar'>
                <Avatar/>
            </div>
            <div className='sidebarChat__info'>
                <h2>Room name</h2>
                <p>This is the Chat</p>
            </div>
        </div>
    )
}

export default SidebarChat;
