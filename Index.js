var fire = document.getElementById("fire");
var ctx = fire.getContext("2d");

fire.width = window.innerWidth;
fire.height = window.innerHeight;

window.addEventListener("resize", function () {
  fire.width = window.innerWidth;
  fire.height = window.innerHeight;
});

var fireworks = [];
var explosionTexts = ["Happy Diwali", "Best wishes", "from Developer Mayur"];
var currentTextIndex = 0;
var currentCharIndex = 0;
var displayDelay = 200;  
var isAnimating = false;

function Firework(x, color) {
  this.trails = [];
  this.targetY = Math.random() * (fire.height);
  this.color = color;
  this.exploded = false;
  this.particles = [];

  for (let i = -1; i <= 1; i++) {
    this.trails.push({
      x: x,
      y: fire.height,
      size: 2,
      angle: i * 5,
      speedY: Math.random() * -6 - 6,
      sway: (Math.random() * 0.1) + 0.05
    });
  }
}

Firework.prototype.launch = function () {
  let self = this;
  if (!this.exploded) {
    this.trails.forEach(function (trail) {
      trail.y += trail.speedY;
      trail.x += Math.sin(trail.angle) + Math.sin(trail.sway * trail.y);
      trail.size *= 0.98;

      if (trail.y <= self.targetY) {
        self.explode();
      }
    });
  }
};

Firework.prototype.explode = function () {
  this.exploded = true;
  var self = this;

  if (!isAnimating) {
    isAnimating = true;
    clearExplosionText();
    showExplosionText();
  }

  this.trails.forEach(function (trail) {
    for (var i = 0; i < 60; i++) {
      var angle = Math.random() * Math.PI * 2;
      var speed = Math.random() * 3 + 1;
      self.particles.push(new Particle(trail.x, trail.y, self.color, angle, speed));
    }
  });
};

Firework.prototype.update = function () {
  if (!this.exploded) {
    this.launch();
    this.drawLaunch();
  } else {
    let self = this;
    this.particles.forEach(function (particle, index) {
      particle.update();
      particle.draw();
      if (particle.alpha <= 0) {
        self.particles.splice(index, 1);
      }
    });
  }
};

Firework.prototype.drawLaunch = function () {
  var self = this;
  this.trails.forEach(function (trail) {
    ctx.save();
    ctx.fillStyle = self.color;
    ctx.beginPath();
    ctx.arc(trail.x, trail.y, trail.size, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  });
};

function Particle(x, y, color, angle, speed) {
  this.x = x;
  this.y = y;
  this.color = color;
  this.angle = angle;
  this.speed = speed;
  this.size = Math.random() * 2 + 1;
  this.alpha = 1;
  this.fade = 0.01;
  this.gravity = 0.02;
}

Particle.prototype.update = function () {
  this.x += Math.cos(this.angle) * this.speed;
  this.y += Math.sin(this.angle) * this.speed + this.gravity;
  this.alpha -= this.fade;
  this.speed *= 0.98;
};

Particle.prototype.draw = function () {
  ctx.save();
  ctx.globalAlpha = this.alpha;
  ctx.fillStyle = this.color;
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
};

function createFirework() {
  var x = Math.random() * fire.width;
  var colors = ["#ff4747", "#47ff85", "#4775ff", "#ff47e6"];
  var color = colors[Math.floor(Math.random() * colors.length)];
  fireworks.push(new Firework(x, color));
}

function clearExplosionText() {
  ctx.clearRect(0, 0, fire.width, fire.height);
}

function showExplosionText() {
  ctx.save();
  ctx.fillStyle = "#FFD700";
  ctx.font = "italic 40px Arial";
  ctx.textAlign = "center";

  if (currentTextIndex < explosionTexts.length) {
    let currentText = explosionTexts[currentTextIndex];
    ctx.fillText(currentText.substring(0, currentCharIndex + 1), fire.width / 2, fire.height / (1.3 - currentTextIndex * 0.1));

    currentCharIndex++;

    if (currentCharIndex < currentText.length) {
      setTimeout(showExplosionText, displayDelay);
    } else {
      currentTextIndex++;
      currentCharIndex = 0;
      setTimeout(showExplosionText, displayDelay);
    }
  } else {
    isAnimating = false;
  }

  ctx.restore();
}

function animate() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
  ctx.fillRect(0, 0, fire.width, fire.height);

  fireworks.forEach(function (firework, index) {
    firework.update();
    if (firework.exploded && firework.particles.length === 0) {
      fireworks.splice(index, 1);
    }
  });

  if (Math.random() < 0.05) {
    createFirework();
  }

  requestAnimationFrame(animate);
}

 
