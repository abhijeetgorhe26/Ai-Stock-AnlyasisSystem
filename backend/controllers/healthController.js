/**
 * Health Controller
 * Handles request/response logic for backend health checks.
 */
export const getHealthStatus = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Backend server is running successfully',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
};
