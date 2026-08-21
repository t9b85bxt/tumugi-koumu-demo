/**
 * GSAP + ScrollTrigger によるモーション演出。
 * prefers-reduced-motion が有効な環境では、演出をすべて無効化し
 * 最終状態を即時表示する(カウントアップの数値・タイムラインの進捗含む)。
 */
(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function setInstantFinalStates() {
    document.querySelectorAll('[data-count]').forEach(function (el) {
      el.textContent = el.getAttribute('data-count');
    });
    var progress = document.querySelector('.timeline__progress');
    if (progress) progress.style.height = '100%';
  }

  function initIconPop() {
    var els = gsap.utils.toArray('.js-icon-pop');
    if (!els.length) return;
    ScrollTrigger.batch(els, {
      start: 'top 88%',
      onEnter: function (batch) {
        gsap.to(batch, {
          opacity: 1,
          scale: 1,
          rotate: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'back.out(1.7)',
          overwrite: true,
        });
      },
      once: true,
    });
  }

  function initScaleIn() {
    var els = gsap.utils.toArray('.js-scale-in');
    if (!els.length) return;
    ScrollTrigger.batch(els, {
      start: 'top 88%',
      onEnter: function (batch) {
        gsap.to(batch, {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          overwrite: true,
        });
      },
      once: true,
    });
  }

  function initBentoStagger() {
    var items = gsap.utils.toArray('.js-bento-in');
    if (!items.length) return;
    ScrollTrigger.batch(items, {
      start: 'top 88%',
      onEnter: function (batch) {
        gsap.to(batch, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          stagger: { each: 0.07, from: 'start', grid: 'auto' },
          ease: 'back.out(1.4)',
          overwrite: true,
        });
      },
      once: true,
    });
  }

  function initHeroParallax() {
    var hero = document.querySelector('.hero');
    var media = hero && hero.querySelector('.hero__media img');
    if (!hero || !media) return;
    gsap.to(media, {
      yPercent: 10,
      ease: 'none',
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
    });
  }

  function initSlideRight() {
    var els = gsap.utils.toArray('.js-slide-right');
    if (!els.length) return;
    ScrollTrigger.batch(els, {
      start: 'top 85%',
      onEnter: function (batch) {
        gsap.to(batch, {
          opacity: 1,
          x: 0,
          duration: 0.55,
          stagger: 0.12,
          ease: 'power2.out',
          overwrite: true,
        });
      },
      once: true,
    });
  }

  function initRevealMedia() {
    var wraps = gsap.utils.toArray('.js-reveal');
    if (!wraps.length) return;
    ScrollTrigger.batch(wraps, {
      start: 'top 85%',
      onEnter: function (batch) {
        batch.forEach(function (wrap, i) {
          var img = wrap.querySelector('img');
          if (!img) return;
          gsap.to(img, {
            clipPath: 'inset(0 0% 0 0)',
            duration: 0.9,
            delay: i * 0.1,
            ease: 'power3.out',
            overwrite: true,
          });
        });
      },
      once: true,
    });
  }

  function initHero() {
    var hero = document.querySelector('.hero');
    if (!hero) return;
    var tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
    ['.hero__eyebrow', '.hero__title', '.hero__lead', '.hero-badges', '.hero__cta'].forEach(function (sel, i) {
      var el = hero.querySelector(sel);
      if (!el) return;
      tl.from(el, { opacity: 0, y: 22, duration: 0.7 }, i === 0 ? 0.15 : '-=0.45');
    });
  }

  function initFadeUp() {
    var batch = gsap.utils.toArray('.js-fade-up, .js-fade');
    if (!batch.length) return;
    ScrollTrigger.batch(batch, {
      start: 'top 88%',
      onEnter: function (els) {
        gsap.to(els, {
          opacity: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.08,
          ease: 'power2.out',
          overwrite: true,
        });
      },
      once: true,
    });
  }

  function initHeaderIntersectionSafety() {
    // アニメーション対象要素は CSS で初期非表示状態のため、
    // ScrollTrigger が個別要素で発火し損ねた(スクリプトエラー等)場合に
    // 永久に隠れたままにならないよう救済する。
    // ただし「まだ画面外でスクロールしていないだけ」の要素まで強制表示すると
    // スクロール演出が意味をなさなくなるため、画面内に入っている要素だけを対象にする。
    var selector = '.js-fade-up, .js-fade, .js-icon-pop, .js-scale-in, .js-slide-right, .js-bento-in';
    var ticking = false;
    function rescue() {
      ticking = false;
      document.querySelectorAll(selector).forEach(function (el) {
        var st = window.getComputedStyle(el);
        if (st.opacity !== '0') return;
        var rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.style.opacity = '1';
          el.style.transform = 'none';
        }
      });
      document.querySelectorAll('.js-reveal img').forEach(function (img) {
        if (img.style.clipPath === 'inset(0px)') return;
        var rect = img.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          img.style.clipPath = 'inset(0)';
        }
      });
    }
    function onScrollOrResize() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(rescue);
    }
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize);
    setTimeout(rescue, 3000);
  }

  function initCounters() {
    document.querySelectorAll('[data-count]').forEach(function (el) {
      var target = parseFloat(el.getAttribute('data-count'));
      var suffix = el.getAttribute('data-suffix') || '';
      var numEl = el.closest('.stat__num');
      var obj = { val: 0 };
      ScrollTrigger.create({
        trigger: el,
        start: 'top 90%',
        once: true,
        onEnter: function () {
          if (numEl) {
            gsap.fromTo(numEl, { scale: 0.8 }, { scale: 1, duration: 0.5, ease: 'back.out(2.5)' });
          }
          gsap.to(obj, {
            val: target,
            duration: 1.6,
            ease: 'power1.out',
            onUpdate: function () {
              var v = target % 1 === 0 ? Math.round(obj.val) : obj.val.toFixed(1);
              el.textContent = v + suffix;
            },
          });
        },
      });
    });
  }

  function initTimelineScrub() {
    var wrap = document.querySelector('.timeline');
    var progress = document.querySelector('.timeline__progress');
    if (!wrap || !progress) return;
    var items = wrap.querySelectorAll('.timeline__item');
    ScrollTrigger.create({
      trigger: wrap,
      start: 'top 70%',
      end: 'bottom 60%',
      scrub: 0.6,
      onUpdate: function (self) {
        progress.style.height = (self.progress * 100) + '%';
      },
    });
    items.forEach(function (item) {
      ScrollTrigger.create({
        trigger: item,
        start: 'top 65%',
        onEnter: function () { item.classList.add('is-active'); },
      });
    });
  }

  function initCompareSliders() {
    document.querySelectorAll('.compare').forEach(function (compare) {
      var after = compare.querySelector('.compare__after');
      var line = compare.querySelector('.compare__line');
      var handle = compare.querySelector('.compare__handle');
      if (!after || !handle) return;
      function update(val) {
        after.style.clipPath = 'inset(0 0 0 ' + val + '%)';
        if (line) line.style.left = val + '%';
      }
      handle.addEventListener('input', function () { update(handle.value); });
      update(handle.value || 50);
    });
  }

  function boot() {
    if (typeof gsap === 'undefined') return;
    if (!reduceMotion && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    initCompareSliders();

    if (reduceMotion) {
      setInstantFinalStates();
      return;
    }

    initHero();
    initHeroParallax();
    initFadeUp();
    initBentoStagger();
    initIconPop();
    initScaleIn();
    initSlideRight();
    initRevealMedia();
    initHeaderIntersectionSafety();
    initCounters();
    initTimelineScrub();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
