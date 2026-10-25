// Portafolio Pedro Ricra — réplica Stitch: partículas, reveals, contadores, scrollspy, tema, menú, form.
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ── Tema claro / oscuro con persistencia (oscuro por defecto) ── */
  var KEY = "pr-tema";
  var root = document.documentElement;
  var themeBtn = document.getElementById("theme-btn");
  var themeIcon = document.getElementById("theme-icon");
  function paintTheme() {
    var light = root.getAttribute("data-theme") === "light";
    if (themeBtn) themeBtn.setAttribute("aria-pressed", light ? "true" : "false");
    if (themeIcon) themeIcon.textContent = light ? "dark_mode" : "light_mode";
  }
  try {
    var saved = localStorage.getItem(KEY);
    if (saved === "light" || saved === "dark") root.setAttribute("data-theme", saved);
  } catch (e) { /* sin almacenamiento */ }
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem(KEY, next); } catch (e) {}
      paintTheme();
    });
  }
  paintTheme();

  /* ── Partículas del hero (parallax con el mouse) ── */
  var canvas = document.getElementById("hero-particles");
  if (canvas && !reduce) {
    var ctx = canvas.getContext("2d");
    var W = 0, H = 0;
    var mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999 };
    var parts = [];
    function size() {
      var r = canvas.parentElement.getBoundingClientRect();
      W = canvas.width = r.width; H = canvas.height = r.height;
      var n = Math.min(42, Math.floor(W / 30));
      parts = [];
      for (var i = 0; i < n; i++) {
        parts.push({
          ox: Math.random() * W, oy: Math.random() * H,
          vx: (Math.random() - .5) * .45, vy: (Math.random() - .5) * .45,
          s: Math.random() * 3 + 1.5, diamond: Math.random() < .4,
          a: Math.random() * .08 + .08
        });
      }
    }
    window.addEventListener("mousemove", function (e) {
      var r = canvas.getBoundingClientRect();
      if (e.clientY >= r.top && e.clientY <= r.bottom) {
        mouse.tx = e.clientX - r.left; mouse.ty = e.clientY - r.top;
      }
    });
    function frame() {
      ctx.clearRect(0, 0, W, H);
      mouse.x += (mouse.tx - mouse.x) * .04;
      mouse.y += (mouse.ty - mouse.y) * .04;
      var i, j, p;
      for (i = 0; i < parts.length; i++) {
        for (j = i + 1; j < parts.length; j++) {
          var dx = parts[i].ox - parts[j].ox, dy = parts[i].oy - parts[j].oy;
          var d = Math.sqrt(dx * dx + dy * dy);
          if (d < 110) {
            ctx.strokeStyle = "rgba(194,215,163," + ((1 - d / 110) * .1) + ")";
            ctx.lineWidth = .75;
            ctx.beginPath(); ctx.moveTo(parts[i].ox, parts[i].oy); ctx.lineTo(parts[j].ox, parts[j].oy); ctx.stroke();
          }
        }
      }
      for (i = 0; i < parts.length; i++) {
        p = parts[i];
        p.ox += p.vx; p.oy += p.vy;
        if (p.ox < 0) p.ox = W; if (p.ox > W) p.ox = 0;
        if (p.oy < 0) p.oy = H; if (p.oy > H) p.oy = 0;
        var mdx = mouse.x - p.ox, mdy = mouse.y - p.oy;
        var md = Math.sqrt(mdx * mdx + mdy * mdy), sx = 0, sy = 0;
        if (md < 200 && md > 1) {
          var f = (1 - md / 200) * 22;
          sx = -(mdx / md) * f; sy = -(mdy / md) * f;
        }
        var x = p.ox + sx, y = p.oy + sy;
        ctx.fillStyle = "rgba(194,215,163," + p.a + ")";
        if (p.diamond) {
          ctx.beginPath();
          ctx.moveTo(x, y - p.s); ctx.lineTo(x + p.s, y); ctx.lineTo(x, y + p.s); ctx.lineTo(x - p.s, y);
          ctx.closePath(); ctx.fill();
        } else { ctx.beginPath(); ctx.arc(x, y, p.s, 0, 7); ctx.fill(); }
      }
      requestAnimationFrame(frame);
    }
    size(); frame();
    window.addEventListener("resize", size);
  }

  /* ── Reveals escalonados ── */
  var items = document.querySelectorAll(".reveal-item");
  if ("IntersectionObserver" in window && !reduce) {
    var obs = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("visible"); obs.unobserve(en.target); }
      });
    }, { threshold: .12, rootMargin: "0px 0px -40px 0px" });
    items.forEach(function (el) { obs.observe(el); });
  } else items.forEach(function (el) { el.classList.add("visible"); });

  /* ── Contadores (con romano IX) ── */
  var ROMANOS = ["0", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"];
  function runCounter(el) {
    if (el.dataset.done) return;
    el.dataset.done = "1";
    var target = parseInt(el.dataset.target, 10);
    var suffix = el.dataset.suffix || "";
    var roman = el.dataset.type === "roman";
    if (reduce || isNaN(target)) { el.textContent = (roman ? "IX" : target) + suffix; return; }
    var t0 = performance.now(), dur = 1400;
    function tick(now) {
      var pr = Math.min((now - t0) / dur, 1);
      var ease = 1 - Math.pow(1 - pr, 3);
      var cur = Math.floor(ease * target);
      el.textContent = (roman ? ROMANOS[Math.min(cur, 9)] : cur) + suffix;
      if (pr < 1) requestAnimationFrame(tick);
      else el.textContent = (roman ? "IX" : target) + suffix;
    }
    requestAnimationFrame(tick);
  }
  var counters = document.querySelectorAll(".counter-num");
  if ("IntersectionObserver" in window && !reduce) {
    var cObs = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (en.isIntersecting) { runCounter(en.target); cObs.unobserve(en.target); }
      });
    }, { threshold: .4 });
    counters.forEach(function (el) { cObs.observe(el); });
  } else counters.forEach(runCounter);

  /* ── Nav sólida + scrollspy + menú móvil + volver arriba ── */
  var nav = document.getElementById("main-nav");
  var navItems = document.querySelectorAll("#nav-links .nav-item");
  var mobLinks = document.querySelectorAll(".mobile-nav-link");
  var toTop = document.getElementById("to-top");
  var burger = document.getElementById("mobile-menu-btn");
  var mobMenu = document.getElementById("mobile-menu");
  var ids = ["inicio", "sobre-mi", "stack", "proyectos", "experiencia", "educacion", "contacto"];
  function spy() {
    var y = window.scrollY, cur = "inicio";
    ids.forEach(function (id) {
      var s = document.getElementById(id);
      if (s && y >= s.offsetTop - 140) cur = id;
    });
    navItems.forEach(function (a) { a.classList.toggle("active", a.dataset.section === cur); });
    mobLinks.forEach(function (a) { a.classList.toggle("active", a.dataset.section === cur); });
    if (nav) nav.classList.toggle("solid", y > 40);
    if (toTop) toTop.classList.toggle("show", y > 700);
  }
  window.addEventListener("scroll", spy, { passive: true });
  spy();
  if (burger && mobMenu) {
    burger.addEventListener("click", function () {
      var open = mobMenu.classList.toggle("open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      burger.querySelector(".material-symbols-outlined").textContent = open ? "close" : "menu";
    });
    mobLinks.forEach(function (a) {
      a.addEventListener("click", function () {
        mobMenu.classList.remove("open");
        burger.querySelector(".material-symbols-outlined").textContent = "menu";
      });
    });
  }
  if (toTop) toTop.addEventListener("click", function (e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  });

  /* ── Formulario → envío real con FormSubmit (AJAX) ── */
  var form = document.getElementById("contacto-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var n = document.getElementById("f-nombre").value.trim();
      var c = document.getElementById("f-correo").value.trim();
      var a = document.getElementById("f-asunto").value.trim();
      var m = document.getElementById("f-mensaje").value.trim();
      var note = document.getElementById("form-note");
      var btn = form.querySelector('button[type="submit"]');
      if (!n || !c || !a || !m) {
        if (note) note.textContent = "Completa todos los campos antes de enviar.";
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c)) {
        if (note) note.textContent = "Revisa el correo: no parece válido.";
        return;
      }
      if (btn) { btn.disabled = true; btn.style.opacity = ".6"; }
      if (note) note.textContent = "Enviando mensaje…";
      fetch("https://formsubmit.co/ajax/787f62adc27ed9a5f68bdf5e07eac5db", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          nombre: n, email: c, asunto: a, mensaje: m,
          _subject: "Portafolio: " + a + " — " + n,
          _template: "table", _captcha: "false"
        })
      }).then(function (res) {
        if (!res.ok) throw new Error("http " + res.status);
        return res.json();
      }).then(function () {
        if (note) note.textContent = "¡Mensaje enviado! Te responderé en menos de 24 horas.";
        form.reset();
      }).catch(function () {
        // Sin conexión al servicio: alternativa con el correo del visitante
        window.location.href = "mailto:pedro.ricra.figueroa@gmail.com?subject=" +
          encodeURIComponent(a + " — " + n) +
          "&body=" + encodeURIComponent(m + "\n\n— " + n + " (" + c + ")");
        if (note) note.textContent = "No se pudo enviar directo; abriendo tu correo como alternativa…";
      }).then(function () {
        if (btn) { btn.disabled = false; btn.style.opacity = ""; }
      });
    });
  }

  /* ── Galería emergente por proyecto ── */
  var FOTOS = {
    reportes: [
      ["assets/unu-login.png", "Inicio de sesión del sistema Reportes UNU"],
      ["assets/unu-inicio-estudiante.png", "Feed de reportes del estudiante con fotos y estado"],
      ["assets/unu-detalle-reporte.png", "Detalle de incidencia con evidencia visual"],
      ["assets/unu-aceptados-admin.png", "Panel de administración con reportes aceptados"],
      ["assets/unu-pendientes-admin-movil.png", "Panel de administración en móvil con reportes pendientes"],
      ["assets/unu-nuevo-reporte-movil.png", "Formulario móvil para registrar nueva incidencia con croquis"],
      ["assets/unu-inicio-movil.png", "Vista móvil del feed de incidencias del campus"],
      ["assets/unu-datos-movil.png", "Perfil y datos del usuario en vista móvil"]
    ],
    cvgen: [
      ["assets/cvgen-portada.png", "Portada de CV Generador con cifras y llamada a la acción"],
      ["assets/cvgen-editor.png", "Editor de datos con los doce bloques y el A4 en vivo"],
      ["assets/cvgen-diseno.png", "Panel de diseño con las 16 plantillas agrupadas por familia"],
      ["assets/cvgen-analisis.png", "Analizador de ofertas con nota y términos que faltan"],
      ["assets/cvgen-exportar.png", "Exportación a Word, PDF y Markdown"],
      ["assets/cvgen-json.png", "Importación y exportación completa de datos en formato JSON"],
      ["assets/cvgen-oscuro.png", "Plantilla Manuscrito con barra lateral y tema oscuro"]
    ],
    rotastock: [
      ["assets/rota-panel.png", "Panel de control con KPIs y gráficos de inventario"],
      ["assets/rota-productos.png", "Catálogo de productos con semaforización de rotación"],
      ["assets/rota-clasificacion-abc.png", "Clasificación ABC/XYZ con matriz de importancia y variabilidad"],
      ["assets/rota-movimientos.png", "Historial de compras y ventas valoradas"],
      ["assets/rota-que-comprar.png", "Plan de compras sugerido con punto de reorden"],
      ["assets/rota-conteos.png", "Conteos físicos auditables de almacén"],
      ["assets/rota-copias-seguridad.png", "Gestión y restauración de copias de seguridad"],
      ["assets/rota-modo-viaje-tiempo.png", "Modo viaje en el tiempo sobre inventarios históricos"]
    ],
    frejolito: [
      ["assets/frejolito-hero.png", "Hero nocturno con la fachada del local en escritorio"],
      ["assets/frejolito-carta.png", "Carta filtrable con los 21 platos en 6 categorías"],
      ["assets/frejolito-hero-movil.png", "Hero de El Frejolito en móvil (440 px)"],
      ["assets/frejolito-carta-movil.png", "Carta en móvil con tabs desplazables y pedidos por WhatsApp"]
    ],
    logistica: [
      ["assets/logistica-claro.png", "Optimización sobre mapa de Pucallpa en tema claro con métricas OSRM"],
      ["assets/logistica-oscuro.png", "Rutas y utilización por almacén en tema oscuro"]
    ]
  };
  var gal = document.getElementById("galeria");
  var galImg = document.getElementById("galeria-img");
  var galTit = document.getElementById("galeria-titulo");
  var galCont = document.getElementById("galeria-contador");
  var galClave = null, galIdx = 0, ultimoFoco = null;
  function mostrarGal() {
    var lista = FOTOS[galClave] || [];
    if (!lista.length || !galImg) return;
    galIdx = (galIdx + lista.length) % lista.length;
    galImg.src = lista[galIdx][0];
    galImg.alt = lista[galIdx][1];
    if (galTit) galTit.textContent = lista[galIdx][1];
    if (galCont) galCont.textContent = (galIdx + 1) + " / " + lista.length;
    // Precarga vecinas
    [1, -1].forEach(function (d) {
      var pre = new Image();
      pre.src = lista[(galIdx + d + lista.length) % lista.length][0];
    });
  }
  function abrirGal(clave, btn) {
    if (!gal || !FOTOS[clave]) return;
    galClave = clave; galIdx = 0;
    ultimoFoco = btn || document.activeElement;
    mostrarGal();
    gal.classList.add("abierta");
    gal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    var cerrar = document.getElementById("galeria-cerrar");
    if (cerrar) cerrar.focus();
  }
  function cerrarGal() {
    if (!gal) return;
    gal.classList.remove("abierta");
    gal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (ultimoFoco && ultimoFoco.focus) ultimoFoco.focus();
  }
  document.querySelectorAll(".galeria-btn").forEach(function (btn) {
    btn.addEventListener("click", function () { abrirGal(btn.dataset.galeria, btn); });
  });
  var gAnt = document.getElementById("galeria-ant");
  var gSig = document.getElementById("galeria-sig");
  var gCerr = document.getElementById("galeria-cerrar");
  var gFon = document.getElementById("galeria-fondo");
  if (gAnt) gAnt.addEventListener("click", function () { galIdx--; mostrarGal(); });
  if (gSig) gSig.addEventListener("click", function () { galIdx++; mostrarGal(); });
  if (gCerr) gCerr.addEventListener("click", cerrarGal);
  if (gFon) gFon.addEventListener("click", cerrarGal);
  document.addEventListener("keydown", function (e) {
    if (!gal || !gal.classList.contains("abierta")) return;
    if (e.key === "Escape") cerrarGal();
    else if (e.key === "ArrowLeft") { galIdx--; mostrarGal(); }
    else if (e.key === "ArrowRight") { galIdx++; mostrarGal(); }
  });

  var anio = document.getElementById("anio");
  if (anio) anio.textContent = String(new Date().getFullYear());
})();
