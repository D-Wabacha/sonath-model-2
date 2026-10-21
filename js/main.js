// Sonath — site scripts

document.addEventListener('DOMContentLoaded', function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------------------------------------------------------
  // Mobile navigation toggle
  // Shows/hides the #mobileMenu panel when the hamburger button (#navToggle)
  // is clicked, and closes it again when a link inside is tapped or Escape is pressed.
  // ---------------------------------------------------------
  var toggle = document.getElementById('navToggle');
  var menu = document.getElementById('mobileMenu');

  if (toggle && menu) {
    var setOpen = function (isOpen) {
      menu.classList.toggle('is-open', isOpen);
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      toggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    };

    toggle.addEventListener('click', function () {
      setOpen(!menu.classList.contains('is-open'));
    });

    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        setOpen(false);
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) {
        setOpen(false);
        toggle.focus();
      }
    });
  }

  // ---------------------------------------------------------
  // Floating WhatsApp button
  // Added to every page except contact (which lists WhatsApp already).
  // It slides in once the visitor has scrolled past the first screen.
  // ---------------------------------------------------------
  if (!document.body.hasAttribute('data-no-wa')) {
    var wa = document.createElement('a');
    wa.className = 'wa-float';
    wa.href = 'https://wa.me/254768426579?text=' + encodeURIComponent("Hi Sonath, I'd like to talk about a project.");
    wa.target = '_blank';
    wa.rel = 'noopener';
    wa.setAttribute('aria-label', 'Chat with Sonath on WhatsApp');
    wa.innerHTML =
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2.5a9.5 9.5 0 0 0-8.2 14.3L2.5 21.5l4.8-1.3A9.5 9.5 0 1 0 12 2.5zm0 1.8a7.7 7.7 0 1 1-3.9 14.3l-.3-.2-2.8.8.8-2.7-.2-.3A7.7 7.7 0 0 1 12 4.3zm-3.1 3.9c-.2 0-.5 0-.7.3-.3.3-1 .9-1 2.3s1 2.7 1.2 2.9c.1.2 2 3.1 4.9 4.3 2.4.9 2.9.8 3.4.7.5-.1 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4l-.5-.3-1.8-.9c-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.3 6.3 0 0 1-3.1-2.7c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.5l-.8-2c-.2-.5-.4-.4-.6-.4h-.5z"/></svg>' +
      '<span>WhatsApp<span class="wa-text-long"> us</span></span>';
    document.body.appendChild(wa);

    var onScroll = function () {
      wa.classList.toggle('is-shown', window.scrollY > Math.min(500, window.innerHeight * 0.6));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ---------------------------------------------------------
  // Demo switcher (home page)
  // Without JavaScript every demo is shown, one under the other.
  // With it, the tabs appear and show one demo at a time.
  // Arrow keys move between tabs, as screen reader users expect.
  // ---------------------------------------------------------
  document.querySelectorAll('.switch-tabs').forEach(function (tablist) {
    var tabs = Array.prototype.slice.call(tablist.querySelectorAll('[role="tab"]'));
    if (!tabs.length) return;

    function select(tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        var panel = document.getElementById(t.getAttribute('aria-controls'));
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        if (panel) {
          panel.hidden = !on;
          panel.classList.toggle('is-entering', on);
        }
      });
      if (focus) tab.focus();
    }

    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { select(tab); });
      tab.addEventListener('keydown', function (e) {
        var next = null;
        if (e.key === 'ArrowRight') next = tabs[(i + 1) % tabs.length];
        if (e.key === 'ArrowLeft') next = tabs[(i - 1 + tabs.length) % tabs.length];
        if (e.key === 'Home') next = tabs[0];
        if (e.key === 'End') next = tabs[tabs.length - 1];
        if (next) {
          e.preventDefault();
          select(next, true);
        }
      });
    });

    tablist.hidden = false;
    select(tabs[0]);
  });

  if (reduceMotion || !('IntersectionObserver' in window)) return;

  // ---------------------------------------------------------
  // Scroll reveal
  // Blocks below the first screen fade up as they come into view.
  // Anything already on screen when the page loads is left alone,
  // so nothing flickers.
  // ---------------------------------------------------------
  var revealTargets = document.querySelectorAll(
    '.section .section-head, .expect, .case, .services-3, .service, .stage, .pkgs, .offers, ' +
    '.kits, .tiers, .guides, .pain, .feature-split, .plan, .people, .gallery, .gallery-phone, .faq-grid, .cta-grid'
  );
  var revealer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        revealer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px' });

  revealTargets.forEach(function (el) {
    if (el.getBoundingClientRect().top > window.innerHeight) {
      el.classList.add('reveal');
      revealer.observe(el);
    }
  });

  // ---------------------------------------------------------
  // Example dashboards
  // The bar chart grows in when a dashboard first comes into view.
  // A dashboard marked data-live also receives a new example order
  // every few seconds while it is on screen.
  // ---------------------------------------------------------
  var customers = [
    ['Mwangi Construction', 7, '52,300', 'ok', 'Paid, M-Pesa'],
    ['Akinyi Fittings', 3, '9,800', 'warn', 'Pending'],
    ['Kiprop Builders', 15, '121,400', 'ok', 'Paid, bank'],
    ['Chebet Paints', 5, '14,650', 'ok', 'Paid, M-Pesa'],
    ['Mutua Hardware', 8, '38,900', 'warn', 'Pending'],
    ['Wekesa Timber', 11, '67,200', 'ok', 'Paid, M-Pesa']
  ];

  function startLive(ui) {
    var table = ui.querySelector('.ui-table');
    var kpi = ui.querySelector('.ui-kpi b');
    var today = ui.querySelector('.ui-chart .today');
    var total = ui.querySelector('.ui-chart').parentNode.querySelector('.ui-h small');
    if (!table || !kpi || !today) return;

    var orderNo = 1048;
    var count = 128;
    var todayCount = parseInt(today.getAttribute('data-v'), 10) || 0;
    var i = 0;

    function addOrder() {
      if (document.hidden || !ui.classList.contains('is-visible')) return;
      var c = customers[i++ % customers.length];
      orderNo += 1;
      count += 1;
      todayCount += 1;

      var row = document.createElement('tr');
      row.className = 'is-new';
      row.innerHTML =
        '<td>#' + orderNo + '</td><td>' + c[0] + '</td><td>' + c[1] + '</td>' +
        '<td class="num">' + c[2] + '</td><td><span class="pill ' + c[3] + '">' + c[4] + '</span></td>' +
        '<td><span class="pill grey">New</span></td>';
      var rows = table.querySelectorAll('tr');
      rows[0].parentNode.insertBefore(row, rows[1]);
      rows[rows.length - 1].remove();

      kpi.textContent = count;
      kpi.classList.remove('tick');
      void kpi.offsetWidth;
      kpi.classList.add('tick');

      today.setAttribute('data-v', todayCount);
      today.style.height = Math.min(100, Math.round(todayCount / 27 * 100)) + '%';
      if (total) total.textContent = count + ' total';
    }

    // Stop after a while so the example does not drift too far from the text around it.
    var timer = setInterval(function () {
      addOrder();
      if (orderNo >= 1060) clearInterval(timer);
    }, 3800);
  }

  var dashWatcher = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      var ui = entry.target;
      ui.classList.toggle('is-visible', entry.isIntersecting);
      if (entry.isIntersecting && !ui.classList.contains('is-live')) {
        ui.classList.add('is-live');
        if (ui.hasAttribute('data-live')) startLive(ui);
      }
    });
  }, { threshold: 0.35 });

  document.querySelectorAll('.ui').forEach(function (ui) {
    if (ui.getBoundingClientRect().top > window.innerHeight * 0.8) ui.classList.add('is-armed');
    dashWatcher.observe(ui);
  });
});
