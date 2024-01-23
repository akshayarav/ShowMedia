import MobileBar from "../MobileBar/MobileBar"
import Sidebar from "../Sidebar/sidebar"
import SearchBar from "../SearchBar/SearchBar"
import { useState, useEffect } from "react"
import UserCard from "../SearchBar/UserCard"
import NewMessageModal from "./NewMessageModal"
import MessageCard from "./MessageCard/MessageCard"
import axios from "axios"

function Messages() {

    const [searchScreenOn, setSearchScreenOn] = useState(false)
    const [searchResults, setSearchResults] = useState([]);
    const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false)
    const [refresh, setRefresh] = useState(false);

    const userId = localStorage.getItem('userId')
    const apiUrl = process.env.REACT_APP_API_URL;
    const [userConversations, setUserConversations] = useState([])
    const [userDataConversations, setUserDataConversations] = useState([])

    const user = localStorage.getItem('user')
    const username = localStorage.getItem('username')
    const [selectedUser, setSelectedUser] = useState(null)

    const [showNewMessageModal, setShowNewMessageModal] = useState(false);
    const toggleNewMessageModal = () => setShowNewMessageModal(!showNewMessageModal)

    const fetchUserData = async (username) => {
        try {
            const response = await axios.get(`${apiUrl}/api/user/${username}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching user data:', error);
            // Handle error appropriately
            return null;
        }
    };

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/conversations/${userId}`);
                setUserConversations(response.data);
                const userData = await processUserData(response.data);
                setUserDataConversations(userData);
            } catch (error) {
                console.error('Error fetching conversations:', error);
                // Handle error appropriately
            }
        };

        if (userId) {
            fetchConversations();
        }
    }, [userId]);

    const processUserData = async (conversations) => {
        const promises = conversations.map(async (conversation) => {
            const otherParticipant = conversation.participants.find(participant => participant.username !== username);

            if (otherParticipant) {
                const otherUser = await fetchUserData(otherParticipant.username);
                return otherUser; // Return only the other user's data
            } else {
                console.log("No other participant found");
                return null;
            }
        });

        return Promise.all(promises);
    };

    return (
        <div className="bg-brown-gradient">
            <MobileBar toggleOffcanvas={() => setIsOffcanvasOpen(!isOffcanvasOpen)} toggleSearchScreen={(e) => setSearchScreenOn(e)} setSearchResults={(e) => setSearchResults(e)} />
            <div className="py-4">
                <div className="container">
                    <div className="row position-relative">
                        <main className="col col-xl-4 order-xl-2 col-lg-12 order-lg-1 col-md-12 col-sm-12 col-12 border-start border-end main-center">
                            <div className="main-content">
                                <div class="d-flex justify-content-between align-items-center">
                                    <h2 className="fw-bold text-white mt-4">Messages</h2>
                                    <div
                                        role="button"
                                        className="mt-4"
                                        style={{ display: "inline-block", width: "30px" }}
                                        onClick={toggleNewMessageModal} // Add this line
                                    >
                                        <span class="material-icons">rate_review_outlined</span>
                                    </div>
                                    {showNewMessageModal && <NewMessageModal closeModal={toggleNewMessageModal} setUser = {(e) => setSelectedUser(e)}/>}
                                </div>
                                {userDataConversations.map((user) => (
                                    <UserCard key={user._id} other_user={user} messages={true} messagesSubmit={(e) => setSelectedUser(e)}/>
                                ))}
                            </div>
                        </main>
                        <MessageCard selectedUser={selectedUser} />
                        <Sidebar isOffcanvasOpen={isOffcanvasOpen} toggleOffcanvas={() => setIsOffcanvasOpen(!isOffcanvasOpen)} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Messages