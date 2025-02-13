import { ids } from "./ids"
import { action, BaseAgent, sleep } from "@easyagent/lib"
import { GetPricesParameters, GetPricesResult, GetPricesParametersSchema } from "./types"

/**
 * Agent to fetch price data from Pyth
 */
export class PythFetcherAgent extends BaseAgent {
  public name = "pyth-fetcher"
  
  public async setup() {

  }

  @action("Fetch price data from Pyth", GetPricesParametersSchema)
  public async get_prices(parameters: GetPricesParameters): Promise<GetPricesResult> {
    const params = new URLSearchParams()
    for (const symbol of parameters.symbols) {
      params.append("ids[]", ids.find(id => id.assetSymbol === symbol)!.priceFeedId)
    }

    const res = await fetch("https://hermes.pyth.network/v2/updates/price/latest?" + params.toString())
    const data: GetPricesResult = await res.json()

    return data
  }
}

export default PythFetcherAgent