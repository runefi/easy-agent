import { ZodObject, ZodRawShape, z } from "zod"
import { tool } from "ai"
import { hookSystem } from "./HookSystem";
import { World } from "./World";

export function action<T extends ZodRawShape>(description: string, parametersSchema?: ZodObject<T>) {
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
      // Validate parameters using Zod if schema exists and args are provided
      const validatedParams = args.length && parametersSchema ? parametersSchema.parse(args[0]) : undefined;
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
  constructor(public world: World) {}

  public async setup(context: any, parameters: any) {};
  
  get hooks(){
    return hookSystem
  }
  
  /**
   * Register tools built by this agent
   */
  public registerTools() {
    hookSystem.register('onToolBuild', (tools, context) => {
      return Object.assign(tools, this.toTools())
    })
  }

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