#!/usr/bin/env bash
# =============================================================================
# DSCWoC Issue Migration Script for Flash-Fathom-AI
# =============================================================================
# This script:
#   1. Creates all required DSCWoC labels
#   2. Removes hacktoberfest & gssoc2025 labels from all existing issues
#   3. Replaces old Level labels with new level-* labels
#   4. Adds task-based labels to each issue
#   5. Updates issue descriptions with clear, project-aware context
#   6. Creates new improvement issues for the project
#
# PREREQUISITES:
#   - GitHub CLI (gh) installed and authenticated
#   - Run from the repository root: bash scripts/dscwoc-migrate-issues.sh
# =============================================================================

set -euo pipefail

REPO="Suraj-kumar00/Flash-Fathom-AI"

echo "============================================="
echo " DSCWoC Issue Migration – Flash Fathom AI"
echo "============================================="

# ---------------------------------------------------------
# STEP 1: Create new DSCWoC labels
# ---------------------------------------------------------
echo ""
echo ">>> Step 1: Creating DSCWoC labels..."

create_label() {
  local name="$1" desc="$2" color="$3"
  if gh label create "$name" --description "$desc" --color "$color" -R "$REPO" 2>/dev/null; then
    echo "  ✅ Created label: $name"
  else
    echo "  ⏭️  Label already exists: $name"
  fi
}

create_label "dscwoc"        "DSC Winter of Code program"                      "0075ca"
create_label "level-1"       "Beginner-friendly tasks (10 points)"             "7057ff"
create_label "level-2"       "Moderate complexity tasks (20 points)"           "ff9800"
create_label "level-3"       "Advanced or complex tasks (30 points)"           "e11d48"
create_label "feature"       "New functionality being added"                   "a2eeef"
create_label "ui/ux"         "Interface or user experience improvements"       "f9d0c4"
create_label "documentation" "README updates, guides, or written explanations" "0075ca"
create_label "refactor"      "Code restructuring without behavior change"      "d4c5f9"
create_label "testing"       "Adding or improving automated tests"             "bfd4f2"

# ---------------------------------------------------------
# STEP 2: Remove old labels from all labeled issues
# ---------------------------------------------------------
echo ""
echo ">>> Step 2: Removing hacktoberfest & gssoc2025 labels..."

for issue in 106 101 95 94 92 91 87 86 81; do
  echo "  Cleaning issue #$issue..."
  gh issue edit "$issue" --remove-label "hacktoberfest" -R "$REPO" 2>/dev/null || true
  gh issue edit "$issue" --remove-label "gssoc2025" -R "$REPO" 2>/dev/null || true
done

# ---------------------------------------------------------
# STEP 3: Replace old Level labels with new level-* labels
#         and add task-based labels per issue
# ---------------------------------------------------------
echo ""
echo ">>> Step 3: Updating labels on each issue..."

# Issue #106
gh issue edit 106 --remove-label "Level 1" --add-label "dscwoc,level-1" -R "$REPO" 2>/dev/null || true
echo "  ✅ #106 labels updated"

# Issue #101
gh issue edit 101 --remove-label "Level 2" --add-label "dscwoc,level-2,ui/ux" -R "$REPO" 2>/dev/null || true
echo "  ✅ #101 labels updated"

# Issue #95
gh issue edit 95 --remove-label "Level 3" --add-label "dscwoc,level-3,feature" -R "$REPO" 2>/dev/null || true
echo "  ✅ #95 labels updated"

# Issue #94
gh issue edit 94 --remove-label "Level 1" --add-label "dscwoc,level-1,documentation" -R "$REPO" 2>/dev/null || true
echo "  ✅ #94 labels updated"

# Issue #92
gh issue edit 92 --remove-label "Level 1" --add-label "dscwoc,level-1" -R "$REPO" 2>/dev/null || true
echo "  ✅ #92 labels updated"

# Issue #91
gh issue edit 91 --remove-label "Level 3" --add-label "dscwoc,level-3,ui/ux" -R "$REPO" 2>/dev/null || true
echo "  ✅ #91 labels updated"

# Issue #87
gh issue edit 87 --remove-label "Level 1" --add-label "dscwoc,level-1,feature" -R "$REPO" 2>/dev/null || true
echo "  ✅ #87 labels updated"

# Issue #86 (also remove incorrect bug label)
gh issue edit 86 --remove-label "Level 1" --remove-label "bug" --add-label "dscwoc,level-1,ui/ux" -R "$REPO" 2>/dev/null || true
echo "  ✅ #86 labels updated"

# Issue #81
gh issue edit 81 --remove-label "Level 2" --add-label "dscwoc,level-2,feature,ui/ux" -R "$REPO" 2>/dev/null || true
echo "  ✅ #81 labels updated"

# Issues without labels
gh issue edit 113 --add-label "dscwoc,level-1,bug,ui/ux,good first issue" -R "$REPO" 2>/dev/null || true
echo "  ✅ #113 labels updated"

gh issue edit 112 --add-label "dscwoc,level-1,ui/ux,enhancement,good first issue" -R "$REPO" 2>/dev/null || true
echo "  ✅ #112 labels updated"

gh issue edit 111 --add-label "dscwoc,level-2,feature,ui/ux" -R "$REPO" 2>/dev/null || true
echo "  ✅ #111 labels updated"

gh issue edit 103 --add-label "dscwoc,level-1,enhancement" -R "$REPO" 2>/dev/null || true
echo "  ✅ #103 labels updated"

gh issue edit 102 --add-label "dscwoc,level-1,enhancement" -R "$REPO" 2>/dev/null || true
echo "  ✅ #102 labels updated"

# ---------------------------------------------------------
# STEP 4: Update issue descriptions with clear project context
# ---------------------------------------------------------
echo ""
echo ">>> Step 4: Updating issue descriptions..."

gh issue edit 106 -R "$REPO" --body '## Delete Flashcard is Not Working

**Describe the bug**
When attempting to delete an individual flashcard from the saved flashcards view, the delete button does not perform any action. The flashcard remains in the list and is not removed from the database or the UI.

**Root Cause Analysis**
After reviewing the codebase, the delete API exists at `src/app/api/decks/[id]/route.ts` but only handles **deck-level deletion**. There is **no API endpoint or UI handler for deleting individual flashcards** within a deck. The `FlashcardViewer.tsx` component only has flip/navigation buttons — no delete action.

**What Needs to Be Done**
1. Create a new API route: `src/app/api/flashcards/[id]/route.ts` with a DELETE handler
2. Add a delete button/icon to `src/components/flashcards/FlashcardViewer.tsx`
3. Implement confirmation dialog before deletion
4. Add proper authorization check (only card owner can delete)
5. Show success/error toast notification after deletion
6. Update the UI optimistically to remove the card from the list

**Tech Stack Reference**
- Database: Prisma ORM with PostgreSQL (Supabase)
- Auth: Clerk v6 — use `auth()` to get `userId`
- UI: shadcn/ui components, Tailwind CSS
- Existing pattern: See `src/app/api/decks/[id]/route.ts` for delete API example

**To Reproduce**
1. Sign in and generate flashcards
2. Navigate to saved flashcards (`/flashcards`)
3. Open a deck and try to delete an individual flashcard
4. Observe: no delete option exists or the action fails

**Expected behavior**
Individual flashcards should be deletable with a confirmation dialog, and the UI should update immediately.

**Acceptance Criteria**
- [ ] DELETE API endpoint for individual flashcards
- [ ] Delete button in FlashcardViewer UI
- [ ] Confirmation dialog before deletion
- [ ] Toast notification on success/failure
- [ ] Authorization check (only owner can delete)
'
echo "  ✅ #106 description updated"

gh issue edit 113 -R "$REPO" --body '## Navbar UI Breaks with Long Usernames

**Describe the bug**
When a user has a long display name (e.g., "Kokkula Sahithi 4-Yr B.Tech.: Mechanical Engg., IIT(BHU)"), the navbar layout breaks. The username section expands beyond its allocated space, causing navigation tabs to overlap and the layout to become cluttered.

**Root Cause Analysis**
In `src/components/Navbar.tsx`, the username is displayed using `user?.fullName || user?.username || "User"` inside a badge component (around line 151) without any text truncation or max-width constraint. The badge uses `hidden md:block` for responsive hiding but has no overflow handling.

**What Needs to Be Done**
1. Add `max-w-[150px] truncate` or similar Tailwind classes to the username badge
2. Add a `title` attribute to show the full name on hover
3. Test with very long names on desktop, tablet, and mobile breakpoints
4. Ensure the Clerk `UserButton` component and navigation links do not overlap

**Files to Modify**
- `src/components/Navbar.tsx` — line ~150-155 (username badge section)

**Acceptance Criteria**
- [ ] Long usernames are truncated with ellipsis in the navbar
- [ ] Full name visible on hover (tooltip)
- [ ] Navigation links remain properly spaced
- [ ] Works on all screen sizes (desktop, tablet, mobile)
'
echo "  ✅ #113 description updated"

gh issue edit 112 -R "$REPO" --body '## Add Logout Confirmation Dialog

**Current Problem**
Currently, logout is handled entirely by Clerk'\''s built-in `UserButton` component in `src/components/Navbar.tsx`. When users click sign out, they are logged out instantly without confirmation, which can cause accidental logouts.

**What Needs to Be Done**
Since the app uses Clerk'\''s `UserButton` with `afterSignOutUrl="/"`, there are two approaches:

**Option A (Recommended):** Use Clerk'\''s `<UserButton.MenuItems>` to add a custom "Sign Out" menu item that triggers a confirmation dialog before calling `signOut()` from `@clerk/nextjs`.

**Option B:** Replace `UserButton` with a custom dropdown that includes a logout option with a confirmation modal using shadcn/ui `AlertDialog`.

**Implementation Details**
1. Create a confirmation dialog component using shadcn/ui `AlertDialog`
2. Dialog should show: "Are you sure you want to log out?"
3. Two buttons: "Cancel" (closes dialog) and "Confirm" (calls Clerk signOut)
4. Match the app'\''s existing dark/light theme styling

**Files to Modify**
- `src/components/Navbar.tsx` — UserButton section (line ~160)
- May need new: `src/components/LogoutDialog.tsx`

**Acceptance Criteria**
- [ ] Clicking logout shows a confirmation dialog
- [ ] "Cancel" keeps user logged in
- [ ] "Confirm" signs the user out and redirects to homepage
- [ ] Dialog supports dark and light mode
- [ ] Works on mobile and desktop
'
echo "  ✅ #112 description updated"

gh issue edit 111 -R "$REPO" --body '## Add Contact Page and Link It from Navbar

**Is your feature request related to a problem?**
The Contact page at `/contact` exists (`src/app/contact/page.tsx`) and renders the `<Contact />` component, but the contact form currently uses a **simulated API** with a random 70% success rate — it does not actually send emails or store messages.

**What Needs to Be Done**
1. **Backend:** Create a real API route at `src/app/api/contact/route.ts` to handle form submissions
2. **Email Integration:** Use `nodemailer` (already in dependencies) to send contact form submissions to the project admin email
3. **Form Validation:** Add server-side validation for name, email, subject, and message fields
4. **Rate Limiting:** Add basic rate limiting to prevent spam
5. **Success/Error Handling:** Show proper toast notifications based on actual API response
6. **Navbar Link:** Verify the `/contact` link in `Navbar.tsx` works correctly (it already exists in the navLinks array)

**Files to Modify**
- `src/components/Contact.tsx` — Update form submission handler to call real API
- Create: `src/app/api/contact/route.ts` — New API endpoint
- `.env.example` — Add SMTP/email config variables if needed

**Tech Stack**
- Email: nodemailer (already installed)
- Validation: Zod schema validation
- UI: shadcn/ui form components, toast notifications

**Acceptance Criteria**
- [ ] Contact form submits to a real API endpoint
- [ ] Emails are sent via nodemailer to admin
- [ ] Server-side validation for all fields
- [ ] Success/error toast notifications
- [ ] Form resets on successful submission
- [ ] Works in both dark and light mode
'
echo "  ✅ #111 description updated"

gh issue edit 101 -R "$REPO" --body '## Improve the UI of the /generate Page Dashboard

**Is your feature request related to a problem?**
The current `/generate` page (`src/app/(dashboard)/generate/page.tsx`) is a minimal wrapper that only renders the `<Flashcard />` component. The UI feels unpolished compared to the rest of the app and could be more user-friendly and visually consistent.

**What Needs to Be Done**
1. Redesign the `/generate` page with a cleaner, more intuitive layout
2. Add a header/title section with description of the feature
3. Improve the flashcard generation form with better spacing and visual hierarchy
4. Add generation history or recent topics section
5. Show the user'\''s remaining generation quota (Free=10, Basic=500, Pro=2000, Org=10000/month)
6. Improve responsiveness across screen sizes
7. Keep the existing color theme and dark/light mode support

**Key Files**
- `src/app/(dashboard)/generate/page.tsx` — Page wrapper (currently ~10 lines)
- `src/components/core/flash-card.tsx` — Flashcard display component
- `src/components/flashcards/FlashcardGenerator.tsx` — Generation form
- `src/components/flashcards/FlashcardSaveDialog.tsx` — Save dialog

**Important Constraints**
- All existing functionality must remain intact
- Maintain dark mode support (`bg-slate-50 dark:bg-black` theme)
- Use shadcn/ui components for consistency
- Follow the existing Tailwind CSS patterns

**Live Reference**
👉 [https://flash-fathom-ai.vercel.app/generate](https://flash-fathom-ai.vercel.app/generate)

**Acceptance Criteria**
- [ ] Cleaner, more modern layout for the generate page
- [ ] Generation quota display based on subscription plan
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Dark/light mode fully supported
- [ ] No functionality regression
'
echo "  ✅ #101 description updated"

gh issue edit 95 -R "$REPO" --body '## Implement PDF-to-Flashcards Feature

**Is your feature request related to a problem?**
Currently, the app only generates flashcards from text prompts via the Gemini API. Users who have study material in PDF format must manually copy-paste content, which is impractical for long documents.

**What Needs to Be Done**
This is a complex feature requiring changes across multiple layers:

### Backend
1. Create API route: `src/app/api/generate-from-pdf/route.ts`
2. Parse PDF content using a library like `pdf-parse` or `pdfjs-dist`
3. Send extracted text to Gemini API for flashcard generation
4. Respect subscription plan limits (Free=10, Basic=500, Pro=2000, Org=10000 flashcards/month)
5. Add file size validation (suggest max 10MB)

### Frontend
1. Add PDF upload UI in the generate page with drag-and-drop support
2. Show upload progress and processing status
3. Display generated flashcards for review before saving
4. Allow users to edit generated flashcards before saving to a deck
5. Support both light and dark mode

### Chat-style UI (Optional Enhancement)
1. Update the chatbot-style interface to accept PDF file uploads
2. Similar to ChatGPT file upload experience

**Files to Create/Modify**
- Create: `src/app/api/generate-from-pdf/route.ts`
- Modify: `src/app/(dashboard)/generate/page.tsx`
- Modify: `src/components/flashcards/FlashcardGenerator.tsx`
- Modify: `src/lib/services/subscription.service.ts` (quota checking)

**Tech Stack**
- PDF parsing: `pdf-parse` or `pdfjs-dist`
- AI: Gemini API (existing integration at `src/app/api/generate/route.ts`)
- Storage: Process in-memory, no persistent PDF storage needed
- Auth: Clerk (existing middleware)

**Acceptance Criteria**
- [ ] Users can upload PDF files
- [ ] PDF content is extracted and processed by Gemini API
- [ ] Generated flashcards are displayed for review
- [ ] Users can edit and save flashcards to a deck
- [ ] Subscription plan limits are enforced
- [ ] File size validation (max 10MB)
- [ ] Dark/light mode support
- [ ] Error handling for invalid/corrupt PDFs
'
echo "  ✅ #95 description updated"

gh issue edit 94 -R "$REPO" --body '## Update Screenshot on /generate Page

**Description**
The current screenshot displayed on the `/generate` page is outdated and does not reflect the latest UI design. It needs to be replaced with an updated, high-quality screenshot.

**What Needs to Be Done**
1. Sign in to the application
2. Navigate to the `/generate` page
3. Generate a flashcard using a **technical topic** (e.g., "Data Structures", "React Hooks", "Docker Containers")
4. Capture a high-quality screenshot (at least 1920x1080)
5. Save the screenshot to `public/` directory with an appropriate name
6. Update the image reference in the relevant component or page

**Files to Modify**
- `public/` — Add new screenshot image
- Check components that reference the old screenshot and update the path

**Acceptance Criteria**
- [ ] New screenshot reflects the latest `/generate` page UI
- [ ] Screenshot is high-resolution and clean
- [ ] Technical topic used for the example flashcard
- [ ] Image is optimized for web (compressed, reasonable file size)
- [ ] All references to the old screenshot are updated
'
echo "  ✅ #94 description updated"

gh issue edit 92 -R "$REPO" --body '## Creator'\''s Image Not Visible on Homepage

**Describe the bug**
The creator'\''s profile image is not displayed on the homepage in production, even though it may work locally.

**Root Cause Analysis**
After reviewing `src/app/page.tsx`, the homepage uses generic placeholder avatars from `randomuser.me/api/portraits/` for the "Join 100+ creators" section. There is no dedicated creator/founder section with an actual profile image. The issue may be one of:
1. An external image URL that is blocked by Next.js image optimization (check `next.config.js` `images.remotePatterns`)
2. A missing or incorrect image path in the `public/` directory
3. The image being referenced from an external domain not configured in `next.config.js`

**What Needs to Be Done**
1. Add the creator'\''s actual image to the `public/` directory (e.g., `public/creator.jpg`)
2. Use Next.js `<Image>` component with local path instead of external URL
3. If using external URLs, add the domain to `next.config.js` under `images.remotePatterns`
4. Test in both development and production builds (`pnpm build && pnpm start`)

**Files to Modify**
- `src/app/page.tsx` — Update image source
- `next.config.js` — Add remote image domains if needed
- `public/` — Add local image file

**Acceptance Criteria**
- [ ] Creator'\''s image is visible on the homepage
- [ ] Works in both local development and production (Vercel)
- [ ] Image loads quickly (optimized, appropriate size)
- [ ] Works in both dark and light mode
'
echo "  ✅ #92 description updated"

gh issue edit 91 -R "$REPO" --body '## Improve Study Mode – Add Dedicated Navigation for Flashcard Sets in Navbar

**Current Problem**
There is no dedicated navigation link in the navbar for accessing flashcard sets in Study Mode. Users have to navigate to `/flashcards`, open a deck, and then find the study option. The study mode itself (`src/components/study/StudyMode.tsx`) is well-implemented but lacks easy discoverability.

**What Needs to Be Done**

### 1. Navbar Enhancement
- Add a "Study" navigation link in `src/components/Navbar.tsx`
- Link should point to a study dashboard that shows available flashcard sets
- Add to both desktop nav and mobile menu
- Include proper hover effects and active state styling

### 2. Study Dashboard Page
- Create a new page at `src/app/study/page.tsx`
- Show all user'\''s decks with study-related stats (last studied, mastery %, card count)
- Quick "Start Study" button per deck
- Filter/sort options (by date, mastery level, etc.)

### 3. Study Mode Improvements
The existing `StudyMode.tsx` has these areas for improvement:
- Right swipe navigation is commented out (line ~77) — enable it
- Add statistics persistence between study sessions
- Add option to re-study failed/difficult cards
- Ensure full dark/light mode consistency

### 4. Design Requirements
- Full support for light and dark modes
- Smooth hover effects on navigation items
- Consistent with the existing purple/gradient color theme
- Mobile-responsive layout

**Files to Create/Modify**
- `src/components/Navbar.tsx` — Add "Study" nav link
- Create: `src/app/study/page.tsx` — Study dashboard
- `src/components/study/StudyMode.tsx` — Improvements
- May need: `src/components/study/StudyDashboard.tsx`

**Acceptance Criteria**
- [ ] "Study" link added to navbar (desktop + mobile)
- [ ] Study dashboard page showing all decks with stats
- [ ] Quick study start from dashboard
- [ ] Dark/light mode fully supported
- [ ] Touch gestures working (both swipe directions)
- [ ] Responsive on all screen sizes
'
echo "  ✅ #91 description updated"

gh issue edit 87 -R "$REPO" --body '## Missing Pages – Features, Pricing, and Contact Routes

**Describe the bug**
Clicking on Features, Pricing, or Contact in the navbar redirects to the sign-in page instead of showing the actual content. Unauthenticated users should be able to view these public informational pages.

**Root Cause Analysis**
The pages exist in the codebase:
- `src/app/features/` — Features page
- `src/app/pricing/page.tsx` — Pricing page
- `src/app/contact/page.tsx` — Contact page

The issue is likely in `src/middleware.ts` which uses Clerk'\''s `clerkMiddleware()`. The middleware may be protecting these routes, requiring authentication. These public pages need to be excluded from auth protection.

**What Needs to Be Done**
1. Update `src/middleware.ts` to make `/features`, `/pricing`, `/about`, and `/contact` publicly accessible
2. Use Clerk'\''s `createRouteMatcher` to define public routes
3. Test that authenticated users can also access these pages normally
4. Verify all navigation links in `src/components/Navbar.tsx` point to correct routes

**Files to Modify**
- `src/middleware.ts` — Add public route exceptions
- Verify: `src/components/Navbar.tsx` — Check link paths

**Example Fix**
```typescript
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/features",
  "/pricing",
  "/about",
  "/contact",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/razorpay/webhook",
]);

export default clerkMiddleware((auth, req) => {
  if (!isPublicRoute(req)) {
    auth().protect();
  }
});
```

**Acceptance Criteria**
- [ ] Features, Pricing, About, and Contact pages load without sign-in
- [ ] Authenticated users can still access these pages
- [ ] No regression in protected route behavior (generate, flashcards, etc.)
- [ ] Navigation links work correctly from the navbar
'
echo "  ✅ #87 description updated"

gh issue edit 86 -R "$REPO" --body '## Feature Request: Add "Back to Top" Button

**Description**
Add a floating "Back to Top" button that appears after the user scrolls down a certain distance. When clicked, it smoothly scrolls the page back to the top.

**Current Status**
A `BacktoTop.tsx` component already exists at `src/components/BacktoTop.tsx`. This issue is about ensuring it is properly implemented, styled, and integrated across all pages.

**What Needs to Be Done**
1. Review `src/components/BacktoTop.tsx` and ensure it:
   - Shows only after scrolling down >300px
   - Uses smooth scroll animation
   - Has proper enter/exit transitions (Framer Motion)
2. Add the component to `src/app/layout.tsx` so it appears on all pages
3. Style it to match Flash Fathom AI branding:
   - Fixed position at bottom-right
   - Does not interfere with other floating elements
   - Matches the purple/gradient color theme
4. Ensure accessibility:
   - Keyboard focusable
   - `aria-label="Scroll to top"`
   - Visible focus ring

**Files to Modify**
- `src/components/BacktoTop.tsx` — Review/update implementation
- `src/app/layout.tsx` — Add component to global layout

**Tech Approach**
- Use `useState` + `useEffect` to track scroll position
- Use Framer Motion `AnimatePresence` for smooth show/hide
- Tailwind CSS for styling

**Acceptance Criteria**
- [ ] Button appears after scrolling down >300px
- [ ] Smooth scroll to top on click
- [ ] Proper animation on show/hide
- [ ] Matches app color theme (dark and light mode)
- [ ] Accessible (keyboard, aria-label)
- [ ] Responsive (works on mobile and desktop)
- [ ] Does not overlap with other UI elements
'
echo "  ✅ #86 description updated"

gh issue edit 81 -R "$REPO" --body '## Add Community Section to Homepage

**Is your feature request related to a problem?**
The homepage (`src/app/page.tsx`) currently has a hero section, feature cards, and FAQ, but lacks a community/social proof section. Adding one would build trust and encourage new users to join.

**What Needs to Be Done**
1. Create a new `Community.tsx` component in `src/components/`
2. Design should include:
   - Community stats (GitHub stars, contributors, users)
   - Testimonials or user quotes
   - Links to GitHub repo, Discord/community channels
   - Call-to-action to contribute
3. Add the component to `src/app/page.tsx` between the features and FAQ sections
4. Use Framer Motion for scroll-triggered animations (consistent with existing page)
5. Responsive layout for all screen sizes

**Design Reference**
The section should follow the existing page'\''s design language:
- Gradient text headings
- Card-based layout with subtle shadows
- Dark/light mode support
- Smooth scroll animations

**Files to Create/Modify**
- Create: `src/components/Community.tsx`
- `src/app/page.tsx` — Import and place the component

**Acceptance Criteria**
- [ ] Community section added to homepage
- [ ] Shows community stats (stars, contributors)
- [ ] Testimonials or social proof
- [ ] Links to GitHub and community channels
- [ ] Animated on scroll (Framer Motion)
- [ ] Dark/light mode support
- [ ] Responsive on all screen sizes
'
echo "  ✅ #81 description updated"

gh issue edit 103 -R "$REPO" --body '## Add Automated PR Comment on Pull Request Creation

**Description**
Set up a GitHub Actions workflow that automatically posts a welcome/checklist comment when a new pull request is created. This helps contributors know exactly what needs to be checked and ensures consistent PR quality.

**What Needs to Be Done**
1. Create a new workflow file: `.github/workflows/pr-welcome.yml`
2. The workflow should trigger on `pull_request` events (type: `opened`)
3. Post an automated comment with:
   - Welcome message thanking the contributor
   - PR checklist reminders (self-review, tests, screenshots for UI changes)
   - DSCWoC label reminders (`dscwoc` + difficulty label required)
   - Link to contribution guidelines

**Example Workflow**
```yaml
name: PR Welcome Comment
on:
  pull_request:
    types: [opened]
jobs:
  comment:
    runs-on: ubuntu-latest
    permissions:
      pull-requests: write
    steps:
      - uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: context.payload.pull_request.number,
              body: "Thank you for your contribution! Please ensure..."
            });
```

**Files to Create**
- `.github/workflows/pr-welcome.yml`

**Acceptance Criteria**
- [ ] Automated comment posted on every new PR
- [ ] Comment includes PR checklist and guidelines
- [ ] References DSCWoC label requirements
- [ ] Does not trigger on PR updates (only on open)
'
echo "  ✅ #103 description updated"

gh issue edit 102 -R "$REPO" --body '## Add Automated Issue Comment on Issue Creation

**Description**
Set up a GitHub Actions workflow that automatically posts a welcome comment when a new issue is created. This guides contributors on the next steps after filing an issue.

**What Needs to Be Done**
1. Create a new workflow file: `.github/workflows/issue-welcome.yml`
2. The workflow should trigger on `issues` events (type: `opened`)
3. Post an automated comment with:
   - Thank you message
   - Reminder to wait for issue assignment before starting work
   - How to self-assign: comment `.take`
   - Link to contribution guidelines and code of conduct
   - Note about DSCWoC program and scoring

**Example Workflow**
```yaml
name: Issue Welcome Comment
on:
  issues:
    types: [opened]
jobs:
  comment:
    runs-on: ubuntu-latest
    permissions:
      issues: write
    steps:
      - uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: context.payload.issue.number,
              body: "Thank you for opening this issue!..."
            });
```

**Note:** A `.take` workflow already exists at `.github/workflows/take-issue.yaml` for issue self-assignment. This new workflow complements it by providing guidance immediately when an issue is created.

**Files to Create**
- `.github/workflows/issue-welcome.yml`

**Acceptance Criteria**
- [ ] Automated comment posted on every new issue
- [ ] Comment includes next steps and guidelines
- [ ] References .take command for self-assignment
- [ ] Does not conflict with existing take-issue workflow
'
echo "  ✅ #102 description updated"

# ---------------------------------------------------------
# STEP 5: Create new improvement issues
# ---------------------------------------------------------
echo ""
echo ">>> Step 5: Creating new improvement issues..."

gh issue create -R "$REPO" \
  --title "Add Unit and Integration Tests for Core Features" \
  --label "dscwoc,level-3,testing,enhancement" \
  --body '## Add Unit and Integration Tests for Core Features

**Description**
The project currently has no automated test suite. Adding tests is critical for maintaining code quality, preventing regressions, and enabling confident refactoring as the project grows.

**What Needs to Be Done**

### 1. Setup Testing Infrastructure
- Install testing dependencies: `vitest`, `@vitejs/plugin-react`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`
- Configure `vitest.config.ts` for Next.js
- Add test scripts to `package.json`: `"test": "vitest"`, `"test:coverage": "vitest --coverage"`

### 2. Priority Test Areas

**API Routes (Integration Tests)**
- `src/app/api/generate/route.ts` — Test flashcard generation with mocked Gemini API
- `src/app/api/decks/route.ts` — Test CRUD operations
- `src/app/api/decks/save/route.ts` — Test saving flashcards to deck
- `src/app/api/study/start/route.ts` — Test study session creation

**Service Layer (Unit Tests)**
- `src/lib/services/flashcard.service.ts` — Test CRUD and spaced repetition logic
- `src/lib/services/subscription.service.ts` — Test plan limit checking
- `src/lib/services/payment.service.ts` — Test order creation and verification

**Components (Component Tests)**
- `src/components/study/StudyMode.tsx` — Test card flip, navigation, difficulty tracking
- `src/components/flashcards/FlashcardViewer.tsx` — Test card display and interaction
- `src/components/Navbar.tsx` — Test navigation links and responsive behavior

### 3. CI Integration
- Add test step to existing GitHub Actions workflows
- Ensure tests run on every PR

**Files to Create**
- `vitest.config.ts`
- `src/__tests__/` directory structure mirroring `src/`
- Test files: `*.test.ts` or `*.test.tsx`

**Acceptance Criteria**
- [ ] Testing framework (Vitest) configured and working
- [ ] At least 3 API route tests
- [ ] At least 3 service layer unit tests
- [ ] At least 2 component tests
- [ ] Tests pass in CI pipeline
- [ ] Test coverage report available
'
echo "  ✅ Created: Add Unit and Integration Tests"

gh issue create -R "$REPO" \
  --title "Improve API Error Handling and Add Rate Limiting" \
  --label "dscwoc,level-2,enhancement,refactor" \
  --body '## Improve API Error Handling and Add Rate Limiting

**Description**
The API routes need consistent error handling patterns and rate limiting to prevent abuse. Currently, error handling varies across routes and there is no request rate limiting beyond subscription plan quotas.

**What Needs to Be Done**

### 1. Standardize API Error Responses
- Create a shared error handler utility at `src/lib/utils/api-error.ts`
- Define standard error response format: `{ error: string, code: string, status: number }`
- Apply consistent error handling across all API routes in `src/app/api/`

### 2. Add Rate Limiting
- Implement rate limiting middleware using in-memory store or Redis
- Apply to critical endpoints:
  - `/api/generate` — AI generation (most expensive)
  - `/api/contact` — Contact form (spam prevention)
  - `/api/razorpay/create-order` — Payment creation
- Rate limits by IP and/or authenticated user
- Return `429 Too Many Requests` with `Retry-After` header

### 3. Input Validation
- Add Zod schema validation to all API routes
- Validate request body, query params, and path params
- Return clear validation error messages

**Files to Create/Modify**
- Create: `src/lib/utils/api-error.ts` — Shared error utilities
- Create: `src/lib/middleware/rate-limit.ts` — Rate limiting middleware
- Modify: All files in `src/app/api/` — Apply consistent patterns

**Acceptance Criteria**
- [ ] Consistent error response format across all APIs
- [ ] Rate limiting on generation, contact, and payment endpoints
- [ ] Zod validation on all API inputs
- [ ] Proper HTTP status codes (400, 401, 403, 404, 429, 500)
- [ ] No sensitive information leaked in error responses
'
echo "  ✅ Created: Improve API Error Handling"

gh issue create -R "$REPO" \
  --title "Improve Accessibility (a11y) Across the Application" \
  --label "dscwoc,level-2,enhancement,ui/ux,good first issue" \
  --body '## Improve Accessibility (a11y) Across the Application

**Description**
The application needs accessibility improvements to ensure all users, including those using screen readers or keyboard navigation, can use the app effectively.

**What Needs to Be Done**

### 1. Keyboard Navigation
- Ensure all interactive elements are keyboard-focusable
- Add visible focus indicators (focus rings) on buttons, links, and form fields
- Flashcard flip should work with Enter/Space keys
- Study mode navigation should support arrow keys

### 2. Screen Reader Support
- Add `aria-label` attributes to icon-only buttons (theme toggle, mobile menu, etc.)
- Add `aria-live` regions for dynamic content (flash messages, loading states)
- Ensure flashcard content is announced on flip
- Add proper heading hierarchy (h1 → h2 → h3) on all pages

### 3. Color Contrast
- Verify WCAG AA contrast ratios for all text colors in both light and dark mode
- Check gradient text readability
- Ensure error/success states have sufficient contrast

### 4. Form Accessibility
- Associate all labels with inputs using `htmlFor`
- Add error messages connected via `aria-describedby`
- Indicate required fields with `aria-required`

**Key Files to Review**
- `src/components/Navbar.tsx` — Navigation accessibility
- `src/components/study/StudyMode.tsx` — Study interaction accessibility
- `src/components/flashcards/FlashcardViewer.tsx` — Card interaction accessibility
- `src/components/Contact.tsx` — Form accessibility
- `src/app/page.tsx` — Homepage heading hierarchy

**Acceptance Criteria**
- [ ] All pages navigable via keyboard only
- [ ] Visible focus indicators on interactive elements
- [ ] Proper aria-labels on icon buttons
- [ ] Form fields properly labeled
- [ ] Heading hierarchy correct on all pages
- [ ] Color contrast meets WCAG AA standards
'
echo "  ✅ Created: Accessibility Improvements"

gh issue create -R "$REPO" \
  --title "Optimize Application Performance and Loading Speed" \
  --label "dscwoc,level-2,enhancement,refactor" \
  --body '## Optimize Application Performance and Loading Speed

**Description**
Optimize the application for faster loading times, better Lighthouse scores, and smoother user experience. This includes image optimization, code splitting, and reducing bundle size.

**What Needs to Be Done**

### 1. Image Optimization
- Use Next.js `<Image>` component with proper `width`, `height`, and `priority` props
- Convert images to WebP format where possible
- Add `placeholder="blur"` for above-the-fold images
- Lazy load below-the-fold images

### 2. Code Splitting and Lazy Loading
- Review `src/lib/utils/lazy-imports.ts` and ensure heavy components are lazy loaded
- Use `next/dynamic` for components not needed on initial render (e.g., StudyMode, FlashcardGenerator)
- Ensure Framer Motion animations are not blocking first paint

### 3. Bundle Size Reduction
- Audit dependencies with `pnpm why` and remove unused packages
- Check for tree-shaking issues with large libraries
- Use barrel imports carefully to avoid importing entire libraries

### 4. Caching and Data Fetching
- Add proper cache headers to API routes
- Use React Server Components where possible (default in App Router)
- Implement `stale-while-revalidate` patterns for deck/flashcard data

**Tools**
- Run `pnpm build` and check bundle analysis
- Use Lighthouse for performance auditing
- Check Web Vitals (LCP, FID, CLS)

**Acceptance Criteria**
- [ ] Lighthouse Performance score > 90
- [ ] All images use Next.js Image component with proper optimization
- [ ] Heavy components are lazy loaded
- [ ] No unused dependencies in bundle
- [ ] API routes have appropriate cache headers
'
echo "  ✅ Created: Performance Optimization"

gh issue create -R "$REPO" \
  --title "Enhance Spaced Repetition Algorithm with SM-2 Implementation" \
  --label "dscwoc,level-3,feature,enhancement" \
  --body '## Enhance Spaced Repetition Algorithm with SM-2 Implementation

**Description**
The current spaced repetition system in `src/components/study/StudyMode.tsx` uses a basic implementation that updates `nextReview` dates based on difficulty ratings. This should be enhanced with a proper SM-2 algorithm for more effective learning scheduling.

**Current Implementation**
In `StudyMode.tsx`, the difficulty tracking updates the flashcard'\''s `nextReview` field, but:
- The interval calculation is basic (not following SM-2 formula)
- `repetitions` count is not properly utilized
- No ease factor tracking
- Failed cards are not rescheduled optimally

**What Needs to Be Done**

### 1. Implement SM-2 Algorithm
Create a utility at `src/lib/utils/spaced-repetition.ts`:
- Calculate intervals based on: quality (0-5), repetitions, ease factor
- Formula: `interval = previousInterval * easeFactor`
- Ease factor adjustment based on response quality
- Reset to interval 1 on failure

### 2. Update Database Schema
Add to Prisma `Flashcard` model:
- `easeFactor` (Float, default 2.5)
- `interval` (Int, default 0)
- Update `repetitions` usage

### 3. Update Study Mode
- Apply SM-2 calculations when user rates difficulty
- Show next review date to user
- Add "Due for Review" filter to deck view
- Display mastery level per card (based on ease factor)

### 4. Study Analytics
- Track study streaks
- Show retention rate over time
- Daily review count vs. due cards
- Export study statistics

**Files to Create/Modify**
- Create: `src/lib/utils/spaced-repetition.ts` — SM-2 algorithm
- Modify: `prisma/schema.prisma` — Add easeFactor, interval fields
- Modify: `src/components/study/StudyMode.tsx` — Apply SM-2
- Modify: `src/app/api/study/record/route.ts` — Store SM-2 data

**Acceptance Criteria**
- [ ] SM-2 algorithm implemented and tested
- [ ] Database schema updated with new fields
- [ ] Study mode uses SM-2 for scheduling
- [ ] Next review date shown to user
- [ ] Due cards highlighted in deck view
- [ ] Study analytics/stats page
'
echo "  ✅ Created: Spaced Repetition Enhancement"

# ---------------------------------------------------------
# STEP 6: Delete old labels
# ---------------------------------------------------------
echo ""
echo ">>> Step 6: Cleaning up old labels..."

gh label delete "hacktoberfest" --yes -R "$REPO" 2>/dev/null && echo "  Deleted: hacktoberfest" || echo "  hacktoberfest already removed"
gh label delete "gssoc2025" --yes -R "$REPO" 2>/dev/null && echo "  Deleted: gssoc2025" || echo "  gssoc2025 already removed"
gh label delete "Level 1" --yes -R "$REPO" 2>/dev/null && echo "  Deleted: Level 1" || echo "  Level 1 already removed"
gh label delete "Level 2" --yes -R "$REPO" 2>/dev/null && echo "  Deleted: Level 2" || echo "  Level 2 already removed"
gh label delete "Level 3" --yes -R "$REPO" 2>/dev/null && echo "  Deleted: Level 3" || echo "  Level 3 already removed"

echo ""
echo "============================================="
echo " Migration Complete!"
echo "============================================="
echo ""
echo "Summary:"
echo "  - Created DSCWoC labels (dscwoc, level-1/2/3, task labels)"
echo "  - Removed hacktoberfest & gssoc2025 from all issues"
echo "  - Updated labels on 14 existing issues"
echo "  - Updated descriptions for 14 issues with project context"
echo "  - Created 5 new improvement issues"
echo "  - Deleted old labels (hacktoberfest, gssoc2025, Level 1/2/3)"
echo ""
