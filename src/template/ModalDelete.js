import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export default function ModalDelete({
  showModal,
  hideModal,
  confirmModal,
  id,
  message,
}) {

  return (
    <Modal
      size="md"
      show={showModal}
      onHide={hideModal}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton style={{fontFamily: "Century gothic",color:"#29AEE4",borderBottomColor:"rgb(121, 142, 143)"}}>
        <Modal.Title className="h6">Suppression</Modal.Title>
      </Modal.Header>
      
      <Modal.Body style={{color:"rgb(121, 142, 143)",borderTopColor:"rgb(121, 142, 143)"}}>
        <div style={{fontFamily: "Century gothic",fontSize:"12pt"}}><i style={{color:"#29AEE4"}} className="fa fa-warning"></i>&nbsp; {message}</div>
      </Modal.Body>
      <Modal.Footer style={{color:"white",borderTopColor:"rgb(121, 142, 143)"}}>
        <Button className="btn-view" onClick={hideModal}>
          NON
        </Button>
        <Button className="btn-edit" onClick={() => confirmModal(id)}>
          OUI
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
