import { LanguageModel, ToolSet } from "ai"

const debug = require('debug')('hookSystem')

//典型的管道处理模式，多个钩子函数可以形成处理链
export type hookFn<T, R> = (object: R, args: T) => R

export type ModelContent = { model: LanguageModel, traceID: string }

// 定义所有钩子及其类型
export interface Hooks {
  onSystemPromptBuild: hookFn<ModelContent, string>; // 它的输入类型为 ModelContent，输出类型为 string
  onToolBuild: hookFn<ModelContent, ToolSet>; // 它的输入类型为 ModelContent，输出类型为 ToolSet
}

// 从Hooks类型自动生成HookType类型
export type HookType = keyof Hooks;

// HookTypeMap就是Hooks本身
export type HookTypeMap = Hooks;

export class HookSystem {
  // 存储所有注册的钩子函数，按类型分类
  hooks = new Map<string, Set<Function>>()

  // 执行特定类型的钩子链 限定只能使用预定义的钩子类型
  run<K extends HookType>(
    type: K,// 通过条件类型 hookFn<any, infer R> 自动推导输入输出类型
    self: HookTypeMap[K] extends hookFn<any, infer R> ? R : never, // 初始值 
    args: HookTypeMap[K] extends hookFn<infer T, any> ? T : never  // 参数
  ): HookTypeMap[K] extends hookFn<any, infer R> ? R : never {
    let result: any = self;
    // 链式调用所有注册的钩子
    for (const fn of this.getHooks(type)) {
      result = (fn as Function)(result, args);
    }
    return result;
  }

  // 注册钩子函数
  register<K extends HookType>(
    type: K,
    fn: HookTypeMap[K]
  ) {
    this.getHooks(type).add(fn as Function)
  }

  // 移除钩子函数
  delete<K extends HookType>(
    type: K,
    fn: HookTypeMap[K]
  ) {
    this.getHooks(type).delete(fn as Function)
  }

  // 获取指定类型的钩子集合
  private getHooks<K extends HookType>(name: K) {
    if (!this.hooks.has(name)) this.hooks.set(name, new Set<Function>())
    return this.hooks.get(name)!
  }
}

export const hookSystem = new HookSystem()