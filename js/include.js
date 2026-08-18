/**
 * 共通ヘッダー/フッターを partials から fetch して注入する。
 * ローカルサーバ経由での配信が前提(file:// では CORS 制限により動作しない)。
 * 注入完了後に 'partials:loaded' イベントを発火し、他スクリプトへ知らせる。
 */
(function () {
  async function injectPartial(selector, path) {
    var slot = document.querySelector(selector);
    if (!slot) return;
    try {
      var res = await fetch(path, { cache: 'no-cache' });
      if (!res.ok) throw new Error('failed to load ' + path);
      var html = await res.text();
      slot.innerHTML = html;
    } catch (err) {
      console.error('[include.js]', err);
    }
  }

  document.addEventListener('DOMContentLoaded', async function () {
    await Promise.all([
      injectPartial('[data-slot="header"]', 'partials/header.html'),
      injectPartial('[data-slot="footer"]', 'partials/footer.html'),
    ]);
    document.dispatchEvent(new CustomEvent('partials:loaded'));
  });
})();
