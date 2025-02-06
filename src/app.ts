import express, { Express } from 'express';
import "dotenv/config";
import mongoose from 'mongoose';
import routes from './routes/index';

const app: Express = express();

const PORT: string | number = process.env.PORT || 5000;

app.use(express.json({ limit: "50mb" }));

mongoose
    .connect(process.env.MONGO_URI as string)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on Port ${PORT}`);
        });
    })
    .catch((error) => {
        throw error;
    });

routes(app);