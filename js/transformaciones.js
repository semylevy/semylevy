var canvas, type, q, coord, shape_array, curr_coords, w_height, w_width;

function setup () {
  curr_coords = [0, 0];
  w_height = document.documentElement.clientHeight-10;
  w_width = document.getElementById('t_space').offsetWidth;
  canvas = createCanvas(w_width, w_height);
  canvas.parent('t_space');
  q = new Queue;
  shape_array = [];
  type = 0;
}

function draw () {
  drawAxis();
  if(!q.isEmpty()) {
    coord = q.peek();
    point(coord[0], coord[1]);
    q.pop();
  }
}

$(document).ready(function(){
  $('.nav-tabs a[href="#polygon"]').on('shown.bs.tab', function(){
    type = 0;
  });
  $('.nav-tabs a[href="#arc_shapes"]').on('shown.bs.tab', function(){
    type = 1;
  });
  $('.nav-tabs a[href="#3d-cube"]').on('shown.bs.tab', function(){
    type = 2;
  });
  $('.nav-tabs a[href="#3d-prism-rectangular"]').on('shown.bs.tab', function(){
    type = 3;
  });
  $('.nav-tabs a[href="#3d-prism-triangular"]').on('shown.bs.tab', function(){
    type = 4;
  });
  $('.nav-tabs a[href="#3d-cone"]').on('shown.bs.tab', function(){
    type = 5;
  });
});

function newShape() {
  var s = new Shape;
  var x1, y1, length, sides, tx, ty, angle, rx, ry, sx, sy, rf_x, rf_y, rf_p;
  x1 = curr_coords[0];
  y1 = curr_coords[1];
  tx = parseInt(document.getElementById('translate_val_x').value);
  ty = parseInt(document.getElementById('translate_val_y').value);
  angle = parseInt(document.getElementById('rotate_val_theta').value);
  rx = parseInt(document.getElementById('rotate_val_x').value);
  ry = parseInt(document.getElementById('rotate_val_y').value);
  sx = parseFloat(document.getElementById('scale_val_x').value);
  sy = parseFloat(document.getElementById('scale_val_y').value);
  rf_x = document.getElementById('reflect_x').checked;
  rf_y = document.getElementById('reflect_y').checked;
  rf_p = document.getElementById('reflect_parallel').checked;

  switch (type) {
    case 0:
      length = parseInt(document.getElementById('polygon_side_length').value);
      sides = parseInt(document.getElementById('side_num').value);
      s.polygon(sides, length, x1, y1);
      break;
    case 1:
      var arc_radius = parseInt(document.getElementById('arc_radius').value);
      var arc_angle = parseInt(document.getElementById('arc_angle').value);
      s.circle(x1, y1, arc_radius, arc_angle);
      break;
    case 2:
      length = parseInt(document.getElementById('cube_side_length').value);
      s.cube(length, x1, y1);
      break;
    case 3:
      var prism_width = parseInt(document.getElementById('prism_rct_width').value);
      var prism_height = parseInt(document.getElementById('prism_rct_height').value);
      var prism_depth = parseInt(document.getElementById('prism_rct_depth').value);
      s.prismRect(x1, y1, prism_width, prism_height, prism_depth);
      break;
    case 4:
      var prism_side = parseInt(document.getElementById('prism_tr_side').value);
      var prism_depth = parseInt(document.getElementById('prism_tr_depth').value);
      s.prismTriang(x1, y1, prism_side, prism_depth);
      break;
    case 5:
      var cone_radius = parseInt(document.getElementById('cone_radius').value);
      var cone_height = parseInt(document.getElementById('cone_height').value);
      s.cone(x1, y1, cone_radius, cone_height);
      break;
    default:
      break;
  }
  s.translate(tx, ty);
  s.rotate(angle, rx, ry);
  s.scale(sx, sy);
  if(rf_x) s.reflect(1);
  if(rf_y) s.reflect(2);
  if(rf_p) s.reflect(4);
  s.print();
  shape_array.push(s);
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
    this.coords.push([x+(w_width/2), y+(w_height/2)]);
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
    angle = angle * Math.PI/180;
    // Rotate relative to origin
    var origin_x = this.coords[0][0];
    var origin_y = this.coords[0][1];
    xr += origin_x;
    yr += origin_y;
    for(var i = 0; i < this.coords.length; i++) {
      x_prev = this.coords[i][0];
      y_prev = this.coords[i][1];
      this.coords[i][0] = xr + ((x_prev-xr)*Math.cos(angle))-((y_prev-yr)*Math.sin(angle));
      this.coords[i][1] = yr + ((x_prev-xr)*Math.sin(angle))+((y_prev-yr)*Math.cos(angle));
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
      if(direction == 1 || direction == 3) {
        this.coords[i][1] -= (w_height/2);
        this.coords[i][1] *= -1;
        this.coords[i][1] += (w_height/2);
      } else if (direction == 2 || direction == 3) {
        this.coords[i][0] -= (w_width/2);
        this.coords[i][0] *= -1;
        this.coords[i][0] += (w_width/2);
      } else if (direction == 4 || direction == 5 || direction == 6) {
        this.coords[i][1] -= (w_height/2);
        this.coords[i][1] *= -1;
        this.coords[i][1] += (w_height/2);
        this.coords[i][0] -= (w_width/2);
        this.coords[i][0] *= -1;
        this.coords[i][0] += (w_width/2);
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

  cube(length, x1, y1) {
    var separation = length / 2;
    this.polygon(4, length, x1, y1);
    this.polygon(4, length, x1 + separation, y1 + separation);
    this.line(x1, y1, x1 + separation, y1 + separation);
    this.line(x1 + length, y1, x1 + separation + length, y1 + separation);
    this.line(x1, y1 + length, x1 + separation, y1 + separation + length);
    this.line(x1 + length, y1 + length, x1 + separation + length, y1 + separation + length);
  }

  prismRect(x1, y1, width, height, depth) {
    var separation = depth / 2;
    this.line(x1, y1, x1 + width, y1);
    this.line(x1 + width, y1, x1 + width, y1 + height);
    this.line(x1 + width, y1 + height, x1, y1 + height);
    this.line(x1, y1 + height, x1, y1);
    this.line(x1 + separation, y1 + separation, x1 + width + separation, y1 + separation);
    this.line(x1 + width + separation, y1 + separation, x1 + width + separation, y1 + height + separation);
    this.line(x1 + width + separation, y1 + height + separation, x1 + separation, y1 + height + separation);
    this.line(x1 + separation, y1 + height + separation, x1 + separation, y1 + separation);
    this.line(x1, y1, x1 + separation, y1 + separation);
    this.line(x1 + width, y1, x1 + separation + width, y1 + separation);
    this.line(x1, y1 + height, x1 + separation, y1 + separation + height);
    this.line(x1 + width, y1 + height, x1 + separation + width, y1 + separation + height);
  }

  prismTriang(x1, y1, length, depth) {
    var separation = depth / 2;
    var height = length * Math.sin(Math.PI / 3);
    this.polygon(3, length, x1, y1);
    this.polygon(3, length, x1 + separation, y1 + separation);
    this.line(x1, y1, x1 + separation, y1 + separation);
    this.line(x1 + length, y1, x1 + separation + length, y1 + separation);
    this.line(x1 + length/2, y1 + height, x1 + length/2 + separation, y1 + height + separation)
  }

  circle(x0, y0, radius, angle) {
    // Algorithm from wikipedia.org/wiki/Midpoint_circle_algorithm
    var x = radius-1;
    var y = 0;
    var dx = 1;
    var dy = 1;
    var err = dx - (radius << 1);

    while (x >= y) {
      if(angle >= 45) this.addCoord(x0 + x, y0 + y);
      if(angle >= 90) this.addCoord(x0 + y, y0 + x);
      if(angle >= 135) this.addCoord(x0 - y, y0 + x);
      if(angle >= 180) this.addCoord(x0 - x, y0 + y);
      if(angle >= 225) this.addCoord(x0 - x, y0 - y);
      if(angle >= 270) this.addCoord(x0 - y, y0 - x);
      if(angle >= 315) this.addCoord(x0 + y, y0 - x);
      if(angle >= 360) this.addCoord(x0 + x, y0 - y);

      if(err <= 0) {
        y++;
        err += dy;
        dy += 2;
      }
      if(err > 0) {
        x--;
        dx += 2;
        err += (-radius << 1) + dx;
      }
    }
  }

  cone(x1, y1, radius, height) {
    this.circle(x1, y1, radius, 360);
    this.line(x1 - radius, y1, x1, y1 - height);
    this.line(x1 + radius, y1, x1, y1 - height);
    this.line(x1, y1 + radius, x1, y1 - height);
    this.line(x1, y1 - radius, x1, y1 - height);
  }
}

function drawAxis() {
  stroke(0, 153, 255);
  line(0, w_height*0.5, w_width, w_height*0.5);
  line(w_width*0.5, 0, w_width*0.5, w_height);
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
  if(x < w_width && y < w_height) {
    var t_space = document.getElementById("t_space");
    var tooltipSpan = document.getElementById('tooltip-span');
    t_space.removeEventListener("click", getCoords);
    t_space.removeEventListener("mousemove", printCoords);
    t_space.style.cursor = "default";
    tooltipSpan.innerHTML = "";
    curr_coords[0] = x - 16 - w_width/2;
    curr_coords[1] = y - w_height/2;
  }
}

function printCoords() {
  var tooltipSpan = document.getElementById('tooltip-span');
  var coords_text = document.getElementById('coords_text');
  var x = event.clientX;
  var y = event.clientY;
  tooltipSpan.style.top = (y + 20) + 'px';
  tooltipSpan.style.left = (x + 20) + 'px';
  tooltipSpan.innerHTML = Math.round(x - 16 - w_width/2) + ', ' + Math.round(y - w_height/2);
  coords_text.innerHTML = Math.round(x - 16 - w_width/2) + ', ' + Math.round(y - w_height/2);
}

function clearScreen() {
  clear();
  drawAxis();
}
