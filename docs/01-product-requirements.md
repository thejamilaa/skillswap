# SkillSwap - Product Requirements Document (PRD)

## 1. High-Level Overview
SkillSwap is a peer-to-peer skill-sharing platform where individuals can teach what they know and learn what they want. By leveraging a **Time-Banking / Token System**, users can bypass strict 1:1 swaps and traditional financial transactions. The MVP focuses on establishing connections, managing swap requests, providing real-time text communication, and facilitating AI-enhanced video sessions. 

**Initial Niche Focus**: The MVP will specifically target two core audiences to build initial liquidity:
- **Developers & Designers** (e.g., Frontend devs trading React knowledge for UI/UX lessons).
- **Mock Interviews & Language Practice** (e.g., Professionals prepping for international companies).

## 2. User Personas

### 2.1 The Learner
- **Goal**: Acquire new skills (e.g., React, Spanish) without spending money.
- **Pain Point**: Cannot afford expensive courses or tutors.
- **Behavior**: Searches for specific skills, views mentor profiles, and sends swap requests using their "Skill Credits".

### 2.2 The Mentor
- **Goal**: Share expertise to earn "Skill Credits", which they can later spend to learn a secondary skill from anyone else.
- **Pain Point**: Wants a structured way to offer help without getting overwhelmed or ghosted.
- **Behavior**: Lists skills they can teach, reviews incoming requests, and hosts video sessions.

### 2.3 The Dual User (Core Target)
- **Goal**: Teach to earn credits, and spend credits to learn.
- **Behavior**: Actively maintains both "Teach" and "Learn" skill tags, engages in the broader time-banking economy.

## 3. Core MVP Scope

### 3.1 User Onboarding & Profiles
- Seamless authentication (Email/Password & OAuth).
- User profile creation: Name, Bio, Avatar, and Resume data (for AI matching).
- Users receive a starting balance of 1 "Skill Credit".

### 3.2 Skill Tagging System
- Categorization of skills a user can **Teach**.
- Categorization of skills a user wants to **Learn**.

### 3.3 Discovery & Search
- Directory of users filtered by skills offered and wanted.
- **AI Matching**: Automatically analyzes a user's resume, bio, and skills to recommend the most suitable mentors or learners.

### 3.4 Swap Request Pipeline & Time-Banking
- **Time-Banking (Skill Credits)**: Instead of forced 1:1 swaps, users earn 1 "Skill Credit" for teaching a 1-hour session. They can spend this credit to learn from *anyone* else on the platform, significantly increasing market liquidity.
- **State Machine**: `Pending` -> `Accepted` -> `Active` -> `Completed` / `Declined`.
- **Anti-Ghosting (Reputation Deposit)**: When a session is scheduled, 1 Skill Credit is frozen from the learner's account. If the session is completed successfully, the mentor earns it. If the learner "ghosts" (no-show), they forfeit the frozen credit and their reputation score decreases.

### 3.5 Communication & Video
- **Real-time Text Chat**: In-app messaging for users with an `Accepted` or `Active` swap to coordinate schedules and details.
- **Peer-to-Peer Video Classroom**: A dedicated, dynamically generated video meeting link for the actual skill exchange session.
- **AI Summarizer (Lesson Notes)**: Integrates with Jitsi transcripts to automatically generate a summary of the lesson and action items/homework post-session.

## 4. Non-Functional Requirements

### 4.1 Security & Privacy
- **Authentication**: JWT-based session management using Supabase Auth.
- **Data Isolation**: Strict PostgreSQL Row-Level Security (RLS) ensuring users only see their own private data, messages, and requests.

### 4.2 Performance & Responsiveness
- **Edge Rendering**: Utilize Next.js App Router for optimal Server-Side Rendering (SSR).
- **Mobile-First Design**: Fully responsive UI built with Tailwind CSS.

### 4.3 Scalability
- Serverless architecture utilizing Vercel for the frontend and Supabase for the database.
