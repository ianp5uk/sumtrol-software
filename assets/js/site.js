/*
  site.js - small helper script shared by every page on software.sumtrol.uk.
  Purpose:
  1. Theme: applies the visitor's saved choice (Light / Dark / System) as early
     as possible to avoid a flash of the wrong colours, and wires up the
     three-way switch in the header. "System" removes the override so the
     device's own light/dark setting is followed by the CSS.
  2. Apps menu: opens and closes the Apps drop-down in the header.
  3. About pop-up: header "About" and footer "About and contact" open the
     About text in a pop-up, loaded from about/index.html.
  4. Downloads: marks the download that matches the visitor's device as
     "Recommended for this device". Nothing is hidden; it is only a hint.
  Loaded in <head> without defer so step 1 runs before the page is drawn.
*/
(function () {
  var KEY = 'sumtrol-theme';
  var root = document.documentElement;

  function saved() {
    try { return localStorage.getItem(KEY) || 'system'; } catch (e) { return 'system'; }
  }
  function apply(choice) {
    if (choice === 'light' || choice === 'dark') root.setAttribute('data-theme', choice);
    else root.removeAttribute('data-theme');
  }
  apply(saved());

  function detectOS() {
    var ua = navigator.userAgent || '';
    if (/Android/i.test(ua)) return 'android';
    if (/iPhone|iPad|iPod/i.test(ua)) return 'ios';
    if (/Windows/i.test(ua)) return 'windows';
    if (/Mac OS X|Macintosh/i.test(ua)) return 'mac';
    if (/Linux|X11/i.test(ua)) return 'linux';
    return '';
  }

  document.addEventListener('DOMContentLoaded', function () {
    var buttons = document.querySelectorAll('.theme-switch button');
    function mark(choice) {
      buttons.forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.theme === choice)); });
    }
    mark(saved());
    buttons.forEach(function (b) {
      b.addEventListener('click', function () {
        var choice = b.dataset.theme;
        try { localStorage.setItem(KEY, choice); } catch (e) { /* private mode: still applies for this page */ }
        apply(choice);
        mark(choice);
      });
    });

    // ---- Apps drop-down menu (click/tap to open; Escape or clicking elsewhere closes) ----
    var toggle = document.querySelector('.menu-toggle');
    var list = document.getElementById('apps-menu');
    if (toggle && list) {
      var setOpen = function (open) {
        toggle.setAttribute('aria-expanded', String(open));
        list.hidden = !open;
      };
      toggle.addEventListener('click', function (e) {
        e.stopPropagation();
        setOpen(list.hidden);
        if (!list.hidden) { var first = list.querySelector('a'); if (first) first.focus(); }
      });
      document.addEventListener('click', function (e) { if (!list.hidden && !list.contains(e.target)) setOpen(false); });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && !list.hidden) { setOpen(false); toggle.focus(); }
      });
      list.addEventListener('focusout', function (e) {
        if (e.relatedTarget && !list.contains(e.relatedTarget) && e.relatedTarget !== toggle) setOpen(false);
      });
    }

    // ---- About pop-up ----
    // The words come from the About page itself (the part marked data-about-content),
    // so they only need writing once. If the page can't be loaded (for example when
    // opening files directly from disk) the link simply opens the About page instead.
    var dialog = null;
    function openAbout(href) {
      fetch(href).then(function (r) {
        if (!r.ok) throw new Error(r.status);
        return r.text();
      }).then(function (html) {
        var doc = new DOMParser().parseFromString(html, 'text/html');
        var content = doc.querySelector('[data-about-content]');
        if (!content || typeof HTMLDialogElement === 'undefined') throw new Error('no content');
        if (!dialog) {
          dialog = document.createElement('dialog');
          dialog.className = 'about-dialog';
          dialog.setAttribute('aria-labelledby', 'about-dialog-title');
          dialog.addEventListener('click', function (e) { if (e.target === dialog) dialog.close(); });
          document.body.appendChild(dialog);
        }
        dialog.innerHTML = '<button type="button" class="dialog-close" aria-label="Close">×</button><div class="dialog-body"></div>';
        var body = dialog.querySelector('.dialog-body');
        body.innerHTML = content.innerHTML;
        var h = body.querySelector('h1');
        if (h) h.id = 'about-dialog-title';
        // Links inside the About text were written relative to the About page; fix them for this page.
        body.querySelectorAll('a[href]').forEach(function (a) { a.href = new URL(a.getAttribute('href'), new URL(href, location.href)).href; });
        dialog.querySelector('.dialog-close').addEventListener('click', function () { dialog.close(); });
        dialog.showModal();
      }).catch(function () { location.href = href; });
    }
    document.querySelectorAll('a[data-about]').forEach(function (a) {
      if (a.hasAttribute('aria-current')) return; // already on the About page
      a.addEventListener('click', function (e) {
        if (e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return; // allow "open in new tab"
        e.preventDefault();
        openAbout(a.getAttribute('href'));
      });
    });

    var os = detectOS();
    if (os) {
      document.querySelectorAll('.dl[data-os="' + os + '"]').forEach(function (a) { a.classList.add('recommended'); });
    }
  });
})();
