import { ZodObject, ZodRawShape, z } from "zod"
import { tool } from "ai"

export function action<T extends ZodRawShape>(description: string, parametersSchema: ZodObject<T>) {
  return function (
    target: any,
    context: ClassMethodDecoratorContext<any, any>
  ) {
    const originalMethod = context.kind === 'method' ? target : undefined;
    if (!originalMethod) {
      throw new Error('@action can only be used on methods');
    }

    // Replace the original method with a wrapped version that includes validation
    function replacementMethod(this: any, ...args: any[]) {
      // Validate parameters using Zod
      const validatedParams = parametersSchema.parse(args[0]);
      return originalMethod.call(this, validatedParams);
    }

    // Store metadata about the action
    context.addInitializer(function () {
      if (!this.__actions) {
        this.__actions = new Map();
      }
      
      this.__actions.set(context.name.toString(), {
        description,
        parametersSchema,
        method: replacementMethod
      });
    });

    return replacementMethod;
  };
}

export abstract class BaseAgent {
  public abstract name: string;

  public async setup(context: any, parameters: any) { };

  public toTools() {
    const tools: { [key: string]: any } = {};
    const actions: Map<string, { description: string, parametersSchema: ZodObject<any>, method: any }> = (this as any).__actions;

    // Filter for methods that are marked as actions
    for (const [name, { description, parametersSchema, method }] of actions.entries()) {
      if (typeof method === 'function') {
        tools[`${this.name}-${name}`] = tool({
          description,
          parameters: parametersSchema,
          execute: method.bind(this),
        });
      }
    }

    return tools;
  }
}