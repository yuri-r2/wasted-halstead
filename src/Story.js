class Story extends Phaser.Scene {
    constructor() {
        super('Story');
    }
	preload() {
        this.load.image('wastedStory', 'img/wastedStory.png');
        this.load.image('discordStory', 'img/discordStory.png');
        this.load.image('shardulStory', 'img/shardulStory.png');
		this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'src/plugins/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        }) 
        this.load.image('nextPage', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/assets/images/arrow-down-left.png');
	}
    create() {
        this.input.on('pointerdown', GM.Sfx.playMusic);
		this.storyBackground = this.add.sprite(0, 0, 'wastedStory').setOrigin(0,0);

		var GAME_STORY = [
            /*0*/"[color=blue][/color]\nYou wake up in a pool of puke.\nThe sour stink is overwhelming...\n",
            /*1*/"[color=green](You):[/color]\nughhh... My head hurts.\n\n",
            /*2*/"[color=green][/color]\n*Bzzz* *Bzzz*\n(You have 1 Discord Notification)\n",
            /*3*/"[color=green](You):[/color]\nF**k! I forgot...\nI need to get to the kitchen right now.\n",
            /*4*/"[color=red](Shardul):[/color]\nFINALLY!\nYou're here!\n... What is this smell?",
            /*5*/"[color=green](You):[/color]\n...\n\n",
            /*6*/"[color=red](Shardul):[/color]\n*Eye-rolling* Bad people had been drinking and playing loud music.\nDrinking is bad. Music is BAD!",
            /*7*/"[color=red](Shardul):[/color]\nThey left a mess in the kitchen and now we have to cleanup. I hate this stupid late night clean labor on Fridays.",
            /*8*/"[color=red](Shardul):[/color]\nWhat are you waiting for??\nGo pick up the trash!\nAnd make sure you sort it correctly!",
        ]
		var textBox = CreateTextBox(this, GM.world.centerX, GM.world.centerY, {
            wrapWidth: 500,
            fixedWidth: 500,
            fixedHeight: 150,
        })
		textBox.start(GAME_STORY, 45);
		

		

		// var fontStory = { font: '30px '+GM.text['FONT'], fill: '#D6DE49', stroke: '#000', strokeThickness: 7, align: 'center' };
		// var textStory = this.add.text(GM.world.centerX, 200, GM.text['screen-story-howto'], fontStory);
		// textStory.setOrigin(0.5,0);

		this.buttonContinue = new Button(GM.world.width-20, GM.world.height-20, 'button-continue', this.clickContinue, this);
		this.buttonContinue.setOrigin(1,1);

		this.buttonContinue.x = GM.world.width+this.buttonContinue.width+20;
		this.tweens.add({targets: this.buttonContinue, x: GM.world.width-20, duration: 500, ease: 'Back'});

        //first time users cannot skip thru the story
        if (GM.userName == ''){
            this.buttonContinue.setVisible(false);
        }

		this.cameras.main.fadeIn(3000, 0, 0, 0);
	}
	clickContinue() {
		GM.Sfx.play('click', this);
		GM.fadeOutScene('Game', this);
	}

	
};

const GetValue = Phaser.Utils.Objects.GetValue;
var CreateTextBox = function (scene, x, y, config) {
    var wrapWidth = GetValue(config, 'wrapWidth', 0);
    var fixedWidth = GetValue(config, 'fixedWidth', 0);
    var fixedHeight = GetValue(config, 'fixedHeight', 0);
    var textBox = scene.rexUI.add.textBox({
        x: x,
        y: y,

        background: scene.rexUI.add.roundRectangle(0, 0, 2, 2, 20, COLOR_DARK)
            .setStrokeStyle(2, COLOR_LIGHT),

        //icon: scene.rexUI.add.roundRectangle(0, 0, 2, 2, 20, COLOR_SECONDARY),

        text: GetBBcodeText(scene, wrapWidth, fixedWidth, fixedHeight),

        action: scene.add.image(0, 0, 'nextPage').setTint(COLOR_LIGHT).setVisible(false),

        space: {
            left: 20, right: 20, top: 20, bottom: 20,
            text: 10,
        },

        // page: {
        //     pageBreak: '\f\n'
        // }
    })
        .layout();

    textBox
        .setInteractive()
        .on('pointerdown', function () {
            var icon = this.getElement('action').setVisible(false);
            this.resetChildVisibleState(icon);
            if (this.isTyping) {
                this.stop(true);
            } else if (!this.isLastPage) {
                this.typeNextPage();
            } else {
                // Next actions
            }
        }, textBox)
        .on('pageend', function () {

            if (this.page.pageIndex == 2) {
                scene.cameras.main.fadeOut(1000);
                scene.storyBackground.setTexture('discordStory');
                scene.cameras.main.fadeIn(1000);

            } 
            if (this.page.pageIndex == 3) {
                scene.cameras.main.fadeOut(2000);
                scene.storyBackground.setTexture('shardulStory');
                scene.cameras.main.fadeIn(2000);

            } 

            if (this.isLastPage) {
                return;
            }

            var icon = this.getElement('action').setVisible(true);
            this.resetChildVisibleState(icon);
            icon.y -= 30;
            var tween = scene.tweens.add({
                targets: icon,
                y: '+=30', // '+=100'
                ease: 'Bounce', // 'Cubic', 'Elastic', 'Bounce', 'Back'
                duration: 500,
                repeat: 0, // -1: infinity
                yoyo: false
            });
        }, textBox)
        .on('complete', function () {
            scene.buttonContinue.setVisible(true);
        })
    //.on('type', function () {
    //})

    return textBox;
}

var GetBBcodeText = function (scene, wrapWidth, fixedWidth, fixedHeight) {
    return scene.rexUI.add.BBCodeText(0, 0, '', {
        fixedWidth: fixedWidth,
        fixedHeight: fixedHeight,
        padding: {
            top: 30,
        },

        fontSize: '20px',
        wrap: {
            mode: 'word',
            width: wrapWidth
        },
        maxLines: 4
    })
}