"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@src/components/ui/button";
import type { Socket } from "socket.io-client";
import { getSocket } from "@src/lib/socket-client";

type Phase =
    | "waiting_players"
    | "betting"
    | "locked"
    | "reveal"
    | "payout";

type BetSide = "tai" | "xiu" | null;

interface Props {
    userId: string;
}

interface Winner {
    userId: string;
    winAmount: number;
}

export default function GameClient({ userId }: Props) {
    const socketRef = useRef<Socket | null>(null);

    const [connected, setConnected] = useState(false);

    const [phase, setPhase] = useState<Phase>("waiting_players");
    const [countdown, setCountdown] = useState<number>(0);

    const [dice, setDice] = useState<number[]>([]);
    const [total, setTotal] = useState<number | null>(null);
    const [resultType, setResultType] = useState<BetSide>(null);

    const [myBetSide, setMyBetSide] = useState<BetSide>(null);
    const [myBetAmount, setMyBetAmount] = useState<number>(0);
    const [lastWin, setLastWin] = useState<number | null>(null);

    const [betLoading, setBetLoading] = useState(false);
    const fixedBetAmount = 20; // tạm thời cược cố định 10 điểm

    useEffect(() => {
        const socket = getSocket();
        socketRef.current = socket;

        socket.on("connect", () => {
            setConnected(true);
            socket.emit("identify", userId);
        });

        socket.on("disconnect", () => {
            setConnected(false);
        });

        // Lần đầu join nhận state hiện tại
        socket.on("game_state", (state) => {
            setPhase(state.phase);
            setCountdown(state.countdown ?? 0);
            setDice(state.dice || []);
            setTotal(state.total ?? null);
            setResultType(state.type ?? null);
            setMyBetSide(null);
            setMyBetAmount(0);
            setLastWin(null);
        });

        socket.on("phase_change", (data) => {
            setPhase(data.phase);
            setCountdown(data.countdown ?? 0);

            if (data.phase === "betting") {
                // reset UI ván mới
                setMyBetSide(null);
                setMyBetAmount(0);
                setDice([]);
                setTotal(null);
                setResultType(null);
                setLastWin(null);
            }
        });

        socket.on("countdown", ({ countdown }) => {
            setCountdown(countdown);
        });

        socket.on("reveal", (data) => {
            setPhase("reveal");
            setDice(data.dice || []);
            setTotal(data.total);
            setResultType(data.type);
        });

        socket.on("payout", (data: { winners: Winner[] }) => {
            const me = data.winners.find((w) => w.userId === userId);
            setLastWin(me ? me.winAmount : 0);
        });

        socket.on("bet_ok", ({ bet, amount }) => {
            setMyBetSide(bet);
            setMyBetAmount(amount);
            setBetLoading(false);
        });

        return () => {
            socket.off("connect");
            socket.off("disconnect");
            socket.off("game_state");
            socket.off("phase_change");
            socket.off("countdown");
            socket.off("reveal");
            socket.off("payout");
            socket.off("bet_ok");
            socket.disconnect();
        };
    }, [userId]);

    // Gửi cược: gọi API Next trừ điểm → thành công → emit bet lên socket
    const handleBet = async (side: "tai" | "xiu") => {
        if (!socketRef.current) return;
        if (phase !== "betting") return;
        if (myBetSide) return; // đã cược rồi
        if (!connected) return;

        try {
            setBetLoading(true);

            const res = await fetch("/api/game/bet", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: fixedBetAmount }),
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                alert(err?.error || "Cược thất bại");
                setBetLoading(false);
                return;
            }

            // API trừ điểm thành công → emit bet cho server game
            socketRef.current.emit("bet", {
                bet: side,
                amount: fixedBetAmount,
            });

            // state myBet sẽ được set trong "bet_ok"
        } catch (e) {
            console.error(e);
            alert("Lỗi kết nối khi đặt cược");
            setBetLoading(false);
        }
    };

    const statusText = (() => {
        switch (phase) {
            case "waiting_players":
                return "Đang chờ đủ 2 người chơi để bắt đầu...";
            case "betting":
                return "Đang mở cược - hãy chọn Tài hoặc Xỉu";
            case "locked":
                return "Đã khóa cược, chờ công bố kết quả...";
            case "reveal":
                return "Đang công bố kết quả...";
            case "payout":
                return "Đang trả thưởng...";
            default:
                return "";
        }
    })();

    const youWon =
        lastWin !== null && lastWin > 0 && resultType && myBetSide === resultType;

    return (
        <div className="w-full max-w-lg bg-white rounded-xl shadow-md p-6 space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold">🎰 Tài Xỉu Realtime</h1>
                <span
                    className={
                        "text-xs px-2 py-1 rounded-full " +
                        (connected ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700")
                    }
                >
                    {connected ? "Đã kết nối" : "Mất kết nối"}
                </span>
            </div>

            <div className="text-center space-y-2">
                <p className="text-sm text-slate-500">
                    Mỗi phiên: 3 viên xúc xắc, tổng từ <b>3 → 18</b>.
                </p>
                <p className="text-sm text-slate-500">
                    <b>Tài</b>: tổng <b>&gt; 10</b> – <b>Xỉu</b>: tổng <b>≤ 10</b>.
                </p>
            </div>

            <div className="flex flex-col items-center space-y-2">
                <span className="text-sm text-slate-600">{statusText}</span>
                {phase !== "waiting_players" && (
                    <div className="text-4xl font-bold">⏱ {countdown}s</div>
                )}
            </div>

            <div className="flex justify-center gap-4">
                <Button
                    variant={myBetSide === "xiu" ? "default" : "outline"}
                    disabled={
                        phase !== "betting" || !!myBetSide || !connected || betLoading
                    }
                    onClick={() => handleBet("xiu")}
                >
                    Xỉu (≤ 10)
                </Button>
                <Button
                    variant={myBetSide === "tai" ? "default" : "outline"}
                    disabled={
                        phase !== "betting" || !!myBetSide || !connected || betLoading
                    }
                    onClick={() => handleBet("tai")}
                >
                    Tài (&gt; 10)
                </Button>
            </div>

            <div className="space-y-1 text-sm">
                <p>
                    Cửa bạn đã cược:{" "}
                    {myBetSide === "tai"
                        ? "Tài"
                        : myBetSide === "xiu"
                            ? "Xỉu"
                            : "Chưa cược"}
                    {myBetAmount ? ` (${myBetAmount} điểm)` : ""}
                </p>

                {dice.length > 0 && (
                    <p>
                        Xúc xắc: <b>{dice.join(" - ")}</b>
                    </p>
                )}

                {total !== null && (
                    <p>
                        Tổng: <b>{total}</b>{" "}
                        {resultType && (
                            <span>
                                (
                                {resultType === "tai"
                                    ? "Tài > 10"
                                    : "Xỉu ≤ 10"}
                                )
                            </span>
                        )}
                    </p>
                )}

                {phase === "payout" && lastWin !== null && (
                    <p className={youWon ? "text-green-600" : "text-red-600"}>
                        {youWon
                            ? `🎉 Bạn thắng +${lastWin} điểm!`
                            : "😢 Ván này bạn không thắng"}
                    </p>
                )}
            </div>
        </div>
    );
}
