

## Fix Login Issues: Student Login and Admin Login

After investigating the code and testing the login flow, I found two distinct problems:

### Problem 1: Admin Login Page uses fake/demo authentication
The **Admin Login page** (`/admin-login`) does NOT use real authentication at all. It uses a hardcoded `setTimeout` with a demo code `"ADMIN123"` and never actually signs the user in with the backend. This means even if the admin enters correct credentials, they are not authenticated and will be immediately kicked out by the `ProtectedRoute` on the admin dashboard.

### Problem 2: Admin Login route redirects to Student Login
In `App.tsx` (line 62), the route `/admin-login` is set to `<Navigate to="/login" replace />`, which means clicking "Admin Portal" on the home page takes you to the student login page instead of the admin login page. The `AdminLogin.tsx` component exists but is never actually shown.

### Fix

**1. `src/App.tsx`**
- Remove the redirect from `/admin-login` to `/login` (line 62)
- Instead, keep `/admin-login` but have it also use the real Login page (or point to a fixed admin login)
- Actually, the simplest and most correct fix: both students and admins should use the **same** `/login` page since the auth system already detects admin roles and redirects accordingly. Update the Index page's "Admin Portal" link to point to `/login` instead of `/admin-login`.

**2. `src/pages/Index.tsx`**
- Change the Admin Portal link from `/admin-login` to `/login` so admins use the same real login page.

**3. `src/pages/AdminLogin.tsx`**
- Replace the fake demo authentication with real backend authentication using `useAuth().signIn()`, exactly like the student login page does.
- Remove the hardcoded admin code field since admin roles are managed in the database.
- After successful sign-in, check `isAdmin` to redirect to `/admin-dashboard`.

This way, both student and admin logins use real authentication. The system already knows who is an admin based on the `user_roles` table and redirects them appropriately.

