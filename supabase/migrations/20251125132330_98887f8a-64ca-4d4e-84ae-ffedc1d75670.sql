-- Enable realtime for tables that generate notifications
ALTER PUBLICATION supabase_realtime ADD TABLE subscriptions;
ALTER PUBLICATION supabase_realtime ADD TABLE transactions;
ALTER PUBLICATION supabase_realtime ADD TABLE subscription_price_changes;