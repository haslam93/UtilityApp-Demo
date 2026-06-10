// In-memory seed data for GridWatch. In a real system this would live in a database.

export const customers = [
  { id: 'CUST-1001', name: 'Riverside Bakery', type: 'commercial', address: '12 Mill Rd', feederId: 'FDR-07', rateClass: 'GS-1' },
  { id: 'CUST-1002', name: 'Anna Kowalski', type: 'residential', address: '48 Elm St', feederId: 'FDR-07', rateClass: 'RES-1' },
  { id: 'CUST-1003', name: 'Lakeside Apartments', type: 'commercial', address: '200 Shore Dr', feederId: 'FDR-12', rateClass: 'GS-2' },
  { id: 'CUST-1004', name: 'Tom Becker', type: 'residential', address: '9 Cedar Ln', feederId: 'FDR-12', rateClass: 'RES-1' },
  { id: 'CUST-1005', name: 'Northgate Mall', type: 'commercial', address: '1 Northgate Pkwy', feederId: 'FDR-03', rateClass: 'GS-3' },
  { id: 'CUST-1006', name: 'Priya Sharma', type: 'residential', address: '77 Birch Ave', feederId: 'FDR-03', rateClass: 'RES-1' },
  { id: 'CUST-1007', name: 'City Water Treatment', type: 'industrial', address: '500 Plant Rd', feederId: 'FDR-01', rateClass: 'IND-1' },
  { id: 'CUST-1008', name: 'Maple Grove School', type: 'commercial', address: '15 School St', feederId: 'FDR-01', rateClass: 'GS-2' }
];

export const meters = [
  { id: 'MTR-50001', customerId: 'CUST-1001', type: 'AMI', installDate: '2021-03-15', multiplier: 1 },
  { id: 'MTR-50002', customerId: 'CUST-1002', type: 'AMI', installDate: '2020-08-01', multiplier: 1 },
  { id: 'MTR-50003', customerId: 'CUST-1003', type: 'AMI', installDate: '2022-01-20', multiplier: 10 },
  { id: 'MTR-50004', customerId: 'CUST-1004', type: 'AMR', installDate: '2018-06-11', multiplier: 1 },
  { id: 'MTR-50005', customerId: 'CUST-1005', type: 'AMI', installDate: '2021-11-05', multiplier: 40 },
  { id: 'MTR-50006', customerId: 'CUST-1006', type: 'AMR', installDate: '2017-02-28', multiplier: 1 },
  { id: 'MTR-50007', customerId: 'CUST-1007', type: 'AMI', installDate: '2023-04-10', multiplier: 80 },
  { id: 'MTR-50008', customerId: 'CUST-1008', type: 'AMI', installDate: '2022-09-14', multiplier: 10 }
];

// Monthly kWh readings (register reads, multiply by meter multiplier for billed kWh).
export const readings = [
  { meterId: 'MTR-50001', period: '2026-04', read: 1840, demandKw: 12.4 },
  { meterId: 'MTR-50001', period: '2026-05', read: 2120, demandKw: 14.1 },
  { meterId: 'MTR-50002', period: '2026-04', read: 612, demandKw: null },
  { meterId: 'MTR-50002', period: '2026-05', read: 689, demandKw: null },
  { meterId: 'MTR-50003', period: '2026-04', read: 940, demandKw: 38.2 },
  { meterId: 'MTR-50003', period: '2026-05', read: 1015, demandKw: 41.7 },
  { meterId: 'MTR-50004', period: '2026-04', read: 533, demandKw: null },
  { meterId: 'MTR-50004', period: '2026-05', read: 498, demandKw: null },
  { meterId: 'MTR-50005', period: '2026-04', read: 2210, demandKw: 310.5 },
  { meterId: 'MTR-50005', period: '2026-05', read: 2455, demandKw: 328.0 },
  { meterId: 'MTR-50006', period: '2026-04', read: 720, demandKw: null },
  { meterId: 'MTR-50006', period: '2026-05', read: 803, demandKw: null },
  { meterId: 'MTR-50007', period: '2026-04', read: 5120, demandKw: 890.0 },
  { meterId: 'MTR-50007', period: '2026-05', read: 5390, demandKw: 905.2 },
  { meterId: 'MTR-50008', period: '2026-04', read: 1130, demandKw: 55.3 },
  { meterId: 'MTR-50008', period: '2026-05', read: 980, demandKw: 48.9 }
];

export const outages = [
  {
    id: 'OUT-2026-0142',
    feederId: 'FDR-07',
    cause: 'tree contact',
    status: 'restored',
    severity: 'medium',
    customersAffected: 412,
    reportedAt: '2026-06-02T14:22:00Z',
    restoredAt: '2026-06-02T17:48:00Z',
    crew: 'Crew 4'
  },
  {
    id: 'OUT-2026-0151',
    feederId: 'FDR-12',
    cause: 'equipment failure',
    status: 'in-progress',
    severity: 'high',
    customersAffected: 1280,
    reportedAt: '2026-06-09T22:05:00Z',
    restoredAt: null,
    crew: 'Crew 2'
  },
  {
    id: 'OUT-2026-0153',
    feederId: 'FDR-03',
    cause: 'vehicle accident',
    status: 'assigned',
    severity: 'medium',
    customersAffected: 96,
    reportedAt: '2026-06-10T06:40:00Z',
    restoredAt: null,
    crew: 'Crew 1'
  },
  {
    id: 'OUT-2026-0154',
    feederId: 'FDR-01',
    cause: 'unknown',
    status: 'reported',
    severity: 'low',
    customersAffected: 8,
    reportedAt: '2026-06-10T08:15:00Z',
    restoredAt: null,
    crew: null
  }
];

let outageCounter = 155;

export function nextOutageId() {
  return `OUT-2026-${String(outageCounter++).padStart(4, '0')}`;
}

let customerCounter = 1009;

export function nextCustomerId() {
  return `CUST-${customerCounter++}`;
}
