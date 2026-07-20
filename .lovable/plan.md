# Flujo de registro y KYC — App móvil (/app)

Diseño de un onboarding progresivo, con mockData (sin backend), coherente con el look actual de `/app` (Walpay: azul #004684 + menta #20c997) y usando el `PhoneFrame`.

## Objetivo

Convertir a un visitante en un usuario verificado con KYC nivel medio (datos personales + email + teléfono + selfie + CI anverso/reverso), en pasos cortos con progreso visible, guardando el estado en `localStorage` para que las pantallas sean navegables como demo.

## UX del flujo

Barra de progreso superior (paso N de 7) + botón "Atrás" + CTA principal por pantalla. Cada paso valida antes de avanzar. Al terminar, redirige a `/app` con banner "Verificación en revisión" o "Aprobada" (mock).

```text
/app/login
   │
   ├── "Registrate" ──► /app/signup                 (1) Email + contraseña
   │                        │
   │                        ▼
   │                    /app/onboarding/verify-email (2) OTP 6 dígitos
   │                        │
   │                        ▼
   │                    /app/onboarding/personal    (3) Nombre, apellido, fecha nac.
   │                        │
   │                        ▼
   │                    /app/onboarding/phone       (4) Teléfono + OTP SMS
   │                        │
   │                        ▼
   │                    /app/onboarding/document    (5) CI: anverso + reverso
   │                        │
   │                        ▼
   │                    /app/onboarding/selfie      (6) Selfie con prueba de vida
   │                        │
   │                        ▼
   │                    /app/onboarding/review      (7) Resumen + T&C + Enviar
   │                        │
   │                        ▼
   │                    /app/onboarding/status      Estado: en revisión / aprobado
   │                        │
   │                        ▼
   │                    /app  (home)
```

## Pantallas (detalle de contenido)

1. **Signup** — email, contraseña, confirmar contraseña, checkbox T&C. Validación con `zod`.
2. **Verify email** — 6 inputs OTP, reenviar en 30s, código mock aceptado: `123456`.
3. **Datos personales** — nombre, apellido, fecha de nacimiento (mayoría de edad), nacionalidad (default Paraguay), género (opcional).
4. **Teléfono** — prefijo +595, número, OTP SMS (mock `123456`).
5. **Documento (CI)** — dos "cámaras mock": tarjetas con ícono de cámara que al tocar simulan captura y muestran una miniatura placeholder. Muestra número de CI y fecha de emisión (inputs).
6. **Selfie** — círculo guía con ícono de cara + botón "Capturar" que muestra placeholder. Nota de prueba de vida ("parpadeá y sonreí").
7. **Review** — checklist de todo lo cargado + T&C/Política de privacidad + botón "Enviar verificación".
8. **Status** — estado en revisión (spinner + tiempo estimado 24-48h) con CTA "Ir al inicio". Segundo estado mockeable: "Aprobado" con check verde.

## Componentes nuevos

- `src/components/mobile-app/onboarding/OnboardingLayout.tsx` — header con back + barra de progreso + slot.
- `src/components/mobile-app/onboarding/OtpInput.tsx` — 6 casillas.
- `src/components/mobile-app/onboarding/DocumentCapture.tsx` — tarjeta captura anverso/reverso (mock).
- `src/components/mobile-app/onboarding/SelfieCapture.tsx` — placeholder con guía circular.
- `src/components/mobile-app/onboarding/StepBadge.tsx` — indicador "Paso X de 7".

## Estado y datos

- `src/hooks/useOnboarding.ts` — hook con `useState` + `localStorage` (`walpay.onboarding`) para persistir email, teléfono, datos personales, flags `emailVerified`, `phoneVerified`, `documentUploaded`, `selfieUploaded`, `kycStatus` (`draft` | `submitted` | `in_review` | `approved` | `rejected`).
- `src/data/mockOnboarding.ts` — constantes: OTP válido, tiempos, mensajes.
- Sin cambios de backend, sin migraciones.

## Rutas (en `src/App.tsx`)

Nuevas rutas públicas bajo `/app` (no requieren auth real por ser mock):

- `/app/signup`
- `/app/onboarding/verify-email`
- `/app/onboarding/personal`
- `/app/onboarding/phone`
- `/app/onboarding/document`
- `/app/onboarding/selfie`
- `/app/onboarding/review`
- `/app/onboarding/status`

Actualizar `MobileLogin.tsx`: el botón "Registrarse" (menta) navega a `/app/signup` en vez del `toast`.

## Diseño

- Reutiliza tokens de `PhoneFrame` (azul primario Walpay, menta `#20c997` para acciones de éxito/avance final).
- Botón primario azul en avance normal; menta en "Enviar verificación" y "Aprobado".
- Iconografía `lucide-react`: `Mail`, `Phone`, `IdCard`, `Camera`, `ShieldCheck`, `CheckCircle2`.
- Toasts con `sonner` en cada validación.

## Fuera de alcance

- Persistencia real, subida de archivos, integración con proveedor KYC (Truora/Metamap/etc.), verificación biométrica real.
- Flujo para personas jurídicas (RUC).
