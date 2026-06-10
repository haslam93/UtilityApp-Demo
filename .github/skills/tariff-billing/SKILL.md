---
name: tariff-billing
description: "Electricity tariff rules and bill calculation logic for GridWatch rate classes (RES-1, GS-1, GS-2, GS-3, IND-1). Use when implementing or modifying billing, bill calculation, tariffs, rates, kWh charges, demand charges, or the /api/customers/:id/bill endpoint."
---

# Tariff Billing Skill

Domain knowledge for calculating customer electricity bills in GridWatch.

## Bill calculation steps

1. Find the customer's meter, then the reading for the requested period (`YYYY-MM`).
2. Billed kWh = register `read` x meter `multiplier`.
3. Look up the customer's `rateClass` in the tariff table below.
4. Bill = customer charge + energy charges (tiered where applicable) + demand charge (if the rate class has one and the reading includes `demandKw`).
5. Add 6% utility tax to the subtotal. Round all currency to 2 decimal places.

## Tariff table

| Rate class | Customer charge | Energy charge | Demand charge |
|------------|----------------:|---------------|--------------:|
| RES-1 | $14.00 | First 500 kWh at $0.11/kWh, remainder at $0.13/kWh | none |
| GS-1 | $25.00 | Flat $0.105/kWh | none |
| GS-2 | $60.00 | Flat $0.095/kWh | $8.50/kW |
| GS-3 | $150.00 | Flat $0.088/kWh | $11.00/kW |
| IND-1 | $400.00 | Flat $0.072/kWh | $13.75/kW |

## Response shape

The bill endpoint returns the standard envelope with a line-item breakdown:

```json
{
  "data": {
    "customerId": "CUST-1001",
    "period": "2026-05",
    "rateClass": "GS-1",
    "billedKwh": 2120,
    "lineItems": [
      { "description": "Customer charge", "amount": 25.0 },
      { "description": "Energy charge (2120 kWh @ $0.105)", "amount": 222.6 },
      { "description": "Utility tax (6%)", "amount": 14.86 }
    ],
    "total": 262.46
  }
}
```

## Edge cases

* Unknown customer or meter: 404 `NOT_FOUND`.
* Missing or malformed `period` query param: 400 `VALIDATION_ERROR` (expect `YYYY-MM`).
* No reading for the period: 404 `NOT_FOUND` with a message naming the period.
* Demand-billed rate class with a `null` `demandKw`: skip the demand line item.
