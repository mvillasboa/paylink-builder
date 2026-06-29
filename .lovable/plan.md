## Problema

El asset `walpay-mark.png` es un cuadrado de 1920×1920 px con la marca centrada ocupando solo ~1336×386 px. El resto es padding vacío. Por eso, con `h-20 w-auto` en `/app/login`, el wordmark se renderiza a ~16 px de alto dentro de una caja de 80×80.

## Solución

1. Descargar el PNG actual del CDN, autorecortarlo a la caja real de contenido (~1336×386, ratio ~3.46:1) con un pequeño margen de seguridad, y subirlo como nuevo asset `walpay-mark.png` reemplazando el pointer `src/assets/walpay-mark.png.asset.json`.
2. Ajustar el `<img>` en `src/pages/mobile-app/MobileLogin.tsx` para usar una altura adecuada al nuevo aspect ratio horizontal (por ejemplo `h-12 w-auto`, que dará un wordmark de ~166 px de ancho y se verá nítido y centrado).
3. Verificar visualmente con un screenshot del preview en `/app/login`.

No se tocan otras pantallas: este asset solo se usa en `MobileLogin.tsx`.
