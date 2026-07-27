## Objetivo

Poder editar los textos del Centro de Ayuda (`/app/help`) sin tocar la pantalla ni el código de la interfaz. Los textos actuales se mantienen tal cual: solo cambia dónde viven.

## Qué se hace

**1. Nuevo archivo de contenido: `src/data/helpContent.ts`**

Un único lugar con todo lo editable:

```text
helpWhatsApp   -> número + mensaje precargado del botón de WhatsApp
helpSchedule   -> "Atención de lunes a viernes de 8:00 a 18:00"
helpCategories -> lista de categorías (nombre + ícono)
helpFaqs       -> lista de preguntas: { categoría, pregunta, respuesta }
```

Cada entrada queda comentada y ordenada por categoría, de modo que agregar, borrar o reescribir una pregunta sea editar unas pocas líneas de texto.

**2. `src/pages/mobile-app/MobileHelp.tsx` pasa a leer del archivo**

Se eliminan las constantes internas (`WHATSAPP_URL`, `categories`, `faqs`) y la pantalla las importa desde `helpContent.ts`. El diseño, buscador, filtros y acordeón quedan exactamente igual.

**3. Robustez ante la edición**

- Las categorías se derivan de la lista de FAQs, para que borrar todas las preguntas de una categoría no deje un filtro vacío.
- Si una FAQ usa una categoría no listada, igual se muestra (no se pierde contenido por un typo).
- El botón de WhatsApp arma la URL a partir del número y el mensaje, sin necesidad de escribir el encoding a mano.

## Cómo lo vas a editar después

- **Cambiar un texto:** abrís `src/data/helpContent.ts`, editás la respuesta entre comillas.
- **Agregar una FAQ:** copiás un bloque existente y cambiás `question` y `answer`.
- **Quitar una FAQ:** borrás su bloque.
- **Cambiar el WhatsApp o el horario:** una línea al inicio del archivo.

También podés pedirme los cambios por chat indicando la pregunta y el nuevo texto; con todo centralizado en un archivo es una edición puntual.

## Fuera de alcance

- No se corrigen ni reescriben los textos actuales (pedido explícito).
- No se crea panel de administración ni se guarda el contenido en la base de datos. Queda disponible como paso siguiente si más adelante querés que lo edite alguien sin tocar código.
