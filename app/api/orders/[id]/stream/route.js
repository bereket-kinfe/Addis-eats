import { getStatus } from "@/lib/orders";
import { getSession } from "@/lib/session";

export async function GET(request, { params }) {
  const session = await getSession();
  if (!session) return new Response("Not signed in", { status: 401 });
  const { id } = await params;
  const initialStatus = await getStatus(id, session.sessionId);
  if (!initialStatus) return new Response("Order not found", { status: 404 });

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data) => 
        controller.enqueue(`data: ${JSON.stringify(data)}\n\n`); 

      send(initialStatus);

      const interval = setInterval(async () => {
        const currentStatus = await getStatus(id, session.sessionId);
        if (!currentStatus) {
          clearInterval(interval);
          controller.close();
          return;
        }
        send(currentStatus);
        if (currentStatus.isDelivered) {
          clearInterval(interval);
          controller.close();
        }
      }, 5000);

      request.signal.addEventListener("abort", () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}
