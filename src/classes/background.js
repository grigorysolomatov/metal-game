export class Background {
    constructor() {
	this.ctx = {
	    idx: -1,
	    duration: 2000,
	    ease: 'Cubic.easeOut',
	    tint: 0x444444,
	};
    }
    set(data) {
	Object.assign(this.ctx, data);
	return this;
    }
    async next() {
	const {scene, images, sprite, duration, ease, idx, tint} = this.ctx;
	const {width, height} = scene.game.config;
	sprite?.tween({alpha: 0, duration, ease});
	const newSprite = scene
	      .newSprite(0.5*width, 0.5*height, images[idx+1])
	      .setDisplaySize(width, height)
	      .setTint(tint)
	      .setDepth(-1)
	      .setAlpha(0);
	await newSprite.tween({alpha: 1, duration, ease});
	Object.assign(this.ctx, {idx: idx+1, sprite: newSprite});
    }
    progress() {
	const {idx} = this.ctx;
	return idx;
    }
}
