import React,{useEffect} from 'react'
import "bootstrap/dist/css/bootstrap.css";
import Shop from './Shop';
import Chat from './chat';
import {Link,useHistory,useParams} from "react-router-dom";

import io from "socket.io-client";
import ErrorBoundary from './ErrorBoundary';
const socket = io("http://localhost:4000", {
  transports: ["websocket", "polling"]
});

function Shopchat() {
    const history = useHistory();
    const params = useParams();
    const name=params.name;
    useEffect(() => {
        socket.on("getUsers", users => {
          console.log("gettingusers",users);
          if(users.some(person => person.name === name) === false)
          {
                //console.log("Checks if user has logged in if the url is given directly given instead of coming from welcome page")
                alert("Please Login First");
                history.push('/');
          }
        });
    },[name]);
    
    return (
      <ErrorBoundary>
        <div className="row" style={{alignItems:'center'}}>
            <div className="col-6">
                <Shop name={name} />
            </div>
            <div className="col-6">
                <Chat name={name} />
            </div>
        </div>
      </ErrorBoundary>
    )
}

export default Shopchat;
