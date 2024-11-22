import { timeout } from '../tools/async.js';

export class Hand {
    constructor() {
	this.context = {
	    cards: [],
	    delay: 75,
	    step: 1.1,
	    duration: 200,
	    scale: 1,
	    ease: 'Cubic.easeOut',
	    positions: cards => cards.map((card, i) => {
		const {x, y, step} = this.context;
		const pos = {
		    x: x + (i + 0.5*(1 - cards.length))*card.width*card.baseScale*step,
		    y,
		};
		return pos;
	    }),
	};
    }
    set(data) {
	Object.assign(this.context, data);
	return this;
    }
    async create(newCards) {
	const {cards, duration, delay, ease, x, y, positions} = this.context;
	
	positions([...cards, ...newCards])
	    .forEach((x_y, i) => Object.assign(newCards[i].setAlpha(0).setScale(0), x_y));
	await this.insert(newCards);
	const p_create = newCards.map(async (card, i) => {
	    await timeout(delay*i*0.5);
	    card.tween({
		alpha: 1,
		scale: {from: 0, to: card.baseScale},
		duration: duration,
		ease,
	    });
	});
	await Promise.all(p_create);
    }
    async insert(newCards) {
	const {x, y, cards, delay, step, duration, scale, ease} = this.context;
	cards.push(...newCards);

	let j = 0;
	const p_tweens = cards.map(async (card, i) => {
	    j += (i >= cards.length - newCards.length);
	    await timeout(delay*j)
	    card.setDepth(100+i).tween({
		y,
		x: x + (i + 0.5*(1 - cards.length))*card.width*card.baseScale*step,
		scale: scale*card.baseScale,
		duration: duration,
		ease,
	    });
	    card.setDepth(0);
	});
	await Promise.all(p_tweens);
    }
    takeAll(release=true) {
	return this.take(undefined, release);
    }
    take(num, release=true) {
	const {cards} = this.context;
	const taken = cards.slice(0, num || cards.length);
	if (release) { this.release(taken); }
	
	return taken;
    }
    takeAll(release=true) {
	const {cards} = this.context;
	const taken = [...cards];
	if (release) { this.release(taken); }
	return taken;
    }
    
    release(oldCards) {
	const {cards} = this.context;
	const newCards = cards.filter(card => !oldCards.includes(card));
	this.set({cards:newCards});
	return this;
    }
    async select(num, release=true) {
	const {cards, duration, ease} = this.context;

	cards.forEach(card => card.setInteractive());
	const selected = [];
	for (let i=0; i<num; i++) {
	    const p_selected = cards.map(async card => { await card.event('pointerover'); return card; });
	    const card = await Promise.race(p_selected);
	    card.removeAllListeners().disableInteractive();
	    selected.push(card);
	    card.tween({
		y: card.y - card.displayHeight*0.2,
		duration,
		ease,
	    });
	}

	if (release) { this.release(selected); }
	    
	return selected;
    }
    size() {
	const {cards} = this.context;
	return cards.length;
    }
}
