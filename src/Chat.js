import { AttachFile, InsertEmoticon, Mic, MoreVert, SearchOutlined } from '@mui/icons-material';
import { Avatar, IconButton } from '@mui/material';
import React, { useState } from 'react';
import './Chat.css';
import axios from './axios';

function Chat({messages}) {


    const [ input, setInput ] = useState(null);

    const sendMessage = async(e) =>{
        e.preventDefault();
        console.log("Hit send message")
        await axios.post('/messages/new', {
            message: input,
            name: "Raj",
            timestamp: new Date().toISOString(),
            received: false
        })

        setInput('');
    }

    return (
        <div className='chat'>
            <div className='chat__header'>
                <div className='chat__avatar'>
                    <Avatar/>
                </div>
                <div className='chat__headerInfo'>
                    <h3>Room name</h3>
                    <p>Last seen at...</p>
                </div>
                <div className='chat__headerRight'>
                    <IconButton>
                        <SearchOutlined/>
                    </IconButton>
                    <IconButton>
                        <AttachFile/>
                    </IconButton>
                    <IconButton>
                        <MoreVert/>
                    </IconButton>
                </div>
            </div>

            <div className='chat__body'>
                {messages.map( message =>(
                    <p className={`chat__message ${message.received? "":"chat__reciever"} `}>
                        <span className='chat__name'>{message.name}</span>
                        {message.message}
                        <span className='chat__timestamp'>
                            {message.timestamp}
                        </span>
                    </p>
                ))}
                
            </div>

            <div className='chat__footer'>
                <InsertEmoticon/>
                <form>
                    <input placeholder="Type a message" type="text" value={input} onChange={ e => setInput(e.target.value)}/>
                    <button type="submit" onClick={sendMessage}>Send a message</button>
                </form>
                <Mic/>
            </div>

        </div>
    )
}

export default Chat;
