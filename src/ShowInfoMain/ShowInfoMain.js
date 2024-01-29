import { useState } from "react";
import ShowInfo from "./ShowInfo/ShowInfo";
import Sidebar from "../Sidebar/sidebar";
import Reviews from "./Reviews/Reviews";
import { useParams } from "react-router-dom";

function ShowInfoMain() {
    const [activeTab, setActiveTab] = useState('info')
    const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false)
    const showId = useParams().showId

    return (
        <div className="bg-brown-gradient">
            <div className="py-4">
                <div className="container">
                    <div className="row justify-content-center ">
                        <main className="col col-xl-9 order-lg-2 col-lg-12 col-md-12 col-sm-12 border-start">
                            <a href="/shows" className="material-icons text-white text-decoration-none mb-4 me-5">arrow_back</a>
                            <ul className="top-osahan-nav-tab nav nav-pills justify-content-center nav-justified mb-4 shadow-sm rounded-4 overflow-hidden bg-glass my-3 mx-lg-3" id="pills-tab" role="tablist">
                                <li className="nav-item" role="presentation">
                                    <button
                                        className={`p-3 nav-link text-muted ${activeTab === 'info' ? 'active' : ''}`}
                                        id="pills-overview-tab"
                                        type="button"
                                        onClick={() => setActiveTab('info')}>
                                        Info
                                    </button>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <button
                                        className={`p-3 nav-link text-muted ${activeTab === 'reviews' ? 'active' : ''}`}
                                        id="pills-feed-tab"
                                        type="button"
                                        onClick={() => {
                                            setActiveTab('reviews');
                                        }}>
                                        Chatter
                                    </button>
                                </li>
                            </ul>
                            <div className="tab-content" id="pills-tabContent">
                                <div className={`tab-pane fade ${activeTab === 'info' ? 'show active' : ''}`} id="pills-overview" role="tabpanel" aria-labelledby="pills-overview-tab">
                                    <ShowInfo />
                                </div>
                                <div className={`tab-pane fade ${activeTab === 'reviews' ? 'show active' : ''}`} id="pills-feed" role="tabpanel" aria-labelledby="pills-feed-tab">
                                    <Reviews showId={showId}/>
                                </div>
                            </div>
                        </main>
                        <Sidebar isOffcanvasOpen={isOffcanvasOpen} toggleOffcanvas={() => setIsOffcanvasOpen(!isOffcanvasOpen)} />

                    </div>
                </div>
            </div>
        </div>
    )
}

export default ShowInfoMain