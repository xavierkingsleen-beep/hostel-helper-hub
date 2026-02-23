

## Change Leave Sections to Horizontal (Full-Width) Layout

Both the Leave page and the LeaveLetterForm component currently display their two cards side-by-side in a 2-column grid on large screens. This plan changes them to a full-width stacked (vertical) layout so each card spans the entire width.

### Changes

**1. `src/components/LeaveLetterForm.tsx` (line 107)**
- Change `grid lg:grid-cols-2 gap-6` to `space-y-6` so the "Apply for Leave" form and "My Leave Applications" list stack vertically at full width.

**2. `src/pages/Leave.tsx` (line 20)**
- Change `grid lg:grid-cols-2 gap-6` to `space-y-6` so the LeaveLetterForm and "My Applications" card stack vertically at full width.

Both sections will now display as full-width horizontal cards stacked on top of each other.

