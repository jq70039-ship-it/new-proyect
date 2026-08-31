# LUX INK TATTOO WEBSITE

Luxury tattoo studio website with:

* Public website.
* Four tattoo styles.
* Image galleries.
* Maximum of 10 images per style.
* Booking system.
* Image reference uploads.
* PostgreSQL database.
* Protected administrator panel.
* JWT authentication.
* Image upload system.

---

# 1. REQUIREMENTS

Install:

* Node.js 18 or newer.
* PostgreSQL.
* npm.

---

# 2. CREATE THE DATABASE

Open PostgreSQL and create:

CREATE DATABASE lux_ink;

---

# 3. CONFIGURE ENVIRONMENT VARIABLES

Copy:

.env.example

and rename the copy to:

.env

Configure:

DATABASE_URL

with your PostgreSQL username and password.

Example:

DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/lux_ink

Also configure:

JWT_SECRET

ADMIN_NAME

ADMIN_EMAIL

ADMIN_PASSWORD

---

# 4. CREATE TABLES

Run:

database/schema.sql

inside your PostgreSQL database.

For example:

psql -U postgres -d lux_ink -f database/schema.sql

---

# 5. INSTALL DEPENDENCIES

Open a terminal inside:

LUX-INK-TATTOO

Run:

npm install

---

# 6. CREATE THE ADMINISTRATOR

The administrator is created only once.

After configuring your `.env` file and starting the server, send a POST request to:

http://localhost:3000/api/auth/bootstrap

You can use:

Postman

or another API client.

After the administrator is created successfully, the bootstrap route cannot create another administrator.

---

# 7. START THE WEBSITE

Development mode:

npm run dev

Production mode:

npm start

---

# 8. OPEN THE WEBSITE

Public website:

http://localhost:3000

Administrator:

http://localhost:3000/admin

---

# 9. ADMINISTRATION

From the administrator panel you can modify:

* Brand name.
* Artist name.
* Artist biography.
* Location.
* Instagram.
* Contact email.
* Tattoo style information.
* Hero images for styles.
* Gallery images.
* Gallery titles.
* Gallery descriptions.
* Booking statuses.

The gallery is technically limited to:

10 images per tattoo style.

This limitation exists in both:

* The administrator interface.
* The backend API.

---

# 10. SUPPORTED IMAGES

The system accepts:

* JPG.
* JPEG.
* PNG.
* WEBP.

Maximum file size:

8 MB.

Images are stored locally in:

uploads/

For production, the upload system can later be migrated to:

* Cloudinary.
* Amazon S3.
* Supabase Storage.

