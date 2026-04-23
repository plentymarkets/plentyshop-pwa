# Performance Experiment branch: `perf/mock-init-calls`

**PID:** 69056
**URL:** https://1i0og1795b4v.c14-01.plentymarkets.com/
**Tool:** PageSpeed Insights
**Runs per scenario:** 6 (averaged)

---

## Scenarios

| Label           | `MOCK_GET_INIT` | `MOCK_GET_SETTINGS` | Description                                      |
| --------------- | --------------- | ------------------- | ------------------------------------------------ |
| `default`       | off             | off                 | Production baseline — both calls active          |
| `mock-get-init` | **on**          | off                 | `getInit()` bypassed, `getSettings()` still runs |
| `mock-both`     | **on**          | **on**              | Both calls bypassed — true no-init baseline      |

---

## Results — Mobile (avg of 6 runs)

| Metric                   | default | mock-get-init | Δ      | mock-both | Δ      |
| ------------------------ | ------- | ------------- | ------ | --------- | ------ |
| First Contentful Paint   | 3.45s   | 3.92s         | +0.47s | 3.95s     | +0.50s |
| Largest Contentful Paint | 4.33s   | 4.99s         | +0.66s | 4.99s     | +0.66s |
| Total Blocking Time      | 92ms    | 174ms         | +82ms  | 80ms      | -12ms  |
| Cumulative Layout Shift  | 0.077   | 0.026         | -0.051 | 0.039     | -0.038 |
| Speed Index              | 3.79s   | 4.72s         | +0.93s | 4.62s     | +0.83s |

---

## Results — Desktop (avg of 6 runs)

| Metric                   | default | mock-get-init | Δ      | mock-both | Δ      |
| ------------------------ | ------- | ------------- | ------ | --------- | ------ |
| First Contentful Paint   | 0.72s   | 0.77s         | +0.05s | 0.77s     | +0.05s |
| Largest Contentful Paint | 0.9s    | 0.9s          | 0      | 0.92s     | +0.02s |
| Total Blocking Time      | 88ms    | 200ms         | +112ms | 67ms      | -21ms  |
| Cumulative Layout Shift  | 0.140   | 0.130         | -0.010 | 0.129     | -0.011 |
| Speed Index              | 1.02s   | 1.10s         | +0.08s | 0.87s     | -0.15s |

---

## How to collect results

Run this in the DevTools console on the PageSpeed Insights results page (`pagespeed.web.dev`):

```js
JSON.stringify(
  [...document.querySelectorAll('.lh-metric')].map((el) => ({
    label: el.querySelector('.lh-metric__title')?.textContent?.trim(),
    value: el.querySelector('.lh-metric__value')?.textContent?.trim(),
  })),
  null,
  2,
);
```

The output lists mobile metrics first (5 entries), then desktop (5 entries).
