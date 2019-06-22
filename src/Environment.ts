import { Creature } from "./Creature"
import { GeneType } from "./Genome"

@Component("environment")
export class Environment {
  temperature: number
  constructor(temp: number) {
    this.temperature = temp
  }
}

export const environments = engine.getComponentGroup(Environment)
