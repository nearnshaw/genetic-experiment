import { environments, Environment } from "./Environment";
import { Creature } from "./Creature";

@Component('grabableObjectComponent')
export class GrabableObjectComponent {
  grabbed: boolean = false
  //falling: boolean = false
  //origin: number = 0.4
  //target: number = 0
  //fraction: number = 0
  constructor(
    grabbed: boolean = false,
	//falling: boolean = false,
	//origin: number = 0,
	//fraction: number = 0
  ) {
    this.grabbed = grabbed
    //this.falling = falling
  }
}

@Component('objectGrabberComponent')
export class ObjectGrabberComponent {
  grabbedObject: IEntity = null
}

let grabbedOffset = new Vector3(0.5, 0.5, 0)

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



// export class DropObjects implements ISystem {
//   update(dt: number) {
//     for (let object of grabbableObjects.entities) {
//       let ObjectComponent = object.getComponent(GrabableObjectComponent)
//       let transform = object.getComponent(Transform)

//       if (ObjectComponent.falling) {
//         ObjectComponent.fraction += dt * 3
//         if (ObjectComponent.fraction > 1) {
//           ObjectComponent.falling = false
//         }
//         transform.position.y = Scalar.Lerp(
//           ObjectComponent.origin,
//           ObjectComponent.target,
//           ObjectComponent.fraction
//         )
//       }
//     }
//   }
// }

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
		  return false
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