## Objetivo
Cambiar el header de todas las plantillas de correo de Walton Pagos: fondo blanco en lugar de Deep Navy, logo a color centrado.

## Alcance
- 10 plantillas HTML en `email-templates/`
- Preview inline en `src/pages/EmailPreview.tsx`

## Cambios a realizar

### 1. Fondo del header
En todas las plantillas, cambiar `background-color` del header:
- CSS: `.header { background-color: #0a1929; ... }` → `.header { background-color: #ffffff; ... }`
- Inline: `style="background-color: #0a1929; ..."` → `style="background-color: #ffffff; ..."`

### 2. Logo a color
Cambiar la imagen del logo en todos los headers:
- De: `walton-pagos-logo-white.png` (asset ID: `bbde0269-b4eb-4efb-a0d7-9c8725ad9365`)
- A: `walton-pagos-logo.png` (asset ID: `baaea9a7-40c8-4c8e-ac8c-be77b9d47420`)

### 3. Centrado del logo
Asegurar `text-align: center` en todos los headers:
- Las plantillas de pagador (01-06) ya lo tienen.
- Las plantillas de comercio (07-10) no lo tienen; agregar `text-align: center` al CSS y al style inline del `<td class="header">`.

### 4. Limpieza CSS
Eliminar las reglas CSS obsoletas `.header-logo` y `.header-accent` de todas las plantillas, ya que el logo ahora es una imagen.

### Archivos a modificar
```
email-templates/01-link-suscripcion-tarjeta.html
email-templates/02-confirmacion-suscripcion-tarjeta.html
email-templates/03-confirmacion-suscripcion-monto-frecuencia.html
email-templates/04-confirmacion-pago.html
email-templates/05-inactivacion-tarjeta.html
email-templates/06-inactivacion-tarjeta-rechazo.html
email-templates/07-comercio-registro-tarjeta.html
email-templates/08-comercio-confirmacion-pago.html
email-templates/09-comercio-inactivacion-usuario.html
email-templates/10-comercio-inactivacion-rechazo.html
src/pages/EmailPreview.tsx
```