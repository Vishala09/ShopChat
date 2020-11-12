import React from 'react'
import io from "socket.io-client";
import { useEffect, useState ,useRef} from "react";
import {Link,useHistory,useParams} from "react-router-dom";
import Button from 'react-bootstrap/Button';import Modal from 'react-bootstrap/Modal';
import './chat.css';
const socket = io("http://localhost:4000", {
  transports: ["websocket", "polling"]
});
function Chat({name}) {
    const history = useHistory();
    const params = useParams();
    var nameFromParam=params.name;
    if(name===undefined)
    {
        name=nameFromParam;
    }
    const [message, setMessage] = useState("");
    //const [name, setName] = useState("");
    const [users, setUsers] = useState([]);
    const [chat, setChat] = useState([]);
    const chatRef= useRef(null);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    // useEffect(() => {
    //     socket.emit('name', { name });
    // },[]);
    useEffect(() => {
      socket.on("getUsers", users => {
        setUsers(users);
      });
    
        socket.on("chatData", message => {
          setChat(messages => [...messages, message]);
          //chatRef.current.scrollIntoView({ behavior: 'smooth' })
          chatRef.current.scrollTop = chatRef.current.scrollHeight;
        });

        socket.on("getItems", item => {
          setChat(items => [...items,item])
          chatRef.current.scrollTop = chatRef.current.scrollHeight;
        });  
        
      }, []);

      const send = (e) => {
        let date = new Date();
        if(date.getHours() == 0)
        date = 12 + ":" + date.getMinutes() +":" +date.getSeconds() + " am";
        else if(date.getHours()>12)
        date = (date.getHours()-12) + ":" + date.getMinutes() +":" +date.getSeconds() + " pm";
        else
        date = date.getHours() + ":" + date.getMinutes() +":" +date.getSeconds() + " am";
        let type='message';
        socket.emit('chat', { name, message,date,type });
        setMessage('');
    }
    
    const renderChat = () => {
        return chat.map((data, index) => (
             <div key={index} >
               <span className="message_box">
                 <span>
                   {
                      data.type=='message' ?
                        <span>
                            {
                              data.name != name ?
                              <span clasName="message_name">
                                  <span className="name"> {data.name} </span> : 
                                  <span className="message">
                                          <span className="">{data.message}</span>
                                          <span className="time">{data.date}</span>
                                  </span>
                              </span>
                              :
                              <span className="message_name_right">
                                    <span className="name"> {data.name} </span> : 
                                    <span className=" message">
                                            <span className="">{data.message}</span>
                                            <span className="time">{data.date}</span>
                                    </span>
                              </span>
                            }
                        </span> 
                        :
                        <span>
                            {
                                data.name != name ?
                                <span style={{display:'flex',flexDirection:'row'}}>
                                    <span className="name" > {data.name} </span>  
                                      <span style={{display:'flex',flexDirection:'column',background:'gainsboro'}}>
                                              <span className="contact"><b>Contact:</b> {data.contact}</span>
                                              <span className="contact"><b>Delivery Date:</b>{data.delivery}</span>
                                              <span className="items">
                                                <b>Items</b>
                                                {
                                                      data.items.map((item)=>
                                                      <div>
                                                          <span>{item}</span>
                                                      </div>
                                                      )
                                                }
                                              </span>
                                      </span>
                                </span>
                                :
                                <span className="message_name_right">
                                      <span className="name"> {data.name} </span>  
                                      <span style={{display:'flex',flexDirection:'column',background:'gainsboro'}}>
                                              <span className="contact"><b>Contact:</b> {data.contact}</span>
                                              <span className="contact"><b>Delivery Date:</b>{data.delivery}</span>
                                              <span className="items">
                                                <b>Items</b>
                                                {
                                                      data.items.map((item)=>
                                                      <div>
                                                          <span>{item}</span>
                                                      </div>
                                                      )
                                                }
                                              </span>
                                      </span>
                                </span>
                            }
                        </span>
                   }    
                 </span>
               </span>
             </div>
         ))
       }
    return (
        <div>
            <div className="nom">
               Welcome {name} , Number of messages : {chat.length} <span>&nbsp;</span> 
               <Button onClick={handleShow} variant="danger">Participants</Button>
               <a href={"/chat/"+name} target="_blank">  <Button variant="primary">Open in new tab</Button> </a>
             </div>
             <div style={{}}>
                <div>
                  <div  className="chat_screen" ref={chatRef}>
                      <div>
                            {renderChat()}
                      </div>
                  </div>
                  <div className="chat_screen_end">
                          <input placeholder="Type Message..." class="inputbox" type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
                          <Button onClick={(e) => send(e)}  variant="warning">Send</Button>{' '}
                  </div>
                </div>
                
                <Modal show={show} onHide={handleClose}>
                  <Modal.Header closeButton>
                    <Modal.Title>Participants</Modal.Title>
                  </Modal.Header>
                  <Modal.Body><p>{users.map((elem) => <div>{elem.name}</div>)}</p></Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                      Close
                    </Button>
                  </Modal.Footer>
                </Modal>
            </div>
            
        </div>
    )
}

export default Chat;
