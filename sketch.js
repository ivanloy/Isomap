//Macros

const BLOCK_SIZE_X = 64;
const BLOCK_SIZE_Y = 32;
const BLOCK_HEIGHT = 38;

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

function setup() {

  pixelDensity(1);

  createCanvas(1000,600);

  //Grid stuff
  colorMode(HSB);
  for(i = 0; i < 15; i++){

    blockGrid[i] = [];

    for(j = 0; j < 15; j++){

      blockGrid[i][j] = [];

      for(k = 1; k < 4; k++){

        blockGrid[i][j][k] = 1;

      }
    }
  }

  for(i = 0; i < 15; i++){

    blockColorGrid[i] = [];

    for(j = 0; j < 15; j++){

      blockColorGrid[i][j] = [];

      for(k = 0; k < 4; k++){

        blockColorGrid[i][j][k] = random(38,41);

      }
    }
  }

  //----------

  for(i = 4; i < 7; i++){
    for(j = 5; j < 10; j++){
      for(k = 1; k < 3; k++){

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

  for(i = 0; i < 15; i++){
    for(j = 0; j < 15; j++){
      for(k = 3; k >= 0; k--){

        if(blockGrid[i][j][k] == 1){

          colorMode(RGB);
          zColor = color(i*3, j*3, k*3, 255);
          xColor = color(i*3 + 1, j*3 + 1, k*3 + 1, 255);
          yColor = color(i*3 + 2, j*3 + 2, k*3 + 2, 255);

          drawSideZ(i, j, k, zColor);
          drawSideY(i, j, k, yColor);
          drawSideX(i, j, k, xColor);

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

  for(i = 0; i < 15; i++){
    for(j = 0; j < 15; j++){
      for(k = 3; k >= 0; k--){

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

  colorMode(RGB);
  yellow = color(255, 255, 0, 100);

  if(mouseMappedSide == 0) drawSideZ(mouseMappedX, mouseMappedY, mouseMappedZ, yellow);
  else if(mouseMappedSide == 1) drawSideX(mouseMappedX, mouseMappedY, mouseMappedZ, yellow);
  else if(mouseMappedSide == 2) drawSideY(mouseMappedX, mouseMappedY, mouseMappedZ, yellow);

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

      vertex(BLOCK_SIZE_X * (x/2 - y/2) + width/2, z * BLOCK_HEIGHT - z + 10 + BLOCK_SIZE_Y * (x/2 + y/2));
      vertex(BLOCK_SIZE_X * ((x+1)/2 - y/2) + width/2, z * BLOCK_HEIGHT - z + 10 + BLOCK_SIZE_Y * ((x+1)/2 + y/2));
      vertex(BLOCK_SIZE_X * ((x+1)/2 - (y+1)/2) + width/2, z * BLOCK_HEIGHT - z + 10 + BLOCK_SIZE_Y * ((x+1)/2 + (y+1)/2));
      vertex(BLOCK_SIZE_X * (x/2 - (y+1)/2) + width/2, z * BLOCK_HEIGHT - z + 10 + BLOCK_SIZE_Y * (x/2 + (y+1)/2));

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

     vertex(BLOCK_SIZE_X * ((x+1)/2 - y/2) + width/2, z * BLOCK_HEIGHT - z + 10 + BLOCK_SIZE_Y * ((x+1)/2 + y/2));
     vertex(BLOCK_SIZE_X * ((x+1)/2 - (y+1)/2) + width/2, z * BLOCK_HEIGHT - z + 10 + BLOCK_SIZE_Y * ((x+1)/2 + (y+1)/2));
     vertex(BLOCK_SIZE_X * ((x+1)/2 - (y+1)/2) + width/2, (z + 1) * BLOCK_HEIGHT  + 10 + BLOCK_SIZE_Y * ((x+1)/2 + (y+1)/2));
     vertex(BLOCK_SIZE_X * ((x+1)/2 - y/2) + width/2, (z + 1) * BLOCK_HEIGHT  + 10 + BLOCK_SIZE_Y * ((x+1)/2 + y/2));

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

      vertex(BLOCK_SIZE_X * ((x+1)/2 - (y+1)/2) + width/2, z * BLOCK_HEIGHT - z + 10 + BLOCK_SIZE_Y * ((x+1)/2 + (y+1)/2));
      vertex(BLOCK_SIZE_X * (x/2 - (y+1)/2) + width/2, z * BLOCK_HEIGHT - z + 10 + BLOCK_SIZE_Y * (x/2 + (y+1)/2));
      vertex(BLOCK_SIZE_X * (x/2 - (y+1)/2) + width/2, (z + 1) * BLOCK_HEIGHT  + 10 + BLOCK_SIZE_Y * (x/2 + (y+1)/2));
      vertex(BLOCK_SIZE_X * ((x+1)/2 - (y+1)/2) + width/2, (z + 1) * BLOCK_HEIGHT  + 10 + BLOCK_SIZE_Y * ((x+1)/2 + (y+1)/2));


    endShape();

}

function mousePressed(){

  blockGrid[mouseMappedX][mouseMappedY][mouseMappedZ] = 0;

}

function keyPressed(){

  if(mouseMappedSide == 0 && mouseMappedZ > 0) blockGrid[mouseMappedX][mouseMappedY][mouseMappedZ - 1] = 1;
  else if(mouseMappedSide == 1) blockGrid[mouseMappedX + 1][mouseMappedY][mouseMappedZ] = 1;
  else if(mouseMappedSide == 2) blockGrid[mouseMappedX][mouseMappedY + 1][mouseMappedZ] = 1;

}
