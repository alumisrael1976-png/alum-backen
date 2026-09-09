const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());

const uploadsDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },

  filename: function (req, file, cb) {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9) + "-" + file.originalname;

    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// בדיקה שהשרת עובד
app.get("/", (req, res) => {
  res.send("Alum Israel server is working");
});

// העלאת דף חיתוכים / מסמך לפרויקט
app.post("/upload", upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "לא נבחר קובץ"
      });
    }

    const projectId = req.body.projectId || "general";

    res.json({
      success: true,
      message: "המסמך הועלה בהצלחה",
      projectId: projectId,
      fileName: req.file.originalname,
      storedName: req.file.filename,
      fileUrl: `/files/${req.file.filename}`
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "שגיאה בהעלאת המסמך"
    });
  }
});

// צפייה במסמכים שהועלו
app.use("/files", express.static(uploadsDir));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Alum Israel server running on port ${PORT}`);
});
