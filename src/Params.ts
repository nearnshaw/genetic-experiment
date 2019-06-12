
//  PROBABILITY
let MutationProb: number = 0.7
// 0 TO 1   how likely each genome will have some level of mutation

//  1 ->  -0.5 TO + 0.5
let MutationMaxSpreads: number[] = [
  0.5,  // speed
  20   // temperature
]

// let TemperatureButtonValue = 25
let TemperatureButtonValue = MutationMaxSpreads[1] / 2

// Coefficient to multiply damage done on every frame
let DamageCoeff = 0.05

// Minimum temperature diff for the creature to start receiving damage
let MinTemperatureDiffForDamage = 10

// Creatures at min temperature (-100) will have this scale factor
let MinCreatureScale = 0.25

// Creatures at max temperature (100) will have this scale factor
let MaxCreatureScale = 2.5

let redMaterial = new Material()
redMaterial.albedoColor = Color3.Red()
let yellowMaterial = new Material()
yellowMaterial.albedoColor = Color3.Yellow()
let greenMaterial = new Material()
greenMaterial.albedoColor = Color3.Green()
let hotMaterial = new Material()
hotMaterial.albedoColor = Color3.Red()
let coldMaterial = new Material()
coldMaterial.albedoColor = Color3.Blue()
let neutralMaterial = new Material()
neutralMaterial.albedoColor = Color3.Gray()

// INITIAL NUMBER OF CREATURES

// FOOD

// DEFAULT HEALTH

// HEALTH DECAY PER FRAME

// FOOD HEALTH BENEFITS

// PROBABILITY OF REPRODUCTION

// NEUTRAL LAND:

// FOOD

// HEAT

// RADIOACTIVIY

//... IDEM OTHER LANDS
