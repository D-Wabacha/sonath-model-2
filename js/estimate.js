// Sonath — price estimator (pricing.html#estimate)
//
// The visitor picks what they need and sees a price range and timeline.
// The result can be sent on WhatsApp, or carried into the contact form.
//
// Every figure below is an estimate. To change a price, change it here
// and in the matching card on pricing.html.

document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('estimator');
  if (!form) return;

  var WHATSAPP = '254768426579';

  // Website packages: price, weeks [from, to], pages included, add-ons included
  var PACKAGES = {
    launch:   { name: 'Launch page',    price: 25000,  weeks: [1, 2], pages: 1, includes: [] },
    business: { name: 'Business site',  price: 60000,  weeks: [2, 4], pages: 6, includes: [] },
    bookings: { name: 'Bookings site',  price: 150000, weeks: [4, 6], pages: 8, includes: ['booking'] }
  };
  var PAGE_PRICE = 5000;

  // Website add-ons: price, extra weeks
  var SITE_EXTRAS = {
    booking: { name: 'Booking or reservation requests', price: 35000, weeks: 1 },
    mpesa:   { name: 'M-Pesa payments on the site',     price: 45000, weeks: 1 },
    shop:    { name: 'Product catalogue or small shop', price: 60000, weeks: 1.5 },
    blog:    { name: 'News or blog you update yourself', price: 25000, weeks: 0.5 },
    swahili: { name: 'Swahili version of every page',   price: 20000, weeks: 0.5 },
    copy:    { name: 'We write the text for you',       price: 15000, weeks: 0.5 },
    brand:   { name: 'Logo and brand basics',           price: 25000, weeks: 1 },
    google:  { name: 'Google Business Profile set-up',  price: 5000,  weeks: 0 }
  };

  // Business system: a base for design, logins, hosting and training, plus modules
  var SYSTEM_BASE = { name: 'System set-up, logins, hosting and training', price: 120000 };
  var SYSTEM_MIN = 350000;
  var MODULES = {
    orders:    { name: 'Orders and sales',               price: 120000 },
    stock:     { name: 'Stock and inventory',            price: 100000 },
    invoices:  { name: 'Invoices and statements',        price: 80000 },
    bookings:  { name: 'Bookings and scheduling',        price: 100000 },
    fees:      { name: 'Student records and fees',       price: 130000 },
    customers: { name: 'Customer records',               price: 60000 },
    mpesa:     { name: 'M-Pesa payments and matching',   price: 70000 },
    alerts:    { name: 'SMS or WhatsApp alerts',         price: 40000 },
    reports:   { name: 'Reports and exports',            price: 50000 },
    import:    { name: 'Import from your spreadsheets',  price: 30000 }
  };
  var TEAM = {
    small:  { name: '1 to 5 staff',   factor: 1 },
    medium: { name: '6 to 20 staff',  factor: 1.15 },
    large:  { name: 'More than 20 staff', factor: 1.3 }
  };

  var CARE = {
    none:     { name: 'No care plan',  price: 0 },
    basic:    { name: 'Basic care',    price: 3000 },
    standard: { name: 'Standard care', price: 8000 },
    priority: { name: 'Priority care', price: 15000 }
  };

  // ---------- elements ----------
  var el = {
    siteFields: form.querySelectorAll('[data-for="site"]'),
    systemFields: form.querySelectorAll('[data-for="system"]'),
    pages: document.getElementById('estPages'),
    pagesMinus: document.getElementById('estPagesMinus'),
    pagesPlus: document.getElementById('estPagesPlus'),
    total: document.getElementById('estTotal'),
    weeks: document.getElementById('estWeeks'),
    monthly: document.getElementById('estMonthly'),
    lines: document.getElementById('estLines'),
    wa: document.getElementById('estWhatsApp'),
    contact: document.getElementById('estContact'),
    peek: document.getElementById('estPeek')
  };
  var extraPages = 0;

  function checked(name) {
    var input = form.querySelector('input[name="' + name + '"]:checked');
    return input ? input.value : null;
  }
  function checkedAll(name) {
    return Array.prototype.map.call(form.querySelectorAll('input[name="' + name + '"]:checked'), function (i) { return i.value; });
  }
  function kes(n) {
    return 'KES ' + n.toLocaleString('en-KE');
  }
  function round(n) {
    return Math.round(n / 5000) * 5000;
  }
  function weeksText(a, b) {
    a = Math.max(1, Math.round(a));
    b = Math.max(a, Math.round(b));
    return a === b ? a + (a === 1 ? ' week' : ' weeks') : a + ' to ' + b + ' weeks';
  }

  // ---------- pre-select from the link, e.g. pricing.html?pkg=bookings&add=mpesa#estimate ----------
  var params = new URLSearchParams(window.location.search);
  if (params.get('kind')) {
    var kindInput = form.querySelector('input[name="kind"][value="' + params.get('kind') + '"]');
    if (kindInput) kindInput.checked = true;
  }
  if (params.get('pkg') && PACKAGES[params.get('pkg')]) {
    form.querySelector('input[name="pkg"][value="' + params.get('pkg') + '"]').checked = true;
    if (!params.get('kind')) form.querySelector('input[name="kind"][value="site"]').checked = true;
  }
  (params.get('add') || '').split(',').forEach(function (key) {
    var box = form.querySelector('input[name="extra"][value="' + key + '"], input[name="module"][value="' + key + '"]');
    if (box) box.checked = true;
  });

  // ---------- calculate ----------
  function update() {
    var kind = checked('kind');
    var wantSite = kind === 'site' || kind === 'both';
    var wantSystem = kind === 'system' || kind === 'both';

    el.siteFields.forEach(function (f) { f.hidden = !wantSite; });
    el.systemFields.forEach(function (f) { f.hidden = !wantSystem; });

    var lines = [];
    var total = 0;
    var weeksLo = 0;
    var weeksHi = 0;

    if (wantSite) {
      var pkg = PACKAGES[checked('pkg')];
      total += pkg.price;
      weeksLo = pkg.weeks[0];
      weeksHi = pkg.weeks[1];
      lines.push([pkg.name + ' (' + pkg.pages + (pkg.pages === 1 ? ' page)' : ' pages)'), pkg.price]);

      // Add-ons a package already includes are ticked and locked
      form.querySelectorAll('input[name="extra"]').forEach(function (box) {
        var included = pkg.includes.indexOf(box.value) !== -1;
        box.disabled = included;
        if (included) {
          box.checked = true;
          box.setAttribute('data-auto', '');
        } else if (box.hasAttribute('data-auto')) {
          // Was only ticked because the previous package included it
          box.checked = false;
          box.removeAttribute('data-auto');
        }
        var tag = box.parentNode.querySelector('.incl');
        if (tag) tag.hidden = !included;
      });

      if (extraPages > 0) {
        total += extraPages * PAGE_PRICE;
        weeksHi += extraPages > 4 ? 1 : 0;
        lines.push([extraPages + ' extra page' + (extraPages === 1 ? '' : 's'), extraPages * PAGE_PRICE]);
      }

      checkedAll('extra').forEach(function (key) {
        if (pkg.includes.indexOf(key) !== -1) return;
        var x = SITE_EXTRAS[key];
        total += x.price;
        weeksLo += x.weeks / 2;
        weeksHi += x.weeks;
        lines.push([x.name, x.price]);
      });
    }

    if (wantSystem) {
      var team = TEAM[checked('team')];
      var modules = checkedAll('module');
      var system = SYSTEM_BASE.price;
      var systemLines = [[SYSTEM_BASE.name, SYSTEM_BASE.price]];
      modules.forEach(function (key) {
        system += MODULES[key].price;
        systemLines.push([MODULES[key].name, MODULES[key].price]);
      });
      if (team.factor > 1) {
        var extra = round(system * (team.factor - 1));
        systemLines.push(['Larger team (' + team.name + ')', extra]);
        system += extra;
      }
      if (system < SYSTEM_MIN) {
        systemLines.push(['Minimum for a business system', SYSTEM_MIN - system]);
        system = SYSTEM_MIN;
      }
      total += system;
      lines = lines.concat(systemLines);

      var sysLo = 5 + modules.length * 0.8;
      var sysHi = sysLo + 3 + modules.length * 0.4;
      // A website alongside a system is built partly in parallel
      weeksLo = wantSite ? sysLo + 1 : sysLo;
      weeksHi = wantSite ? sysHi + 2 : sysHi;
    }

    var low = round(total);
    var high = round(total * 1.25);
    var care = CARE[checked('care')];

    el.total.textContent = kes(low) + ' to ' + high.toLocaleString('en-KE');
    if (el.peek) el.peek.textContent = el.total.textContent;
    el.total.classList.remove('bump');
    void el.total.offsetWidth;
    el.total.classList.add('bump');
    el.weeks.textContent = weeksText(weeksLo, weeksHi);
    el.monthly.textContent = care.price ? kes(care.price) + ' a month' : 'None';

    el.lines.textContent = '';
    lines.forEach(function (line) {
      var li = document.createElement('li');
      var a = document.createElement('span');
      var b = document.createElement('span');
      a.textContent = line[0];
      b.textContent = line[1].toLocaleString('en-KE');
      li.appendChild(a);
      li.appendChild(b);
      el.lines.appendChild(li);
    });

    // Plain-text summary for WhatsApp and the contact form
    var text = ['Hi Sonath, I used the price estimator on your site.', ''];
    lines.forEach(function (line) { text.push('- ' + line[0]); });
    text.push('', 'Estimate: ' + kes(low) + ' to ' + high.toLocaleString('en-KE'));
    text.push('Timeline: ' + weeksText(weeksLo, weeksHi));
    if (care.price) text.push('Care plan: ' + care.name + ' (' + kes(care.price) + ' a month)');
    text.push('', 'About my business: ');
    var summary = text.join('\n');

    el.wa.href = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(summary);
    var need = kind === 'site' ? 'A website' : 'A business system';
    el.contact.href = 'contact.html?need=' + encodeURIComponent(need) + '&estimate=' + encodeURIComponent(summary);
  }

  // ---------- extra pages stepper ----------
  function setPages(n) {
    extraPages = Math.max(0, Math.min(30, n));
    el.pages.value = extraPages;
    el.pages.textContent = extraPages;
    el.pagesMinus.disabled = extraPages === 0;
    update();
  }
  el.pagesMinus.addEventListener('click', function () { setPages(extraPages - 1); });
  el.pagesPlus.addEventListener('click', function () { setPages(extraPages + 1); });

  // On phones a small bar shows the running total while the form is on screen.
  // The floating WhatsApp button steps aside so the two do not overlap.
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      document.body.classList.toggle('est-active', entries[0].isIntersecting);
    }).observe(form);
  }

  form.addEventListener('change', update);
  form.addEventListener('submit', function (e) { e.preventDefault(); });
  setPages(0);
});
