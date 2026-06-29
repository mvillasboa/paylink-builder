Implementar en `src/pages/mobile-app/MobileLogin.tsx` la dirección visual seleccionada por el usuario.

Cambios concretos:

1. Eliminar el fondo degradado (`bg-gradient-to-b ...`) del contenedor del login y usar un fondo limpio consistente con la app (por ejemplo `bg-background` o un sutil `bg-muted/30`).
2. Reemplazar el botón de "Registrarse" secundario cyan por un botón sólido color esmeralda (`bg-emerald-500` / `hover:bg-emerald-600` con texto blanco), manteniendo su forma `rounded-xl` y ancho completo.
3. Ajustar el estilo de los inputs para que sean limpios, con bordes sutiles (`border-border`) y estado focus con anillo sutil, acorde a la dirección minimalista refinada.
4. Mantener el `PhoneFrame` envolvente y la funcionalidad existente (formulario de login, mostrar/ocultar contraseña, recuperación y registro simulado).
5. Verificar el resultado en el preview y ejecutar el typecheck para asegurar que no hay errores de build.

No se agrega ni cambia lógica de negocio; solo es refinado visual del login existente.