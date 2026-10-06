import { mockBreakingUpdates } from "@/lib/mockData";

export const dynamic = "force-dynamic";

export async function GET() {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      let index = 0;

      // Send initial keep-alive
      controller.enqueue(encoder.encode(`event: connected\ndata: ${JSON.stringify({ status: "connected" })}\n\n`));

      // Emit a real-time breaking item every 15 seconds
      const interval = setInterval(() => {
        const item = {
          ...mockBreakingUpdates[index % mockBreakingUpdates.length],
          id: `live-${Date.now()}-${index}`,
          publishedAt: new Date().toISOString(),
        };

        controller.enqueue(encoder.encode(`event: new_content\ndata: ${JSON.stringify(item)}\n\n`));
        index++;
      }, 15000);

      // Clean up after 2 minutes or on abort
      setTimeout(() => {
        clearInterval(interval);
        controller.close();
      }, 120000);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
