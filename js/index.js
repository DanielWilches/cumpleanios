// Lista de fotos de la galería en orden consecutivo.
const FOTOS = [
  {
    archivo: "img/img1.jpeg",
    minuto: "MIN 01'",
    titulo: "EL INICIO DEL PARTIDO",
    descripcion: "Los primeros pasos y recuerdos inolvidables que marcaron el comienzo de esta gran historia."
  },
  {
    archivo: "img/img2.jpeg",
    minuto: "MIN 07'",
    titulo: "PASIÓN POR EL BALLET AZUL",
    descripcion: "El orgullo de llevar los colores azul y blanco desde siempre en el corazón."
  },
  {
    archivo: "img/img3.jpeg",
    minuto: "MIN 15'",
    titulo: "MOMENTOS EN FAMILIA",
    descripcion: "Las risas, las celebraciones y la compañía de quienes siempre han estado en la titular."
  },
  {
    archivo: "img/img4.jpeg",
    minuto: "MIN 22'",
    titulo: "HISTORIA Y AMISTAD",
    descripcion: "Instantes compartidos que se quedan grabados para toda la vida."
  },
  {
    archivo: "img/img5.jpeg",
    minuto: "MIN 30'",
    titulo: "ALEGRÍAS EN LA TRIBUNA",
    descripcion: "Cada encuentro, cada abrazo y cada motivo para celebrar juntos."
  },
  {
    archivo: "img/img6.jpeg",
    minuto: "MIN 36'",
    titulo: "GRANDES VICTORIAS",
    descripcion: "Metas cumplidas, viajes y anécdotas que hoy recordamos con una sonrisa."
  },
  {
    archivo: "img/img7.jpeg",
    minuto: "MIN 42'",
    titulo: "ESPÍRITU EMBAJADOR",
    descripcion: "Siempre firme, con entrega, carácter y la mejor energía."
  },
  {
    archivo: "img/img8.jpeg",
    minuto: "MIN 47'",
    titulo: "CAMINO AL ANIVERSARIO",
    descripcion: "Sumando capítulos inolvidables antes del gran pitazo de los 50."
  },
  {
    archivo: "img/img9.jpeg",
    minuto: "MIN 50'",
    titulo: "MEDIO SIGLO DE VIDA",
    descripcion: "50 años celebrando a Freddy con el corazón lleno y listos para el segundo tiempo."
  }
];

function crearPlaceholder(rutaArchivo) {
  const placeholder = document.createElement("div");
  placeholder.className = "photo-card__placeholder";
  placeholder.innerHTML = `
    <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
      <rect x="3" y="5" width="18" height="14" rx="2"></rect>
      <circle cx="8.5" cy="10.5" r="1.5"></circle>
      <path d="M21 15l-5-5L5 19"></path>
    </svg>
    <strong>${rutaArchivo}</strong>
    <span>Guarda esta foto en la carpeta img/</span>
  `;
  return placeholder;
}

function renderizarGaleria() {
  const contenedor = document.getElementById("timeline-container");
  if (!contenedor) return;

  FOTOS.forEach((foto, indice) => {
    // Alterna: primera a la derecha (indice 0), segunda a la izquierda (indice 1), etc.
    const lado = indice % 2 === 0 ? "right" : "left";

    const item = document.createElement("article");
    item.className = `timeline__item timeline__item--${lado}`;

    const nodo = document.createElement("span");
    nodo.className = "timeline__node";
    nodo.setAttribute("aria-hidden", "true");

    const tarjeta = document.createElement("div");
    tarjeta.className = "photo-card";

    const media = document.createElement("div");
    media.className = "photo-card__media";

    const badge = document.createElement("span");
    badge.className = "photo-card__badge";
    badge.textContent = foto.minuto;

    const img = document.createElement("img");
    img.className = "photo-card__img";
    img.src = foto.archivo;
    img.alt = foto.titulo;
    img.loading = "lazy";

    img.addEventListener("error", () => {
      img.remove();
      media.appendChild(crearPlaceholder(foto.archivo));
    });

    media.appendChild(badge);
    media.appendChild(img);

    const cuerpo = document.createElement("div");
    cuerpo.className = "photo-card__body";
    cuerpo.innerHTML = `
      <h3 class="photo-card__title">${foto.titulo}</h3>
      <p class="photo-card__caption">${foto.descripcion}</p>
    `;

    tarjeta.appendChild(media);
    tarjeta.appendChild(cuerpo);

    item.appendChild(nodo);
    item.appendChild(tarjeta);
    contenedor.appendChild(item);
  });
}

function activarAnimacionesScroll() {
  const elementos = document.querySelectorAll(".timeline__item, .reveal-up");

  const observer = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add("is-visible");
          observer.unobserve(entrada.target);
        }
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -40px 0px"
    }
  );

  elementos.forEach((el) => observer.observe(el));
}

function configurarBoleto() {
  const btn = document.getElementById("rsvp-btn");
  const status = document.getElementById("rsvp-status");
  if (!btn || !status) return;

  let confirmado = false;
  btn.addEventListener("click", () => {
    confirmado = !confirmado;
    if (confirmado) {
      btn.classList.add("is-confirmed");
      btn.textContent = "ASISTENCIA CONFIRMADA ✓";
      status.textContent = "¡Nos vemos en la tribuna para celebrar a Freddy!";
    } else {
      btn.classList.remove("is-confirmed");
      btn.textContent = "CONFIRMAR ASISTENCIA";
      status.textContent = "";
    }
  });
}

// Fecha objetivo del evento: 6 de noviembre a las 3:00 PM (próxima fecha: 2027)
const FECHA_EVENTO = new Date(2027, 10, 6, 15, 0, 0);
// Recordatorio el mismo día a las 8:00 AM
const FECHA_RECORDATORIO = new Date(2027, 10, 6, 8, 0, 0);
const KEY_REMINDER_ENABLED = "freddy50_reminder_enabled";
const KEY_REMINDER_SENT = "freddy50_reminder_sent";

function formatearDosDigitos(valor) {
  return String(Math.max(0, valor)).padStart(2, "0");
}

function iniciarContador(alLlegarFecha) {
  const elDias = document.getElementById("cd-days");
  const elHoras = document.getElementById("cd-hours");
  const elMinutos = document.getElementById("cd-minutes");
  const elSegundos = document.getElementById("cd-seconds");
  const elResumen = document.getElementById("cd-total-summary");
  if (!elDias || !elHoras || !elMinutos || !elSegundos || !elResumen) return;

  function actualizar() {
    const ahora = Date.now();
    const diferencia = FECHA_EVENTO.getTime() - ahora;

    if (diferencia <= 0) {
      elDias.textContent = "00";
      elHoras.textContent = "00";
      elMinutos.textContent = "00";
      elSegundos.textContent = "00";
      elResumen.textContent = "¡Llegó el 6 de noviembre! Hoy se celebran los 50 años de Freddy.";
      if (typeof alLlegarFecha === "function") {
        alLlegarFecha();
      }
      return;
    }

    const totalSegundos = Math.floor(diferencia / 1000);
    const totalMinutos = Math.floor(totalSegundos / 60);
    const dias = Math.floor(totalSegundos / 86400);
    const horas = Math.floor((totalSegundos % 86400) / 3600);
    const minutos = Math.floor((totalSegundos % 3600) / 60);
    const segundos = totalSegundos % 60;

    elDias.textContent = formatearDosDigitos(dias);
    elHoras.textContent = formatearDosDigitos(horas);
    elMinutos.textContent = formatearDosDigitos(minutos);
    elSegundos.textContent = formatearDosDigitos(segundos);
    elResumen.textContent = `Faltan ${dias} días (${totalMinutos.toLocaleString("es-CO")} minutos totales) para el 6 de noviembre a las 3:00 PM.`;
  }

  actualizar();
  setInterval(actualizar, 1000);
}

function iniciarRecordatorioPush() {
  const btn = document.getElementById("reminder-btn");
  const status = document.getElementById("reminder-status");
  if (!btn || !status) return;

  let swRegistration = null;

  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    navigator.serviceWorker
      .register("./sw.js")
      .then((reg) => {
        swRegistration = reg;
        verificarYDisparar();
      })
      .catch(() => {});
  }

  function actualizarUI() {
    const activo = localStorage.getItem(KEY_REMINDER_ENABLED) === "true";
    const enviado = localStorage.getItem(KEY_REMINDER_SENT) === "true";

    if (enviado) {
      btn.classList.add("is-active");
      btn.textContent = "RECORDATORIO ENVIADO ✓";
      status.textContent = "¡Hoy es 6 de noviembre! La notificación de cumpleaños ya fue activada.";
      return;
    }

    if (activo && "Notification" in window && Notification.permission === "granted") {
      btn.classList.add("is-active");
      btn.textContent = "RECORDATORIO ACTIVO ✓";
      status.textContent =
        "Guardado en caché. Cuando abras el navegador el 6 de noviembre desde las 8:00 AM saltará el aviso.";
    } else {
      btn.classList.remove("is-active");
      btn.textContent = "🔔 ACTIVAR RECORDATORIO (6 NOV · 8:00 AM)";
    }
  }

  function mostrarNotificacion() {
    if (!("Notification" in window) || Notification.permission !== "granted") return;
    if (localStorage.getItem(KEY_REMINDER_SENT) === "true") return;

    const titulo = "🎉 ¡Hoy Freddy cumple 50 años!";
    const opciones = {
      body: "6 de noviembre · 3:00 PM — Casa de Freddy (Calle 48A Sur # 9-21, Barrio Sarasota).",
      tag: "freddy-50-cumpleanos",
      requireInteraction: true
    };

    if (swRegistration && swRegistration.showNotification) {
      swRegistration.showNotification(titulo, opciones);
    } else {
      new Notification(titulo, opciones);
    }

    localStorage.setItem(KEY_REMINDER_SENT, "true");
    actualizarUI();
  }

  function verificarYDisparar() {
    const activo = localStorage.getItem(KEY_REMINDER_ENABLED) === "true";
    if (!activo) return;

    const ahora = Date.now();
    const restante = FECHA_RECORDATORIO.getTime() - ahora;

    if (restante <= 0) {
      mostrarNotificacion();
    } else if (restante <= 2147483647) {
      setTimeout(mostrarNotificacion, restante);
    }
  }

  btn.addEventListener("click", async () => {
    if (!("Notification" in window)) {
      status.textContent = "Tu navegador no soporta notificaciones push locales.";
      return;
    }

    const permiso = await Notification.requestPermission();
    if (permiso === "granted") {
      localStorage.setItem(KEY_REMINDER_ENABLED, "true");
      actualizarUI();
      verificarYDisparar();
    } else {
      status.textContent = "Permiso de notificaciones denegado. Habilítalo en la configuración del navegador.";
    }
  });

  actualizarUI();
  verificarYDisparar();

  return verificarYDisparar;
}

function lanzarConfetiLateral(confettiLayer) {
  if (!confettiLayer) return;
  const colores = ["#0033A0", "#FFFFFF", "#D4AF37", "#F3DC8A", "#1A56DB"];

  for (let i = 0; i < 28; i++) {
    const esIzquierda = i % 2 === 0;
    const pieza = document.createElement("span");
    pieza.className = "confetti-piece";
    pieza.style.backgroundColor = colores[i % colores.length];
    pieza.style.left = esIzquierda ? "70px" : "calc(100% - 70px)";
    pieza.style.bottom = "24%";

    const tx = (esIzquierda ? 1 : -1) * (120 + Math.random() * 260);
    const ty = -(160 + Math.random() * 280);
    const rot = `${Math.round((Math.random() - 0.5) * 720)}deg`;

    pieza.style.setProperty("--tx", `${tx}px`);
    pieza.style.setProperty("--ty", `${ty}px`);
    pieza.style.setProperty("--rot", rot);
    pieza.style.animationDelay = `${Math.random() * 0.35}s`;

    confettiLayer.appendChild(pieza);
    setTimeout(() => pieza.remove(), 2900);
  }
}

function activarTrompetasCelebracion() {
  const contenedor = document.getElementById("celebration-sides");
  const confettiLayer = document.getElementById("confetti-layer");
  const seccionBoleto = document.getElementById("boleto");
  if (!contenedor) return;

  let timeoutId = null;
  let boletoYaCelebrado = false;

  function celebrar() {
    contenedor.classList.add("is-celebrating");
    lanzarConfetiLateral(confettiLayer);
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      contenedor.classList.remove("is-celebrating");
    }, 4500);
  }

  // Celebración al iniciar la página
  celebrar();

  // Celebración al llegar a la última fase (el boleto)
  if (seccionBoleto) {
    const observer = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting && !boletoYaCelebrado) {
            boletoYaCelebrado = true;
            celebrar();
          } else if (!entrada.isIntersecting) {
            boletoYaCelebrado = false;
          }
        });
      },
      { threshold: 0.28 }
    );
    observer.observe(seccionBoleto);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderizarGaleria();
  activarAnimacionesScroll();
  configurarBoleto();
  const verificarRecordatorio = iniciarRecordatorioPush();
  iniciarContador(verificarRecordatorio);
  activarTrompetasCelebracion();
});
