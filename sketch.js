//Macros

const BLOCK_SIZE_X = 64;
const BLOCK_SIZE_Y = 32;
const BLOCK_HEIGHT = 38;
const MAP_WIDTH_X = 10;
const MAP_WIDTH_Y = 10;
const MAP_HEIGHT = 15;
const Y_OFF = 150

//-------

//Global vars

var blockGrid = [];
var blockColorGrid = [];

//------------

//Mouse mapped positions

var mouseMappedX = 0;
var mouseMappedY = 0;
var mouseMappedZ = 0;
var mouseMappedSide = 0; //0: Z, 1: X, 2: Y

//-----------------------

//Control stuff

var frameCount = 0;
var frameAcc = 0;

//-------------

//Player stuff

var playerX = 0;
var playerY = 0;
var playerZ = 0;

//------------

function preload(){

  //img = loadImage("tileFea.png");

}

function setup() {

  pixelDensity(1);
  frameRate(30);

  createCanvas(1000,600);
  fill(255);
  //Grid stuff
  colorMode(HSB);

  for(i = 0; i < MAP_WIDTH_X; i++){

    blockGrid[i] = [];

    for(j = 0; j < MAP_WIDTH_Y; j++){

      blockGrid[i][j] = [];

      for(k = 0; k < MAP_HEIGHT; k++){

      blockGrid[i][j][k] = 0;

      }
    }
  }

  for(i = 0; i < MAP_WIDTH_X; i++){
    for(j = 0; j < MAP_WIDTH_Y; j++){
      for(k = 4; k < MAP_HEIGHT; k++){

        blockGrid[i][j][k] = 1;

      }
    }
  }


  var xOffPerlin = 0;
  var colorChange = 8;

  for(i = 0; i < MAP_WIDTH_X; i++){

    blockColorGrid[i] = [];

    for(j = 0; j < MAP_WIDTH_Y; j++){

      blockColorGrid[i][j] = [];

      for(k = 0; k < MAP_HEIGHT; k++){

        blockColorGrid[i][j][k] = noise(i/colorChange, j/colorChange, k/colorChange)*25 + map((i+j), 0, 15+15+5*2, 0, 1)*80 + (MAP_HEIGHT-k) + 10;

      }
    }
  }

  //----------

  for(i = 4; i < 7; i++){
    for(j = 5; j < 10; j++){
      for(k = 4; k < MAP_HEIGHT-1; k++){

        blockGrid[i][j][k] = 0;

      }
    }
  }

}

function draw() {



  colorMode(RGB);
  background(31);

  colorMode(HSB);



  //Map mouse position with color key map

  for(i = 0; i < MAP_WIDTH_X; i++){
    for(j = 0; j < MAP_WIDTH_Y; j++){
      for(k = MAP_HEIGHT - 1; k >= 0; k--){

        if(blockGrid[i][j][k] == 1){

          colorMode(RGB);
          zColor = color(i*3, j*3, k*3, 255);
          xColor = color(i*3 + 1, j*3 + 1, k*3 + 1, 255);
          yColor = color(i*3 + 2, j*3 + 2, k*3 + 2, 255);

          if(i == MAP_WIDTH_X-1 || (blockGrid[i+1][j][k] == 0)) drawSideX(i, j, k, xColor);
          if(j == MAP_WIDTH_Y-1 || (blockGrid[i][j+1][k] == 0)) drawSideY(i, j, k, yColor);
          if(k == 0 || (k > 0 && blockGrid[i][j][k-1] == 0)) drawSideZ(i, j, k, zColor);

        }
      }

    }
  }

  var index = (mouseX+10 + mouseY * width) * 4;

  loadPixels();

    mouseMappedX = floor(pixels[index] / 3);
    mouseMappedY = floor(pixels[index+1] / 3);
    mouseMappedZ = floor(pixels[index+2] / 3);
    mouseMappedSide = pixels[index] % 3;

  updatePixels();

  //--------------------------------------

  for(i = 0; i < MAP_WIDTH_X; i++){
    for(j = 0; j < MAP_WIDTH_Y; j++){
      for(k = MAP_HEIGHT - 1; k >= 0; k--){

        if(blockGrid[i][j][k] == 1){

          colorMode(HSB);
          zColor = color(136, 73, blockColorGrid[i][j][k]);
          yColor = color(86, 20, blockColorGrid[i][j][k] * 0.7);
          xColor = color(86, 20, blockColorGrid[i][j][k] * 1.25);

          drawSideX(i, j, k, xColor);
          drawSideY(i, j, k, yColor);
          drawSideZ(i, j, k, zColor);

        }
      }

    }
  }

  while(playerZ < 3 && blockGrid[playerX][playerY][playerZ+1] == 0) playerZ++;

  colorMode(RGB);
  //text(playerZ, 100, 50);
  //drawSideX(playerX, playerY, playerZ, color(255, 0, 0));
  //drawSideY(playerX, playerY, playerZ, color(155, 0, 0));
  //drawSideZ(playerX, playerY, playerZ, color(205, 0, 0));

  yellow = color(255, 255, 0, 100);

  if(mouseMappedSide == 0) drawSideZ(mouseMappedX, mouseMappedY, mouseMappedZ, yellow);
  else if(mouseMappedSide == 1) drawSideX(mouseMappedX, mouseMappedY, mouseMappedZ, yellow);
  else if(mouseMappedSide == 2) drawSideY(mouseMappedX, mouseMappedY, mouseMappedZ, yellow);

  fill(255);
  text(int(frameRate()), 10, 10);
  frameAcc += frameRate();
  frameCount ++;
  text("avg: " + int(frameAcc / frameCount), 30, 10);
  text("x: " + mouseMappedX + "  y: " + mouseMappedY + "  z: " + mouseMappedZ, 10, 30);

}

//Draws block side in Z axis

/* parameters
****************

  x: x index of the block.
  y: y index of the block.
  z: z index of the block.
  col: color of the Z side of the block.

*/

function drawSideZ(x, y, z, col){

    noStroke();
    fill(col);

    beginShape();

      vertex(BLOCK_SIZE_X * (x/2 - y/2) + width/2, z * BLOCK_HEIGHT - z + 10 + BLOCK_SIZE_Y * (x/2 + y/2) - Y_OFF);
      vertex(BLOCK_SIZE_X * ((x+1)/2 - y/2) + width/2, z * BLOCK_HEIGHT - z + 10 + BLOCK_SIZE_Y * ((x+1)/2 + y/2) - Y_OFF);
      vertex(BLOCK_SIZE_X * ((x+1)/2 - (y+1)/2) + width/2, z * BLOCK_HEIGHT - z + 10 + BLOCK_SIZE_Y * ((x+1)/2 + (y+1)/2) - Y_OFF);
      vertex(BLOCK_SIZE_X * (x/2 - (y+1)/2) + width/2, z * BLOCK_HEIGHT - z + 10 + BLOCK_SIZE_Y * (x/2 + (y+1)/2) - Y_OFF);

    endShape();

}

//Draws block side in X axis

/* parameters
****************

  x: x index of the block.
  y: y index of the block.
  z: z index of the block.
  col: color of the X side of the block.

*/

function drawSideX(x, y, z, col){

    noStroke();
    fill(col);

    beginShape();

     vertex(BLOCK_SIZE_X * ((x+1)/2 - y/2) + width/2, z * BLOCK_HEIGHT - z + 10 + BLOCK_SIZE_Y * ((x+1)/2 + y/2) - Y_OFF);
     vertex(BLOCK_SIZE_X * ((x+1)/2 - (y+1)/2) + width/2, z * BLOCK_HEIGHT - z + 10 + BLOCK_SIZE_Y * ((x+1)/2 + (y+1)/2) - Y_OFF);
     vertex(BLOCK_SIZE_X * ((x+1)/2 - (y+1)/2) + width/2, (z + 1) * BLOCK_HEIGHT  + 10 + BLOCK_SIZE_Y * ((x+1)/2 + (y+1)/2) - Y_OFF);
     vertex(BLOCK_SIZE_X * ((x+1)/2 - y/2) + width/2, (z + 1) * BLOCK_HEIGHT  + 10 + BLOCK_SIZE_Y * ((x+1)/2 + y/2) - Y_OFF);

   endShape();

}

//Draws block side in Y axis

/* parameters
****************

  x: x index of the block.
  y: y index of the block.
  z: z index of the block.
  col: color of the Y side of the block.

*/

function drawSideY(x, y, z, col){

    noStroke();
    fill(col);

    beginShape();

      vertex(BLOCK_SIZE_X * ((x+1)/2 - (y+1)/2) + width/2, z * BLOCK_HEIGHT - z + 10 + BLOCK_SIZE_Y * ((x+1)/2 + (y+1)/2) - Y_OFF);
      vertex(BLOCK_SIZE_X * (x/2 - (y+1)/2) + width/2, z * BLOCK_HEIGHT - z + 10 + BLOCK_SIZE_Y * (x/2 + (y+1)/2) - Y_OFF);
      vertex(BLOCK_SIZE_X * (x/2 - (y+1)/2) + width/2, (z + 1) * BLOCK_HEIGHT  + 10 + BLOCK_SIZE_Y * (x/2 + (y+1)/2) - Y_OFF);
      vertex(BLOCK_SIZE_X * ((x+1)/2 - (y+1)/2) + width/2, (z + 1) * BLOCK_HEIGHT  + 10 + BLOCK_SIZE_Y * ((x+1)/2 + (y+1)/2) - Y_OFF);


    endShape();

}

function mousePressed(){

  blockGrid[mouseMappedX][mouseMappedY][mouseMappedZ] = 0;

}

function keyPressed(){

  if(key == "X"){

    if(mouseMappedSide == 0 && mouseMappedZ > 0) blockGrid[mouseMappedX][mouseMappedY][mouseMappedZ - 1] = 1;
    else if(mouseMappedSide == 1) blockGrid[mouseMappedX + 1][mouseMappedY][mouseMappedZ] = 1;
    else if(mouseMappedSide == 2) blockGrid[mouseMappedX][mouseMappedY + 1][mouseMappedZ] = 1;

  }

  if(key == "D"){

    if(playerX < 14) playerX++;
    while(playerZ > 0 && blockGrid[playerX][playerY][playerZ] == 1) playerZ--;

  }

  if(key == "A"){

    if(playerX > 0) playerX--;
    while(playerZ > 0 && blockGrid[playerX][playerY][playerZ] == 1) playerZ--;

  }

  if(key == "W"){

    if(playerY >0) playerY--;
    while(playerZ > 0 && blockGrid[playerX][playerY][playerZ] == 1) playerZ--;

  }

  if(key == "S"){

    if(playerY < 14) playerY++;
    while(playerZ > 0 && blockGrid[playerX][playerY][playerZ] == 1) playerZ--;

  }


}
