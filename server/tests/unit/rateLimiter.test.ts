import express from "express";
import request from "supertest";
import { apiLimiter, authLimiter } from "@/common/middleware/rateLimiter";

describe("Rate Limiters", () => {
  describe("apiLimiter", () => {
    it("allows requests under the limit", async () => {
      const app = express();
      app.use(apiLimiter);
      app.get("/test", (_req, res) => res.json({ ok: true }));

      for (let i = 0; i < 5; i++) {
        const res = await request(app).get("/test");
        expect(res.status).toBe(200);
      }
    });
  });

  describe("authLimiter", () => {
    it("allows requests under the limit", async () => {
      const app = express();
      app.use(authLimiter);
      app.post("/auth/login", (_req, res) => res.json({ ok: true }));

      const res = await request(app)
        .post("/auth/login")
        .send({ email: "test@test.com", password: "pass" });
      expect(res.status).toBe(200);
    });

    it("returns 429 when rate limit is exceeded", async () => {
      const app = express();
      app.use(authLimiter);
      app.post("/auth/login", (_req, res) => res.json({ ok: true }));

      // authLimiter: 10 requests per 15 minutes
      for (let i = 0; i < 10; i++) {
        await request(app)
          .post("/auth/login")
          .send({ email: `test${i}@test.com`, password: "pass" });
      }

      const res = await request(app)
        .post("/auth/login")
        .send({ email: "overflow@test.com", password: "pass" });
      expect(res.status).toBe(429);
      expect(res.body.message).toContain("Too many requests");
    });
  });
});
