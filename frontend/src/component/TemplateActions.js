import {
    MDBCard,
    MDBCardBody,
    MDBCardHeader,
} from "mdb-react-ui-kit";
import { Button } from "antd";

export default function TemplateActions({onclick}) {
    return (
        <div className="d-flex justify-content-between mb-4">
            <MDBCard className="w-100" >
                <MDBCardHeader className="d-flex justify-content-between p-3">
                    <p className="fw-bold mb-0">Choose an action</p>
                </MDBCardHeader>
                <MDBCardBody>
                    <Button type="link" onClick={() => { onclick("list tokens in my account")}}>list tokens in account</Button>
                    <Button type="link" onClick={() => { onclick("list tokens in my account on [chain name] network")}}>list tokens my tokens for a network</Button>
                    <Button type="link" onClick={() => { onclick("list tokens in [address] on [chain name] network")}}>list tokens for an account</Button>
                    <Button type="link" onClick={() => { onclick("list nft tokens in my account")}}>list nft tokens in account</Button>
                    <Button type="link" onClick={() => { onclick("list nft tokens in [address] on [chain name] networ")}}>list nft tokens in account</Button>
                    <Button type="link" onClick={() => { onclick("send [amount] to [address] on [chain/network name] network")}}>send/transfer tokens</Button>
                    <Button type="link" onClick={() => { onclick("get account activities")}}>get account activities</Button>
                    <Button type="link" onClick={() => { onclick("get token transfer history")}}>get token transfer history</Button>
                </MDBCardBody>
            </MDBCard>
        </div>
    )
}