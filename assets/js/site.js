/*
  site.js - small helper script shared by every page on software.sumtrol.uk.
  Purpose:
  1. Theme: applies the visitor's saved choice (Light / Dark / System) as early
     as possible to avoid a flash of the wrong colours, and wires up the
     three-way switch in the header. "System" removes the override so the
     device's own light/dark setting is followed by the CSS.
  2. Downloads: marks the download that matches the visitor's device as
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

    var os = detectOS();
    if (os) {
      document.querySelectorAll('.dl[data-os="' + os + '"]').forEach(function (a) { a.classList.add('recommended'); });
    }
  });
})();
