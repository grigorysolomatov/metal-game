export class Counter {
    constructor() {
	this.context = {
	    width: 25,
	    value: 0,
	    duration: 500,
	    ease: 'Cubic.easeOut',
	};
    }
    set(data) {
	Object.assign(this.context, data);
	return this;
    }
    create() {
	const {scene, image, x, y, width, value} = this.context;
	const icon = scene.newSprite(x, y, image); icon.setScale(width/icon.width);
	const yy = y - 0.5*icon.displayHeight - 0.6*width;
	const text = scene.newText(x, yy, value).setOrigin(0.5);
	Object.assign(this.context, {icon, text});
	return this;
    }
    async spawn() {
	const {icon, text, duration, ease} = this.context;
	icon.tween({scale: {from: 0, to: icon.scale}, duration, ease});
	await text.tween({scale: {from: 0, to: text.scale}, duration, ease});
	return this;
    }
    async add(amount) {
	const {text, value, duration, ease} = this.context
	const newValue = value + amount;
	text.text = newValue;
	Object.assign(this.context, {value: newValue});
	await text.tween({scale: {from: 2*text.scale, to: text.scale, duration, ease}});	
    }
}
