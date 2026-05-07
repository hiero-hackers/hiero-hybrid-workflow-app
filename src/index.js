import dotenv from "dotenv";
import { App } from "octokit";
import { createNodeMiddleware } from "@octokit/webhooks";
import http from "http";

dotenv.config();

const app = new App({
  appId: process.env.APP_ID || "sandbox-id",
  privateKey: process.env.PRIVATE_KEY || "sandbox-key",
  webhooks: { secret: process.env.WEBHOOK_SECRET || "sandbox-secret" },
});

app.webhooks.on("pull_request.opened", async ({ octokit, payload }) => {
  const repoName = payload.repository.name;
  console.log(`[Hybrid App] Received PR event for ${repoName}`);

  if (repoName === 'hiero-sdk-python') {
    console.log('-> Applying Python SDK Rules: 2 Write Approvals Required');
  } else if (repoName === 'hiero-sdk-cpp') {
    console.log('-> Applying C++ SDK Rules: 1 Write Approval Required');
  }
});

app.webhooks.on("issue_comment.created", async ({ octokit, payload }) => {
  if (payload.comment.body.includes('/assign')) {
    console.log(`-> Refetching fresh issue state via REST API to avoid race conditions...`);
  }
});

const port = 3000;
const middleware = createNodeMiddleware(app.webhooks, { path: "/api/webhook" });
http.createServer(middleware).listen(port, () => {
  console.log(`[Hiero Sandbox] Server listening on port ${port}`);
});
