import { config } from "dotenv";
config();

import app from "./app";

const PORT = process.env.PORT || 3000;

const bootstrap = async () => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

bootstrap();
