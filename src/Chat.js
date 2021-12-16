import { AttachFile, InsertEmoticon, Mic, MoreVert, SearchOutlined } from '@mui/icons-material';
import { Avatar, IconButton } from '@mui/material';
import React, { useState } from 'react';
import './Chat.css';
import axios from './axios';

function Chat({messages}) {


    const [ input, setInput ] = useState(null);

    const sendMessage = async(e) =>{
        e.preventDefault();
        const value = input;
        setInput('');
        await axios.post('/messages/new', {
            // room_name: String,
            // user: String,
            // user_mail: String,
            // message: String,
            // timestamp: String,
            room_name : "bois",
            user: "Raj",
            user_mail: "cd@gmail.com",
            message: value,
            timestamp: new Date().toISOString(),
        })
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
                {messages.map( message =>{
                    return(
                        <p className={`chat__message ${ message.user_mail === "cd311@gmail.com" ? "chat__reciever":""} `}>
                        <span className='chat__name'>{message.user}</span>
                        {message.message}
                        <span className='chat__timestamp'>
                            {message.timestamp}
                        </span>
                        </p>
                    )
            })}
                
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
