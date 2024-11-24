import { timeout } from '../tools/async.js';

export class Hand {
    constructor() {
	this.ctx = {
	    cards: [],
	    duration: 300, // 300
	    width: 80,
	    step: 85,
	    ease: 'Cubic.easeOut',
	};
    }
    set(data) {
	Object.assign(this.ctx, data);
	return this;
    }
    async insert(newCards) {
	const {cards, getSpots, duration, ease, width, delay, x, y, step} = this.ctx;
	cards.push(...newCards.reverse());
	const spots = ({
	    getSpots: () => {
		const spots = cards.map((card, i) => {
		    const spot = {x: x + (i + 0.5*(1 - cards.length))*step, y: y};
		    return spot;
		    //return [pos.x, pos.y];
		});
		return spots;
	    },
	}).getSpots();
	// cards.forEach((card, i) => card.setDepth(card.depth + i));
	const p_move = cards.map(async (card, i) => {
	    // card.setDepth(i + 100);
	    const oldDepth = card.depth;
	    const newDepth = i;
	    
	    await timeout(i*duration/cards.length);
	    const {x, y} = spots[i];
	    const scale = width/card.width;
	    await card.tween({x, y, scale, duration, ease, onUpdate: tween => {
		const t = Math.min(1, tween.progress*2);
		card.setDepth((1-t)*oldDepth + t*newDepth);
	    }});
	});
	// cards.forEach((card, i) => card.setDepth(card.depth - 1000));
	await Promise.all(p_move);	
    }
    async create(newCards) {
	const {cards, duration, ease, delay} = this.ctx;
	newCards.forEach(card => card.setAlpha(0));
	
	this.set({duration: 0});
	await this.insert(newCards);
	this.set({duration});
	
	const p_make = newCards.map(async (card, i) => {
	    await timeout(i*duration/cards.length);
	    await card.tween({scale: {from: 0, to: card.scale}, alpha: 1, duration, ease})
	});
	await Promise.all(p_make);
	return this;
    }
    async select(num) {
	const {cards, duration, ease} = this.ctx;

	const selected = [];
	cards.forEach(card => card.removeAllListeners().setInteractive());
	while (selected.length <  num) {
	    const p_cards = cards.map(async card => { await card.event('pointerup'); return card; });
	    const card = await Promise.race(p_cards);
	    card.disableInteractive().removeAllListeners()
		.tween({y: card.y - card.displayHeight*0.2, duration, ease});
	    selected.push(card);
	}
	cards.forEach(card => card.disableInteractive().removeAllListeners());

	selected.release = () => this.release(selected);
	
	return selected;
    }
    slice(start, end) {
	const {cards} = this.ctx;
	const taken = cards.slice(start, end);

	taken.release = () => this.release(taken);
	
	return taken;
    }
    release(oldCards) {
	const {cards} = this.ctx;
	const newCards = cards.filter(card => !oldCards.includes(card));
	this.set({cards:newCards});
	return oldCards;
    }
    size() {
	const {cards} = this.ctx;
	return cards.length;
    }
}
