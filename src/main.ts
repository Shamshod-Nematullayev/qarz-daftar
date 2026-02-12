import { config } from "dotenv";
config();

import app from "./app";
import { connectToDatabase } from "./config/db";

const PORT = process.env.PORT || 3000;

const bootstrap = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

bootstrap();
