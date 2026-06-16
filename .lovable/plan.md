## Objetivo

Alinear visualmente las plantillas de email con el logo Walton Pagos. Hoy el cyan #14b8d4 compite con el magenta del logo. Aplicamos una paleta dual: **magenta de marca** para todo lo que representa identidad/acción (CTAs, header accent, links primarios, badges destacados) y **cyan más apagado** como soporte para info secundaria. Cambios limitados a los correos; el dashboard, la landing y la app móvil no se tocan.

## Paleta resultante (solo correos)

```text
Deep Navy        #0a1929   fondo del header, títulos fuertes (sin cambios)
Navy 700         #13294a   fondos sutiles / hover (sin cambios)
Brand Magenta    #e3589f   acento principal: CTAs, links, header accent, badges destacados
Magenta deep     #b8407d   hover/borde de CTA magenta
Magenta soft     #fdeaf3   fondo de cajas informativas con tinte de marca
Support Cyan     #3aa8c2   acento secundario apagado: info, datos, iconos neutros
Neutrales        sin cambios (#f4f6f8, #e2e8f0, #94a3b8, #475569…)
Semánticos       sin cambios (verde éxito, ámbar warning, rojo error)
```

## Aplicación por tipo de elemento

- **Botones primarios (CTA "Registrar tarjeta", "Ver suscripción", etc.):** fondo magenta `#e3589f`, texto blanco, borde inferior `#b8407d` para sombra sutil.
- **Links inline dentro del cuerpo:** magenta `#e3589f` con subrayado.
- **Header accent / detalles de marca:** magenta (el resto del header sigue Deep Navy con el logo blanco ya colocado).
- **Cajas informativas neutrales (detalle de suscripción, montos, fechas):** se mantienen con borde/etiquetas en el cyan apagado `#3aa8c2` o en gris neutro, según el caso, para no saturar de magenta.
- **Badges de estado semántico (Tarjeta registrada, Pago procesado, Inactivada, etc.):** se mantienen con sus colores semánticos actuales (verde/ámbar/rojo). No se reemplazan por magenta.
- **Texto destacado dentro del cuerpo (`<strong>` con color):** sigue en Deep Navy, no se vuelve magenta.

## Archivos afectados

- `email-templates/01-link-suscripcion-tarjeta.html` a `10-comercio-inactivacion-rechazo.html`
- `src/pages/EmailPreview.tsx` (contiene copias inline de cada plantilla que deben quedar sincronizadas)
- `mem://style/color-palette` y `mem://branding/identity`: actualizar para reflejar que en correos el acento de marca es magenta `#e3589f` con cyan `#3aa8c2` como soporte.

## Detalles técnicos

- Sustituir las apariciones de `#14b8d4` usadas como **acento de marca, CTA o link** por `#e3589f`. Las apariciones que actuaban como **dato/info neutral** (etiquetas, iconos secundarios) pasan a `#3aa8c2` para mantener jerarquía sin chocar con el magenta.
- En cada CTA: añadir `border-bottom: 2px solid #b8407d` o equivalente para dar profundidad, conservando padding y tipografía actuales.
- En las cajas con tinte de marca (por ejemplo el bloque "Seguridad" o el detalle resumen) probar fondo `#fdeaf3` con borde izquierdo magenta solo cuando el contexto sea de marca, no de estado.
- Mantener intactos: colores semánticos (verde éxito `#16a34a`/`#ecfdf5`, ámbar warning, rojo error), grises de texto y fondos `#f4f6f8` / `#ffffff`.
- Revisar contraste WCAG AA: magenta `#e3589f` sobre blanco da ~3.1:1 (válido para texto grande/botón con texto blanco encima, no para texto pequeño sobre blanco). Por eso los links inline mantendrán subrayado para reforzar accesibilidad y el texto de botones será blanco sobre magenta (contraste ~4.9:1).

## Validación

- Recorrer las 10 plantillas en `/email-preview` y verificar header, CTA, links, cajas info y badges de estado.
- Confirmar que el logo blanco del header sigue legible y que el magenta aparece como acento, no como fondo dominante.
