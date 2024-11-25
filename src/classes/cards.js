class Card {
    constructor() {
	this.ctx = {};
    }
    set(data) {
	Object.assign(this.ctx, data);
	return this;
    }
    create() {
	const {scene} = this.ctx;
	const sprite = scene.newSprite(0, 0, this.constructor.image);
	sprite.logic = this;
	this.sprite = sprite;
	return this;
    }
}
export class Gauss extends Card {
    static image = 'guitar';
    async trigger() {
	const {satisfaction} = this.ctx;
	await satisfaction.add(1);
    }
}
export class Riemann extends Card {
    static image = 'base';
    async trigger() {
	const {satisfaction} = this.ctx;
	await satisfaction.add(1);
    }
}
export class Cauchy extends Card {
    static image = 'drums';
    async trigger() {
	const {satisfaction} = this.ctx;
	await satisfaction.add(1);
    }
}
export class Euler extends Card {
    static image = 'keyboard';
    async trigger() {
	const {tension} = this.ctx;
	await tension.add(1);
    }
}
