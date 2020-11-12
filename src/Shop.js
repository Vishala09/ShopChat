import React, { useRef } from 'react'
import io from "socket.io-client";
import { useEffect, useState } from "react";
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import './shop.css';
import {Link,useHistory,useParams} from "react-router-dom";

import products from './products.json';
const socket = io("http://localhost:4000", {
  transports: ["websocket", "polling"]
});
function Shop({name}) {
   // const [custName, setCustName] = useState("");
    const params = useParams();
    var nameFromParam=params.name;
    if(name===undefined)
    {
        console.log(name,nameFromParam);
        name=nameFromParam;
    }
    const [contact, setContact] = useState("");
    const [delivery, setDelivery] = useState("");
    const [showContactErr, setShowContactErr] = useState(null);
    const [showItemsErr, setShowItemsErr] = useState(null);
    const [showDateErr, setShowDateErr] = useState(null);
    const dateRef=useRef( null); const contactRef=useRef(null);
    const submit = () => {
        let items=getSelectedValues();
        console.log('err',showItemsErr);
        if(items.length!=0 && showContactErr !=true)
        {
            let type='item';
            socket.emit('items', { name,contact,items,delivery,type });
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
            console.log('len',result.length)
            setShowItemsErr(true);
            console.log(showItemsErr);
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

    function validateDate(date) {
        var dateString = date;
        var myDate = new Date(dateString);
        var today = new Date();
        if ( myDate < today ) { 
            console.log('err future')
            setShowDateErr(true);
            return false;
        }
        else if( dateString === "" )
        {
            setShowDateErr(true);
            return false;
        }
        console.log(date,dateString,dateString === "" )
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
                    <FormControl value={name}  disabled={true} aria-label="Large" aria-describedby="inputGroup-sizing-sm" />
                </InputGroup>
                <p></p>
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
            </div>
        </div>
    )
}

export default Shop;
