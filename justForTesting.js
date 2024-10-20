 class A {

}
class B extends A {

}
class C extends A {
    
}
const a = new A();
const b = new B();
const c = new C();
console.log([
    (b instanceof B),
    (b instanceof A),
    (b instanceof C),
])