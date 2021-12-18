import './App.css';
import Sidebar from './Sidebar';
import Chat from './Chat';
import { useEffect, useState } from 'react';
import axios from './axios';
import { useAuth } from './AuthProvider';

function App({chatAvail}) {
    const [messages, setMessages]= useState([]);
    const { currentUser } = useAuth();
    const { currentUserPassword } = useAuth();
    const [ check , setCheck ] = useState(false);


    useEffect( async()=>{
        if(currentUser){
            await axios.post('/login',{
                user_mailid : currentUser,
                password : currentUserPassword
            })
            .then( async(res) => {
                if(res.data.includes("logged in")){
                    await axios.post('/messages/sync',{
                        users_mailid: currentUser
                    })
                    .then( response =>{
                        setCheck(true);
                        setMessages(response.data);
                    })
                    .catch( e => console.log(e))
                }
               
            })
            .catch( e =>{
                console.log(e);
            })
        }
    })

    // useEffect( ()=>{
    //     const pusher = new Pusher('92097ee7168e575c5784', {
    //         cluster: 'ap2'
    //       });
    
    //     const channel = pusher.subscribe('messages');
    //     channel.bind('inserted', function(data) {
    //         //setMessages([...messages, data]);
    //     });

    //     return () =>{
    //         channel.unbind_all()
    //         channel.unsubscribe();
    //     }

    // }, [messages])
    
    // console.log(messages);

  return (
    <div className="app">

      <div className="app__body">
        <Sidebar messages={messages} chatAvail={chatAvail} check={check}/>
      </div>

    </div>
  );
}

export default App;
