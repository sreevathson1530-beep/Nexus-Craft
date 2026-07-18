/* NEXUS CRAFT v2 — boot, preloader, smooth scroll, cursor, marquee, reveals */
(function () {
  'use strict';

  var docEl = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(pointer: fine)').matches &&
                    window.matchMedia('(hover: hover)').matches;
  var M = window.Motion || null;

  /* Shared state for hero.js / scenes.js */
  var NC = (window.NC = {
    reduceMotion: reduceMotion,
    finePointer: finePointer,
    M: M,
    lenis: null,
    velocity: 0,
    introDone: !docEl.classList.contains('intro'),
    _introQueue: []
  });

  NC.whenIntroDone = function (fn) {
    if (NC.introDone) fn();
    else NC._introQueue.push(fn);
  };

  function finishIntro() {
    if (NC.introDone) return;
    NC.introDone = true;
    docEl.classList.remove('intro');
    try { sessionStorage.setItem('nc_intro', '1'); } catch (e) {}
    NC._introQueue.forEach(function (fn) { fn(); });
    NC._introQueue.length = 0;
  }

  /* ---------- smooth scroll (Lenis) ---------- */
  if (!reduceMotion && finePointer && typeof Lenis !== 'undefined') {
    try {
      var lenis = new Lenis({ lerp: 0.1 });
      NC.lenis = lenis;
      lenis.on('scroll', function (e) { NC.velocity = e.velocity || 0; });
      var rafLenis = function (time) {
        lenis.raf(time);
        requestAnimationFrame(rafLenis);
      };
      requestAnimationFrame(rafLenis);
    } catch (e) { NC.lenis = null; }
  }

  /* velocity fallback for native scrolling */
  if (!NC.lenis) {
    var lastY = window.scrollY;
    var lastT = performance.now();
    window.addEventListener('scroll', function () {
      var now = performance.now();
      var dt = Math.max(1, now - lastT);
      NC.velocity = ((window.scrollY - lastY) / dt) * 16;
      lastY = window.scrollY;
      lastT = now;
    }, { passive: true });
  }

  /* anchor routing through the smooth scroller */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (ev) {
      var id = a.getAttribute('href');
      if (!id || id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      ev.preventDefault();
      if (NC.lenis) NC.lenis.scrollTo(target);
      else target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  });

  /* ---------- preloader ---------- */
  var pre = document.getElementById('preloader');
  if (docEl.classList.contains('intro') && pre) {
    var ringDraw = pre.querySelector('.preloader-ring-draw');
    var word = pre.querySelector('.preloader-word');
    var counter = document.getElementById('preloader-counter');
    var COUNT_MS = 1000;
    var startT = null;

    var tickIntro = function (now) {
      if (startT === null) startT = now;
      var p = Math.min(1, (now - startT) / COUNT_MS);
      var eased = 1 - Math.pow(1 - p, 3);
      if (counter) counter.textContent = ('00' + Math.round(eased * 100)).slice(-3);
      if (ringDraw) ringDraw.style.strokeDashoffset = String(327 * (1 - eased));
      if (word) word.style.opacity = String(Math.min(1, eased * 1.6));
      if (p < 1) {
        requestAnimationFrame(tickIntro);
      } else {
        setTimeout(function () {
          pre.classList.add('is-done');   /* curtains part */
          finishIntro();                  /* hero entrance overlaps the curtain */
          setTimeout(function () { pre.remove(); }, 760);
        }, 140);
      }
    };
    requestAnimationFrame(tickIntro);
  } else {
    if (pre) pre.remove();
    finishIntro();
  }

  /* ---------- custom cursor ---------- */
  if (!reduceMotion && finePointer) {
    var dot = document.getElementById('cursor-dot');
    var ring = document.getElementById('cursor-ring');
    var label = document.getElementById('cursor-label');
    if (dot && ring) {
      docEl.classList.add('has-cursor');
      var tx = window.innerWidth / 2;
      var ty = window.innerHeight / 3;
      var dotS = { x: tx, y: ty, vx: 0, vy: 0 };
      var ringS = { x: tx, y: ty, vx: 0, vy: 0 };

      window.addEventListener('mousemove', function (e) {
        tx = e.clientX;
        ty = e.clientY;
      }, { passive: true });

      var stepSpring = function (s, k, d, dt) {
        s.vx += (-k * (s.x - tx) - d * s.vx) * dt;
        s.vy += (-k * (s.y - ty) - d * s.vy) * dt;
        s.x += s.vx * dt;
        s.y += s.vy * dt;
      };

      var lastC = performance.now();
      var loopCursor = function (now) {
        var dt = Math.min(0.05, (now - lastC) / 1000);
        lastC = now;
        stepSpring(dotS, 900, 55, dt);
        stepSpring(ringS, 260, 26, dt);
        dot.style.transform = 'translate3d(' + dotS.x + 'px,' + dotS.y + 'px,0)';
        ring.style.transform = 'translate3d(' + ringS.x + 'px,' + ringS.y + 'px,0)';
        requestAnimationFrame(loopCursor);
      };
      requestAnimationFrame(loopCursor);

      document.addEventListener('mouseover', function (e) {
        var t = e.target.closest('[data-cursor]');
        if (!t) return;
        var kind = t.getAttribute('data-cursor');
        if (kind === 'call' || kind === 'open') {
          if (label) label.textContent = kind === 'call' ? 'CALL' : 'OPEN';
          ring.classList.add('is-active');
        } else {
          ring.classList.add('is-hover');
        }
      });
      document.addEventListener('mouseout', function (e) {
        var t = e.target.closest('[data-cursor]');
        if (!t) return;
        ring.classList.remove('is-active');
        ring.classList.remove('is-hover');
        if (label) label.textContent = '';
      });
    }
  }

  /* ---------- magnetic elements ---------- */
  if (!reduceMotion && finePointer) {
    document.querySelectorAll('[data-magnetic]').forEach(function (el) {
      var strength = 0.32;
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var dx = e.clientX - (r.left + r.width / 2);
        var dy = e.clientY - (r.top + r.height / 2);
        el.style.transition = 'none';
        el.style.transform = 'translate3d(' + dx * strength + 'px,' + dy * strength + 'px,0)';
      });
      el.addEventListener('mouseleave', function () {
        el.style.transition = 'transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)';
        el.style.transform = 'translate3d(0,0,0)';
        setTimeout(function () { el.style.transition = ''; }, 600);
      });
    });
  }

  /* ---------- marquee ---------- */
  var track = document.getElementById('marquee-track');
  if (track && !reduceMotion) {
    var segW = 0;
    var measure = function () {
      var seg = track.children[0];
      if (seg) segW = seg.getBoundingClientRect().width;
    };
    measure();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
    window.addEventListener('resize', measure, { passive: true });

    var mx = 0;
    var dir = -1;
    var BASE = 55; /* px per second */
    var lastM = performance.now();
    var loopMarquee = function (now) {
      var dt = Math.min(0.05, (now - lastM) / 1000);
      lastM = now;
      if (segW > 0) {
        var v = NC.velocity || 0;
        if (v > 0.15) dir = -1;
        else if (v < -0.15) dir = 1;
        var speed = BASE + Math.min(520, Math.abs(v) * 55);
        mx += dir * speed * dt;
        mx = ((mx % segW) + segW) % segW;
        track.style.transform = 'translate3d(' + -mx + 'px,0,0)';
      }
      requestAnimationFrame(loopMarquee);
    };
    requestAnimationFrame(loopMarquee);
  }

  /* ---------- generic scroll reveals ---------- */
  var reveals = document.querySelectorAll('[data-reveal]');
  if (reduceMotion || !M || typeof M.inView !== 'function') {
    reveals.forEach(function (el) { el.style.opacity = '1'; });
  } else {
    reveals.forEach(function (el) {
      var stop = M.inView(el, function () {
        M.animate(el,
          { opacity: [0, 1], y: [34, 0] },
          { duration: 0.9, ease: [0.22, 1, 0.36, 1], easing: [0.22, 1, 0.36, 1] });
        if (typeof stop === 'function') stop();
      }, { amount: 0.25 });
    });
  }
})();
