# KGroup — Landing de captación

Landing page de una sola pieza para vender **software a la medida** y capturar contactos.
Inspirada en la estructura de conversión de [halltec.co](https://halltec.co) (servicios en grid,
CTA a WhatsApp siempre visible, métricas de confianza) y [getjusto.com](https://www.getjusto.com)
(prueba social, comparación “sin / con”, múltiples puntos de entrada al embudo).

Sin frameworks ni build: HTML + CSS + JS plano. Se sube tal cual a cualquier hosting.

```
kgroup-landing/
├── index.html                 ← toda la página
├── assets/
│   ├── css/styles.css         ← estilos y paleta
│   ├── js/main.js             ← datos de contacto, formulario, filtros, animaciones
│   └── img/                   ← logos KGroup (SVG + PNG)
├── server.mjs                 ← servidor local solo para previsualizar
└── README.md
```

---

## ⚠️ Antes de publicar

El contenido de estas tres zonas es **de ejemplo**, puesto para que veas la estructura armada.
Cámbialo por información real antes de que la página salga a producción:

| Zona | Dónde | Qué reemplazar |
|---|---|---|
| Datos de contacto | `assets/js/main.js` → objeto `CONTACT` | WhatsApp, correo y teléfono reales |
| Clientes (marquesina) | `index.html` → `<section class="clients">` | Nombres reales, o borra la sección |
| Portafolio | `index.html` → `<section id="portafolio">` | Títulos, descripciones, métricas y categorías reales |
| Testimonios | `index.html` → sección “Testimonios” | Frases reales y autorizadas por el cliente |
| Estadísticas | `index.html` → `<div class="stats">`, atributo `data-count` | Cifras reales |

---

## 1. Configurar el contacto (lo primero)

Todo vive en un solo bloque, arriba de `assets/js/main.js`:

```js
const CONTACT = {
  whatsapp: '573000000000',        // internacional, solo dígitos
  whatsappMsg: 'Hola KGroup 👋 ...',
  email: 'hola@kgroup.co',
  phoneDisplay: '+57 300 000 0000',
  endpoint: ''                      // ver abajo
};
```

Ese bloque alimenta el botón flotante, el chip de WhatsApp, el correo del footer y el envío del
formulario. No hay que tocar el HTML.

## 2. Dónde llegan los leads

**Opción A — sin backend (por defecto).** Si `endpoint` está vacío, el formulario valida los datos
y abre WhatsApp con el resumen del lead ya escrito. Funciona desde el minuto uno, pero el lead
solo queda en tu chat.

**Opción B — recomendada.** Pon una URL en `endpoint` y el formulario hace `POST` con un JSON
(`nombre, empresa, email, telefono, servicio, presupuesto, mensaje`). Sirve cualquier servicio que
reciba JSON:

- [Formspree](https://formspree.io) → `https://formspree.io/f/xxxxxxx` (plan gratis, llega a tu correo)
- [Getform](https://getform.io), [Basin](https://usebasin.com) → equivalentes
- Un webhook de n8n / Make / Zapier → así lo mandas a un CRM o a una hoja de cálculo
- Tu propia API

El formulario ya trae validación en español, honeypot anti-spam y mensajes de éxito/error.

## 3. Agregar o quitar proyectos del portafolio

Cada proyecto es un `<article class="project" data-cat="web">`. El `data-cat` debe coincidir con el
`data-filter` de los botones de arriba: `web`, `app`, `ecommerce`, `ia`.

Las miniaturas son **mockups hechos en CSS** (no imágenes), por eso se ven consistentes sin
necesidad de screenshots. Si quieres poner capturas reales, reemplaza el bloque `.frame` por:

```html
<img src="assets/img/proyecto-1.jpg" alt="Descripción del proyecto" />
```

Para agregar una categoría nueva: añade un `<button class="filter" data-filter="tunombre">` y usa
ese mismo valor en el `data-cat` de los proyectos.

## 4. Ver la página en local

```bash
node kgroup-landing/server.mjs
```

Luego abre `http://localhost:4321`. (Abrir el `index.html` con doble clic también funciona, pero
algunos navegadores bloquean recursos locales.)

## 5. Publicar

Es una carpeta estática, así que sirve cualquiera de estas:

- **Netlify / Vercel** — arrastra la carpeta `kgroup-landing` al panel y queda publicada.
- **Cloudflare Pages** — igual, sin comando de build.
- **Hosting propio** — sube el contenido por FTP a `public_html`.

Antes de publicar, revisa también en `index.html`:

- El `<title>` y la `<meta name="description">` (son lo que sale en Google).
- La `og:image` — hoy apunta al logo; lo ideal es una imagen de 1200×630 px.
- Los enlaces de redes sociales del footer (`href="#"`).

---

## Detalles de diseño

**Paleta**, tomada directamente del logo:

| Color | Hex | Uso |
|---|---|---|
| Índigo KGroup | `#362A7E` | color oficial del logo, base de los degradados |
| Violeta | `#6C4FF6` | botones, acentos, gráficas |
| Violeta claro | `#A796FF` | detalles sobre fondo oscuro |
| Índigo profundo | `#100C2B` | fondos oscuros y footer |
| Gris del logo | `#EBEBEB` | fondos suaves y placeholders |

Tipografías: **Sora** para títulos, **Inter** para texto (Google Fonts).

El logo va **inline en el HTML** como SVG (nav y footer) para que cambie de color solo: blanco
sobre el hero oscuro, negro cuando la barra se vuelve sólida al bajar. Los archivos originales
quedaron en `assets/img/` por si los necesitas para otra cosa.

Incluye: animaciones al entrar en pantalla, contadores animados, filtros de portafolio, acordeón
de preguntas, menú móvil, botón flotante de WhatsApp y respeto por `prefers-reduced-motion`.

## Estructura de la página (el embudo)

1. **Hero** — promesa + CTA principal + señales de confianza
2. **Métricas** — credibilidad inmediata
3. **Clientes** — prueba social
4. **Servicios** — qué puedes pedirle a KGroup
5. **Sin / Con KGroup** — el argumento de venta
6. **Proceso** — baja el miedo a contratar (“¿y cómo funciona?”)
7. **Portafolio** — la prueba de que sí lo han hecho
8. **Testimonios** — prueba social en voz del cliente
9. **Preguntas frecuentes** — resuelve las objeciones (precio, tiempos, propiedad del código)
10. **Formulario** — el cierre, con WhatsApp y correo como alternativas

Hay CTA hacia el formulario en el nav, el hero, el portafolio y el botón flotante: cuatro entradas
al mismo embudo.
