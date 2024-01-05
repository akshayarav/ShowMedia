import { useState } from "react";
import ShowModal from "./ShowModal";

function ShowCard({ name, image, id }) {
    const [showModal, setShowModal] = useState(false);
    const toggleShowModal = () => setShowModal(!showModal);

    return (
        <main className="col col-xl-2 col-lg-6 col-md-6 col-sm-6 col-6">
            <div className="bg-white rounded-4 shadow-sm profile">
                <div
                    role="button"
                    tabIndex="0"
                    onClick={toggleShowModal}
                >
                    <div className="image-container">
                        <img src={image} className="img-fluid rounded-top" alt={name} />
                    </div>
                    <div className="details-container p-3">
                        <p className="text-muted mb-0">{name}</p>
                    </div>
                </div>
                {showModal && <ShowModal closeModal={toggleShowModal} showName={name} showImg={image} id = {id} />}
            </div>
        </main >
    )
}

export default ShowCard
