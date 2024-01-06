import Sidebar from "../Sidebar/sidebar"
import React, { useState, useEffect } from 'react';
import FeedItem from "./FeedItem/feeditem"
import MobileBar
    from "../MobileBar/MobileBar";
function Feed() {
    const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);

    return (
        <body class="bg-light">
            <MobileBar toggleOffcanvas={() => setIsOffcanvasOpen(!isOffcanvasOpen)} />
            <div class="py-4">
                <div class="container">
                    <div class="row position-relative">
                        <main class="col col-xl-6 order-xl-2 col-lg-12 order-lg-1 col-md-12 col-sm-12 col-12">
                            <div class="main-content">
                                <FeedItem />
                            </div>
                        </main>
                        <Sidebar isOffcanvasOpen={isOffcanvasOpen} toggleOffcanvas={() => setIsOffcanvasOpen(!isOffcanvasOpen)} />
                    </div>
                </div>
            </div>
        </body>
    )
}

export default Feed