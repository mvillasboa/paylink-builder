
-- Corregir función get_status_label con search_path seguro
CREATE OR REPLACE FUNCTION public.get_status_label(status_type text, status_code text)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
SET search_path = public
AS $$
BEGIN
  RETURN CASE status_type
    WHEN 'CONTRACT' THEN CASE status_code
      WHEN 'ACTIVE' THEN 'Activa'
      WHEN 'PAUSED' THEN 'Pausada'
      WHEN 'CANCELLED' THEN 'Cancelada'
      ELSE status_code
    END
    WHEN 'BILLING' THEN CASE status_code
      WHEN 'IN_GOOD_STANDING' THEN 'Al día'
      WHEN 'PAST_DUE' THEN 'Con deuda'
      WHEN 'DELINQUENT' THEN 'En mora'
      WHEN 'SUSPENDED' THEN 'Cobro suspendido'
      WHEN 'RECOVERY' THEN 'En recuperación'
      ELSE status_code
    END
    WHEN 'PAYMENT_METHOD' THEN CASE status_code
      WHEN 'VALID' THEN 'Válido'
      WHEN 'TEMPORARILY_INVALID' THEN 'Requiere actualización'
      WHEN 'INVALID' THEN 'No válido'
      ELSE status_code
    END
    WHEN 'CHARGE' THEN CASE status_code
      WHEN 'PENDING' THEN 'Pendiente'
      WHEN 'SUCCESS' THEN 'Exitoso'
      WHEN 'SOFT_DECLINE' THEN 'Rechazado temporalmente'
      WHEN 'HARD_DECLINE' THEN 'Rechazado permanentemente'
      ELSE status_code
    END
    WHEN 'CYCLE' THEN CASE status_code
      WHEN 'PENDING' THEN 'Pendiente'
      WHEN 'PAID' THEN 'Pagado'
      WHEN 'PARTIAL' THEN 'Pago parcial'
      WHEN 'OVERDUE' THEN 'Vencido'
      WHEN 'WRITTEN_OFF' THEN 'Dado de baja'
      ELSE status_code
    END
    ELSE status_code
  END;
END;
$$;
