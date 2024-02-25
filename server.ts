import express from "express";
import cors from 'cors';
import bodyParser from "body-parser";
import { SERVER_PORT } from "./configuration/app.config";
import { error404 } from "./middlewares/error.middleware";
import { connectDb } from "./configuration/db.service";
import { authRouter } from "./routes/auth.routes";

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Establish DB connection
connectDb()
    .then(() => {
        console.log("DB Connected Successfully");
        app.listen(SERVER_PORT, () => {
            console.log(`Server is live at http://localhost:${SERVER_PORT}/`);
        });
    })
    .catch(err => {
        console.log("Error occured while connecting to DB: ", err);
    });

// Status check
app.get("/", (req, res) => {
    res.send(`Server is live at http://localhost:${SERVER_PORT}/`);
});

// Auth router
app.use("/api/v1/auth", authRouter);


// Wild card
app.use("", error404);