# Hiero Maintainer Workflow App (Hybrid Architecture Sandbox)

**Focus:** Scalable Abstraction, Configurable Policies, and Read-Only Default Boundaries.

## 1. The Architectural Strategy: A Hybrid Approach
To solve the fragmentation between SDKs (e.g., Python and C++) without forcing a "one-size-fits-all" workflow, this repository outlines a **Hybrid GitHub App + Actions Model**. 

* **The GitHub App (The Orchestrator):** Hosted securely, the App acts as the central brain. It subscribes to organization webhooks, computes logic (e.g., checking PR status, DCO validation, refetching fresh issue states to avoid webhook snapshot bugs), and holds the central configuration state.
* **GitHub Actions (The Executors):** Individual repositories trigger lightweight, stateless Actions that simply receive commands from the App. This removes heavy scripting from the repositories while maintaining localized execution.
