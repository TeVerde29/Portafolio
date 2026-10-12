// Portafolio Pedro Ricra — preloader, partículas, typer, reveal, tilt, contadores, nav, form.
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ── Preloader con progreso real ── */
  var pre = document.getElementById("preloader");
  var pct = document.getElementById("preloaderPct");
  var bar = document.getElementById("preloaderBar");
  var avance = 0;
  function finPre() {
    if (!pre || pre.classList.contains("fin")) return;
    if (pct) pct.textContent = "100%";
    if (bar) bar.style.width = "100%";
    setTimeout(function () { pre.classList.add("fin"); setTimeout(function () { pre.remove(); }, 600); }, 200);
  }
  if (pre) {
    if (reduce) { finPre(); }
    else {
      var t = setInterval(function () {
        avance = Math.min(96, avance + 4 + Math.random() * 9);
        if (pct) pct.textContent = Math.floor(avance) + "%";
        if (bar) bar.style.width = avance + "%";
      }, 110);
      window.addEventListener("load", function () {
        clearInterval(t);
        if (pct) pct.textContent = "100%";
        if (bar) bar.style.width = "100%";
        setTimeout(finPre, 250);
      });
      setTimeout(function () { clearInterval(t); finPre(); }, 4000); // seguridad
    }
  }

  /* ── Canvas: red de partículas ── */
  var canvas = document.getElementById("heroCanvas");
  if (canvas && !reduce) {
    var ctx = canvas.getContext("2d");
    var pts = [], W = 0, H = 0;
    function dimensionar() {
      var r = canvas.parentElement.getBoundingClientRect();
      W = canvas.width = r.width; H = canvas.height = r.height;
    }
    function sembrar() {
      var n = Math.min(90, Math.floor(W * H / 16000));
      pts = [];
      for (var i = 0; i < n; i++) {
        pts.push({ x: Math.random() * W, y: Math.random() * H,
          vx: (Math.random() - .5) * .45, vy: (Math.random() - .5) * .45,
          r: 1 + Math.random() * 1.8, ambar: Math.random() < .3 });
      }
    }
    function dibujar() {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < pts.length; i++) {
        var p = pts[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7);
        ctx.fillStyle = p.ambar ? "rgba(242,167,27,.8)" : "rgba(45,212,167,.55)";
        ctx.fill();
        for (var j = i + 1; j < pts.length; j++) {
          var q = pts[j], dx = p.x - q.x, dy = p.y - q.y, d = dx * dx + dy * dy;
          if (d < 130 * 130) {
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = "rgba(120,180,175," + (0.16 * (1 - d / 16900)) + ")";
            ctx.lineWidth = 1; ctx.stroke();
          }
        }
      }
      requestAnimationFrame(dibujar);
    }
    dimensionar(); sembrar(); dibujar();
    window.addEventListener("resize", function () { dimensionar(); sembrar(); });
  }

  /* ── Rol rotativo ── */
  var roles = ["Full-Stack Developer", "Angular + Node.js + MySQL", "Spring Boot · REST APIs", "QA Automation · Selenium"];
  var rolEl = document.getElementById("rolRotativo");
  if (rolEl) {
    if (reduce) { rolEl.textContent = roles.join(" · "); }
    else {
      var ri = 0, ci = roles[0].length, borrando = true;
      setInterval(function () {
        var actual = roles[ri];
        if (borrando) { ci--; if (ci <= 0) { borrando = false; ri = (ri + 1) % roles.length; } }
        else {
          var sig = roles[ri];
          ci++;
          rolEl.textContent = sig.slice(0, ci);
          if (ci >= sig.length) { borrando = true; }
          return;
        }
        rolEl.textContent = actual.slice(0, ci);
      }, 55);
    }
  }

  /* ── Reveal + barras + contadores ── */
  var visibles = document.querySelectorAll(".revelar");
  function activar(el) {
    el.classList.add("visible");
    el.querySelectorAll(".pista i").forEach(function (b) { b.style.width = b.style.getPropertyValue("--n") || "80%"; });
    if (el.classList.contains("edu") || el.id === "educacion") {
      el.querySelectorAll(".pista i").forEach(function (b) { b.style.width = b.style.getPropertyValue("--n") || "80%"; });
    }
    el.querySelectorAll("[data-contar]").forEach(contar);
  }
  function contar(el) {
    if (el.dataset.listo) return;
    el.dataset.listo = "1";
    var fin = parseInt(el.dataset.contar, 10);
    if (reduce || isNaN(fin)) { el.textContent = String(fin); return; }
    var i = 0;
    var id = setInterval(function () {
      i += Math.max(1, Math.round(fin / 30));
      if (i >= fin) { el.textContent = String(fin); clearInterval(id); }
      else el.textContent = String(i);
    }, 45);
  }
  // Contadores dentro del hero (no tienen .revelar propio)
  document.querySelectorAll("[data-contar]").forEach(function (el) {
    if ("IntersectionObserver" in window && !reduce) {
      var o = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { contar(e.target); o.unobserve(e.target); } });
      }, { threshold: .5 });
      o.observe(el);
    } else contar(el);
  });
  if ("IntersectionObserver" in window && !reduce) {
    var obs = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { activar(e.target); obs.unobserve(e.target); } });
    }, { threshold: .12 });
    visibles.forEach(function (el) { obs.observe(el); });
  } else visibles.forEach(activar);

  /* ── Tilt 3D en capturas ── */
  if (!reduce && window.matchMedia("(hover:hover)").matches) {
    document.querySelectorAll(".tilt").forEach(function (el) {
      el.addEventListener("mousemove", function (ev) {
        var r = el.getBoundingClientRect();
        var x = (ev.clientX - r.left) / r.width - .5;
        var y = (ev.clientY - r.top) / r.height - .5;
        el.style.transform = "perspective(900px) rotateY(" + (x * 7) + "deg) rotateX(" + (-y * 7) + "deg)";
      });
      el.addEventListener("mouseleave", function () { el.style.transform = "perspective(900px)"; });
    });
  }

  /* ── Nav: sólido + scrollspy + menú móvil ── */
  var nav = document.getElementById("nav");
  var links = document.querySelectorAll(".nav-links a");
  var btnMenu = document.getElementById("navMenu");
  var panel = document.getElementById("navLinks");
  var volver = document.getElementById("volverArriba");
  if (btnMenu && panel) {
    btnMenu.addEventListener("click", function () {
      var ab = panel.classList.toggle("abierto");
      btnMenu.classList.toggle("abierto", ab);
      btnMenu.setAttribute("aria-expanded", ab ? "true" : "false");
    });
    panel.addEventListener("click", function (e) {
      if (e.target.tagName === "A") { panel.classList.remove("abierto"); btnMenu.classList.remove("abierto"); }
    });
  }
  var ids = ["inicio", "sobre-mi", "skills", "proyectos", "experiencia", "educacion", "contacto"];
  function spy() {
    var y = window.scrollY + 160, actual = "inicio";
    ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el && el.offsetTop <= y) actual = id;
    });
    links.forEach(function (a) { a.classList.toggle("activo", a.getAttribute("href") === "#" + actual); });
    if (nav) nav.classList.toggle("solido", window.scrollY > 30);
    if (volver) volver.classList.toggle("visible", window.scrollY > 700);
  }
  window.addEventListener("scroll", spy, { passive: true });
  spy();
  if (volver) volver.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }); });

  /* ── Cursor luz ── */
  var luz = document.getElementById("cursorLuz");
  if (luz && window.matchMedia("(hover:hover)").matches && !reduce) {
    var lx = -500, ly = -500, tx = lx, ty = ly;
    window.addEventListener("mousemove", function (e) { tx = e.clientX; ty = e.clientY; luz.style.opacity = "1"; });
    (function seguir() {
      lx += (tx - lx) * .08; ly += (ty - ly) * .08;
      luz.style.transform = "translate(" + lx + "px," + ly + "px)";
      requestAnimationFrame(seguir);
    })();
  }

  /* ── Formulario → correo ── */
  var form = document.getElementById("contactoForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var n = document.getElementById("fNombre").value.trim();
      var c = document.getElementById("fCorreo").value.trim();
      var m = document.getElementById("fMensaje").value.trim();
      var nota = document.getElementById("formNota");
      if (!n || !c || !m) { if (nota) nota.textContent = "Completa los tres campos antes de enviar."; return; }
      var url = "mailto:pedro.ricra.figueroa@gmail.com?subject=" +
        encodeURIComponent("Contacto desde tu portafolio — " + n) +
        "&body=" + encodeURIComponent(m + "\n\n— " + n + " (" + c + ")");
      window.location.href = url;
      if (nota) nota.textContent = "Abriendo tu correo para enviar el mensaje… ¡gracias, " + n.split(" ")[0] + "!";
      form.reset();
    });
  }

  /* ── Año ── */
  var anio = document.getElementById("anio");
  if (anio) anio.textContent = String(new Date().getFullYear());
})();
