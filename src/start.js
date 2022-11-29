// var enablePWA = false;
// if(enablePWA) {
// 	// SERVICE WORKER
// 	if('serviceWorker' in navigator) {
// 		navigator.serviceWorker.register('./js/sw.js');
// 	};


var gameConfig = {
	type: Phaser.AUTO,
	parent: 'parentDOM',
	dom: {
        createContainer: true
    },
	pixelArt: true,
	scale: {
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_BOTH,
		width: 640,
		height: 960
	},
	audio: {
		disableWebAudio: true
	},
	physics: {
        default: 'matter',
		matter: {
            debug: true,
            gravity: {
                y: 0.01,
				x: 0
            },
        }
    },
	scene: [Boot, Preloader, MainMenu, Story, Game]
}
game = new Phaser.Game(gameConfig);
window.focus();

// // Usage tracking
// window.dataLayer = window.dataLayer || [];
// function gtag(){dataLayer.push(arguments);}
// gtag('js', new Date());
// gtag('config', 'UA-30485283-26');