/**
 * ページ遷移フェードトランジション。
 * - 対象は同一オリジンの内部ページ遷移リンクのみ(tel:/mailto:/target=_blank/
 *   download/外部オリジン/修飾キー付きクリックは通常のブラウザ挙動に任せる)
 * - オーバーレイはCSSデフォルトで非表示。JS初期化に成功した場合のみ
 *   html要素に .js-enabled を付与して動作させる(JS失敗時のフェイルセーフ)
 * - bfcache復元時(pageshow, persisted)はオーバーレイを即座にリセット
 */
(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var overlay = document.querySelector('.page-transition-overlay');
  if (!overlay) return;

  document.documentElement.classList.add('js-enabled');

  function isInternalNavigable(link) {
    if (!link) return false;
    if (link.hasAttribute('download')) return false;
    if (link.target && link.target !== '' && link.target !== '_self') return false;
    var href = link.getAttribute('href');
    if (!href || href.startsWith('#')) return false;
    if (/^(tel:|mailto:|javascript:)/i.test(href)) return false;
    try {
      var url = new URL(href, window.location.href);
      if (url.origin !== window.location.origin) return false;
    } catch (e) {
      return false;
    }
    return true;
  }

  function fadeOutAndNavigate(url) {
    if (reduceMotion) {
      window.location.href = url;
      return;
    }
    overlay.classList.add('is-active');
    var navigated = false;
    var go = function () {
      if (navigated) return;
      navigated = true;
      window.location.href = url;
    };
    overlay.addEventListener('transitionend', go, { once: true });
    // フェイルセーフ: transitionend が発火しない場合に備えたタイムアウト遷移
    setTimeout(go, 500);
  }

  document.body.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var link = e.target.closest('a[href]');
    if (!isInternalNavigable(link)) return;
    var href = link.getAttribute('href');
    e.preventDefault();
    fadeOutAndNavigate(href);
  });

  // ページ読み込み時(通常ロード・リロード・bfcache復元のいずれでも)は
  // オーバーレイを演出なしで即座に非表示状態へ揃える。
  // 「戻る/進むボタン後」や「リロード時」に一瞬暗転してから表示される
  // 挙動を避けるため、読み込み後にフェードインさせる演出はあえて行わない。
  // フェード演出は 内部リンククリックで離脱する瞬間(fadeOutAndNavigate)のみに限定する。
  window.addEventListener('pageshow', function () {
    overlay.classList.remove('is-active', 'is-entering');
  });
})();
