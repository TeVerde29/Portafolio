# Portafolio — Pedro Giovanni Ricra Figueroa

Portafolio personal de una sola página: Ingeniería de Sistemas (IX ciclo, UNU), desarrollo full-stack y QA automation. HTML, CSS y JS puros, sin frameworks ni build.

**En vivo:** https://teverde29.github.io/Portafolio/

## Stack tecnológico

- **Lenguajes:** HTML5, CSS3, JavaScript (ES6, sin dependencias)
- **Fuentes:** Space Grotesk (titulares) · Manrope (cuerpo) · Inter (etiquetas) · Material Symbols (iconos), vía Google Fonts
- **Sin build:** apertura directa en el navegador o cualquier servidor estático
- **Diseño:** réplica del sistema "Matcha Editorial" (tokens en `styles.css` con `:root` + `html[data-theme]`)
- **Temas:** oscuro `#111A13` / claro `#F7F8F1`, con persistencia en `localStorage`
- **Contacto:** formulario con envío real vía FormSubmit (AJAX, token) + `mailto:` como respaldo
- **Evidencia:** galería emergente (lightbox) por proyecto con teclado y precarga

## Arquitectura

```
Portafolio/
├── index.html   # estructura y contenido (nav, hero, 6 secciones, footer)
├── styles.css   # diseño, temas claro/oscuro, responsive
├── app.js       # partículas, reveals, contadores, scrollspy, tema, formulario
├── CV/          # CV oficial en .pdf y .docx + plantilla
└── assets/      # foto de perfil y capturas de proyectos
```

El `index.html` contiene todo el contenido; `styles.css` resuelve el tema con variables CSS (`data-theme="dark"|"light"`); `app.js` es un IIFE que inicializa partículas del hero, reveals por `IntersectionObserver`, contadores, scrollspy, menú móvil, interruptor de tema, galería emergente y formulario FormSubmit.

## Primeros pasos

Sin instalación ni prerrequisitos. Opción 1: abre `index.html` en el navegador. Opción 2: sirve la carpeta:

```powershell
python -m http.server 8080
# http://localhost:8080
```

## Estructura del proyecto

- `index.html` — nav fijo, hero con canvas, secciones `sobre-mi`, `stack`, `proyectos`, `experiencia`, `educacion`, `contacto`, galería emergente, botones flotantes y footer
- `styles.css` — tokens de color, componentes (botones, tarjetas, timeline, formulario), responsive en `1020px` y `860px`, `prefers-reduced-motion`
- `app.js` — verificado con `node --check app.js`
- `CV/` — `CV - RFPG.pdf` (descarga de los botones del sitio), `.docx` fuente y plantilla
- `assets/` — `foto.png` (retrato del hero) y 22 capturas reales: `rota-*`, `unu-*`, `logistica-*`, `p-*`

## Funciones principales

- Hero con red de partículas con parallax, insignias flotantes y métricas
- 6 secciones numeradas (01–06) con reveals escalonados al hacer scroll
- 3 proyectos con captura principal, formato problema → solución → impacto, enlaces a demo/código y botón **Ver fotos** con galería emergente (10 UNU, 9 RotaStock, 2 asignador)
- Logos SVG originales de GitHub/LinkedIn/correo en los botones sociales
- Skills en 6 tarjetas, experiencia en timeline, educación con tarjeta dorada CONEIMERA
- Tema claro/oscuro persistente, contadores animados, marquesina de stack, formulario con envío real (FormSubmit + respaldo `mailto:`), WhatsApp flotante y volver arriba

## Flujo de desarrollo

- Rama principal: `main` (despliegue automático en GitHub Pages desde raíz)
- Cambio típico: editar → verificar (`node --check app.js`, abrir `index.html`) → `git add .` → commit → `push`
- Commits en español, imperativos: `feat(portafolio): ...`, `fix(portafolio): ...`
- El CV se actualiza reemplazando `CV/CV - RFPG.pdf` con el mismo nombre (los botones no requieren cambios)

## Estándares de código

- HTML semántico en español, un `h1` por página, imágenes con `alt` y `loading="lazy"`
- CSS con variables de tema, mobile-first progresivo, foco visible y contraste AA
- JS en un solo IIFE, `"use strict"`, sin dependencias; respeta `prefers-reduced-motion`
- Rutas relativas (`assets/`, `CV/`) para que funcione en GitHub Pages y en local

## Pruebas

Sin suite automatizada. Verificación manual antes de cada push:

1. `node --check app.js`
2. Abrir `index.html`: hero, partículas, tema claro/oscuro, menú móvil (≤860px), formulario y descarga del CV
3. Comprobar que las imágenes referenciadas existen en `assets/`

## Cómo contribuir

Repo personal. Para sugerencias abre un issue con la sección afectada y el motivo. Si propones código, sigue los estándares de arriba y verifica los 3 pasos de pruebas.

## Licencia

Sin licencia definida. Contenido personal de Pedro Giovanni Ricra Figueroa.
