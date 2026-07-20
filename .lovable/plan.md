## Agrandar logo en el Hero

**Archivo:** `src/components/Hero.tsx`

**Cambio:** aumentar el tamaño del logo dentro del recuadro blanco existente.

- Alturas actuales: `h-16 sm:h-20 lg:h-24` (64 / 80 / 96 px)
- Alturas nuevas: `h-32 sm:h-40 lg:h-48` (128 / 160 / 192 px) — ~2x
- Ajustar padding del recuadro blanco de `px-6 py-4` a `px-10 py-6` para que respire proporcional al logo nuevo.
- Mantener `rounded-2xl` y `shadow-strong`.
- Sin cambios en assets ni en otros componentes.

**Resultado esperado:** el logo W pagos pasa a ser protagonista del Hero sobre el fondo navy, conservando el recuadro blanco para contraste.