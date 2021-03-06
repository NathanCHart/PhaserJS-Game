//Initialisation of our global variables

//Main Gameplay Variables
var isoGroup;
var cursorPos; 
var cursor;
var player;
var bullets;
var turret;
var fireRate = 100;
var nextFire = 0;
var speed = 100;


//Score Variables
var highscore = 0;
var score = 0;
var scoreText;
var highscoreText;

//Wave Variables
var newWave = 0;
var j;
var waves = 0;
var wavestext;

//Misc Gameplay Variables and modifiers
var xValue = 0;
var life = 1;
var infinity = 10;
var inf = 1;
var bullet;
var damage = 10;
var bulletSpeed = 0;
var w = 850, h = 600;
var money = 0;
var scoreMultiplier = 10;

//Audio variables
var bulletSound;
var clearSound;
var clickSound;
var purchaseSound;
var music;


var Game = {
    

//The preload function: loading all our images, sprites and audio prior to use
    preload : function () {
    
    //Load in sprites
    game.load.image('tile', './assets/images/tile45.png');
    game.load.image('tile2', './assets/images/tile3.png');
    game.time.advancedTiming = true;
    game.load.image('turret', './assets/images/turret1.2.png');
    game.load.image('menu', './assets/images/menu.png');
    game.load.image('menu2', './assets/images/menu2.png');
    game.load.image('menu3', './assets/images/menu3.png');
    game.load.image('bullet1', './assets/images/ball1.5.png');
    game.load.image('bullet5', './assets/images/infinityCube.png');
    game.load.image('ball', './assets/images/spikedball2.png');
    
    //Load in spritesheets
    game.load.spritesheet('Key', './assets/images/ball1.2.png', 23, 18);
    game.load.spritesheet('Flash', './assets/images/flash.png', 850, 600);
      
    //Load in Audio   
    game.load.audio('clear',['./assets/sounds/Explosion.mp3','./assets/sounds/Explosion.ogg']);
    game.load.audio('bullet',['./assets/sounds/Bullet.mp3','./assets/sounds/Bullet.ogg']);
    game.load.audio('music',['./assets/sounds/gme.mp3','./assets/sounds/gme.ogg']);
    game.load.audio('purchase',['./assets/sounds/Purchase_Sound.mp3','./assets/sounds/Purchase_Sound.ogg']);
    game.load.audio('click',['./assets/sounds/Click_Sound.mp3','./assets/sounds/Click_Sound.ogg']);
        
    },

    
//the Create function: In this function we are creating our assets by calling the sprites from the preload function
    create : function () {
    
        //linking all the audio to variables so they can be played when called on
        music = game.add.audio('music');
        clearSound = game.add.audio('clear');
        bulletSound = game.add.audio('bullet');
        clickSound = game.add.audio('click');
        purchaseSound = game.add.audio('purchase');
        
        //Loops the game music which is a four bar track that can be looped, sets the volume at 0.6, this loop can be broken with music.stop()
        music.loopFull(0.6)
        
        
        //Start the different physics systems, arcade and isoarcade
        //load the isometric plugin
        game.plugins.add(new Phaser.Plugin.Isometric(game));
        game.physics.startSystem(Phaser.Physics.ARCADE); 
        game.physics.startSystem(Phaser.Plugin.Isometric.ISOARCADE);
    
        //create a isoGroup and isoGroup1
        //we use this to handle collisions later on between isometric objects within this group
        //set the anchor point (where the map is drawn)
        isoGroup = game.add.group();
        isoGroup1 = game.add.group();

        game.iso.anchor.setTo(0.53,0.15);
    
        
        // Call the spawnTiles function in order to make our tiles.
        // Let's make a load of tiles on a grid.
        this.spawnTiles();
        
        // Provide a 3D position for the cursor
        cursorPos = new Phaser.Plugin.Isometric.Point3(); 
        
        // Create a custom timer
        timer = game.time.create();
        
        // Create a delayed event 30s from now
        timerEvent = timer.add(Phaser.Timer.MINUTE * 0 + Phaser.Timer.SECOND * 5, this.resetTime, this);
        
        // Start the timer 
        timer.start();
        
        //sets the initial number of enemies on screen
        j = 0;
    
        
        //Set score text to screen, to be updated and max wave achieved.
        highscoreText = game.add.text(710, 520, 'Highscore: '+highscore, {font: '25px Agency FB', fill: '#fff'});
        
        highwaveText = game.add.text(710, 560, 'Max wave: '+newWave, {font: '25px Agency FB', fill: '#fff'});
        
        //add text for all local variables that the player needs to know, such as wave and amout of scraps they have to spend
        scoreText = game.add.text(10, 50, 'Score: 0', { font: '25px Agency FB', fill: '#33cc00' });
        
        wavestext = game.add.text(10, 90, 'Wave: ' + waves, {font: '25px Agency FB', fill: '#b32d00'});
        
        moneyText = game.add.text(10, 10, 'Scraps: ' + money, {font: '25px Agency FB', fill: '#C0C0C0'});
        
        speedText = game.add.text(10, 440, 'Player-Speed: ' + speed + '/500', {font: '25px Agency FB', fill: '#3BE2F8'});
        
        bulletSpeedText = game.add.text(10, 480, 'Bullet-Speed: ' + bulletSpeed + '/1000', {font: '25px Agency FB', fill: '#3BE2F8'});
        
        multiplierText = game.add.text(10, 520, 'Score-Multiplier: ' + scoreMultiplier + '/200', {font: '25px Agency FB', fill: '#3BE2F8'});
        
        multiplierMoneyText = game.add.text(10, 560, 'Money-Multiplier: ' + xValue + '/10', {font: '25px Agency FB', fill: '#3BE2F8'});
        
       
        //Set World Bounds
        game.world.bounds.setTo(100, 100, 800, 800);      
        
        
        // We are creating a player - this is an isometric sprite
        // It is the base of our turret
        // We set its anchor point
        // enable isoArcade physics on the player
        // stop it from leaving the world bounds
        // Dont allow player rotation
        player = game.add.isoSprite(168, 168, 0, 'tile2', 0, isoGroup);
        player.anchor.set(0.5);
        game.physics.isoArcade.enable(player);
        player.body.collideWorldBounds = true
        game.physics.enable(player, Phaser.Physics.ARCADE);
        player.body.allowRotation = false;
    
        
        // We are creating a turret - this is an isometric sprite
        // It the turret piece on top of the player
        // We set its anchor point
        // enable isoArcade physics on the player
        // stop it from leaving the world bounds       
        turret = game.add.isoSprite(169, 168, 29, 'turret', 0,  isoGroup);
        turret.tint = 0x86bfda;
        turret.anchor.set(0.5);
        game.physics.isoArcade.enable(turret);
        turret.body.collideWorldBounds = true
        game.physics.enable(turret, Phaser.Physics.ARCADE);
        
        
        
        // Creating the bullet game group
        // Enable body = allow collisions
        // set physics type
        // kill bullet if it goes out of world bounds.
        // Create multiple bullets (50)
        bullets = game.add.group();
        bullets.enableBody = true;
        bullets.physicsBodyType = Phaser.Physics.ARCADE;
        bullets.createMultiple(2, 'bullet1', 0, false);
        bullets.setAll('anchor.x', 0.09);
        bullets.setAll('anchor.y', 1.5);
        bullets.setAll('outOfBoundsKill', true);
        bullets.setAll('checkWorldBounds', true);
       
        
        //Creating the core game group
        //add blinking animations 
        //play blinking animation
        heart = game.add.group();
        heart = game.add.sprite(-11, -21, 'Key');
        game.physics.arcade.enable(heart);
        heart.animations.add('blink');
        heart.animations.play('blink', 5, true);

    
        //Group for playing nuke spritesheet
        flash = game.add.group();
      
        
        // This is where the floating balls the follow you are created
        // Enable body for collision handling
        // We are currently creating 5 bullets randomly on the map
        balls = game.add.group();
        
        
        
        // This is where we add cursors to our game allowing movement
        // Added up, down, left, right and spacebar functionality 
        this.cursors = game.input.keyboard.createCursorKeys();
        this.game.input.keyboard.addKeyCapture([
            
        Phaser.Keyboard.LEFT,
        Phaser.Keyboard.RIGHT,
        Phaser.Keyboard.UP,
        Phaser.Keyboard.DOWN,
        Phaser.Keyboard.SPACEBAR    
        ]);


        //WDA keyboard movement
        game.input.keyboard.addKey(Phaser.Keyboard.A)
        game.input.keyboard.addKey(Phaser.Keyboard.D)
        game.input.keyboard.addKey(Phaser.Keyboard.W)
        game.input.keyboard.addKey(Phaser.Keyboard.S)
        game.input.keyboard.addKey(Phaser.Keyboard.P)
        
        
        //Took part of the code from phaser example
        //https://phaser.io/examples/v2/misc/pause-menu
        // Creating the pause button prototype
        pause_label = game.add.sprite(w - 170, 10, 'menu3');
        pause_label.inputEnabled = true;
        pause_label.events.onInputUp.add(function ()  {
        // When the pause button is pressed, we pause the game              
        game.paused = true;
    
       
        // Then add the menu at point (425,300 = middle of screen)
        // Set its anchor point
        menu = game.add.sprite(w/2, h/2, 'menu');
        menu.anchor.setTo(0.5, 0.5);
        menu2 = game.add.sprite(w/2, h-520, 'menu2');
        menu2.anchor.setTo(0.5, 0.5);

       
        // And a label to illustrate which menu item was chosen. (This is not necessary)
        // good indicator as of now to see what box has been clicked 
        // this will later on become the shop
        choiseLabel = game.add.text(425, 82, 'Click outside menu to continue', { font: '20px  Agency FB', fill: '#fff' });
        choiseLabel.anchor.setTo(0.5, 0.5);
        
    });   
       
        //Unpauses the game
        game.input.onDown.add(unpause, self);
        
        
    },
   


    // The update function updates our game as it is played
    update: function() {
        
        // This deals with the collision between the bullets and ball enemies
        // We call the killplayer function which will handle the collision
        game.physics.arcade.overlap(bullets,balls, destroyBalls, null, this);   
        game.physics.arcade.overlap(heart,balls, killplayer, null, this); 
        
        // Hover effect
        game.iso.unproject(game.input.activePointer.position, cursorPos);

        // Loop through all tiles and test to see if the 3D position from above intersects with the automatically generated IsoSprite tile bounds.
        isoGroup.forEach(function (tile) {
            var inBounds = tile.isoBounds.containsXY(cursorPos.x, cursorPos.y);
            // If it does, do a little animation and tint change.
            if (!tile.selected && inBounds) {
                tile.selected = true;
                tile.tint = 0xFF0000;
            }
            
            // If not, revert back to how it was.
            else if (tile.selected && !inBounds) {
                tile.selected = false;
                tile.tint = 0xffffff;
               
                //tint colour red
            }
        });
        
        // Second isoGroup - doesnt do anything as of now
        isoGroup1.forEach(function (tile) {
            
        });
        
        
        // Deals with the collision between both items in the IsoGroup 
        game.physics.isoArcade.collide(isoGroup);
        game.iso.topologicalSort(isoGroup);
        // Deals with the collision between both items in the IsoGroup1 (nothing)
        game.physics.isoArcade.collide(isoGroup1);
        game.iso.topologicalSort(isoGroup1);
        
        
    
         // Movement changed for x, y (non iso movement)
         // Up, Down, Left, right movement
        if (this.cursors.up.isDown  || game.input.keyboard.isDown(Phaser.Keyboard.W)) {
            player.body.velocity.x = -speed;
            player.body.velocity.y = -speed;
            turret.body.velocity.x = -speed;
            turret.body.velocity.y = -speed;
        }
        else if (this.cursors.down.isDown || game.input.keyboard.isDown(Phaser.Keyboard.S)) {
            player.body.velocity.x = speed;
            player.body.velocity.y = speed;
            turret.body.velocity.x = speed;
            turret.body.velocity.y = speed;
        }
        else if (this.cursors.left.isDown || game.input.keyboard.isDown(Phaser.Keyboard.A)) {
            player.body.velocity.x = -speed;
            player.body.velocity.y = speed;
            turret.body.velocity.x = -speed;
            turret.body.velocity.y = speed;
        }
       else if (this.cursors.right.isDown || game.input.keyboard.isDown(Phaser.Keyboard.D)) {
            player.body.velocity.x = speed;
            player.body.velocity.y = -speed;
            turret.body.velocity.x = speed;
            turret.body.velocity.y = -speed;
        }
        else {
            player.body.velocity.x = 0;
            player.body.velocity.y = 0;
            turret.body.velocity.x = 0;
            turret.body.velocity.y = 0;
        }
      
     
       
        
    //Rotates our turret toward the mouse
    turret.rotation = game.physics.arcade.angleToPointer(turret);
    //Makes the core the child of the parent player (exact same movement)
    player.addChild(heart);   
        
        
    //Code partially taken from Phaser website
    //https://phaser.io/examples/v2/arcade-physics/accelerate-to-pointer
    //This deals with the balls and hows they move towards the player
    //As each wave increases, the number of enemies on screen are increased
    //By a factor of x+2, the speed is also increased, increasing much faster 
    //In the begining as there are less enemies on screen.
    if(waves == 1 || waves == 2 || waves == 3){
        
    balls.forEach( function(balls) {
        this.accelerateToObject(balls, player, 50, 250, 250);
        
    }, game.physics.arcade);
    }
    if(waves == 4 || waves == 5 || waves == 6){

    balls.forEach( function(balls) {
        this.accelerateToObject(balls, player, 100, 250, 250);
        
    }, game.physics.arcade);
    }
    if(waves == 7 || waves == 8 || waves == 9){
        
    balls.forEach( function(balls) {
        this.accelerateToObject(balls, player, 125, 250, 250);
        
    }, game.physics.arcade);
    }
    if(waves == 10 || waves == 11 || waves == 12){
        
    balls.forEach( function(balls) {
        this.accelerateToObject(balls, player, 150, 250, 250);
        
    }, game.physics.arcade);
    }
    if(waves == 13 || waves == 14 || waves == 15){

    balls.forEach( function(balls) {
        this.accelerateToObject(balls, player, 170, 250, 250);
        
    }, game.physics.arcade);
    }
    if(waves == 16 || waves == 17 || waves == 18 || waves == 19){
        
    balls.forEach( function(balls) {
        this.accelerateToObject(balls, player, 190, 250, 250);
        
    }, game.physics.arcade);
    }
    if(waves == 20 || waves == 21 || waves == 22){
        
    balls.forEach( function(balls) {
        this.accelerateToObject(balls, player, 200, 250, 250);
        
    }, game.physics.arcade);
    }
    if(waves == 23 || waves == 24 || waves == 25){

    balls.forEach( function(balls) {
        this.accelerateToObject(balls, player, 250, 250, 250);
        
    }, game.physics.arcade);
    }
    if(waves == 26 || waves == 27 || waves == 28 || waves == 29){
        
    balls.forEach( function(balls) {
        this.accelerateToObject(balls, player, 275, 250, 250);
        
    }, game.physics.arcade);
    }
    if(waves >= 30){
        
    balls.forEach( function(balls) {
        this.accelerateToObject(balls, player, 1000, 250, 250);
        
    }, game.physics.arcade);
    }
        
      
        
    //Code Partially taken from phaser website
    //https://phaser.io/examples/v2/games/tanks
    //This is how the bullets are fired, calls the fire function that handles it
    if (game.input.activePointer.isDown)
    {
        fire();
    }   
        
    //The function that deals with the collision of the balls and bullets
    //Adds score
    //Plays sounds
    //Adds money
     function destroyBalls(bullets, balls) {   
            if(life < infinity){
            bullets.kill();
            }
            enemyHealth = enemyHealth - damage;
            console.log(enemyHealth);
            if(enemyHealth <= 0){
            balls.kill();
            var randomMoney= game.rnd.integerInRange(0, 0+xValue);
            console.log(randomMoney);
            score = score + scoreMultiplier;
            money = money + (10 + randomMoney);
            scoreText.text = 'Score: ' + score;
            moneyText.text = 'Scraps: ' + money;
            clearSound.play();
            }
        }
    

      //The function that deals with the collision of the balls and player
      //kills ball
      //kills player
      //Updates highscore by calling 'updatehighscore' function
      //Starts game over state.
      function killplayer(heart, balls) {   
        console.log("collide");
        balls.kill();
        player.kill();
        music.stop();
        updatehighscore();
        game.state.start('Game_Over');
          
        }
    },

  //Taken from rotates website
  //http://rotates.org/phaser/iso/examples/interaction.htm
  //Function used for drawing the base tilemap
  spawnTiles: function () {
        var tile;
        for (var xx = 0; xx < 408; xx += 38) {
            for (var yy = 0; yy < 408; yy += 38) {
                // Create a tile using the new game.add.isoSprite factory method at the sspecified position.
                // The last parameter is the group you want to add it to (just like game.add.sprite)
             
                if( xx == 0 || yy == 0){
                tile = game.add.isoSprite(xx, yy, 0, 'tile', 0, isoGroup);
                tile.anchor.set(0.5, 0);
            
            }
                else{
                tile = game.add.isoSprite(xx, yy, 0, 'tile', 0, isoGroup);
                tile.anchor.set(0.5, 0); 
                
                    }
                }
            }
        },
    
     render: function () {
        // If our timer is running, show the time in a nicely formatted way, else show 'Done!'
        if (timer.running) {
            game.debug.text("Next wave spawns in: " + this.formatTime(Math.round((timerEvent.delay - timer.ms) / 1000)), 310, 585, "#b32d00", '25px Agency FB' );
        }
        else {
            game.debug.text("Done!", 450, 560, "#0f0");
        }
         
        // game.add.text(425, 50, 'Click outside menu to continue', { font: '30px Arial', fill: '#fff' });
    },
    
    resetTime: function() {
        timer = game.time.create();
        
        // Create a delayed event 30s from now
        timerEvent = timer.add(Phaser.Timer.MINUTE * 0 + Phaser.Timer.SECOND * 5, this.resetTime, this);
        
        // Start the timer
        timer.start();
        
        //adds one to the waves
        //updates text
        //updates wave
        //adds two to j (amount of enemies)
        waves++;
        wavestext.text = 'Wave: ' + waves;
        updateWave();
        j = j+2;
        

        //Creates a new enemies group for each wave
        balls.enableBody = true;
        for (var i = 0; i < j; i++)
        {
  
        var ball = balls.create(game.world.randomX, game.world.randomY, 'ball');
        enemyHealth = 10;
        
        }
        
    },
    
    //Function for working out minutes and seconds 
    formatTime: function(s) {
        // Convert seconds (s) to a nicely formatted and padded time string
        var minutes = "0" + Math.floor(s / 60);
        var seconds = "0" + (s - minutes * 60);
        return minutes.substr(-2) + ":" + seconds.substr(-2);   
    }
    
        
    };


    //Function for firing the bullet
    //Resets the bullet if bullet not alive
    //Bullet moves to pointer (click event)
    //player bulletsound
    function fire() {

        if (game.time.now > nextFire && bullets.countDead() > 0)
            {
                nextFire = game.time.now + 100;

                bullet = bullets.getFirstDead();
                
                bullet.reset(player.x - 8, player.y - 8);

                game.physics.arcade.moveToPointer(bullet, 300+bulletSpeed);
                
                bulletSound.play();
            }

    }

    //Function to update highscore if needed
    function updatehighscore(){
        if(score > highscore){
            highscore = score;
            localStorage.highscore;
        }
    }
 

    function updateWave(){
        if(waves > newWave){
            newWave = waves;
            localStorage.newWaves;
        }
    }

    //Part of this function used from phaser example
    //https://phaser.io/examples/v2/misc/pause-menu
    //This is the pause function
    // Deals with everything to do with the pause menu (shop)
    function unpause(event){
        // Only act if paused
        if(game.paused){
            // Calculate the corners of the menu
            var x1 = w/2 - 540/2, x2 = w/2 + 540/2,
                y1 = h/2 - 360/2, y2 = h/2 + 360/2;
            
            
            
            // Check if the click was inside the menu
            if(event.x > x1 && event.x < x2 && event.y > y1 && event.y < y2 ){
                    
                // The choicemap is an array that will help us see which item was clicked
                var choisemap = ['one', 'two', 'three', 'four', 'five', 'six'];
                // Get menu local coordinates for the click
                var x = event.x - x1,
                    y = event.y - y1;

                // Calculate the choice 
                var choise = Math.floor(x / 180) + 3*Math.floor(y / 180);
                // Display the choice
        
                
                //if player clicks the first item in the shop
                //decrements money if possible
                //prints out messages to inform player
                //updates global variables
                if(choisemap[choise] == 'one' ){
                console.log("1"); 
                if(bulletSpeed <= 1000 && money < 10){
                    choiseLabel.text = 'NOT ENOUGH SCRAPS!';        
                }
                if(bulletSpeed >= 1000 && money >= 10){
                   choiseLabel.text = 'MAX BULLET SPEED REACHED!';    
                }
                 if(bulletSpeed >= 1000 && money < 10){
                    choiseLabel.text = 'MAX BULLET SPEED REACHED!';   
                }
                if(money >= 10 && bulletSpeed < 1000){
                bulletSpeed = bulletSpeed + 50;
                money = money - 10;
                moneyText.text = 'Scraps: ' + money;
                bulletSpeedText.text = 'Bullet-Speed: ' + bulletSpeed + '/1000';
                choiseLabel.text = 'Purchased Bullet speed!';
                }
                }
                
                //If player clicks the second item in the shop
                //Decrements money if possible
                //Prints out messages to inform player
                //Updates global variables
                if(choisemap[choise] == 'two'){
                console.log("2"); 
                if(scoreMultiplier <= 200 && money < 40){
                    choiseLabel.text = 'NOT ENOUGH SCRAPS!';        
                }
                if(scoreMultiplier >= 200 && money >= 40){
                   choiseLabel.text = 'MAX SCORE MULTIPLIER REACHED!';  
                }
                 if(scoreMultiplier >= 200 && money < 40){
                    choiseLabel.text = 'MAX SCORE MULTIPLIER REACHED!';   
                }
                if(money >= 40 && scoreMultiplier < 200){
                scoreMultiplier = scoreMultiplier + 10;
                money = money - 40;
                console.log(money);
                moneyText.text = 'Scraps: ' + money;
                multiplierText.text = 'Score-Multiplier: ' + scoreMultiplier + '/200';
                choiseLabel.text = 'You purchased Score X for: 40'; 
                }
    
                }
                
                //If player clicks the third item in the shop
                //Decrements money if possible
                //Prints out messages to inform player
                //Updates global variables
                if(choisemap[choise] == 'three'){
                console.log("3"); 
                if(speed <= 500 && money < 100){
                    choiseLabel.text = 'NOT ENOUGH SCRAPS!';        
                }
                if(speed >= 500 && money >= 100){
                   choiseLabel.text = 'MAX PLAYER SPEED REACHED';     
                }
                if(speed >= 500 && money <= 100){
                   choiseLabel.text = 'MAX PLAYER SPEED REACHED';  
                }
                if(money >= 100 && speed < 500){
                speed = speed + 25;
                money = money - 100;
                speedText.text = 'Player-Speed: ' + speed + '/500';
                moneyText.text = 'Scraps: ' + money;
                choiseLabel.text = 'Purchased Speed increase!'; 
                }
                 
                }
                
                //If player clicks the fourth item in the shop
                //Decrements money if possible
                //Prints out messages to inform player
                //Updates global variables
                if(choisemap[choise] == 'four'){
                console.log("4");
                if(xValue != 8 && money < 200){
                    choiseLabel.text = 'NOT ENOUGH SCRAPS!';        
                }
                if(xValue >= 8 && money >= 200){
                   choiseLabel.text = 'MAX MONEY MULTIPLIER REACHED!';  
                }
                 if(xValue >= 8 && money < 200){
                    choiseLabel.text = 'MAX MONEY MULTIPLIER REACHED!';   
                }
                
                if(money >= 200 && xValue <= 8){
                money = money - 200;
                moneyText.text = 'Scraps: ' + money;
                choiseLabel.text = 'Purchased Money Muliplier';
                     xValue = xValue + 2;
                  multiplierMoneyText.text = 'Money-Multiplier: ' + xValue + '/10';
                }
                
                
                }
                
                //If player clicks the five item in the shop
                //Decrements money if possible
                //Prints out messages to inform player
                //Updates global variables
                //Changes bullet sprite
                if(choisemap[choise] == 'five'){
                if(money < 300 && inf > 0){
                    choiseLabel.text = 'NOT ENOUGH SCRAPS!';        
                }
                inf = inf - 1;
                console.log("5");
                 if(money < 300){
                    choiseLabel.text = 'NOT ENOUGH SCRAPS!';        
                }
                if(money >= 300 && inf == 0 ){
                life = 11;
                money = money - 300;
                game.input.onDown.add(changeWeapon5, this); 
                moneyText.text = 'Scraps: ' + money;
                choiseLabel.text = 'You purchased INFINITY cube';
                 
                }   
                else{
                  choiseLabel.text = 'You own INFINITY cube';  
                }
                      
                }
              
                
                //If player clicks the sixth item in the shop
                //Decrements money if possible
                //Prints out messages to inform player
                //Updates global variables
                //plays nuke spritesheet
                //kills all enemies
                if(choisemap[choise] == 'six'){
                console.log("6");    
                if(money >= 400){
                flash = game.add.sprite(0, 0, 'Flash');
                flash.animations.add('flicker');
                flash.animations.play('flicker', 7);
                game.world.remove(balls);
                balls = game.add.group();
                money = money - 400;
                score = score + (scoreMultiplier*(waves));
                scoreText.text = 'Score: '+ score;
                moneyText.text = 'Scraps: ' + money;   
                choiseLabel.text = 'You purchased Nuke for: 400';
                }
                else{
                 console.log("false");
                 choiseLabel.text = 'NOT ENOUGH SCRAPS!';
                }
                }
                
                if(choise[choise] == '1'){
                 purchaseSound.play(2);  
                }
            }
            else{
                // Remove the menu, the label, the second menu and play sound
                menu.destroy();
                menu2.destroy();
                choiseLabel.destroy();
                purchaseSound.play();
                // Unpause the game
                game.paused = false;
            }
        }
    };


    //This is a weird function 
    //Basically you can change a sprite mid game using this function
    //It destroys the bullet group and remakes it with new sprite
    //This function is called in the above function 
    function changeWeapon5 () { 
        bullets.destroy();
        bullets = game.add.group();
        bullets.enableBody = true;
        bullets.physicsBodyType = Phaser.Physics.ARCADE;
        bullets.createMultiple(2, 'bullet5', 0, false);
        bullets.setAll('anchor.x', 0.09);
        bullets.setAll('anchor.y', 1.5);
        bullets.setAll('outOfBoundsKill', true);
        bullets.setAll('checkWorldBounds', true);
    }
