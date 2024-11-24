export class Counter {
    constructor() {
	this.ctx = {
	    width: 25,
	    value: 0,
	    duration: 500,
	    ease: 'Cubic.easeOut',
	};
    }
    set(data) {
	Object.assign(this.ctx, data);
	return this;
    }
    create() {
	const {scene, image, x, y, width, value} = this.ctx;
	const icon = scene.newSprite(x, y, image); icon.setScale(width/icon.width);
	const yy = y - 0.5*icon.displayHeight - 0.6*width;
	const text = scene.newText(x, yy, value).setOrigin(0.5);
	Object.assign(this.ctx, {icon, text});
	return this;
    }
    async spawn() {
	const {icon, text, duration, ease} = this.ctx;
	icon.tween({scale: {from: 0, to: icon.scale}, duration, ease});
	await text.tween({scale: {from: 0, to: text.scale}, duration, ease});
	return this;
    }
    async add(amount) {
	const {text, value, duration, ease} = this.ctx
	const newValue = value + amount;
	text.text = newValue;
	Object.assign(this.ctx, {value: newValue});
	await text.tween({scale: {from: 2*text.scale, to: text.scale, duration, ease}});	
    }
    get() {
	const {value} = this.ctx;
	return value;
    }
}
