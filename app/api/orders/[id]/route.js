import { getOrderForSession } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function GET(_request, { params }) {
  const session = await getSession();
  if (!session) {
    return Response.json({ error: "Not signed in." }, { status: 401 });
  }

  const { id } = await params;
  const order = await getOrderForSession(id, session.sessionId);
  if (!order) {
    return Response.json({ error: "Order not found." }, { status: 404 });
  }

  return Response.json(
    { id: order.id, status: order.status },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
