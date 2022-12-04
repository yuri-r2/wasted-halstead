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
		this.input.on('pointerdown', GM.Sfx.playMusic);
		
        this.add.sprite(0, 0, 'background').setOrigin(0,0).setPipeline('Light2D');
        this.stateStatus = null;
        this._score = 0;
		this._elapsedTime = 0;
		this._gamePaused = false;
		this._runOnce = false;

		class SpawnSpot {
			constructor(x) {
			  this.used = false;
			  this.item = null;
			  this.x = x;
			}
		}
		this.spawnSpots = [];
		for (var i = 60; i <= 580; i += 52){
			this.spawnSpots.push(new SpawnSpot(i));
		}

		this.lights.enable().setAmbientColor(0xBBBBBB);
		GM.light = this.lights.addLight(0, 0, 300).setColor(0xffffff).setIntensity(1);
		
		this.items = []; //list of active waste items 
		this.spawnRandomItem();
		this.spawnTimer = this.time.addEvent({
            delay: 2000,
            callback: function(){
				this.spawnTimer.timeScale = 1 + (this._elapsedTime / 20);
                this.spawnRandomItem();
            },
            callbackScope: this,
            loop: true
        });
		
		this.matter.world.on('dragstart', this.onDragStart);
		this.matter.world.on('drag', this.onDrag);
		this.matter.world.on('dragend', this.onDragEnd);

		
		//Bounds are slightly offset to prevent accidental collisions with borders
		this.matter.world.setBounds(-40, -40, GM.world.width+80, GM.world.height+80, 4096);


		this.matter.add.mouseSpring({ length: 1, stiffness: 0.9, angularStiffness: 0.9 });

		
		this.binCompost = new GameBin('compost', GM.world.centerX - 210, GM.world.centerY + 320, this);
		this.binTrash = new GameBin('trash', GM.world.centerX-5, GM.world.centerY + 320, this);
		this.binRecycle = new GameBin('recycle', GM.world.centerX + 200, GM.world.centerY + 320, this);

        
        this.initUI();
        this.currentTimer = this.time.addEvent({
            delay: 1000,
            callback: function(){
				//INCREASE gravity with time
				this._elapsedTime++;
				if (this.matter.world.engine.world.gravity.y < 6){
					this.matter.world.setGravity(0, this._elapsedTime * 0.04);
				}
                //this.textTime.setText(GM.text['gameplay-timeleft']+this._time);
                // if(!this._time) {
                //     this._runOnce = false;
                //     this.stateStatus = 'gameover';
                // }
            },
            callbackScope: this,
            loop: true
        });

		this.matter.world.on('collisionstart', function (event) {
			var pairs = event.pairs;

			for (var i = 0; i < pairs.length; i++){
				var bodyA = pairs[i].bodyA;
				var bodyB = pairs[i].bodyB;

				var binBody;
				var itemBody;
				var worldBody;
				var isBinCollision = false;
				var isWorldCollision = false; 

				// Bin collision
				if (bodyA.label == 'bin')
                {
                    binBody = bodyA;
                    itemBody = bodyB;
					isBinCollision = true;
                }
                else if (bodyB.label == 'bin')
                {
                    binBody = bodyB;
                    itemBody = bodyA;
					isBinCollision = true;
                }

				// World border collision
				if (bodyA.label == 'Rectangle Body')
				{
					worldBody = bodyA;
					itemBody = bodyB;
					isWorldCollision = true;
				}
				else if (bodyB.label == 'Rectangle Body'){
					worldBody = bodyB;
					itemBody = bodyA;
					isWorldCollision = true;
				}
				
				if (isBinCollision){
					GM.GameManager.binCollision(this.scene, binBody.gameObject, itemBody.gameObject);
				}

				if (isWorldCollision){
					GM.GameManager.borderCollision(this.scene, itemBody.gameObject)
				}
			}
	
		});

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

	spawnRandomItem() {
		var availableSpots = this.spawnSpots.filter(function (spot) { return spot.used === false });
		var spawnSpot = availableSpots[ ~~(Math.random() * availableSpots.length) ]
		if (!spawnSpot) return;
		const keys = Object.keys(itemDescriptions)
		const randomItem = keys[Math.floor(Math.random() * keys.length)];
		const itemDescription = itemDescriptions[randomItem][0];
		const itemType = randomItem.split('-')[0];
		const x = spawnSpot.x;
		const y = 140;
		var newItem = new GameItem(x, y, itemType, randomItem, this);
		newItem.text.setText(itemDescription);
		spawnSpot.item = newItem;
		spawnSpot.used = true;
		return;
	}

	removeItem(itemToRemove) { 
		for (var spawnSpot of this.spawnSpots){
			if (spawnSpot.item === itemToRemove){
				spawnSpot.item.text.destroy();
				spawnSpot.item.destroy();
				spawnSpot.item = null;
				spawnSpot.used = false;
			}
		}
	}

	clearItems () {
		for (var spawnSpot of this.spawnSpots){
		  if (spawnSpot.item){
			  spawnSpot.item.text.destroy();
			  spawnSpot.item.destroy();
			  spawnSpot.item = null;
		  }
		  spawnSpot.used = false;
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
        if(this._time === 0) {
            GM.GameManager.endGame(this);
        }
	}
	statePaused() {
        this.screenPausedGroup.toggleVisible();
	}
	stateGameover() {
		this.matter.world.pause();
		this.clearItems();
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
		this.screenGameoverScore = this.add.text(GM.world.centerX, 350, GM.text['gameplay-score']+this._score, fontScoreWhite);
		this.screenGameoverScore.setOrigin(0.5,0.5);
		var fontGameoverItem =  { font: '32px '+GM.text['FONT'], fill: '#FF0800', align: 'center'};
		var fontExplanation =  { font: '20px '+GM.text['FONT'], fill: '#FFFFFF', wordWrap: { width: 600 }, align: 'center'};
		this.screenGameoverItem = this.add.text(GM.world.centerX, 200, "", fontGameoverItem).setOrigin(0.5,0.5);;
		this.screenGameoverExplanation = this.add.text(30, 240, "", fontExplanation);
		this.screenGameoverGroup.add(this.screenGameoverExplanation);
		this.screenGameoverGroup.add(this.screenGameoverItem);
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
		this.clearItems();
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
	onDragStart(body){
		if(body.gameObject && body.gameObject instanceof GameItem){
			this.scene.tweens.add({targets: body.gameObject, scale: 0.7, duration: 250, ease: 'Back'});
			body.gameObject.text.setVisible(true);
			body.gameObject.depth = 99; 
			body.gameObject.text.depth = 100;
		  }
	}
	onDrag(body){
		if(body.gameObject && body.gameObject instanceof GameItem){
		  body.gameObject.text.x =  body.gameObject.x;
		  body.gameObject.text.y =  body.gameObject.y - 120;
		  GM.light.x = body.gameObject.x;
		  GM.light.y = body.gameObject.y;
		}
	  }
	onDragEnd(body){
		GM.light.x = 0;
		GM.light.y = 0;
		if (body.gameObject && body.gameObject instanceof GameItem){
		  this.scene.tweens.add({targets: body.gameObject, scale: 0.45, duration: 250, ease: 'Back'});
		  body.gameObject.text.setVisible(false);
		  // body.gameObject._scaleX = 0.45;
		  // body.gameObject._scaleY = 0.45;
		  body.gameObject.depth = 0;
		  body.gameObject.text.depth = 0;
		}
	}
};