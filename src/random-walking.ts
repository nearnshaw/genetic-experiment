import { chabones, Traits, newSon } from "./reproduce";

// Custom component with data for bird flight

@Component('lerpData')
export class LerpData {
  oldPos: Vector3 = Vector3.Zero()
  nextPos: Vector3 = Vector3.Zero()
  fraction: number = 0
  pause: number = 0
  constructor(oldPos: Vector3, nextPos: Vector3, fraction: number,  pause: number){
    this.oldPos = oldPos
    this.nextPos = nextPos
    this.fraction = fraction
    this.pause = pause
  }
}

// Component group holding all birds
//export const birds = engine.getComponentGroup(LerpData)

///////////////
// Systems

// System that updates each bird on every frame

export class WalkAround implements ISystem  {
  update(dt: number) {
    for (let pibe of chabones.entities) {
      let transform = pibe.getComponent(Transform)
	  let lerp = pibe.getComponent(LerpData)
	  let traits = pibe.getComponent(Traits)
      if (lerp.fraction < 1) {
        transform.position = Vector3.Lerp(lerp.oldPos, lerp.nextPos, lerp.fraction)
        lerp.fraction += 1/50 * traits.speed
      } else if (lerp.pause > 0) {
        lerp.pause -= 3
      } else {
        log("new position")
        lerp.oldPos = transform.position
        lerp.nextPos = newRandomPos()
        lerp.fraction = 0
        lerp.pause = Math.random() * 500
		transform.lookAt(lerp.nextPos)
		
		// temporary
		newSon(pibe)
      }
    }
  }
}

export function newRandomPos(){
	let x = (Math.random() * 12) + 2 
	let y = 0 
	let z = (Math.random() * 12) + 2
	let pos = new Vector3(x,y,z)
	return pos
}