import { z } from "zod"
import { names } from "./ids"

export type GetPricesResult = {
  binary: {
    encoding: string
    data: Array<string>
  }
  parsed: Array<{
    id: string
    price: {
      price: string
      conf: string
      expo: number
      publish_time: number
    }
    ema_price: {
      price: string
      conf: string
      expo: number
      publish_time: number
    }
    metadata: {
      slot: number
      proof_available_time: number
      prev_publish_time: number
    }
  }>
}

export const GetPricesParametersSchema = z.object({
  symbols: z.array(z.enum(names)),
})

export type GetPricesParameters = z.infer<typeof GetPricesParametersSchema>
