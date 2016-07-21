var x, y;

function setup() {
  var myCanvas = createCanvas(200, 200);
  myCanvas.parent('cont4');
  x = 0;
  y = height/2;

}

var control = 0;
var direction = true;

function draw() {

  clear();
  fill(300);
  rect(x, y, 63, 63);

  if(direction==true) {
    x += 1;
    control += 1;
  }
  if(control==100) {
    direction=false;
  }

  if(direction==false) {
    x -= 1;
    control -= 1;
  }
  if(control==0) {
    direction=true;
  }

}
