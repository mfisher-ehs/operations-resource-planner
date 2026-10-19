# Local Dashboard Preview

Requires Node.js 22 or later.

```powershell
git clone -b feat/scheduling-validation-mvp https://github.com/mfisher-ehs/operations-resource-planner.git
cd operations-resource-planner
npm install
npm run dev
```

Open http://localhost:3000.

## Demo actions
- Inspect fictional employee assignments on the weekly board.
- Filter the unscheduled job queue.
- Choose a job, employee, day and vehicle to see validation results.
- Try assigning a pending job (blocked), or assigning work on a day with an existing employee/vehicle reservation (blocked).
- Reset the schedule to its initial state.

The interface uses in-memory fictional data; refreshing the page resets changes. No backend, persistence, authentication, location tracking or document uploads. The dates are a fixed demonstration week, November 2–6, 2026, in UTC. The board displays illustrative labels and is not a dispatch system.

Run `npm test` and `npm run typecheck` before merging.
