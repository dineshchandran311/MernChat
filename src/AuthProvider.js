import React, { useContext, useState } from 'react';

export const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({children}) {

    const [currentUser, setCurrentUser] = useState('Dinesh');
    const [currentUserPassword, setCurrentUserPassword] = useState('');
    const [currentUserName, setCurrentUserName] = useState('');


    const value = { setCurrentUser, currentUser, currentUserPassword, setCurrentUserPassword, setCurrentUserName, currentUserName };

    return (
       <AuthContext.Provider value={value}>
           {children}
       </AuthContext.Provider>
    )
}

export default AuthProvider;
