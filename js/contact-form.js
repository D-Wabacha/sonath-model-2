// Sonath — contact form handling
//
// This site is static (no backend), so the contact form doesn't submit
// anywhere directly. Instead, on submit it builds a mailto: link from
// the entered fields and opens the visitor's email client with the
// message pre-filled, addressed to sonathsolutions@gmail.com.

document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('contactForm');
  var status = document.getElementById('formStatus');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var name = form.querySelector('#name').value.trim();
    var email = form.querySelector('#email').value.trim();
    var message = form.querySelector('#message').value.trim();

    var subject = 'New project inquiry from ' + name;
    var body =
      'Name: ' + name + '\n' +
      'Email: ' + email + '\n\n' +
      message;

    var mailtoLink =
      'mailto:sonathsolutions@gmail.com' +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(body);

    window.location.href = mailtoLink;

    if (status) {
      status.textContent = 'Opening your email app…';
      status.classList.add('is-visible');
    }
  });
});
