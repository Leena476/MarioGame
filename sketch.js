//define global variables

//define game states and their values
var PLAY = 1;
var END = 0;

//define initial game state
var gameState = PLAY;

//define mario sprite
var mario, marioImage;

//define ground and invisible ground
var ground, invisibleGround, groundImage;

//define obstacle sprite and group
var obstacle, obstacleImage, obstacleGroup;

//define brick sprite
var brick, brickImage;

//define game over sprite
var gameOver, gameOverImage;

//define restart sprite
var restart, restartImage;

//define initial score
var score = 0;

function preload(){
  
  //load images here
  marioImage = loadAnimation("mario00.png","mario01.png","mario02.png","mario03.png");
  marioCollided = loadImage("collided.png");
  groundImage = loadImage("ground2.png");
  bgImage = loadImage("bg.png");
  brickImage = loadImage("brick.png");
  obstacleImage = loadAnimation("obstacle1.png","obstacle2.png","obstacle3.png","obstacle4.png");
  gameOverImage = loadImage("gameOver.png");
  restartImage = loadImage("restart.png");
  
}

function setup(){
  
  //create canvas dimensions - 600 and 300
  createCanvas(600,300);
  
  //create ground sprite - create sprite and add image
  ground = createSprite(300,260,600,10);
  ground.addImage("ground2",groundImage);
  
  //create invisible ground sprite - create sprite and make invisible
  invisibleGround = createSprite(300,230,600,20);
  invisibleGround.visible = false;
  
  //create mario sprite - create sprite, add animation, and scale
  mario = createSprite(40,185,20,20);
  mario.addAnimation("marioImage", marioImage);
  mario.addImage("marioCollided",marioCollided);
  mario.scale = 2;
  
  //set collider of mario sprite
  mario.debug = false;
  mario.setCollider("rectangle",0,0,30,30);
  
  //create obstacle and brick groups
  obstaclesGroup = createGroup();
  bricksGroup = createGroup();
  
  //create game over sprite - create sprite, add image, and scale
  gameOver = createSprite(300,75,10,10);
  gameOver.addImage("gameOverImage",gameOverImage);
  gameOver.scale = 1.3;
  
  //create restart sprite - create sprite, add image, and scale
  restart = createSprite(300,150,10,10);
  restart.addImage("restartImage",restartImage);
  restart.scale = 1.3;
  
}

function draw(){
  
  //set background image
  background(bgImage);
  
  //if the game state is PLAY...
  if(gameState === PLAY){
    
    //make game over and restart sprites invisible
    gameOver.visible = false;
    restart.visible = false;
    
    //mario appears running
    mario.addImage("marioCollided",marioCollided);
    
    //if space is pressed, the mario jumps with velocityY of -15
    if(keyDown("space") && mario.y >= 185){
      mario.velocityY = -15; 
    }
  
    //add gravity to mario sprite
    mario.velocityY = mario.velocityY + 0.8;
  
    //set velocityX of ground with game adaptivity
    ground.velocityX = -(5 + score/10);
  
    //if the ground crosses left side of the screen, the ground loops
    if(ground.x<0){
      ground.x = ground.width/2;
    }
    
    //if the mario hits any obstacle, the game state changes to END
    if(obstaclesGroup.isTouching(mario)){
      gameState = END;
    }
    
    //for loop to make only the brick that was hit my the mario disappear
    for (var i=0; i<bricksGroup.length; i++){
      
      if(bricksGroup.get(i).isTouching(mario)){
        
        //remove only THAT brick
        bricksGroup.get(i).remove();
        
        //increase score by one
        score++;
        
      }
      
    }
    
    //call functions - spawnObstacles and spawnBricks
    spawnObstacles();
    spawnBricks();
    
    //write instructions - text size, font, color, and stroke
    textSize(15);
    textFont("Georgia");
    fill("black");
    stroke(1);
    text("Press the space bar to jump.",10,20);
    text("Mario will increase in speed every +10 of your score!",10,35);
    text("Each brick you collect will increase your score by 1.",10,50);
    
  }
    
  //if the game state is END...
  else if (gameState === END){
    
     //game over and restart sprites become visible
     gameOver.visible = true;
     restart.visible = true;
    
     //mario appears still/standing
     mario.addAnimation("marioImage", marioImage);
     
     //set velocity of everything to zero
     ground.velocityX = 0;
     bricksGroup.setVelocityXEach(0);
     obstaclesGroup.setVelocityXEach(0);
     mario.velocityY = 0;
     
     //set lifetime of both groups to -1
     bricksGroup.setLifetimeEach(-1);
     obstaclesGroup.setLifetimeEach(-1);
     
     //if the restart sprite is clicked on, the game will reset
     if(mousePressedOver(restart)){
       reset();
     }
    
  }
  
  //mario will ALWAYS collide with the invisible ground
  mario.collide(invisibleGround);
  
  //display score as text - text size, font, color, and stroke
  textSize(20);
  textFont("Georgia");
  fill("black");
  stroke(1);
  text("Score: " + score, 520,20);
  
  //draw sprites function
  drawSprites();
  
}

//function to spawn obstacles
function spawnObstacles(){
  
  //only if the frame count is a multiple of 50...
  if(frameCount % 50 === 0){
    
    //define obstacle sprite - create sprite, add animation, and scale
    obstacle = createSprite(600,200,20,20);
    obstacle.addAnimation("obstacleImage",obstacleImage);
    obstacle.scale = 0.8;
    
    //set velocityX (with game adaptivity) and lifetime of obstacle sprite
    obstacle.velocityX = -(10 + score/10);
    obstaclesGroup.setLifetimeEach(100);
    
    //add obstacle sprite to the obstacles group
    obstaclesGroup.add(obstacle);
    
  }
  
}

//function to spawn bricks
function spawnBricks(){
  
  //only if the frame count is a multiple of 50...
  if(frameCount % 50 === 0){
    
    //define brick sprite - create sprite, add animation, and scale
    brick = createSprite(600,random(70,200),10,10);
    brick.addImage("brickImage",brickImage);
    
    //set velocityX (with game adaptivity) and lifetime of brick sprite
    brick.velocityX = -(7 + score/10);
    brick.lifetime = 100;
    
    //add brick sprite to the brick group
    bricksGroup.add(brick);
    
  }
  
}

//function to reset game after user clicks on restart sprite in END game state
function reset(){
  
  //reset score to zero
  score = 0;
  
  //change game state to play
  gameState = PLAY;
  
  //destroy all the obstacles and bricks
  obstaclesGroup.destroyEach();
  bricksGroup.destroyEach();
  
  //reset the mario sprite's position
  mario.x = 40;
  mario.y = 185;
  
}