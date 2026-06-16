# Mejorar contraste del header de los correos

Actualmente el header usa fondo Deep Navy (`#0a1929`) con el logo blanco. Lo cambiamos a un header claro para mayor contraste y aire visual.

## Cambios de diseño

- **Fondo del header:** `#0a1929` → `#f8fafc` (gris muy claro)
- **Logo:** versión blanca → versión a color (`walton-pagos-logo.png`)
- **Línea divisoria:** agregar `border-bottom: 1px solid #e2e8f0` al header para separarlo del contenido
- **Sin tocar** el resto del diseño: status bar, contenido, CTAs y footer permanecen igual

## Archivos a modificar

**Templates HTML (10 archivos):**
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

**Vista previa:**
- `src/pages/EmailPreview.tsx` — sincronizar los strings HTML inlineados para que el preview refleje el nuevo header.

## Detalles técnicos

En cada template, reemplazar en el `<style>` y en los estilos inline del `<td class="header">`:

```css
.header {
  background-color: #f8fafc;       /* antes #0a1929 */
  padding: 24px 32px;
  text-align: center;
  border-bottom: 1px solid #e2e8f0; /* nuevo */
}
```

Y en el `<img>` del logo:

```html
<img src="/__l5e/assets-v1/.../walton-pagos-logo.png"
     alt="Walton Pagos" width="180" height="27"
     style="display:block;border:0;outline:none;height:27px;width:180px;margin:0 auto;" />
```

(URL exacta del CDN se toma de `src/assets/walton-pagos-logo.png.asset.json`.)
