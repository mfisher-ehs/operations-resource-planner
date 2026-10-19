# Scheduling Workflow — Discovery Draft

**Status:** Proposed interpretation of firsthand process observations; review before implementation.

## Existing operational pattern
1. Review pending jobs and determine which are ready for scheduling.
2. Identify available personnel and verify job-specific qualifications.
3. Check compatible equipment, current commitments and maintenance blocks.
4. Consider employee starting locations, appointment windows, destinations and personal availability.
5. Schedule the work and provide the assignee with instructions, contacts and documents.
6. Revisit the plan as emergencies, maintenance or additional jobs arise.
7. When local work is limited, contact other locations to identify suitable work for available resources.

The original process relied on calendar tools, color coding and direct manager communication. This document does not claim to describe every step or a standardized employer procedure.

## Proposed MVP workflow
```text
Pending job
   |
   v
Check required details and documents
   |
   v
Review candidate employees and equipment
   |
   v
Check conflicts, qualifications and maintenance
   |
   +-- Not feasible --> Remains pending / needs review
   |
   v
Manager confirms assignment
   |
   v
Scheduled job + visible readiness status
   |
   v
Authorized assignee accesses job packet
```

## Explicit distinctions
- **Pending vs. ready job:** Information/workflow state; not proof that resources are available.
- **Scheduled vs. dispatch-ready:** A calendar booking can exist while required documents or qualifications remain unresolved.
- **Available vs. eligible:** An unbooked employee may lack verified qualifications for a particular job.
- **Suggested vs. approved:** Future cross-location matches require human confirmation.

## Questions for review
- Can a job have multiple employees, equipment units or appointment windows?
- Are jobs frequently chained into multi-stop workdays?
- Which conflicts block confirmation, and which require documented override?
- How are files stored, secured, updated and delivered to assignees?
- Which roles may see jobs across locations?
