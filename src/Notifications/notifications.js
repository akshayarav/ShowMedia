import MobileBar from "../MobileBar/MobileBar"
import Sidebar from "../Sidebar/sidebar"
import SearchBar from "../SearchBar/SearchBar"
import { useState } from "react"

function Notifications() {

    const [searchScreenOn, setSearchScreenOn] = useState(false)
    const [searchResults, setSearchResults] = useState([]);
    const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false)
    const [refresh, setRefresh] = useState(false);

    return (
        <div className="bg-brown-gradient">
            <MobileBar toggleOffcanvas={() => setIsOffcanvasOpen(!isOffcanvasOpen)} toggleSearchScreen={(e) => setSearchScreenOn(e)} setSearchResults={(e) => setSearchResults(e)} />
            <div className="py-4">
                <div className="container">
                    <div className="row position-relative">
                        <main className="col col-xl-6 order-xl-2 col-lg-12 order-lg-1 col-md-12 col-sm-12 col-12 border-start border-end main-center">
                            <div className="main-content">
                                <h2 class="fw-bold text-white mt-4">Your Notifications</h2>
                            </div>
                        </main>
                        <Sidebar isOffcanvasOpen={isOffcanvasOpen} toggleOffcanvas={() => setIsOffcanvasOpen(!isOffcanvasOpen)} />
                        <SearchBar />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Notifications