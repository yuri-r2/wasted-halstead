class MainMenu extends Phaser.Scene {
    constructor() {
        super('MainMenu');
        this.bgFilesLoaded = false;
    }
    create() {

        this.add.sprite(0, 0, 'background').setOrigin(0,0);

		GM.Storage.initUnset('GM-highscore', 0);
		var highscore = GM.Storage.get('GM-highscore');


        var title = this.add.sprite(GM.world.centerX, GM.world.centerY-250, 'logo');
        title.setOrigin(0.5);

        this.tweens.add({targets: title, angle: title.angle-2, duration: 1000, ease: 'Sine.easeInOut' });
        this.tweens.add({targets: title, angle: title.angle+4, duration: 2000, ease: 'Sine.easeInOut', yoyo: 1, loop: -1, delay: 1000 });

        this.buttonStart = new Button(GM.world.width-20, GM.world.height-20, 'button-start', this.clickStart, this);
        this.buttonStart.setOrigin(1, 1);

        GM.leaderboardManager.displayTopScores(this);

        var userScore = 0;
        var userRank = -1;
        GM.userName = '';

        var fontHighscore = { font: '30px '+GM.text['FONT'], fill: '#D6DE49', stroke: '#000', strokeThickness: 5 };
		var textHighscore = this.add.text(10, 0, GM.text['menu-highscore']+userScore, fontHighscore);
        var textRank = this.add.text(10, 0, GM.text['menu-rank']+userRank, fontHighscore);
        var textUsername = this.add.text(10, 0, GM.text['menu-username']+GM.userName, fontHighscore);

        this.tweens.add({targets: textHighscore, y: 10, duration: 500, delay: 100, ease: 'Back'});
        this.tweens.add({targets: textRank, y: 40, duration: 500, delay: 100, ease: 'Back'});
        this.tweens.add({targets: textUsername, y: 70, duration: 500, delay: 100, ease: 'Back'});

        
        GM.leaderBoard.getScore(GM.Storage.get('userID'))
        .then(function(scoreObj){ 
            userScore = scoreObj.score;
            textHighscore.setText(GM.text['menu-highscore']+userScore);
            GM.userName = scoreObj.userName;
            textUsername.setText(GM.text['menu-username']+GM.userName);
        })
        .catch(function(error) { })
        
        GM.leaderBoard.getRank(GM.Storage.get('userID'))
        .then(function(rankObj) {
            userRank = rankObj.rank + 1;
            textRank.setText(GM.text['menu-rank']+userRank);
        })
        .catch(function(error) { })
	

		this.buttonStart.x = GM.world.width+this.buttonStart.width+20;
        this.tweens.add({targets: this.buttonStart, x: GM.world.width-20, duration: 500, ease: 'Back'});


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
    clickStart() {
        if(this.bgFilesLoaded) {
            GM.Sfx.play('click', this);
            if(this.loadImage) {
                this.loadImage.destroy();
            }
            GM.fadeOutScene('Story', this);
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
            this.loadImage = this.add.sprite(GM.world.width-85, GM.world.height-85, 'loader').setOrigin(1,1).setScale(1.25);
            this.loadImage.play('loading');
        }
    }
    startPreloadInTheBackground() {
        // console.log('[GM] Starting background loading...');
        this.load.image('img/clickme');
        this.load.image('img/compost');
        this.load.image('img/trash');
        this.load.image('img/recycle');


        this.load.image('img/compost-clamshell');
        this.load.image('img/compost-coffeegrounds');
        this.load.image('img/compost-dylans');
        this.load.image('img/compost-eggshells');
        this.load.image('img/compost-papertowel');
        this.load.image('img/compost-parchment');

        this.load.image('img/trash-bluebell');
        this.load.image('img/trash-bubblewrap');
        this.load.image('img/trash-chewinggum');
        this.load.image('img/trash-ketchup');
        this.load.image('img/trash-milkcarton');
        this.load.image('img/trash-plasticbag');

        this.load.image('img/recycle-spaghettios');
        this.load.image('img/recycle-aluminium');
        this.load.image('img/recycle-cakecontainer');
        this.load.image('img/recycle-cardboard');
        this.load.image('img/recycle-cheerios');
        this.load.image('img/recycle-dasani');

        this.load.once('filecomplete', this.addFiles, this);
        this.load.start();
    }
    addFiles() {
        var resources = {
            'image': [
                ['clickme', 'img/clickme.png'],
                ['overlay', 'img/overlay.png'],
                ['button-beer', 'img/button-beer.png'],
                ['banner-beer', 'img/banner-beer.png'],
                ['particle', 'img/particle.png'],

                ['compost-clamshell', 'img/compost-clamshell.png'],
                ['compost-coffeegrounds', 'img/compost-coffeegrounds.png'],
                ['compost-dylans', 'img/compost-dylans.png'],
                ['compost-eggshells', 'img/compost-eggshells.png'],
                ['compost-papertowel', 'img/compost-papertowel.png'],
                ['compost-parchment', 'img/compost-parchment.png'],

                ['trash-bluebell', 'img/trash-bluebell.png'],
                ['trash-bubblewrap', 'img/trash-bubblewrap.png'],
                ['trash-chewinggum', 'img/trash-chewinggum.png'],
                ['trash-ketchup', 'img/trash-ketchup.png'],
                ['trash-milkcarton', 'img/trash-milkcarton.png'],
                ['trash-plasticbag', 'img/trash-plasticbag.png'],

                ['recycle-spaghettios', 'img/recycle-spaghettios.png'],
                ['recycle-aluminium', 'img/recycle-aluminium.png'],
                ['recycle-cakecontainer', 'img/recycle-cakecontainer.png'],
                ['recycle-cardboard', 'img/recycle-cardboard.png'],
                ['recycle-cheerios', 'img/recycle-cheerios.png'],
                ['recycle-dasani', 'img/recycle-dasani.png']
            ],
            'spritesheet': [
                ['compost', 'img/compost.png', {frameWidth:220,frameHeight:300}],
                ['trash', 'img/trash.png', {frameWidth:220,frameHeight:300}],
                ['recycle', 'img/recycle.png', {frameWidth:220,frameHeight:300}],
                ['button-continue', 'img/button-start.png', {frameWidth:180,frameHeight:180}],
                ['button-mainmenu', 'img/button-mainmenu.png', {frameWidth:180,frameHeight:180}],
                ['button-restart', 'img/button-tryagain.png', {frameWidth:180,frameHeight:180}],
                ['button-achievements', 'img/button-achievements.png', {frameWidth:110,frameHeight:110}],
                ['button-pause', 'img/button-pause.png', {frameWidth:80,frameHeight:80}],
                ['button-credits', 'img/button-credits.png', {frameWidth:80,frameHeight:80}],
                ['button-sound-on', 'img/button-sound-on.png', {frameWidth:80,frameHeight:80}],
                ['button-sound-off', 'img/button-sound-off.png', {frameWidth:80,frameHeight:80}],
                ['button-music-on', 'img/button-music-on.png', {frameWidth:80,frameHeight:80}],
                ['button-music-off', 'img/button-music-off.png', {frameWidth:80,frameHeight:80}],
                ['button-back', 'img/button-back.png', {frameWidth:70,frameHeight:70}]
            ],
            'audio': [
                ['sound-click', ['sfx/button-click-long.mp3']],
                ['sound-gameover', ['sfx/GameOver.mp3']],
                ['sound-trash', ['sfx/TrashClose.mp3']],
                ['music-theme', ['sfx/TexasFight.mp3']]
            ]
        };            
        for(var method in resources) {
            resources[method].forEach(function(args) {
                var loader = this.load[method];
                loader && loader.apply(this.load, args);
            }, this);
        };
        this.load.on('complete', function(){
            // console.log('[GM] All files loaded in the background.');
            this.bgFilesLoaded = true;
            GM.Sfx.init(this);
            // GM.Sfx.manage('music', 'init', this);
            // GM.Sfx.manage('sound', 'init', this);
            if(this.waitingForStart) {
                this.clickStart();
            }            
        }, this);
    }
}