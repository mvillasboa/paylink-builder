## Objetivo

Revertir los correos al **cyan #14b8d4 como acento principal** (igual que el resto del producto) y dejar el **magenta #e3589f como toque puntual de marca**, no como color dominante. Así recuperamos el aire tech/pagos y el magenta sigue presente sutilmente para conectar con el logo.

## Cambios

Revertir todo lo que en la última iteración cambiamos de cyan a magenta, y reintroducir el magenta solo en lugares puntuales y de alto impacto visual.

```text
Revertir (volver a cyan):
  #e3589f → #14b8d4   (todos los CTAs, links, header accent, bordes de status bar, montos)
  #fdeaf3 → #e6f7fa   (fondos suaves de status bars con tinte cyan)

Mantener como acento magenta puntual (#e3589f):
  - Subrayado/borde inferior decorativo de 2px en el CTA principal de cada correo.
  - Color del "Gs. [MONTO]" en el correo de confirmación de pago (04 y 08), para que el dato más importante destaque con el color de marca.
  - Pequeño chevron/separador "/" del header accent ya queda cubierto por el logo, así que no se toca.

Sin cambios:
  - Header con logo blanco sobre Deep Navy.
  - Colores semánticos (verde éxito, ámbar warning, rojo error).
  - Neutrales (grises de texto, fondos #f4f6f8 / #ffffff).
```

## Por qué este balance

- El **CTA sigue siendo cyan** (alto contraste sobre blanco, coherente con el dashboard), pero gana un borde inferior magenta de 2px que firma la marca sin saturar.
- El **monto destacado en magenta** funciona como un punto focal único por correo: el ojo lo encuentra de inmediato y queda asociado al logo.
- El resto del correo respira igual que antes con el cyan ya conocido.

## Archivos afectados

- `email-templates/01-link-suscripcion-tarjeta.html` a `10-comercio-inactivacion-rechazo.html`
- `src/pages/EmailPreview.tsx` (las mismas copias inline)
- `mem://style/color-palette`: actualizar la nota para reflejar "cyan como acento principal también en correos, magenta solo como toque puntual (CTA underline + monto destacado)".

## Validación

- Recorrer las 10 plantillas en `/email-preview`.
- Confirmar que cada CTA tiene su borde inferior magenta (2px).
- Confirmar que los correos con monto (04, 08) muestran el "Gs. [MONTO]" en magenta y el resto del tipográfico en navy/gris.
- Confirmar que ningún otro elemento quedó en magenta por error.
