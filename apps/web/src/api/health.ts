export async function checkHealth() {
  const response = await fetch('/api/health');
  if (!response.ok) {
    throw new Error('Health check failed');
  }
  return response.json();
}

export type HealthResponse = {
  status: string;
  timestamp: string;
  uptime: number;
};
