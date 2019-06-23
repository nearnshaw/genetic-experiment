
@Component("environment")
export class Environment {
  temperature: number
  position: Vector3
  onCreaturesCountUpdated!: any
  
  private creaturesCount: number = 0

  constructor(temp: number, pos: Vector3) {
    this.temperature = temp,
    this.position = pos
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

export const environments = engine.getComponentGroup(Environment)
