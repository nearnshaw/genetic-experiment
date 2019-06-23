
//  PROBABILITY
let MutationProb: number = 0.7
// 0 TO 1   how likely each genome will have some level of mutation

//  1 ->  -0.5 TO + 0.5
let MutationMaxSpreads: number[] = [
  0.25,  // size
  20,   // temperature
  0.25,  // ears 
  0.25,  // eyes
  0.25,  // feet
  0.25,  // mouth
  0.25,  // nose
  0.25,  // tail
  0.25  // wings
]

// let TemperatureButtonValue = 25
let TemperatureButtonValue = 10 //MutationMaxSpreads[1] / 2


let framesBetweenDamage = 15

// Coefficient to multiply damage done on every frame
let DamageCoeff = 0.005 * framesBetweenDamage



// Minimum temperature diff for the creature to start receiving damage
let MinTemperatureDiffForDamage = 8

// Creatures at min temperature (-100) will have this scale factor
let MinCreatureScale = 0.25

// Creatures at max temperature (100) will have this scale factor
let MaxCreatureScale = 2.3


let ColdEnvironmentTemperature = -30
let HotEnvironmentTemperature = 60

let neutralEnvironmentPosition = new Vector3(16, 0.01, 40)
let hotEnvironmentPosition = new Vector3(48, 0.01, 32)
let coldEnvironmentPosition = new Vector3(48, 0.01, 48)

let coldIconTex = new Texture("images/cold-thermometer.png")
let coldIconMaterial = new Material()
coldIconMaterial.alphaTexture = coldIconMaterial.albedoTexture = coldIconTex

let hotIconTex = new Texture("images/hot-thermometer.png")
let hotIconMaterial = new Material()
hotIconMaterial.alphaTexture = hotIconMaterial.albedoTexture = hotIconTex

let neutralIconTex = new Texture("images/thermometer.png")
let neutralIconMaterial = new Material()
neutralIconMaterial.alphaTexture = neutralIconMaterial.albedoTexture = neutralIconTex

let chippaIconTex = new Texture("images/Chipaicon.png")
let chippaIconMaterial = new Material()
chippaIconMaterial.alphaTexture = chippaIconMaterial.albedoTexture = chippaIconTex

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
