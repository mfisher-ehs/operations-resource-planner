# Scheduling Validation Prototype

**Scope:** Small, independent TypeScript domain prototype with fictional data. Not a deployed scheduling system.

## Run locally
Requires Node.js 22 or newer.

```bash
npm install
npm test
npm run typecheck
```

The tests use Node's built-in test runner and experimental TypeScript type stripping. Type checking requires installed dev dependencies.

## Domain rules
- Half-open UTC timestamp intervals: adjacent assignments do not conflict.
- Confirmed bookings block overlapping employees and equipment.
- Employee unavailability and equipment maintenance block confirmation.
- Required qualifications must be verified and valid through the end of the assignment.
- Missing required equipment types block confirmation.
- Pending or cancelled jobs cannot be confirmed.
- Missing document references are warnings, retained for manager review; **this prototype does not implement a dispatch-ready gate**.
- Proposed and cancelled assignments do not reserve resources.
- No persistence, authentication, user interface, routing, timezone conversion, real-time location, or automatic assignment.

## Design limits
The validator is illustrative and must not be used for actual dispatch or compliance decisions. It does not model rest periods, travel time, location, multi-stop itineraries, document access control, or business-specific qualifications. A manager review and additional rules are required before operational use.
