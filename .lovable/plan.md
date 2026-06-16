## Problema

El logo actual (`walton-pagos-logo-pink.png`) es una imagen cuadrada de 512×512 px con mucho espacio en blanco arriba y abajo, pero en todas las plantillas de correo se está renderizando con `width="180" height="27"` (proporción 6.67:1). Esto deforma/aplasta el logo horriblemente.

## Solución

1. **Generar una versión apaisada (wordmark)** del logo a partir del actual, eliminando el espacio en blanco superior e inferior, conservando los colores actuales (negro + magenta). Aspect ratio objetivo ~4.5:1 (p. ej. 900×200 px).

2. **Subir el nuevo asset** como `src/assets/walton-pagos-logo-wordmark.png` vía `lovable-assets`.

3. **Reemplazar la URL** del logo en todas las plantillas y en `EmailPreview.tsx`:
   - URL antigua: `537d82b2-…/walton-pagos-logo-pink.png`
   - URL nueva: `<nuevo asset id>/walton-pagos-logo-wordmark.png`

4. **Ajustar dimensiones de render** en los 10 templates + `EmailPreview.tsx`:
   - De `width="180" height="27"` (deformado) a `width="180" height="40"` (proporción real ~4.5:1).
   - Actualizar el `style="height:27px;width:180px;"` inline en la misma etiqueta `<img>`.

5. **Eliminar el asset antiguo** (`walton-pagos-logo-pink.png.asset.json`) para limpiar.

## Archivos a modificar

- Crear: `src/assets/walton-pagos-logo-wordmark.png.asset.json`
- Eliminar: `src/assets/walton-pagos-logo-pink.png.asset.json`
- Editar: los 10 `email-templates/*.html` + `src/pages/EmailPreview.tsx`

## Verificación

Tras los cambios, abrir `/email-preview` y confirmar que el logo se ve nítido, proporcionado y centrado sobre el header blanco en todas las plantillas.
