import { Router }
from "express";

import { pool }
from "../database/db.js";

import { requireAuth }
from "../middleware/auth.js";

import { upload }
from "../middleware/upload.js";

const router = Router();

router.post(
"/bookings",

upload.single(
"reference_image"
),

async (req, res, next) => {
try {
const {
name,
email,
phone,
style_id,
body_area,
tattoo_size,
preferred_date,
description
} = req.body;

```
  if (!name || !email) {
    return res
      .status(400)
      .json({
        error:
          "Name and email are required"
      });
  }

  const result =
    await pool.query(
      `
      INSERT INTO bookings
      (
        name,
        email,
        phone,
        style_id,
        body_area,
        tattoo_size,
        preferred_date,
        description,
        reference_image
      )
      VALUES
      (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        $8,
        $9
      )
      RETURNING *
      `,
      [
        name,
        email,
        phone || null,
        style_id || null,
        body_area || null,
        tattoo_size || null,
        preferred_date || null,
        description || null,
        req.file
          ? `/uploads/${req.file.filename}`
          : null
      ]
    );

  res
    .status(201)
    .json(
      result.rows[0]
    );

} catch (error) {
  next(error);
}
```

}
);

router.get(
"/admin/bookings",

requireAuth,

async (req, res, next) => {
try {
const result =
await pool.query(
`           SELECT
            b.*,
            s.name AS style_name
          FROM bookings b
          LEFT JOIN tattoo_styles s
          ON s.id = b.style_id
          ORDER BY b.created_at DESC
          `
);

```
  res.json(
    result.rows
  );

} catch (error) {
  next(error);
}
```

}
);

router.patch(
"/admin/bookings/:id",

requireAuth,

async (req, res, next) => {
try {
const allowedStatuses = [
"pending",
"confirmed",
"completed",
"cancelled"
];

```
  if (
    !allowedStatuses.includes(
      req.body.status
    )
  ) {
    return res
      .status(400)
      .json({
        error:
          "Invalid status"
      });
  }

  const result =
    await pool.query(
      `
      UPDATE bookings
      SET status = $1
      WHERE id = $2
      RETURNING *
      `,
      [
        req.body.status,
        req.params.id
      ]
    );

  res.json(
    result.rows[0]
  );

} catch (error) {
  next(error);
}
```

}
);

export default router;

