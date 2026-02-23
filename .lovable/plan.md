
## Add Photo Upload to Complaints

Allow students to attach a photo/image when submitting a complaint, and display the image in both the student's complaint list and the admin dashboard.

### What Changes

1. **Create a storage bucket** for complaint images via a database migration
2. **Add an `image_url` column** to the `complaints` table to store the uploaded image path
3. **Update the complaint form** (`src/pages/Complaints.tsx`) with a file input for selecting and previewing an image before submitting
4. **Update the complaint hook** (`src/hooks/useComplaints.tsx`) to handle uploading the image to storage and saving the URL when submitting a complaint
5. **Show the image in the student complaint list** (`src/pages/Complaints.tsx`) as a clickable thumbnail under the description
6. **Show the image in the admin complaints table** (`src/pages/AdminDashboard.tsx`) with a new "Photo" column displaying a thumbnail that can be clicked to view full size

### Technical Details

**Database migration (SQL):**
- Add `image_url text DEFAULT NULL` column to `complaints` table
- Create a `complaint-images` storage bucket (public)
- Add RLS policies on `storage.objects` so authenticated students can upload to the bucket and anyone authenticated can view images

**`src/hooks/useComplaints.tsx`:**
- Update `Complaint` interface to include `image_url: string | null`
- Modify `submitComplaint` to accept an optional `File` parameter
- If a file is provided, upload it to `complaint-images` bucket with a unique path (`{user_id}/{timestamp}_{filename}`), get the public URL, and include `image_url` in the insert

**`src/pages/Complaints.tsx`:**
- Add file input state (`selectedFile`, `previewUrl`)
- Add an image upload area below the description field with a camera/image icon
- Show a small preview of the selected image before submission
- Clear the file on successful submit
- In the complaints list, render the image as a small thumbnail if `image_url` exists

**`src/pages/AdminDashboard.tsx`:**
- Add a "Photo" column to the complaints table
- Display a small thumbnail if `image_url` exists, clickable to view full size in a dialog
