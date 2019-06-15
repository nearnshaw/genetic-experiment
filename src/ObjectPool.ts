export class Pool {
  pool: Entity[] = []
  max?: number = 1000
  constructor(max: number = 1000) {
    this.pool = []
    this.max = max

    // generate initial instances
    for (let index = 0; index < max/4; index++) {
	  this.newEntity()
    }
  }

  getEntity() {
    for (let i = 0; i < this.pool.length; i++) {
      const entity = this.pool[i]
      if (!entity.isAddedToEngine()) {
        return entity
      }
    }

    if (this.pool.length < this.max) {
      return this.newEntity()
    }

    return null
  }

  newEntity() {
    const instance = new Entity()
    instance.name = (Math.random() * 10000).toString()
    this.pool.push(instance)
    return instance
  }
}
