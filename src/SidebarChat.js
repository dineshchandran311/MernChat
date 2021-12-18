import { Avatar } from '@mui/material';
import React from 'react';
import './SidebarChat.css';
import { Link } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import AccessibilityIcon from '@mui/icons-material/Accessibility';

function SidebarChat({messages, check}) {
    if(messages?.length!==0){
        return (
            <div className="sidebarChat">
                { messages.map( data =>(
                    <div className='sidebarChat__rooms'>
                        <Link to={`/room/${data._id}`}  key={data._id} className='sidebarChat__eroom' >
                            <div className='.sidebarChat__avatar'>
                                <Avatar/>
                            </div>
                            <div className='sidebarChat__info'>
                                <h2>{data.room_name}</h2>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        )
    }
    else if(check)
    {
        return (
            <div className="progressBar">
                <AccessibilityIcon sx={{fontSize: "100px"}}/>
                <p>Add rooms to chat....</p>
            </div>
        )
    }
    return (
        <div className="progressBar">
            <CircularProgress/>
        </div>
    )
}

export default SidebarChat;
