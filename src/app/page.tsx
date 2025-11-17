import { getServerSession } from "next-auth";
import { authOptions } from "@src/lib/auth";
import { RealtimeScore } from "@src/components/realtime-score";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Trang chính</h1>

      {session?.user ? (
        <>
          <p>
            Xin chào <span className="font-semibold">{session.user.name}</span>!
          </p>

          <p>
            Điểm hiện tại của bạn: <RealtimeScore />
          </p>
        </>
      ) : (
        <p>Hãy đăng nhập để bắt đầu.</p>
      )}
    </div>
  );
}
