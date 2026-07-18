/* NEXUS CRAFT v2 — services index, price theater, process thread, CTA finale */
(function () {
  'use strict';

  var NC = window.NC || {};
  var M = NC.M;
  var reduceMotion = !!NC.reduceMotion;
  var hasMotion = !!(M && typeof M.inView === 'function' && typeof M.animate === 'function');

  function toArray(list) { return Array.prototype.slice.call(list || []); }

  function showAll(els) {
    toArray(els).forEach(function (el) { el.style.opacity = '1'; });
  }

  /* ---------- services index rows ---------- */

  var rows = toArray(document.querySelectorAll('[data-reveal-row]'));
  if (rows.length) {
    if (reduceMotion || !hasMotion) {
      showAll(rows);
    } else {
      var listEl = document.querySelector('.services-index');
      var stopRows = M.inView(listEl, function () {
        try {
          M.animate(rows,
            { opacity: [0, 1], y: [44, 0] },
            { duration: 0.8, ease: [0.22, 1, 0.36, 1], easing: [0.22, 1, 0.36, 1],
              delay: (M.stagger ? M.stagger(0.08) : 0) });
        } catch (e) { showAll(rows); }
        if (typeof stopRows === 'function') stopRows();
      }, { amount: 0.12 });
    }
  }

  /* ---------- price odometer + panel theater ---------- */

  var priceEl = document.getElementById('price-giant');
  var digits = toArray(document.querySelectorAll('.odo-digit'));
  var bloom = document.querySelector('.price-bloom');
  var borderRect = document.getElementById('pricing-border-rect');
  var chips = toArray(document.querySelectorAll('[data-chip]'));
  var backdrop = document.querySelector('.pricing-backdrop');
  var pinWrap = document.querySelector('.pricing-pin');

  function setDigitsFinal() {
    digits.forEach(function (d) {
      var strip = d.querySelector('.odo-strip');
      var n = parseInt(d.getAttribute('data-digit'), 10) || 0;
      if (strip) strip.style.transform = 'translateY(' + (-n) + 'em)';
    });
  }

  function drawBorder(animated) {
    if (!borderRect) return;
    var len = 0;
    try { len = borderRect.getTotalLength(); } catch (e) { return; }
    if (!animated || !hasMotion) return; /* static border is already visible */
    borderRect.style.strokeDasharray = String(len);
    borderRect.style.strokeDashoffset = String(len);
    try {
      M.animate(borderRect,
        { strokeDashoffset: [len, 0] },
        { duration: 1.4, ease: [0.22, 1, 0.36, 1], easing: [0.22, 1, 0.36, 1] });
    } catch (e) {
      borderRect.style.strokeDashoffset = '0';
    }
  }

  if (priceEl && digits.length) {
    if (reduceMotion || !hasMotion) {
      setDigitsFinal();
      showAll(chips);
    } else {
      var firedPrice = false;
      var stopPrice = M.inView(priceEl, function () {
        if (firedPrice) return;
        firedPrice = true;

        /* odometer roll — rightmost digit first */
        var count = digits.length;
        digits.forEach(function (d, i) {
          var strip = d.querySelector('.odo-strip');
          var n = parseInt(d.getAttribute('data-digit'), 10) || 0;
          if (!strip) return;
          try {
            M.animate(strip,
              { y: ['0em', -n + 'em'] },
              { type: 'spring', stiffness: 80, damping: 16,
                delay: (count - 1 - i) * 0.09 });
          } catch (e) {
            strip.style.transform = 'translateY(' + (-n) + 'em)';
          }
        });

        /* bloom + drawn border land with the number */
        setTimeout(function () {
          if (bloom) {
            try {
              M.animate(bloom,
                { opacity: [0, 0.9, 0.55], scale: [0.6, 1.12, 1] },
                { duration: 1.4, ease: 'ease-out', easing: 'ease-out' });
            } catch (e) { bloom.style.opacity = '0.5'; }
          }
          drawBorder(true);
        }, 650);

        /* checklist cascade */
        if (chips.length) {
          try {
            M.animate(chips,
              { opacity: [0, 1], scale: [0.85, 1], y: [14, 0] },
              { type: 'spring', stiffness: 160, damping: 19,
                delay: (M.stagger ? M.stagger(0.06, { startDelay: 0.9 }) : 0.9) });
          } catch (e) { showAll(chips); }
        }

        if (typeof stopPrice === 'function') stopPrice();
      }, { amount: 0.55 });
    }
  }

  /* stage dim while pinned (parabolic: dark mid-pin) */
  if (backdrop && pinWrap && !reduceMotion && M && typeof M.scroll === 'function') {
    try {
      M.scroll(function (progress) {
        var p = typeof progress === 'number'
          ? progress
          : (progress && progress.y ? progress.y.progress : 0);
        backdrop.style.opacity = String(Math.max(0, 4 * p * (1 - p) - 0.15));
      }, { target: pinWrap, offset: ['start end', 'end start'] });
    } catch (e) {}
  }

  /* ---------- process thread ---------- */

  var threadLine = document.getElementById('process-thread-line');
  var processSection = document.getElementById('process');
  var steps = toArray(document.querySelectorAll('[data-step]'));

  if (threadLine && processSection) {
    if (reduceMotion || !M || typeof M.scroll !== 'function') {
      steps.forEach(function (s) { s.classList.add('is-lit'); });
    } else {
      var tLen = 0;
      try { tLen = threadLine.getTotalLength(); } catch (e) { tLen = 100; }
      threadLine.style.strokeDasharray = String(tLen);
      threadLine.style.strokeDashoffset = String(tLen);
      try {
        M.scroll(function (progress) {
          var p = typeof progress === 'number'
            ? progress
            : (progress && progress.y ? progress.y.progress : 0);
          threadLine.style.strokeDashoffset = String(tLen * (1 - p));
        }, { target: processSection, offset: ['start 0.75', 'end 0.55'] });
      } catch (e) {
        threadLine.style.strokeDashoffset = '0';
      }

      steps.forEach(function (step) {
        var stopStep = M.inView(step, function () {
          step.classList.add('is-lit');
          try {
            M.animate(toArray(step.querySelectorAll('.step-tag, .step-title, .step-desc')),
              { opacity: [0, 1], y: [18, 0] },
              { duration: 0.7, ease: [0.22, 1, 0.36, 1], easing: [0.22, 1, 0.36, 1],
                delay: (M.stagger ? M.stagger(0.08) : 0) });
          } catch (e) {}
          if (typeof stopStep === 'function') stopStep();
        }, { amount: 0.55 });
      });
    }
  }

  /* ---------- CTA finale ---------- */

  var cta = document.getElementById('cta');
  var ctaPhone = document.getElementById('cta-phone');
  var underline = document.getElementById('cta-underline-line');

  /* split phone digits for the hover wave (visual only) */
  if (ctaPhone && !reduceMotion) {
    ctaPhone.setAttribute('aria-label', 'Call +91 63698 85901');
    var textNode = null;
    for (var i = 0; i < ctaPhone.childNodes.length; i++) {
      if (ctaPhone.childNodes[i].nodeType === 3 && ctaPhone.childNodes[i].textContent.trim()) {
        textNode = ctaPhone.childNodes[i];
        break;
      }
    }
    if (textNode) {
      var frag = document.createDocumentFragment();
      var wrap = document.createElement('span');
      wrap.setAttribute('aria-hidden', 'true');
      textNode.textContent.split('').forEach(function (ch) {
        if (ch === ' ') {
          wrap.appendChild(document.createTextNode(' '));
        } else {
          var s = document.createElement('span');
          s.className = 'digit';
          s.textContent = ch;
          wrap.appendChild(s);
        }
      });
      frag.appendChild(wrap);
      ctaPhone.replaceChild(frag, textNode);
    }
  }

  if (cta) {
    if (reduceMotion) {
      cta.classList.add('is-lit');
      if (underline) underline.style.strokeDashoffset = '0';
    } else if (hasMotion) {
      var uLen = 0;
      if (underline) {
        try { uLen = underline.getTotalLength(); } catch (e) { uLen = 100; }
        underline.style.strokeDasharray = String(uLen);
        underline.style.strokeDashoffset = String(uLen);
      }
      var stopCta = M.inView(cta, function () {
        cta.classList.add('is-lit');
        if (underline && uLen) {
          try {
            M.animate(underline,
              { strokeDashoffset: [uLen, 0] },
              { duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1], easing: [0.22, 1, 0.36, 1] });
          } catch (e) { underline.style.strokeDashoffset = '0'; }
        }
        if (typeof stopCta === 'function') stopCta();
      }, { amount: 0.4 });
    } else {
      cta.classList.add('is-lit');
      if (underline) underline.style.strokeDashoffset = '0';
    }
  }
})();
