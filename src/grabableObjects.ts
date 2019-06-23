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
  grabbedObject: IEntity = null
}

let grabbedOffset = new Vector3(0.5, 1, 0)

// workaround since `setParent(null)` won't work
let dummyPosParent = new Entity()
engine.addEntity(dummyPosParent)


// object to get user position and rotation
const camera = Camera.instance

// start object grabber system
let objectGrabber = new Entity()
objectGrabber.addComponent(
  new Transform({
    position: camera.position.clone(),
    rotation: camera.rotation.clone()
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
	  if (objectGrabber.getComponent(ObjectGrabberComponent).grabbedObject == null) {
		  //log("no children")
		  return
		}

	  let transform = objectGrabber.getComponent(Transform)
	  transform.position = camera.position.clone()
	  transform.rotation = camera.rotation.clone()

  }
}

export function grabObject(grabbedObject: IEntity) {
   
    if (!objectGrabber.children[0]) {
      log('grabbed object')
      
      grabbedObject.getComponent(GrabableObjectComponent).grabbed = true
      grabbedObject.setParent(objectGrabber)
	  grabbedObject.getComponent(Transform).position = grabbedOffset.clone()
	  grabbedObject.getComponent(Creature).environment = null

	  objectGrabber.getComponent(ObjectGrabberComponent).grabbedObject = grabbedObject
    } else {
      log('already holding')
    }
  }

export function dropObject() {
	
	//if (grabbedObject.getParent() != objectGrabber) return


    let closestArea = getClosestArea(
      Camera.instance.position
    )

    
    if (closestArea) {
		
		let grabbedObject = objectGrabber.getComponent(ObjectGrabberComponent).grabbedObject
		
		// workaround ... parent should be null
		grabbedObject.setParent(dummyPosParent)

		grabbedObject.getComponent(Transform).position = closestArea.getComponent(Environment).position
		grabbedObject.getComponent(GrabableObjectComponent).grabbed = false
		grabbedObject.getComponent(Creature).environment = closestArea.getComponent(Environment)
		
		objectGrabber.getComponent(ObjectGrabberComponent).grabbedObject = null

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