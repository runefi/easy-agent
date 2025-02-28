import { action, BaseAgent } from "@easyagent/lib"
import { ids } from "./ids"
import { GetPricesParameters, GetPricesParametersSchema, GetPricesResult, PythPricesResult } from "./types"

/**
 * Agent to fetch price data from Pyth
 */
export class PythFetcherAgent extends BaseAgent {
  public name = "pyth-fetcher"
  
  public async setup(context: any, parameters: any): Promise<void> {
    this.registerTools()
  }

  @action("Fetch price data from Pyth", GetPricesParametersSchema)
  public async get_prices(parameters: GetPricesParameters): Promise<GetPricesResult> {
    const params = new URLSearchParams()
    for (const symbol of parameters.symbols) {
      params.append("ids[]", ids.find(id => id.assetSymbol === symbol)!.priceFeedId)
    }

    const res = await fetch("https://hermes.pyth.network/v2/updates/price/latest?" + params.toString())
    const data: PythPricesResult = await res.json()
    // 处理一下数据，AI的计算能力很弱，所以最好是帮他计算好需要的内容。
    const result = data.parsed.map(item => ({
      name: ids.find(id => id.priceFeedId.includes(item.id))!.assetSymbol,
      price: adjustPrice(item.price.price, item.price.expo)
    }))

    return result;
  }
}

function adjustPrice(price: string, expo: number) {
  if (expo >= 0) return price + '0'.repeat(expo);
  const insertAt = price.length + expo;
  return price.slice(0, insertAt) + '.' + price.slice(insertAt);
}