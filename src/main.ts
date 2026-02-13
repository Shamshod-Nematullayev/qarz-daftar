// Bismillah
import "dotenv/config";

import app from "./app";
import { connectToDatabase } from "./config/db";
import { seedAdmin } from "./db/seeders/admin.seed";
import { initTables } from "./db/init.db";

const PORT = process.env.PORT || 3000;

const bootstrap = async () => {
  await connectToDatabase();
  await initTables();
  await seedAdmin();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

bootstrap();
