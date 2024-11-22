import { timeout } from '../tools/async.js';

export class Deck {
    constructor() {
	this.context = {cards: [], scale: 0.5, delay: 50, duration: 200, ease: 'Cubic.easeOut'};
    }
    set(data) {
	Object.assign(this.context, data);
	return this;
    }
    get(defaults={}) {
	this.context = {...defaults, ...this.context};
	return this.context;
    }    
    async insert(...newCards) {
	const {x, y, cards, scale, delay, duration, ease} = this.context;
	cards.push(...newCards);
	const p_tweens = cards.map(async (card, i) => {
	    await timeout(i*delay);
	    await card.tween({
		x, y,
		scale: scale*card.baseScale,
		duration,
		ease,
	    });
	});
	await Promise.all(p_tweens);
    }
    release(...oldCards) {
	const {cards} = this.get();
	const newCards = cards.filter(card => !oldCards.includes(card));
	this.set({cards:newCards});
	return this;
    }
}
