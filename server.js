const express = require('express');
const multer = require('multer');
const cors = require('cors');
const Tesseract = require('tesseract.js');

const app = express();
app.use(cors());

// הגדרת קבלת קבצים
const upload = multer({ storage: multer.memoryStorage() });

app.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).send('לא הועלה קובץ');

  console.log("קיבלתי תמונה, מתחיל לפענח את המידות...");
  
  try {
    const { data: { text } } = await Tesseract.recognize(
      req.file.buffer,
      'heb+eng',
      { logger: m => console.log(m) }
    );
    
    console.log("טקסט שזוהה בהצלחה!");
    res.json({ success: true, text: text });

  } catch (error) {
    console.error("שגיאה בפענוח:", error);
    res.status(500).json({ success: false, error: 'שגיאה בפענוח התמונה' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`השרת רץ על פורט ${PORT}`);
});
