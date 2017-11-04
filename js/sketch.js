var texts, canvas, width, x, y;

function setup() {
  width = window.innerWidth;
  canvas = createCanvas(width-10, 300);
  canvas.parent('c_space');
  texts = document.getElementsByClassName("subpages");
  for(var i = 0; i < texts.length; i++) {
    var word = texts[i];
    x = random(width-20);
    y = random(100)+200;
    word.addEventListener("click", doSomething);
    word.style.left = x + "px";
    word.style.top = y + "px";
    drawRecursive(x, y-127, 160, 20);
  }
}

function doSomething() { }

function drawRecursive(x, y, size, level) {
  noStroke();
  fill(0,0,0,level*1.8);
  ellipse(x, y, size, size);
  if(level > 6) {
    level--;
    drawRecursive(x, y, size/1.2, level);
  }
}

function draw() {
  //clear();
  fill(300);
}
