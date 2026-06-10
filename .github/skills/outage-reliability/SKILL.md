---
name: outage-reliability
description: "Outage severity classification rules and SAIDI/SAIFI/CAIDI reliability index formulas for GridWatch. Use when classifying outage severity, computing reliability indices, building reliability reports, or implementing outage escalation logic."
---

# Outage Reliability Skill

Domain knowledge for outage severity classification and reliability reporting in GridWatch.

## Severity classification rules

Severity is derived from customers affected and outage duration. Apply the highest matching tier:

| Severity | Criteria |
|----------|----------|
| critical | > 1,000 customers affected, OR a critical-infrastructure customer (type `industrial`) is on the affected feeder, OR duration > 8 hours |
| high | > 500 customers affected, OR duration > 4 hours |
| medium | > 50 customers affected, OR duration > 1 hour |
| low | everything else |

Escalation: an unrestored outage must be re-evaluated against duration thresholds; severity only escalates, never de-escalates.

## Reliability indices

GridWatch serves a total of `N` customers (count of records in `customers` seed data; use 8,500 as the system-wide total when modeling realistic reports).

* **SAIDI** (System Average Interruption Duration Index) = sum of (customers affected x outage duration in minutes) / total customers served. Reported in minutes per customer per year.
* **SAIFI** (System Average Interruption Frequency Index) = sum of customers affected across outages / total customers served. Reported in interruptions per customer per year.
* **CAIDI** (Customer Average Interruption Duration Index) = SAIDI / SAIFI. Average restoration time per interruption.

Duration for an unrestored outage = now minus `reportedAt`. Exclude outages flagged as major-event days when computing IEEE 1366 adjusted indices (not modeled in seed data; mention as a caveat in reports).

## Reporting conventions

* Report indices to 1 decimal place; durations in minutes.
* Always state the measurement window (e.g. "month to date").
* Benchmark context: typical North American utility SAIDI is 100-200 minutes/year; SAIFI 1.0-1.5.
