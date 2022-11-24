class Boot extends Phaser.Scene {
    constructor() {
        super('Boot');
    }
    preload() {
        EPT.Storage.initUnset('userID', uuidv4());
        this.load.image('background', 'img/background.png');
        this.load.image('logo-enclave', 'img/logo-enclave.png');
        this.load.image('loading-background', 'img/loading-background.png');
        WebFont.load({ custom: { families: ['Pixel'], urls: ['fonts/Pixel.css'] } });
        this.load.plugin('rexfirebaseplugin', 'src/plugins/rexfirebaseplugin.min.js', true);
    }
    create() {
        EPT.world = {
            width: this.cameras.main.width,
            height: this.cameras.main.height,
            centerX: this.cameras.main.centerX,
            centerY: this.cameras.main.centerY
        };
        EPT.Lang.updateLanguage('en');
        EPT.text = EPT.Lang.text[EPT.Lang.current];
        EPT.leaderboardManager.initLeaderboard(this);
        this.scene.start('Preloader');
    }

    
}