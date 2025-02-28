import { PythFetcherAgent } from '@easyagent/pyth-fetcher';
import { ThinkingAgent } from '@easyagent/thinking';
import { serve } from '@hono/node-server';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { createDataStream, generateId, streamText, wrapLanguageModel } from 'ai';
import { config } from 'dotenv';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { stream } from "hono/streaming";
import { getLangfuse, initTrace } from './trace';
import c = require('config');
import { LoggingMiddleware } from './middlewares/Logging';
import { hookSystem, World } from '@easyagent/lib';

config();

const app = new Hono()
app.use('*', cors());
initTrace();

const openrouter = createOpenRouter({
  apiKey: c.get('model.api_key'),
})

let model = wrapLanguageModel({
  model: openrouter.chat(c.get('model.name')),
  middleware: LoggingMiddleware,
})


const world = new World(model)
// const pythAgent = new PythFetcherAgent(world)
// pythAgent.setup({}, {})
const thinkingAgent = new ThinkingAgent(world)
thinkingAgent.setup({}, {})

app.post('/stream-data', async c => {
  const parentTraceId = generateId();

  getLangfuse()?.trace({
    id: parentTraceId,
    name: 'stream-data',
  });

  const systemPrompt = hookSystem.run('onSystemPromptBuild', "你是一个智能助手。你当前的对话ID为：" + parentTraceId + "。", {
    model,
    traceId: parentTraceId,
  })

  const tools = hookSystem.run('onToolBuild', {}, {
    model,
    traceId: parentTraceId,
  })

  const { messages } = await c.req.json()
  const onEnd = () => {
    world.removeArea(parentTraceId)
  }
  // immediately start streaming the response
  const dataStream = createDataStream({
    execute: async dataStreamWriter => {
      const area = world.getArea(parentTraceId)

      area.content = {
        model,
        system: systemPrompt,
        messages,
        tools,
        // toolCallStreaming: true,
        experimental_telemetry: {
          isEnabled: true,
          metadata: {
            langfuseTraceId: parentTraceId,
            langfuseUpdateParent: false,
          }
        },
        onFinish: onEnd
      }

      const result = streamText(area.content);

      result.mergeIntoDataStream(dataStreamWriter);

      getLangfuse()?.flushAsync();
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

  return stream(c, async stream => {
    await stream.pipe(dataStream.pipeThrough(new TextEncoderStream()))
  });
});

const port = process.env.PORT || "3000";
serve({
  fetch: app.fetch,
  port: parseInt(port),
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`);
});