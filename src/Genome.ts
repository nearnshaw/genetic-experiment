export enum GeneType {
  speed,
  size,
  warm,
  water,
  height,
  COUNT
}

const GENES_AMOUNT = 2

@Component("genome")
export class Genome {
  genes: number[]

  constructor(genes: number[]) {
    this.genes = genes
  }

  CopyFrom(otherGenome: Genome) {
    for (var i = 0; i < this.genes.length; i++) {
      if (i == otherGenome.genes.length) return

      this.genes[i] = otherGenome.genes[i]
    }
  }

  // Based on a mutation probability param
  Mutate(m) {
    for (var i = 0; i < this.genes.length; i++) {
      if (Math.random() < m) {
        this.genes[i] += Math.random() - 0.5

        this.genes[i] = Math.max(this.genes[i], 0.1)
      }
    }
  }
}
