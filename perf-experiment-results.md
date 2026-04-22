# Performance Experiment branch: `perf/mock-init-calls`

**PID:** 69056
**URL:** https://1i0og1795b4v.c14-01.plentymarkets.com/
**Tool:** PageSpeed Insights
**Runs per scenario:** 3 (averaged)

---

## Scenarios

| Label           | `MOCK_GET_INIT` | `MOCK_GET_SETTINGS` | Description                                      |
| --------------- | --------------- | ------------------- | ------------------------------------------------ |
| `default`       | off             | off                 | Production baseline — both calls active          |
| `mock-get-init` | **on**          | off                 | `getInit()` bypassed, `getSettings()` still runs |
| `mock-both`     | **on**          | **on**              | Both calls bypassed — true no-init baseline      |

---

## Results — Mobile (avg of 3 runs)

| Metric                   | default | mock-get-init | Δ      | mock-both | Δ      |
| ------------------------ | ------- | ------------- | ------ | --------- | ------ |
| First Contentful Paint   | 3.4s    | 3.9s          | +0.5s  | 3.93s     | +0.53s |
| Largest Contentful Paint | 4.3s    | 4.97s         | +0.67s | 4.97s     | +0.67s |
| Total Blocking Time      | 107ms   | 227ms         | +120ms | 93ms      | -14ms  |
| Cumulative Layout Shift  | 0.077   | 0.026         | -0.051 | 0.026     | -0.051 |
| Speed Index              | 4.07s   | 4.73s         | +0.66s | 4.83s     | +0.76s |

---

## Results — Desktop (avg of 3 runs)

| Metric                   | default | mock-get-init | Δ      | mock-both | Δ      |
| ------------------------ | ------- | ------------- | ------ | --------- | ------ |
| First Contentful Paint   | 0.73s   | 0.77s         | +0.04s | 0.77s     | +0.04s |
| Largest Contentful Paint | 0.9s    | 0.9s          | 0      | 0.9s      | 0      |
| Total Blocking Time      | 60ms    | 293ms         | +233ms | 103ms     | +43ms  |
| Cumulative Layout Shift  | 0.139   | 0.129         | -0.01  | 0.129     | -0.01  |
| Speed Index              | 0.97s   | 1.23s         | +0.26s | 0.9s      | -0.07s |

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
