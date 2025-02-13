import { PythFetcherAgent } from '@easyagent/pyth-fetcher';
import { serve } from '@hono/node-server';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { createDataStream, streamText } from 'ai';
import { config } from 'dotenv';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { stream } from "hono/streaming";
import { initTrace } from './trace';
import c = require('config');

config();

const app = new Hono()
app.use('*', cors());
initTrace();

const openrouter = createOpenRouter({
  apiKey: c.get('model.api_key'),
})

let model = openrouter.chat(c.get('model.name'))

const pythAgent = new PythFetcherAgent()

app.post('/stream-data', async c => {
  const { messages } = await c.req.json()
  // immediately start streaming the response
  const dataStream = createDataStream({
    execute: async dataStreamWriter => {
      const result = streamText({
        model,
        messages,
        tools: {
          ...pythAgent.toTools(),
        },
        toolCallStreaming: true,
        experimental_telemetry: {
          isEnabled: true
        }
      });

      result.mergeIntoDataStream(dataStreamWriter);
    },
    onError: error => {
      // Error messages are masked by default for security reasons.
      // If you want to expose the error message to the client, you can do so here:
      return error instanceof Error ? error.message : String(error);
    },
  });

  // Mark the response as a v1 data stream:
  c.header('X-Vercel-AI-Data-Stream', 'v1');
  c.header('Content-Type', 'text/plain; charset=utf-8');

  return stream(c, stream =>
    stream.pipe(dataStream.pipeThrough(new TextEncoderStream())),
  );
});

const port = process.env.PORT || "3000";
serve({
  fetch: app.fetch,
  port: parseInt(port),
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`);
});