export class Card {
    constructor() {
	this.context = {};
    }
    set(data) {
	Object.assign(this.context, data);
	return this;
    }
    create() {
	const {scene, image} = this.context;
	const sprite = scene.newSprite(0, 0, image);

	sprite.logic = () => this;	
	Object.assign(this.context, {sprite});
	
	return this;
    }
    sprite() {
	const {sprite} = this.context;
	return sprite;
    }
}
