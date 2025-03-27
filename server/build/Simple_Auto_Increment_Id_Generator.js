export { Simple_Auto_Increment_Id_Generator };
class Simple_Auto_Increment_Id_Generator {
    static nextId = 0;
    static generateId() {
        const nextId = Simple_Auto_Increment_Id_Generator.nextId;
        Simple_Auto_Increment_Id_Generator.incNextId();
        return nextId;
    }
    static incNextId() {
        Simple_Auto_Increment_Id_Generator.nextId++;
    }
}
