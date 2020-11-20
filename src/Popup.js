import React ,{ useEffect, useState } from "react";
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal'
import Chat from "./chat";
function Popup({showValue,name,setShowHandler}) {
    const [show, setShow] = useState(showValue);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
  
    return (
      <>
        {/* <Button variant="primary" onClick={handleShow}>
          Launch demo modal
        </Button> */}
  
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Chat Window</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              <Chat name={name} />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => {handleClose();setShowHandler(false)}}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }

export default Popup;
  