const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./router/Users");
const authRoute = require("./router/Auth");
const postRoute = require("./router/Posts");
const multer = require("multer");
const path = require("path");
//const upload = require("express-fileupload");


const port = process.env.PORT || 8000;
dotenv.config();

mongoose.connect(process.env.DATABASE)
.then(()=>{
    console.log(`connected to database`);
}).catch((err)=>{
    console.log(err)
});

app.use("/images", express.static(path.join(__dirname, "public/images")));

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

// app.get("/", (req,res)=>{
//     res.send("home");
// })

const storage = multer.diskStorage({
  destination: (req, file, cb)=>{
    cb(null, "./public/images")
  },
  filename:(req, file, cb)=>{
    cb(null, file.originalname);
  }
})

const upload = multer({storage:storage});
app.post("/api/upload", upload.single('file'), (req, res)=>{
  try{
    return res.status(200).json("File uploaded successfully...");
  }
  catch(err){
    console.log(err);
  }
})

// app.use(upload());

// // app.post("/api/upload", (req, res)=>{
// //   if(req.files){
// //       console.log(req.files)
// //       var file = req.files.file
// //       var filename = file.name:"car.jpg";
// //       console.log(filename)

// //       file.mv('./public/images/'+filename, ()=>{
// //           if(err){
// //               res.send(err)
// //           }else{
// //               res.send("file uploaded...")
// //           }
// //       })
// //   }
// // });

// app.post('/api/upload', function(req, res) {
//   let sampleFile;
//   let uploadPath;

//   if (!req.files || Object.keys(req.files).length === 0) {
//     res.status(400).send('No files were uploaded.');
//     return;
//   }

//   console.log('req.files >>>', req.files); // eslint-disable-line

//   sampleFile = req.files.sampleFile;

//   uploadPath = __dirname + 'public/images/' + sampleFile.name;

//   sampleFile.mv(uploadPath, function(err) {
//     if (err) {
//       return res.status(500).send(err);
//     }

//     res.send('File uploaded to ' + uploadPath);
//   });
// });



app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);

app.listen(port, () => {
  console.log(`server is running at port 8000`);
})