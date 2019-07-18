import { environments, Environment } from "./Environment";
import { Creature } from "./Creature";

@Component('grabableObjectComponent')
export class GrabableObjectComponent {
  grabbed: boolean = false
  constructor(
    grabbed: boolean = false,
  ) {
    this.grabbed = grabbed
  }
}

@Component('objectGrabberComponent')
export class ObjectGrabberComponent {
}

let grabbedOffset = new Vector3(1.5, -1, 0.5)


// object to get user position and rotation
const camera = Camera.instance

// start object grabber system
let objectGrabber = new Entity()
objectGrabber.addComponent(
  new Transform({
    position: camera.position.clone(),
	rotation: camera.rotation.clone(),
	scale: new Vector3(0.25, 0.25, 0.25)
  })
)
objectGrabber.addComponent(new ObjectGrabberComponent())
engine.addEntity(objectGrabber)



// component group for all grabbable objects
export const grabbableObjects = engine.getComponentGroup(
  GrabableObjectComponent
)



export class ObjectGrabberSystem implements ISystem {
  //transform: Transform
  //objectGrabberComponent: ObjectGrabberComponent
  //objectGrabber: IEntity
//   targetPosition: Vector3
//   targetRotation: Quaternion
  constructor() {
   
  }

  update(deltaTime: number) {
	  if (grabbedObject == null) {
		  //log("no children")
		  return
		}

	  let transform = objectGrabber.getComponent(Transform)
	  transform.position = camera.position.clone()
	  transform.rotation = camera.rotation.clone()

  }
}

export function grabObject(newGrabbedObject: IEntity) {
   
    if (!objectGrabber.children[0]) {
      log('grabbed object')
      
      newGrabbedObject.getComponent(GrabableObjectComponent).grabbed = true
      newGrabbedObject.setParent(objectGrabber)
      newGrabbedObject.getComponent(Transform).position = grabbedOffset.clone()
      newGrabbedObject.getComponent(Creature).SetEnvironment(null)

	    grabbedObject = newGrabbedObject
    } else {
      log('already holding')
    }
  }

export function dropObject(environment: Environment = null) {
	
	//if (grabbedObject.getParent() != objectGrabber) return
    if(!grabbedObject) return

    environment = environment? environment : getClosestArea(Camera.instance.position)!.getComponent(Environment)
    
    if (environment) {
		grabbedObject.setParent(null)

		grabbedObject.getComponent(Transform).position = environment.position
		grabbedObject.getComponent(GrabableObjectComponent).grabbed = false
    grabbedObject.getComponent(Creature).SetEnvironment(environment)
    grabbedObject.getComponent(Creature).TargetRandomPosition()
		
		grabbedObject = null

	} else {
      log('not possible to drop here')
    }
  }


export function getClosestArea(playerPos: Vector3){
	for (let environment of environments.entities) {
		let dist = Vector3.DistanceSquared(environment.getComponent(Transform).position, playerPos)
		if (dist < 25){
			return environment
		}
	}
	return null
  }