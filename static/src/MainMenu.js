class MainMenu extends Phaser.Scene {
    constructor() {
        super('MainMenu');
        this.bgFilesLoaded = false;
    }
    create() {
        this.add.sprite(0, 0, 'background').setOrigin(0,0);

		EPT.Storage.initUnset('EPT-highscore', 0);
		var highscore = EPT.Storage.get('EPT-highscore');

        this.waitingForSettings = false;

        var title = this.add.sprite(EPT.world.centerX, EPT.world.centerY-50, 'bear');
        title.setOrigin(0.5);

        this.input.keyboard.on('keydown', this.handleKey, this);

        this.tweens.add({targets: title, angle: title.angle-2, duration: 1000, ease: 'Sine.easeInOut' });
        this.tweens.add({targets: title, angle: title.angle+4, duration: 2000, ease: 'Sine.easeInOut', yoyo: 1, loop: -1, delay: 1000 });

        // this.buttonSettings = new Button(20, 20, 'button-settings', this.clickSettings, this);
        // this.buttonSettings.setOrigin(0, 0);

        // var buttonEnclave = new Button(20, EPT.world.height-40, 'logo-enclave', this.clickEnclave, this, 'static');
        // buttonEnclave.setOrigin(0, 1);

        this.buttonStart = new Button(EPT.world.width-20, EPT.world.height-20, 'button-start', this.clickStart, this);
        this.buttonStart.setOrigin(1, 1);

		var fontHighscore = { font: '38px '+EPT.text['FONT'], fill: '#D6DE49', stroke: '#000', strokeThickness: 5 };
		var textHighscore = this.add.text(EPT.world.width-30, 60, EPT.text['menu-highscore']+highscore, fontHighscore);
		textHighscore.setOrigin(1, 0);

		this.buttonStart.x = EPT.world.width+this.buttonStart.width+20;
        this.tweens.add({targets: this.buttonStart, x: EPT.world.width-20, duration: 500, ease: 'Back'});

		// buttonEnclave.x = -buttonEnclave.width-20;
        // this.tweens.add({targets: buttonEnclave, x: 20, duration: 500, ease: 'Back'});

        // this.buttonSettings.y = -this.buttonSettings.height-20;
        // this.tweens.add({targets: this.buttonSettings, y: 20, duration: 500, ease: 'Back'});

        textHighscore.y = -textHighscore.height-30;
        this.tweens.add({targets: textHighscore, y: 40, duration: 500, delay: 100, ease: 'Back'});

        this.cameras.main.fadeIn(250);

        if(!this.bgFilesLoaded) {
            this.time.addEvent({
                delay: 500,
                callback: function() {
                    this.startPreloadInTheBackground();
                },
                callbackScope: this
            }, this);
        }
    }
    handleKey(e) {
        switch(e.code) {
            case 'KeyS': {
                this.clickSettings();
                break;
            }
            case 'Enter': {
                this.clickStart();
                break;
            }
            default: {}
        }
    }
    clickEnclave() {
        EPT.Sfx.play('click', this);
        window.top.location.href = 'https://enclavegames.com/';
    }
    clickSettings() {
        if(this.bgFilesLoaded) {
            EPT.Sfx.play('click', this);
            if(this.loadImage) {
                this.loadImage.destroy();
            }
            EPT.fadeOutScene('Settings', this);
        }
        else {
            var animationFrames = this.anims.generateFrameNumbers('loader');
            animationFrames.pop();
            this.waitingForSettings = true;
            // this.buttonSettings.setAlpha(0.1);
            var loadAnimation = this.anims.create({
                key: 'loading',
                frames: animationFrames,
                frameRate: 12,
                repeat: -1
            });
            this.loadImage = this.add.sprite(30, 30, 'loader').setOrigin(0,0).setScale(1.25);
            this.loadImage.play('loading');
        }
    }
    clickStart() {
        if(this.bgFilesLoaded) {
            EPT.Sfx.play('click', this);
            if(this.loadImage) {
                this.loadImage.destroy();
            }
            EPT.fadeOutScene('Story', this);
        }
        else {
            var animationFrames = this.anims.generateFrameNumbers('loader');
            animationFrames.pop();
            this.waitingForStart = true;
            this.buttonStart.setAlpha(0.1);
            var loadAnimation = this.anims.create({
                key: 'loading',
                frames: animationFrames,
                frameRate: 12,
                repeat: -1
            });
            this.loadImage = this.add.sprite(EPT.world.width-85, EPT.world.height-85, 'loader').setOrigin(1,1).setScale(1.25);
            this.loadImage.play('loading');
        }
    }
    startPreloadInTheBackground() {
        console.log('[EPT] Starting background loading...');
        this.load.image('/static/img/clickme');
        this.load.image('/static/img/compost');
        this.load.image('/static/img/trash');
        this.load.image('/static/img/recycle');


        this.load.image('/static/img/compost-clamshell');
        this.load.image('/static/img/compost-coffeegrounds');
        this.load.image('/static/img/compost-dylans');
        this.load.image('/static/img/compost-eggshells');
        this.load.image('/static/img/compost-papertowel');
        this.load.image('/static/img/compost-parchment');

        this.load.image('/static/img/trash-bluebell');
        this.load.image('/static/img/trash-bubblewrap');
        this.load.image('/static/img/trash-chewinggum');
        this.load.image('/static/img/trash-ketchup');
        this.load.image('/static/img/trash-milkcarton');
        this.load.image('/static/img/trash-plasticbag');

        this.load.image('/static/img/recycle-spaghettios');
        this.load.image('/static/img/recycle-aluminium');
        this.load.image('/static/img/recycle-cakecontainer');
        this.load.image('/static/img/recycle-cardboard');
        this.load.image('/static/img/recycle-cheerios');
        this.load.image('/static/img/recycle-dasani');

        this.load.once('filecomplete', this.addFiles, this);
        this.load.start();
    }
    addFiles() {
        var resources = {
            'image': [
                ['clickme', '/static/img/clickme.png'],
                ['overlay', '/static/img/overlay.png'],
                ['button-beer', '/static/img/button-beer.png'],
                ['banner-beer', '/static/img/banner-beer.png'],
                ['particle', '/static/img/particle.png'],

                ['compost-clamshell', '/static/img/compost-clamshell.png'],
                ['compost-coffeegrounds', '/static/img/compost-coffeegrounds.png'],
                ['compost-dylans', '/static/img/compost-dylans.png'],
                ['compost-eggshells', '/static/img/compost-eggshells.png'],
                ['compost-papertowel', '/static/img/compost-papertowel.png'],
                ['compost-parchment', '/static/img/compost-parchment.png'],

                ['trash-bluebell', '/static/img/trash-bluebell.png'],
                ['trash-bubblewrap', '/static/img/trash-bubblewrap.png'],
                ['trash-chewinggum', '/static/img/trash-chewinggum.png'],
                ['trash-ketchup', '/static/img/trash-ketchup.png'],
                ['trash-milkcarton', '/static/img/trash-milkcarton.png'],
                ['trash-plasticbag', '/static/img/trash-plasticbag.png'],

                ['recycle-spaghettios', '/static/img/recycle-spaghettios.png'],
                ['recycle-aluminium', '/static/img/recycle-aluminium.png'],
                ['recycle-cakecontainer', '/static/img/recycle-cakecontainer.png'],
                ['recycle-cardboard', '/static/img/recycle-cardboard.png'],
                ['recycle-cheerios', '/static/img/recycle-cheerios.png'],
                ['recycle-dasani', '/static/img/recycle-dasani.png']
            ],
            'spritesheet': [
                ['compost', '/static/img/compost.png', {frameWidth:220,frameHeight:300}],
                ['trash', '/static/img/trash.png', {frameWidth:220,frameHeight:300}],
                ['recycle', '/static/img/recycle.png', {frameWidth:220,frameHeight:300}],
                ['button-continue', '/static/img/button-start.png', {frameWidth:180,frameHeight:180}],
                ['button-mainmenu', '/static/img/button-mainmenu.png', {frameWidth:180,frameHeight:180}],
                ['button-restart', '/static/img/button-tryagain.png', {frameWidth:180,frameHeight:180}],
                ['button-achievements', '/static/img/button-achievements.png', {frameWidth:110,frameHeight:110}],
                ['button-pause', '/static/img/button-pause.png', {frameWidth:80,frameHeight:80}],
                ['button-credits', '/static/img/button-credits.png', {frameWidth:80,frameHeight:80}],
                ['button-sound-on', '/static/img/button-sound-on.png', {frameWidth:80,frameHeight:80}],
                ['button-sound-off', '/static/img/button-sound-off.png', {frameWidth:80,frameHeight:80}],
                ['button-music-on', '/static/img/button-music-on.png', {frameWidth:80,frameHeight:80}],
                ['button-music-off', '/static/img/button-music-off.png', {frameWidth:80,frameHeight:80}],
                ['button-back', '/static/img/button-back.png', {frameWidth:70,frameHeight:70}]
            ],
            'audio': [
                ['sound-click', ['/static/sfx/button-click-long.mp3']],
                ['sound-gameover', ['/static/sfx/GameOver.mp3']],
                ['sound-trash', ['/static/sfx/TrashClose.mp3']],
                ['music-theme', ['/static/sfx/TexasFight.mp3']]
            ]
        };            
        for(var method in resources) {
            resources[method].forEach(function(args) {
                var loader = this.load[method];
                loader && loader.apply(this.load, args);
            }, this);
        };
        this.load.on('complete', function(){
            console.log('[EPT] All files loaded in the background.');
            this.bgFilesLoaded = true;
            EPT.Sfx.init(this);
            // EPT.Sfx.manage('music', 'init', this);
            // EPT.Sfx.manage('sound', 'init', this);
            if(this.waitingForSettings) {
                this.clickSettings();
            }
            if(this.waitingForStart) {
                this.clickStart();
            }            
        }, this);
    }
}