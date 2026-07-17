export const meta = {
  name: 'analyze-deps',
  description: 'Comprehensive analysis of dependency updates from a PR URL (npm packages or GitHub Actions), checking for breaking changes, conflicts, and compatibility issues',
  phases: [
    { title: 'Fetch PR', detail: 'Get PR metadata and diff' },
    { title: 'Analyze Changes', detail: 'Parse dependency updates' },
    { title: 'Check Local Usage', detail: 'Find how packages/actions are used in codebase' },
    { title: 'Validate Constraints', detail: 'Check compatibility and constraints' },
    { title: 'Security Review', detail: 'Check for known vulnerabilities' },
    { title: 'Report', detail: 'Compile comprehensive safety assessment' },
  ],
  whenToUse: 'Before merging dependency update PRs (npm or GitHub Actions), to assess risk and identify potential breakpoints'
}

const ANALYSIS_SCHEMA = {
  type: 'object',
  properties: {
    packages: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          fromVersion: { type: 'string' },
          toVersion: { type: 'string' },
          type: { type: 'string', enum: ['npm', 'github-action', 'other'] },
          isMajorUpdate: { type: 'boolean' },
          isMinorUpdate: { type: 'boolean' },
          isPatchUpdate: { type: 'boolean' },
          breakingChanges: { type: 'array', items: { type: 'string' } },
          riskLevel: { type: 'string', enum: ['low', 'medium', 'high', 'critical'] },
        }
      }
    },
    prTitle: { type: 'string' },
    prUrl: { type: 'string' }
  }
}

const USAGE_SCHEMA = {
  type: 'object',
  properties: {
    packageName: { type: 'string' },
    usageFiles: { type: 'array', items: { type: 'string' } },
    usageContext: { type: 'string' },
    potentialBreakpoints: { type: 'array', items: { type: 'string' } },
  }
}

const FINAL_REPORT_SCHEMA = {
  type: 'object',
  properties: {
    overallRisk: { type: 'string', enum: ['safe', 'low', 'medium', 'high', 'critical'] },
    summary: { type: 'string' },
    packageAnalysis: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          update: { type: 'string' },
          riskLevel: { type: 'string' },
          findings: { type: 'array', items: { type: 'string' } },
          recommendations: { type: 'array', items: { type: 'string' } },
        }
      }
    },
    criticalIssues: { type: 'array', items: { type: 'string' } },
    actionItems: { type: 'array', items: { type: 'string' } },
  }
}

const prUrl = args
if (!prUrl || !prUrl.includes('github.com')) {
  throw new Error('Invalid PR URL. Pass a valid GitHub PR URL as args, e.g.: https://github.com/owner/repo/pull/123')
}

phase('Fetch PR')
const prDetails = await agent(
  `Fetch this GitHub PR and extract all dependency changes from the diff.

PR: ${prUrl}

This could be:
1. npm package.json changes (dependencies, devDependencies)
2. GitHub Actions workflow changes (.github/workflows/*.yml) - look for "with:" sections that update action versions like "actions/setup-node@v4" or "actions/github-script@7"
3. Other dependency files (requirements.txt, Gemfile, go.mod, etc)

Return:
- prTitle and prUrl
- A list of all version updates with name, fromVersion, toVersion, and type (npm/github-action/other)
- Identify major/minor/patch changes

If no dependency updates found, return empty packages array.`,
  { label: 'fetch-pr', schema: ANALYSIS_SCHEMA }
)

if (!prDetails?.packages?.length) {
  throw new Error('No dependency updates found in PR')
}

log(`Found ${prDetails.packages.length} dependency updates to analyze in: ${prDetails.prTitle}`)

phase('Analyze Changes')
const detailedAnalysis = await agent(
  `For each dependency update, research what changed and identify risks:

${JSON.stringify(prDetails.packages, null, 2)}

For each:
1. Check release notes/changelog for breaking changes
2. For npm packages: check npmjs.org, for GitHub Actions: check GitHub releases
3. Note new requirements or dropped support
4. Note security fixes or important bug fixes
5. Assign risk level (low/medium/high/critical)

Be thorough - check actual release notes and changelogs.`,
  { label: 'analyze-changes', schema: ANALYSIS_SCHEMA }
)

log(`Analyzed ${detailedAnalysis.packages.length} packages`)

phase('Check Local Usage')
const localUsage = await Promise.all(
  detailedAnalysis.packages.map((pkg) =>
    agent(
      `Find usage of "${pkg.name}" (${pkg.fromVersion} → ${pkg.toVersion}, type: ${pkg.type}) in the plentyshop-pwa repository:

For npm packages: search for imports/requires
For GitHub Actions: search .github/workflows/*.yml files
For other: search relevant config files

List:
1. All files that reference this dependency
2. How it's used (specific functions, in what context)
3. Potential breaking points for the version change`,
      {
        label: `usage-${pkg.name}`,
        schema: USAGE_SCHEMA
      }
    )
  )
)

phase('Validate Constraints')
const constraintValidation = await agent(
  `Validate compatibility:

Updates: ${JSON.stringify(detailedAnalysis.packages, null, 2)}

Check:
1. Node.js version requirements (package.json engines field) - verify new versions don't require newer Node
2. For GitHub Actions: check if runner OS/versions are compatible
3. Peer dependency conflicts
4. Lock file validity (package-lock.json)

Report any constraint violations.`,
  { label: 'validate-constraints' }
)

phase('Security Review')
const securityReview = await agent(
  `Security assessment:

${JSON.stringify(detailedAnalysis.packages, null, 2)}

Check:
1. Known CVEs or security vulnerabilities
2. If updates include security fixes
3. Deprecated or unmaintained packages
4. Supply chain concerns (new maintainers, ownership changes)
5. Security advisories`,
  { label: 'security-review' }
)

phase('Report')
const finalReport = await agent(
  `Create final safety assessment:

PR: ${prDetails.prTitle}
Updates: ${JSON.stringify(detailedAnalysis.packages, null, 2)}
Usage: ${JSON.stringify(localUsage, null, 2)}
Constraints: ${constraintValidation}
Security: ${securityReview}

Report should include:
1. Overall risk: safe/low/medium/high/critical
2. Executive summary (1-2 sentences)
3. Per-package analysis with: update version, risk level, findings, recommendations
4. Critical issues (if any)
5. Action items before merging
6. Final recommendation: SAFE TO MERGE / CONDITIONAL / NEEDS REVIEW / DO NOT MERGE`,
  { label: 'final-report', schema: FINAL_REPORT_SCHEMA }
)

return finalReport
