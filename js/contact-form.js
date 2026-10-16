// Sonath — contact form handling
//
// The form on contact.html is a Netlify form (data-netlify="true"), so
// submissions are collected by Netlify and show up in the site dashboard
// under Forms. This script sends the form in the background so the visitor
// stays on the page and sees a confirmation.
//
// If sending fails for any reason (offline, form detection switched off in
// Netlify, page opened from a local file), nothing is lost: the visitor is
// shown their message as ready-made email and WhatsApp links instead.

document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('contactForm');
  var status = document.getElementById('formStatus');
  var button = document.getElementById('formSubmit');
  if (!form || !status || !button) return;

  var EMAIL = 'sonathsolutions@gmail.com';
  var WHATSAPP = '254768426579';

  // Arriving from the price estimator (pricing.html): carry the estimate
  // into the form so the visitor only has to add their details.
  var params = new URLSearchParams(window.location.search);
  var need = form.querySelector('#need');
  var message = form.querySelector('#message');
  if (params.get('need') && need) {
    Array.prototype.forEach.call(need.options, function (option) {
      if (option.text === params.get('need')) need.value = option.value;
    });
  }
  if (params.get('estimate') && message) {
    message.value = params.get('estimate');
  }

  function value(id) {
    var el = form.querySelector('#' + id);
    return el ? el.value.trim() : '';
  }

  // Plain-text version of the enquiry, used by the fallback links.
  function summary() {
    var lines = ['Name: ' + value('name'), 'Email: ' + value('email')];
    if (value('phone')) lines.push('Phone: ' + value('phone'));
    lines.push('Need: ' + value('need'));
    if (value('budget')) lines.push('Budget: ' + value('budget'));
    lines.push('', value('message'));
    return lines.join('\n');
  }

  function show(kind, nodes) {
    status.className = 'form-status ' + (kind === 'ok' ? 'is-ok' : 'is-error');
    status.textContent = '';
    nodes.forEach(function (node) {
      status.appendChild(typeof node === 'string' ? document.createTextNode(node) : node);
    });
  }

  function link(text, href) {
    var a = document.createElement('a');
    a.className = 'link';
    a.href = href;
    a.textContent = text;
    if (href.indexOf('http') === 0) {
      a.target = '_blank';
      a.rel = 'noopener';
    }
    return a;
  }

  function showFallback() {
    var body = summary();
    var mailto = 'mailto:' + EMAIL +
      '?subject=' + encodeURIComponent('Project enquiry from ' + value('name')) +
      '&body=' + encodeURIComponent(body);
    var whatsapp = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(body);
    show('error', [
      'Sorry, the form could not be sent. Your message is still here. Send it by ',
      link('email', mailto),
      ' or ',
      link('WhatsApp', whatsapp),
      ' instead.'
    ]);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    button.disabled = true;
    button.textContent = 'Sending…';

    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(new FormData(form)).toString()
    })
      .then(function (response) {
        if (!response.ok) throw new Error('Form post failed: ' + response.status);
        form.reset();
        show('ok', ['Thank you. Your message has been sent, and we will reply within one working day.']);
      })
      .catch(showFallback)
      .then(function () {
        button.disabled = false;
        button.textContent = 'Send message';
      });
  });
});
