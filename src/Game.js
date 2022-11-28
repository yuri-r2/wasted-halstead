const types = ["trash", "recycle", "compost"];
const trash_items = {
	'trash-bluebell': "Empty can of Blue Bell icecream",
	'trash-bubblewrap': "Bubble wrap",
	'trash-chewinggum': "Well-chewed chewing gum",
	'trash-ketchup': "Ketchup packet",
	'trash-milkcarton': "Empty carton of milk",
	'trash-plasticbag': "Plastic grocery bag"
}
const recycle_items = { 
	'recycle-spaghettios': "Cleaned out can of SpaghettiOs",
	'recycle-aluminium': "Aluminium foil",
	'recycle-cakecontainer': "Cleaned out cake container",
	'recycle-cardboard': "Broken down cardboard box",
	'recycle-cheerios': "Empty box of Cheerios",
	'recycle-dasani': "Empty Dasani bottle"
}
const compost_items = {
	'compost-clamshell': "Clamshell made of sugar cane fibers",
	'compost-coffeegrounds': "Used coffee grounds",
	'compost-dylans': "Dylan's pizza",
	'compost-eggshells': "Egg shells",
	'compost-papertowel': "Paper towels",
	'compost-parchment': "Parchment paper"
}
class Game extends Phaser.Scene {
    constructor() {
        super('Game');
    }
	preload() {
		this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'src/plugins/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        }) 
        // this.load.plugin('rextexteditplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rextexteditplugin.min.js', true)
        this.load.image('user', 'img/person.png');
	}
    create() {
		

        this.add.sprite(0, 0, 'background').setOrigin(0,0);
        this.stateStatus = null;
        this._score = 0;
        this._time = 1000;
		this._elapsedTime = 0;
		this._gamePaused = false;
		this._runOnce = false;

		var graphics = this.add.graphics({ lineStyle: { width: 4, color: 0x0000ff }, fillStyle: { color: 0xff0000 }});
		this.spawnArea = new Phaser.Geom.Rectangle(60, 110, GM.world.width-120 , 150);
		graphics.strokeRectShape(this.spawnArea);
		
		this.items = []; //list of active waste items 
		GM.GameManager.spawnRandomItem(this);
		this.spawnTimer = this.time.addEvent({
            delay: 2000,
            callback: function(){
                GM.GameManager.spawnRandomItem(this);
            },
            callbackScope: this,
            loop: true
        });

		

		//GM.GameManager.updateItem(this);
		

		this.matter.world.setBounds(0, 0, GM.world.width, GM.world.height, 4096);


		this.matter.add.mouseSpring({ length: 1, stiffness: 0.6 });

		this.matter.world.on('collisionstart', function (event) {
			console.log(event);
			var pairs = event.pairs;

			for (var i = 0; i < pairs.length; i++){
				var bodyA = pairs[i].bodyA;
				var bodyB = pairs[i].bodyB;
				var binBody;
				var itemBody;
				if (bodyA.label == 'bin')
                {
                    binBody = bodyA;
                    itemBody = bodyB;
                }
                else if (bodyB.label == 'bin')
                {
                    binBody = bodyB;
                    itemBody = bodyA;
                }
				else { continue; }
				GM.GameManager.binCollision(this.scene, binBody.gameObject, itemBody.gameObject);
			}
	
		});
		
		this.binCompost = new GameBin('compost', GM.world.centerX - 210, GM.world.centerY + 250, this);
		this.binTrash = new GameBin('trash', GM.world.centerX-5, GM.world.centerY + 250, this);
		this.binRecycle = new GameBin('recycle', GM.world.centerX + 200, GM.world.centerY + 250, this);

        
        this.initUI();
        this.currentTimer = this.time.addEvent({
            delay: 1000,
            callback: function(){
                this._time--;
				//INCREASE gravity with time
				this._elapsedTime++;
				this.matter.world.setGravity(0, this._elapsedTime * 0.01);
				console.log(this.matter.world.engine.world.gravity)
                this.textTime.setText(GM.text['gameplay-timeleft']+this._time);
                if(!this._time) {
                    this._runOnce = false;
                    this.stateStatus = 'gameover';
                }
            },
            callbackScope: this,
            loop: true
        });

		//this.input.keyboard.on('keydown', this.handleKey, this);
        this.cameras.main.fadeIn(250);
        this.stateStatus = 'playing';
    }
	update() {
		switch(this.stateStatus) {
			case 'paused': {
				if(!this._runOnce) {
					this.statePaused();
					this._runOnce = true;
					//IDK WHY THIS WORKS
					if (this._stateStatus === 'playing'){
						this.stateStatus = 'playing';
						this.matter.world.resume();
						this._stateStatus = null;
					}
				}
				break;
			}
			case 'gameover': {
				if(!this._runOnce) {
					this.stateGameover();
					this._runOnce = true;
				}
				break;
			}
			case 'playing': {
				this.statePlaying();
			}
			default: {
			}
		}
	}
    
    managePause() {
        this._gamePaused =! this._gamePaused;
        this.currentTimer.paused =! this.currentTimer.paused;
		this.spawnTimer.paused =! this.spawnTimer.paused;
		GM.Sfx.play('click', this);
		if(this._gamePaused) {
			GM.fadeOutIn(function(self){
				self.buttonPause.input.enabled = false;
				self.binCompost.input.enabled = false;
				self.binTrash.input.enabled = false;
				self.binRecycle.input.enabled = false;
				self.stateStatus = 'paused';
				self._runOnce = false;
			}, this);
			this.screenPausedBack.x = -this.screenPausedBack.width-20;
			this.tweens.add({targets: this.screenPausedBack, x: 100, duration: 500, delay: 250, ease: 'Back'});
			this.screenPausedContinue.x = GM.world.width+this.screenPausedContinue.width+20;
			this.tweens.add({targets: this.screenPausedContinue, x: GM.world.width-100, duration: 500, delay: 250, ease: 'Back'});
			this.matter.world.pause();
		}
		else {
			GM.fadeOutIn(function(self){
				self.buttonPause.input.enabled = true;
				self.binCompost.input.enabled = true;
				self.binTrash.input.enabled = true;
				self.binRecycle.input.enabled = true;
				self._stateStatus = 'playing';
				self._runOnce = false;
			}, this);
			this.screenPausedBack.x = 100;
			this.tweens.add({targets: this.screenPausedBack, x: -this.screenPausedBack.width-20, duration: 500, ease: 'Back'});
			this.screenPausedContinue.x = GM.world.width-100;
			this.tweens.add({targets: this.screenPausedContinue, x: GM.world.width+this.screenPausedContinue.width+20, duration: 500, ease: 'Back'});
			
        }
    }

	statePlaying() {
		for (var item of this.items){
			item.text.x = item.x;
			item.text.y = item.y - 60;
		}
		
        if(this._time === 0) {
            GM.GameManager.endGame(this);
        }
	}
	statePaused() {
        this.screenPausedGroup.toggleVisible();
	}
	stateGameover() {
		this.matter.world.pause();
		GM.GameManager.clearItems(this);
		GM.leaderboardManager.getScoreDialog(this, this._score);
		this.currentTimer.paused =! this.currentTimer.paused;
		this.spawnTimer.paused =! this.spawnTimer.paused;
		GM.Storage.setHighscore('GM-highscore',this._score);
		GM.fadeOutIn(function(self){
			self.screenGameoverGroup.toggleVisible();			
			self.buttonPause.input.enabled = false;
			self.binCompost.input.enabled = false;
			self.binTrash.input.enabled = false;
			self.binRecycle.input.enabled = false;
			self.screenGameoverScore.setText(GM.text['gameplay-score']+self._score);
			self.gameoverScoreTween();
		}, this);
		this.screenGameoverBack.x = -this.screenGameoverBack.width-20;
		this.tweens.add({targets: this.screenGameoverBack, x: 100, duration: 500, delay: 250, ease: 'Back'});
		this.screenGameoverRestart.x = GM.world.width+this.screenGameoverRestart.width+20;
		this.tweens.add({targets: this.screenGameoverRestart, x: GM.world.width-100, duration: 500, delay: 250, ease: 'Back'});
	}
    initUI() {
		this.buttonPause = new Button(20, 20, 'button-pause', this.managePause, this);
		this.buttonPause.setOrigin(0,0);

		var fontScore = { font: '38px '+GM.text['FONT'], fill: '#D6DE49', stroke: '#000', strokeThickness: 5 };
		var fontScoreWhite =  { font: '38px '+GM.text['FONT'], fill: '#000', stroke: '#D6DE49', strokeThickness: 5 };
		this.textScore = this.add.text(GM.world.width-30, 45, GM.text['gameplay-score']+this._score, fontScore);
		this.textScore.setOrigin(1,0);

		this.textScore.y = -this.textScore.height-20;
		this.tweens.add({targets: this.textScore, y: 45, duration: 500, delay: 100, ease: 'Back'});

		this.textTime = this.add.text(30, GM.world.height-30, GM.text['gameplay-timeleft']+this._time, fontScore);
		this.textTime.setOrigin(0,1);

		this.textTime.y = GM.world.height+this.textTime.height+30;
		this.tweens.add({targets: this.textTime, y: GM.world.height-30, duration: 500, ease: 'Back'});		

		this.buttonPause.y = -this.buttonPause.height-20;
        this.tweens.add({targets: this.buttonPause, y: 20, duration: 500, ease: 'Back'});

		var fontTitle = { font: '48px '+GM.text['FONT'], fill: '#000', stroke: '#D6DE49', strokeThickness: 10 };

		this.screenPausedGroup = this.add.group();
        this.screenPausedBg = this.add.sprite(0, 0, 'overlay');
        this.screenPausedBg.setAlpha(0.95);
        this.screenPausedBg.setOrigin(0, 0);
		this.screenPausedText = this.add.text(GM.world.centerX, 100, GM.text['gameplay-paused'], fontTitle);
		this.screenPausedText.setOrigin(0.5,0);
		this.screenPausedBack = new Button(100, GM.world.height-100, 'button-mainmenu', this.stateBack, this);
		this.screenPausedBack.setOrigin(0,1);
		this.screenPausedContinue = new Button(GM.world.width-100, GM.world.height-100, 'button-continue', this.managePause, this);
		this.screenPausedContinue.setOrigin(1,1);
		this.screenPausedGroup.add(this.screenPausedBg);
		this.screenPausedGroup.add(this.screenPausedText);
		this.screenPausedGroup.add(this.screenPausedBack);
		this.screenPausedGroup.add(this.screenPausedContinue);
        this.screenPausedGroup.toggleVisible();

		this.screenGameoverGroup = this.add.group();
        this.screenGameoverBg = this.add.sprite(0, 0, 'overlay');
        this.screenGameoverBg.setAlpha(0.95);
        this.screenGameoverBg.setOrigin(0, 0);
		this.screenGameoverText = this.add.text(GM.world.centerX, 100, GM.text['gameplay-gameover'], fontTitle);
		this.screenGameoverText.setOrigin(0.5,0);
		this.screenGameoverBack = new Button(100, GM.world.height-100, 'button-mainmenu', this.stateBack, this);
		this.screenGameoverBack.setOrigin(0,1);
		this.screenGameoverRestart = new Button(GM.world.width-100, GM.world.height-100, 'button-restart', this.stateRestart, this);
		this.screenGameoverRestart.setOrigin(1,1);
		this.screenGameoverScore = this.add.text(GM.world.centerX, 300, GM.text['gameplay-score']+this._score, fontScoreWhite);
		this.screenGameoverScore.setOrigin(0.5,0.5);
		this.screenGameoverGroup.add(this.screenGameoverBg);
		this.screenGameoverGroup.add(this.screenGameoverText);
		this.screenGameoverGroup.add(this.screenGameoverBack);
		this.screenGameoverGroup.add(this.screenGameoverRestart);
		this.screenGameoverGroup.add(this.screenGameoverScore);
		this.screenGameoverGroup.toggleVisible();
    }

	stateRestart() {
		GM.Sfx.play('click', this);
        GM.fadeOutScene('Game', this);
	}
	stateBack() {
		GM.GameManager.clearItems(this);
		GM.Sfx.play('click', this);
		GM.fadeOutScene('MainMenu', this);
	}

	gameoverScoreTween() {
		this.screenGameoverScore.setText(GM.text['gameplay-score']+'0');
		if(this._score) {
			this.pointsTween = this.tweens.addCounter({
				from: 0, to: this._score, duration: 2000, delay: 250,
				onUpdateScope: this, onCompleteScope: this,
				onUpdate: function(){
					this.screenGameoverScore.setText(GM.text['gameplay-score']+Math.floor(this.pointsTween.getValue()));
				},
				onComplete: function(){
					var emitter = this.add.particles('particle').createEmitter({
						x: this.screenGameoverScore.x+30,
						y: this.screenGameoverScore.y,
						speed: { min: -600, max: 600 },
						angle: { min: 0, max: 360 },
						scale: { start: 0.5, end: 3 },
						blendMode: 'ADD',
						active: true,
						lifespan: 2000,
						gravityY: 1000,
						quantity: 250
					});
					emitter.explode();
				}
			});
		}
	}
};