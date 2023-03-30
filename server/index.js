import express from "express"
import bodyParser from "body-parser"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import multer from "multer"
import helmet from "helmet"
import morgan from "morgan"
import path from "path"
import { fileURLToPath } from "url"
import {register} from "./controllers/auth.js"
import{createPost} from "./controllers/posts.js"
import authRoutes from "./routes/auth.js"
import userRoutes from "./routes/users.js"
import postRoutes from "./routes/posts.js"
import { verifyToken } from "./middleware/auth.js"
// import userValidation from "./middleware/validation/user.js"

//configs
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();

app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}));
app.use(morgan("common"));
app.use(express.json({limit: "30mb", extended: true}));
app.use(express.urlencoded({limit : "30mb", extended: true}));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));
//storing a file that the user uploads:- we use multer
/* FILE STORAGE */
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "public/assets");
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  });
  const upload = multer({ storage });
  
 /* ROUTES WITH FILES */
 app.post("/auth/register", upload.single("picture"), register);
 app.post("/posts", verifyToken, upload.single("picture"), createPost);
 
 /* ROUTES */
 app.use("/auth", authRoutes);
 app.use("/users", userRoutes);
 app.use("/posts", postRoutes);
  


//SETTING MONGOOSE

mongoose.set("strictQuery", true)

const PORT = process.env.PORT || 5000;//backup 5000port
// mongoose
//     .connect(process.env.MONGO_URL, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//     }).then(()=>{
//         app.listen(PORT, ()=> console.log(`Server connected to port ${PORT}`));
//     }).catch((error) => console.log(`${error} did not connect`));


//using mongo compass
mongoose
    .connect("mongodb://127.0.0.1:27017/mern",{
        useNewUrlParser : true,
        useUnifiedTopology: true
    })
.then(()=>{
    app.listen(PORT, ()=> console.log(`server connected to port ${PORT}`))
}).catch((error)=> console.log(`server not connected ${error}`))

