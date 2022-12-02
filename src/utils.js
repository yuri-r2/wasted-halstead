

const COLOR_PRIMARY = 0xC0C741;
const COLOR_SECONDARY = 0xE4943A;
const COLOR_LIGHT = 0xC0C741;
const COLOR_DARK = 0x1F0E1C;

const types = ["trash", "recycle", "compost"];
const itemDescriptions ={ 
'trash-bluebell': "Empty can of Blue Bell icecream",
'trash-bubblewrap': "Bubble wrap",
'trash-chewinggum': "Well-chewed chewing gum",
'trash-ketchup': "Ketchup packet",
'trash-milkcarton': "Empty carton of milk",
'trash-plasticbag': "Plastic grocery bag",

'recycle-spaghettios': "Cleaned out can of SpaghettiOs",
'recycle-aluminium': "Aluminium foil",
'recycle-cakecontainer': "Cleaned out cake container",
'recycle-cardboard': "Broken down cardboard box",
'recycle-cheerios': "Empty box of Cheerios",
'recycle-dasani': "Empty Dasani bottle",

'compost-clamshell': "Clamshell made of sugar cane fibers",
'compost-coffeegrounds': "Used coffee grounds",
'compost-dylans': "Dylan's pizza",
'compost-eggshells': "Egg shells",
'compost-papertowel': "Paper towels",
'compost-parchment': "Parchment paper"
}

var GM = {};
GM.Sfx = {
  init: function (game) {
    game.sound.pauseOnBlur = false;
    GM.Sfx.music = game.sound.add('music-theme');
    GM.Sfx.music.volume = 0.3;
    GM.Sfx.sounds = [];
    GM.Sfx.sounds['click'] = game.sound.add('sound-click');
    GM.Sfx.sounds['gameover'] = game.sound.add('sound-gameover');
    GM.Sfx.sounds['trash'] = game.sound.add('sound-trash');
    game.input.on('pointerdown', function () {
      if (!GM.Sfx.music.isPlaying){
        game.sound.unlock();
        if (!game.sound.locked) {
          GM.Sfx.music.play({loop:true});
        }
        else{  // IF Not wait on unlock event 
          game.sound.once(Phaser.Sound.Events.UNLOCKED, () => {
            GM.Sfx.music.play({loop:true});
          })
        }
      }
    }, game);
  },
  play: function(audio, game) {
    if(GM.Sfx.sounds && GM.Sfx.sounds[audio]) {
      if (!game.sound.locked) {
        GM.Sfx.sounds[audio].play();
      }
      else{  // IF Not wait on unlock event 
        game.sound.unlock();
        game.sound.once(Phaser.Sound.Events.UNLOCKED, () => {
          GM.Sfx.sounds[audio].play();
        })
      }
      
    }
  }
}

// GM.Sfx = {
// 	manage: function(type, mode, game, button, label) {
// 		switch(mode) {
// 			case 'init': {
//         GM.Storage.initUnset('GM-'+type, true);
//         GM.Sfx.status = GM.Sfx.status || [];
//         GM.Sfx.status[type] = GM.Storage.get('GM-'+type);
//         if(type == 'sound') {
//           GM.Sfx.sounds = [];
//           GM.Sfx.sounds['click'] = game.sound.add('sound-click');
//         }
//         else { // music
//           if(!GM.Sfx.music || !GM.Sfx.music.isPlaying) {
//             GM.Sfx.music = game.sound.add('music-theme');
//             GM.Sfx.music.volume = 0.5;
//           }
//         }
// 				break;
// 			}
// 			case 'on': {
// 				GM.Sfx.status[type] = true;
// 				break;
// 			}
// 			case 'off': {
// 				GM.Sfx.status[type] = false;
// 				break;
// 			}
// 			case 'switch': {
// 				GM.Sfx.status[type] =! GM.Sfx.status[type];
// 				break;
// 			}
// 			default: {}
//     }
//     GM.Sfx.update(type, button, label);

//     if(type == 'music' && GM.Sfx.music) {
//       if(GM.Sfx.status['music']) {
//         if(!GM.Sfx.music.isPlaying) {
//           GM.Sfx.music.play({loop:true});
//         }
//       }
//       else {
//         GM.Sfx.music.stop();
//       }
//     }

//     GM.Storage.set('GM-'+type, GM.Sfx.status[type]);
// 	},
// 	play: function(audio) {
//     if(audio == 'music') {
//       if(GM.Sfx.status['music'] && GM.Sfx.music && !GM.Sfx.music.isPlaying) {
//         GM.Sfx.music.play({loop:true});
//       }
//     }
//     else { // sound
//       if(GM.Sfx.status['sound'] && GM.Sfx.sounds && GM.Sfx.sounds[audio]) {
//         GM.Sfx.sounds[audio].play();
//       }
//     }
//   },
//   update: function(type, button, label) {
//     if(button) {
//       if(GM.Sfx.status[type]) {
//         button.setTexture('button-'+type+'-on');
//       }
//       else {
//         button.setTexture('button-'+type+'-off');
//       }
//     }
//     if(label) {
//       if(GM.Sfx.status[type]) {
//         label.setText(GM.Lang.text[GM.Lang.current][type+'-on']);
//       }
//       else {
//         label.setText(GM.Lang.text[GM.Lang.current][type+'-off']);
//       }
//     }
//   }
// };

GM.fadeOutIn = function(passedCallback, context) {
  context.cameras.main.fadeOut(250);
  context.time.addEvent({
    delay: 250,
    callback: function() {
      context.cameras.main.fadeIn(250);
      passedCallback(context);
    },
    callbackScope: context
  });  
}
GM.fadeOutScene = function(sceneName, context) {
  context.cameras.main.fadeOut(250);
  context.time.addEvent({
      delay: 250,
      callback: function() {
        context.scene.start(sceneName);
      },
      callbackScope: context
  });
};

class Button extends Phaser.GameObjects.Image {
  constructor(x, y, texture, callback, scene, noframes) {
    super(scene, x, y, texture, 0);
    this.setInteractive({ useHandCursor: true });
    
    this.on('pointerup', function() {
      if(!noframes) {
        this.setFrame(1);
      }
    }, this);

    this.on('pointerdown', function() {
      if(!noframes) {
        this.setFrame(2);
      }

      callback.call(scene);
    }, this);

    this.on('pointerover', function() {
      if(!noframes) {
        this.setFrame(1);
      }
    }, this);

    this.on('pointerout', function() {
      if(!noframes) {
        this.setFrame(0);
      }
    }, this);

    scene.add.existing(this);
  }
};

class GameItem extends Phaser.Physics.Matter.Image {
  constructor(x, y, type, texture, scene) {
    super(scene.matter.world, x, y, texture, 0, {isSensor: true, circleRadius: 125, frictionAir: 0.15, label: 'GameItem', ignoreGravity: false});
    this.setScale(0.45, 0.45);
    this.setBounce(0);
    this.setDensity(0.1);
    this.setPipeline('Light2D')
    this.type = type;
    //Add Text Descrption
    var fontItem = { font: '30px '+GM.text['FONT'], fill: '#D6DE49', stroke: '#000', strokeThickness: 7, align: 'center' };
    this.text = new Phaser.GameObjects.Text(scene, x, y-120, type, fontItem);
    this.text.setOrigin(0.5,0);
    scene.add.existing(this);
    scene.add.existing(this.text);
    // console.log(this.text);
    this.text.setVisible(false);
    // this._scaleX = 1;
    scene.items.push(this);
  }
}

class GameBin extends Phaser.Physics.Matter.Image {
  constructor(type, x, y, scene) {
    var Bodies = Phaser.Physics.Matter.Matter.Bodies;
    super(scene.matter.world, x, y, type, 0);
    this.setRectangle(160, 40, { label: 'bin', isStatic: true, isSensor: true });
    this.setScale(1, 1);
    this.setPipeline('Light2D');
    // this.setExistingBody(this.rect);
    this.type = type;
    this.setInteractive({ useHandCursor: true });
    this.on('pointerup', function() {
      this.setFrame(1);
    }, this);

    this.on('pointerdown', function() {
      this.setFrame(1);
    }, this);

    this.on('pointerover', function() {
      this.setFrame(1);
    }, this);

    this.on('pointerout', function() {
      this.setFrame(0);
    }, this);

    this.setOrigin(0.5,0.5);
    this.setAlpha(0);

    
    scene.add.existing(this);
    scene.tweens.add({targets: this, alpha: 1, duration: 500, ease: 'Linear'});

    
    this.depth = 0;
  }
}

GM.GameManager = {
  binCollision: function (scene, binObject, itemObject){
    if (!itemObject) return; //prevent double collision for already removed item
    if (itemObject.type === binObject.type){
      GM.Sfx.play('trash', scene);
      GM.GameManager.addPoints(scene);
      //GM.GameManager.updateItem(scene);
      scene.removeItem(itemObject);
      //GM.GameManager.spawnRandomItem(scene);
    }
    else {
      GM.GameManager.endGame(scene);
    }
  },
  endGame: function (scene){
    scene.clearItems();
    scene._runOnce = false;
    scene.stateStatus = 'gameover';
    GM.Sfx.play('gameover', scene);
  },
  borderCollision: function(scene, itemObject){
    if (!itemObject) return; //prevent double collision for already removed item
    scene.removeItem(itemObject);
    const text = "Discarded " + itemDescriptions[itemObject.texture.key];
    var itemDiscardedText = scene.add.text(GM.world.centerX, 100, text, { font: '25px '+GM.text['FONT'], fill: '#E4943A', stroke: '#000', strokeThickness: 4 });
		itemDiscardedText.setOrigin(0.5, 0.5);
    scene.tweens.add({targets: itemDiscardedText, alpha: 0, y: 50, duration: 4000, ease: 'Linear'});
    scene.cameras.main.shake(100, 0.01, true);
  },
  addPoints: function(scene) {
		scene._score += 1;
    var randX = Phaser.Math.Between(200, GM.world.width-200);
    var randY = Phaser.Math.Between(200, GM.world.height-200);
		var pointsAdded = scene.add.text(randX, randY, '+1', { font: '48px '+GM.text['FONT'], fill: '#D6DE49', stroke: '#000', strokeThickness: 10 });
		pointsAdded.setOrigin(0.5, 0.5);
    scene.tweens.add({targets: pointsAdded, alpha: 0, y: randY-50, duration: 1000, ease: 'Linear'});
    scene.cameras.main.shake(100, 0.01, true);
    scene.textScore.setText(GM.text['gameplay-score']+scene._score);
  },
  removeItem: function(scene, itemToRemove){
    for (var i = 0; i < scene.items.length; i++){
      if (scene.items[i] == itemToRemove){
        console.log(itemToRemove);
        scene.items[i].text.destroy();
        scene.items[i].destroy();
        scene.items.splice(i, 1); 
      }
    }
  },
  clearItems: function(scene){
    for (var item of scene.items){
      item.text.destroy();
      item.destroy();
    }
    scene.items = [];
  },
}

GM.Storage = {
	availability: function() {
		if(!(!(typeof(window.localStorage) === 'undefined'))) {
			console.log('localStorage not available');
			return null;
		}
	},
	get: function(key) {
		this.availability();
		try {
			return JSON.parse(localStorage.getItem(key));
		}
		catch(e) {
			return window.localStorage.getItem(key);
		}
	},
	set: function(key, value) {
		this.availability();
		try {
			window.localStorage.setItem(key, JSON.stringify(value));
		}
		catch(e) {
			if(e == QUOTA_EXCEEDED_ERR) {
				console.log('localStorage quota exceeded');
			}
		}
	},
	initUnset: function(key, value) {
		if(this.get(key) === null) {
			this.set(key, value);
		}
	},
	getFloat: function(key) {
		return parseFloat(this.get(key));
	},
	setHighscore: function(key, value) {
		if(value > this.getFloat(key)) {
			this.set(key, value);
		}
	},
	remove: function(key) {
		this.availability();
		window.localStorage.removeItem(key);
	},
	clear: function() {
		this.availability();
		window.localStorage.clear();
	}
};

GM.Lang = {
  current: 'en',
  options: ['en'],
  parseQueryString: function(query) {
    var vars = query.split('&');
    var query_string = {};
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=');
      if (typeof query_string[pair[0]] === 'undefined') {
        query_string[pair[0]] = decodeURIComponent(pair[1]);
      } else if (typeof query_string[pair[0]] === 'string') {
        var arr = [query_string[pair[0]], decodeURIComponent(pair[1])];
        query_string[pair[0]] = arr;
      } else {
        query_string[pair[0]].push(decodeURIComponent(pair[1]));
      }
    }
    return query_string;
  },
  updateLanguage: function(lang) {
    var query = window.location.search.substring(1);
    var qs = GM.Lang.parseQueryString(query);
    if(qs && qs['lang']) {
      console.log('LANG: '+qs['lang']);
      GM.Lang.current = qs['lang'];
    } else {
      if(lang) {
        GM.Lang.current = lang;
      }
      else {
        GM.Lang.current = navigator.language;
      }
    }
    if(GM.Lang.options.indexOf(GM.Lang.current) == -1) {
      GM.Lang.current = 'en';
    }
  },
  text: {
    'en': {
      'FONT': 'Pixel',
      'settings': 'SETTINGS',
      'sound-on': 'Sound: ON',
      'sound-off': 'Sound: OFF',
      'music-on': 'Music: ON',
      'music-off': 'Music: OFF',
      'keyboard-info': 'Press K for keyboard shortcuts',
      'credits': 'CREDITS',
      'madeby': 'GM made by',
      'team': 'THE TEAM',
      'coding': 'coding',
      'design': 'design',
      'testing': 'testing',
      'musicby': 'Music by',
      'key-title': 'KEYBOARD SHORTCUTS',
      'key-settings-title': 'Settings',
      'key-settings-onoff': 'S - show/hide settings',
      'key-audio': 'A - turn sound on/off',
      'key-music': 'M - turn music on/off',
      'key-credits': 'C - show/hide credits',
      'key-shortcuts': 'K - show/hide keyboard shortcuts',
      'key-menu': 'Main menu',
      'key-start': 'Enter - start game',
      'key-continue': 'Enter - continue',
      'key-gameplay': 'Gameplay',
      'key-button': 'Enter - activate CLICK ME button',
      'key-pause': 'P - turn pause screen on/off',
      'key-pause-title': 'Pause screen',
      'key-back': 'B - back to main menu',
      'key-return': 'P - return to the game',
      'key-gameover': 'Game over screen',
      'key-try': 'T - try again',
      'gameplay-score': 'Score: ',
      'gameplay-timeleft': 'Time left: ',
      'gameplay-paused': 'PAUSED',
      'gameplay-gameover': 'GAME OVER',
      'menu-highscore': 'Highscore:  ',
      'menu-rank': 'Rank:  ',
      'menu-username': 'Name:  ',
      'screen-story-howto': 'Click on the appropriate\nbin to dispose of the given item!\n\n\n\nif the item requires special\ndisposal - click on the item\nitself to reject it!'
    },
  }
};

GM.leaderboardManager = {
 initLeaderboard: function(scene){
  const firebaseConfig = {
      apiKey: "AIzaSyAxIVrH73Babam-4GlJSkDYqoRu3V3j4CY",
      authDomain: "wasted-in-halstead.firebaseapp.com",
      projectId: "wasted-in-halstead",
      storageBucket: "wasted-in-halstead.appspot.com",
      messagingSenderId: "902570193615",
      appId: "1:902570193615:web:d93323a8072492c451bdba"
    };
    var rexFire = scene.plugins.get('rexfirebaseplugin').initializeApp(firebaseConfig);
    var leaderBoard = rexFire.add.leaderBoard({
      root: 'leaderboard-main',
      timeFilters: false,
      boardID: 'mainBoardID',
      tag: 'mainTag',
      pageItemCount: 10
    })
    GM.leaderBoard = leaderBoard;
  },
  displayTopScores: function(scene) {
    GM.leaderBoard.loadFirstPage()
    .then(function(scores) {
        scores.forEach((el, index) => {
            index = index + 1
            var offsetY = index * 30;
            var fontScore = { font: '30px '+GM.text['FONT'], fill: '#D6DE49', stroke: '#000', strokeThickness: 3 };
            var textScore = scene.add.text(30, GM.world.centerY-150 + offsetY, (index + '. ' + el.userName + ': ' + el.score), fontScore);
        });
    })
    .catch(function(error) {console.log(error)})
  },
  getScoreDialog: function (scene, score){
		var scoreDialog = GM.leaderboardManager.createScoreDialog(scene, {
            x: GM.world.centerX,
            y: GM.world.centerY + 50,
            title: 'Enter your name to\nsubmit this score',
            username: GM.userName,
            width: 400,
        })
            .on('submit!', function (username) {
                GM.leaderBoard.setUser({
                  userID: GM.Storage.get('userID'),
                  userName: username
                });
                GM.leaderBoard.post(score)
                .then(function(record) {
                  GM.Sfx.play('click', scene);
                  GM.fadeOutScene('MainMenu', scene);
                })
                .catch(function(error) {console.log(error)})
            })
            //.drawBounds(this.add.graphics(), 0xff0000);
            .popUp(500);
	},
  createScoreDialog: function(scene, config, onSubmit){
    const GetValue = Phaser.Utils.Objects.GetValue;
    var username = GetValue(config, 'username', '');
    var title = GetValue(config, 'title', 'Welcome');
    var x = GetValue(config, 'x', 0);
    var y = GetValue(config, 'y', 0);
    var width = GetValue(config, 'width', undefined);
    var height = GetValue(config, 'height', undefined);

    var background = scene.rexUI.add.roundRectangle(0, 0, 10, 10, 10, COLOR_DARK);
    var titleField = scene.add.text(0, 0, title, {fontSize: 20});

    var userNameField = scene.rexUI.add.label({
        orientation: 'x',
        background: scene.rexUI.add.roundRectangle(0, 0, 10, 10, 10).setStrokeStyle(2, COLOR_SECONDARY),
        icon: scene.add.image(0, 0, 'user'),
        text: scene.rexUI.add.BBCodeText(0, 0, username, { fixedWidth: 150, fontSize: 20, fixedHeight: 50, valign: 'center' }),
        space: { top: 10, bottom: 10, left: 10, right: 10, icon: 20, }
    })
    .setInteractive()
    .on('pointerdown', function () {
        var config = {
            onTextChanged: function(textObject, text) {
                username = text;
                textObject.text = text;
            }
        }
        scene.rexUI.edit(userNameField.getElement('text'), config);
    });

    var loginButton = scene.rexUI.add.label({
        orientation: 'x',
        background: scene.rexUI.add.roundRectangle(0, 0, 30, 30, 10, COLOR_SECONDARY),
        text: scene.add.text(0, 0, 'Submit!', {fontSize: 20}),
        space: { top: 20, bottom: 20, left: 20, right: 20 }
    })
    .setInteractive()
    .on('pointerdown', function () {
        loginDialog.emit('submit!', username);
    });

    var loginDialog = scene.rexUI.add.sizer({
      orientation: 'y',
      x: x,
      y: y,
      width: width,
      height: height,
    })
      .addBackground(background)
      .add(titleField, 0, 'center', { top: 10, bottom: 10, left: 10, right: 10 }, false)
      .add(userNameField, 0, 'left', { bottom: 10, left: 10, right: 10 }, true)
      // .add(passwordField, 0, 'left', { bottom: 10, left: 10, right: 10 }, true)
      .add(loginButton, 0, 'center', { top: 10, bottom: 10, left: 10, right: 10 }, false)
      .layout();

  return loginDialog;
  }
}

function uuidv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

// // Usage tracking - remember to replace with your own!
// var head = document.getElementsByTagName('head')[0];
// var script = document.createElement('script');
// script.type = 'text/javascript';
// script.onload = function() {
//   window.dataLayer = window.dataLayer || [];
//   function gtag(){dataLayer.push(arguments);}
//   gtag('js', new Date());
//   gtag('config', 'UA-30485283-26');
// }
// script.src = 'https://www.googletagmanager.com/gtag/js?id=UA-30485283-26';
// head.appendChild(script);