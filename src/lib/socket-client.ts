import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function getSocket() {
    if (!socket) {
        socket = io("https://deprecative-increasedly-shon.ngrok-free.dev/", {
            transports: ["websocket"],
            autoConnect: true,
            reconnection: true,
        });
    }
    return socket;
}
