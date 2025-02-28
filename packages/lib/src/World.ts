import { LanguageModelV1, streamText } from "ai";

export type Area = {
  content?: Parameters<typeof streamText>[0]
} 

export class World{
  public area: Map<string, Area>
  constructor(public model:LanguageModelV1, ) {
    this.area = new Map()
  }
  
  getArea(name: string): Area {
    if (!this.area.has(name)) {
      this.area.set(name, {})
    }
    return this.area.get(name)!
  }
  
  removeArea(name: string): void {
    this.area.delete(name)
  }
}

