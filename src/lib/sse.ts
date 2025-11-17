import { EventEmitter } from "events";

export const sseEmitter = new EventEmitter();
// tăng số listener tối đa
sseEmitter.setMaxListeners(50);
