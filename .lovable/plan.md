# Plan: Correos operativos al comercio

Crear 4 templates HTML estáticos en `email-templates/` e integrarlos al selector de `src/pages/EmailPreview.tsx`. Son notificaciones operativas dirigidas al comercio (no al pagador), por lo que usan un estilo más sobrio que los del pagador.

## Lineamientos comunes

- **Audiencia:** comercio adherido a Walpay.
- **Tono:** notificación operativa, sobrio, foco en datos.
- **Layout:** header Walpay compacto + título + bloque de datos tipo ficha (label/valor en dos columnas) + bloque contextual breve + footer. Sin íconos grandes de éxito/alerta; solo una barra de estado delgada con color según el caso.
- **Sin CTA:** correos puramente informativos, ningún botón.
- **Colores:**
  - Base: Deep Navy `#0a1929` (header/títulos), gris `#475569` (texto), fondos `#f8fafc`.
  - Status bar por caso: verde sobrio (registro/pago), slate (baja por usuario), ámbar (rechazo).
- **Datos del pagador incluidos en todos:** nombre, email, tarjeta terminada en `[XXXX]`, ID de suscripción `[SUB_ID]`.
- **Placeholders:** `[COMERCIO]`, `[PAGADOR_NOMBRE]`, `[PAGADOR_EMAIL]`, `[XXXX]`, `[SUB_ID]`, `[FECHA]`, `[MONTO]`, `[MOTIVO]`.
- **Footer estándar:** "Notificación automática para el comercio. No responder a este correo."

## Templates a crear

### 1. `email-templates/07-comercio-registro-tarjeta.html`
- **Asunto:** `Nueva tarjeta registrada — [PAGADOR_NOMBRE]`
- **Preheader:** `Un pagador registró su tarjeta para pagos recurrentes.`
- **Estado:** "Tarjeta registrada" (verde sobrio).
- **Mensaje:** "[PAGADOR_NOMBRE] registró su tarjeta terminada en [XXXX] para pagos recurrentes en [COMERCIO]."
- **Datos:** Pagador, Email, Tarjeta, ID suscripción, Fecha de alta.

### 2. `email-templates/08-comercio-confirmacion-pago.html`
- **Asunto:** `Pago recibido — Gs. [MONTO] de [PAGADOR_NOMBRE]`
- **Preheader:** `Se procesó un pago recurrente exitosamente.`
- **Estado:** "Pago procesado" (verde sobrio).
- **Mensaje:** "Se procesó un pago de Gs. [MONTO] de [PAGADOR_NOMBRE] con tarjeta terminada en [XXXX]."
- **Datos:** Pagador, Email, Monto, Tarjeta, ID suscripción, Fecha de pago.

### 3. `email-templates/09-comercio-inactivacion-usuario.html`
- **Asunto:** `Tarjeta inactivada por el pagador — [PAGADOR_NOMBRE]`
- **Preheader:** `El pagador dio de baja su tarjeta para esta suscripción.`
- **Estado:** "Tarjeta inactivada por el pagador" (slate).
- **Mensaje:** "[PAGADOR_NOMBRE] solicitó la inactivación de su tarjeta terminada en [XXXX] para [COMERCIO]. No se procesarán nuevos cobros con esta tarjeta."
- **Datos:** Pagador, Email, Tarjeta, ID suscripción, Fecha de inactivación.
- **Nota:** "Esta inactivación no afecta pagos ya procesados ni el estado contractual de la suscripción." (alineado con regla core: charge failures/altas no cancelan suscripción).

### 4. `email-templates/10-comercio-inactivacion-rechazo.html`
- **Asunto:** `Tarjeta inactivada por rechazo — [PAGADOR_NOMBRE]`
- **Preheader:** `Una tarjeta fue inactivada tras un rechazo de pago.`
- **Estado:** "Tarjeta inactivada por rechazo" (ámbar sobrio).
- **Mensaje:** "No se pudo procesar el pago de [PAGADOR_NOMBRE] con la tarjeta terminada en [XXXX]. La tarjeta fue inactivada para [COMERCIO]."
- **Datos:** Pagador, Email, Tarjeta, ID suscripción, Fecha del rechazo, **Motivo del rechazo: [MOTIVO]**.
- **Nota:** "Se notificó al pagador con un enlace para actualizar su medio de pago. La suscripción permanece activa contractualmente."

## Integración en EmailPreview

Editar `src/pages/EmailPreview.tsx`:
- Agregar 4 entradas al objeto `emailTemplates` con keys: `comercio-registro`, `comercio-pago`, `comercio-inactivacion-usuario`, `comercio-inactivacion-rechazo`.
- Agregar los 4 asuntos a `templateSubjects`.
- Agregar 4 `<option>` al `<select>`, agrupadas visualmente como "Comercio" (07–10).

## Notas técnicas

- HTML email-safe (tablas, estilos inline donde corresponde, media query única para mobile), consistente con templates 01–06 ya existentes.
- No se toca lógica de envío ni edge functions; son solo plantillas estáticas para el preview, igual que los 6 anteriores.
