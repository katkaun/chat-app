import { useState } from "react";
import { useContext } from "react";
import AuthContext from "../context/AuthProvider";

const Chat = () => {
  const { auth } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("")

  return(
    <h1>Chat</h1>
  )

};

export default Chat;
