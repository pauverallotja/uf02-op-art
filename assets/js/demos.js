(function(){
  
  const checker = document.querySelector('.checker');
  const s = document.getElementById('sizeDamero');
  if(checker && s){ const apply = ()=> checker.style.setProperty('--s', s.value + 'px'); s.addEventListener('input', apply); apply(); }

/*El js busca la caja .checker y el slider #sizeDamero
  Si existen, define apply, que pone en la caja una variable css --s con el valor del slider osea mas px. 
  Luego engancha un event listener al slider con 'input' para que cada vez que lo mueva llame a apply(). 
  Tambien llama a apply() una vez al principio
  como el css dibuja el damero usando var(--s), 
  cuando --s cambia el patrón se redibuja con celdas más grandes o más pequeñas al momento,*/ 

  const waves = document.querySelector('.waves');
  const amp = document.getElementById('amp');
  const gap = document.getElementById('gap');
  // Busca el lienzo .waves y los sliders #amp y #gap.
  function applyWaves(){ if(!waves) return;
    waves.style.setProperty('--amp', (amp?.value||12) + 'px');
    waves.style.setProperty('--gap', (gap?.value||18) + 'px'); }

  /* Si no existe .waves, se sale.

    --amp coje el valor del slider amp (si no existe o está vacio, usa 12)

    --gap coje el valor del slider gap (si no existe o está vacío, usa 18)

    Se añaden px porq son longitudes*/


  amp?.addEventListener('input', applyWaves); gap?.addEventListener('input', applyWaves); applyWaves();
  // Conecta los dos sliders al evento input (mientras arrastras)
  // Llama una vez a applyWaves() para iniciar con el valor actual


  const moire = document.querySelector('.moire');
  const angle = document.getElementById('angle');
  const stripe = document.getElementById('stripe');
  function applyMoire(){ if(!moire) return;
    moire.style.setProperty('--angle', (angle?.value||3) + 'deg');
    moire.style.setProperty('--stripe', (stripe?.value||3) + 'px'); }
  angle?.addEventListener('input', applyMoire); stripe?.addEventListener('input', applyMoire); applyMoire();
  const radial = document.querySelector('.radial');
  const density = document.getElementById('density');
  function applyRadial(){ if(!radial) return;
    radial.style.setProperty('--density', (density?.value||48)); }
  density?.addEventListener('input', applyRadial); applyRadial();
})();

/*
Damero (.checker)
Slider: #sizeDamero -> JS pone --s: Npx 
CSS usa var(--s) en el tamaño del patron
Cambia el tamaño de cada cuadrado más grande o pequeño.

Ondas (.waves)
Sliders: #amp, #gap -> JS pone --amp: Npx, --gap: Npx 
CSS usa var(--amp) para “altura” de la onda y var(--gap)  para separacion 
Cambia lo alta o baja que es la onda y la distancia entre lineas

Moiré (.moire)
Sliders: #angle, #stripe  -> JS pone --angle: Ndeg, --stripe: Npx 
CSS cruza dos gradientes de rallas con ese angulo y grosor 
Cambia la inclinación de una capa y el grosor de las franjas, alterando el patrón moiré.

Radial (.radial)
Slider: #density -> JS pone --density: N 
CSS reparte colores con trozos de tamaño 360/N 
Cambia cuantas cuñas hay (más numero es más fino)
*/ 