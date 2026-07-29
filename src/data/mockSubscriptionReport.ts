export interface ReportInstallment {
  numero: number;
  vencimiento: Date;
  fechaPago?: Date;
  monto: number;
  estado: "pagada" | "pendiente";
}

export interface SubscriptionReportData {
  emitidoEl: Date;
  comercio: {
    nombreFantasia: string;
    razonSocial: string;
    ruc: string;
    contactoNombre: string;
    contactoTelefono: string;
    contactoEmail: string;
  };
  cliente: {
    nombre: string;
    documento: string;
    email: string;
  };
  suscripcion: {
    referencia: string;
    concepto: string;
    detalle: string;
    estado: "Activa" | "Pausada" | "Cancelada" | "Finalizada";
    monto: number;
    frecuencia: string;
    diaCobro: number;
    fechaInicio: Date;
    proximoCobro?: Date;
    medioPago: {
      marca: string;
      ultimos4: string;
      titular: string;
    };
  };
  cuotas: ReportInstallment[];
  soporte: {
    whatsapp: string;
    horario: string;
  };
}

const d = (iso: string) => new Date(`${iso}T12:00:00`);

export const mockSubscriptionReport: SubscriptionReportData = {
  emitidoEl: new Date(),
  comercio: {
    nombreFantasia: "Academia Fullstack",
    razonSocial: "Educación Digital S.A.",
    ruc: "80098765-4",
    contactoNombre: "Atención al cliente Academia Fullstack",
    contactoTelefono: "+595 21 555 120",
    contactoEmail: "soporte@academiafullstack.com.py",
  },
  cliente: {
    nombre: "Malena Pereira",
    documento: "C.I. 4.582.317",
    email: "malena.pereira@email.com",
  },
  suscripcion: {
    referencia: "SUS-2026-004821",
    concepto: "Curso Fullstack Web Dev",
    detalle: "Plan en 6 cuotas mensuales — acceso completo al programa y tutorías.",
    estado: "Activa",
    monto: 185000,
    frecuencia: "Mensual",
    diaCobro: 10,
    fechaInicio: d("2026-05-10"),
    proximoCobro: d("2026-08-10"),
    medioPago: {
      marca: "VISA",
      ultimos4: "4242",
      titular: "MALENA PEREIRA",
    },
  },
  cuotas: [
    { numero: 1, vencimiento: d("2026-05-10"), fechaPago: d("2026-05-10"), monto: 185000, estado: "pagada" },
    { numero: 2, vencimiento: d("2026-06-10"), fechaPago: d("2026-06-10"), monto: 185000, estado: "pagada" },
    { numero: 3, vencimiento: d("2026-07-10"), fechaPago: d("2026-07-11"), monto: 185000, estado: "pagada" },
    { numero: 4, vencimiento: d("2026-08-10"), monto: 185000, estado: "pendiente" },
    { numero: 5, vencimiento: d("2026-09-10"), monto: 185000, estado: "pendiente" },
    { numero: 6, vencimiento: d("2026-10-10"), monto: 185000, estado: "pendiente" },
  ],
  soporte: {
    whatsapp: "+595 986 777 222",
    horario: "Lunes a viernes de 8:00 a 17:00",
  },
};
