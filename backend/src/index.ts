import { createApp } from "./app.js";

const PORT = 8081;
const HOST = "0.0.0.0";

const app = createApp();
app.listen(PORT, HOST, () => console.log(`Server started: ${HOST}:${PORT}`));
