const requiredEnvVar = ["MONGO_URI", "JWT_ACCESS_KEY", "CLIENT_URL"];

const missingVar = requiredEnvVar.filter((key) => {
  return !process.env[key]?.trim();
});

if (missingVar.length > 0) {
  console.error(
    `Missing required environment variables: ${missingVariables.join(", ")}`,
  );
  process.exit(1);
}

if (process.env.JWT_ACCESS_KEY.trim().length < MIN_SECRET_LENGTH) {
  console.error(`JWT_ACCESS_KEY is too short.`);
  process.exit(1);
}
