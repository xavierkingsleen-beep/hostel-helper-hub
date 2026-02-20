

## Add Reject Reason to Leave Applications

This plan adds a "reject reason" field so admins can explain why a leave application was rejected, and students can see that reason on their dashboard.

### What Changes

**1. Database: Add `reject_reason` column**
- Add a nullable `reject_reason` text column to the `leave_applications` table

**2. Admin Leave Manager (`AdminLeaveManager.tsx`)**
- When admin selects "Rejected", show a dialog/textarea prompting them to enter a rejection reason before confirming
- The reject reason gets saved to the database along with the status change
- Show the reject reason in the application detail dialog
- Update `handleStatusChange` to accept an optional reason parameter

**3. Leave Applications Hook (`useLeaveApplications.tsx`)**
- Update `LeaveApplication` interface to include `reject_reason: string | null`
- Update `updateApplicationStatus` to accept and save `reject_reason`

**4. Student Leave Page (`Leave.tsx`)**
- When a leave application is rejected, display the rejection reason below the status badge so the student understands why

**5. Leave Letter Form (`LeaveLetterForm.tsx`)**
- Show reject reason in the "My Leave Applications" list for rejected applications

### Technical Details

**Database Migration:**
```sql
ALTER TABLE leave_applications
ADD COLUMN reject_reason text DEFAULT NULL;
```

**Admin Rejection Flow:**
- Current: Admin picks "Rejected" from dropdown and it saves immediately
- New: When "Rejected" is selected, a dialog opens with a textarea for the reason. Admin clicks "Confirm Rejection" to save both the status and reason. For "Approved" or "Pending", behavior stays the same (no reason needed).

**Student View:**
- Rejected applications will show a red-tinted box with the rejection reason text below the existing application card content

