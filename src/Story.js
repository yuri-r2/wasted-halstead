class Story extends Phaser.Scene {
    constructor() {
        super('Story');
    }
    create() {
		this.add.sprite(0, 0, 'background').setOrigin(0,0);

		var fontStory = { font: '30px '+GM.text['FONT'], fill: '#D6DE49', stroke: '#000', strokeThickness: 7, align: 'center' };
		var textStory = this.add.text(GM.world.centerX, 200, GM.text['screen-story-howto'], fontStory);
		textStory.setOrigin(0.5,0);

		var buttonContinue = new Button(GM.world.width-20, GM.world.height-20, 'button-continue', this.clickContinue, this);
		buttonContinue.setOrigin(1,1);

		buttonContinue.x = GM.world.width+buttonContinue.width+20;
		this.tweens.add({targets: buttonContinue, x: GM.world.width-20, duration: 500, ease: 'Back'});

		this.cameras.main.fadeIn(250, 0, 0, 0);
	}
	clickContinue() {
		GM.Sfx.play('click', this);
		GM.fadeOutScene('Game', this);
	}
};