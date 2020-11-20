import React, { useRef } from 'react'
import io from "socket.io-client";
import { useEffect, useState } from "react";
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import './shop.css';
import {Link,useHistory,useParams} from "react-router-dom";

import products from './products.json';
import Popup from './Popup';
const socket = io("http://localhost:4000", {
  transports: ["websocket", "polling"]
});
function Orders() {
   
    const [contact, setContact] = useState("");
    const [name, setName] = useState("");
    const [show, setShow] = useState(false);
    const [delivery, setDelivery] = useState("");
    const [showContactErr, setShowContactErr] = useState(null);
    const [showItemsErr, setShowItemsErr] = useState(null);
    const [showDateErr, setShowDateErr] = useState(null);
    const [nameErr, setNameErr] = useState(null)
    const [initialName, setInitialName] = useState(false)
    const dateRef=useRef( null); const contactRef=useRef(null);
    const setShowFromChat = (value) => {
        setShow(value);
    }
    const submit = () => {
        let items=getSelectedValues();
        if(items.length!=0 && showContactErr !=true && name.length>=3)
        {
            let type='item';
            console.log("Emitting items",name,contact,items,delivery,type);
            socket.emit('items', { name,contact,items,delivery,type });
            if(initialName === false)
            {
                socket.emit('name', { name });
            }
            setInitialName(true);
            setShow(true);
            console.log('show',show)
        }
        else
        {
            //alert('Please check for errors');
        }
    }
    function getSelectedValues(){
        let result = [];
        let select=document.getElementById('items');
        let options = select && select.options;
        let opt;

        for (var i=0; i<options.length; i++) {
            opt = options[i];
            if (opt.selected) {
            result.push(opt.value || opt.text);
            }
        }
        if(result.length === 0)
        {
            setShowItemsErr(true);
        }
        else
        {
            setShowItemsErr(false);
        }
        return result;
    }
    function validatePhone(num)
    {
        let phone = /^\d{10}$/;
        if(num.match(phone))
        {
            setShowContactErr(false);
            return true;
        }
        else
        {
            setShowContactErr(true);
        }
    }
    function validateName(name){
        if(name.length<3)
        {
            setNameErr(true);
        }
    }

    function validateDate(date) {
        var dateString = date;
        var myDate = new Date(dateString);
        var today = new Date();
        if ( myDate < today ) { 
            setShowDateErr(true);
            return false;
        }
        else if( dateString === "" )
        {
            setShowDateErr(true);
            return false;
        }
        setShowDateErr(false);
        return true;
    }

    return (
        <div>
            <div className="form">
                <InputGroup size="lg">
                    <InputGroup.Prepend>
                    <InputGroup.Text id="inputGroup-sizing-lg">Customer Name</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl value={name} onChange={(e) => {setName(e.target.value);validateName(e.target.value)}}  aria-label="Large" aria-describedby="inputGroup-sizing-sm" />
                </InputGroup>
                {
                   nameErr && name.length<3 && <p class="err">Name's length should be greater than 3</p>
                }
                <InputGroup size="lg">
                    <InputGroup.Prepend>
                    <InputGroup.Text id="inputGroup-sizing-lg">Contact Number</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl onMouseLeave={(e) => validatePhone(e.target.value)} value={contact} onChange={(e) => {setContact(e.target.value);validatePhone(e.target.value)}} aria-label="Large" aria-describedby="inputGroup-sizing-sm" />
                </InputGroup>
                {
                    showContactErr && <p class="err">Please provide a valid contact number</p>
                }
                
                <InputGroup size="lg">
                    <InputGroup.Prepend>
                    <InputGroup.Text id="inputGroup-sizing-lg">Select multiple Items (Use ctrl+)</InputGroup.Text>
                    </InputGroup.Prepend> 
                </InputGroup>
                
                <div class="form-group">
                    <select multiple onChange={() => getSelectedValues()} className="form-control" id="items">
                        {
                            products.map((prod,index) => 
                                <option key={index}>{prod.name}</option>
                            )
                        }
                    </select>
                </div>
                {
                    showItemsErr && <p class="err">Please slect atleast one item</p>
                }
                <InputGroup size="lg">
                    <InputGroup.Prepend>
                    <InputGroup.Text id="inputGroup-sizing-lg">Delivery Date</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl type="date" value={delivery} onChange={(e) => {setDelivery(e.target.value);validateDate(e.target.value)}} aria-label="Large" aria-describedby="inputGroup-sizing-sm" />
                </InputGroup>
                {
                    showDateErr && <p class="err">Please select a future date</p>
                }
                <Button onClick={(e) => {submit(e);validatePhone(contact);validateDate(delivery)}}  variant="primary">Submit</Button>
               {show && <Popup setShowHandler={setShowFromChat} showValue={show} name={name} />} 
            </div>
        </div>
    )
}

export default Orders;
