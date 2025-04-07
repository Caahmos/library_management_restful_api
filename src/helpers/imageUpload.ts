import multer from "multer";
import path from "node:path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = "";

    if (req.baseUrl.includes("material")) {
      folder = "material";
    }
    if (req.baseUrl.includes("biblio")) {
      folder = "biblio";
    }

    cb(null, `src/public/assets/imgs/${folder}`);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      String(Math.random() * 1000) +
        Date.now() +
        path.extname(file.originalname)
    );
  },
});

export const upload = multer({
  storage: storage,
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
      return cb(new Error("Por favor, envie apenas jpg ou png"));
    }
    cb(null, true);
  },
});
