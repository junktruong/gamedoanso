// "use client";

// import { useEffect, useState } from "react";
// import { io, Socket } from "socket.io-client";

// let socket: Socket;

// export default function Home() {
//     const [messages, setMessages] = useState<string[]>([]);
//     const [input, setInput] = useState("");

//     useEffect(() => {
//         socket = io({
//             path: "/api/socket",
//         });

//         socket.on("message", (msg: string) => {
//             setMessages((prev) => [...prev, msg]);
//         });

//         return () => socket.disconnect();
//     }, []);

//     const send = () => {
//         if (input.trim()) {
//             socket.emit("message", input);
//             setInput("");
//         }
//     };

//     return (
//         <div>
//             <h1>Chat</h1>
//             <div>
//                 {messages.map((m, i) => (
//                     <p key={i}>{m}</p>
//                 ))}
//             </div>
//             <input value={input} onChange={(e) => setInput(e.target.value)} />
//             <button onClick={send}>Send</button>
//         </div>
//     );
// }
