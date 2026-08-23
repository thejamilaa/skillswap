# Implementation Roadmap

> **Note**: As requested, all terminal commands (installations, starting servers, etc.) will be provided as instructions. The user will execute them manually in the terminal.

This step-by-step checklist breaks down the MVP development into atomic, verifiable milestones.

## Milestone 1: Environment & Database Setup
- [ ] Initialize Next.js 14 project with App Router, TypeScript, and Tailwind CSS.
- [ ] Set up shadcn/ui and install core components (`button`, `card`, `input`).
- [ ] Configure Supabase project and apply the complete SQL schema (`02-database-schema.md`).
- [ ] Verify Row-Level Security (RLS) policies are active.
- [ ] Insert initial seed data for `skills`.
- **Validation**: Next.js app runs locally at `localhost:3000`. Supabase database has all tables and RLS enabled.

## Milestone 2: Authentication & User Profiles
- [ ] Integrate `@supabase/ssr` for server and client clients.
- [ ] Implement `middleware.ts` for route protection.
- [ ] Build Auth pages (Login, Register).
- [ ] Build Profile setup page (update `full_name`, `bio`, and select `user_skills`).
- **Validation**: A user can sign up, log in, protect dashboard routes, and save their teach/learn skills to the database.

## Milestone 3: Discovery & Search
- [ ] Build the `/discover` page UI (Grid layout, Profile Cards).
- [ ] Implement server-side data fetching to query users and their associated skills.
- [ ] Add basic client-side filtering or search by skill category.
- **Validation**: Dashboard displays other users. Filtering updates the grid correctly.

## Milestone 4: The Swap Engine
- [ ] Build the Swap Request Modal component.
- [ ] Implement server action or API route to `INSERT` into `swap_requests`.
- [ ] Build the `/swaps` dashboard page with tabs (Pending, Active, History).
- [ ] Implement UI/actions for a user to Accept or Decline incoming requests.
- **Validation**: User A can send a request to User B. User B sees the request and can accept it. State transitions to `accepted`.

## Milestone 5: Real-time Chat & Video Classroom
- [ ] Build the Chat Interface component.
- [ ] Implement Supabase Realtime subscription for the `messages` table.
- [ ] Build the `/swaps/[swapId]` workspace view.
- [ ] Integrate the `JitsiClassroom` component with dynamic room naming.
- **Validation**: User A and User B can send text messages instantly. Both users can join the embedded Jitsi video call seamlessly.

## Milestone 6: Polish & QA
- [ ] Review UI against the Design System (`04-ui-ux-design-system.md`). Ensure dark/light mode consistency.
- [ ] Implement error handling and loading states (React Suspense, skeleton loaders, shadcn Toasts).
- [ ] Perform security audit (Verify RLS cannot be bypassed via client edge cases).
- [ ] Deploy to Vercel.
- **Validation**: Production deployment works smoothly without console errors or layout shifts.
