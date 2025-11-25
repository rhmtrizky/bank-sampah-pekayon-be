import app from "./app.js";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle common shutdown signals gracefully
process.on("SIGINT", () => {
  console.log("Shutting down server (SIGINT)...");
  process.exit(0);
});
process.on("SIGTERM", () => {
  console.log("Shutting down server (SIGTERM)...");
  process.exit(0);
});
  