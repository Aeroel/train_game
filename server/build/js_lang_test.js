class A {
    constructor() {
        this.add();
    }
    add() {
        const B_Funcs = Object.getOwnPropertyNames(B.prototype);
        console.log(B_Funcs);
        B_Funcs.forEach(funcName => {
            if (funcName === 'constructor')
                return;
        });
    }
}
class B {
    l = '444';
    fu() {
        console.log('333');
    }
}
const a = new A();
export {};
