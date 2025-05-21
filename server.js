import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import path from "path";

const app = express();

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "drjgrgsrd",
  api_key: "565293434135749",
  api_secret: "yYzQaBF6VqdTiO_U8FyN5XcT048",
});

mongoose
  .connect(
    "mongodb+srv://harshanand42917:S0d33GWPg0BTvMBQ@cluster0.i6opsi7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    {
      dbName: "url_shorted_db",
    }
  )
  .then(() => console.log("MongoDb Connected..!"))
  .catch((err) => console.log(err));

// rendering the ejs file
app.get("/", (req, res) => {
  res.render("index.ejs", { url: null });
});

const storage = multer.diskStorage({
  // destination: "./public/uploads",
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const upload = multer({ storage: storage });

const imageSchema = new mongoose.Schema({
  filename: String,
  public_id: String,
  imgUrl: String,
});

const File = mongoose.model("cloudinary", imageSchema);

app.post("/uploads", upload.single("file"), async (req, res) => {
  const file = req.file.path;

  const cloudinaryRes = await cloudinary.uploader.upload(file, {
    folder: "Saved_Images_Folder",
  });

  // save to database
  const db = await File.create({
    filename: file.originalname,
    public_id: cloudinaryRes.public_id,
    imgUrl: cloudinaryRes.secure_url,
  });

  res.render("index.ejs", { url: cloudinaryRes.secure_url });
});

const port = 5000;

app.listen(port, () => console.log(`server is running on the ${port}`));
