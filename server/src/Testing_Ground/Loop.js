"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Sub_Positions_js_1 = require("#root/Collision_Stuff/Collision_Checking_Methods/Sub_Positions/Sub_Positions.js");
var Base_Entity_js_1 = require("#root/Entities/Base_Entity.js");
var a = new Base_Entity_js_1.Base_Entity();
a.velocity.x.Add_Component({
    key: "hhh", value: 10
});
a.velocity.y.Add_Component({
    key: "hhh", value: 100
});
var b = new Base_Entity_js_1.Base_Entity();
b.velocity.x.Add_Component({
    key: "hhh", value: 10
});
b.velocity.y.Add_Component({
    key: "hhh", value: 100
});
console.log(Sub_Positions_js_1.Sub_Positions.Check_For_Collision(a, b));
