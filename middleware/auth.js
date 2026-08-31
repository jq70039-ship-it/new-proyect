CREATE TABLE IF NOT EXISTS users (
id SERIAL PRIMARY KEY,
name VARCHAR(120) NOT NULL,
email VARCHAR(255) UNIQUE NOT NULL,
password_hash TEXT NOT NULL,
role VARCHAR(30) NOT NULL DEFAULT 'admin',
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tattoo_styles (
id SERIAL PRIMARY KEY,
name VARCHAR(100) UNIQUE NOT NULL,
slug VARCHAR(100) UNIQUE NOT NULL,
subtitle VARCHAR(160),
description TEXT,
hero_image TEXT,
position INTEGER DEFAULT 0,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS gallery_images (
id SERIAL PRIMARY KEY,
style_id INTEGER NOT NULL
REFERENCES tattoo_styles(id)
ON DELETE CASCADE,
image_url TEXT NOT NULL,
title VARCHAR(160),
description TEXT,
position INTEGER DEFAULT 0,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bookings (
id SERIAL PRIMARY KEY,
name VARCHAR(120) NOT NULL,
email VARCHAR(255) NOT NULL,
phone VARCHAR(80),
style_id INTEGER
REFERENCES tattoo_styles(id)
ON DELETE SET NULL,
body_area VARCHAR(160),
tattoo_size VARCHAR(100),
preferred_date DATE,
description TEXT,
reference_image TEXT,
status VARCHAR(30) DEFAULT 'pending',
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS site_settings (
setting_key VARCHAR(100) PRIMARY KEY,
setting_value TEXT NOT NULL
);

INSERT INTO tattoo_styles (
name,
slug,
subtitle,
description,
hero_image,
position
)
VALUES
(
'Blackwork',
'blackwork',
'PURE CONTRAST. PURE FORM.',
'Bold contrast, solid forms and the controlled use of negative space.',
'',
1
),
(
'Fine Line',
'fine-line',
'PRECISION IN EVERY LINE.',
'Delicate composition, refined detail and controlled minimalism.',
'',
2
),
(
'Cyber Sigilism',
'cyber-sigilism',
'FUTURE WRITTEN ON SKIN.',
'Digital symbolism, sharp movement and futuristic visual structures.',
'',
3
),
(
'Ornamental',
'ornamental',
'SYMMETRY. RITUAL. FORM.',
'Decorative geometry and balanced compositions inspired by timeless ornament.',
'',
4
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO site_settings (
setting_key,
setting_value
)
VALUES
(
'brand_name',
'LUX INK'
),
(
'artist_name',
'Tattoo Artist'
),
(
'artist_bio',
'A private studio dedicated to contemporary tattoo artistry and individual expression.'
),
(
'location',
'Private Studio'
),
(
'instagram_url',
''
),
(
'contact_email',
''
)
ON CONFLICT (setting_key) DO NOTHING;

