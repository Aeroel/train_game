export { Entity }
class Entity {
  x = 0;
  y = 0;
  width = 0 ;
  height = 0;
  color = "white";
  tags = new Array();
  constructor() {
    this.addTag("Entity");
  }
  update() {
    
  }
  addTag(tag) {
    this.tags.push(tag);
  }
  removeTag(tag) {
    const tagIndex = this.tags.indexOf(tag);
    const tagExistsInArray = (tagIndex !== -1);
    if (!tagExistsInArray) {
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
  getX() {
    return this.x;
  }
  getY() {
    return this.y;
  }
  getWidth() {
    return this.width;
  }
  getHeight() {
    return this.height;
  }

}