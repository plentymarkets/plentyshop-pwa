---
prev: true
next: true
---

# Publishing

## Introduction

The **Publish Module** workflow (`.github/workflows/publish-module.yml`) packages a module from `packages/` and publishes it to PlentyONE's private npm registry, making it installable from [the marketplace](https://marketplace.plentyone.com/en).

Before anything is published, the workflow runs validation steps against your module folder. This guide covers how to trigger the workflow and what to fix if a validation fails. The files each validation expects are described in [Setup](/guide/modules/marketplace/setup.md).

## Prerequisites

Your module must be set up as an extension: it needs the `marketplace.json` file, `meta/images/`, and `meta/documents/` described in [Setup](/guide/modules/marketplace/setup.md). The `packages/module-four-seasons` package in this repository is a fixture built specifically to satisfy this workflow's validation — browse it for a complete, working example.

## Trigger the workflow

1. Open the repository's **Actions** tab, select **Publish Module**, then **Run workflow**.
2. Fill in the inputs:
   - `module` — the path under `packages/` to your module, e.g. `module-four-seasons` or `modules/nice-modules/my-module`.
   - `dryRun` — defaults to unchecked. Check it to run `npm publish --dry-run`, which validates and builds the package without publishing it.
3. Run the workflow.

Run once with `dryRun` checked before publishing for real — it exercises every validation and the build without touching the registry.

To check the result, open the workflow run and look at the status of each step. If a validation fails, the step's log names the missing or invalid file or field. Fix it, then re-run the workflow with the same inputs.

## After publishing

Once the module is uploaded, PlentyONE reviews it before it becomes available on the marketplace.
