var inc = 0.04;
var scl = 10;
var cols, rows;

var zoff = 0;

var fr;

var particles = [];
var isSketchRunning = true;
var flowfield;

var savedBackground;
var backgroundMusic;
var amplitude;

function setup() {
  createCanvas(windowWidth, windowHeight);
  cols = floor(width / scl);
  rows = floor(height / scl);
  fr = createP('');

  flowfield = new Array(cols * rows);

  // Initialize particles array
  particles = [];
  for (var i = 0; i < 500; i++) {
    particles[i] = new Particle();
  }

  background(41);

  var button = select('#toggleButton');
  button.mousePressed(initiatePlayback); // Call initiatePlayback on button click

  amplitude = new p5.Amplitude();
}

function initiatePlayback() {
  if (!backgroundMusic) {
    backgroundMusic = createAudio('Music.mp3'); // Create audio element
    backgroundMusic.loop(); // Start playing the music
    backgroundMusic.hide(); // Hide the audio element
    amplitude.setInput(backgroundMusic);
  }

  isSketchRunning = !isSketchRunning;
  if (!isSketchRunning) {
    savedBackground = get();
    backgroundMusic.pause();
  } else {
    backgroundMusic.play();
  }
}

function draw() {
  if (isSketchRunning) {
    var level = amplitude.getLevel();
    var colorR = map(level, 0, 1, 0, 255);
    var colorG = map(level, 0, 10, 0, 255);
    var colorB = map(level, 0, 1, 100, 255);

    var yoff = 0;
    for (var y = 0; y < rows; y++) {
      var xoff = 0;
      for (var x = 0; x < cols; x++) {
        var index = x + y * cols;
        var angle = noise(xoff, yoff, zoff) * TWO_PI * 2;
        var v = p5.Vector.fromAngle(angle);
        v.setMag(1);
        flowfield[index] = v;
        xoff += inc;

        // Ensure particles array is initialized before accessing
        if (particles[index]) {
          particles[index].show(colorR, colorG, colorB);
        }
      }
      yoff += inc;

      zoff += 0.00009;
    }

    for (var i = 0; i < particles.length; i++) {
      particles[i].follow(flowfield);
      particles[i].update();
      particles[i].edges();
    }
  } else {
    background(savedBackground);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}


