## Objetivo

Diseñar cómo se ve el **Resumen de Suscripción** que Atención al Cliente enviaría en PDF a un cliente. Solo diseño, con datos mock, sin conectar a la base.

## Cómo se verá / cómo se prueba

Nueva ruta `/reporte-suscripcion` que muestra el documento en formato hoja A4 sobre fondo gris, con un botón "Descargar PDF" que abre el diálogo de impresión del navegador (guardar como PDF). Estilos de impresión para que salga limpio, sin la barra ni el fondo.

## Contenido del documento (una hoja, dos si el historial es largo)

```text
┌──────────────────────────────────────────────┐
│ [logo Wpagos]        Resumen de suscripción  │
│                      Emitido: 29/07/2026     │
├──────────────────────────────────────────────┤
│ COMERCIO                                     │
│ Nombre de fantasía · Razón social · RUC      │
│ Contacto de atención del comercio            │
├──────────────────────────────────────────────┤
│ SUSCRIPCIÓN                                  │
│ Referencia   Estado (Activa)                 │
│ Concepto / detalle                           │
│ Monto  ·  Frecuencia  ·  Día de cobro        │
│ Inicio  ·  Próximo cobro                     │
│ Medio de pago: VISA •••• 4242                │
├──────────────────────────────────────────────┤
│ PROGRESO DE CUOTAS                           │
│ 3 de 6 pagadas   [▓▓▓░░░]   Pagado: Gs. X    │
│                              Pendiente: Gs. Y│
├──────────────────────────────────────────────┤
│ CUOTAS PAGADAS                               │
│ #  Vencimiento   Fecha de pago   Monto       │
├──────────────────────────────────────────────┤
│ CUOTAS PENDIENTES                            │
│ #  Vencimiento   Monto                       │
├──────────────────────────────────────────────┤
│ Pie institucional: Walton Capital S.A. es la │
│ plataforma tecnológica que procesa el cobro; │
│ el servicio lo presta el comercio. Consultas │
│ del servicio → comercio. WhatsApp soporte.   │
└──────────────────────────────────────────────┘
```

Decisiones de contenido, según lo indicado:
- Sin cobros fallidos, sin códigos del procesador, sin notas internas, sin IDs internos (solo la referencia de la suscripción).
- Tono claro para el cliente pagador: qué paga, a quién, cuándo y cuánto le queda.
- Montos en Guaraníes con el formato ya usado en el proyecto.

## Detalles técnicos

- `src/data/mockSubscriptionReport.ts`: objeto mock con comercio (razón social, nombre de fantasía, RUC, contacto), suscripción (referencia, concepto, monto, frecuencia, estado, próximo cobro, tarjeta) y arreglo de cuotas con `numero`, `vencimiento`, `fechaPago`, `monto`, `estado`.
- `src/components/reports/SubscriptionSummaryDocument.tsx`: el documento en sí (ancho A4, tipografía y tokens semánticos del design system, azul de marca en encabezados de tabla).
- `src/pages/SubscriptionReportPreview.tsx`: envuelve el documento, botón de impresión y nota de "vista previa".
- Estilos `@media print` en `src/index.css` (o clases utilitarias locales) para ocultar controles y forzar márgenes.
- Ruta registrada en `src/App.tsx`.

Si después querés generarlo desde el detalle de una suscripción con datos reales, el mismo componente sirve recibiendo props.
