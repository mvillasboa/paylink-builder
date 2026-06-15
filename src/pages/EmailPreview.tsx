import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const mockData: Record<string, string> = {
  COMERCIO: "Gimnasio PowerFit",
  LINK: "https://waltonpagos.com/register/abc123",
  CONTACTO: "soporte@powerfit.com",
  MONTO: "$12.500",
  FRECUENCIA: "mensual",
  XXXX: "4567",
  FECHA: "14 de junio de 2026",
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
};

function interpolateTemplate(template: string, data: Record<string, string>): string {
  return template.replace(/\[([A-Z]+)\]/g, (_, key) => data[key] || `[${key}]`);
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
          </select>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          <div className="border-b border-slate-200 px-4 py-3 bg-slate-50 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
            <span className="ml-2 text-xs text-slate-500 font-mono">
              Asunto: {mockData.COMERCIO} te invita a registrar tu tarjeta
            </span>
          </div>
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </div>
    </div>
  );
}
