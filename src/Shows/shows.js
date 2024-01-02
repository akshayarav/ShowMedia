import Sidebar from "../Sidebar/sidebar"
import ShowCard from "./ShowCard/ShowCard"

function Shows() { 
    return (
        <body class="bg-light">
            <div class="py-4">
                <div class="container">
                    <div class="row position-relative">
                        <ShowCard />
                        <Sidebar />
                    </div>
                </div>
            </div>
        </body>
    )
}

export default Shows