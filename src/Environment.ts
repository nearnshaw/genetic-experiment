
@Component("environment")
export class Environment {
  temperature: number
  position: Vector3
  onCreaturesCountUpdated!: any
  size: number
  
  private creaturesCount: number = 0

  constructor(temp: number, pos: Vector3, size: number) {
    this.temperature = temp,
	this.position = pos,
	this.size = size
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
