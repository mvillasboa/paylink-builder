## Objetivo
Reemplazar el logo actual de Walpay por el nuevo logo "Wpagos" en toda la aplicación excepto en `/app/login` (que queda intacto). Ajustar la paleta del homepage para armonizar con el azul del nuevo logo.

## Análisis del nuevo logo
- "W" en negro con `®`
- Bloque azul sólido con "pagos" en blanco
- Tono azul aproximado: `#1F3D7A` (navy medio, no cyan)

Encaja muy bien con la paleta actual Deep Navy (`#0a1929`) — solo hace falta ajustar el acento (hoy `#14b8d4` cyan) para que no compita con el azul del logo.

## Cambios

### 1. Subir el nuevo logo como asset CDN
- `src/assets/wpagos-logo.png.asset.json` — desde `/mnt/user-uploads/Image_2_1.png` usando `lovable-assets create`.

### 2. Reemplazar el logo en los siguientes archivos
- `src/components/Navbar.tsx` → usar `wpagos-logo` en lugar de `logo-walpay-color`.
- `src/components/Hero.tsx` → reemplazar el `img` que apunta a `/lovable-uploads/1b33ddca-…` por el nuevo logo (versión adecuada al fondo oscuro; usar el mismo asset — el fondo blanco del bloque lo integra bien, o envolver en contenedor blanco con padding si hace falta contraste).
- `src/components/Footer.tsx` → reemplazar el `img` `/lovable-uploads/a3bf07a1-…` por el nuevo asset.
- `src/pages/Auth.tsx` → reemplazar `logo-walpay-color` por el nuevo.
- `src/components/dashboard/DashboardLayout.tsx` → reemplazar `logo-walpay-color` por el nuevo; mantener el texto "Walpay" del sidebar tal cual (el nombre del producto no cambia).

### 3. NO tocar
- `src/pages/mobile-app/MobileLogin.tsx` (walpay-mark) — pedido explícito.
- `index.html` metadatos — el nombre del producto sigue siendo Walpay.
- `src/data/mockOnboarding.ts` (solo una key de localStorage).

### 4. Ajuste de paleta del homepage
En `src/index.css`, dentro del scope global (no del `/app`):
- Sustituir el acento cyan (`--secondary` / `--accent` usados como `#14b8d4`) por un azul intermedio derivado del logo (`#2E5AAB` aprox.) para dar cohesión con el nuevo azul del logo.
- Ajustar `--gradient-hero` y `--gradient-primary` para transitar de `#0a1929` (Deep Navy) a `#1F3D7A` (azul del logo), eliminando el salto al cyan.
- Mantener el ícono `Shield` del Hero (`text-accent`) legible con el nuevo tono.

Esto afecta al homepage (`Hero`, `Features`, `CTA`, `TrustBadges`, `Footer`) y a `Auth`, `Navbar`, `Dashboard*`. La app móvil (`/app/*`) no se ve afectada porque `PhoneFrame` re-scopea sus propios tokens.

## Verificación
- Screenshot de `/` (homepage) y `/auth` con Playwright para confirmar que el logo se ve nítido y la nueva paleta luce coherente.
- Confirmar que `/app/login` sigue mostrando el logo actual sin cambios.
