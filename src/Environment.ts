import { Creature } from "./Creature"
import { GeneType } from "./Genome"

@Component("environment")
export class Environment {
  temperature: number
  onCreaturesCountUpdated!: any
  
  private creaturesCount: number = 0

  constructor(temp: number) {
    this.temperature = temp
  }

  addCreature() {
    this.creaturesCount++

    if(this.onCreaturesCountUpdated)
      this.onCreaturesCountUpdated(this.creaturesCount)
  }

  removeCreature() {
    this.creaturesCount--

    if(this.onCreaturesCountUpdated)
      this.onCreaturesCountUpdated(this.creaturesCount)
  }

  getCreaturesCount() {
    return this.creaturesCount
  }
}
