import React from 'react';
import { Modal, Button } from 'react-bootstrap';

function SignModal({ closeModal }) {
    return (
        <Modal show={true} onHide={closeModal} centered>
            <Modal.Header closeButton>
                <Modal.Title id="exampleModalLabel">Email</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* Your modal content goes here */}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={closeModal}>
                    Close
                </Button>
                {/* Include other buttons or content as needed */}
            </Modal.Footer>
        </Modal>
    );
}

export default SignModal

// <div class="modal fade" id="signModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
// <div class="modal-dialog modal-dialog-centered">
//    <div class="modal-content rounded-4 p-4 border-0">
//       <div class="modal-header border-0 p-1">
//          <h6 class="modal-title fw-bold text-body fs-6" id="exampleModalLabel">Choose Language</h6>
//          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
//       </div>
//       <form>
//          <div class="modal-body p-0">
//             <div class="row py-3 gy-3 m-0">
//             <div class="mt-5 login-register" id="number">
//                <h6 class="fw-bold mx-1 mb-2 text-dark">Register your Mobile Number</h6>
//                <div class="row mx-0 mb-3">
//                   <div class="col-3 p-1">
//                      <div class="form-floating">
//                         <select class="form-select rounded-5" id="floatingSelect" aria-label="Floating label select example">
//                            <option selected>+91</option>
//                            <option value="1">+34</option>
//                            <option value="2">+434</option>
//                            <option value="3">+343</option>
//                         </select>
//                         <label for="floatingSelect">Code</label>
//                      </div>
//                   </div>
//                   <div class="col-9 p-1">
//                      <div class="form-floating d-flex align-items-end">
//                         <input type="text" class="form-control rounded-5" id="floatingName" value="1234567890" placeholder="Enter Mobile Number">
//                         <label for="floatingName">Enter Mobile Number</label>
//                      </div>
//                   </div>
//                </div>
//                <div class="p-1">
//                   <button type="button" class="btn btn-primary w-100 text-decoration-none rounded-5 py-3 fw-bold text-uppercase m-0" data-bs-dismiss="modal">Send OTP</button>
//                </div>
//             </div>
//          </div>
//       </form>
//    </div>
// </div>
// </div>