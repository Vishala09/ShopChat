import React,{useState,useEffect} from 'react';
import './Welcome.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import { BrowserRouter as Router , Switch, Route,history} from 'react-router-dom';
import {Link,useHistory} from "react-router-dom";
import io from "socket.io-client";
const socket = io("http://localhost:4000", {
  transports: ["websocket", "polling"]
});
function Welcome() {
    const [name, setName] = useState("");
    const [users, setUsers] = useState([]);
    useEffect(() => {
        socket.on("getUsers", users => {
            //console.log(users);
          setUsers(users);
        });
      },[]);
    
    const history = useHistory();
    let goToChat = () => {
        
        console.log('check in users',users,users.some(person => person.name === name));
        if(name=="")
        {
            console.log("Please enter your name!")
            alert("Please enter your name!")
            return false;
        }
        else  if(users.some(person => person.name === name))
        {
                 console.log("Please enter  a different name!")
                 alert("User already exist! Please enter a different name!");
                 return false;
        }
        else{
            console.log("Emitting name")
            socket.emit('name', { name });
            history.push('/shopchat/'+name);
        }
    }
   
    return (
        <div className="welcome_page">
            <h1>Welcome to our application!</h1>
            <InputGroup size="lg">
                <InputGroup.Prepend>
                <InputGroup.Text id="inputGroup-sizing-lg">Enter your name!</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl value={name} onChange={(e) => setName(e.target.value)} aria-label="Large" aria-describedby="inputGroup-sizing-sm" />
            </InputGroup>
            <Button onClick={() => goToChat()} className="go_button" variant="success">Go !</Button>
        </div>
    )
}

export default Welcome
