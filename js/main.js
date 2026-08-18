/**
 * 共通UI制御: ヘッダーshrink / ハンバーガーメニュー開閉 / 現在ページハイライト / tel固定ボタン
 * partials(header/footer)の読み込み完了後に実行する。
 */
(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function insertTelFab() {
    if (document.querySelector('.tel-fab')) return;
    var a = document.createElement('a');
    a.className = 'tel-fab';
    a.href = 'tel:0120123456';
    a.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">' +
      '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>' +
      '</svg><span>電話で相談する</span>';
    document.body.appendChild(a);
  }

  function setActiveNav() {
    var page = document.documentElement.getAttribute('data-page');
    if (!page) return;
    document.querySelectorAll('[data-nav-link]').forEach(function (link) {
      if (link.getAttribute('data-nav-link') === page) {
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  function initHeaderShrink() {
    var header = document.querySelector('.site-header');
    if (!header) return;
    function onScroll() {
      header.classList.toggle('is-scrolled', window.scrollY > 12);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  function initHamburger() {
    var btn = document.querySelector('.hamburger');
    var nav = document.querySelector('.mobile-nav');
    var main = document.querySelector('main');
    var footer = document.querySelector('.site-footer');
    if (!btn || !nav) return;

    var list = nav.querySelector('.mobile-nav__list');
    var lastFocused = null;

    function focusableEls() {
      return nav.querySelectorAll('a, button');
    }

    function open() {
      lastFocused = document.activeElement;
      btn.setAttribute('aria-expanded', 'true');
      nav.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      if (main) main.setAttribute('inert', '');
      if (footer) footer.setAttribute('inert', '');
      if (window.gsap && !reduceMotion) {
        gsap.fromTo(nav, { yPercent: -100 }, { yPercent: 0, duration: 0.5, ease: 'power2.out' });
        if (list) {
          list.classList.add('js-anim');
          gsap.fromTo(list.querySelectorAll('.mobile-nav__item'),
            { opacity: 0, y: 12 },
            { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, delay: 0.15, ease: 'power2.out' });
        }
      } else {
        nav.style.transform = 'none';
      }
      var first = focusableEls()[0];
      if (first) first.focus();
      document.addEventListener('keydown', onKeydown);
    }

    function close() {
      btn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      if (main) main.removeAttribute('inert');
      if (footer) footer.removeAttribute('inert');
      var done = function () { nav.classList.remove('is-open'); };
      if (window.gsap && !reduceMotion) {
        gsap.to(nav, { yPercent: -100, duration: 0.4, ease: 'power2.in', onComplete: function () {
          done();
          gsap.set(nav, { yPercent: 0 });
        } });
      } else {
        done();
      }
      document.removeEventListener('keydown', onKeydown);
      if (lastFocused) lastFocused.focus();
    }

    function onKeydown(e) {
      if (e.key === 'Escape') {
        close();
        return;
      }
      if (e.key === 'Tab') {
        var els = Array.prototype.slice.call(focusableEls());
        if (!els.length) return;
        var firstEl = els[0], lastEl = els[els.length - 1];
        if (e.shiftKey && document.activeElement === firstEl) {
          e.preventDefault(); lastEl.focus();
        } else if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault(); firstEl.focus();
        }
      }
    }

    btn.addEventListener('click', function () {
      var isOpen = btn.getAttribute('aria-expanded') === 'true';
      if (isOpen) close(); else open();
    });

    nav.querySelectorAll('.mobile-nav__link').forEach(function (link) {
      link.addEventListener('click', close);
    });
  }

  function initFilter() {
    var bar = document.querySelector('.filter-bar');
    if (!bar) return;
    var buttons = bar.querySelectorAll('.filter-btn');
    var cards = document.querySelectorAll('[data-category]');
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        buttons.forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
        btn.setAttribute('aria-pressed', 'true');
        var filter = btn.getAttribute('data-filter');
        cards.forEach(function (card) {
          var match = filter === 'all' || card.getAttribute('data-category') === filter;
          card.style.display = match ? '' : 'none';
        });
      });
    });
  }

  document.addEventListener('partials:loaded', function () {
    setActiveNav();
    initHeaderShrink();
    initHamburger();
  });

  document.addEventListener('DOMContentLoaded', function () {
    insertTelFab();
    initFilter();
  });
})();
