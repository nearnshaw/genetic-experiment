import { newSon } from "./reproduce";
import { WalkAround } from "./random-walking";
import { DieSLowly } from "./survival";


engine.addSystem(new WalkAround())
engine.addSystem(new DieSLowly())

// first dogs

newSon()
newSon()
// newSon()
// newSon()
// newSon()
