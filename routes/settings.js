import { Router }
from "express";

import { pool }
from "../database/db.js";

import { requireAuth }
from "../middleware/auth.js";

const router = Router();

router.get(
"/settings",

async (req, res, next) => {
try {
const result =
await pool.query(
`           SELECT *
          FROM site_settings
          `
);

```
  const settings =
    Object.fromEntries(
      result.rows.map(
        item => [
          item.setting_key,
          item.setting_value
        ]
      )
    );

  res.json(
    settings
  );

} catch (error) {
  next(error);
}
```

}
);

router.put(
"/admin/settings",

requireAuth,

async (req, res, next) => {
try {
const entries =
Object.entries(
req.body || {}
);

```
  for (
    const [key, value]
    of entries
  ) {
    await pool.query(
      `
      INSERT INTO site_settings
      (
        setting_key,
        setting_value
      )
      VALUES
      (
        $1,
        $2
      )
      ON CONFLICT
      (
        setting_key
      )
      DO UPDATE SET
        setting_value =
          EXCLUDED.setting_value
      `,
      [
        key,
        String(value)
      ]
    );
  }

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
