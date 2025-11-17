// import { Server as SocketIOServer } from "socket.io";

// let io: SocketIOServer | null = null;

// export const getIO = () => io;

// export const initIO = (server: any) => {
//     if (!io) {
//         io = new SocketIOServer(server, {
//             cors: { origin: "*" },
//             path: "/api/socket",
//         });

//         io.on("connection", (socket) => {
//             console.log("Connected:", socket.id);

//             socket.on("message", (msg: string) => {
//                 io?.emit("message", msg);
//             });
//         });
//     }
//     return io;
// };
