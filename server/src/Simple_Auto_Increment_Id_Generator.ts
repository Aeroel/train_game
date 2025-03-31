import { log } from "console";

export { Simple_Auto_Increment_Id_Generator };

class Simple_Auto_Increment_Id_Generator {
    private static tagCounters = new Map<string, number>();

    static generateId(tag?: string | undefined): number { 
        if (tag === undefined) {
            tag = "General";
        }
        const currentCount = this.tagCounters.get(tag) ?? 0;
        const newCount = currentCount + 1;
        this.tagCounters.set(tag, newCount);
        return newCount;
    }
}
