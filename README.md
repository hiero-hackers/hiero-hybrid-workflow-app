# Hiero Maintainer Workflow App (Architecture Sandbox)

[![Node.js](https://img.shields.io/badge/Node.js-20.x-green.svg)](https://nodejs.org/)
[![Octokit](https://img.shields.io/badge/Octokit-REST%20%7C%20Webhooks-blue.svg)](https://github.com/octokit)
[![Status](https://img.shields.io/badge/Status-Proof%20of%20Concept-orange.svg)]()

**Focus:** Scalable Abstraction, Configurable Policies, and Read-Only Default Boundaries.

## Overview
The Hiero ecosystem currently relies on fragmented, localized GitHub Action workflows across various SDKs (e.g., hiero-sdk-python vs hiero-sdk-cpp). This repository serves as a foundational sandbox demonstrating a **Hybrid Architecture (GitHub App + Actions)** designed to centralize maintainer workflows while respecting repository-specific security bounds.

## The Architectural Strategy: A Hybrid Approach

Instead of forcing a "one-size-fits-all" yaml script into every repository, this architecture splits execution and orchestration:

1. **The GitHub App (The Orchestrator):** A Node.js backend utilizing @octokit/webhooks to listen to organization-wide events. It acts as the central brain, computing logic, validating DCO/GPG requirements, and managing state.
2. **GitHub Actions (The Executors):** Individual repositories trigger lightweight, stateless Actions that receive execution commands from the central App, removing heavy scripting from the local .github/workflows directories.

## Key Proof-of-Concept Features

* **Centralized Policy Engine:** A single /config/hiero-workflow-app.yml dictates global rules while allowing granular repository overrides. 
  * *Example:* Automatically handles the Python SDK's requirement for 2 write-approvals vs. the C++ SDK's requirement for 1, from a single codebase.
* **Race Condition Mitigation:** Natively prevents assignment bot bugs caused by queued webhook snapshots. The app intercepts /assign comments and refetches the live issue state via the REST API before mutating data.
* **Phase 1 Observability (Read-Only Default):** Designed to operate initially with pull-requests: read and issues: read to build maintainer trust before escalating to write permissions.

## Directory Structure

    ├── config/
    │   └── hiero-workflow-app.yml    # Central policy & repository overrides
    ├── src/
    │   └── index.js                  # Node.js/Octokit App logic & webhook listeners
    ├── .github/workflows/
    │   └── read-only-tracker.yml     # Example stateless callable action
    └── README.md

## Local Development & Testing

This application uses the official github-app-js-sample spec.

### Prerequisites
* Node.js v20+
* Smee.io payload delivery channel (for local webhook testing)

### Setup
1. Clone the repository and install dependencies:

    npm install

2. Configure your .env variables (APP_ID, PRIVATE_KEY, WEBHOOK_SECRET).
3. Start the application:

    npm run start

---
*Developed for the LF Decentralized Trust (LFDT) LFX Mentorship Application.*
