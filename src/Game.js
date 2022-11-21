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
    create() {
        this.add.sprite(0, 0, 'background').setOrigin(0,0);
        this.stateStatus = null;
        this._score = 0;
        this._time = 10;
		this._gamePaused = false;
		this._runOnce = false;

		this.gameItem = new GameItem(null, 'recycle-cheerios', this.addPoints, this, 'static');
		this.updateItem();
		
		this.binCompost = new GameBin('compost', EPT.world.centerX - 210, EPT.world.centerY + 270, function(){this.clickBin('compost');}, this);
		this.binTrash = new GameBin('trash', EPT.world.centerX-5, EPT.world.centerY + 270, function(){this.clickBin('trash');}, this);
		this.binRecycle = new GameBin('recycle', EPT.world.centerX + 200, EPT.world.centerY + 270, function(){this.clickBin('recycle');}, this);

        
        this.initUI();
        this.currentTimer = this.time.addEvent({
            delay: 1000,
            callback: function(){
                this._time--;
                this.textTime.setText(EPT.text['gameplay-timeleft']+this._time);
                if(!this._time) {
                    this._runOnce = false;
                    this.stateStatus = 'gameover';
                }
            },
            callbackScope: this,
            loop: true
        });

		this.input.keyboard.on('keydown', this.handleKey, this);
        this.cameras.main.fadeIn(250);
        this.stateStatus = 'playing';
    }
	update() {
		switch(this.stateStatus) {
			case 'paused': {
				if(!this._runOnce) {
					this.statePaused();
					this._runOnce = true;
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
    handleKey(e) {
        switch(e.code) {
            case 'Enter': {
                this.addPoints();
                break;
            }
            case 'KeyP': {
                this.managePause();
                break;
            }
            case 'KeyB': {
                this.stateBack();
                break;
            }
            case 'KeyT': {
                this.stateRestart();
                break;
            }
            default: {}
        }
    }
    managePause() {
        this._gamePaused =! this._gamePaused;
        this.currentTimer.paused =! this.currentTimer.paused;
		EPT.Sfx.play('click');
		if(this._gamePaused) {
			EPT.fadeOutIn(function(self){
				self.buttonPause.input.enabled = false;
				self.binCompost.input.enabled = false;
				self.binTrash.input.enabled = false;
				self.binRecycle.input.enabled = false;
				self.stateStatus = 'paused';
				self._runOnce = false;
			}, this);
			this.screenPausedBack.x = -this.screenPausedBack.width-20;
			this.tweens.add({targets: this.screenPausedBack, x: 100, duration: 500, delay: 250, ease: 'Back'});
			this.screenPausedContinue.x = EPT.world.width+this.screenPausedContinue.width+20;
			this.tweens.add({targets: this.screenPausedContinue, x: EPT.world.width-100, duration: 500, delay: 250, ease: 'Back'});
		}
		else {
			EPT.fadeOutIn(function(self){
				self.buttonPause.input.enabled = true;
				self.binCompost.input.enabled = true;
				self.binTrash.input.enabled = true;
				self.binRecycle.input.enabled = true;
				self._stateStatus = 'playing';
				self._runOnce = false;
			}, this);
			this.screenPausedBack.x = 100;
			this.tweens.add({targets: this.screenPausedBack, x: -this.screenPausedBack.width-20, duration: 500, ease: 'Back'});
			this.screenPausedContinue.x = EPT.world.width-100;
			this.tweens.add({targets: this.screenPausedContinue, x: EPT.world.width+this.screenPausedContinue.width+20, duration: 500, ease: 'Back'});
        }
    }
	statePlaying() {
        if(this._time === 0) {
            this._runOnce = false;
            this.stateStatus = 'gameover';
        }
	}
	statePaused() {
        this.screenPausedGroup.toggleVisible();
	}
	stateGameover() {
		this.currentTimer.paused =! this.currentTimer.paused;
		EPT.Storage.setHighscore('EPT-highscore',this._score);
		EPT.fadeOutIn(function(self){
			self.screenGameoverGroup.toggleVisible();			
			self.buttonPause.input.enabled = false;
			self.binCompost.input.enabled = false;
			self.binTrash.input.enabled = false;
			self.binRecycle.input.enabled = false;
			self.screenGameoverScore.setText(EPT.text['gameplay-score']+self._score);
			self.gameoverScoreTween();
		}, this);
		this.screenGameoverBack.x = -this.screenGameoverBack.width-20;
		this.tweens.add({targets: this.screenGameoverBack, x: 100, duration: 500, delay: 250, ease: 'Back'});
		this.screenGameoverRestart.x = EPT.world.width+this.screenGameoverRestart.width+20;
		this.tweens.add({targets: this.screenGameoverRestart, x: EPT.world.width-100, duration: 500, delay: 250, ease: 'Back'});
	}
    initUI() {
		this.buttonPause = new Button(20, 20, 'button-pause', this.managePause, this);
		this.buttonPause.setOrigin(0,0);

		var fontScore = { font: '38px '+EPT.text['FONT'], fill: '#ffde00', stroke: '#000', strokeThickness: 5 };
		var fontScoreWhite =  { font: '38px '+EPT.text['FONT'], fill: '#000', stroke: '#ffde00', strokeThickness: 5 };
		this.textScore = this.add.text(EPT.world.width-30, 45, EPT.text['gameplay-score']+this._score, fontScore);
		this.textScore.setOrigin(1,0);

		this.textScore.y = -this.textScore.height-20;
		this.tweens.add({targets: this.textScore, y: 45, duration: 500, delay: 100, ease: 'Back'});

		this.textTime = this.add.text(30, EPT.world.height-30, EPT.text['gameplay-timeleft']+this._time, fontScore);
		this.textTime.setOrigin(0,1);

		this.textTime.y = EPT.world.height+this.textTime.height+30;
		this.tweens.add({targets: this.textTime, y: EPT.world.height-30, duration: 500, ease: 'Back'});		

		this.buttonPause.y = -this.buttonPause.height-20;
        this.tweens.add({targets: this.buttonPause, y: 20, duration: 500, ease: 'Back'});

		var fontTitle = { font: '48px '+EPT.text['FONT'], fill: '#000', stroke: '#ffde00', strokeThickness: 10 };

		this.screenPausedGroup = this.add.group();
        this.screenPausedBg = this.add.sprite(0, 0, 'overlay');
        this.screenPausedBg.setAlpha(0.95);
        this.screenPausedBg.setOrigin(0, 0);
		this.screenPausedText = this.add.text(EPT.world.centerX, 100, EPT.text['gameplay-paused'], fontTitle);
		this.screenPausedText.setOrigin(0.5,0);
		this.screenPausedBack = new Button(100, EPT.world.height-100, 'button-mainmenu', this.stateBack, this);
		this.screenPausedBack.setOrigin(0,1);
		this.screenPausedContinue = new Button(EPT.world.width-100, EPT.world.height-100, 'button-continue', this.managePause, this);
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
		this.screenGameoverText = this.add.text(EPT.world.centerX, 100, EPT.text['gameplay-gameover'], fontTitle);
		this.screenGameoverText.setOrigin(0.5,0);
		this.screenGameoverBack = new Button(100, EPT.world.height-100, 'button-mainmenu', this.stateBack, this);
		this.screenGameoverBack.setOrigin(0,1);
		this.screenGameoverRestart = new Button(EPT.world.width-100, EPT.world.height-100, 'button-restart', this.stateRestart, this);
		this.screenGameoverRestart.setOrigin(1,1);
		this.screenGameoverScore = this.add.text(EPT.world.centerX, 300, EPT.text['gameplay-score']+this._score, fontScoreWhite);
		this.screenGameoverScore.setOrigin(0.5,0.5);
		this.screenGameoverGroup.add(this.screenGameoverBg);
		this.screenGameoverGroup.add(this.screenGameoverText);
		this.screenGameoverGroup.add(this.screenGameoverBack);
		this.screenGameoverGroup.add(this.screenGameoverRestart);
		this.screenGameoverGroup.add(this.screenGameoverScore);
		this.screenGameoverGroup.toggleVisible();
    }
    addPoints() {
		this._score += 1;
        this.textScore.setText(EPT.text['gameplay-score']+this._score);
        var randX = Phaser.Math.Between(200, EPT.world.width-200);
        var randY = Phaser.Math.Between(200, EPT.world.height-200);
		var pointsAdded = this.add.text(randX, randY, '+1', { font: '48px '+EPT.text['FONT'], fill: '#ffde00', stroke: '#000', strokeThickness: 10 });
		pointsAdded.setOrigin(0.5, 0.5);
        this.tweens.add({targets: pointsAdded, alpha: 0, y: randY-50, duration: 1000, ease: 'Linear'});

        this.cameras.main.shake(100, 0.01, true);
    }
	clickBin(type){
		if (this.gameItem.type === type){
			this.addPoints();
			this.updateItem();
		}
		else {
			this._time = 0;
		}
	}


	updateItem(){
		
		const randomType = types[Math.floor(Math.random() * types.length)];
		this.gameItem.type = randomType;
		var randomItem = null;
		var keys = null; 
		var itemDescription = null;
		switch (randomType){
			case 'compost':
				keys = Object.keys(compost_items)
				randomItem = keys[Math.floor(Math.random() * keys.length)];
				itemDescription = compost_items[randomItem];
				break;
			case 'trash':
				keys = Object.keys(trash_items)
				randomItem = keys[Math.floor(Math.random() * keys.length)];
				itemDescription = trash_items[randomItem];
				break;
			case 'recycle':
				keys = Object.keys(recycle_items)
				randomItem = keys[Math.floor(Math.random() * keys.length)];
				itemDescription = recycle_items[randomItem];
				break;
		}
		this.gameItem.image.setTexture(randomItem);
		this.gameItem.text.setText(itemDescription);
	}

	stateRestart() {
		EPT.Sfx.play('click');
        EPT.fadeOutScene('Game', this);
	}
	stateBack() {
		EPT.Sfx.play('click');
		EPT.fadeOutScene('MainMenu', this);
	}
	gameoverScoreTween() {
		this.screenGameoverScore.setText(EPT.text['gameplay-score']+'0');
		if(this._score) {
			this.pointsTween = this.tweens.addCounter({
				from: 0, to: this._score, duration: 2000, delay: 250,
				onUpdateScope: this, onCompleteScope: this,
				onUpdate: function(){
					this.screenGameoverScore.setText(EPT.text['gameplay-score']+Math.floor(this.pointsTween.getValue()));
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