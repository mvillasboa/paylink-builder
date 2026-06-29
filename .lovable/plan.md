
## Objetivo
Reemplazar el placeholder "W" del login por el logo oficial **W pagos** y unificar la colorimetría de todas las pantallas de `/app` con el azul real de la marca.

## Análisis del logo
- Azul principal del bloque: **#004684** (RGB 0,70,132) — un azul royal/cobalto medio.
- Marca negra sobre fondo blanco, sin acentos cyan.
- Conclusión: el actual Deep Navy `#0a1929` es demasiado oscuro y el Cyan Tech `#14b8d4` choca con la identidad. Conviene desplazar el primario hacia el azul del logo y atenuar el cyan a un acento mínimo (o eliminarlo del mobile).

## Paleta propuesta para `/app`
| Token | Hoy | Propuesto | Uso |
|---|---|---|---|
| `--primary` (mobile) | #0a1929 | **#004684** (azul logo) | Botones primarios, headers, íconos activos |
| `--primary-glow` | cyan | **#1e6fb8** (azul claro derivado) | Halos, gradientes suaves |
| `--secondary` | cyan #14b8d4 | **#e8f0f8** (azul muy claro) | Fondos de chips, superficies |
| Acento de éxito (Registrarse) | emerald | **emerald #10b981** (sin cambios) | Mantiene contraste con el azul |
| Fondo | #ffffff | sin cambios | — |
| Texto principal | foreground | #0a1929 | Mantiene legibilidad |

## Cambios

### 1. Asset del logo
- Subir `Logo_W_Pagos_-_azul_oscuro.png` como asset CDN: `src/assets/walpay-logo-mark.png.asset.json`.
- Reutilizable en login, header del perfil y splash.

### 2. `MobileLogin.tsx`
- Reemplazar el cuadrado con "W" por `<img>` del logo (alto ~56px, centrado).
- Eliminar el `shadow-glow` cyan; usar sombra suave neutra.
- Botón "Iniciar sesión" pasa a `bg-[#004684]` (vía token `--primary` actualizado).
- Botón "Registrarse" se mantiene en verde esmeralda (acento complementario).

### 3. Tokens del mobile app
- En `src/components/mobile-app/PhoneFrame.tsx` (o el `index.css` scoped a `/app` si existe), redefinir las variables CSS dentro del wrapper `.mobile-app-scope` para no afectar el resto del sitio:
  ```css
  .mobile-app-scope {
    --primary: 210 100% 26%;        /* #004684 */
    --primary-foreground: 0 0% 100%;
    --primary-glow: 210 70% 42%;    /* #1e6fb8 */
    --secondary: 210 40% 96%;
    --secondary-foreground: 210 100% 20%;
    --ring: 210 100% 26%;
  }
  ```
- Aplicar la clase `mobile-app-scope` al contenedor raíz de `PhoneFrame`.

### 4. Revisión de pantallas
Verificar y reemplazar referencias hardcodeadas a cyan/navy si las hay:
- `MobileHome.tsx`, `MobileCards.tsx`, `MobileSubscriptions.tsx`, `MobilePayments.tsx`, `MobileProfile.tsx`, `MobileTabBar.tsx`, `MobileHeader.tsx`.
- Cambiar cualquier `text-cyan-*`, `bg-cyan-*`, `#14b8d4`, `#0a1929` literal por tokens semánticos (`text-primary`, `bg-primary`, etc.) para que herede la nueva paleta.

### 5. Memoria
- Actualizar `mem://style/color-palette` y el Core del index para reflejar que **dentro de `/app`** el primario es `#004684` (azul logo), mientras el resto del producto sigue usando Deep Navy + Cyan Tech.

## Fuera de alcance
- Emails transaccionales (ya usan el wordmark horizontal con franja rosa/azul — sin cambios).
- Landing y dashboard web del comercio (mantienen Deep Navy + Cyan Tech).

¿Avanzo con esto o querés que también propague el nuevo azul al resto del producto (landing + dashboard)?
