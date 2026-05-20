-- Phase 05: Prayer Requests
-- Table for prayer requests + reactions

-- Prayer requests table
CREATE TABLE IF NOT EXISTS prayer_requests (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  body        text NOT NULL CHECK (char_length(body) BETWEEN 10 AND 500),
  category    text NOT NULL DEFAULT 'personal'
                   CHECK (category IN ('personal','family','school','health','other')),
  anonymous   boolean NOT NULL DEFAULT false,
  status      text NOT NULL DEFAULT 'approved'
                   CHECK (status IN ('pending','approved','rejected')),
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Prayer reactions (one per user per request)
CREATE TABLE IF NOT EXISTS prayer_reactions (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id  uuid NOT NULL REFERENCES prayer_requests(id) ON DELETE CASCADE,
  user_id     uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (request_id, user_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_prayer_requests_status_created
  ON prayer_requests (status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_prayer_reactions_request_id
  ON prayer_reactions (request_id);

CREATE INDEX IF NOT EXISTS idx_prayer_reactions_user_id
  ON prayer_reactions (user_id);

-- RLS
ALTER TABLE prayer_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_reactions ENABLE ROW LEVEL SECURITY;

-- prayer_requests policies
CREATE POLICY "authenticated users can view approved requests"
  ON prayer_requests FOR SELECT
  TO authenticated
  USING (status = 'approved');

CREATE POLICY "users can insert their own requests"
  ON prayer_requests FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users can delete their own requests"
  ON prayer_requests FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- prayer_reactions policies
CREATE POLICY "authenticated users can view reactions"
  ON prayer_reactions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "users can insert their own reactions"
  ON prayer_reactions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users can delete their own reactions"
  ON prayer_reactions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
