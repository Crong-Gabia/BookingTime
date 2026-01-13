const API_BASE_URL = 'http://localhost:3000';

export async function checkHealth() {
  const response = await fetch(`${API_BASE_URL}/api/health`);
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
