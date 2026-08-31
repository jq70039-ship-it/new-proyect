import { Router }
from "express";

import { pool }
from "../database/db.js";

import { requireAuth }
from "../middleware/auth.js";

import { upload }
from "../middleware/upload.js";

const router = Router();

router.get(
"/styles",
async (req, res, next) => {
try {
const result =
await pool.query(
`           SELECT *
          FROM tattoo_styles
          ORDER BY position, id
          `
);

```
  res.json(result.rows);

} catch (error) {
  next(error);
}
```

}
);

router.get(
"/styles/:id",
async (req, res, next) => {
try {
const result =
await pool.query(
`           SELECT *
          FROM tattoo_styles
          WHERE id = $1
          `,
[
req.params.id
]
);

```
  if (!result.rows[0]) {
    return res
      .status(404)
      .json({
        error:
          "Style not found"
      });
  }

  res.json(
    result.rows[0]
  );

} catch (error) {
  next(error);
}
```

}
);

router.put(
"/styles/:id",

requireAuth,

upload.single(
"hero_image"
),

async (req, res, next) => {
try {
const currentResult =
await pool.query(
`           SELECT *
          FROM tattoo_styles
          WHERE id = $1
          `,
[
req.params.id
]
);

```
  const current =
    currentResult.rows[0];

  if (!current) {
    return res
      .status(404)
      .json({
        error:
          "Style not found"
      });
  }

  const {
    name,
    subtitle,
    description,
    position
  } = req.body;

  const heroImage =
    req.file
      ? `/uploads/${req.file.filename}`
      : current.hero_image;

  const result =
    await pool.query(
      `
      UPDATE tattoo_styles
      SET
        name = $1,
        subtitle = $2,
        description = $3,
        hero_image = $4,
        position = $5,
        updated_at =
          CURRENT_TIMESTAMP
      WHERE id = $6
      RETURNING *
      `,
      [
        name || current.name,
        subtitle || "",
        description || "",
        heroImage,
        Number(
          position ||
          current.position
        ),
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

