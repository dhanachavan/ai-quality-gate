import { Router, Request, Response } from "express";

const router = Router();

interface HealthStatus {
  status: "healthy" | "degraded" | "unhealthy";
  uptime: number;
  timestamp: string;
  version: string;
  checks: {
    name: string;
    status: "pass" | "fail";
    latency?: number;
  }[];
}

const startTime = Date.now();

async function checkDatabase(): Promise<{ status: "pass" | "fail"; latency: number }> {
  const start = Date.now();
  try {
    // Simulate DB ping
    await new Promise((resolve) => setTimeout(resolve, 5));
    return { status: "pass", latency: Date.now() - start };
  } catch {
    return { status: "fail", latency: Date.now() - start };
  }
}

router.get("/health", async (_req: Request, res: Response) => {
  const dbCheck = await checkDatabase();

  const checks = [
    { name: "database", status: dbCheck.status, latency: dbCheck.latency },
  ];

  const allPassing = checks.every((c) => c.status === "pass");

  const health: HealthStatus = {
    status: allPassing ? "healthy" : "degraded",
    uptime: Math.floor((Date.now() - startTime) / 1000),
    timestamp: new Date().toISOString(),
    version: process.env.APP_VERSION || "1.0.0",
    checks,
  };

  const statusCode = allPassing ? 200 : 503;
  res.status(statusCode).json(health);
});

router.get("/health/ready", (_req: Request, res: Response) => {
  res.status(200).json({ ready: true });
});

router.get("/health/live", (_req: Request, res: Response) => {
  const uptime = Math.floor((Date.now() - startTime) / 1000);
  if (uptime < 0) {
    res.status(500).json({ live: false, error: "Clock skew detected" });
    return;
  }
  res.json({ live: true, uptime });
});

export default router;
