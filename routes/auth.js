import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { pool }
from "../database/db.js";

const router = Router();

router.post(
"/login",
async (req, res, next) => {
try {
const {
email,
password
} = req.body;

```
  if (!email || !password) {
    return res
      .status(400)
      .json({
        error:
          "Email and password are required"
      });
  }

  const result =
    await pool.query(
      `
      SELECT *
      FROM users
      WHERE email = $1
      `,
      [
        email.toLowerCase()
      ]
    );

  const user =
    result.rows[0];

  if (!user) {
    return res
      .status(401)
      .json({
        error:
          "Invalid credentials"
      });
  }

  const validPassword =
    await bcrypt.compare(
      password,
      user.password_hash
    );

  if (!validPassword) {
    return res
      .status(401)
      .json({
        error:
          "Invalid credentials"
      });
  }

  const token =
    jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "8h"
      }
    );

  res.json({
    token,

    user: {
      name: user.name,
      email: user.email
    }
  });
} catch (error) {
  next(error);
}
```

}
);

router.post(
"/bootstrap",
async (req, res, next) => {
try {
const countResult =
await pool.query(
`           SELECT COUNT(*)::int AS count
          FROM users
          `
);

```
  if (
    countResult.rows[0].count > 0
  ) {
    return res
      .status(403)
      .json({
        error:
          "Administrator already exists"
      });
  }

  const {
    ADMIN_NAME,
    ADMIN_EMAIL,
    ADMIN_PASSWORD
  } = process.env;

  if (
    !ADMIN_NAME ||
    !ADMIN_EMAIL ||
    !ADMIN_PASSWORD
  ) {
    return res
      .status(500)
      .json({
        error:
          "Configure administrator values in .env"
      });
  }

  const passwordHash =
    await bcrypt.hash(
      ADMIN_PASSWORD,
      12
    );

  await pool.query(
    `
    INSERT INTO users
    (
      name,
      email,
      password_hash
    )
    VALUES
    (
      $1,
      $2,
      $3
    )
    `,
    [
      ADMIN_NAME,
      ADMIN_EMAIL.toLowerCase(),
      passwordHash
    ]
  );

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

