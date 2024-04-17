const activeToolEl = document.getElementById('active-tool');
const brushColorBtn = document.getElementById('brush-color');
const brushIcon = document.getElementById('brush');
const brushSize = document.getElementById('brush-size');
const brushSlider = document.getElementById('brush-slider');
const bucketColorBtn = document.getElementById('bucket-color');
const eraser = document.getElementById('eraser');
const clearCanvasBtn = document.getElementById('clear-canvas');
const saveStorageBtn = document.getElementById('save-storage');
const loadStorageBtn = document.getElementById('load-storage');
const clearStorageBtn = document.getElementById('clear-storage');
const downloadBtn = document.getElementById('download');
const { body } = document;

// Global Variables
const canvas = document.createElement('canvas');
canvas.id = 'canvas';
const ctx = canvas.getContext("2d");

let currentSize = 10;
let bucketColor = '#FFFFFF';
let currentColor = '#A51DAB';
let isEraser = false;
let isMouseDown = false;
let drawnArray = [];

// Formatting Brush Size
function displayBrushSize() {
  const val = brushSlider.value;
  brushSize.textContent = val < 10 ? `0${val}` : val;
}

// Setting Brush Size
brushSlider.addEventListener('change', () => {
  currentSize = brushSlider.value;
  displayBrushSize();
});

// Setting Brush Color
brushColorBtn.addEventListener('change', () => {
  isEraser = false;
  currentColor = `#${brushColorBtn.value}`;
});

// Setting Background Color
bucketColorBtn.addEventListener('change', () => {
  bucketColor = `#${bucketColorBtn.value}`;
  createCanvas();
  restoreCanvas();
});

// // Eraser
eraser.addEventListener('click', () => {
  isEraser = true;
  brushIcon.style.color = 'white';
  eraser.style.color = 'black';
  activeToolEl.textContent = 'Eraser';
  currentColor = bucketColor;
  currentSize = 50; 
});

// // Switch back to Brush
function switchToBrush() {
  isEraser = false;
  activeToolEl.textContent = 'Brush';
  brushIcon.style.color = 'black';
  eraser.style.color = 'white';
  currentColor = `#${brushColorBtn.value}`;
  currentSize = 10;
  brushSlider.value = 10;
  displayBrushSize();
}

// Create Canvas
function createCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - 50;
  ctx.fillStyle = bucketColor;
  ctx.fillRect(0,0,canvas.width, canvas.height);
  body.appendChild(canvas);
  switchToBrush();
}

// // Clear Canvas
clearCanvasBtn.addEventListener('click', () => {
  createCanvas();
  drawnArray = [];
  // Active Tool
  activeToolEl.textContent = 'Canvas Cleared';
  setTimeout(switchToBrush, 1500);
});

// // Draw what is stored in DrawnArray
function restoreCanvas() {
  for (let i = 1; i < drawnArray.length; i++) {
    ctx.beginPath();
    ctx.moveTo(drawnArray[i - 1].x, drawnArray[i - 1].y);
    ctx.lineWidth = drawnArray[i].size;
    ctx.lineCap = 'round';
    if (drawnArray[i].eraser) {
      ctx.strokeStyle = bucketColor;
    } else {
      ctx.strokeStyle = drawnArray[i].color;
    }
    ctx.lineTo(drawnArray[i].x, drawnArray[i].y);
    ctx.stroke();
  }
}

// // Store Drawn Lines in DrawnArray
function storeDrawn(x, y, size, color, erase) {
  const line = {
    x,
    y,
    size,
    color,
    erase,
  };
  drawnArray.push(line);
}

// Get Mouse Position
function getMousePosition(e) {
  const boundaries = canvas.getBoundingClientRect();
  return {
    x: e.clientX - boundaries.left,
    y: e.clientY - boundaries.top,
  };
}

// Mouse Down
canvas.addEventListener('mousedown', (e) => {
  isMouseDown = true;
  const currentPosition = getMousePosition(e);
  ctx.moveTo(currentPosition.x, currentPosition.y);
  ctx.beginPath();
  ctx.lineWidth = currentSize;
  ctx.lineCap = 'round';
  ctx.strokeStyle = currentColor;
});

// Mouse Move
canvas.addEventListener('mousemove', (e) => {
  if (isMouseDown) {
    const currentPosition = getMousePosition(e);
    ctx.lineTo(currentPosition.x, currentPosition.y);
    ctx.stroke();
    storeDrawn(
      currentPosition.x,
      currentPosition.y,
      currentSize,
      currentColor,
      isEraser,
    );
  } else {
    storeDrawn(undefined);
  }
});

// Mouse Up
canvas.addEventListener('mouseup', () => {
  isMouseDown = false;
});

// // Save to Local Storage
saveStorageBtn.addEventListener('click', () => {
  localStorage.setItem('savedCanvas', JSON.stringify(drawnArray));
  // Active Tool
  activeToolEl.textContent = 'Canvas Saved';
  setTimeout(switchToBrush, 1500);
});

// Load from Local Storage
loadStorageBtn.addEventListener('click', () => {
  if (localStorage.getItem("savedCanvas")) {
    drawnArray = JSON.parse(localStorage.getItem("savedCanvas"));
    restoreCanvas();
  // Active Tool
    activeToolEl.textContent = 'Canvas Loaded';
    setTimeout(switchToBrush, 1500);
  } else {
    activeToolEl.textContent = "No canvas found";
  }

});

// // Clear Local Storage
clearStorageBtn.addEventListener('click', () => {
  localStorage.removeItem("savedCanvas");
  // Active Tool
  activeToolEl.textContent = 'Local Storage Cleared';
  setTimeout(switchToBrush, 1500);
});

// Download Image
downloadBtn.addEventListener('click', () => {
  downloadBtn.href = canvas.toDataURL('image/jpeg', 1);
  downloadBtn.download = 'paint-clone.jpg';
  // Active Tool
  activeToolEl.textContent = 'Image File Saved';
  setTimeout(switchToBrush, 1500);
});


brushIcon.addEventListener('click', switchToBrush);

// On Load
createCanvas();
