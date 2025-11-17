import { sseEmitter } from "@src/lib/sse";

export const runtime = "nodejs";

export async function GET() {
    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();

    const send = (obj: any) => {
        const data = `data: ${JSON.stringify(obj)}\n\n`;
        writer.write(new TextEncoder().encode(data));
    };

    send({ connected: true });

    const onMessage = (data: any) => send(data);

    sseEmitter.on("notify", onMessage);

    // Cleanup khi client ngắt kết nối
    const close = () => {
        sseEmitter.off("notify", onMessage);
        try { writer.close(); } catch { }
    };

    // Khi trình duyệt đóng kết nối
    (readable as any).closed?.then(close).catch(close);

    return new Response(readable, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache, no-transform",
            Connection: "keep-alive",
        },
    });
}
