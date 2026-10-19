# Technical Design — Proposed Foundation

**Status:** Concept only. No implementation or tests have been committed.

## Initial boundaries
Build a small, generic scheduling prototype using fictional organizations, locations, people, jobs and equipment. No private employer systems, customer records, confidential operating data or source code are dependencies.

## Candidate entities
| Entity | Purpose | Illustrative fields |
|---|---|---|
| Location | Operational site or destination | id, name, timezone |
| Employee | Person eligible for assignments | id, homeLocationId, availability |
| Qualification | Evidence for a job requirement | employeeId, type, validUntil, verificationStatus |
| Equipment | Reservable resource | id, type, locationId, operationalStatus |
| MaintenanceBlock | Period equipment cannot be assigned | equipmentId, startsAt, endsAt |
| Job | Work request and instructions | id, orderReference, summary, appointmentWindow, status |
| JobRequirement | Required qualification or equipment type | jobId, requirementType, requirementValue |
| AttachmentReference | Reference to an authorized job document | jobId, displayName, accessPolicy |
| Assignment | Reservation of personnel and equipment | jobId, employeeIds, equipmentIds, startsAt, endsAt, state |
| AssignmentEvent | Traceable assignment changes | assignmentId, action, actorId, occurredAt |

These fields are illustrative, not a final schema. File storage and identity/access systems are deliberately unspecified.

## Proposed validation contract
A scheduling decision should report structured findings, rather than only a true/false value:
- Employee time overlap
- Equipment time overlap
- Maintenance block
- Qualification missing, unverified or expired
- Missing required job documents
- Incomplete appointment or duration information

Findings should distinguish **blocking** from **informational** results once the business rules are approved. Unknown evidence must not be interpreted as verified eligibility.

## Test strategy
Start with deterministic, dependency-free tests for interval overlap, qualification evidence, equipment maintenance conflicts and readiness versus scheduling status. Add UI and integration tests after domain behavior is agreed.

## Deferred decisions
Routing provider and mileage data, map visualization, cost models, employee preferences, inter-location approvals, document storage, authentication, audit retention and time-zone/DST handling.

## Security and attribution
This is a newly authored public portfolio project. Use synthetic records only. Do not copy code, private specifications, screenshots, datasets or commit history from unrelated private repositories. Claims of savings or deployment require evidence.
