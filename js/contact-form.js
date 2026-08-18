/**
 * お問合せフォームのダミー送信処理。
 * 実バックエンドへの送信は行わず、クライアント側バリデーション後に
 * 完了メッセージを表示する。
 */
(function () {
  var form = document.querySelector('#contact-form');
  if (!form) return;

  var submitBtn = form.querySelector('[type="submit"]');
  var successBox = document.querySelector('#form-success');

  function showError(field, message) {
    field.setAttribute('aria-invalid', 'true');
    var err = document.querySelector('#' + field.id + '-error');
    if (err) {
      err.textContent = message;
      err.classList.add('is-visible');
    }
  }

  function clearError(field) {
    field.removeAttribute('aria-invalid');
    var err = document.querySelector('#' + field.id + '-error');
    if (err) {
      err.textContent = '';
      err.classList.remove('is-visible');
    }
  }

  function isValidEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var requiredFields = form.querySelectorAll('[required]');
    var firstInvalid = null;

    requiredFields.forEach(function (field) {
      clearError(field);
      var value = (field.value || '').trim();
      var valid = true;

      if (field.type === 'checkbox') {
        valid = field.checked;
      } else if (value === '') {
        valid = false;
      } else if (field.type === 'email' && !isValidEmail(value)) {
        valid = false;
      }

      if (!valid) {
        showError(field, field.type === 'email' ? '正しいメールアドレスを入力してください' : '必須項目です');
        if (!firstInvalid) firstInvalid = field;
      }
    });

    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = '送信中…';

    // 実際の送信は行わないダミー処理
    setTimeout(function () {
      form.classList.add('is-hidden');
      form.style.display = 'none';
      if (successBox) {
        successBox.classList.add('is-visible');
        successBox.focus();
      }
    }, 700);
  });
})();
