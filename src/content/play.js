import { timeout } from '../tools/async.js';
import { Hand } from '../classes/hand.js';
import { Deck } from '../classes/deck.js';

export const play = {
    0: async ctx => {
	const {scene, width, height} = ctx;

	const makeCard = (x, y) => {
	    const cardHeight = 100;
	    const card = scene.newSprite(x, y, 'card');
	    card.setScale(cardHeight/card.height);
	    card.baseScale = card.scale;
	    return card;
	};
	const makeGlow = (x, y) => {
	    const glow = scene.newSprite(x, y, 'glow').setDisplaySize(100, 100).setAlpha(0);
	    glow.baseScale = glow.scale;	    
	    [glow].map(async () => {
		await timeout(4000 + 1000);
		while (true) {
		    glow.tween({
			alpha: {from: 1, to: 0.0},
			duration: 500,
			ease: 'Cubic.easeOut',
		    });
		    await timeout(1000);
		}
	    });
	    return glow;
	}

	await timeout(500);
	const p_glows = [[0.15, 0.25], [0.85, 0.25]].map(([x, y]) => makeGlow(x*width, y*height));

	const table = new Hand().set({x:0.5*width, y:0.4*height});
	const hand = await new Hand().set({x:0.45*width, y:0.8*height});
	const deck = new Hand().set({x:0.95*width, y:0.9*height, step: 0, scale: 0.5});	
	
	for (let i=0; i<4; i++) {
	    const numCards = 3;
	    const cards = new Array(numCards).fill().map((_, i) => makeCard(0.5*width, 0.5*height));
	    table.create(cards);
	    await timeout(500);
	    deck.insert(table.takeAll());
	    await timeout(500);
	}
	// await timeout(200);

	while (true) {
	    if (table.size() >= 4) { await deck.insert(table.takeAll()); }
	    await hand.insert(deck.take(6 - hand.size()));
	    await table.insert(await hand.select(2));
	}	
	
	const choice = await scene.newMenu(0.1*width, 0.9*height, {
	    '..': '',
	});
		
	return choice;
    },
};
