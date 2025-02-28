import { action, BaseAgent } from "@easyagent/lib"
import { generateText, ToolExecutionOptions } from "ai"
import { z } from "zod"

export const ParametersSchema = z.object({
  uuid: z.string().describe("你当前的对话ID"),
})

export class ThinkingAgent extends BaseAgent {
  public name = "thinking"

  public async setup(context: any, parameters: any): Promise<void> {
    // setup prompt
    this.hooks.register('onSystemPromptBuild', (systemPrompt, context) => {
      return systemPrompt + `您的工作流程是，当你收到消息的时候，你需要开始思考，然后根据思考结果进行重组。你必须在任何输出前就要进入思考模式， 因为您的思考类似于人类的心理活动，所以你不能在思考模式前输出任何内容。在思考模式时，你的思考内容需要放在<think> </think>标签之内，并且思考完成后，根据你的思考结果来进行输出。你需要和人类一样思考，需要分析用户语言的意图，目的，以及问题中可能存在的陷阱，你思考的结果将会交由其他智能助手进行分析，因此你可以一步一步的思考问题，并且尽可能的让把问题分解的更加细致，同样的，你的数学能力并不强，因此你需要更加仔细的思考。`
    })
  }
}