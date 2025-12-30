/* ===========================
   VALIDACIÓN DEL FORM 
   -  solo en la página que tenga #contactForm
   - Usa aria-describedby para asociar cada error a su campo
   - Anuncia estados en #formStatus (aria-live="polite")
   ============================================= */
(() => {
  
  const form = document.getElementById('contactForm');
  if (!form) return;

  
  const els = {
    name: document.getElementById('name'),
    email: document.getElementById('email'),
    topic: document.getElementById('topic'),
    message: document.getElementById('message'),
    consent: document.getElementById('consent'), // checkbox de consentimiento
    status: document.getElementById('formStatus')
  };

  //  pinta o borra el error de un campo
  //     id: id del input (ej. 'name')
  //     message: string con el error, si viene vacio, borra error
  function setFieldError(id, message) {
    const input = document.getElementById(id);
    const err = document.getElementById(`error-${id}`); // <p id="error-name">...
    if (!input || !err) return;

    if (message) {
      err.textContent = message; // mensaje visible al lado del campo
      err.hidden = false;        // lo mostramos
      input.setAttribute('aria-invalid', 'true'); // bandera accesible
      input.classList.add('is-invalid');         
      input.classList.remove('is-valid');
    } else {
      err.textContent = '';
      err.hidden = true;                           
      input.removeAttribute('aria-invalid');
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
    }
  }

  // validadores por campo (devuelven true/ false)
  const validators = {
    name() {
      const ok = !!els.name.value.trim();
      setFieldError('name', ok ? '' : 'Escriu el nom.');
      return ok;
    },
    email() {
      const val = els.email.value.trim();
      const ok = /^\S+@\S+\.\S+$/.test(val);
      setFieldError('email', ok ? '' : 'Introdueix un email vàlid.');
      return ok;
    },
    topic() {
      const ok = !!els.topic.value.trim();
      setFieldError('topic', ok ? '' : 'Selecciona un tema.');
      return ok;
    },
    message() {
      const ok = !!els.message.value.trim();
      setFieldError('message', ok ? '' : 'Escriu el missatge.');
      return ok;
    },
    consent() {
      // Consentimiento: no mostramos <p> de error aparte, solemos usar texto en la etiqueta
      
      if (!els.consent) return true;
      if (!els.consent.checked) {
        els.status.textContent = 'Has d’acceptar la política de privacitat.';
        return false;
      }
      return true;
    }
  };

  // validación en tiempo real (al salir del campo o al cambiar)
  els.name?.addEventListener('blur', validators.name);
  els.email?.addEventListener('blur', validators.email);
  els.topic?.addEventListener('change', validators.topic);
  els.message?.addEventListener('blur', validators.message);

  // envío del formulario
  form.addEventListener('submit', (e) => {
    e.preventDefault(); 

    // ejecutamos todos los validadores
    const results = [
      validators.name(),
      validators.email(),
      validators.topic(),
      validators.message(),
      validators.consent()
    ];

     
    const allOk = results.every(Boolean);

    if (allOk) {
      
      els.status.textContent = 'Missatge enviat correctament. Gràcies!';
      
      form.reset();

      
      ['name','email','topic','message'].forEach(id => setFieldError(id, ''));
      els.name?.classList.remove('is-valid');
      els.email?.classList.remove('is-valid');
      els.topic?.classList.remove('is-valid');
      els.message?.classList.remove('is-valid');
    } else {
      
      const firstInvalid =
        document.querySelector('[aria-invalid="true"]') ||
        (!els.consent?.checked ? els.consent : null);

      if (firstInvalid && typeof firstInvalid.focus === 'function') {
        firstInvalid.focus();
      }

     
      els.status.textContent = 'Revisa els camps amb errors.';
    }
  });
})();

// === HERO CAROUSEL: puntos y navegación ===
document.addEventListener('DOMContentLoaded', () => {
  const hero = document.querySelector('.hero.carousel');
  if (!hero) return;

  const track = hero.querySelector('.carousel-track');
  const slides = Array.from(hero.querySelectorAll('.slide'));
  const dotsWrap = hero.querySelector('.carousel-dots');
  if (!track || !slides.length || !dotsWrap) return;

  let index = Math.max(0, slides.findIndex(s => s.classList.contains('current')));

  // Crear los puntos (uno por slide)
  dotsWrap.innerHTML = '';
  const dots = slides.map((_, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('role', 'tab');              // a11y
    b.setAttribute('aria-label', `Slide ${i+1}`);
    b.setAttribute('aria-selected', i === index ? 'true' : 'false');
    b.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(b);
    return b;
  });

  function goTo(i) {
    index = i;
    track.style.transform = `translateX(-${100 * index}%)`;     // mueve la pista
    slides.forEach((s, k) => s.classList.toggle('current', k === index)); // marca slide actual
    dots.forEach((d, k) => d.setAttribute('aria-selected', k === index ? 'true' : 'false')); // marca punto actual
  }

  // Soporte teclado (← →) cuando el foco esté en el hero
  hero.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft')  { e.preventDefault(); goTo((index - 1 + slides.length) % slides.length); }
    if (e.key === 'ArrowRight') { e.preventDefault(); goTo((index + 1) % slides.length); }
  });

  // Posiciona inicialmente
  goTo(index);
});



/* ===========================
   WIDGET DE CHAT (Boton flotante)
   lo meto aqui pa q salga en todas las webs
   ============================================= */
   document.addEventListener('DOMContentLoaded', () => {
    
    // codigo html del widget, pa no pegarlo en cada archivo
    const widgetHtml = `
      <div class="pill-row" aria-label="Accions ràpides">
        <button id="chatPill" class="chat-pill" aria-label="Obrir formulari de dubtes">
          Tens algun dubte?
        </button>

        <button id="newsPill" class="news-pill" aria-label="Unir-me a la newsletter">
          Newsletter
        </button>
      </div>
  
      <div id="chatWidget" class="chat-widget" aria-hidden="true">

        <button id="closeChat" class="close-chat" aria-label="Tancar">×</button>
        <h3>Contacta'ns</h3>
        <form id="widgetForm" novalidate>
          <div class="field">
            <label for="w-name">Nom</label>
            <input id="w-name" name="name" type="text" required />
            <p id="error-w-name" class="form-error" hidden></p>
          </div>
  
          <div class="field">
            <label for="w-email">Email</label>
            <input id="w-email" name="email" type="email" required />
            <p id="error-w-email" class="form-error" hidden></p>
          </div>
  
          <div class="field">
            <label for="w-topic">Tema</label>
            <select id="w-topic" name="topic" required>
              <option value="">Tria una opció</option>
              <option>Consulta</option>
              <option>Suggeriment</option>
              <option>Altres</option>
            </select>
            <p id="error-w-topic" class="form-error" hidden></p>
          </div>
  
          <div class="field">
            <label for="w-message">Missatge</label>
            <textarea id="w-message" name="message" rows="3" required></textarea>
            <p id="error-w-message" class="form-error" hidden></p>
          </div>
  
          <div class="field checkbox">
            <input id="w-consent" name="consent" type="checkbox" required />
            <label for="w-consent" style="font-size:12px">Accepto la privacitat.</label>
          </div>
  
          <div class="actions">
            <button class="btn btn-primary" type="submit">Enviar</button>
          </div>
          <p id="w-status" class="status" aria-live="polite" style="font-size:13px"></p>
        </form>
      </div>
    `;
  
    // aqui lo pego al final del body
    document.body.insertAdjacentHTML('beforeend', widgetHtml);
  
    // pillo los elementos
    const pill = document.getElementById('chatPill');
    const widget = document.getElementById('chatWidget');
    const closeBtn = document.getElementById('closeChat');
    const form = document.getElementById('widgetForm');
  
    // funcion pa abrir y cerrar, sencillo
    function toggleChat() {
      const isOpen = widget.classList.contains('is-open');
      if (isOpen) {
        widget.classList.remove('is-open');
        widget.setAttribute('aria-hidden', 'true');
        pill.setAttribute('aria-expanded', 'false');
      } else {
        widget.classList.add('is-open');
        widget.setAttribute('aria-hidden', 'false');
        pill.setAttribute('aria-expanded', 'true');
        document.getElementById('w-name').focus(); // pa q escriban directo
      }
    }
  
    pill.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', toggleChat);
  
    // VALIDACION DEL CHAT (copiada de la otra pero cn otros ids)
    const els = {
      name: document.getElementById('w-name'),
      email: document.getElementById('w-email'),
      topic: document.getElementById('w-topic'),
      message: document.getElementById('w-message'),
      consent: document.getElementById('w-consent'),
      status: document.getElementById('w-status')
    };
  
    function setErr(id, msg) {
      const input = document.getElementById(id);
      const err = document.getElementById(`error-${id}`);
      if(msg){
        err.textContent = msg; err.hidden = false;
        input.classList.add('is-invalid');
      } else {
        err.textContent = ''; err.hidden = true;
        input.classList.remove('is-invalid');
      }
    }
  
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // valido todo aqui a saco
      let ok = true;
  
      if(!els.name.value.trim()){ setErr('w-name', 'Falta el nom'); ok=false; } 
      else setErr('w-name', '');
  
      if(!/^\S+@\S+\.\S+$/.test(els.email.value.trim())){ setErr('w-email', 'Email mal'); ok=false; }
      else setErr('w-email', '');
  
      if(!els.topic.value){ setErr('w-topic', 'Tria tema'); ok=false; }
      else setErr('w-topic', '');
  
      if(!els.message.value.trim()){ setErr('w-message', 'Escriu algo'); ok=false; }
      else setErr('w-message', '');
  
      if(!els.consent.checked){ els.status.textContent='Has d acceptar.'; ok=false; }
      
      if(ok){
        els.status.textContent = 'Enviat perfecte!';
        form.reset();
        setTimeout(() => { toggleChat(); els.status.textContent=''; }, 2000); // se cierra solo
      }
    });
  
  });


/* ===========================
   POPUP NEWSLETTER 
   ============================= */
document.addEventListener('DOMContentLoaded', () => {

  // --- TRUCO PARA LA RUTA DE LA IMAGEN ---
  // Detectamos si estamos dentro de la carpeta "contingut" para arreglar la ruta
  const isSubFolder = window.location.pathname.includes('/contingut/');
  // Si estamos en subcarpeta usamos "../assets...", si no "assets..."
  const basePath = isSubFolder ? '../' : ''; 
  const imagePath = basePath + 'assets/img/IlusionOpticaNEWSLETTER.avif'; // Fíjate: .png y ruta dinámica

  const newsHtml = `
    <div id="newsModal" class="news-modal" aria-hidden="true">
      <div class="news-content">
        <button id="closeNews" class="news-close" aria-label="Tancar finestra">×</button>
        
        <div class="news-form-col">
          <h2>Subscriu-te!</h2>
          <p>Rep les millors il·lusions i novetats al teu correu.</p>
          
          <form id="newsFormModal" novalidate>
            <div class="field">
              <label for="n-name">Nom</label>
              <input id="n-name" name="name" type="text" required />
            </div>

            <div class="field">
              <label for="n-email">Correu electrònic</label>
              <input id="n-email" name="email" type="email" required />
            </div>

            <div class="field checkbox">
              <input id="n-consent" name="consent" type="checkbox" required />
              <label for="n-consent" style="font-size:13px">Accepto les condicions.</label>
            </div>

            <div class="actions">
              <button class="btn btn-primary" style="width:100%" type="submit">Subscriure'm</button>
            </div>
            <p id="n-status" class="status" style="font-size:13px"></p>
          </form>
        </div>

        <div class="news-img-col">
          <!-- AQUI USAMOS LA VARIABLE imagePath QUE CALCULAMOS ARRIBA -->
          <img src="${imagePath}" alt="Ilusión óptica decorativa">
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', newsHtml);

  const modal = document.getElementById('newsModal');
  const closeBtn = document.getElementById('closeNews');
  const form = document.getElementById('newsFormModal');
  const status = document.getElementById('n-status');

  function showModal() {
    if(localStorage.getItem('newsSubscribed')) return;
    modal.classList.add('is-visible');
    modal.setAttribute('aria-hidden', 'false');
  }

  function closeModal() {
    modal.classList.remove('is-visible');
    modal.setAttribute('aria-hidden', 'true');
  }

  closeBtn.addEventListener('click', closeModal);
  // Botón fijo para abrir la newsletter (al lado del chat)
const newsPill = document.getElementById('newsPill');
if (newsPill) {
  newsPill.addEventListener('click', showModal);
}
  modal.addEventListener('click', (e) => {
    if(e.target === modal) closeModal();
  });

  const visited = sessionStorage.getItem('hasVisited');

  if (!visited) {
    setTimeout(showModal, 1000);
    sessionStorage.setItem('hasVisited', 'true');
  } else {
    setTimeout(showModal, 30000);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('n-name');
    const email = document.getElementById('n-email');
    const consent = document.getElementById('n-consent');

    if(!name.value || !email.value || !consent.checked){
      status.textContent = "Faltan datos o aceptar.";
      status.style.color = "red";
      return;
    }
    
    status.textContent = "Subscrit correctament!";
    status.style.color = "green";
    
    localStorage.setItem('newsSubscribed', 'true');

    setTimeout(() => {
      closeModal();
      status.textContent = "";
      form.reset();
    }, 2000);
  });
});



/* ===========================
   OP ART CAROUSEL – 1 delante + 2 detrás (borrosas)
   - auto cada 3s
   ============================================= */
document.addEventListener('DOMContentLoaded', () => {
  const carousel = document.querySelector('.opart-carousel');
  if (!carousel) return;

  const imgs = Array.from(carousel.querySelectorAll('img'));
  if (imgs.length < 2) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // índice inicial: si ya hay .is-active, lo respeta; si no, 0
  let i = Math.max(0, imgs.findIndex(img => img.classList.contains('is-active')));
  if (i === -1) i = 0;

  function paint() {
    imgs.forEach(img => img.classList.remove('is-active', 'is-prev', 'is-next'));

    const prev = (i - 1 + imgs.length) % imgs.length;
    const next = (i + 1) % imgs.length;

    imgs[i].classList.add('is-active');
    imgs[prev].classList.add('is-prev');
    imgs[next].classList.add('is-next');
  }

  function go(nextIndex) {
    i = (nextIndex + imgs.length) % imgs.length;
    paint();
  }

  paint();

  if (!reduceMotion) {
    setInterval(() => go(i + 1), 3000);
  }
});



/* ===========================
   DEMOS – Carrusel AUTOSCROLL
   =========================== */
document.addEventListener('DOMContentLoaded', () => {
  const carousel = document.querySelector('.demo-carousel');
  if (!carousel) return;

  const track = carousel.querySelector('.demo-track');
  const slides = carousel.querySelectorAll('.demo-slide');
  const dots = carousel.querySelectorAll('.demo-dot');

  let index = 0;
  const total = slides.length;
  const INTERVAL = 3000; // 3 segundos
  let timer;

  function updateCarousel(){
    track.style.transform = `translateX(-${index * 100}%)`;

    dots.forEach(d => d.classList.remove('is-active'));
    if (dots[index]) dots[index].classList.add('is-active');
  }

  function nextSlide(){
    index = (index + 1) % total;
    updateCarousel();
  }

  function startAuto(){
    stopAuto();
    timer = setInterval(nextSlide, INTERVAL);
  }

  function stopAuto(){
    if (timer) clearInterval(timer);
  }

  /* Click en dots */
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      index = parseInt(dot.dataset.go, 10);
      updateCarousel();
      startAuto(); // reinicia el timer
    });
  });

  /* Pausa al interactuar */
  carousel.addEventListener('mouseenter', stopAuto);
  carousel.addEventListener('mouseleave', startAuto);
  carousel.addEventListener('touchstart', stopAuto, { passive: true });
  carousel.addEventListener('touchend', startAuto);

  /* Init */
  updateCarousel();
  startAuto();
});







/* ===========================
   HERO – Auto carrusel simple (cada 3s)
   =========================== */
document.addEventListener('DOMContentLoaded', () => {
  const hero = document.querySelector('.hero.carousel');
  if (!hero) return;

  const track = hero.querySelector('.carousel-track');
  const slides = Array.from(hero.querySelectorAll('.slide'));
  const dots = Array.from(hero.querySelectorAll('.carousel-dots button'));
  if (!track || slides.length < 2) return;

  let index = 0;
  const INTERVAL = 3000;

  function render() {
    track.style.transform = `translateX(-${index * 100}%)`;

    if (dots.length) {
      dots.forEach((b, i) => b.setAttribute('aria-selected', i === index ? 'true' : 'false'));
    }
  }

  function next() {
    index = (index + 1) % slides.length;
    render();
  }

  // Auto (siempre, sin pausas)
  setInterval(next, INTERVAL);

  // Click dots (opcional)
  if (dots.length) {
    dots.forEach((btn, i) => {
      btn.addEventListener('click', () => {
        index = i;
        render();
      });
    });
  }

  render();
});




/* ===========================
   MENU MÒBIL (Hamburguesa)
   =========================== */
document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav-toggle');
  const backdrop = document.querySelector('.mobile-backdrop');
  const menu = document.getElementById('mobileMenu');

  if (!navToggle) return;

  function toggleMenu() {
    const isOpen = document.body.classList.toggle('is-menu-open');
    
    // Actualizar atributos de accesibilidad
    navToggle.setAttribute('aria-expanded', isOpen);
    menu.setAttribute('aria-hidden', !isOpen);
  }

  // Abrir/Cerrar al clicar en la hamburguesa
  navToggle.addEventListener('click', toggleMenu);

  // Cerrar al clicar en el fondo oscuro (backdrop)
  if (backdrop) {
    backdrop.addEventListener('click', toggleMenu);
  }

  // Opcional: Cerrar al clicar en un enlace del menú móvil
  const mobileLinks = document.querySelectorAll('.mobile-link');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (document.body.classList.contains('is-menu-open')) {
        toggleMenu();
      }
    });
  });
});



// Animar bloques al entrar en viewport (una sola vez)
document.addEventListener("DOMContentLoaded", () => {
  const targets = document.querySelectorAll(
    "#contrast.block-with-aside, #repeticio.block-with-aside, #profunditat.block-with-aside"
  );

  if (!("IntersectionObserver" in window)) {
    // Fallback: si el navegador no soporta IO, los mostramos sin animar
    targets.forEach(el => el.classList.add("is-inview"));
    return;
  }

  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-inview");
        obs.unobserve(entry.target); // solo una vez
      }
    });
  }, { threshold: 0.18 });

  targets.forEach(el => io.observe(el));
});


document.addEventListener("DOMContentLoaded", () => {
  const el = document.querySelector("#que-es .opart-split");
  if (!el) return;

  if (!("IntersectionObserver" in window)) {
    el.classList.add("is-inview");
    return;
  }

  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-inview");
        obs.unobserve(entry.target); // solo una vez
      }
    });
  }, { threshold: 0.18 });

  io.observe(el);
});







/// Animar al entrar en viewport (una vez): secciones + bloques + cards + contacto + demos
document.addEventListener("DOMContentLoaded", () => {
  const targets = document.querySelectorAll([
    // PRINCIPIS + ARTISTES (se activa la sección, anima sus .card)
    ".principis-anim",
    ".artistes-anim",

    // CONTINGUT index (cada bloque)
    "body[data-section='contingut'] .site-main .block-with-aside",

    // DEMOS (cada demo)
    "body[data-section='contingut'] .site-main .demo.section",

    // CONTACTE
    ".page-contact .contact-card",
    ".page-contact .contact-side",
    ".page-contact .benefit-card"
  ].join(","));

  if (!targets.length) return;

  if (!("IntersectionObserver" in window)) {
    targets.forEach(el => el.classList.add("is-inview"));
    return;
  }

  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-inview");
        obs.unobserve(entry.target); // solo una vez
      }
    });
  }, { threshold: 0.18 });

  targets.forEach(el => io.observe(el));
});

