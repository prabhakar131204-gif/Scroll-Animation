const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const loader = document.getElementById("loader");

const frameCount = 240; // change to match your total images
const images = [];
let imagesLoaded = 0;

// Resize canvas to full screen
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  renderFrame(currentFrame);
}

window.addEventListener("resize", resizeCanvas);

// Generate image path
function getFramePath(index) {
  return `images/ezgif-frame-${String(index).padStart(3, "0")}.jpg`;
}

// Preload images
for (let i = 1; i <= frameCount; i++) {
  const img = new Image();
  img.src = getFramePath(i);
  img.onload = () => {
    imagesLoaded++;
    if (imagesLoaded === frameCount) {
      loader.style.display = "none";
      resizeCanvas();
      requestAnimationFrame(updateAnimation);
    }
  };
  images.push(img);
}

let currentFrame = 0;

// Draw image while maintaining aspect ratio
function renderFrame(index) {
  const img = images[index];
  if (!img) return;

  const canvasRatio = canvas.width / canvas.height;
  const imageRatio = img.width / img.height;

  let drawWidth, drawHeight;

  if (imageRatio > canvasRatio) {
    drawHeight = canvas.height;
    drawWidth = img.width * (canvas.height / img.height);
  } else {
    drawWidth = canvas.width;
    drawHeight = img.height * (canvas.width / img.width);
  }

  const x = (canvas.width - drawWidth) / 2;
  const y = (canvas.height - drawHeight) / 2;

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(img, x, y, drawWidth, drawHeight);
}

// Scroll-driven animation
function updateAnimation() {
  const scrollTop = window.scrollY;
  const maxScroll =
    document.body.scrollHeight - window.innerHeight;

  const scrollFraction = scrollTop / maxScroll;
  const frameIndex = Math.min(
    frameCount - 1,
    Math.floor(scrollFraction * frameCount)
  );

  if (frameIndex !== currentFrame) {
    currentFrame = frameIndex;
    renderFrame(currentFrame);
  }

  requestAnimationFrame(updateAnimation);
}
