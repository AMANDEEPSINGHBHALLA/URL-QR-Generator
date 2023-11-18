import qr from "qr-image";
import fs from "fs";
import bodyParser from "body-parser";
import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import crypto from "crypto";

const app = express();
const port = 3000;
app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));

//schema
const urlSchema = new mongoose.Schema({
    link: {
      type: String,
      required: true,
    }
  });

//model
const uLink = mongoose.model("uLink", urlSchema);

app.get("/", (req, res) => {
    const ip = req.ip;
    const userAgent = req.get('User-Agent');

    // Create a unique identifier for the device based on IP address and user agent
    const deviceId = crypto.createHash('md5').update(ip + userAgent).digest('hex');

    // Truncate or hash the deviceId to ensure it fits within the constraints
    const truncatedDeviceId = deviceId.substring(0, 10); // Adjust the length as needed

    const databaseName = "urlqrDB_" + truncatedDeviceId;

    // connecting to the database
    mongoose.connect(`mongodb+srv://admin-asb:Aman210402@cluster0.s7hqqgo.mongodb.net/${databaseName}`)
    .then(() => {
        console.log("successfully connected");
    })
    .catch((err) => {
        console.log("Error", err);
    });

    // connecting to the database
    mongoose.connect(`mongodb+srv://admin-asb:Aman210402@cluster0.s7hqqgo.mongodb.net/${databaseName}`)
    .then(() => {
        console.log("successfully connected");
    })
    .catch((err) => {
        console.log("Error", err);
    });
// app.get("/", (req, res)=> {
//     var ip = req.ip;
//     console.log(ip);
    
//     //connecting database
// mongoose.connect("mongodb+srv://admin-asb:Aman210402@cluster0.s7hqqgo.mongodb.net/urlqrDB" + ip)
// .then(()=> {
//     console.log("successfully connected");
// })
// .catch((err)=> {
//     console.log("Error", err);
// });
    uLink.find()
    .then((sData)=> {
        if (sData.length == 0) {
            res.render("index.ejs");
        }
        else if (sData.length > 5) {
            uLink.deleteOne({__v: 0}).then(()=> {
                res.redirect("/");
            }).catch((err)=> {
                console.log(err);
            });
        }
        else {
            res.render("index.ejs", {
                findP: sData
            });
        }
    }).catch((err)=> {
        console.log(err);
    });
});

app.post("/url", (req, res)=> {
    const URL = req.body.urlinput;

    const test = new uLink({
        link: URL
      });
      test.save();

    console.log(URL);
    var qr_svg = qr.image(URL);
    qr_svg.pipe(fs.createWriteStream("public/img/qr_img.png"));

    res.render("qr.ejs");
});

app.listen(port, ()=> {
    console.log(`running on port ${port}`);
});
