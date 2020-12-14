var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage, invisibleBackground;

var cloud, cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var jump, checkpoint, die;
var score;
var hg;

var restart, gameover;
var r, g;

var bird1, bird2;

function preload() {
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trex_collided = loadAnimation("trex_collided.png");

  groundImage = loadImage("ground2.png");

  cloudImage = loadImage("cloud.png");

  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  restart = loadImage("restart.png");
  gameover = loadImage("gameOver-1.png");
  bird1 = loadAnimation("Aviraptor_1.png", "Aviraptor_2.png");
  bird2 = loadAnimation("Aviraptor_2.png");


  jump = loadSound("jump.mp3");
  checkpoint = loadSound("checkPoint.mp3");
  die = loadSound("die.mp3");

}

function setup() {
  createCanvas(600, 200);

  trex = createSprite(50, 180, 20, 50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided)
  trex.scale = 0.5;
  // trex.setCollider("rectangle",0,0,100,100);
  trex.setCollider("circle", 0, 0, 50)
  //trex.debug=true;

  ground = createSprite(200, 180, 400, 20);
  ground.addImage("ground", groundImage);
  ground.x = ground.width / 2;
  ground.velocityX = -4;

  invisibleGround = createSprite(200, 190, 400, 10);
  invisibleGround.visible = false;

  invisibleBackground= createSprite(300,100,600,200);
  invisibleBackground.visible = false;
  
  r = createSprite(300, 80, 10, 10);
  r.addImage(restart);
  r.scale = 0.5;
  r.visible = false;

  g = createSprite(300, 130, 10, 10);
  g.addImage(gameover);
  g.scale = 1;
  g.visible = false;

  // create Obstacles and Cloud groups
  obstaclesGroup = new Group();
  cloudsGroup = new Group();
  birdGroup = new Group();

  hg = 0;
  score = 0;
}

function draw() {
  background(180);
  text("High Score:\t" + hg + "\tScore:\t" + score, 440, 50);



  if (gameState === PLAY) {
    //move the ground
    ground.velocityX = -4;
    score = score + Math.round(frameCount / 60);

    if (keyWentDown("space") && trex.y >= 100) {
      trex.velocityY = -13;
      jump.play();

    }

    trex.velocityY = trex.velocityY + 0.8 
    spawnClouds();
    spawnObstacles();
    spawnBirds();
    if (obstaclesGroup.isTouching(trex)||birdGroup.overlap(trex,callBirds)) {
      die.play();
      gameState = END;
    }
  } else if (gameState === END) {
    //stop the ground
    ground.velocityX = 0;
    trex.velocityY=0;   
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    birdGroup.setVelocityXEach(0);
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    birdGroup.setLifetimeEach(-1);
    trex.changeAnimation("collided");
    birdGroup.overlap(invisibleBackground,callBirds);
    r.visible = true;
    g.visible = true;

    if (mousePressedOver(r)) {
      r.visible = false;
      g.visible = false;
      obstaclesGroup.destroyEach();
      cloudsGroup.destroyEach();
      birdGroup.destroyEach();   
      if (score > hg) {
        hg = score;
      }
      score = 0;
      trex.changeAnimation("running");
      gameState = PLAY;
    }
  }

  if (score % 500 === 0 && score > 0) {
    checkpoint.play();
  }


  if (ground.x < 0) {
    ground.x = ground.width / 2;
  }

  trex.collide(invisibleGround);

  //spawn the clouds


  //spawn obstacles on the ground


  drawSprites();
}

function spawnObstacles() {
  if (frameCount % 60 === 0) {
    var obstacle = createSprite(400, 165, 10, 40);
    obstacle.velocityX = -6;


    // //generate random obstacles
    var rand = Math.round(random(1, 6));
    switch (rand) {
      case 1:
        obstacle.addImage(obstacle1);
        break;
      case 2:
        obstacle.addImage(obstacle2);
        break;
      case 3:
        obstacle.addImage(obstacle3);
        break;
      case 4:
        obstacle.addImage(obstacle4);
        break;
      case 5:
        obstacle.addImage(obstacle5);
        break;
      case 6:
        obstacle.addImage(obstacle6);
        break;
      default:
        break;
    }

    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;

    //adding obstacles to the group
    obstaclesGroup.add(obstacle);
  }
}




function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    cloud = createSprite(600, 100, 40, 10);
    cloud.y = Math.round(random(10, 60));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;

    //assign lifetime to the variable
    cloud.lifetime = 600/3;

    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;

    //adding cloud to the group
    cloudsGroup.add(cloud);
  }

}

function spawnBirds() {
  //write code here to spawn the clouds
  if (score % 500 === 0&&score>0 ) {
    bird = createSprite(600, 100, 40, 10);
    bird.y = Math.round(random(10, 100));
    bird.addAnimation("flying", bird1);
    bird.addAnimation("stop", bird2);
    bird.scale = 0.5;
    bird.velocityX = -3;

    //assign lifetime to the variable
    bird.lifetime = 600/3;

    //adjust the depth
    bird.depth = trex.depth;
    bird.depth = trex.depth + 1;

    //adding cloud to the group
    birdGroup.add(bird);
  }

}

 function callBirds(a,b)
{
  a.changeAnimation("stop");
}