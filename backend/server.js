import app from './app.js';
import { config } from './config/env.js';

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`🚀 Server running in ${config.nodeEnv} mode on http://localhost:${PORT}`);
  console.log(`🏥 Health-check endpoint: http://localhost:${PORT}/api/health`);
});
