# UI/UX & Design System

## 1. Theme Configuration

SkillSwap uses a modern, clean, and accessible aesthetic aimed at fostering a focused learning environment.

### Color Palette
- **Background**: Deep Slate (`#0f172a` for dark mode, `#f8fafc` for light mode).
- **Primary / Accent**: Indigo/Violet (`#6366f1` to `#8b5cf6`). Used for primary actions, active states, and brand identity.
- **Secondary**: Slate Gray (`#64748b`). Used for secondary text, borders, and muted elements.
- **Success**: Emerald (`#10b981`). Used for accepted swaps, online status, and positive feedback.
- **Destructive**: Rose (`#f43f5e`). Used for declining requests, error messages, and destructive actions.

### Typography
- **Font Family**: Inter (sans-serif) for clean readability across UI components.
- **Headings**: Semi-bold, tight tracking.
- **Body**: Regular weight, optimal line height for reading long descriptions and chat messages.

## 2. shadcn/ui Components Required

Initialize the following shadcn/ui components:
1. **`button`**: Standard actions (Primary, Secondary, Outline, Ghost).
2. **`card`**: For displaying user profiles in the discovery grid and encapsulating swap details.
3. **`dialog`**: For the Swap Request modal and confirming destructive actions.
4. **`badge`**: For displaying Skill tags (Teach vs. Learn visually distinct).
5. **`avatar`**: For user profile pictures in grids, chats, and headers.
6. **`tabs`**: For switching between "My Swaps", "Pending Requests", and "History".
7. **`toast`**: For non-blocking notifications (e.g., "Swap request sent!", "Message received").
8. **`dropdown-menu`**: For the user profile settings menu in the navigation bar.
9. **`input` / `textarea` / `label`**: For forms and chat input.

## 3. Page Wireframe Guidelines

### 3.1 Discovery Grid (`/discover`)
- **Header**: Global search bar and category filters.
- **Grid Layout**: Responsive grid (1 col mobile, 2 cols tablet, 3-4 cols desktop).
- **Profile Card**:
  - Avatar and Name centered.
  - "Can Teach:" section with Indigo badges.
  - "Wants to Learn:" section with Outline badges.
  - Primary button: "Request Swap".

### 3.2 Swap Request Modal
- Triggered from a Profile Card.
- **Header**: "Propose a Skill Swap with [User]".
- **Body**:
  - Dropdown to select which of *their* skills you want to learn.
  - Dropdown to select which of *your* skills you will teach them in return.
  - Textarea: Personal message/pitch.
- **Footer**: Cancel / Send Request buttons.

### 3.3 Chat & Classroom Layout (`/swaps/[id]`)
- **Split View (Desktop)**:
  - **Left Panel (30%)**: Swap details, user profiles involved, current status, and Real-time text chat.
  - **Right Panel (70%)**: The main workspace. If the swap is 'active', this embeds the Jitsi video iframe.
- **Mobile View**: Tabs to switch between "Chat" and "Video Classroom".
