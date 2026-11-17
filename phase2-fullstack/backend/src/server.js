import "dotenv/config";
import dns from "dns";
import "./config/validateEnv.js";

dns.setServers(["8.8.8.8", "8.8.4.4"]);
import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 4000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`server is running on the PORT ${PORT}`);
  });
});
