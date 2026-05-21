# Hiero Maintainer Workflow App (Architecture Sandbox)

[![Node.js](https://img.shields.io/badge/Node.js-20.x-green.svg)](https://nodejs.org/)
[![Octokit](https://img.shields.io/badge/Octokit-REST%20%7C%20Webhooks-blue.svg)](https://github.com/octokit)
[![Status](https://img.shields.io/badge/Status-Proof%20of%20Concept-orange.svg)]()

A sandbox exploring what a centralized GitHub App architecture could look like for Hiero's maintainer workflows.

The Python SDK has 40+ workflow files. The C++ SDK consolidated similar logic into a handful of hardened scripts. The Swift SDK has contributor progression templates but no automation to back them up. This repo is an attempt to sketch out what an abstraction layer across all of them might look like.

### The Approach

Right now every SDK repo owns its own workflow logic. When something needs fixing, you PR every repo separately. The idea here is to split that into two layers:

*   **A central Node.js app** (this repo) that listens for org-wide webhook events, runs the policy logic, and decides what should happen.
*   **Lightweight callable actions** in each SDK repo that just execute what the central app decides.

The SDK repos stay thin. The logic lives in one place.

### What's in here

*   **`src/index.js`** — the webhook listener built on Octokit. Handles PR events and issue comments, applies per-repo config rules.
*   **`config/hiero-workflow-app.yml`** — central policy file with per-repo overrides. Different repos can have different rules without forking the logic.
*   **`.github/workflows/read-only-tracker.yml`** — example callable action that runs with `pull-requests: read` and `issues: read` only.

### A note on permissions

The default stance here is read-only. The app starts with the minimum permissions needed to observe and report, and only escalates to write permissions once the logic has been reviewed by maintainers. This is intentional — trust has to be earned before a bot starts mutating state across 40 repos.

### Running locally

You'll need Node.js v20+ and a Smee.io channel to forward webhooks to your local machine.

```
npm install
```
Set your `APP_ID`, `PRIVATE_KEY`, and `WEBHOOK_SECRET` in a `.env` file, then:

```
npm run start
```

---
*Built as part of my LFX Mentorship application for the LFDT Hiero GitHub Workflow App project.*
