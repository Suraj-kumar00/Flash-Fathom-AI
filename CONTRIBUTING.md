# Contributing Guidelines – Flash Fathom AI

This documentation contains a set of guidelines to help you during the contribution process for **Flash Fathom AI** — an intelligent flashcard learning platform with AI-powered content generation and spaced repetition study modes.

We welcome all contributions from anyone willing to improve this project!

---

## Code of Conduct

Please read and follow our [Code of Conduct](https://github.com/Suraj-kumar00/Flash-Fathom-AI/blob/main/CODE_OF_CONDUCT.md).

---

## New to Git & GitHub?

Here are some helpful resources:

- [Forking a Repository](https://help.github.com/en/github/getting-started-with-github/fork-a-repo)
- [Cloning a Repository](https://help.github.com/en/desktop/contributing-to-projects/creating-an-issue-or-pull-request)
- [How to Create a Pull Request](https://opensource.com/article/19/7/create-pull-request-github)
- [Getting Started with Git and GitHub](https://blog.devsuraj.me/getting-to-know-git-and-github-your-codes-best-friends)
- [Learn GitHub from Scratch](https://docs.github.com/en/get-started/start-your-journey/git-and-github-learning-resources)

---

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui
- **Authentication**: Clerk v6
- **Database**: PostgreSQL + Prisma ORM
- **Payments**: Razorpay
- **AI**: Gemini API
- **Deployment**: Vercel

---

## Project Structure

```plaintext
FLASH-FATHOM-AI/
├── .github/                  # GitHub workflows and templates
├── public/                   # Static assets and images
├── prisma/                   # Prisma DB schema and migrations
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── api/              # API routes
│   │   ├── flashcards/       # Flashcard pages
│   │   ├── pricing/          # Pricing pages
│   │   └── result/           # Payment result page
│   ├── components/           # UI components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── flashcards/       # Flashcard UI
│   │   ├── study/            # Study UI
│   │   └── search/           # Search UI
│   ├── lib/                  # Business logic, hooks
│   └── utils/                # Utility functions
├── .env.example              # Env variables sample
├── Dockerfile                # Docker build file
├── docker-compose.yml        # Docker Compose setup
├── README.md                 # Main documentation
```

---

## 🚀 Local Development Setup

### Prerequisites

- Node.js 18+
- `pnpm`
- PostgreSQL (or Supabase)

### ⚙️ Setup

1. **Fork & Clone**

```bash
git clone https://github.com/your-username/Flash-Fathom-AI.git
cd Flash-Fathom-AI
```

2. **Install pnpm (if not installed)**

```bash
npm install -g pnpm
```

3. **Install Dependencies**

```bash
pnpm install
```

4. **Configure Environment**

```bash
cp .env.example .env.local
```

Update `.env.local` the .env.example file we have

5. **Database Setup**

```bash
pnpm prisma db push
pnpm prisma generate
```

6. **Run the Dev Server**

```bash
pnpm run dev
```

Open: [http://localhost:3000](http://localhost:3000)

---

## 🐳 Docker Setup

### Option 1: DockerHub

```bash
docker pull surajkumar00/flashfathom-ai
docker run -p 3000:3000 surajkumar00/flashfathom-ai
```

### Option 2: Local Build

```bash
docker-compose up --build
```

---

## 🤝 How to Contribute

### Steps:

1. ⭐ Star the repo
2. 🍴 Fork it
3. Clone your fork:

```bash
git clone https://github.com/your-username/Flash-Fathom-AI.git
cd Flash-Fathom-AI
```

4. Create a new branch:

```bash
git checkout -b feature/your-feature
```

5. Make your changes
6. Commit and push:

```bash
git add .
git commit -m "feat: your meaningful commit"
git push origin feature/your-feature
```

7. Open a Pull Request

---

## Issue Assignment Process

To self-assign, comment:

```
.take
```

1. Browse [open issues](https://github.com/Suraj-kumar00/Flash-Fathom-AI/issues)
2. Comment `.take`
3. Wait for assignment confirmation

---

## Coding Standards

### TypeScript & Component Guidelines

- Avoid `any` type
- Use React functional components and hooks
- Use naming conventions: `camelCase`, `PascalCase`
- Write meaningful comments for non-trivial logic

### Database

- Use Prisma ORM only
- Handle DB errors properly
- Follow service structure patterns

### Code Style

- **Lint**: ESLint
- **Format**: Prettier
- **Commits**: Conventional Commits (e.g., `feat:`, `fix:`)

---

## Pull Request Guidelines

### Before you submit:

- [ ] Self-reviewed
- [ ] Tests added
- [ ] Docs updated
- [ ] No breaking changes (or documented)
- [ ] Screenshots for UI changes

Use the PR template provided in the repo.

---

## DSCWoC Scoring & Labels

This project participates in **DSC Winter of Code (DSCWoC)**. All contributions are scored based on the following system.

### PR Eligibility for Scoring

For a PR to score points it must:
- ✅ Have the `dscwoc` label
- ✅ Have exactly one difficulty label: `level-1`, `level-2`, or `level-3`
- ✅ Be reviewed and merged by a mentor or project admin

> Points are awarded only after the PR is merged. If a PR is missing required labels, it receives **0 points**.

### Difficulty Levels & Points

| Difficulty | Description | Points |
|------------|-------------|--------|
| `level-1` | Beginner-friendly tasks | 10 |
| `level-2` | Moderate complexity | 20 |
| `level-3` | Advanced or complex work | 30 |

### Task-Based Labels (Required)

Every issue must include at least one task-based label:

| Label | When to Use |
|-------|-------------|
| `bug` | Incorrect behavior, crashes, or logical errors |
| `feature` | New functionality being added |
| `ui/ux` | Interface or user experience improvements |
| `enhancement` | Improving or extending existing functionality |
| `documentation` | README updates, guides, or written explanations |
| `refactor` | Code restructuring without behavior change |
| `testing` | Adding or improving automated tests |

### Bonus Points

- Consistent weekly contributions: **+10**
- Exceptional contribution (mentor-approved): **+10**
- Helping others (verified): **+5**

---

## Reporting Issues

To report a bug:

1. Go to [Issues tab](https://github.com/Suraj-kumar00/Flash-Fathom-AI/issues)
2. Click "New Issue"
3. Choose a template
4. Add:
   - Steps to reproduce
   - Expected vs actual result
   - Screenshots
   - OS/browser info

---

## 💬 Getting Help

- **Maintainer**: Suraj
- **Email**: [suraj.kumar.p@gmail.com](mailto:suraj.kumar.p@gmail.com)
- **GitHub**: [@Suraj-kumar00](https://github.com/Suraj-kumar00)

### Extra Resources

- [Open Source Guide](https://blog.devsuraj.me/what-is-open-source-beginners-guide-how-to-get-started)
- [GitHub for Beginners](https://blog.devsuraj.me/getting-to-know-git-and-github-your-codes-best-friends)

---

## 🙏 Thank You!

Your contributions make Flash Fathom AI better.  
Whether it's a bug fix, feature, or doc update — you're appreciated.

**Happy Coding! 💙**