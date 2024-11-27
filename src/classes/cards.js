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
	const {image, traits: traitImages} = this.constructor;
	
	const base = scene.newSprite(0, 0, image).setOrigin(0);
	const traits = traitImages.map((trait, i) => {
	    const icon = scene.newSprite(0, 0, trait);
	    icon.setScale(0.4*base.width/icon.width)
		.setX((0.25 + 0.5*i)*base.width)
		.setY(0.8*base.height)
		.setAlpha(0.8);
	    return icon;
	});
	
	const renderTexture = scene.add.renderTexture(0, 0, base.width, base.height).setVisible(false);
	const parts = [base, ...traits];	
	parts.forEach((p, i) => renderTexture.draw(p, p.x, p.y));
	parts.forEach(p => p.destroy());	
	const sprite = scene.newSprite(0, 0, renderTexture.texture);
	
	sprite.logic = this; this.sprite = sprite;	
	Object.assign(this.ctx, {sprite});
	
	return this;
    }
}
export class Gauss extends Card {
    static image = 'albert';
    static traits = ['lightning', 'lightning'];
    async trigger() {
	const {satisfaction} = this.ctx;
	await satisfaction.add(1);
    }
}
export class Riemann extends Card {
    static image = 'bob';
    static traits = ['lightning', 'guitar'];
    async trigger() {
	const {satisfaction} = this.ctx;
	await satisfaction.add(1);
    }
}
export class Cauchy extends Card {
    static image = 'charlie';
    static traits = ['guitar', 'lightning'];
    async trigger() {
	const {satisfaction} = this.ctx;
	await satisfaction.add(1);
    }
}
export class Euler extends Card {
    static image = 'donald';
    static traits = ['guitar', 'guitar'];
    async trigger() {
	const {tension} = this.ctx;
	await tension.add(1);
    }
}
