import qr from "qr-image";
import fs from "fs";
import bodyParser from "body-parser";
import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 2000;
app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});
app.post("/url", (req, res) => {
  const URL = req.body.urlinput;
  console.log(URL);
  var qr_svg = qr.image(URL);
  qr_svg.pipe(fs.createWriteStream("public/img/qr_img.png"));

  res.sendFile(__dirname + "/public/qr.html");
});


  app.listen(port, () => {
    console.log(`running on port ${port}`);
  });