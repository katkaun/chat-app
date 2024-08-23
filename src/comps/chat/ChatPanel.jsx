// import styles from "../../css/Chat.module.css";

// const ChatPanel = () => {
//   const conversations = [
//     { id: 1, name: "John Doe", avatar: "https://via.placeholder.com/40" },
//     { id: 2, name: "Jane Smith", avatar: "https://via.placeholder.com/40" },
//     { id: 3, name: "Chris Johnson", avatar: "https://via.placeholder.com/40" },
//   ];

//   return (
//     <div className={styles.chatPanel}>
//       <h3 className="text-white font-semibold text-lg mb-6">Conversations</h3>
//       <div className={styles.userChat}>
//       <ul>
//         {conversations.map((conversation) => (
//           <li
//             key={conversation.id}
//             className="flex items-center gap-4 p-2 mb-2 bg-[#5d5b8d] rounded-lg hover:bg-[#4c4a7a] cursor-pointer transition-all"
//           >
//             <img
//               src={conversation.avatar}
//               alt={conversation.name}
//               className={styles.avatarContainer}
//             />
//             <span className="text-white">{conversation.name}</span>
//           </li>
//         ))}
//       </ul>
//       </div>
//     </div>
//   );
// };

// export default ChatPanel;
