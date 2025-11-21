-- Add missing frequency values to subscription_frequency enum
ALTER TYPE subscription_frequency ADD VALUE IF NOT EXISTS 'biweekly';
ALTER TYPE subscription_frequency ADD VALUE IF NOT EXISTS 'bimonthly';
ALTER TYPE subscription_frequency ADD VALUE IF NOT EXISTS 'semiannual';
ALTER TYPE subscription_frequency ADD VALUE IF NOT EXISTS 'annual';