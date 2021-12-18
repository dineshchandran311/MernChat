import React, { useState } from 'react';
import './Signup.css';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from './axios';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { Link, useHistory } from 'react-router-dom';


function Signup() {

    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ passwordError, setPasswordError ] = useState(false);
    const [ password2, setPassword2 ] = useState('');
    const [ username, setUsername ] = useState('');
    const [open, setOpen] = useState(false);
    const [ invalid, setInvalid ] = useState(false);
    const history = useHistory();

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
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


    const emailSetter = (e)=>{
        setEmail(e.target.value);
    }
    const passwordSetter = (e)=>{
        setPassword(e.target.value)
    }
    const passwordSetter2 = (e)=>{
        setPassword2(e.target.value)
        if(password !== e.target.value){
            setPasswordError(true);
        }
        else{
            setPasswordError(false);
        }
    }
    const usernameSetter = (e)=>{
        setUsername(e.target.value);
    }

    const submitHandler = async(e)=>{
        e.preventDefault();
        console.log("Hit");
        if( password && password2 && username && email && !passwordError && password===password2){
            axios.post('/signup', {
                user_name: username,
                user_mailid : email,
                password : password
            })
            .then( data =>{
                setEmail('');
                setPassword('');
                setPassword2('');
                setUsername('');
                setOpen(true);
                history.push('/login');
            })
            .catch( e => alert(e))
        }
        else{
            setInvalid(true);
        }
    }

    
    return (
        <div className='signup'>
            <div className='signup__container'>
                <div className='signup__header'>
                    <h1>Sign up</h1>
                </div>
                <div className='signup__body'>
                    <form className='signup__bodyForm' onSubmit={submitHandler}>

                        <TextField id="outlined-basic" label="Username" 
                        variant="outlined" onChange={usernameSetter} 
                        value={username} type="text" sx={{width: 300}}
                        />

                        <TextField 
                        id="outlined-basic" label="Mail id" 
                        variant="outlined" onChange={emailSetter} 
                        value={email} type="text" sx={{width: 300}}
                        />

                        <TextField id="outlined-basic" label="Password"
                         variant="outlined" onChange={passwordSetter} 
                         value={password} type="password" sx={{width: 300}}
                         />

                        <TextField id="outlined-basic" label="Re-Enter Password"
                         variant="outlined" onChange={passwordSetter2} 
                         value={password2} type="password" sx={{width: 300}}
                         error = {passwordError} 
                         helperText={`${ passwordError ? "Passwords don't match" : '' }`}
                         />

                        <Button variant="contained" type="submit" sx={{width:150}}>Sign up</Button>

                        <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
                            <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                                Signed successfully!
                            </Alert>
                        </Snackbar>

                        <Snackbar open={invalid} autoHideDuration={2000} onClose={handleInvalid}>
                            <Alert onClose={invalid} severity="error" sx={{ width: '100%' }}>
                                Invalid input!
                            </Alert>
                        </Snackbar>
                    </form>
                    <div className='signup__footer'>
                        <p> Already have an account? <Link to="/login">Click here!</Link> </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signup;
