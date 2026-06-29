# Plan: color secundario en /app/login

## Qué se va a hacer
1. **Fondo con acento secundario**: reemplazar el degradado actual `from-primary/5 via-background to-background` por uno que incorpore el Cyan Tech (#14b8d4) como un resplandor suave en la parte superior, manteniendo la legibilidad y el look financiero de Walpay.
2. **CTA secundario con presencia**: convertir el botón "Ingresar con biometría" —actualmente outline— en un botón secundario sólido con fondo `secondary` y texto `secondary-foreground`, para que el cyan aparezca como color de acción alternativa.
3. **Icono de marca con halo sutil**: agregar un `shadow-glow` (definido en `index.css`) al recuadro de la marca para reforzar el acento cyan sin saturar.

## Archivos a editar
- `src/pages/mobile-app/MobileLogin.tsx`: degradado de fondo, variante del botón biométrico, sombra del logo.

## Criterios de aceptación
- El login móvil muestra un fondo que degrada desde un tinte cyan sutil hacia el fondo base de la app.
- El botón de biometría usa el color secundario del sistema de diseño.
- No se agregan colores hardcodeados; solo se usan tokens `bg-secondary`, `text-secondary-foreground`, `from-secondary/15`, `shadow-glow`, etc.
- Se mantiene el contraste y la accesibilidad en ambos temas (claro/oscuro).