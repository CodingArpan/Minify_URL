import express from 'express'
import path from "path";
import dotenv from 'dotenv'
dotenv.config()
import routes from './Routes/index'
import db from './DB/DB'


const app = express();
const PORT: string | 4000 = process.env.PORT || 4000;
const DB_URL: string | any = process.env.DATABASE_URL;


app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'ejs');



app.listen(PORT, () => {
    console.log('App is running on port ' + `http://localhost:${PORT}`);
    db(DB_URL);
    routes(app);
})


