(function () {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const hero = document.getElementById('hero');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let width = 0;
  let height = 0;
  const dpr = Math.max(1, window.devicePixelRatio || 1);

  function resize() {
    const rect = hero.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function buildAnchors() {
    const edge = 24;
    return [
      { x: edge, y: edge },
      { x: width / 2, y: edge },
      { x: width - edge, y: edge },
      { x: edge, y: height / 2 },
      { x: width - edge, y: height / 2 },
      { x: edge, y: height - edge },
      { x: width / 2, y: height - edge },
      { x: width - edge, y: height - edge },
      { x: width * 0.25, y: edge },
      { x: width * 0.75, y: edge },
      { x: width * 0.25, y: height - edge },
      { x: width * 0.75, y: height - edge }
    ];
  }

  let anchors = [];
  const focal = { x: 0, y: 0 };
  const target = { x: 0, y: 0 };
  let idleAngle = 0;
  let lastMoveTime = 0;
  const IDLE_DELAY = 2200;
  const LERP = 0.05;

  function onPointerMove(e) {
    const rect = hero.getBoundingClientRect();
    target.x = e.clientX - rect.left;
    target.y = e.clientY - rect.top;
    lastMoveTime = performance.now();
  }

  function updateIdleTarget() {
    idleAngle += 0.004;
    target.x = width / 2 + Math.cos(idleAngle) * width * 0.18;
    target.y = height / 2 + Math.sin(idleAngle * 1.3) * height * 0.14;
  }

  function drawFrame() {
    ctx.clearRect(0, 0, width, height);

    const parallaxX = (focal.x / width - 0.5) * 16;
    ctx.strokeStyle = 'rgba(184,184,184,0.06)';
    ctx.lineWidth = 1;
    const horizonYs = [0.28, 0.42, 0.58, 0.72];
    horizonYs.forEach((fy, i) => {
      const y = height * fy;
      ctx.beginPath();
      ctx.moveTo(-20 + parallaxX * (i + 1) * 0.4, y);
      ctx.lineTo(width + 20 + parallaxX * (i + 1) * 0.4, y);
      ctx.stroke();
    });

    const maxDist = Math.sqrt(width * width + height * height);
    anchors.forEach((a) => {
      const dx = focal.x - a.x;
      const dy = focal.y - a.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const opacity = Math.max(0.04, 0.22 * (1 - dist / maxDist));
      ctx.strokeStyle = `rgba(201,162,77,${opacity})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(focal.x, focal.y);
      ctx.stroke();
    });

    ctx.beginPath();
    ctx.fillStyle = 'rgba(232,193,112,0.5)';
    ctx.arc(focal.x, focal.y, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  function tick() {
    const now = performance.now();
    if (now - lastMoveTime > IDLE_DELAY) {
      updateIdleTarget();
    }
    focal.x += (target.x - focal.x) * LERP;
    focal.y += (target.y - focal.y) * LERP;
    drawFrame();
    requestAnimationFrame(tick);
  }

  function drawStaticFrame() {
    focal.x = width / 2;
    focal.y = height / 2;
    drawFrame();
  }

  function init() {
    resize();
    anchors = buildAnchors();
    focal.x = target.x = width / 2;
    focal.y = target.y = height / 2;

    if (reduceMotion) {
      drawStaticFrame();
      return;
    }

    hero.addEventListener('mousemove', onPointerMove);
    requestAnimationFrame(tick);
  }

  window.addEventListener('resize', () => {
    resize();
    anchors = buildAnchors();
    if (reduceMotion) drawStaticFrame();
  });

  init();
})();
