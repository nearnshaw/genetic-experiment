import { environments } from "./Environment";

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

let grabbedOffset = new Vector3(0.5, 0.5, 0)



// object to get user position and rotation
const camera = Camera.instance

// start object grabber system
let objectGrabber = new Entity()
objectGrabber.addComponent(
  new Transform({
    position: camera.position,
    rotation: camera.rotation
  })
)
engine.addEntity(objectGrabber)



// component group for all grabbable objects
export const grabbableObjects = engine.getComponentGroup(
  GrabableObjectComponent
)

@Component('objectGrabberComponent')
export class ObjectGrabberComponent {
  grabbedObject: IEntity = null
}

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
	  let transform = objectGrabber.getComponent(Transform)
	  transform.position = camera.position
	  transform.rotation = camera.rotation

    // let lerpingSpeed = 15
    // this.transform.position = Vector3.Lerp(
    //   this.transform.position,
    //   this.targetPosition,
    //   deltaTime * lerpingSpeed
    // )

    // this.transform.rotation = Quaternion.Slerp(
    //   this.transform.rotation,
    //   this.targetRotation,
    //   deltaTime * lerpingSpeed
    // )
  }
}

export function grabObject(grabbedObject: IEntity) {
   
    if (!objectGrabber.children[0]) {
      log('grabbed object')
      

      grabbedObject.getComponent(GrabableObjectComponent).grabbed = true
      grabbedObject.getParent().setParent(objectGrabber)
      grabbedObject.getParent().getComponent(Transform).position = grabbedOffset

      //objectGrabber.getComponent(GrabableObjectComponent).grabbedObject = grabbedObject
    } else {
      log('already holding')
    }
  }

export function dropObject(grabbedObject: IEntity) {
	
	//if (grabbedObject.getParent() != objectGrabber) return


    let area = getClosestArea(
      Camera.instance.position
    )

    
    if (area) {
		grabbedObject.getParent().setParent(area)
		grabbedObject.getParent().getComponent(Transform).position = new Vector3(2, 0, 2)
		grabbedObject.getComponent(GrabableObjectComponent).grabbed = false
		//grabbedObject.getComponent(GrabableObjectComponent).falling = true
		//grabbedObject.getComponent(GrabableObjectComponent).origin = 0.3
		//grabbedObject.getComponent(GrabableObjectComponent).fraction = 0
	} else {
      log('not possible to drop here')
    }
  }


export function getClosestArea(playerPos: Vector3){
	for (let environment of environments.entities) {
		let dist = Vector3.DistanceSquared(environment.getComponent(Transform).position, playerPos)
		if (dist < 4){
			return environment
		}
	}
  }