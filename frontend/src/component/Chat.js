import React, { useContext, useEffect, useRef, useState } from "react";
import { Col, Flex, FloatButton, Grid, notification} from 'antd';
import { CommentOutlined } from '@ant-design/icons';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import { } from 'react-time-ago';
import MessageCard from "./MessageCard";
import { WSContext } from "../context/useWS";
import MessageForm from "./MessageForm";
import { dummyMessages } from "../utils/constants";
import { useAccountInfo, useNetwork } from "@particle-network/connect-react-ui";
import TemplateActions from "./TemplateActions";

const { useBreakpoint } = Grid;

function Chat({ visible, style }) {
  const { isConnected, changeThreadID, addHumanMessage, messages, emit, threadId } = useContext(WSContext);
  const { account, accountLoading,  } = useAccountInfo();
  const [actionText, setActionText] = useState("defualt");
  const {chain} = useNetwork()
  const ref = useRef(null);
  const screens = useBreakpoint();

  const sendMessage = (value, callback = () => { }) => {
    // console.log(callback);
    emit("message", { message: value, thread_id: threadId }, callback);
    addHumanMessage({type: "human", content: value, created_at: Date.now(), thread_id: threadId});
  }

  const scrollToLastMessage = () => {
    const lastChildElement = ref.current?.lastElementChild;
    lastChildElement?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if(!account || !isConnected) return;

    sendMessage(`Set my account details to  address ${account} and network ${chain?.fullname}`);

  },[account, isConnected, chain])

  useEffect(() => {
    if (!isConnected) {
      return;
    }
    scrollToLastMessage();
    if(account){
      changeThreadID(account);
    }
  }, [isConnected, messages, account, changeThreadID]);

  if (!visible) return null;

  if(!account) return null;

  if(!isConnected){
    notification.error({message: "Can connect to AI Chat bot"})
     return null
  };

  const chatWidth = screens.lg ? "40vw": screens.md ? "50vw" : screens.sm? "70vw": "90vw";
  return (
    <Flex vertical gap="small"  align="vertical" style={{zIndex: 3, padding: "5px 10px", borderRadius: "6px", backgroundColor: "#CDC4F9", width: chatWidth,  ...style }}>
      <Col ref={ref} md="8" style={{ height: "65vh", overflowY: "scroll" }}>

        {
          [...messages?.map((msg, idx) => <MessageCard {...msg} key={idx} />), <TemplateActions onclick={(text) => setActionText(prev => text)}/>]
        }

      </Col>
      <Col sm="12">
        <MessageForm key={actionText} text={actionText} submit={sendMessage} />
      </Col>
    </Flex>

  );
}

export default function ChatButton() {
  const [chatVisible, setChatVisible] = useState(true)
  const screens = useBreakpoint();
  const {account} = useAccountInfo();
  
  const pushRight = screens.lg ? 100: screens.md ? 40 : screens.sm? 50 : 45;

  if(!account) return null;
  return (
    <>
      <Chat visible={chatVisible} style={{ position: "fixed", bottom: "95px", right: pushRight }} />
      <FloatButton
        onClick={() => setChatVisible(prev => !prev)}
        type="primary"
        style={{ right: pushRight }}
        icon={<CommentOutlined />}
      />
    </>
  )
}