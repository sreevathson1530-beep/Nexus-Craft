/* NEXUS CRAFT v2 — hero constellation, intro choreography, parallax */
(function () {
  'use strict';

  var NC = window.NC || {};
  var M = NC.M;
  var reduceMotion = !!NC.reduceMotion;

  var hero = document.getElementById('hero');
  var canvas = document.getElementById('hero-canvas');
  if (!hero || !canvas) return;
  var ctx = canvas.getContext('2d');

  /* ---------- constellation ---------- */

  var dpr = Math.min(2, Math.max(1, window.devicePixelRatio || 1));
  var width = 0;
  var height = 0;
  var nodes = [];
  var running = false;
  var rafId = 0;

  var focal = { x: 0, y: 0, vx: 0, vy: 0 };
  var target = { x: 0, y: 0 };
  var K = 90;   /* spring stiffness */
  var D = 18;   /* damping */
  var lastMove = 0;
  var IDLE_MS = 2400;
  var idleT = 0;

  function resize() {
    var rect = hero.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function buildNodes() {
    var e = 26;
    var isNarrow = width < 720;
    var pts = [
      [e, e], [width * 0.5, e], [width - e, e],
      [e, height * 0.5], [width - e, height * 0.5],
      [e, height - e], [width * 0.5, height - e], [width - e, height - e],
      [width * 0.25, e], [width * 0.75, e],
      [width * 0.25, height - e], [width * 0.75, height - e],
      [width * 0.88, height * 0.28], [width * 0.12, height * 0.72]
    ];
    if (!isNarrow) {
      pts.push(
        [width * 0.65, height * 0.18], [width * 0.35, height * 0.85],
        [width * 0.92, height * 0.6], [width * 0.08, height * 0.35],
        [width * 0.55, height * 0.08], [width * 0.45, height * 0.92],
        [width * 0.18, height * 0.15], [width * 0.82, height * 0.82],
        [width * 0.3, height * 0.5], [width * 0.7, height * 0.55],
        [width * 0.6, height * 0.75], [width * 0.4, height * 0.25]
      );
    }
    nodes = pts.map(function (p, i) {
      return { x: p[0], y: p[1], phase: i * 1.7 };
    });
  }

  function drawFrame(t) {
    ctx.clearRect(0, 0, width, height);
    var maxDist = Math.sqrt(width * width + height * height) || 1;
    var WEB_R = Math.min(300, width * 0.28);

    /* node -> focal lines */
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      var dx = focal.x - n.x;
      var dy = focal.y - n.y;
      var dist = Math.sqrt(dx * dx + dy * dy);
      var op = Math.max(0.03, 0.26 * (1 - dist / maxDist));
      ctx.strokeStyle = 'rgba(201,162,77,' + op.toFixed(3) + ')';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(n.x, n.y);
      ctx.lineTo(focal.x, focal.y);
      ctx.stroke();
    }

    /* web: interconnect nodes near the focal point */
    for (var a = 0; a < nodes.length; a++) {
      var na = nodes[a];
      var da = Math.hypot(focal.x - na.x, focal.y - na.y);
      if (da > WEB_R) continue;
      for (var b = a + 1; b < nodes.length; b++) {
        var nb = nodes[b];
        var db = Math.hypot(focal.x - nb.x, focal.y - nb.y);
        if (db > WEB_R) continue;
        var op2 = 0.14 * (1 - Math.max(da, db) / WEB_R);
        ctx.strokeStyle = 'rgba(232,193,112,' + op2.toFixed(3) + ')';
        ctx.beginPath();
        ctx.moveTo(na.x, na.y);
        ctx.lineTo(nb.x, nb.y);
        ctx.stroke();
      }
    }

    /* nodes with a slow pulse */
    for (var j = 0; j < nodes.length; j++) {
      var nj = nodes[j];
      var r = 1.5 + Math.sin(t * 0.0012 + nj.phase) * 0.7;
      ctx.beginPath();
      ctx.fillStyle = 'rgba(201,162,77,0.55)';
      ctx.arc(nj.x, nj.y, Math.max(0.6, r), 0, Math.PI * 2);
      ctx.fill();
    }

    /* focal point */
    ctx.beginPath();
    ctx.fillStyle = 'rgba(232,193,112,0.6)';
    ctx.arc(focal.x, focal.y, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  var lastT = 0;
  function tick(now) {
    if (!running) return;
    var dt = Math.min(0.05, (now - (lastT || now)) / 1000);
    lastT = now;

    if (now - lastMove > IDLE_MS) {
      idleT += dt;
      target.x = width / 2 + Math.cos(idleT * 0.5) * width * 0.2;
      target.y = height / 2 + Math.sin(idleT * 0.65) * height * 0.16;
    }

    focal.vx += (-K * (focal.x - target.x) - D * focal.vx) * dt;
    focal.vy += (-K * (focal.y - target.y) - D * focal.vy) * dt;
    focal.x += focal.vx * dt;
    focal.y += focal.vy * dt;

    drawFrame(now);
    rafId = requestAnimationFrame(tick);
  }

  function start() {
    if (running || reduceMotion) return;
    running = true;
    lastT = 0;
    rafId = requestAnimationFrame(tick);
  }

  function stopLoop() {
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
  }

  function onPointerMove(e) {
    var rect = hero.getBoundingClientRect();
    target.x = e.clientX - rect.left;
    target.y = e.clientY - rect.top;
    lastMove = performance.now();
  }

  function initCanvas() {
    resize();
    buildNodes();
    focal.x = target.x = width / 2;
    focal.y = target.y = height * 0.42;

    if (reduceMotion) {
      drawFrame(0);
      return;
    }

    hero.addEventListener('mousemove', onPointerMove, { passive: true });

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) start();
          else stopLoop();
        });
      }, { threshold: 0 });
      io.observe(hero);
    } else {
      start();
    }
  }

  window.addEventListener('resize', function () {
    resize();
    buildNodes();
    if (reduceMotion) drawFrame(0);
  }, { passive: true });

  initCanvas();

  /* ---------- intro choreography ---------- */

  var emPath = document.getElementById('hero-em-path');

  function prepEmPath() {
    if (!emPath) return 0;
    try {
      var len = emPath.getTotalLength();
      emPath.style.strokeDasharray = String(len);
      emPath.style.strokeDashoffset = String(len);
      return len;
    } catch (e) { return 0; }
  }

  function showHeroInstantly() {
    Array.prototype.forEach.call(hero.querySelectorAll('[data-hero-line]'), function (el) {
      el.style.transform = 'none';
    });
    Array.prototype.forEach.call(hero.querySelectorAll('[data-hero-fade]'), function (el) {
      el.style.opacity = '1';
    });
    if (emPath) emPath.style.strokeDashoffset = '0';
  }

  function entrance() {
    if (reduceMotion || !M) return;

    var lines = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-line]'));
    var fades = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-fade]'));

    try {
      M.animate(lines,
        { y: ['115%', '0%'] },
        { duration: 0.95, ease: [0.22, 1, 0.36, 1], easing: [0.22, 1, 0.36, 1],
          delay: (M.stagger ? M.stagger(0.1) : 0) });

      M.animate(fades,
        { opacity: [0, 1], y: [22, 0] },
        { duration: 0.85, ease: [0.22, 1, 0.36, 1], easing: [0.22, 1, 0.36, 1],
          delay: (M.stagger ? M.stagger(0.09, { startDelay: 0.55 }) : 0.55) });
    } catch (e) {
      lines.forEach(function (el) { el.style.transform = 'none'; });
      fades.forEach(function (el) { el.style.opacity = '1'; });
    }

    /* hand-drawn ring around "Googled" */
    var len = prepEmPath();
    if (len && emPath) {
      try {
        M.animate(emPath,
          { strokeDashoffset: [len, 0] },
          { duration: 0.8, delay: 1.05, ease: [0.65, 0, 0.35, 1], easing: [0.65, 0, 0.35, 1] });
      } catch (e) {
        emPath.style.strokeDashoffset = '0';
      }
    }
  }

  if (reduceMotion) {
    /* reduced-motion CSS forces everything visible; nothing to animate */
  } else if (!M) {
    /* Motion failed to load: undo the JS-gated hidden states */
    showHeroInstantly();
  } else if (NC.whenIntroDone) {
    /* hide the ring immediately so it can draw in later */
    prepEmPath();
    NC.whenIntroDone(entrance);
  } else {
    entrance();
  }

  /* ---------- hero parallax on exit ---------- */

  if (!reduceMotion && M && typeof M.scroll === 'function') {
    var inner = hero.querySelector('.hero-inner');
    if (inner) {
      try {
        M.scroll(function (progress) {
          var p = typeof progress === 'number'
            ? progress
            : (progress && progress.y ? progress.y.progress : 0);
          inner.style.transform = 'translate3d(0,' + (-70 * p) + 'px,0)';
          inner.style.opacity = String(1 - p * 0.7);
        }, { target: hero, offset: ['start start', 'end start'] });
      } catch (e) {}
    }
  }
})();
