// Bismillah
import "dotenv/config";

import { connectToDatabase } from "./config/db";
import { seedAdmin } from "./db/seeders/admin.seed";
import { initTables } from "./db/init.db";
import { startDebtCron } from "./cron/debtCron";
import { server } from "./config/socketConfig";

const PORT = process.env.PORT || 3000;

const bootstrap = async () => {
  await connectToDatabase();
  await initTables();
  await seedAdmin();
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
  startDebtCron();
};

bootstrap();
