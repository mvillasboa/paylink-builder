# Sincronizar /email-templates con EmailPreview

## Problema
Los cambios recientes (correos 04 y 05, más los ajustes previos de contacto/WhatsApp) se aplicaron solo a `src/pages/EmailPreview.tsx`. Los archivos sueltos en `email-templates/*.html` quedaron con la versión original, por eso "el código no se actualiza".

## Alcance
Regenerar los 10 HTML de `email-templates/` para que sean copia fiel de los strings de plantilla definidos en `src/pages/EmailPreview.tsx` (única fuente de verdad de aquí en más).

Archivos a reescribir:
- `email-templates/01-link-suscripcion-tarjeta.html`
- `email-templates/02-confirmacion-suscripcion-tarjeta.html`
- `email-templates/03-confirmacion-suscripcion-monto-frecuencia.html`
- `email-templates/04-confirmacion-pago.html`
- `email-templates/05-inactivacion-tarjeta.html`
- `email-templates/06-inactivacion-tarjeta-rechazo.html`
- `email-templates/07-comercio-registro-tarjeta.html`
- `email-templates/08-comercio-confirmacion-pago.html`
- `email-templates/09-comercio-inactivacion-usuario.html`
- `email-templates/10-comercio-inactivacion-rechazo.html`

## Cómo
1. Leer `src/pages/EmailPreview.tsx` completo y extraer cada string de plantilla del objeto de templates.
2. Sobrescribir cada archivo `.html` correspondiente con el contenido exacto de su template (mismos placeholders `[PAGADOR_NOMBRE]`, `[COMERCIO]`, etc.).
3. No modificar `EmailPreview.tsx` ni otras partes de la app.

## Resultado esperado
- `email-templates/05-inactivacion-tarjeta.html` reflejará: encabezado "MEDIO DE PAGO INACTIVADO", saludo personalizado, comprobante con Comercio / Razón Social / RUC / medio de pago / fecha, bloque "Consultas sobre el servicio" con email + teléfono + WhatsApp, y footer institucional actualizado. Sin el bloque "¿No solicitaste esta inactivación?".
- `04-confirmacion-pago.html` reflejará el comprobante actual sin Concepto ni N.º de operación, con un único teléfono de contacto Walton, etc.
- Los otros 8 quedarán idénticos al preview.
