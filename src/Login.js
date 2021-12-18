import React, { useState } from 'react';
import './Login.css';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from './axios';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { useHistory, Link } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import LinearProgress from '@mui/material/LinearProgress';
import Modal from '@mui/material/Modal';

function Login() {

    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ emailError, setEmailError ] = useState(false);
    const [ passwordError, setPasswordError ] = useState(false);
    const [ redirecting, setRedirecting ] = useState(false);
    const [ invalid, setInvalid ] = useState(false);
    const history = useHistory();
    // const { currentUser } = useAuth();
    const { setCurrentUser } =useAuth();
    // const { currentUserPassword } = useAuth();
    const { setCurrentUserPassword } = useAuth();
    const { setCurrentUserName } = useAuth();
    const [ modal, setModal] = useState(false);


    const openModal = () => { setModal(true); }
    const closeModal = () => { setModal(false); }

    const emailSetter = (e)=>{
        setEmail(e.target.value);
    }
    const passwordSetter = (e)=>{
        // console.log(e.target.value);
        setPassword(e.target.value);
    }

    const submitHandler = async(e)=>{
        setModal(true);
        e.preventDefault();
        if(email && password){
            await axios.post('/login',{
                user_mailid : email,
                password : password
            })
            .then( res => {
                console.log(res);
                if(res.data.includes("logged in")){
                    setCurrentUser(email);
                    setCurrentUserPassword(password);
                    var name = res.data.replace("logged in ", "")
                    setCurrentUserName(name);
                    setRedirecting(true);
                    history.push('/home');
                }
                else if(res.data === "Wrong password"){
                    setModal(false);
                    setPasswordError(true);
                }
                else if(res.data === "User not found"){
                    setModal(false);
                    setEmailError(true);
                }
            })
            .catch( e =>{
                setModal(false);
                console.log(e);
            })
        }
        else{
            setInvalid(true);
            setModal(false);
        }
        
    }
    
    const handleCloseRedirect = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setRedirecting(false);
    };

    const handleCloseEmail = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setEmailError(false);
    };

    
    const handleClosePassword = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setPasswordError(false);
    };

    const handleInvalid = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setInvalid(false);
    };
    const Alert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

    return (
        <div className='login'>
            <div className='login__container'>
                <div className='login__header'>
                    <h1>Log in</h1>
                </div>
                <div className='login__body'>
                    <form className='login__bodyForm' onSubmit={submitHandler}>
                        <TextField 
                        id="outlined-basic" label="Mail id" 
                        variant="outlined" onChange={emailSetter} 
                        value={email} type="text" sx={{width: 300}}
                        />

                        <TextField id="outlined-basic" label="Password"
                         variant="outlined" onChange={passwordSetter} 
                         value={password} type="password" sx={{width: 300}}
                         />

                        <Button variant="contained" type="submit" sx={{width:150}}>Log in</Button>

                        <Snackbar open={redirecting} autoHideDuration={2000} onClose={handleCloseRedirect}>
                            <Alert onClose={setRedirecting} severity="success" sx={{ width: '100%' }}>
                                Redirecting!!
                            </Alert>
                        </Snackbar>

                        <Snackbar open={emailError} autoHideDuration={2000} onClose={handleCloseEmail}>
                            <Alert onClose={setEmailError} severity="error" sx={{ width: '100%' }}>
                               User not found!
                            </Alert>
                        </Snackbar>

                        <Snackbar open={passwordError} autoHideDuration={2000} onClose={handleClosePassword}>
                            <Alert onClose={setPasswordError} severity="error" sx={{ width: '100%' }}>
                                Wrong password!
                            </Alert>
                        </Snackbar>

                        <Snackbar open={invalid} autoHideDuration={2000} onClose={handleInvalid}>
                            <Alert onClose={invalid} severity="error" sx={{ width: '100%' }}>
                                Invalid input!
                            </Alert>
                        </Snackbar>

                        <Modal
                            open={modal}
                            onClose={closeModal}
                            sx={{ backgroundColor:"transparent", display: "flex", alignItems: "center", width:"100%"}}
                        >
                            <LinearProgress/>
                        </Modal>

                    </form>
                    <div className='signup__footer'>
                        <p> Don't have an account? <Link to="/signup">Click here!</Link> </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
