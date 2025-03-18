const express = require("express");
const multer = require("multer");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(ffmpegPath);
const path = require("path");
const fs = require("fs");
const bodyParser = require("body-parser");

const cors = require("cors");
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
  optionSuccessStatus: 200,
};

const app = express();
const port = 5000;
app.use(cors(corsOptions));
app.use(bodyParser.json());

let compressionRecords = [];

const upload = multer({
  dest: "uploads/",
});

app.post("/compress", upload.single("audio"), (req, res) => {
  const inputFile = req.file.path;
  const originalFileName = req.file.originalname.replace(
    path.extname(req.file.originalname),
    ""
  );
  const outputFileName = `${originalFileName}-converted.m4a`;
  const outputFile = path.join("compressed", outputFileName);

  if (!fs.existsSync("compressed")) {
    fs.mkdirSync("compressed");
  }

  const inputFileSize = fs.statSync(inputFile).size;
  const inputFileSizeMB = (inputFileSize / 1048576).toFixed(2);

  const bitrate = req.body.bitrate;
  console.log("Received bitrate:", bitrate);

  const channels = req.body.channels;
  console.log("Received bitrate:", channels);

  ffmpeg(inputFile)
    .audioCodec("aac")
    .audioBitrate(bitrate)
    .audioChannels(channels)
    .save(outputFile)
    .on("end", () => {
      const outputFileSize = fs.statSync(outputFile).size;
      const outputFileSizeMB = (outputFileSize / 1048576).toFixed(2);
      const compressRatio =
        ((inputFileSize - outputFileSize) / inputFileSize) * 100;

      const formatCompressRatio = Math.max(0, compressRatio).toFixed(2);

      compressionRecords.push({
        fileName: req.file.originalname,
        bitrate: bitrate,
        numberChann: channels,
        compressionRatio: formatCompressRatio,
        compressedFile: outputFile,
        inputFileSize: inputFileSizeMB,
        outputFileSize: outputFileSizeMB,
      });

      res.json({
        bitrate: bitrate,
        numberChann: channels,
        compressedFile: outputFile,
        compressionRatio: formatCompressRatio,
        outputFileSize: outputFileSizeMB,
      });
      fs.unlinkSync(inputFile);
    })
    .on("error", (err) => {
      console.error("FFmpeg error:", err);
      res.status(500).send("Compression failed");
    });
});

app.get("/compression-records", (req, res) => {
  res.json(compressionRecords);
});

app.get("/download/:filename", (req, res) => {
  const file = path.join("compressed", req.params.filename);

  if (fs.existsSync(file)) {
    res.download(file, (err) => {
      if (err) {
        console.error("Download error:", err);
        res.status(500).send("Download failed");
      } else {
        fs.unlinkSync(file); // Optionally delete file after download
      }
    });
  } else {
    res.status(404).send("File not found");
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

app.use("/compressed", express.static(path.join(__dirname, "compressed")));
