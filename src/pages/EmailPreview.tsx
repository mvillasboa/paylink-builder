import { useEffect, useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const mockData: Record<string, string> = {
  COMERCIO: "Gimnasio PowerFit",
  LINK: "https://waltonpagos.com/register/abc123",
  CONTACTO: "soporte@powerfit.com",
  MONTO: "125.000",
  FRECUENCIA: "mensual",
  XXXX: "4567",
  FECHA: "14 de junio de 2026",
  PAGADOR_NOMBRE: "Juan Pérez",
  PAGADOR_EMAIL: "juan.perez@email.com",
  SUB_ID: "sub_8f3a2b1c9d",
  MOTIVO: "Fondos insuficientes",
};

const emailTemplates: Record<string, string> = {
  "link-suscripcion": `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>[COMERCIO] te invita a registrar tu tarjeta</title>
  <style>
    body { margin: 0; padding: 0; background-color: #f4f6f8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; }
    .wrapper { width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; }
    .header { background-color: #0a1929; padding: 24px 32px; text-align: center; }
    .header-logo { color: #ffffff; font-size: 20px; font-weight: 700; letter-spacing: 0.5px; }
    .header-accent { color: #14b8d4; }
    .status-bar { background-color: #e6f7fa; border-left: 4px solid #14b8d4; padding: 12px 32px; }
    .status-text { color: #0a1929; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.8px; }
    .content { padding: 32px; }
    .heading { color: #0a1929; font-size: 22px; font-weight: 700; line-height: 1.3; margin: 0 0 20px 0; }
    .body-text { color: #4a5568; font-size: 15px; line-height: 1.6; margin: 0 0 24px 0; }
    .cta-button { display: inline-block; background-color: #14b8d4; color: #ffffff !important; text-decoration: none; font-size: 15px; font-weight: 600; padding: 14px 32px; border-radius: 6px; text-align: center; }
    .cta-wrapper { text-align: center; margin: 28px 0; }
    .link-fallback { color: #4a5568; font-size: 12px; text-align: center; word-break: break-all; margin-top: 12px; }
    .link-fallback a { color: #14b8d4; text-decoration: underline; }
    .info-box { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 20px; margin: 24px 0; }
    .info-box-title { color: #0a1929; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.6px; margin: 0 0 8px 0; }
    .info-box-text { color: #4a5568; font-size: 13px; line-height: 1.5; margin: 0; }
    .alt-action { background-color: #fff8e6; border: 1px solid #fde68a; border-radius: 6px; padding: 16px 20px; margin: 24px 0 0 0; }
    .alt-action-text { color: #92400e; font-size: 13px; line-height: 1.5; margin: 0; }
    .alt-action-text a { color: #14b8d4; text-decoration: underline; }
    .footer { background-color: #f4f6f8; padding: 20px 32px; text-align: center; }
    .footer-text { color: #94a3b8; font-size: 11px; line-height: 1.5; margin: 0; }
    @media screen and (max-width: 600px) {
      .content, .header, .status-bar, .footer { padding-left: 20px !important; padding-right: 20px !important; }
      .heading { font-size: 20px !important; }
      .cta-button { display: block !important; width: 100% !important; padding-left: 0 !important; padding-right: 0 !important; }
    }
  </style>
</head>
<body>
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
    <tr>
      <td align="center" style="padding: 20px 0; background-color: #f4f6f8;">
        <table role="presentation" class="wrapper" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px;">
          <tr>
            <td class="header" style="background-color: #0a1929; padding: 24px 32px; text-align: center;">
              <div class="header-logo">Walton <span class="header-accent">Pagos</span></div>
            </td>
          </tr>
          <tr>
            <td class="status-bar" style="background-color: #e6f7fa; border-left: 4px solid #14b8d4; padding: 12px 32px;">
              <div class="status-text">Registro de tarjeta pendiente</div>
            </td>
          </tr>
          <tr>
            <td class="content" style="padding: 32px;">
              <h1 class="heading">Completá tu registro de tarjeta</h1>
              <p class="body-text">
                <strong style="color: #0a1929;">[COMERCIO]</strong> te invita a registrar tu tarjeta para pagos recurrentes. Para completar la suscripción, ingresá al siguiente enlace seguro:
              </p>
              <div class="cta-wrapper">
                <a href="[LINK]" class="cta-button" style="background-color: #14b8d4; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 600; padding: 14px 32px; border-radius: 6px; display: inline-block;">Registrar mi tarjeta</a>
              </div>
              <p class="link-fallback">
                Si el botón no funciona, copiá y pegá este enlace en tu navegador:<br>
                <a href="[LINK]">[LINK]</a>
              </p>
              <div class="info-box">
                <div class="info-box-title">¿Qué estás autorizando?</div>
                <p class="info-box-text">
                  Al registrar tu tarjeta, autorizás que <strong>[COMERCIO]</strong> pueda procesar pagos recurrentes conforme a las condiciones informadas.
                </p>
              </div>
              <div class="alt-action">
                <p class="alt-action-text">
                  Si no reconocés esta solicitud, podés ignorar este mensaje o comunicarte con: <a href="mailto:[CONTACTO]">[CONTACTO]</a>.
                </p>
              </div>
            </td>
          </tr>
          <tr>
            <td class="footer" style="background-color: #f4f6f8; padding: 20px 32px; text-align: center;">
              <p class="footer-text">
                Este correo fue enviado automáticamente por Walton Pagos a solicitud de <strong>[COMERCIO]</strong>.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
  "confirmacion-suscripcion": `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>Tu tarjeta fue registrada correctamente</title>
  <style>
    body { margin: 0; padding: 0; background-color: #f4f6f8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; }
    .wrapper { width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; }
    .header { background-color: #0a1929; padding: 24px 32px; text-align: center; }
    .header-logo { color: #ffffff; font-size: 20px; font-weight: 700; letter-spacing: 0.5px; }
    .header-accent { color: #14b8d4; }
    .status-bar { background-color: #ecfdf5; border-left: 4px solid #10b981; padding: 12px 32px; }
    .status-text { color: #0a1929; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.8px; }
    .content { padding: 32px; }
    .success-icon { text-align: center; margin-bottom: 24px; }
    .success-circle { display: inline-flex; align-items: center; justify-content: center; width: 64px; height: 64px; background-color: #ecfdf5; border-radius: 50%; }
    .success-check { color: #10b981; font-size: 32px; line-height: 1; }
    .heading { color: #0a1929; font-size: 22px; font-weight: 700; line-height: 1.3; margin: 0 0 20px 0; text-align: center; }
    .body-text { color: #4a5568; font-size: 15px; line-height: 1.6; margin: 0 0 24px 0; text-align: center; }
    .details-box { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 20px; margin: 24px 0; }
    .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e2e8f0; }
    .detail-row:last-child { border-bottom: none; }
    .detail-label { color: #94a3b8; font-size: 13px; font-weight: 600; }
    .detail-value { color: #0a1929; font-size: 14px; font-weight: 600; }
    .info-box { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 20px; margin: 24px 0; }
    .info-box-text { color: #4a5568; font-size: 14px; line-height: 1.5; margin: 0; }
    .security-box { background-color: #fffbeb; border: 1px solid #fcd34d; border-radius: 6px; padding: 16px 20px; margin: 24px 0 0 0; }
    .security-text { color: #92400e; font-size: 13px; line-height: 1.5; margin: 0; }
    .contact-cta { text-align: center; margin: 24px 0 0 0; }
    .contact-link { color: #14b8d4; font-size: 14px; font-weight: 600; text-decoration: none; }
    .footer { background-color: #f4f6f8; padding: 20px 32px; text-align: center; }
    .footer-text { color: #94a3b8; font-size: 11px; line-height: 1.5; margin: 0; }
    @media screen and (max-width: 600px) {
      .content, .header, .status-bar, .footer { padding-left: 20px !important; padding-right: 20px !important; }
      .heading { font-size: 20px !important; }
      .detail-row { flex-direction: column; gap: 2px; }
    }
  </style>
</head>
<body>
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
    <tr>
      <td align="center" style="padding: 20px 0; background-color: #f4f6f8;">
        <table role="presentation" class="wrapper" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px;">
          <tr>
            <td class="header" style="background-color: #0a1929; padding: 24px 32px; text-align: center;">
              <div class="header-logo">Walton <span class="header-accent">Pagos</span></div>
            </td>
          </tr>
          <tr>
            <td class="status-bar" style="background-color: #ecfdf5; border-left: 4px solid #10b981; padding: 12px 32px;">
              <div class="status-text">Tarjeta registrada</div>
            </td>
          </tr>
          <tr>
            <td class="content" style="padding: 32px;">
              <div class="success-icon">
                <div class="success-circle" style="display: inline-block; text-align: center; width: 64px; height: 64px; background-color: #ecfdf5; border-radius: 50%; line-height: 64px;">
                  <span class="success-check" style="color: #10b981; font-size: 32px;">&#10003;</span>
                </div>
              </div>
              <h1 class="heading">¡Registro exitoso!</h1>
              <p class="body-text">
                Tu tarjeta terminada en <strong style="color: #0a1929;">[XXXX]</strong> fue registrada exitosamente para pagos recurrentes de <strong style="color: #0a1929;">[COMERCIO]</strong>.
              </p>
              <div class="details-box">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                          <td style="color: #94a3b8; font-size: 13px; font-weight: 600;">Comercio</td>
                          <td align="right" style="color: #0a1929; font-size: 14px; font-weight: 600;">[COMERCIO]</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                          <td style="color: #94a3b8; font-size: 13px; font-weight: 600;">Tarjeta</td>
                          <td align="right" style="color: #0a1929; font-size: 14px; font-weight: 600;">Terminada en [XXXX]</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0;">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                          <td style="color: #94a3b8; font-size: 13px; font-weight: 600;">Fecha</td>
                          <td align="right" style="color: #0a1929; font-size: 14px; font-weight: 600;">[FECHA]</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </div>
              <div class="info-box">
                <p class="info-box-text">
                  Desde ahora, los pagos autorizados por <strong>[COMERCIO]</strong> podrán procesarse con esta tarjeta.
                </p>
              </div>
              <div class="security-box">
                <p class="security-text">
                  <strong>Seguridad:</strong> Walton Pagos nunca solicitará el número completo de tu tarjeta, claves ni códigos de seguridad por correo.
                </p>
              </div>
              <div class="contact-cta">
                <a href="mailto:[CONTACTO]" class="contact-link" style="color: #14b8d4; font-size: 14px; font-weight: 600; text-decoration: none;">Consultas o baja: [CONTACTO]</a>
              </div>
            </td>
          </tr>
          <tr>
            <td class="footer" style="background-color: #f4f6f8; padding: 20px 32px; text-align: center;">
              <p class="footer-text">
                Este correo fue enviado automáticamente por Walton Pagos a solicitud de <strong>[COMERCIO]</strong>.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
  "confirmacion-suscripcion-monto": `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>Suscripción confirmada con [COMERCIO]</title>
  <style>
    body { margin: 0; padding: 0; background-color: #f4f6f8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; }
    .wrapper { width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; }
    .header { background-color: #0a1929; padding: 24px 32px; text-align: center; }
    .header-logo { color: #ffffff; font-size: 20px; font-weight: 700; letter-spacing: 0.5px; }
    .header-accent { color: #14b8d4; }
    .status-bar { background-color: #ecfdf5; border-left: 4px solid #10b981; padding: 12px 32px; }
    .status-text { color: #0a1929; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.8px; }
    .content { padding: 32px; }
    .success-icon { text-align: center; margin-bottom: 24px; }
    .success-circle { display: inline-block; text-align: center; width: 64px; height: 64px; background-color: #ecfdf5; border-radius: 50%; line-height: 64px; }
    .success-check { color: #10b981; font-size: 32px; }
    .heading { color: #0a1929; font-size: 22px; font-weight: 700; line-height: 1.3; margin: 0 0 20px 0; text-align: center; }
    .body-text { color: #4a5568; font-size: 15px; line-height: 1.6; margin: 0 0 24px 0; text-align: center; }
    .details-box { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 20px; margin: 24px 0; }
    .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e2e8f0; }
    .detail-row:last-child { border-bottom: none; }
    .detail-label { color: #94a3b8; font-size: 13px; font-weight: 600; }
    .detail-value { color: #0a1929; font-size: 14px; font-weight: 600; }
    .info-box { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 20px; margin: 24px 0; }
    .info-box-text { color: #4a5568; font-size: 14px; line-height: 1.5; margin: 0; }
    .contact-box { background-color: #e6f7fa; border: 1px solid #14b8d4; border-radius: 6px; padding: 16px 20px; margin: 24px 0 0 0; }
    .contact-box-text { color: #0a1929; font-size: 14px; line-height: 1.5; margin: 0; }
    .contact-box-text a { color: #14b8d4; text-decoration: none; font-weight: 600; }
    .footer { background-color: #f4f6f8; padding: 20px 32px; text-align: center; }
    .footer-text { color: #94a3b8; font-size: 11px; line-height: 1.5; margin: 0; }
    @media screen and (max-width: 600px) {
      .content, .header, .status-bar, .footer { padding-left: 20px !important; padding-right: 20px !important; }
      .heading { font-size: 20px !important; }
      .detail-row { flex-direction: column; gap: 2px; }
    }
  </style>
</head>
<body>
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
    <tr>
      <td align="center" style="padding: 20px 0; background-color: #f4f6f8;">
        <table role="presentation" class="wrapper" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px;">
          <tr>
            <td class="header" style="background-color: #0a1929; padding: 24px 32px; text-align: center;">
              <div class="header-logo">Walton <span class="header-accent">Pagos</span></div>
            </td>
          </tr>
          <tr>
            <td class="status-bar" style="background-color: #ecfdf5; border-left: 4px solid #10b981; padding: 12px 32px;">
              <div class="status-text">Suscripción activa</div>
            </td>
          </tr>
          <tr>
            <td class="content" style="padding: 32px;">
              <div class="success-icon">
                <div class="success-circle" style="display: inline-block; text-align: center; width: 64px; height: 64px; background-color: #ecfdf5; border-radius: 50%; line-height: 64px;">
                  <span class="success-check" style="color: #10b981; font-size: 32px;">&#10003;</span>
                </div>
              </div>
              <h1 class="heading">¡Suscripción confirmada!</h1>
              <p class="body-text">
                Tu tarjeta terminada en <strong style="color: #0a1929;">[XXXX]</strong> fue registrada exitosamente para pagos recurrentes de <strong style="color: #0a1929;">[COMERCIO]</strong>.<br>
                Monto: <strong style="color: #0a1929;">Gs. [MONTO]</strong>. Frecuencia: <strong style="color: #0a1929;">[FRECUENCIA]</strong>.
              </p>
              <div class="details-box">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                          <td style="color: #94a3b8; font-size: 13px; font-weight: 600;">Comercio</td>
                          <td align="right" style="color: #0a1929; font-size: 14px; font-weight: 600;">[COMERCIO]</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                          <td style="color: #94a3b8; font-size: 13px; font-weight: 600;">Monto</td>
                          <td align="right" style="color: #0a1929; font-size: 14px; font-weight: 600;">Gs. [MONTO]</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                          <td style="color: #94a3b8; font-size: 13px; font-weight: 600;">Frecuencia</td>
                          <td align="right" style="color: #0a1929; font-size: 14px; font-weight: 600;">[FRECUENCIA]</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                          <td style="color: #94a3b8; font-size: 13px; font-weight: 600;">Tarjeta</td>
                          <td align="right" style="color: #0a1929; font-size: 14px; font-weight: 600;">Terminada en [XXXX]</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0;">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                          <td style="color: #94a3b8; font-size: 13px; font-weight: 600;">Fecha de alta</td>
                          <td align="right" style="color: #0a1929; font-size: 14px; font-weight: 600;">[FECHA]</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </div>
              <div class="info-box">
                <p class="info-box-text">
                  El comercio podrá procesar los cobros recurrentes conforme a las condiciones aceptadas al momento de la suscripción.
                </p>
              </div>
              <div class="contact-box">
                <p class="contact-box-text">
                  Para consultas, modificación o baja de la suscripción, contactá a: <a href="mailto:[CONTACTO]">[CONTACTO]</a>.
                </p>
              </div>
            </td>
          </tr>
          <tr>
            <td class="footer" style="background-color: #f4f6f8; padding: 20px 32px; text-align: center;">
              <p class="footer-text">
                Este correo fue enviado automáticamente por Walton Pagos a solicitud de <strong>[COMERCIO]</strong>.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
  "confirmacion-pago": `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>Pago confirmado a [COMERCIO]</title>
  <style>
    body { margin: 0; padding: 0; background-color: #f4f6f8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; }
    .wrapper { width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; }
    .header { background-color: #0a1929; padding: 24px 32px; text-align: center; }
    .header-logo { color: #ffffff; font-size: 20px; font-weight: 700; letter-spacing: 0.5px; }
    .header-accent { color: #14b8d4; }
    .status-bar { background-color: #ecfdf5; border-left: 4px solid #10b981; padding: 12px 32px; }
    .status-text { color: #0a1929; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.8px; }
    .content { padding: 32px; }
    .success-icon { text-align: center; margin-bottom: 24px; }
    .success-circle { display: inline-block; text-align: center; width: 64px; height: 64px; background-color: #ecfdf5; border-radius: 50%; line-height: 64px; }
    .success-check { color: #10b981; font-size: 32px; }
    .heading { color: #0a1929; font-size: 22px; font-weight: 700; line-height: 1.3; margin: 0 0 20px 0; text-align: center; }
    .body-text { color: #4a5568; font-size: 15px; line-height: 1.6; margin: 0 0 24px 0; text-align: center; }
    .receipt-box { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 24px; margin: 24px 0; }
    .receipt-title { color: #0a1929; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.6px; margin: 0 0 16px 0; text-align: center; }
    .receipt-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px dashed #cbd5e1; }
    .receipt-row:last-child { border-bottom: none; }
    .receipt-label { color: #64748b; font-size: 13px; }
    .receipt-value { color: #0a1929; font-size: 14px; font-weight: 600; }
    .receipt-total { background-color: #0a1929; border-radius: 6px; padding: 14px 16px; margin-top: 16px; }
    .receipt-total-label { color: #94a3b8; font-size: 13px; font-weight: 600; }
    .receipt-total-value { color: #14b8d4; font-size: 18px; font-weight: 700; }
    .contact-box { background-color: #e6f7fa; border: 1px solid #14b8d4; border-radius: 6px; padding: 16px 20px; margin: 24px 0 0 0; }
    .contact-box-text { color: #0a1929; font-size: 14px; line-height: 1.5; margin: 0; text-align: center; }
    .contact-box-text a { color: #14b8d4; text-decoration: none; font-weight: 600; }
    .footer { background-color: #f4f6f8; padding: 20px 32px; text-align: center; }
    .footer-text { color: #94a3b8; font-size: 11px; line-height: 1.5; margin: 0; }
    @media screen and (max-width: 600px) {
      .content, .header, .status-bar, .footer { padding-left: 20px !important; padding-right: 20px !important; }
      .heading { font-size: 20px !important; }
      .receipt-row { flex-direction: column; gap: 2px; }
    }
  </style>
</head>
<body>
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
    <tr>
      <td align="center" style="padding: 20px 0; background-color: #f4f6f8;">
        <table role="presentation" class="wrapper" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px;">
          <tr>
            <td class="header" style="background-color: #0a1929; padding: 24px 32px; text-align: center;">
              <div class="header-logo">Walton <span class="header-accent">Pagos</span></div>
            </td>
          </tr>
          <tr>
            <td class="status-bar" style="background-color: #ecfdf5; border-left: 4px solid #10b981; padding: 12px 32px;">
              <div class="status-text">Pago confirmado</div>
            </td>
          </tr>
          <tr>
            <td class="content" style="padding: 32px;">
              <div class="success-icon">
                <div class="success-circle" style="display: inline-block; text-align: center; width: 64px; height: 64px; background-color: #ecfdf5; border-radius: 50%; line-height: 64px;">
                  <span class="success-check" style="color: #10b981; font-size: 32px;">&#10003;</span>
                </div>
              </div>
              <h1 class="heading">¡Pago recibido!</h1>
              <p class="body-text">
                Recibimos tu pago a <strong style="color: #0a1929;">[COMERCIO]</strong> por <strong style="color: #0a1929;">Gs. [MONTO]</strong>.<br>
                Tarjeta terminada en <strong style="color: #0a1929;">[XXXX]</strong>.
              </p>
              <div class="receipt-box">
                <div class="receipt-title" style="text-align: center;">Comprobante de pago</div>
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px dashed #cbd5e1;">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                          <td style="color: #64748b; font-size: 13px;">Comercio</td>
                          <td align="right" style="color: #0a1929; font-size: 14px; font-weight: 600;">[COMERCIO]</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px dashed #cbd5e1;">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                          <td style="color: #64748b; font-size: 13px;">Tarjeta</td>
                          <td align="right" style="color: #0a1929; font-size: 14px; font-weight: 600;">Terminada en [XXXX]</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px dashed #cbd5e1;">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                          <td style="color: #64748b; font-size: 13px;">Fecha de pago</td>
                          <td align="right" style="color: #0a1929; font-size: 14px; font-weight: 600;">[FECHA]</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
                <div class="receipt-total" style="background-color: #0a1929; border-radius: 6px; padding: 14px 16px; margin-top: 16px;">
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                    <tr>
                      <td style="color: #94a3b8; font-size: 13px; font-weight: 600;">Monto pagado</td>
                      <td align="right" style="color: #14b8d4; font-size: 18px; font-weight: 700;">Gs. [MONTO]</td>
                    </tr>
                  </table>
                </div>
              </div>
              <div class="contact-box">
                <p class="contact-box-text" style="text-align: center;">
                  Para consultas sobre este pago o sobre la baja del servicio, contactá a: <a href="mailto:[CONTACTO]">[CONTACTO]</a>.
                </p>
              </div>
            </td>
          </tr>
          <tr>
            <td class="footer" style="background-color: #f4f6f8; padding: 20px 32px; text-align: center;">
              <p class="footer-text">
                Este correo fue enviado automáticamente por Walton Pagos a solicitud de <strong>[COMERCIO]</strong>.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,

  "inactivacion-tarjeta": `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>Tu tarjeta fue inactivada</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f4f6f8;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      background-color: #0a1929;
      padding: 24px 32px;
      text-align: center;
    }
    .header-logo {
      color: #ffffff;
      font-size: 20px;
      font-weight: 700;
      letter-spacing: 0.5px;
    }
    .header-accent {
      color: #14b8d4;
    }
    .status-bar {
      background-color: #f1f5f9;
      border-left: 4px solid #94a3b8;
      padding: 12px 32px;
    }
    .status-text {
      color: #475569;
      font-size: 13px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.8px;
    }
    .content {
      padding: 32px;
    }
    .heading {
      color: #0a1929;
      font-size: 22px;
      font-weight: 700;
      line-height: 1.3;
      margin: 0 0 20px 0;
      text-align: center;
    }
    .body-text {
      color: #4a5568;
      font-size: 15px;
      line-height: 1.6;
      margin: 0 0 24px 0;
      text-align: center;
    }
    .details-box {
      background-color: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 20px;
      margin: 24px 0;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #e2e8f0;
    }
    .detail-row:last-child {
      border-bottom: none;
    }
    .detail-label {
      color: #94a3b8;
      font-size: 13px;
      font-weight: 600;
    }
    .detail-value {
      color: #0a1929;
      font-size: 14px;
      font-weight: 600;
    }
    .info-box {
      background-color: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 20px;
      margin: 24px 0;
    }
    .info-box-text {
      color: #4a5568;
      font-size: 14px;
      line-height: 1.5;
      margin: 0;
    }
    .notice-box {
      background-color: #f1f5f9;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 16px 20px;
      margin: 24px 0 0 0;
    }
    .notice-text {
      color: #475569;
      font-size: 13px;
      line-height: 1.5;
      margin: 0;
    }
    .contact-box {
      background-color: #e6f7fa;
      border: 1px solid #14b8d4;
      border-radius: 6px;
      padding: 16px 20px;
      margin: 24px 0 0 0;
    }
    .contact-box-text {
      color: #0a1929;
      font-size: 14px;
      line-height: 1.5;
      margin: 0;
      text-align: center;
    }
    .contact-box-text a {
      color: #14b8d4;
      text-decoration: none;
      font-weight: 600;
    }
    .footer {
      background-color: #f4f6f8;
      padding: 20px 32px;
      text-align: center;
    }
    .footer-text {
      color: #94a3b8;
      font-size: 11px;
      line-height: 1.5;
      margin: 0;
    }
    @media screen and (max-width: 600px) {
      .content, .header, .status-bar, .footer {
        padding-left: 20px !important;
        padding-right: 20px !important;
      }
      .heading {
        font-size: 20px !important;
      }
      .detail-row {
        flex-direction: column;
        gap: 2px;
      }
    }
  </style>
</head>
<body>
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
    <tr>
      <td align="center" style="padding: 20px 0; background-color: #f4f6f8;">
        <table role="presentation" class="wrapper" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px;">
          <!-- Header -->
          <tr>
            <td class="header" style="background-color: #0a1929; padding: 24px 32px; text-align: center;">
              <div class="header-logo">Walton <span class="header-accent">Pagos</span></div>
            </td>
          </tr>
          <!-- Status Bar -->
          <tr>
            <td class="status-bar" style="background-color: #f1f5f9; border-left: 4px solid #94a3b8; padding: 12px 32px;">
              <div class="status-text">Tarjeta inactivada</div>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td class="content" style="padding: 32px;">
              <h1 class="heading">Inactivación confirmada</h1>
              <p class="body-text">
                Tu tarjeta terminada en <strong style="color: #0a1929;">[XXXX]</strong> fue inactivada para pagos recurrentes de <strong style="color: #0a1929;">[COMERCIO]</strong>. No se realizarán nuevos cobros con esta tarjeta.
              </p>
              <!-- Details -->
              <div class="details-box">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                          <td style="color: #94a3b8; font-size: 13px; font-weight: 600;">Comercio</td>
                          <td align="right" style="color: #0a1929; font-size: 14px; font-weight: 600;">[COMERCIO]</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                          <td style="color: #94a3b8; font-size: 13px; font-weight: 600;">Tarjeta</td>
                          <td align="right" style="color: #0a1929; font-size: 14px; font-weight: 600;">Terminada en [XXXX]</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0;">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                          <td style="color: #94a3b8; font-size: 13px; font-weight: 600;">Fecha de inactivación</td>
                          <td align="right" style="color: #0a1929; font-size: 14px; font-weight: 600;">[FECHA]</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </div>
              <!-- Info Box -->
              <div class="info-box">
                <p class="info-box-text">
                  A partir de esta inactivación, no se procesarán nuevos pagos recurrentes con esta tarjeta para <strong>[COMERCIO]</strong>.
                </p>
              </div>
              <!-- Notice Box -->
              <div class="notice-box">
                <p class="notice-text">
                  <strong>Nota:</strong> Esta inactivación no afecta pagos anteriores ya procesados.
                </p>
              </div>
              <!-- Contact Box -->
              <div class="contact-box">
                <p class="contact-box-text">
                  Para consultas o información adicional, contactá a: <a href="mailto:[CONTACTO]">[CONTACTO]</a>.
                </p>
              </div>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td class="footer" style="background-color: #f4f6f8; padding: 20px 32px; text-align: center;">
              <p class="footer-text">
                Este correo fue enviado automáticamente por Walton Pagos.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
  "inactivacion-rechazo": `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>Necesitamos que actualices tu tarjeta</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f4f6f8;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      background-color: #0a1929;
      padding: 24px 32px;
      text-align: center;
    }
    .header-logo {
      color: #ffffff;
      font-size: 20px;
      font-weight: 700;
      letter-spacing: 0.5px;
    }
    .header-accent {
      color: #14b8d4;
    }
    .status-bar {
      background-color: #fef3c7;
      border-left: 4px solid #f59e0b;
      padding: 12px 32px;
 doesn't work, use a different approach
    }
    .status-text {
      color: #92400e;
      font-size: 13px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.8px;
    }
    .content {
      padding: 32px;
    }
    .alert-icon {
      text-align: center;
      margin-bottom: 24px;
    }
    .alert-circle {
      display: inline-block;
      text-align: center;
      width: 64px;
      height: 64px;
      background-color: #fef3c7;
      border-radius: 50%;
      line-height: 64px;
    }
    .alert-symbol {
      color: #f59e0b;
      font-size: 32px;
    }
    .heading {
      color: #0a1929;
      font-size: 22px;
      font-weight: 700;
      line-height: 1.3;
      margin: 0 0 20px 0;
      text-align: center;
    }
    .body-text {
      color: #4a5568;
      font-size: 15px;
      line-height: 1.6;
      margin: 0 0 24px 0;
      text-align: center;
    }
    .details-box {
      background-color: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 20px;
      margin: 24px 0;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #e2e8f0;
    }
    .detail-row:last-child {
      border-bottom: none;
    }
    .detail-label {
      color: #94a3b8;
      font-size: 13px;
      font-weight: 600;
    }
    .detail-value {
      color: #0a1929;
      font-size: 14px;
      font-weight: 600;
    }
    .info-box {
      background-color: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 20px;
      margin: 24px 0;
    }
    .info-box-text {
      color: #4a5568;
      font-size: 14px;
      line-height: 1.5;
      margin: 0;
    }
    .cta-wrapper {
      text-align: center;
      margin: 28px 0;
    }
    .cta-button {
      display: inline-block;
      background-color: #f59e0b;
      color: #ffffff !important;
      text-decoration: none;
      font-size: 15px;
      font-weight: 600;
      padding: 14px 32px;
      border-radius: 6px;
      text-align: center;
    }
    .link-fallback {
      color: #4a5568;
      font-size: 12px;
      text-align: center;
      word-break: break-all;
      margin-top: 12px;
    }
    .link-fallback a {
      color: #14b8d4;
      text-decoration: underline;
    }
    .contact-box {
      background-color: #e6f7fa;
      border: 1px solid #14b8d4;
      border-radius: 6px;
      padding: 16px 20px;
      margin: 24px 0 0 0;
    }
    .contact-box-text {
      color: #0a1929;
      font-size: 14px;
      line-height: 1.5;
      margin: 0;
      text-align: center;
    }
    .contact-box-text a {
      color: #14b8d4;
      text-decoration: none;
      font-weight: 600;
    }
    .security-box {
      background-color: #fffbeb;
      border: 1px solid #fcd34d;
      border-radius: 6px;
      padding: 16px 20px;
      margin: 24px 0 0 0;
    }
    .security-text {
      color: #92400e;
      font-size: 13px;
      line-height: 1.5;
      margin: 0;
    }
    .footer {
      background-color: #f4f6f8;
      padding: 20px 32px;
      text-align: center;
    }
    .footer-text {
      color: #94a3b8;
      font-size: 11px;
      line-height: 1.5;
      margin: 0;
    }
    @media screen and (max-width: 600px) {
      .content, .header, .status-bar, .footer {
        padding-left: 20px !important;
        padding-right: 20px !important;
      }
      .heading {
        font-size: 20px !important;
      }
      .cta-button {
        display: block !important;
        width: 100% !important;
        padding-left: 0 !important;
        padding-right: 0 !important;
      }
      .detail-row {
        flex-direction: column;
        gap: 2px;
      }
    }
  </style>
</head>
<body>
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
    <tr>
      <td align="center" style="padding: 20px 0; background-color: #f4f6f8;">
        <table role="presentation" class="wrapper" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px;">
          <!-- Header -->
          <tr>
            <td class="header" style="background-color: #0a1929; padding: 24px 32px; text-align: center;">
              <div class="header-logo">Walton <span class="header-accent">Pagos</span></div>
            </td>
          </tr>
          <!-- Status Bar -->
          <tr>
            <td class="status-bar" style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px 32px;">
              <div class="status-text">Pago no procesado</div>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td class="content" style="padding: 32px;">
              <div class="alert-icon">
                <div class="alert-circle" style="display: inline-block; text-align: center; width: 64px; height: 64px; background-color: #fef3c7; border-radius: 50%; line-height: 64px;">
                  <span class="alert-symbol" style="color: #f59e0b; font-size: 32px;">&#9888;</span>
                </div>
              </div>
              <h1 class="heading">No pudimos procesar el pago</h1>
              <p class="body-text">
                No pudimos procesar el pago con tu tarjeta terminada en <strong style="color: #0a1929;">[XXXX]</strong>. La tarjeta fue inactivada para <strong style="color: #0a1929;">[COMERCIO]</strong>. Actualizala aquí: <a href="[LINK]" style="color: #14b8d4; text-decoration: underline;">[LINK]</a>. Más info: <a href="mailto:[CONTACTO]" style="color: #14b8d4; text-decoration: underline;">[CONTACTO]</a>.
              </p>
              <!-- Details -->
              <div class="details-box">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                          <td style="color: #94a3b8; font-size: 13px; font-weight: 600;">Comercio</td>
                          <td align="right" style="color: #0a1929; font-size: 14px; font-weight: 600;">[COMERCIO]</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                          <td style="color: #94a3b8; font-size: 13px; font-weight: 600;">Tarjeta</td>
                          <td align="right" style="color: #0a1929; font-size: 14px; font-weight: 600;">Terminada en [XXXX]</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0;">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                          <td style="color: #94a3b8; font-size: 13px; font-weight: 600;">Fecha del intento</td>
                          <td align="right" style="color: #0a1929; font-size: 14px; font-weight: 600;">[FECHA]</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </div>
              <!-- Info Box -->
              <div class="info-box">
                <p class="info-box-text">
                  Por seguridad y para evitar nuevos rechazos, esta tarjeta fue inactivada para pagos recurrentes con <strong>[COMERCIO]</strong>.
                </p>
              </div>
              <!-- CTA -->
              <div class="cta-wrapper">
                <a href="[LINK]" class="cta-button" style="background-color: #f59e0b; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 600; padding: 14px 32px; border-radius: 6px; display: inline-block;">Actualizar tarjeta</a>
              </div>
              <p class="link-fallback">
                Si el botón no funciona, copiá y pegá este enlace en tu navegador:<br>
                <a href="[LINK]">[LINK]</a>
              </p>
              <!-- Contact Box -->
              <div class="contact-box">
                <p class="contact-box-text">
                  Para consultas sobre este pago o sobre la baja del servicio, contactá a: <a href="mailto:[CONTACTO]">[CONTACTO]</a>.
                </p>
              </div>
              <!-- Security Box -->
              <div class="security-box">
                <p class="security-text">
                  <strong>Seguridad:</strong> Ingresá únicamente desde el enlace oficial recibido y no compartas claves ni códigos de seguridad.
                </p>
              </div>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td class="footer" style="background-color: #f4f6f8; padding: 20px 32px; text-align: center;">
              <p class="footer-text">
                Este correo fue enviado automáticamente por Walton Pagos.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`,
  "comercio-registro": `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>Nueva tarjeta registrada</title>
  <style>
    body { margin: 0; padding: 0; background-color: #f4f6f8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; }
    .preheader { display: none !important; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0; overflow: hidden; }
    .wrapper { width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; }
    .header { background-color: #0a1929; padding: 20px 32px; }
    .header-logo { color: #ffffff; font-size: 18px; font-weight: 700; letter-spacing: 0.4px; }
    .header-accent { color: #14b8d4; }
    .header-meta { color: #94a3b8; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin-top: 4px; }
    .status-bar { background-color: #ecfdf5; border-left: 4px solid #16a34a; padding: 10px 32px; }
    .status-text { color: #15803d; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; }
    .content { padding: 28px 32px; }
    .heading { color: #0a1929; font-size: 18px; font-weight: 700; line-height: 1.3; margin: 0 0 12px 0; }
    .body-text { color: #475569; font-size: 14px; line-height: 1.6; margin: 0 0 20px 0; }
    .section-label { color: #94a3b8; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; margin: 0 0 8px 0; }
    .details-box { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 4px 16px; margin: 0 0 20px 0; }
    .info-box { background-color: #f1f5f9; border-left: 3px solid #14b8d4; padding: 12px 16px; margin: 0 0 8px 0; }
    .info-text { color: #475569; font-size: 13px; line-height: 1.5; margin: 0; }
    .footer { background-color: #f4f6f8; padding: 18px 32px; text-align: center; border-top: 1px solid #e2e8f0; }
    .footer-text { color: #94a3b8; font-size: 11px; line-height: 1.5; margin: 0; }
    @media screen and (max-width: 600px) {
      .content, .header, .status-bar, .footer { padding-left: 20px !important; padding-right: 20px !important; }
    }
  </style>
</head>
<body>
  <div class="preheader">Un pagador registró su tarjeta para pagos recurrentes.</div>
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
    <tr>
      <td align="center" style="padding: 20px 0; background-color: #f4f6f8;">
        <table role="presentation" class="wrapper" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px;">
          <tr>
            <td class="header" style="background-color: #0a1929; padding: 20px 32px;">
              <div class="header-logo">Walton <span class="header-accent">Pagos</span></div>
              <div class="header-meta">Notificación al comercio</div>
            </td>
          </tr>
          <tr>
            <td class="status-bar" style="background-color: #ecfdf5; border-left: 4px solid #16a34a; padding: 10px 32px;">
              <div class="status-text">Tarjeta registrada</div>
            </td>
          </tr>
          <tr>
            <td class="content" style="padding: 28px 32px;">
              <h1 class="heading">Nueva tarjeta registrada en [COMERCIO]</h1>
              <p class="body-text">
                <strong style="color:#0a1929;">[PAGADOR_NOMBRE]</strong> registró su tarjeta terminada en <strong style="color:#0a1929;">[XXXX]</strong> para pagos recurrentes en <strong style="color:#0a1929;">[COMERCIO]</strong>.
              </p>

              <p class="section-label">Detalle</p>
              <div class="details-box">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                  <tr><td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;"><table role="presentation" width="100%"><tr><td style="color:#94a3b8;font-size:12px;font-weight:600;">Pagador</td><td align="right" style="color:#0a1929;font-size:13px;font-weight:600;">[PAGADOR_NOMBRE]</td></tr></table></td></tr>
                  <tr><td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;"><table role="presentation" width="100%"><tr><td style="color:#94a3b8;font-size:12px;font-weight:600;">Email</td><td align="right" style="color:#0a1929;font-size:13px;font-weight:600;">[PAGADOR_EMAIL]</td></tr></table></td></tr>
                  <tr><td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;"><table role="presentation" width="100%"><tr><td style="color:#94a3b8;font-size:12px;font-weight:600;">Tarjeta</td><td align="right" style="color:#0a1929;font-size:13px;font-weight:600;">Terminada en [XXXX]</td></tr></table></td></tr>
                  <tr><td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;"><table role="presentation" width="100%"><tr><td style="color:#94a3b8;font-size:12px;font-weight:600;">ID suscripción</td><td align="right" style="color:#0a1929;font-size:13px;font-weight:600;font-family:monospace;">[SUB_ID]</td></tr></table></td></tr>
                  <tr><td style="padding: 10px 0;"><table role="presentation" width="100%"><tr><td style="color:#94a3b8;font-size:12px;font-weight:600;">Fecha de alta</td><td align="right" style="color:#0a1929;font-size:13px;font-weight:600;">[FECHA]</td></tr></table></td></tr>
                </table>
              </div>

              <div class="info-box">
                <p class="info-text">A partir de este momento, los cobros recurrentes autorizados por [COMERCIO] podrán procesarse con esta tarjeta.</p>
              </div>
            </td>
          </tr>
          <tr>
            <td class="footer" style="background-color: #f4f6f8; padding: 18px 32px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p class="footer-text">Notificación automática para el comercio. No responder a este correo.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`,
  "comercio-pago": `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>Pago recibido</title>
  <style>
    body { margin: 0; padding: 0; background-color: #f4f6f8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; }
    .preheader { display: none !important; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0; overflow: hidden; }
    .wrapper { width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; }
    .header { background-color: #0a1929; padding: 20px 32px; }
    .header-logo { color: #ffffff; font-size: 18px; font-weight: 700; letter-spacing: 0.4px; }
    .header-accent { color: #14b8d4; }
    .header-meta { color: #94a3b8; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin-top: 4px; }
    .status-bar { background-color: #ecfdf5; border-left: 4px solid #16a34a; padding: 10px 32px; }
    .status-text { color: #15803d; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; }
    .content { padding: 28px 32px; }
    .heading { color: #0a1929; font-size: 18px; font-weight: 700; line-height: 1.3; margin: 0 0 12px 0; }
    .body-text { color: #475569; font-size: 14px; line-height: 1.6; margin: 0 0 20px 0; }
    .amount-box { background-color: #0a1929; border-radius: 6px; padding: 18px 20px; margin: 0 0 20px 0; text-align: center; }
    .amount-label { color: #94a3b8; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; margin: 0 0 4px 0; }
    .amount-value { color: #ffffff; font-size: 24px; font-weight: 700; margin: 0; }
    .section-label { color: #94a3b8; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; margin: 0 0 8px 0; }
    .details-box { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 4px 16px; margin: 0 0 8px 0; }
    .footer { background-color: #f4f6f8; padding: 18px 32px; text-align: center; border-top: 1px solid #e2e8f0; }
    .footer-text { color: #94a3b8; font-size: 11px; line-height: 1.5; margin: 0; }
    @media screen and (max-width: 600px) {
      .content, .header, .status-bar, .footer { padding-left: 20px !important; padding-right: 20px !important; }
    }
  </style>
</head>
<body>
  <div class="preheader">Se procesó un pago recurrente exitosamente.</div>
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
    <tr>
      <td align="center" style="padding: 20px 0; background-color: #f4f6f8;">
        <table role="presentation" class="wrapper" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px;">
          <tr>
            <td class="header" style="background-color: #0a1929; padding: 20px 32px;">
              <div class="header-logo">Walton <span class="header-accent">Pagos</span></div>
              <div class="header-meta">Notificación al comercio</div>
            </td>
          </tr>
          <tr>
            <td class="status-bar" style="background-color: #ecfdf5; border-left: 4px solid #16a34a; padding: 10px 32px;">
              <div class="status-text">Pago procesado</div>
            </td>
          </tr>
          <tr>
            <td class="content" style="padding: 28px 32px;">
              <h1 class="heading">Pago recibido en [COMERCIO]</h1>
              <p class="body-text">
                Se procesó un pago de <strong style="color:#0a1929;">[PAGADOR_NOMBRE]</strong> con tarjeta terminada en <strong style="color:#0a1929;">[XXXX]</strong>.
              </p>

              <div class="amount-box">
                <p class="amount-label">Monto procesado</p>
                <p class="amount-value">Gs. [MONTO]</p>
              </div>

              <p class="section-label">Detalle</p>
              <div class="details-box">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                  <tr><td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;"><table role="presentation" width="100%"><tr><td style="color:#94a3b8;font-size:12px;font-weight:600;">Pagador</td><td align="right" style="color:#0a1929;font-size:13px;font-weight:600;">[PAGADOR_NOMBRE]</td></tr></table></td></tr>
                  <tr><td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;"><table role="presentation" width="100%"><tr><td style="color:#94a3b8;font-size:12px;font-weight:600;">Email</td><td align="right" style="color:#0a1929;font-size:13px;font-weight:600;">[PAGADOR_EMAIL]</td></tr></table></td></tr>
                  <tr><td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;"><table role="presentation" width="100%"><tr><td style="color:#94a3b8;font-size:12px;font-weight:600;">Tarjeta</td><td align="right" style="color:#0a1929;font-size:13px;font-weight:600;">Terminada en [XXXX]</td></tr></table></td></tr>
                  <tr><td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;"><table role="presentation" width="100%"><tr><td style="color:#94a3b8;font-size:12px;font-weight:600;">ID suscripción</td><td align="right" style="color:#0a1929;font-size:13px;font-weight:600;font-family:monospace;">[SUB_ID]</td></tr></table></td></tr>
                  <tr><td style="padding: 10px 0;"><table role="presentation" width="100%"><tr><td style="color:#94a3b8;font-size:12px;font-weight:600;">Fecha de pago</td><td align="right" style="color:#0a1929;font-size:13px;font-weight:600;">[FECHA]</td></tr></table></td></tr>
                </table>
              </div>
            </td>
          </tr>
          <tr>
            <td class="footer" style="background-color: #f4f6f8; padding: 18px 32px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p class="footer-text">Notificación automática para el comercio. No responder a este correo.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`,
  "comercio-inactivacion-usuario": `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>Tarjeta inactivada por el pagador</title>
  <style>
    body { margin: 0; padding: 0; background-color: #f4f6f8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; }
    .preheader { display: none !important; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0; overflow: hidden; }
    .wrapper { width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; }
    .header { background-color: #0a1929; padding: 20px 32px; }
    .header-logo { color: #ffffff; font-size: 18px; font-weight: 700; letter-spacing: 0.4px; }
    .header-accent { color: #14b8d4; }
    .header-meta { color: #94a3b8; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin-top: 4px; }
    .status-bar { background-color: #f1f5f9; border-left: 4px solid #94a3b8; padding: 10px 32px; }
    .status-text { color: #475569; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; }
    .content { padding: 28px 32px; }
    .heading { color: #0a1929; font-size: 18px; font-weight: 700; line-height: 1.3; margin: 0 0 12px 0; }
    .body-text { color: #475569; font-size: 14px; line-height: 1.6; margin: 0 0 20px 0; }
    .section-label { color: #94a3b8; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; margin: 0 0 8px 0; }
    .details-box { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 4px 16px; margin: 0 0 20px 0; }
    .notice-box { background-color: #f1f5f9; border-left: 3px solid #94a3b8; padding: 12px 16px; margin: 0 0 8px 0; }
    .notice-text { color: #475569; font-size: 13px; line-height: 1.5; margin: 0; }
    .footer { background-color: #f4f6f8; padding: 18px 32px; text-align: center; border-top: 1px solid #e2e8f0; }
    .footer-text { color: #94a3b8; font-size: 11px; line-height: 1.5; margin: 0; }
    @media screen and (max-width: 600px) {
      .content, .header, .status-bar, .footer { padding-left: 20px !important; padding-right: 20px !important; }
    }
  </style>
</head>
<body>
  <div class="preheader">El pagador dio de baja su tarjeta para esta suscripción.</div>
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
    <tr>
      <td align="center" style="padding: 20px 0; background-color: #f4f6f8;">
        <table role="presentation" class="wrapper" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px;">
          <tr>
            <td class="header" style="background-color: #0a1929; padding: 20px 32px;">
              <div class="header-logo">Walton <span class="header-accent">Pagos</span></div>
              <div class="header-meta">Notificación al comercio</div>
            </td>
          </tr>
          <tr>
            <td class="status-bar" style="background-color: #f1f5f9; border-left: 4px solid #94a3b8; padding: 10px 32px;">
              <div class="status-text">Tarjeta inactivada por el pagador</div>
            </td>
          </tr>
          <tr>
            <td class="content" style="padding: 28px 32px;">
              <h1 class="heading">Inactivación solicitada por el pagador</h1>
              <p class="body-text">
                <strong style="color:#0a1929;">[PAGADOR_NOMBRE]</strong> solicitó la inactivación de su tarjeta terminada en <strong style="color:#0a1929;">[XXXX]</strong> para <strong style="color:#0a1929;">[COMERCIO]</strong>. No se procesarán nuevos cobros con esta tarjeta.
              </p>

              <p class="section-label">Detalle</p>
              <div class="details-box">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                  <tr><td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;"><table role="presentation" width="100%"><tr><td style="color:#94a3b8;font-size:12px;font-weight:600;">Pagador</td><td align="right" style="color:#0a1929;font-size:13px;font-weight:600;">[PAGADOR_NOMBRE]</td></tr></table></td></tr>
                  <tr><td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;"><table role="presentation" width="100%"><tr><td style="color:#94a3b8;font-size:12px;font-weight:600;">Email</td><td align="right" style="color:#0a1929;font-size:13px;font-weight:600;">[PAGADOR_EMAIL]</td></tr></table></td></tr>
                  <tr><td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;"><table role="presentation" width="100%"><tr><td style="color:#94a3b8;font-size:12px;font-weight:600;">Tarjeta</td><td align="right" style="color:#0a1929;font-size:13px;font-weight:600;">Terminada en [XXXX]</td></tr></table></td></tr>
                  <tr><td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;"><table role="presentation" width="100%"><tr><td style="color:#94a3b8;font-size:12px;font-weight:600;">ID suscripción</td><td align="right" style="color:#0a1929;font-size:13px;font-weight:600;font-family:monospace;">[SUB_ID]</td></tr></table></td></tr>
                  <tr><td style="padding: 10px 0;"><table role="presentation" width="100%"><tr><td style="color:#94a3b8;font-size:12px;font-weight:600;">Fecha de inactivación</td><td align="right" style="color:#0a1929;font-size:13px;font-weight:600;">[FECHA]</td></tr></table></td></tr>
                </table>
              </div>

              <div class="notice-box">
                <p class="notice-text"><strong>Nota:</strong> Esta inactivación no afecta pagos ya procesados ni el estado contractual de la suscripción.</p>
              </div>
            </td>
          </tr>
          <tr>
            <td class="footer" style="background-color: #f4f6f8; padding: 18px 32px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p class="footer-text">Notificación automática para el comercio. No responder a este correo.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`,
  "comercio-inactivacion-rechazo": `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>Tarjeta inactivada por rechazo</title>
  <style>
    body { margin: 0; padding: 0; background-color: #f4f6f8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; }
    .preheader { display: none !important; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0; overflow: hidden; }
    .wrapper { width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; }
    .header { background-color: #0a1929; padding: 20px 32px; }
    .header-logo { color: #ffffff; font-size: 18px; font-weight: 700; letter-spacing: 0.4px; }
    .header-accent { color: #14b8d4; }
    .header-meta { color: #94a3b8; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin-top: 4px; }
    .status-bar { background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 10px 32px; }
    .status-text { color: #92400e; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; }
    .content { padding: 28px 32px; }
    .heading { color: #0a1929; font-size: 18px; font-weight: 700; line-height: 1.3; margin: 0 0 12px 0; }
    .body-text { color: #475569; font-size: 14px; line-height: 1.6; margin: 0 0 20px 0; }
    .section-label { color: #94a3b8; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; margin: 0 0 8px 0; }
    .details-box { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 4px 16px; margin: 0 0 20px 0; }
    .reason-box { background-color: #fffbeb; border: 1px solid #fde68a; border-radius: 6px; padding: 14px 16px; margin: 0 0 20px 0; }
    .reason-label { color: #92400e; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; margin: 0 0 4px 0; }
    .reason-text { color: #78350f; font-size: 14px; font-weight: 600; margin: 0; }
    .notice-box { background-color: #f1f5f9; border-left: 3px solid #14b8d4; padding: 12px 16px; margin: 0 0 8px 0; }
    .notice-text { color: #475569; font-size: 13px; line-height: 1.5; margin: 0; }
    .footer { background-color: #f4f6f8; padding: 18px 32px; text-align: center; border-top: 1px solid #e2e8f0; }
    .footer-text { color: #94a3b8; font-size: 11px; line-height: 1.5; margin: 0; }
    @media screen and (max-width: 600px) {
      .content, .header, .status-bar, .footer { padding-left: 20px !important; padding-right: 20px !important; }
    }
  </style>
</head>
<body>
  <div class="preheader">Una tarjeta fue inactivada tras un rechazo de pago.</div>
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
    <tr>
      <td align="center" style="padding: 20px 0; background-color: #f4f6f8;">
        <table role="presentation" class="wrapper" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px;">
          <tr>
            <td class="header" style="background-color: #0a1929; padding: 20px 32px;">
              <div class="header-logo">Walton <span class="header-accent">Pagos</span></div>
              <div class="header-meta">Notificación al comercio</div>
            </td>
          </tr>
          <tr>
            <td class="status-bar" style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 10px 32px;">
              <div class="status-text">Tarjeta inactivada por rechazo</div>
            </td>
          </tr>
          <tr>
            <td class="content" style="padding: 28px 32px;">
              <h1 class="heading">Tarjeta inactivada tras un rechazo</h1>
              <p class="body-text">
                No se pudo procesar el pago de <strong style="color:#0a1929;">[PAGADOR_NOMBRE]</strong> con la tarjeta terminada en <strong style="color:#0a1929;">[XXXX]</strong>. La tarjeta fue inactivada para <strong style="color:#0a1929;">[COMERCIO]</strong>.
              </p>

              <div class="reason-box">
                <p class="reason-label">Motivo del rechazo</p>
                <p class="reason-text">[MOTIVO]</p>
              </div>

              <p class="section-label">Detalle</p>
              <div class="details-box">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                  <tr><td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;"><table role="presentation" width="100%"><tr><td style="color:#94a3b8;font-size:12px;font-weight:600;">Pagador</td><td align="right" style="color:#0a1929;font-size:13px;font-weight:600;">[PAGADOR_NOMBRE]</td></tr></table></td></tr>
                  <tr><td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;"><table role="presentation" width="100%"><tr><td style="color:#94a3b8;font-size:12px;font-weight:600;">Email</td><td align="right" style="color:#0a1929;font-size:13px;font-weight:600;">[PAGADOR_EMAIL]</td></tr></table></td></tr>
                  <tr><td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;"><table role="presentation" width="100%"><tr><td style="color:#94a3b8;font-size:12px;font-weight:600;">Tarjeta</td><td align="right" style="color:#0a1929;font-size:13px;font-weight:600;">Terminada en [XXXX]</td></tr></table></td></tr>
                  <tr><td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;"><table role="presentation" width="100%"><tr><td style="color:#94a3b8;font-size:12px;font-weight:600;">ID suscripción</td><td align="right" style="color:#0a1929;font-size:13px;font-weight:600;font-family:monospace;">[SUB_ID]</td></tr></table></td></tr>
                  <tr><td style="padding: 10px 0;"><table role="presentation" width="100%"><tr><td style="color:#94a3b8;font-size:12px;font-weight:600;">Fecha del rechazo</td><td align="right" style="color:#0a1929;font-size:13px;font-weight:600;">[FECHA]</td></tr></table></td></tr>
                </table>
              </div>

              <div class="notice-box">
                <p class="notice-text">Se notificó al pagador con un enlace para actualizar su medio de pago. La suscripción permanece activa contractualmente.</p>
              </div>
            </td>
          </tr>
          <tr>
            <td class="footer" style="background-color: #f4f6f8; padding: 18px 32px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p class="footer-text">Notificación automática para el comercio. No responder a este correo.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`,
};

const templateSubjects: Record<string, string> = {
  "link-suscripcion": "[COMERCIO] te invita a registrar tu tarjeta",
  "confirmacion-suscripcion": "Tu tarjeta fue registrada correctamente",
  "confirmacion-suscripcion-monto": "Suscripción confirmada con [COMERCIO]",
  "confirmacion-pago": "Pago confirmado a [COMERCIO]",
  "inactivacion-tarjeta": "Tu tarjeta fue inactivada",
  "inactivacion-rechazo": "Necesitamos que actualices tu tarjeta",
  "comercio-registro": "Nueva tarjeta registrada — [PAGADOR_NOMBRE]",
  "comercio-pago": "Pago recibido — Gs. [MONTO] de [PAGADOR_NOMBRE]",
  "comercio-inactivacion-usuario": "Tarjeta inactivada por el pagador — [PAGADOR_NOMBRE]",
  "comercio-inactivacion-rechazo": "Tarjeta inactivada por rechazo — [PAGADOR_NOMBRE]",
};

function interpolateTemplate(template: string, data: Record<string, string>): string {
  return template.replace(/\[([A-Z_]+)\]/g, (_, key) => data[key] || `[${key}]`);
}

export default function EmailPreview() {
  const [selectedTemplate, setSelectedTemplate] = useState("link-suscripcion");
  const [html, setHtml] = useState("");

  useEffect(() => {
    const template = emailTemplates[selectedTemplate] || "";
    setHtml(interpolateTemplate(template, mockData));
  }, [selectedTemplate]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-[#0a1929] text-white px-6 py-4 flex items-center gap-4">
        <Link to="/" className="text-white hover:text-[#14b8d4] transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-lg font-semibold">Vista previa de emails</h1>
      </div>

      <div className="max-w-3xl mx-auto p-6">
        <div className="mb-6 flex items-center gap-3">
          <label className="text-sm font-medium text-slate-700">Template:</label>
          <select
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
            className="border border-slate-300 rounded-md px-3 py-1.5 text-sm bg-white"
          >
            <option value="link-suscripcion">01 — Link de suscripción de tarjeta</option>
            <option value="confirmacion-suscripcion">02 — Confirmación de suscripción de tarjeta</option>
            <option value="confirmacion-suscripcion-monto">03 — Confirmación de suscripción con monto y frecuencia</option>
            <option value="confirmacion-pago">04 — Confirmación de pago</option>
            <option value="inactivacion-tarjeta">05 — Inactivación de tarjeta por solicitud del cliente</option>
            <option value="inactivacion-rechazo">06 — Inactivación de tarjeta por rechazo o falla</option>
            <option value="comercio-registro">07 — [Comercio] Registro de tarjeta</option>
            <option value="comercio-pago">08 — [Comercio] Confirmación de pago</option>
            <option value="comercio-inactivacion-usuario">09 — [Comercio] Inactivación por el pagador</option>
            <option value="comercio-inactivacion-rechazo">10 — [Comercio] Inactivación por rechazo</option>
          </select>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          <div className="border-b border-slate-200 px-4 py-3 bg-slate-50 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
            <span className="ml-2 text-xs text-slate-500 font-mono">
              Asunto: {interpolateTemplate(templateSubjects[selectedTemplate] || "", mockData)}
            </span>
          </div>
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </div>
    </div>
  );
}
