
@Component('progressBar')
export class ProgressBar {
  value: number = 0
  fullLength: number = 1
  color: Material
  parentEntity: IEntity
  entity: IEntity
  foregroundTransform: Transform
  redMaterial: Material
  yellowMaterial: Material
  greenMaterial: Material
  
  constructor(entity: IEntity) {
    this.entity = entity

    this.redMaterial = new Material()
    this.redMaterial.albedoColor = Color3.Red()
    this.yellowMaterial = new Material()
    this.yellowMaterial.albedoColor = Color3.Yellow()
    this.greenMaterial = new Material()
    this.greenMaterial.albedoColor = Color3.Green()

    this.entity.addComponentOrReplace(this.greenMaterial)

    let background = new Entity()
    engine.addEntity(background)

    background.setParent(entity)
    background.addComponent(new PlaneShape())

    background.addComponent(new Transform({
      scale: new Vector3(0.82, 0.15, 1)
    }))

    let foreground = new Entity()
    foreground.addComponent(new PlaneShape())
    foreground.setParent(background)

    this.foregroundTransform = new Transform({
      position: new Vector3(0, 0, -0.05),
      scale: new Vector3(0.95, 0.8, 1)
    })
    
    foreground.addComponent(this.foregroundTransform)
    engine.addEntity(foreground)
  }

  UpdateNormalizedValue(newValue: number){
    if(newValue > 1)
      newValue = 1
    else if(newValue < 0)
      newValue = 0

    if(newValue < 0.3 && this.value >= 0.3){
      this.entity.removeComponent(Material)
      this.entity.addComponentOrReplace(this.redMaterial)
    } 
    else if(newValue < 0.7 && this.value >= 0.7){
      this.entity.removeComponent(Material)
      this.entity.addComponentOrReplace(this.yellowMaterial)
    } else {
      this.entity.removeComponent(Material)
      this.entity.addComponentOrReplace(this.greenMaterial)
    }

    this.value = newValue

    let width = Scalar.Lerp(0, this.fullLength, this.value)
    this.foregroundTransform.scale.x = width
    this.foregroundTransform.position.x = -this.fullLength / 2 + width / 2
  }
}