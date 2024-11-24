import { createGame } from './tools/wrap-phaser.js';
import { StateTree } from './tools/state.js';
import { play } from './content/play.js';
import { assets } from './content/paths.js';


const root = {
    0: async ctx => {
	await new Promise(resolve => WebFont.load({
	    google: { families: ['Metal Mania'] },
	    active: resolve,
	}));
	const {w, h} = {
	    w: window.innerWidth,
	    h: Math.min(window.innerWidth/1.6, window.innerHeight),
	};
	const mobile = /Mobi|Android/i.test(navigator.userAgent);
	const gameConfig = {
	    height: (mobile)? h : 412,
	    width: (mobile)? w : 915,
	    backgroundColor: '#111111',
	    type: Phaser.WEBGL,
	};
	const textDefaults = {
	    fontFamily: '"Metal Mania", system-ui',
	    fontSize: '32px',
	    fill: '#ffffff',
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
		learn: '',
	    });
	    return choice;
	},
	learn: {0: async ctx => '..'},
	play,
    },
};
await new StateTree().set({root}).run();
