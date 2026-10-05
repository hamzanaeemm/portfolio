/* Dr. Irum Naz — shared header, footer and interactions.
   Navigation is defined once here and rendered on every page. */
(function () {
  "use strict";

  document.documentElement.classList.remove("no-js");
  document.documentElement.classList.add("js");

  var NAV = [
    { title: "Home", href: "index.html" },
    {
      title: "About Me", href: "about-me.html",
      children: [
        { title: "A Life of Learning", href: "a-life-of-learning.html" },
        {
          title: "The Journey So Far", href: "the-journey-so-far.html",
          children: [
            { title: "Building Foundation", href: "building-foundation.html" },
            { title: "The Educator", href: "the-educator.html" },
            { title: "Research & Innovation", href: "research-innovation.html" },
            { title: "Leadership & Service", href: "journey-leadership-service.html" },
            { title: "Scholarship & Global Engagement", href: "scholarship-global-engagement.html" },
            { title: "Continuing the Journey", href: "continuing-the-journey.html" }
          ]
        },
        { title: "Professional Highlights", href: "professional-highlights.html" }
      ]
    },
    { title: "Research", href: "research.html" },
    { title: "Teaching & Innovation", href: "teaching-innovation.html" },
    { title: "Leadership & Service", href: "leadership-service.html" },
    { title: "Mentor", href: "mentor.html" },
    { title: "Life & Reflections", href: "life-reflections.html" },
    { title: "Projects", href: "projects.html" },
    { title: "Contact", href: "contact.html" }
  ];

  var ORCID_URL = "https://orcid.org/0009-0002-7577-8960";

  var ICON = {
    chev: '<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>',
    up: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m18 15-6-6-6 6"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
    play: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.14v13.72a1 1 0 0 0 1.5.86l11.04-6.86a1 1 0 0 0 0-1.72L9.5 4.28A1 1 0 0 0 8 5.14Z"/></svg>'
  };

  var current = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  if (current === "") current = "index.html";

  function isCurrent(item) { return item.href.toLowerCase() === current; }
  function containsCurrent(item) {
    return (item.children || []).some(function (c) { return isCurrent(c) || containsCurrent(c); });
  }
  function aria(item) { return isCurrent(item) ? ' aria-current="page"' : ""; }

  /* ---------- Header ---------- */
  function desktopNav() {
    var html = "<ul>";
    NAV.forEach(function (item) {
      var cls = [];
      if (item.children) cls.push("has-sub");
      if (containsCurrent(item)) cls.push("is-ancestor");
      html += '<li class="' + cls.join(" ") + '"><a href="' + item.href + '"' + aria(item) + ">" + item.title +
        (item.children ? ICON.chev : "") + "</a>";
      if (item.children) {
        html += '<ul class="sub">';
        item.children.forEach(function (c) {
          html += '<li><a href="' + c.href + '"' + aria(c) + ">" + c.title + "</a>";
          if (c.children) {
            html += '<ul class="sub-group">';
            c.children.forEach(function (g) { html += '<li><a href="' + g.href + '"' + aria(g) + ">" + g.title + "</a></li>"; });
            html += "</ul>";
          }
          html += "</li>";
        });
        html += "</ul>";
      }
      html += "</li>";
    });
    return html + "</ul>";
  }

  var drawerIndex = 0;
  function drawerList(items, nested) {
    var html = '<ul class="' + (nested ? "sub-list" : "") + '">';
    items.forEach(function (item) {
      html += '<li style="--i:' + (drawerIndex++) + '"><a href="' + item.href + '"' + aria(item) + ">" + item.title + "</a>";
      if (item.children) html += drawerList(item.children, true);
      html += "</li>";
    });
    return html + "</ul>";
  }

  var header = document.createElement("header");
  header.className = "site-header";
  header.innerHTML =
    '<div class="container">' +
      '<a class="brand" href="index.html" aria-label="Dr. Irum Naz — Home"><span class="brand__mark" aria-hidden="true">IN</span>Dr. Irum Naz</a>' +
      '<nav class="nav" aria-label="Main">' + desktopNav() + "</nav>" +
      '<button class="menu-toggle" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="drawer"><span></span></button>' +
    "</div>";

  var drawer = document.createElement("div");
  drawer.className = "drawer";
  drawer.id = "drawer";
  drawer.innerHTML =
    '<div class="drawer__scrim"></div>' +
    '<nav class="drawer__panel" aria-label="Mobile">' + drawerList(NAV, false) +
    '<p class="drawer__foot">Dr. Irum Naz</p></nav>';

  var progress = document.createElement("div");
  progress.className = "scroll-progress";
  progress.setAttribute("aria-hidden", "true");

  var skip = document.createElement("a");
  skip.className = "skip-link";
  skip.href = "#main";
  skip.textContent = "Skip to main content";

  document.body.prepend(skip, progress, header, drawer);

  var toggle = header.querySelector(".menu-toggle");
  function setMenu(open) {
    document.body.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }
  toggle.addEventListener("click", function () { setMenu(!document.body.classList.contains("menu-open")); });
  drawer.querySelector(".drawer__scrim").addEventListener("click", function () { setMenu(false); });

  /* ---------- Footer ---------- */
  var footer = document.createElement("footer");
  footer.className = "site-footer";
  var about = NAV[1];
  var journey = about.children[1];
  function links(items) {
    return "<ul>" + items.map(function (i) { return '<li><a href="' + i.href + '">' + i.title + "</a></li>"; }).join("") + "</ul>";
  }
  footer.innerHTML =
    '<div class="container">' +
      '<div class="footer-grid">' +
        '<div><a class="brand" href="index.html"><span class="brand__mark" aria-hidden="true">IN</span>Dr. Irum Naz</a>' +
        '<p class="footer-tag">Curiosity opens doors. Learning keeps them open...</p>' +
        '<p><a href="' + ORCID_URL + '" target="_blank" rel="noopener">ORCID: 0009-0002-7577-8960 ↗</a></p></div>' +
        "<div><h4>Explore</h4>" + links(NAV.filter(function (n) { return n !== about; })) + "</div>" +
        "<div><h4>About Me</h4>" + links([about].concat(about.children)) + "</div>" +
        "<div><h4>The Journey</h4>" + links(journey.children) + "</div>" +
      "</div>" +
      '<div class="footer-bottom"><span>© ' + new Date().getFullYear() + " Dr. Irum Naz. All rights reserved.</span>" +
      "<span>Educator · Researcher · Leader</span></div>" +
    "</div>";
  document.body.appendChild(footer);

  var toTop = document.createElement("button");
  toTop.className = "to-top";
  toTop.type = "button";
  toTop.setAttribute("aria-label", "Back to top");
  toTop.innerHTML = ICON.up;
  toTop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
  document.body.appendChild(toTop);

  /* ---------- Scroll effects ---------- */
  var timelineFill = document.querySelector(".timeline__fill");
  var timeline = timelineFill && timelineFill.closest(".timeline");
  var ticking = false;
  function onScroll() {
    var y = window.scrollY;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = "scaleX(" + (max > 0 ? y / max : 0) + ")";
    header.classList.toggle("is-solid", y > 40);
    toTop.classList.toggle("is-shown", y > 700);
    if (timeline) {
      var r = timeline.getBoundingClientRect();
      var p = (window.innerHeight * 0.6 - r.top) / r.height;
      timelineFill.style.transform = "scaleY(" + Math.max(0, Math.min(1, p)) + ")";
    }
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll("[data-reveal], .title-bar, .milestone");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  // Stagger children of grids automatically
  document.querySelectorAll("[data-stagger]").forEach(function (group) {
    Array.prototype.forEach.call(group.children, function (el, i) {
      if (!el.hasAttribute("data-reveal")) { el.setAttribute("data-reveal", group.dataset.stagger || ""); }
      el.style.setProperty("--d", (i % 6) * 0.08 + "s");
      if (io) io.observe(el); else el.classList.add("is-visible");
    });
  });

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------- Gentle 3D tilt on tiles ---------- */
  if (finePointer && !reduceMotion) {
    document.querySelectorAll("a.tile").forEach(function (tile) {
      tile.addEventListener("mousemove", function (e) {
        var r = tile.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        tile.style.transform = "translateY(-8px) perspective(900px) rotateX(" + (-y * 5) + "deg) rotateY(" + (x * 5) + "deg)";
      });
      tile.addEventListener("mouseleave", function () { tile.style.transform = ""; });
    });
  }

  /* ---------- Floating gold particles ---------- */
  document.querySelectorAll(".particles").forEach(function (box) {
    if (reduceMotion) return;
    var count = window.innerWidth < 700 ? 14 : 28;
    for (var i = 0; i < count; i++) {
      var p = document.createElement("i");
      p.style.left = Math.random() * 100 + "%";
      p.style.setProperty("--s", (2 + Math.random() * 5).toFixed(1) + "px");
      p.style.setProperty("--t", (10 + Math.random() * 14).toFixed(1) + "s");
      p.style.setProperty("--d", (-Math.random() * 20).toFixed(1) + "s");
      p.style.setProperty("--x", (Math.random() * 120 - 60).toFixed(0) + "px");
      box.appendChild(p);
    }
  });

  /* ---------- Lightbox ---------- */
  var lb = document.createElement("div");
  lb.className = "lightbox";
  lb.setAttribute("role", "dialog");
  lb.setAttribute("aria-modal", "true");
  lb.setAttribute("aria-label", "Image viewer");
  lb.innerHTML = '<button class="lightbox__close" type="button" aria-label="Close">' + ICON.close + '</button><img alt=""><p class="lightbox__caption"></p>';
  document.body.appendChild(lb);
  var lbImg = lb.querySelector("img");
  var lbCap = lb.querySelector(".lightbox__caption");
  var lastFocus = null;

  function openLightbox(src, alt) {
    lastFocus = document.activeElement;
    lbImg.src = src;
    lbImg.alt = alt || "";
    lbCap.textContent = alt || "";
    lb.classList.add("is-open");
    document.body.style.overflow = "hidden";
    lb.querySelector(".lightbox__close").focus();
  }
  function closeLightbox() {
    lb.classList.remove("is-open");
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }
  lb.addEventListener("click", function (e) { if (e.target !== lbImg) closeLightbox(); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      if (lb.classList.contains("is-open")) closeLightbox();
      else if (document.body.classList.contains("menu-open")) setMenu(false);
    }
  });
  document.querySelectorAll("[data-lightbox]").forEach(function (el) {
    var img = el.tagName === "IMG" ? el : el.querySelector("img");
    if (!img) return;
    el.setAttribute("tabindex", "0");
    el.setAttribute("role", "button");
    el.setAttribute("aria-label", "View larger: " + (img.alt || "image"));
    function open() { openLightbox(el.getAttribute("data-lightbox") || img.currentSrc || img.src, img.alt); }
    el.addEventListener("click", open);
    el.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
  });

  /* ---------- Lite YouTube embeds ---------- */
  document.querySelectorAll(".video[data-yt]").forEach(function (v) {
    var id = v.getAttribute("data-yt");
    var title = v.getAttribute("data-title") || "Video";
    v.innerHTML =
      '<img src="https://i.ytimg.com/vi/' + id + '/hqdefault.jpg" alt="" loading="lazy">' +
      '<button class="video__play" type="button" aria-label="Play video: ' + title.replace(/"/g, "&quot;") + '">' + ICON.play + "</button>" +
      '<span class="video__title">' + title + "</span>";
    v.addEventListener("click", function () {
      if (v.classList.contains("is-playing")) return;
      var f = document.createElement("iframe");
      f.src = "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&rel=0";
      f.title = title;
      f.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      f.allowFullscreen = true;
      v.classList.add("is-playing");
      v.appendChild(f);
    });
  });

  /* ---------- Research filters ---------- */
  var chips = document.querySelectorAll(".chip[data-filter]");
  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      var f = chip.getAttribute("data-filter");
      chips.forEach(function (c) { c.setAttribute("aria-pressed", String(c === chip)); });
      document.querySelectorAll(".study").forEach(function (s) {
        var show = f === "all" || s.getAttribute("data-year") === f;
        s.classList.toggle("is-hidden", !show);
        if (show) s.classList.add("is-visible");
      });
    });
  });

  /* ---------- Soft page transitions ---------- */
  document.addEventListener("click", function (e) {
    var a = e.target.closest("a");
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    var href = a.getAttribute("href");
    if (!href || href.charAt(0) === "#" || a.target === "_blank" || /^(https?:|mailto:|tel:)/.test(href) || reduceMotion) return;
    e.preventDefault();
    document.body.classList.add("is-leaving");
    setTimeout(function () { location.href = href; }, 300);
  });
  // Restore visibility when returning via the back/forward cache
  window.addEventListener("pageshow", function (e) { if (e.persisted) document.body.classList.remove("is-leaving"); });
})();
