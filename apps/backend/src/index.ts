import { createDataStream, streamText, wrapLanguageModel } from 'ai';
import { Hono } from 'hono'
import { stream } from "hono/streaming"
import { cors } from 'hono/cors';
import { serve } from '@hono/node-server';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import c = require('config');
import { PythFetcherAgent } from '@easyagent/pyth-fetcher';
import { config } from 'dotenv';
import { LangfuseExporter } from 'langfuse-vercel';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';

config();

const app = new Hono()
app.use('*', cors());

const openrouter = createOpenRouter({
  apiKey: c.get('model.api_key'),
})

let model = openrouter.chat(c.get('model.name'))

let sdk: NodeSDK | undefined;
if (c.get('langfuse.enabled')) {
  sdk = new NodeSDK({
    traceExporter: new LangfuseExporter(
      {
        secretKey: c.get('langfuse.secretKey'),
        publicKey: c.get('langfuse.publicKey'),
        baseUrl: c.get('langfuse.baseUrl'),
      }
    ),
    instrumentations: [getNodeAutoInstrumentations()],
  });

  sdk.start();
  console.log('langfuse started');
}


const pythAgent = new PythFetcherAgent()

app.post('/stream-data', async c => {
  const { messages } = await c.req.json()
  // immediately start streaming the response
  const dataStream = createDataStream({
    execute: async dataStreamWriter => {
      dataStreamWriter.writeData('initialized call');

      // 实际的计算逻辑
      const result = streamText({
        model,
        messages,
        tools: {
          ...pythAgent.toTools(),
        },
        experimental_telemetry:{
          isEnabled:true
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

const shutdownHandler = (signal: string) => {
  sdk?.shutdown();
  process.exit(0);
};

process.on('SIGINT', () => shutdownHandler('SIGINT'));
process.on('SIGTERM', () => shutdownHandler('SIGTERM'));