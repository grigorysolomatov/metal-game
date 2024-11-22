import { createGame } from './tools/wrap-phaser.js';
import { StateTree } from './tools/state.js';
import { play } from './content/play.js';

const root = {
    0: async ctx => {
	await new Promise(resolve => WebFont.load({
	    google: { families: ['Metal Mania'] },
	    active: resolve,
	}));
	const gameConfig = {
	    height: Math.min(window.innerWidth/1.6, window.innerHeight),
	    width: window.innerWidth,
	    backgroundColor: '#111111',
	    type: Phaser.WEBGL,
	};
	const textDefaults = {
	    fontFamily: '"Metal Mania", system-ui',
	    fontSize: '32px',
	    fill: '#ffffff',
	};
	const assets = {
	    card: 'assets/exported/card.png',
	    glow: 'assets/exported/glow.png',
	};
	
	const scene = await createGame(gameConfig).newScene('MainScene');
	await scene.setTextDefaults(textDefaults).loadAssets(assets);	
	
	const {width, height} = scene.game.config;
	Object.assign(ctx, {scene, width, height});
	
	return 'main';
    },
    main: {
	0: async ctx => {
	    const {scene, width, height} = ctx;
	    const choice = await scene.newMenu(0.5*width, 0.5*height, {
		play: 'Play',
		learn: 'Learn',
	    });
	    return choice;
	},
	learn: {0: async ctx => '..'},
	play,
    },
};
await new StateTree().set({root}).run();
