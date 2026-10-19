# Operations Resource Planner — Business Requirements v0.1

**Status:** Discovery baseline, 2026-10-19. Generic portfolio project; not production-approved.

## Problem
Fragmented job, employee, equipment, location and document information forces managers to coordinate assignments manually. Cross-location work opportunities can be missed while employees or equipment remain idle.

## Primary goals
1. Maintain productive employee hours while respecting availability and qualifications.
2. Improve financial outcomes by matching suitable resources to work and reducing unnecessary travel.
3. Provide complete job information and documents to authorized field staff.

## Firsthand process observations (user-reported, not independently verified)
- Monday–Friday planning with pending and ready jobs, manually color-coded scheduling.
- Shared drivers and equipment, including maintenance and qualification constraints.
- Scheduling based on starting locations, appointments, destination facilities, emergencies and preferences.
- Cross-region opportunities discovered by manager-to-manager calls, with company-standard mileage rates.
- During reduced demand, managers found work for otherwise idle drivers; employee hours and district financial performance both mattered.

## MVP requirements
| ID | Requirement |
|---|---|
| BR-01 | Create pending/ready jobs with order reference, summary, contact, location, appointment and instructions. |
| BR-02 | Attach or reference authorized job documents. |
| BR-03 | Maintain employee qualification evidence, availability, equipment and maintenance blocks. |
| BR-04 | Detect overlapping bookings, missing qualifications and unavailable equipment. |
| BR-05 | Provide a weekly schedule and unscheduled-job queue. |
| BR-12 | Log assignment changes and approvals. |

## Later phases (proposed, not approved)
- Projected driver/equipment locations and multi-job itineraries.
- Cross-location opportunity discovery and manager confirmation.
- Routing, deadhead-mile comparisons and financial estimates.
- Employee preferences and emergency reassignment.

## MVP acceptance criteria
- AC-01: An overlapping employee booking is flagged and cannot be silently confirmed.
- AC-02: Missing or expired required qualification evidence prevents dispatch-ready status.
- AC-03: Maintenance-blocked equipment cannot be silently double-booked.
- AC-04: Missing mandatory documents remain visible even when a job is scheduled.
- AC-05: Authorized assignees can access job summary, contacts, instructions and attachment references.
- AC-06: The calendar distinguishes unscheduled jobs from confirmed assignments.
- AC-07: All test data is fictional and industry-neutral.

## Design guardrails
- Unknown qualifications are not verified qualifications.
- Readiness and scheduling are separate concepts.
- Human managers approve cross-location assignments.
- Estimated locations are not live GPS facts.
- Internal transfers are not incremental enterprise-wide revenue.
- No proprietary information, company identity or source copied from existing private projects.
- No unmeasured savings claims.

## Open questions
Job duration/multiple stops; same-day equipment changes; blocking versus warning rules; roles and access; attachment handling; timezones and rest windows; cross-region visibility; override auditing.

## Next milestone
Approve scope, define data model and executable tests, then build a local TypeScript prototype before any public GitHub publication.
