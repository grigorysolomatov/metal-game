export class CardLogic {
    constructor() {
	this.ctx = {};
    }
    set(data) {
	Object.assign(this.ctx, data);
	return this;
    }
    attach(sprite) {
	this.sprite = sprite;
	sprite.logic = this;
	return this;
    }
    async activate(...args) {
	const {effect} = this.ctx;
	const out = await effect(...args);
	return out;
    }
}
