-- Add new columns for Admin Assignment features
ALTER TABLE complaints 
ADD COLUMN IF NOT EXISTS assigned_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS other_details TEXT;

-- Update the validate_admin_role_assignment trigger if needed (it currently just checks role)
-- No change needed there.

-- We will handle "Assign Date" by setting assigned_at when assigned_admin_id is updated.
CREATE OR REPLACE FUNCTION set_assigned_at()
RETURNS TRIGGER AS $$
BEGIN
    -- If assigned_admin_id is set (and wasn't before, or changed), set assigned_at
    IF NEW.assigned_admin_id IS NOT NULL AND (OLD.assigned_admin_id IS DISTINCT FROM NEW.assigned_admin_id) THEN
        NEW.assigned_at = NOW();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_set_assigned_at
BEFORE UPDATE OF assigned_admin_id ON complaints
FOR EACH ROW
EXECUTE FUNCTION set_assigned_at();
