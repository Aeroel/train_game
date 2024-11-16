export { Entity }
class Entity {
    x;
    y;
    width;
    height;
    color = "white";
    tags;
    constructor() {
      this.tags = ["Entity"];
    }
    addTag(tag) {
      this.tags.push(tag);
    }
    removeTag(tag) {
      const tagIndex = this.tags.indexOf(tag);
      const tagExistsInArray = (tagIndex !== -1);
      if(!tagExistsInArray) {
        return false;
      }
      this.tags.splice(tagIndex, 1);
    }
    hasTag(tag) {
      const answer = (this.tags.includes(tag))
      return answer;
    }
    setX(x) {
       this.x = x;
    }
    setY(y) {
      this.y = y;
    }
    setWidth(width) {
      this.width = width;
    }
    setHeight(height) {
      this.height = height;
    }
    setColor(color) {
      this.color = color;
    }
}