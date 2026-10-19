import test from 'node:test';
import assert from 'node:assert/strict';
import { overlaps, validateAssignment, canConfirm, type Assignment, type SchedulingData } from '../src/scheduling.ts';
const window = { start: '2026-11-02T14:00:00Z', end: '2026-11-02T17:00:00Z' };
const candidate: Assignment = { id: 'A2', jobId: 'J2', employeeIds: ['E1'], equipmentIds: ['V1'], window, state: 'proposed' };
function fixture(): SchedulingData { return {
  employees: [{ id: 'E1', unavailable: [], qualifications: [{ code: 'LICENSE-X', status: 'verified', validUntil: '2027-01-01T00:00:00Z' }] }],
  equipment: [{ id: 'V1', type: 'van', maintenance: [] }],
  jobs: [{ id: 'J2', status: 'ready', requiredQualifications: ['LICENSE-X'], requiredEquipmentTypes: ['van'], requiredDocumentNames: ['work-order'], documentNames: ['work-order'] }],
  assignments: []
}; }
const codes = (a: Assignment, d: SchedulingData) => validateAssignment(a, d).map(f => f.code);
test('adjacent intervals do not overlap', () => assert.equal(overlaps({ start: '2026-11-02T13:00:00Z', end: window.start }, window), false));
test('valid assignment can be confirmed', () => assert.equal(canConfirm(candidate, fixture()), true));
test('employee and equipment double-booking blocked', () => { const d = fixture(); d.assignments.push({ ...candidate, id: 'A1', state: 'confirmed' }); assert.ok(codes(candidate, d).includes('EMPLOYEE_OVERLAP')); assert.ok(codes(candidate, d).includes('EQUIPMENT_OVERLAP')); });
test('unverified qualification blocked', () => { const d = fixture(); d.employees[0]!.qualifications[0]!.status = 'unverified'; assert.ok(codes(candidate, d).includes('QUALIFICATION_NOT_VERIFIED')); });
test('expired qualification blocked', () => { const d = fixture(); d.employees[0]!.qualifications[0]!.validUntil = '2026-11-02T15:00:00Z'; assert.ok(codes(candidate, d).includes('QUALIFICATION_NOT_VERIFIED')); });
test('maintenance blocked', () => { const d = fixture(); d.equipment[0]!.maintenance.push(window); assert.ok(codes(candidate, d).includes('EQUIPMENT_MAINTENANCE')); });
test('missing documents flagged', () => { const d = fixture(); d.jobs[0]!.documentNames = []; assert.equal(validateAssignment(candidate, d).find(f => f.code === 'MISSING_DOCUMENT')?.severity, 'warning'); });
test('pending job not confirmable', () => { const d = fixture(); d.jobs[0]!.status = 'pending'; assert.equal(canConfirm(candidate, d), false); });
test('invalid time blocked', () => assert.ok(codes({ ...candidate, window: { start: window.end, end: window.start } }, fixture()).includes('INVALID_INTERVAL')));
test('wrong equipment type blocked', () => { const d = fixture(); d.jobs[0]!.requiredEquipmentTypes = ['tanker']; assert.ok(codes(candidate, d).includes('EQUIPMENT_TYPE_MISSING')); });
test('unknown employee blocked', () => assert.ok(codes({ ...candidate, employeeIds: ['E404'] }, fixture()).includes('UNKNOWN_EMPLOYEE')));
