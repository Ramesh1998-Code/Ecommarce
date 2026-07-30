import React from 'react'

function Modal({showModal,setShowModal,handleDelet,confirmDelete}) {

    
  return (
    <div>
        <div className={`modal ${showModal ? "show-modal" : ""}`}>
            <div className="modal-content">
                <span onClick={()=>{setShowModal(false)}}  className="close-button">×</span>
                <h1>You want to delete this item?</h1>
                <button onClick={confirmDelete}>yes</button>
                <button onClick={()=>{setShowModal(false)}}>No</button>
            </div>
    </div>

    </div>
  )
}

export default Modal