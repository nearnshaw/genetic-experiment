import { chabones } from "./reproduce";

@Component('health')
export class Health {
  health: number
 
  constructor(health: number = 100){
	this.health = health
  }
}


export class DieSLowly implements ISystem  {
	update(dt: number) {
	  for (let pibe of chabones.entities) {
			let health = pibe.getComponent(Health).health 
			health -= Math.random() / 10
			pibe.getComponent(Health).health = health
			if (health < 0){
				engine.removeEntity(pibe)
				log("RIP")
			}

	  }
	}
}