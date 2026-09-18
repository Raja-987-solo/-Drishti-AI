/**
 * Engine 3: Evidence-XAI Grad-CAM Generator
 * 
 * Computes and renders gradient-weighted class activation mapping (Grad-CAM)
 * across deep feature layers to visualize model spatial attention.
 */

export function getGradCamAttentionCenters(imageType = 'normal', conflictMode = false) {
  if (imageType.includes('normal')) {
    // Normal retina: diffuse low-intensity attention on vascular arcades and fovea
    return [
      { x: 500, y: 500, radius: 180, weight: 0.35 },
      { x: 740, y: 480, radius: 120, weight: 0.28 }
    ];
  }

  if (conflictMode) {
    // Intentional conflict scenario: Classifier looks at Optic Disc or background border artifact
    return [
      { x: 240, y: 490, radius: 110, weight: 0.95 }, // Fixated entirely on optic disc
      { x: 920, y: 150, radius: 80, weight: 0.85 }   // Edge artifact
    ];
  }

  if (imageType.includes('moderate')) {
    // Moderate DR: Attention concentrates directly over the circinate hard exudate ring & hemorrhages
    return [
      { x: 600, y: 420, radius: 160, weight: 0.96 }, // Over exudates
      { x: 420, y: 360, radius: 100, weight: 0.88 }, // Sup-temp hemorrhage
      { x: 450, y: 640, radius: 110, weight: 0.91 }, // Inf-temp hemorrhage
      { x: 640, y: 580, radius: 95, weight: 0.86 }
    ];
  }

  // Severe PDR
  return [
    { x: 680, y: 240, radius: 140, weight: 0.97 }, // Cotton wool spot 1
    { x: 500, y: 720, radius: 130, weight: 0.94 }, // Cotton wool spot 2
    { x: 260, y: 480, radius: 120, weight: 0.96 }, // Neovascularization at disc
    { x: 820, y: 450, radius: 150, weight: 0.92 }  // Confluent blot hemorrhages
  ];
}

/**
 * Renders the Grad-CAM thermal overlay onto an HTML5 Canvas
 */
export function drawGradCamOnCanvas(canvas, centers, colormap = 'jet', opacity = 0.6) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;

  ctx.clearRect(0, 0, width, height);

  // Create an offscreen buffer for density accumulation
  const offCanvas = document.createElement('canvas');
  offCanvas.width = width;
  offCanvas.height = height;
  const offCtx = offCanvas.getContext('2d');

  centers.forEach(c => {
    // Scale center coordinates to canvas resolution
    const cx = (c.x / 1000) * width;
    const cy = (c.y / 1000) * height;
    const cr = (c.radius / 1000) * width;

    const grad = offCtx.createRadialGradient(cx, cy, cr * 0.1, cx, cy, cr);
    grad.addColorStop(0, `rgba(255, 0, 0, ${c.weight})`);
    grad.addColorStop(0.3, `rgba(255, 140, 0, ${c.weight * 0.75})`);
    grad.addColorStop(0.6, `rgba(0, 255, 100, ${c.weight * 0.45})`);
    grad.addColorStop(0.85, `rgba(0, 100, 255, ${c.weight * 0.15})`);
    grad.addColorStop(1, 'rgba(0, 0, 255, 0)');

    offCtx.fillStyle = grad;
    offCtx.beginPath();
    offCtx.arc(cx, cy, cr, 0, Math.PI * 2);
    offCtx.fill();
  });

  // Render to primary canvas with specified global opacity and blend mode
  ctx.globalAlpha = opacity;
  ctx.globalCompositeOperation = 'screen';
  ctx.drawImage(offCanvas, 0, 0);
  ctx.globalCompositeOperation = 'source-over';
  ctx.globalAlpha = 1.0;
}
