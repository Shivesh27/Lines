
var img;
var chooseFile;
var chooseColor;
var chooseDist;
var chooseHeight;
var blurred;
var clr;

var startingStroke;


function preload() {

    chooseFile = document.getElementById("choose-file");
    chooseFile.addEventListener("change", function () {
        getImgData();
      });

    chooseColor = document.getElementById("choose-color");
    chooseColor.addEventListener("change", function() {
      document.querySelector("body").style.backgroundColor = chooseColor.value
    })

    chooseDist = document.getElementById("choose-dist");
    chooseHeight = document.getElementById("choose-height");

}

function getImgData() {
    const files = chooseFile.files[0];
    if (files) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(files);
      fileReader.addEventListener("load", function () {
        img = loadImage(`${this.result}`)
      });    
    }
  }

function setup() {
  createCanvas(600, 600);
  blurred = 0

}

function draw() {

  
  background(`${chooseColor.value}`);

    if(img) {
    if(blurred == 0) {
        img.filter(BLUR, 3);
        blurred = 1
    }
    
    img.resize(200,200)
  
  //image(img, 0, 0, 400, 400);
  
  let w = width/img.width;
  let h = height/img.height;
  
  const hMap = [...Array(img.width)].map(e => Array(img.height))
  
  
  img.loadPixels();
  for(let i = 0; i<img.height; i ++) {
    for(let j = 0; j < img.width; j ++) {
      
      const pixelIndex = (i*img.width + j)* 4;
      const r = img.pixels[pixelIndex];
      const g = img.pixels[pixelIndex+1];
      const b = img.pixels[pixelIndex+2];
      //heatMap
      hMap[j][i] = (r + g + b)/ 3 ;
      //square(j*w, i*h, w);
    }
  }
  
  startingStroke = 5
  
  var str = startingStroke
  
  var band = 35
  
  var waveDist = int(chooseDist.value);
  
  var waveHeight = int(chooseHeight.value);
  
  for(let i = 0 + band; i < img.height - band; i += waveDist) {
    noFill();
    strokeWeight(str);
    stroke('rgba(255,255,255,0.5)')
    beginShape()
    for(let j = 0; j < img.width; j++) {
      var y = map(hMap[j][i], 255,0,0,waveHeight)
      vertex(j*w, i*h + y)
    }

    endShape()
    str -= 0.1
  }
  
  str = startingStroke
  
  for(let i = 0 + band; i < img.height - band; i += waveDist) {
    noFill();
    strokeWeight(str);
    stroke('rgba(255,255,255,0.5)')
    var shapeEnded = 1
    beginShape()
    for(let j = 0; j < img.width; j++) {
      
      if(hMap[j][i] > 200) {
        if(shapeEnded == 1) {
          shapeEnded = 0
          beginShape()
        }
        var diff = map(hMap[j][i], 255,0,0,waveHeight)
        vertex(j*w, i*h + diff)
      } else {
        endShape()
        shapeEnded = 1
      }
      
    }

    endShape()
    str -= 0.1
  }
    }
    
}