import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import AuthProvider from './AuthProvider';
import Login from './Login';
import Signup from './Signup';
import { BrowserRouter as Router, Switch,Route } from 'react-router-dom';
import Provider from './AuthProvider';

function Home(){
    return(
        <Provider>
            <Router>
                <Switch>

                    <Route path="/room/:roomid">
                        <App chatAvail={true}/>
                    </Route>

                    <Route path="/home">
                        <App/>
                    </Route>

                    <Route path="/signup">
                        <Signup/>
                    </Route>
                    
                    <Route path="/">
                        <Login/>
                    </Route>
                </Switch>
            </Router>
        </Provider>
    )
}

ReactDOM.render(
    <AuthProvider>
        <Home />
    </AuthProvider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
