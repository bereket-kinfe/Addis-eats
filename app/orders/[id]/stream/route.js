import { getOrderForSession } from "@/lib/db";
import { getSession } from "@/lib/session";
import { getCurrentOrderStatus } from "@/lib/order-status";

export async function GET(_request, { params }) {
  const { id } = await params;
  const session = await getSession();
  if (!session) {
    return Response.json({ error: "Not signed in." }, { status: 401 });
  }

  const order = await getOrderForSession(id, session.sessionId);
  if (!order) {
    return Response.json({ error: "Order not found." }, { status: 404 });
  }

  let intervalId;
  let closed = false;

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      const close = () => {
        if (closed) return;
        closed = true;
        clearInterval(intervalId);
        controller.close();
      };

      const sendCurrentStatus = () => {
        if (closed) return;
        const status = getCurrentOrderStatus(order);
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ status, time: new Date().toISOString() })}\n\n`,
          ),
        );

        if (status === "Delivered") {
          close();
        }
      };

      sendCurrentStatus();
      if (!closed) intervalId = setInterval(sendCurrentStatus, 1000);
    },
    cancel() {
      closed = true;
      clearInterval(intervalId);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "private, no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
