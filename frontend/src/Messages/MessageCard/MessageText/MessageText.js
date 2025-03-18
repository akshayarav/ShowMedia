import { useState, useEffect } from "react"
import axios from "axios"

function MessageText({ message_id }) {
    const apiUrl = process.env.REACT_APP_API_URL;
    const [state, setState] = useState('')
    const userId = localStorage.getItem('userId')
    const [message, setMessage] = useState('')

    const fetchMessage = async () => {
        try {
            const response = await axios.get(`${apiUrl}/api/messages/${message_id}`);
            return response.data
        } catch (error) {
            console.error(error)
            return null
        }
    }

    const formatDate = (dateString) => {
        const dateOptions = { year: 'numeric', month: 'short', day: 'numeric' };
        const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit' };

        const date = new Date(dateString);
        return `${date.toLocaleDateString(undefined, dateOptions)} ${date.toLocaleTimeString(undefined, timeOptions)}`;
    };


    useEffect(() => {
        if (message_id) {
            (async () => {
                const message = await fetchMessage(message_id);
                setMessage(message);
            })();
        }
    }, [message_id])

    if (message.message) {
        if (message.sender == userId) {
            return (
                <div className="container">
                    <div className="row">
                        <div className="offset-5 col-7 mt-2">
                            <div className="bg-glass rounded-4 mt-2">
                                <p className="p-3 text-light" style={{ wordWrap: "break-word", overflowWrap: "break-word" }}> {message.message} </p>
                            </div>
                        </div>
                        <div className="d-flex justify-content-end">
                            <p className=""> {formatDate(message.timestamp)}  </p>
                        </div>
                    </div>
                </div>
            )
        }

        return (
            <div className="container">
                <div className="row">
                    <div className="col-7 mt-2">
                        <div className="bg-glass rounded-4 mt-2">
                            <p className="p-3 text-light" style={{ wordWrap: "break-word", overflowWrap: "break-word" }}> {message.message} </p>
                        </div>
                    </div>
                    <p className=""> {formatDate(message.timestamp)}  </p>
                </div>
            </div>
        )
    }
}

export default MessageText