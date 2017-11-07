var canvas, q, coord, w_size, shape_array, curr_coords;

function setup () {
  curr_coords = [0, 0];
  w_size = document.getElementById('t_space').offsetWidth;
  canvas = createCanvas(w_size, w_size);
  canvas.parent('t_space');
  q = new Queue;
  shape_array = [];
}

function newShape(type) {
  var s = new Shape;
  var x1, y1, length, sides, tx, ty, angle, rx, ry, sx, sy;
  x1 = curr_coords[0];
  y1 = curr_coords[1];
  sides = parseInt(document.getElementById('side_num').value);
  length = parseInt(document.getElementById('side_length').value);
  tx = parseInt(document.getElementById('translate_val_x').value);
  ty = parseInt(document.getElementById('translate_val_y').value);
  angle = parseInt(document.getElementById('rotate_val_theta').value);
  rx = parseInt(document.getElementById('rotate_val_x').value);
  ry = parseInt(document.getElementById('rotate_val_y').value);
  sx = parseFloat(document.getElementById('scale_val_x').value);
  sy = parseFloat(document.getElementById('scale_val_y').value);

  switch (type) {
    case 0:
      s.polygon(sides, length, x1, y1);
      s.translate(tx, ty);
      s.rotate(angle, rx, ry);
      s.scale(sx, sy);
      s.print();
      shape_array.push(s);
      break;
    default:
      break;
  }
}

function draw () {
  drawAxis();
  if(!q.isEmpty()) {
    coord = q.peek();
    point(coord[0], coord[1]);
    q.pop();
  }
}

class Queue {
  constructor() {
    this.data = [];
    this.first = 0;
    this.last = 0;
  }
  push(val) {
    this.data[this.last] = val;
    this.last++;
  }
  pop() {
    this.first++;
  }
  peek() {
    return this.data[this.first];
  }
  isEmpty() {
    if(this.first == this.last) return true;
    return false;
  }
}

class Shape {
  constructor() {
    this.coords = [];
  }
  addCoord(x, y) {
    this.coords.push([x+(w_size/2), y+(w_size/2)]);
  }
  print() {
    for(var i = 0; i < this.coords.length; i++) {
      q.push([this.coords[i][0], this.coords[i][1]]);
    }
  }
  translate(tx, ty) {
    for(var i = 0; i < this.coords.length; i++) {
      this.coords[i][0] += tx;
      this.coords[i][1] += ty;
    }
  }

  rotate(angle, xr, yr) {
    var x_prev, y_prev;
    // Rotate relative to origin
    var origin_x = this.coords[0][0];
    var origin_y = this.coords[0][1];
    xr += origin_x;
    yr += origin_y;
    for(var i = 0; i < this.coords.length; i++) {
      x_prev = this.coords[i][0];
      y_prev = this.coords[i][1];
      this.coords[i][0] = xr + ((x_prev-xr)*Math.cos(angle))-((y_prev-yr)*Math.sin(angle));
      this.coords[i][1] = xr + ((x_prev-xr)*Math.sin(angle))+((y_prev-yr)*Math.cos(angle));
    }
  }

  scale(sx, sy) {
    for(var i = 0; i < this.coords.length; i++) {
      this.coords[i][0] *= sx;
      this.coords[i][1] *= sy;
    }
  }

  reflect(direction) {
    // 0 -> reflect on x
    // 1 -> reflect on y
    // 2 -> reflect on xy
    for(var i = 0; i < this.coords.length; i++) {
      if(direction == 0) {
        this.coords[i][1] -= (w_size/2);
        this.coords[i][1] *= -1;
        this.coords[i][1] += (w_size/2);
      } else if (direction == 1) {
        this.coords[i][0] -= (w_size/2);
        this.coords[i][0] *= -1;
        this.coords[i][0] += (w_size/2);
      } else if (direction == 2) {
        return;
      }
    }
  }

  line(x1, y1, x2, y2) {
    var dx = (x2 - x1);
    var dy = (y2 - y1);
    var steps;
    var xInc,yInc,x=x1,y=y1;
    steps=(abs(dx)>abs(dy))?(abs(dx)):(abs(dy));
    xInc=dx/steps;
    yInc=dy/steps;
    for (var k = 0; k < steps; k++) {
      this.addCoord(Math.round(x), Math.round(y));
      x+=xInc;
      y+=yInc;
    }
  }

  polygon(sides, length, x1, y1) {
    var angle = ((sides-2)*180) / sides;
    var x2 = x1;
    var y2 = y1;
    var curr_angle = 0;
    var inverted = 1;

    for(var i = 0; i < sides; i++) {
      curr_angle += angle;
      x2 += cos(curr_angle*Math.PI/180) * length * inverted;
      y2 += sin(curr_angle*Math.PI/180) * length * inverted;
      this.line(x1,y1,x2,y2);
      x1 = x2;
      y1 = y2;
      inverted *= -1;
    }
  }
}

function drawAxis() {
  stroke(0, 153, 255);
  line(0, w_size*0.5, w_size, w_size*0.5);
  line(w_size*0.5, 0, w_size*0.5, w_size);
  stroke(0,0,0);
}

function setListener() {
  document.getElementById("t_space").addEventListener("click", getCoords);
  document.getElementById("t_space").addEventListener("mousemove", printCoords);
  document.getElementById("t_space").style.cursor = "crosshair";
}

function getCoords() {
  var x = event.clientX;     // Get the horizontal coordinate
  var y = event.clientY;     // Get the vertical coordinate
  if(x < w_size && y < w_size) {
    var t_space = document.getElementById("t_space");
    var tooltipSpan = document.getElementById('tooltip-span');
    t_space.removeEventListener("click", getCoords);
    t_space.removeEventListener("mousemove", printCoords);
    t_space.style.cursor = "default";
    tooltipSpan.innerHTML = "";
    curr_coords[0] = x - 16 - w_size/2;
    curr_coords[1] = y - w_size/2;
  }
}

function printCoords() {
  var tooltipSpan = document.getElementById('tooltip-span');
  var coords_text = document.getElementById('coords_text');
  var x = event.clientX;
  var y = event.clientY;
  tooltipSpan.style.top = (y + 20) + 'px';
  tooltipSpan.style.left = (x + 20) + 'px';
  tooltipSpan.innerHTML = Math.round(x - 16 - w_size/2) + ', ' + Math.round(y - w_size/2);
  coords_text.innerHTML = Math.round(x - 16 - w_size/2) + ', ' + Math.round(y - w_size/2);
}
