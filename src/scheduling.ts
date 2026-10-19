export type Interval = { start: string; end: string };
export type Qualification = { code: string; status: 'verified' | 'unverified'; validUntil: string };
export type Employee = { id: string; qualifications: Qualification[]; unavailable: Interval[] };
export type Equipment = { id: string; type: string; maintenance: Interval[] };
export type Job = { id: string; status: 'pending' | 'ready' | 'cancelled'; requiredQualifications: string[]; requiredEquipmentTypes: string[]; requiredDocumentNames: string[]; documentNames: string[] };
export type Assignment = { id: string; jobId: string; employeeIds: string[]; equipmentIds: string[]; window: Interval; state: 'proposed' | 'confirmed' | 'cancelled' };
export type Finding = { code: string; severity: 'blocker' | 'warning'; message: string };
export type SchedulingData = { employees: Employee[]; equipment: Equipment[]; jobs: Job[]; assignments: Assignment[] };
const ms = (s: string) => Date.parse(s);
export const validInterval = (w: Interval) => Number.isFinite(ms(w.start)) && Number.isFinite(ms(w.end)) && ms(w.start) < ms(w.end);
/** Half-open intervals allow adjacent appointments. */
export const overlaps = (a: Interval, b: Interval) => validInterval(a) && validInterval(b) && ms(a.start) < ms(b.end) && ms(b.start) < ms(a.end);
export function validateAssignment(a: Assignment, data: SchedulingData): Finding[] {
  const result: Finding[] = [];
  const add = (code: string, severity: Finding['severity'], message: string) => result.push({ code, severity, message });
  if (!validInterval(a.window)) { add('INVALID_INTERVAL', 'blocker', 'Invalid start or end time.'); return result; }
  const job = data.jobs.find(j => j.id === a.jobId);
  if (!job) { add('UNKNOWN_JOB', 'blocker', a.jobId); return result; }
  if (job.status === 'cancelled') add('CANCELLED_JOB', 'blocker', a.jobId);
  if (job.status === 'pending') add('JOB_PENDING', 'blocker', a.jobId);
  if (!a.employeeIds.length) add('NO_EMPLOYEE', 'blocker', a.id);
  if (new Set(a.employeeIds).size !== a.employeeIds.length) add('DUPLICATE_EMPLOYEE', 'blocker', a.id);
  if (new Set(a.equipmentIds).size !== a.equipmentIds.length) add('DUPLICATE_EQUIPMENT', 'blocker', a.id);
  for (const name of job.requiredDocumentNames) if (!job.documentNames.includes(name)) add('MISSING_DOCUMENT', 'warning', name);
  for (const id of a.employeeIds) {
    const e = data.employees.find(x => x.id === id);
    if (!e) { add('UNKNOWN_EMPLOYEE', 'blocker', id); continue; }
    if (e.unavailable.some(w => overlaps(w, a.window))) add('EMPLOYEE_UNAVAILABLE', 'blocker', id);
    for (const code of job.requiredQualifications) {
      const q = e.qualifications.find(x => x.code === code);
      if (!q || q.status !== 'verified' || !Number.isFinite(ms(q.validUntil)) || ms(q.validUntil) < ms(a.window.end)) add('QUALIFICATION_NOT_VERIFIED', 'blocker', id + ': ' + code);
    }
  }
  for (const id of a.equipmentIds) {
    const e = data.equipment.find(x => x.id === id);
    if (!e) { add('UNKNOWN_EQUIPMENT', 'blocker', id); continue; }
    if (e.maintenance.some(w => overlaps(w, a.window))) add('EQUIPMENT_MAINTENANCE', 'blocker', id);
  }
  for (const type of new Set(job.requiredEquipmentTypes)) {
    const needed = job.requiredEquipmentTypes.filter(x => x === type).length;
    const assigned = a.equipmentIds.filter(id => data.equipment.find(x => x.id === id)?.type === type).length;
    if (assigned < needed) add('EQUIPMENT_TYPE_MISSING', 'blocker', type);
  }
  for (const existing of data.assignments) {
    if (existing.id === a.id || existing.state !== 'confirmed' || !overlaps(existing.window, a.window)) continue;
    if (existing.jobId === a.jobId) add('JOB_ALREADY_BOOKED', 'blocker', existing.id);
    for (const id of a.employeeIds) if (existing.employeeIds.includes(id)) add('EMPLOYEE_OVERLAP', 'blocker', id);
    for (const id of a.equipmentIds) if (existing.equipmentIds.includes(id)) add('EQUIPMENT_OVERLAP', 'blocker', id);
  }
  return result.filter((f, i) => result.findIndex(x => x.code === f.code && x.message === f.message) === i);
}
export const canConfirm = (a: Assignment, data: SchedulingData) => !validateAssignment(a, data).some(f => f.severity === 'blocker');
