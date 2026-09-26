-- Live market feed: any change to an item's listings, offers or price points
-- sends `pg_notify('market', <item_id>)`. The tracker's stream LISTENs on the
-- channel and pushes a fresh order book to everyone watching that item.
CREATE OR REPLACE FUNCTION relicto_notify_market() RETURNS trigger AS $$
DECLARE
  target text;
BEGIN
  IF TG_TABLE_NAME = 'offers' THEN
    SELECT item_id INTO target FROM listings WHERE id = COALESCE(NEW.listing_id, OLD.listing_id);
  ELSE
    target := COALESCE(NEW.item_id, OLD.item_id);
  END IF;
  IF target IS NOT NULL THEN
    PERFORM pg_notify('market', target);
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;
--> statement-breakpoint
DROP TRIGGER IF EXISTS listings_notify_market ON listings;
--> statement-breakpoint
CREATE TRIGGER listings_notify_market AFTER INSERT OR UPDATE OR DELETE ON listings
  FOR EACH ROW EXECUTE FUNCTION relicto_notify_market();
--> statement-breakpoint
DROP TRIGGER IF EXISTS offers_notify_market ON offers;
--> statement-breakpoint
CREATE TRIGGER offers_notify_market AFTER INSERT OR UPDATE OR DELETE ON offers
  FOR EACH ROW EXECUTE FUNCTION relicto_notify_market();
--> statement-breakpoint
DROP TRIGGER IF EXISTS price_points_notify_market ON price_points;
--> statement-breakpoint
CREATE TRIGGER price_points_notify_market AFTER INSERT OR UPDATE ON price_points
  FOR EACH ROW EXECUTE FUNCTION relicto_notify_market();
