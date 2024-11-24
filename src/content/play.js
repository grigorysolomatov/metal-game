import { timeout } from '../tools/async.js';
import { StateMachine } from '../tools/state.js';
import { Hand } from '../classes/hand.js';
import { Counter } from '../classes/counter.js';
import { Card } from '../classes/card.js';
import { Background } from '../classes/background.js';

const states = {
    s_setup: async ctx => {
	const {scene, width, height} = ctx;

	const images = []
	const background = new Background().set({scene, images: [
	    'field', 'hill', 'mountain_low', 'mountain_high', 'atmosphere',
	    'earth', 'sun', 'space', 'galaxy', 'cluster',
	    'creatures', 'cthulu', 'azathoth',
	    'simulation', 'computation', 'simghosts', 'simgod',
	    'simfractal', 'fractal', 'mandala', 'mandalasculs', 'devil',
	]});
	background.set({duration: 1000});
	background.next();
	background.set({duration: 2000});

	const tension = new Counter().set({scene, image: 'tension', x:100, y: 100}).create();
	const satisfaction = new Counter().set({scene, image: 'satisfaction', x:width-100, y: 100}).create();
	tension.spawn();
	await satisfaction.spawn();	
	
	const table = new Hand().set({x:0.5*width, y:0.4*height, width: 80, step: 90});
	const hand = new Hand().set({x:0.5*width, y:0.8*height, width: 80, step: 85});
	
	const deck = new Hand().set({x: width-40, y: height - 0.5*1.6*40 - 0.5*40, width: 40, step: 0});
	const discard = new Hand().set({x: 40, y: height - 0.5*1.6*40 - 0.5*40, width: 40, step: 0});
	const shuffle = new Hand().set({
	    x: width-40, y: -150 + height - 0.5*1.6*40 - 0.5*40, width: 40, step: 0, duration: 150,
	});

	Object.assign(ctx, {table, deck, hand, discard, tension, satisfaction, shuffle, background});
	return 's_deal';
    },
    s_deal: async ctx => {
	const {scene, table, deck} = ctx;

	const types = ['guitarist', 'basist', 'drummer', 'keyboarder'];
	const makeCard = i => new Card().set({scene, image: types[i]}).create().sprite();
	
	for (let i=0; i<4; i++) {
	    await table.create(new Array(3).fill().map(_ => makeCard(i)));
	    await deck.insert(table.slice().release());
	}
	return 's_shuffle';
    },
    s_play: async ctx => {
	const {table, hand, deck, discard, tension, satisfaction} = ctx;	
	await hand.insert(deck.slice(deck.size()-(6 - hand.size())).release());

	if (deck.size() <= 0) { return 's_restock'; }
	
	await table.insert((await hand.select(2)).release().reverse());
	
	const p_play = table.slice().map(async card => {
	    await timeout(100);
	    await card.tween({
		scale: {from: 1.2*card.scale, to: card.scale},
		duration: 500,
		ease: 'Cubic.easeOut',
	    });
	    satisfaction.add(1); tension.add(2);
	    return card;
	}); await Promise.all(p_play);
	await discard.insert(table.slice().release().reverse());	
	
	return 's_travel';
    },
    s_travel: async ctx => {
	const {background, satisfaction} = ctx;
	
	if (satisfaction.get() >= 2*(background.progress() + 1)) { background.next(); }

	return 's_play';
    },
    s_restock: async ctx => {
	const {discard, deck} = ctx;
	await deck.insert(discard.slice().release());
	return 's_shuffle';
    },
    s_shuffle: async ctx => {
	const {deck, shuffle} = ctx;	
	await shuffle.insert(deck.slice().release().sort(() => Math.random() - 0.5));
	await deck.insert(shuffle.slice().release().sort(() => Math.random() - 0.5));
	return 's_play';
    },
};

export const play = {
    0: async ctx => {
	const {scene, width, height} = ctx;
	await new StateMachine().set({states, context: {scene, width, height}}).run();
    },
};
