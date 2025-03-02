import { LanguageModel, ToolSet } from "ai"

const debug = require('debug')('hookSystem')

export type hookFn<T, R> = (object: R, args: T) => R

export type ModelContent = { model: LanguageModel, traceID: string }

// 定义所有钩子及其类型
export interface Hooks {
  onSystemPromptBuild: hookFn<ModelContent, string>;
  onToolBuild: hookFn<ModelContent, ToolSet>;
}

// 从Hooks类型自动生成HookType类型
export type HookType = keyof Hooks;

// HookTypeMap就是Hooks本身
export type HookTypeMap = Hooks;

export class HookSystem {
  hooks = new Map<string, Set<Function>>()

  run<K extends HookType>(
    type: K,
    self: HookTypeMap[K] extends hookFn<any, infer R> ? R : never,
    args: HookTypeMap[K] extends hookFn<infer T, any> ? T : never
  ): HookTypeMap[K] extends hookFn<any, infer R> ? R : never {
    let result: any = self;
    for (const fn of this.getHooks(type)) {
      result = (fn as Function)(result, args);
    }
    return result;
  }

  register<K extends HookType>(
    type: K,
    fn: HookTypeMap[K]
  ) {
    this.getHooks(type).add(fn as Function)
  }

  delete<K extends HookType>(
    type: K,
    fn: HookTypeMap[K]
  ) {
    this.getHooks(type).delete(fn as Function)
  }

  private getHooks<K extends HookType>(name: K) {
    if (!this.hooks.has(name)) this.hooks.set(name, new Set<Function>())
    return this.hooks.get(name)!
  }
}

export const hookSystem = new HookSystem()