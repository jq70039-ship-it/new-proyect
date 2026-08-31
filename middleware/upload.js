import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDirectory =
path.resolve("uploads");

fs.mkdirSync(uploadDirectory, {
recursive: true
});

const storage =
multer.diskStorage({
destination: uploadDirectory,

```
filename: (req, file, callback) => {
  const extension =
    path.extname(
      file.originalname
    ).toLowerCase();

  const filename =
    `${Date.now()}-${Math.round(
      Math.random() * 1000000000
    )}${extension}`;

  callback(null, filename);
}
```

});

const allowedTypes =
new Set([
"image/jpeg",
"image/png",
"image/webp"
]);

export const upload =
multer({
storage,

```
limits: {
  fileSize:
    8 * 1024 * 1024,

  files: 10
},

fileFilter:
  (req, file, callback) => {
    if (
      !allowedTypes.has(
        file.mimetype
      )
    ) {
      return callback(
        new Error(
          "Only JPG, PNG and WEBP images are allowed"
        )
      );
    }

    callback(null, true);
  }
```

});

