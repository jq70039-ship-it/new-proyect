import express from "express";
import path from "path";
import { fileURLToPath }
from "url";

import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

import authRoutes
from "./routes/auth.js";

import styleRoutes
from "./routes/styles.js";

import galleryRoutes
from "./routes/gallery.js";

import bookingRoutes
from "./routes/bookings.js";

import settingsRoutes
from "./routes/settings.js";

dotenv.config();

const __filename =
fileURLToPath(
import.meta.url
);

const __dirname =
path.dirname(
__filename
);

const app =
express();

app.use(
helmet({
crossOriginResourcePolicy: false
})
);

app.use(
cors()
);

app.use(
express.json({
limit: "1mb"
})
);

app.use(
express.urlencoded({
extended: true
})
);

const apiLimiter =
rateLimit({
windowMs:
15 * 60 * 1000,

```
max: 500
```

});

const authLimiter =
rateLimit({
windowMs:
15 * 60 * 1000,

```
max: 30
```

});

app.use(
"/api",
apiLimiter
);

app.use(
"/api/auth",
authLimiter
);

app.use(
"/api/auth",
authRoutes
);

app.use(
"/api",
styleRoutes
);

app.use(
"/api",
galleryRoutes
);

app.use(
"/api",
bookingRoutes
);

app.use(
"/api",
settingsRoutes
);

app.use(
"/uploads",

express.static(
path.join(
__dirname,
"uploads"
)
)
);

app.use(
express.static(
path.join(
__dirname,
"public"
)
)
);

app.use(
"/admin",

express.static(
path.join(
__dirname,
"admin"
)
)
);

app.get(
"/admin/*",

(req, res) => {
res.sendFile(
path.join(
__dirname,
"admin",
"index.html"
)
);
}
);

app.get(
"*",

(req, res) => {
res.sendFile(
path.join(
__dirname,
"public",
"index.html"
)
);
}
);

app.use(
(
error,
req,
res,
next
) => {
console.error(
error
);

```
res
  .status(
    error.status || 500
  )
  .json({
    error:
      error.message ||
      "Internal server error"
  });
```

}
);

const PORT =
process.env.PORT ||
3000;

app.listen(
PORT,
() => {
console.log(
`LUX INK running at http://localhost:${PORT}`
);
}
);

