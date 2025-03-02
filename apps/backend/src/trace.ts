import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { NodeSDK } from "@opentelemetry/sdk-node";
import c from "config";
import { LangfuseExporter } from "langfuse-vercel";

export function initTrace() {
  let sdk: NodeSDK | undefined;
  if (c.get('langfuse.enabled')) {

    sdk = new NodeSDK({
      traceExporter: new LangfuseExporter(
        {
          // debug: true,
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

  const shutdownHandler = (signal: string) => {
    sdk?.shutdown();
    process.exit(0);
  };

  process.on('SIGINT', () => shutdownHandler('SIGINT'));
  process.on('SIGTERM', () => shutdownHandler('SIGTERM'))
}

export function getLangfuse() {
  return LangfuseExporter.langfuse
}