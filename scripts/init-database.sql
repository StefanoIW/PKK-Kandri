-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reminders table
CREATE TABLE IF NOT EXISTS reminders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  reminder_date DATE NOT NULL,
  phone TEXT NOT NULL,
  sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Allow authenticated users to read events"
  ON events FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert events"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update events"
  ON events FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to delete events"
  ON events FOR DELETE
  TO authenticated
  USING (true);

-- Create policies for reminders
CREATE POLICY "Allow authenticated users to read reminders"
  ON reminders FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert reminders"
  ON reminders FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update reminders"
  ON reminders FOR UPDATE
  TO authenticated
  USING (true);

-- Create sample events
INSERT INTO events (title, date, time, location, description)
VALUES 
  ('Pelatihan Keterampilan Menjahit', CURRENT_DATE + INTERVAL '7 days', '09:00 - 12:00 WIB', 'Balai Kelurahan Kandri', 'Pelatihan keterampilan menjahit untuk ibu-ibu PKK Kandri. Peserta akan belajar teknik dasar menjahit dan membuat produk sederhana.'),
  ('Penyuluhan Kesehatan Keluarga', CURRENT_DATE + INTERVAL '14 days', '10:00 - 12:00 WIB', 'Posyandu Kandri', 'Penyuluhan tentang kesehatan keluarga dan pencegahan penyakit menular. Akan ada pemeriksaan kesehatan gratis untuk peserta.'),
  ('Arisan Bulanan PKK', CURRENT_DATE + INTERVAL '21 days', '15:00 - 17:00 WIB', 'Rumah Ketua RT 02', 'Arisan rutin bulanan PKK Kandri. Agenda meliputi pembayaran iuran, pengundian arisan, dan diskusi program kerja.');

SELECT 'Database initialized successfully' as result;
