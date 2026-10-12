// Portafolio Pedro Ricra — interacciones sobrias, un solo momento orquestado.
(function () {
  "use strict";

  // 1. Cargador
  var cargador = document.getElementById("cargador");
  var progreso = document.getElementById("cargadorProgreso");
  var texto = document.getElementById("cargadorTexto");
  var frases = ["iniciando sistema…", "cargando expediente…", "listo."];
  var paso = 0;
  var reduceMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function ocultarCargador() {
    if (!cargador) return;
    cargador.classList.add("oculto");
    setTimeout(function () { cargador.remove(); }, 600);
  }

  if (cargador && !reduceMovimiento) {
    var t = setInterval(function () {
      paso += 1;
      if (progreso) progreso.style.width = Math.min(100, paso * 34) + "%";
      if (texto && frases[paso]) texto.textContent = frases[paso];
      if (paso >= 3) { clearInterval(t); setTimeout(ocultarCargador, 250); }
    }, 260);
    // Seguridad: nunca bloquear la página
    setTimeout(ocultarCargador, 2500);
  } else if (cargador) {
    ocultarCargador();
  }

  // 2. Consola con efecto de escritura (respeta movimiento reducido)
  var consola = document.getElementById("consolaTexto");
  var lineas = [
    "$ estado --actual",
    "> rol:        full-stack + testing",
    "> stack:      angular · node · mysql",
    "> foco:       spring boot · apis rest",
    "> ubicación:  pucallpa, perú (-05:00)",
    "> contacto:   disponible ✓"
  ];
  if (consola) {
    if (reduceMovimiento) {
      consola.textContent = lineas.join("\n");
    } else {
      var li = 0, ci = 0, salida = "";
      var tick = setInterval(function () {
        if (li >= lineas.length) { clearInterval(tick); return; }
        ci += 1;
        salida = lineas.slice(0, li).join("\n") + (li ? "\n" : "") + lineas[li].slice(0, ci);
        consola.textContent = salida;
        if (ci >= lineas[li].length) { li += 1; ci = 0; }
      }, 22);
    }
  }

  // 3. Tema claro / oscuro con persistencia
  var llave = "pr-tema";
  var btnTema = document.getElementById("interruptorTema");
  try {
    var guardado = localStorage.getItem(llave);
    if (guardado === "oscuro" || guardado === "claro") {
      document.documentElement.setAttribute("data-theme", guardado);
    }
  } catch (e) { /* almacenamiento no disponible */ }
  function sincronizarTema() {
    if (!btnTema) return;
    var oscuro = document.documentElement.getAttribute("data-theme") === "oscuro";
    btnTema.setAttribute("aria-pressed", oscuro ? "true" : "false");
  }
  if (btnTema) {
    btnTema.addEventListener("click", function () {
      var actual = document.documentElement.getAttribute("data-theme");
      var siguiente = actual === "oscuro" ? "claro" : "oscuro";
      document.documentElement.setAttribute("data-theme", siguiente);
      try { localStorage.setItem(llave, siguiente); } catch (e) {}
      sincronizarTema();
    });
  }
  sincronizarTema();

  // 4. Menú móvil
  var btnMenu = document.getElementById("menuBoton");
  var nav = document.getElementById("navegacion");
  if (btnMenu && nav) {
    btnMenu.addEventListener("click", function () {
      var abierto = nav.classList.toggle("abierto");
      btnMenu.setAttribute("aria-expanded", abierto ? "true" : "false");
      btnMenu.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
    });
    nav.addEventListener("click", function (ev) {
      if (ev.target.tagName === "A") {
        nav.classList.remove("abierto");
        btnMenu.setAttribute("aria-expanded", "false");
      }
    });
  }

  // 5. Revelado sobrio + scrollspy
  var revelados = document.querySelectorAll(".revelar");
  if ("IntersectionObserver" in window && !reduceMovimiento) {
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("visible");
          obs.unobserve(en.target);
        }
      });
    }, { threshold: 0.12 });
    revelados.forEach(function (el) { obs.observe(el); });
  } else {
    revelados.forEach(function (el) { el.classList.add("visible"); });
  }

  // Contadores del hero (animación física, una vez)
  var datos = document.querySelectorAll(".heroe-datos dt");
  function animarNumero(el) {
    var final = el.textContent.trim();
    var num = parseInt(final, 10);
    if (reduceMovimiento || isNaN(num)) return;
    var inicio = 0;
    var id = setInterval(function () {
      inicio += Math.max(1, Math.round(num / 24));
      if (inicio >= num) {
        el.textContent = final;
        clearInterval(id);
      } else {
        el.textContent = String(inicio);
      }
    }, 45);
  }
  if ("IntersectionObserver" in window) {
    var obsNum = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (en.isIntersecting) {
          animarNumero(en.target);
          obsNum.unobserve(en.target);
        }
      });
    }, { threshold: 0.6 });
    datos.forEach(function (d) { obsNum.observe(d); });
  }

  var secciones = ["sobre-mi", "experiencia", "proyectos", "formacion", "contacto"];
  var enlaces = {};
  if (nav) {
    nav.querySelectorAll("a").forEach(function (a) {
      enlaces[a.getAttribute("href")] = a;
    });
  }
  function spy() {
    var y = window.scrollY + 140;
    var actual = null;
    secciones.forEach(function (id) {
      var el = document.getElementById(id);
      if (el && el.offsetTop <= y) actual = id;
    });
    Object.keys(enlaces).forEach(function (href) {
      enlaces[href].classList.toggle("activo", href === "#" + actual);
    });
    var barra = document.getElementById("barra");
    if (barra) barra.style.boxShadow = window.scrollY > 8 ? "0 8px 24px rgba(18,50,74,.10)" : "none";
  }
  window.addEventListener("scroll", spy, { passive: true });
  spy();
})();
