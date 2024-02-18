import React, { useContext, useEffect, useRef, useState } from "react";
import { Col, Flex, FloatButton, Grid} from 'antd';
import { CommentOutlined } from '@ant-design/icons';
import { } from 'react-time-ago';
import MessageCard from "./MessageCard";
import { WSContext } from "../context/useWS";
import MessageForm from "./MessageForm";
import { dummyMessages } from "../utils/constants";

const { useBreakpoint } = Grid;

function Chat({ visible, style }) {
  const { isConnected, messages, emit, threadId } = useContext(WSContext);
  const ref = useRef(null);
  const screens = useBreakpoint();

  const sendMessage = (value, callback = () => { }) => {
    // console.log(callback);
    emit("message", { message: value, thread_id: threadId }, callback);
  }

  const scrollToLastMessage = () => {
    const lastChildElement = ref.current?.lastElementChild;
    lastChildElement?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isConnected) {
      scrollToLastMessage();
    }
  }, [isConnected, messages]);

  if (!visible) return null;

  const chatWidth = screens.lg ? "40vw": screens.md ? "50vw" : screens.sm? "70vw": "90vw";

  return (
    <Flex vertical gap="small"  align="vertical" style={{ padding: "5px 10px", borderRadius: "6px", backgroundColor: "#CDC4F9", width: chatWidth,  ...style }}>
      <Col ref={ref} md="8" style={{ height: "65vh", overflowY: "scroll" }}>

        {
          dummyMessages?.map((msg, idx) => <MessageCard {...msg} key={idx} />)
        }

      </Col>
      <Col sm="12">
        <MessageForm submit={sendMessage} />
      </Col>
    </Flex>

  );
}

export default function ChatButton() {
  const [chatVisible, setChatVisible] = useState(true)
  const screens = useBreakpoint();

  const pushRight = screens.lg ? 30: screens.md ? 40 : screens.sm? 50 : 55;
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