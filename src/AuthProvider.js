import React, { useContext, useState, useEffect } from 'react';
import { auth } from './firebase';
import firebase from 'firebase/compat';

export const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({children}) {

    const [currentUser, setUser] = useState({});

    function Google(){
        return auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
    }

    function Facebook(){
        return auth.signInWithPopup(new firebase.auth.FacebookAuthProvider())
    }

    useEffect(() => {
        
        auth.onAuthStateChanged( user =>{
            if(currentUser)
            {
                setUser(null);
                console.log("Logged out");
            }
            else{
                setUser(user);
                console.log("Logged in");
            }
        })

    }, [currentUser])

    const value = { Google, Facebook, currentUser}

    return (
       <AuthContext.Provider value={value}>
           {children}
       </AuthContext.Provider>
    )
}

export default AuthProvider
