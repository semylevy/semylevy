var canvas, width, q, coord, w_size;

function setup () {
  w_size = 600;
  canvas = createCanvas(w_size, w_size);
  canvas.parent('t_space');
  q = new Queue;
  s = new Shape;
  s.polygon(8, 50, 50, 0);
  s.reflect(0);
  s.reflect(1);
  //s.translate(20, 5);
  //s.rotate(180, 50, 50);
  //s.scale(1.2, 1.2);
  s.print();
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
      console.log(this.coords[i][0]);
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
