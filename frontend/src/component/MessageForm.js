import { MDBIcon } from "mdb-react-ui-kit";
import { useState } from "react";

export default function MessageForm({ text ="default", submit = (e, c = () => { }) => { } }) {
    const [input, setInput] = useState(text);
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSumbit = (event) => {
        event.preventDefault();
       sendMessage();
    }

    const sendMessage = () => {
        if (!input) return;
        try {
            setLoading(true);
            submit(input, () => {setInput(prev => ""); setLoading(false)});
        } catch (error) {
            setError(error.message);
        }
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
          sendMessage();
        }
      };
    return (

        <div className="text-muted input-group">
            <img
                src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-6.webp"
                alt="avatar 3"
                className="rounded-circle"
                style={{ width: "40px", height: "40px" }}
            />
            <input
                type="text"
                className="form-control form-control-lg ms-1"
                id="messageInput"
                placeholder="Type message"
                value={input}
                onKeyDown={handleKeyDown}
                onChange={(event) => { setInput(event.target.value) }}
                disabled={isLoading}
            />
            <button className="btn" onClick={handleSumbit} type="button" disabled={isLoading} aria-disabled={isLoading}>
                {isLoading ?
                    <><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        <span className="visually-hidden">Loading...</span></> : <MDBIcon fas icon="paper-plane" />}
            </button>
        </div>

    )
}