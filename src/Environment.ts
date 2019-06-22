import { Creature } from "./Creature"
import { GeneType } from "./Genome"

@Component("environment")
export class Environment {
  temperature: number
  position: Vector3
  constructor(temp: number, pos: Vector3) {
	this.temperature = temp,
	this.position = pos
  }
}

export const environments = engine.getComponentGroup(Environment)
