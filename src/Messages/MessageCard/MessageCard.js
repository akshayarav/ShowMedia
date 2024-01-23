import { useState, useEffect } from "react"
import axios from "axios"
import MessageText from "./MessageText/MessageText";

function MessageCard({ selectedUser }) {
    const apiUrl = process.env.REACT_APP_API_URL;
    const user = selectedUser
    const [message, setMessage] = useState('')
    const [convo, setConvo] = useState(null)
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();

        // Ensure there is a message to send
        if (!message.trim()) {
            console.error('Message is empty');
            return;
        }

        try {
            const senderId = localStorage.getItem('userId');
            const receiverId = user._id;

            const response = await axios.post(`${apiUrl}/api/messages/send`, {
                sender: senderId,
                receiver: receiverId,
                message: message
            });

            // Handle the response here. For example, clear the message input after sending.
            console.log('Message sent:', response.data);
            setMessage('');

            // Optionally, fetch the updated conversation
            const updatedConvo = await fetchConvo();
            setConvo(updatedConvo);
        } catch (error) {
            console.error('Error sending message:', error);
            // Handle sending error appropriately
        }
    };



    const fetchConvo = async () => {
        try {
            const response = await axios.get(`${apiUrl}/api/conversations/find`, {
                params: {
                    userId1: localStorage.getItem('userId'),
                    userId2: user._id
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching user data:', error);
            // Handle error appropriately
            return null;
        }
    };

    useEffect(() => {
        // Immediately invoked async function within useEffect
        if (user) {
            (async () => {
                const conversation = await fetchConvo();
                setConvo(conversation);
            })();
        }
    }, [user]);

    console.log(convo?.messages)

    if (!selectedUser) {
        return (
            <main className="col col-xl-5 order-xl-2 col-lg-12 order-lg-1 col-md-12 col-sm-12 col-12 border-start border-end main-center">
                <div className="main-content" style={{ height: "100%" }}>
                    <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: "95%" }}>
                        <p className="fw-bold mb-0 text-light mt-2">Please select a conversation or start a new one</p>
                    </div>
                </div>
            </main>
        )
    }

    return (
        <main className="col col-xl-5 order-xl-2 col-lg-12 order-lg-1 col-md-12 col-sm-12 col-12 border-start border-end main-center">
            <div className="main-content" style={{ height: "100%" }}>
                <div className="d-flex flex-column justify-content-between" style={{ height: "95%" }}>
                    <div>
                        <div class="d-flex flex-column justify-content-center align-items-center border-bottom">
                            <img className="img-fluid rounded-circle mt-5" src={user?.profilePicture} style={{ width: "50px", height: "50px" }} />
                            <p className="fw-bold mb-0 text-light mt-2">{user?.first} {user?.last}</p>
                            <small className="text-muted mt-2">@{user?.username}</small>
                            <p className="text-light mt-2">{user?.bio}</p>
                            <small className="text-muted mt-2 mb-2">Joined {formatDate(user?.timestamp)}</small>
                        </div>
                        {convo?.messages.map ((id) => (
                            <MessageText key={id} message_id = {id}></MessageText>
                        ))}
                        <MessageText />
                    </div>
                    <div className="row">
                        <div className="col-11">
                            <input
                                type="text"
                                className="form-control form-control-sm rounded-3 fw-light bg-light form-control-text"
                                placeholder="Write your message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                        </div>
                        <div className="col-1 p-0 mt-1" onClick={handleSendMessage} role="button">
                            <span className="material-icons md-20">
                                send_outlined
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
export default MessageCard