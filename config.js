/* =========================================================================
   Site configuration. Values used across the page in one place.
   ========================================================================= */

const SITE = {
  /* Commercial product name. */
  BRAND: "Oxpull",

  /* Open source package name, as installed with pip. */
  PACKAGE: "django-ox",

  /* Where the waitlist form posts. */
  FORM_ENDPOINT: "https://formspree.io/f/mvkpbwwn",
};

/* ====================== plumbing, no config below ====================== */

(function () {
  "use strict";

  function applyBrand() {
    document.querySelectorAll("[data-brand]").forEach(function (el) {
      el.textContent = SITE.BRAND;
    });
    document.querySelectorAll("[data-package]").forEach(function (el) {
      el.textContent = SITE.PACKAGE;
    });
    document.title = document.title.split("[BRAND]").join(SITE.BRAND);
  }

  function wireForm() {
    var form = document.getElementById("waitlist-form");
    if (!form) return;
    var button = form.querySelector("button[type=submit]");
    var errorBox = document.getElementById("form-error");

    /* Native fallback: with JS on but fetch failing, or JS off entirely
       once the attribute is in the HTML, the form still posts here. */
    if (SITE.FORM_ENDPOINT) form.setAttribute("action", SITE.FORM_ENDPOINT);

    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      errorBox.hidden = true;

      /* No endpoint configured: local preview mode. */
      if (!SITE.FORM_ENDPOINT) {
        window.location.href = "thanks.html";
        return;
      }

      button.disabled = true;
      button.textContent = "Joining…";

      fetch(SITE.FORM_ENDPOINT, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      })
        .then(function (res) {
          if (res.ok) {
            window.location.href = "thanks.html";
          } else {
            throw new Error("HTTP " + res.status);
          }
        })
        .catch(function () {
          button.disabled = false;
          button.textContent = "Join the waitlist";
          errorBox.hidden = false;
        });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      applyBrand();
      wireForm();
    });
  } else {
    applyBrand();
    wireForm();
  }
})();
