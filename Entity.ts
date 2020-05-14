export default abstract class Entity {
    id: number;

    protected constructor(id: number) {
        this.id = id;
    }
}
