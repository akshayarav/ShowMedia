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

    useEffect(() => {
        if (message_id) {
            (async () => {
                const message = await fetchMessage(message_id);
                setMessage(message);
            })();
        }
    }, [message_id])

    console.log(message)
    if (message.message) {
        if (message.sender == userId) {
            return (
                <div className="container">
                    <div className="row">
                        <div className="offset-6 col-6 bg-glass rounded-4 mt-2">
                            <div className="m-1 d-flex justify-content-end align-items-center">
                                <p className="mt-1"> {message.message}  </p>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }

        return (
            <div className="container">
                <div className="row">
                    <div className="col-6 bg-glass rounded-4 mt-2">
                        <div className="m-1 d-flex justify-content-end align-items-center">
                            <p className="mt-1"> {message.message}  </p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default MessageText