#!/usr/bin/env node
/**
 * Minimal browser driver for the run-in-browser skill.
 * Uses the repo's own playwright-core install — no MCP server, no extra deps.
 *
 * Usage:
 *   node browse.mjs <url> [--viewport WxH] [--timeout ms] [--headed] [action ...]
 *
 * Actions run in the order given:
 *   --wait <selector>            wait for selector to appear
 *   --click <selector>           click an element
 *   --fill <selector> <value>    fill an input/textarea
 *   --eval <js>                  evaluate JS in page context, print the result
 *   --screenshot <path>          save a screenshot to path
 *   --sleep <ms>                 pause
 *
 * Console messages, page errors, and failed requests are collected for the
 * whole run and printed at the end.
 */
import { chromium } from 'playwright-core';

const argv = process.argv.slice(2);
if (argv.length === 0 || argv[0].startsWith('--')) {
  console.error('Usage: node browse.mjs <url> [options] [actions...]');
  process.exit(1);
}

const url = argv.shift();
let viewport = { width: 1280, height: 800 };
let timeout = 15000;
let headed = false;
const actions = [];

while (argv.length) {
  const flag = argv.shift();
  switch (flag) {
    case '--viewport': {
      const raw = argv.shift();
      if (!raw) {
        console.error('Missing value for --viewport (expected WxH, e.g. 1280x800)');
        process.exit(1);
      }
      const [w, h] = raw.split('x').map(Number);
      if (!Number.isFinite(w) || !Number.isFinite(h)) {
        console.error(`Invalid --viewport value: ${raw} (expected WxH, e.g. 1280x800)`);
        process.exit(1);
      }
      viewport = { width: w, height: h };
      break;
    }
    case '--timeout':
      timeout = Number(argv.shift());
      break;
    case '--headed':
      headed = true;
      break;
    case '--wait':
      actions.push({ type: 'wait', selector: argv.shift() });
      break;
    case '--click':
      actions.push({ type: 'click', selector: argv.shift() });
      break;
    case '--fill':
      actions.push({ type: 'fill', selector: argv.shift(), value: argv.shift() });
      break;
    case '--eval':
      actions.push({ type: 'eval', expr: argv.shift() });
      break;
    case '--screenshot':
      actions.push({ type: 'screenshot', path: argv.shift() });
      break;
    case '--sleep':
      actions.push({ type: 'sleep', ms: Number(argv.shift()) });
      break;
    default:
      console.error(`Unknown option: ${flag}`);
      process.exit(1);
  }
}

const consoleMessages = [];
const pageErrors = [];
const failedRequests = [];

const browser = await chromium.launch({ headless: !headed });
try {
  const page = await browser.newPage({ viewport });
  page.setDefaultTimeout(timeout);

  page.on('console', (msg) => {
    consoleMessages.push(`[${msg.type()}] ${msg.text()}`);
  });
  page.on('pageerror', (err) => {
    pageErrors.push(err.message);
  });
  page.on('requestfailed', (req) => {
    failedRequests.push(`${req.method()} ${req.url()} — ${req.failure()?.errorText ?? 'unknown error'}`);
  });

  await page.goto(url, { waitUntil: 'load' });
  console.log(`Loaded: ${page.url()}`);
  console.log(`Title: ${await page.title()}`);

  for (const action of actions) {
    switch (action.type) {
      case 'wait':
        await page.waitForSelector(action.selector);
        console.log(`Waited for: ${action.selector}`);
        break;
      case 'click':
        await page.click(action.selector);
        console.log(`Clicked: ${action.selector}`);
        break;
      case 'fill':
        await page.fill(action.selector, action.value);
        console.log(`Filled: ${action.selector} = ${action.value}`);
        break;
      case 'eval': {
        const result = await page.evaluate(action.expr);
        console.log(`Eval result: ${JSON.stringify(result)}`);
        break;
      }
      case 'screenshot':
        await page.screenshot({ path: action.path, fullPage: true });
        console.log(`Screenshot saved: ${action.path}`);
        break;
      case 'sleep':
        await new Promise((r) => setTimeout(r, action.ms));
        break;
    }
  }

  console.log('\n--- Console messages ---');
  console.log(consoleMessages.length ? consoleMessages.join('\n') : '(none)');

  console.log('\n--- Page errors ---');
  console.log(pageErrors.length ? pageErrors.join('\n') : '(none)');

  console.log('\n--- Failed requests ---');
  console.log(failedRequests.length ? failedRequests.join('\n') : '(none)');
} finally {
  await browser.close();
}
