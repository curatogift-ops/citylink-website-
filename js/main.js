(function () {
  var root = document.body.getAttribute("data-root") || "./";
  var page = document.body.getAttribute("data-page") || "";
  var year = new Date().getFullYear();

  var links = [
    ["Home", root, "home"],
    ["About", root + "about/", "about"],
    ["Features", root + "features/", "features"],
    ["Explore", root + "explore/", "explore"],
    ["Support", root + "support/", "support"]
  ];

  var header = document.getElementById("site-header");
  if (header) {
    var nav = links.map(function (item) {
      var current = item[2] === page ? ' aria-current="page"' : "";
      return '<a href="' + item[1] + '"' + current + ">" + item[0] + "</a>";
    }).join("");
    header.className = "site-header";
    header.innerHTML =
      '<div class="wrap header-inner">' +
        '<a class="brand" href="' + root + '"><img src="' + root + 'assets/logo.jpeg" alt="City Link logo"><span>CITY LINK</span></a>' +
        '<nav class="nav" aria-label="Primary">' + nav + "</nav>" +
        '<div class="header-actions">' +
          '<a class="btn btn-ghost" href="' + root + 'contact/">Contact Us</a>' +
          '<a class="btn btn-primary" href="' + root + 'download/">Download App</a>' +
        "</div>" +
        '<button class="menu-btn" type="button" aria-expanded="false" aria-controls="primary-nav">Menu</button>' +
      "</div>";
    var menuBtn = header.querySelector(".menu-btn");
    var navEl = header.querySelector(".nav");
    navEl.id = "primary-nav";
    menuBtn.addEventListener("click", function () {
      var open = header.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        header.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
      }
    });
  }

  var footer = document.getElementById("site-footer");
  if (footer) {
    footer.className = "site-footer";
    footer.innerHTML =
      '<div class="wrap footer-grid">' +
        '<div><a class="brand" href="' + root + '"><img src="' + root + 'assets/logo.jpeg" alt="City Link logo"><span>CITY LINK</span></a>' +
        "<p>A connected platform for discovering sports, videos, shows and digital entertainment.</p></div>" +
        "<div><h2>Explore</h2><ul>" +
          "<li><a href=\"" + root + "\">Home</a></li>" +
          "<li><a href=\"" + root + "about/\">About</a></li>" +
          "<li><a href=\"" + root + "features/\">Features</a></li>" +
          "<li><a href=\"" + root + "explore/\">Explore</a></li>" +
          "<li><a href=\"" + root + "download/\">Download App</a></li>" +
        "</ul></div>" +
        "<div><h2>Help</h2><ul>" +
          "<li><a href=\"" + root + "support/\">Support Centre</a></li>" +
          "<li><a href=\"" + root + "contact/\">Contact Us</a></li>" +
          "<li><a href=\"" + root + "faqs/\">FAQs</a></li>" +
          "<li><a href=\"" + root + "account-deletion/\">Account Deletion</a></li>" +
        "</ul></div>" +
        "<div><h2>Legal</h2><ul>" +
          "<li><a href=\"" + root + "privacy-policy/\">Privacy Policy</a></li>" +
          "<li><a href=\"" + root + "terms-and-conditions/\">Terms & Conditions</a></li>" +
          "<li><a href=\"" + root + "community-guidelines/\">Community Guidelines</a></li>" +
          "<li><a href=\"" + root + "copyright-complaints/\">Copyright Complaints</a></li>" +
        "</ul></div>" +
      "</div>" +
      '<div class="wrap legal-line">© ' + year + " City Link. Operated by Sayyad Aawes Sayyad Akram, Chhatrapati Sambhajinagar, Maharashtra, India. <a href=\"mailto:citylinkapp247@gmail.com\">citylinkapp247@gmail.com</a></div>";
  }

  document.querySelectorAll("[data-year]").forEach(function (node) {
    node.textContent = String(year);
  });

  function validEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function showStatus(form, kind, message) {
    var box = form.querySelector(".status");
    if (!box) {
      box = document.createElement("div");
      box.className = "status";
      box.setAttribute("role", "status");
      form.appendChild(box);
    }
    box.className = "status " + kind;
    box.textContent = message;
  }

  document.querySelectorAll("form[data-form]").forEach(function (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      form.querySelectorAll(".field-error").forEach(function (node) { node.remove(); });
      var honeypot = form.querySelector(".hp input");
      if (honeypot && honeypot.value) return;

      var invalid = false;
      form.querySelectorAll("input, select, textarea").forEach(function (field) {
        if (field.classList.contains("hp") || field.closest(".hp")) return;
        var value = String(field.value || "").trim();
        var empty = field.required && (field.type === "checkbox" ? !field.checked : !value);
        var badEmail = field.type === "email" && value && !validEmail(value);
        if (empty || badEmail) {
          invalid = true;
          var note = document.createElement("span");
          note.className = "field-error";
          note.textContent = badEmail ? "Enter a valid email address." : "This field is required.";
          field.parentElement.appendChild(note);
        }
      });
      if (invalid) {
        showStatus(form, "error", "Check the highlighted fields and try again.");
        return;
      }

      var lines = [];
      form.querySelectorAll("input, select, textarea").forEach(function (field) {
        if (!field.name || field.closest(".hp")) return;
        var value = field.type === "checkbox" ? (field.checked ? "Yes" : "No") : String(field.value || "").trim();
        if (value) lines.push(field.name + ": " + value);
      });
      var subjectField = form.querySelector("[name=subject], [name=work], [name=account]");
      var subject = subjectField && subjectField.value
        ? "City Link: " + subjectField.value.trim()
        : "City Link support request";
      window.location.href = "mailto:citylinkapp247@gmail.com?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(lines.join("\n"));
      showStatus(form, "ok", "Your email app should open with this message addressed to citylinkapp247@gmail.com. Send that email to complete the request.");
    });
  });

  var params = new URLSearchParams(window.location.search);
  var topic = params.get("topic");
  var subject = document.querySelector("[name=category]");
  if (topic && subject) subject.value = topic;
})();
