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
"/styles/:id/gallery",

async (req, res, next) => {
try {
const result =
await pool.query(
`           SELECT *
          FROM gallery_images
          WHERE style_id = $1
          ORDER BY position, id
          `,
[
req.params.id
]
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

router.post(
"/styles/:id/gallery",

requireAuth,

upload.single(
"image"
),

async (req, res, next) => {
try {
if (!req.file) {
return res
.status(400)
.json({
error:
"Image is required"
});
}

```
  const countResult =
    await pool.query(
      `
      SELECT COUNT(*)::int AS count
      FROM gallery_images
      WHERE style_id = $1
      `,
      [
        req.params.id
      ]
    );

  const imageCount =
    countResult.rows[0].count;

  if (imageCount >= 10) {
    return res
      .status(400)
      .json({
        error:
          "Maximum of 10 gallery images per style"
      });
  }

  const {
    title = "",
    description = "",
    position =
      imageCount + 1
  } = req.body;

  const result =
    await pool.query(
      `
      INSERT INTO gallery_images
      (
        style_id,
        image_url,
        title,
        description,
        position
      )
      VALUES
      (
        $1,
        $2,
        $3,
        $4,
        $5
      )
      RETURNING *
      `,
      [
        req.params.id,
        `/uploads/${req.file.filename}`,
        title,
        description,
        Number(position)
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

router.delete(
"/gallery/:id",

requireAuth,

async (req, res, next) => {
try {
await pool.query(
`         DELETE FROM gallery_images
        WHERE id = $1
        `,
[
req.params.id
]
);

```
  res.json({
    success: true
  });

} catch (error) {
  next(error);
}
```

}
);

export default router;

