import {
    MDBCard,
    MDBCardBody,
    MDBIcon,
    MDBCardHeader,
  } from "mdb-react-ui-kit";
  import ReactTimeAgo from "react-time-ago";
  import Markdown from 'react-markdown'
export default function MessageCard({ imgsrc = "", message = "", timestamp = "", owner = "User", }) {

    const align = owner === "assistant" ? "left": "right";
    const Image = () => (<img
        src={imgsrc}
        alt="avatar"
        className={`rounded-circle d-flex align-self-start ${ align === "left" ? 'me-3' : 'ms-3'} shadow-1-strong`}
        width="60"
    />);

    const Message = () => (
        <MDBCard className="w-100" >
            <MDBCardHeader className="d-flex justify-content-between p-3">
                <p className="fw-bold mb-0">{owner}</p>
                <p className="text-muted small mb-0">
                    <MDBIcon far icon="clock" /> &nbsp;
                    <ReactTimeAgo date={timestamp} locale="en-US"/>
                </p>
            </MDBCardHeader>
            <MDBCardBody>
                <Markdown>
                    {message}
                </Markdown>
                
            </MDBCardBody>
        </MDBCard>
    )

    if (align=== "left") {
        return (
            <div className="d-flex justify-content-between mb-4">
                <Image />
                <Message />
            </div>
        )
    }
    return (
        <div className="d-flex justify-content-between mb-4">
            <Message />
            <Image/>
        </div>
    )
}