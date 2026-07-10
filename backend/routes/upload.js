const express = require('express');
const multer = require('multer');
const { parse } = require('csv-parse');
const { processRecordsWithAI } = require('../services/aiService');

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const fileContent = req.file.buffer.toString('utf-8');

  parse(fileContent, { columns: true, skip_empty_lines: true }, async (err, records) => {
    if (err) {
      console.error('Error parsing CSV:', err);
      return res.status(500).json({ error: 'Failed to parse CSV file' });
    }

    if (records.length === 0) {
      return res.status(400).json({ error: 'CSV file is empty' });
    }

    try {
      // Batch processing: Send in batches of 20 to avoid exceeding AI prompt limits
      const BATCH_SIZE = 20;
      const batches = [];
      for (let i = 0; i < records.length; i += BATCH_SIZE) {
        batches.push(records.slice(i, i + BATCH_SIZE));
      }

      let allSuccessfullyParsed = [];
      let allSkipped = [];

      // Process batches sequentially to avoid rate limiting
      for (const batch of batches) {
        const { successfullyParsed, skipped } = await processRecordsWithAI(batch);
        allSuccessfullyParsed.push(...successfullyParsed);
        allSkipped.push(...skipped);
      }

      res.json({
        totalImported: allSuccessfullyParsed.length,
        totalSkipped: allSkipped.length,
        successfullyParsed: allSuccessfullyParsed,
        skipped: allSkipped
      });
    } catch (error) {
      console.error('Error processing with AI:', error);
      res.status(500).json({ error: 'Failed to process records with AI' });
    }
  });
});

module.exports = router;
