Run the `analyze-deps` workflow to do a comprehensive analysis of a dependency update PR.

Pass `$ARGUMENTS` as the args to the Workflow tool with scriptPath `.claude/workflows/analyze-deps.ts`.

When the workflow completes, present the final report clearly to the user:
- Overall risk level (safe/low/medium/high/critical)
- Executive summary
- Per-package findings and recommendations
- Critical issues (if any)
- Final recommendation (SAFE TO MERGE / CONDITIONAL / NEEDS REVIEW / DO NOT MERGE)
