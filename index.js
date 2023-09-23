import qr from "qr-image";
import fs from "fs";
import bodyParser from "body-parser";
import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

const app = express();
const port = 3000;
app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));

//connecting database
mongoose.connect("mongodb+srv://admin-asb:Aman210402@cluster0.s7hqqgo.mongodb.net/urlqrDB")
.then(()=> {
    console.log("successfully connected");
})
.catch((err)=> {
    console.log("Error", err);
});

//schema
const urlSchema = new mongoose.Schema({
    link: {
      type: String,
      required: true,
    }
  });

//model
const uLink = mongoose.model("uLink", urlSchema);

app.get("/", (req, res)=> {
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
