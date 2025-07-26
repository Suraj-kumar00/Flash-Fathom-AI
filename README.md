![flashfathom-ai](./public//Flash-Fathom-AI-Banner.png)

<div align="center">
  
</br>
    <img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/Suraj-kumar00/Flash-Fathom-AI?logo=github"> </img>
    <img alt="GitHub Repo forks" src="https://img.shields.io/github/forks/Suraj-kumar00/Flash-Fathom-AI?logo=github"> </img>
    <img alt="GitHub License" src="https://img.shields.io/github/license/Suraj-kumar00/Flash-Fathom-AI"></img>
    <img alt="GitHub Repo issues" src="https://img.shields.io/github/issues/Suraj-kumar00/Flash-Fathom-AI?logo=issues"> </img>
    <img alt="GitHub pull requests" src="https://img.shields.io/github/issues-pr/Suraj-kumar00/Flash-Fathom-AI?logo=github"></img>
    <img alt="Flash-Fathom-AI Release" src="https://img.shields.io/github/v/release/Suraj-kumar00/Flash-Fathom-AI?sort=semver"></img
                                                                                                       
[![Build and Push flashfathom-ai Docker Image to DockerHub](https://github.com/Suraj-kumar00/Flash-Fathom-AI/actions/workflows/build-push-docker.yml/badge.svg?branch=main)](https://github.com/Suraj-kumar00/Flash-Fathom-AI/actions/workflows/build-push-docker.yml)
</div>

## About Flash Fathom AI

**Flash Fathom AI** is an intelligent flashcard learning platform that revolutionizes how you study and retain information. Powered by advanced AI technology, it combines personalized content generation, spaced repetition algorithms, and intuitive study modes to maximize your learning efficiency.

### Why Choose Flash Fathom AI?

- **AI-Powered Content Generation**: Instantly create flashcards using Gemini API
- **Advanced Spaced Repetition**: Scientific learning algorithms that adapt to you
- **Mobile-First Design**: Study anywhere with responsive UI and gestures
- **Real-Time Search**: Instantly find cards and decks
- **Flexible Subscriptions**: Plans for every learner's needs

[Get Started](https://flash-fathom-ai.vercel.app/) • [🤝 Contribute](#quick-start)

## Demo

<div align="center">
  <img src="" alt="Tutorial to generate flash cards" width="1000" ></img>
</div>

## 🛠️ Tech Stack

### Frontend
- **Next.js 15**
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui**

### Backend & Database
- **Next.js API Routes**
- **PostgreSQL** (via **Supabase**)
- **Prisma ORM**

### Authentication & Payments
- **Clerk v6**
- **Razorpay**

### AI & APIs
- **OpenAI API**
- **Gemini API**

### DevOps & Deployment
- **Docker**
- **Vercel**
- **GitHub Actions**

## Project WorkFlow

![](./public/FlashFathomAI-Architecture.png)


## ✨ Features

###  Core Features

- Secure authentication (Clerk)
- AI-based flashcard generation using Gemini API
- Study modes with spaced repetition
- Real-time global search

### Study Experience

- Touch gesture support
- Difficulty tracking
- Analytics and progress tracking
- Fully responsive & mobile-friendly
- Offline study mode

### Subscription Management

- Free, Basic (₹59/₹590), Pro (₹99/₹990), Org (₹159/₹1,590)
- Monthly/Yearly with 2-month discount
- Razorpay-secured payments
- Learning stats & usage analytics

### Advanced Features

- Real-time search with filters
- Export to PDF or Anki
- Team/Org collaboration
- In-depth performance analytics


##  Quick Start

### Prerequisites

- Node.js 18+
- `pnpm`
- PostgreSQL (or Supabase)
- Clerk account
- Razorpay account
- OpenAI API key

### 1. Clone & Setup

```bash
git clone https://github.com/your-username/Flash-Fathom-AI
cd Flash-Fathom-AI
npm install -g pnpm
pnpm install
```

### 2. Add Environment Variables

Create `.env.local` with the .env.example file we have

### 3. Setup Database

```bash
pnpm prisma generate
pnpm prisma db push
```

### 4. Start Development

```bash
pnpm run dev
# Visit: http://localhost:3000
```

---

## 🐳 Docker Deployment

### Quick Run

```bash
docker pull surajkumar00/flashfathom-ai
docker run -it -p 3000:3000 surajkumar00/flashfathom-ai
```

### Custom Build

```bash
docker build -t flashfathom-ai .
docker run -it -p 3000:3000 --env-file .env.local flashfathom-ai
```
---

## API Documentation

### Auth

- `GET /api/auth/user` – Get current user
- `POST /api/auth/webhook` – Handle Clerk webhook

### Payments

- `POST /api/razorpay/create-order`
- `POST /api/razorpay/verify-payment`

### Study

- `POST /api/study/start`
- `POST /api/study/record`
- `POST /api/study/complete`

### Content

- `GET/POST /api/decks`
- `GET/POST/PUT/DELETE /api/flashcards`
- `GET /api/search`

---

## Issue Reporting

Please include:
- 🔍 **Issue Title**
- 📝 **Description**
- 🚶 **Steps to Reproduce**
- ✅ **Expected vs ❌ Actual Behavior**
- 🖥️ **Environment Info**

[Open an issue](https://github.com/Suraj-kumar00/Flash-Fathom-AI/issues)

---

## 🤝 Contributing

We welcome PRs! [**Read the Contribution Guidlines**](https://github.com/Suraj-kumar00/Flash-Fathom-AI/blob/main/CONTRIBUTING.md)

### Steps:

```bash
# Fork & clone
git checkout -b feature/your-feature
# Make changes
git commit -m "feat: add your feature"
git push origin feature/your-feature
# Open a Pull Request
```

### Standards

- TypeScript
- ESLint + Prettier 
- Before raising PR locally build should pass all checks
- Conventional commits
- Add test coverage

## Contributors

<table>
<tr>
    <td align="center" style="word-wrap: break-word; width: 150.0; height: 150.0">
        <a href=https://github.com/Suraj-kumar00>
            <img src=https://avatars.githubusercontent.com/u/123288511?v=4 width="100;"  alt=Suraj/>
            <br />
            <sub style="font-size:14px"><b>Suraj</b></sub>
        </a>
    </td>
    <td align="center" style="word-wrap: break-word; width: 150.0; height: 150.0">
        <a href=https://github.com/Shivansh-22866>
            <img src=https://avatars.githubusercontent.com/u/131197200?v=4 width="100;"  alt=Shivansh/>
            <br />
            <sub style="font-size:14px"><b>Shivansh</b></sub>
        </a>
    </td>
    <td align="center" style="word-wrap: break-word; width: 150.0; height: 150.0">
        <a href=https://github.com/milansamuel609>
            <img src=https://avatars.githubusercontent.com/u/75712741?v=4 width="100;"  alt=Milan P Samuel/>
            <br />
            <sub style="font-size:14px"><b>Milan P Samuel</b></sub>
        </a>
    </td>
    <td align="center" style="word-wrap: break-word; width: 150.0; height: 150.0">
        <a href=https://github.com/zaheer-Khan3260>
            <img src=https://avatars.githubusercontent.com/u/150288870?v=4 width="100;"  alt=Zaheer khan/>
            <br />
            <sub style="font-size:14px"><b>Zaheer khan</b></sub>
        </a>
    </td>
    <td align="center" style="word-wrap: break-word; width: 150.0; height: 150.0">
        <a href=https://github.com/AnushkaChouhan25>
            <img src=https://avatars.githubusercontent.com/u/157525924?v=4 width="100;"  alt=Anushka Chouhan/>
            <br />
            <sub style="font-size:14px"><b>Anushka Chouhan</b></sub>
        </a>
    </td>
    <td align="center" style="word-wrap: break-word; width: 150.0; height: 150.0">
        <a href=https://github.com/haseebzaki-07>
            <img src=https://avatars.githubusercontent.com/u/147314463?v=4 width="100;"  alt=Haseeb Zaki/>
            <br />
            <sub style="font-size:14px"><b>Haseeb Zaki</b></sub>
        </a>
    </td>
</tr>
<tr>
    <td align="center" style="word-wrap: break-word; width: 150.0; height: 150.0">
        <a href=https://github.com/Sachin2815>
            <img src=https://avatars.githubusercontent.com/u/100368589?v=4 width="100;"  alt=Sachin Singh/>
            <br />
            <sub style="font-size:14px"><b>Sachin Singh</b></sub>
        </a>
    </td>
    <td align="center" style="word-wrap: break-word; width: 150.0; height: 150.0">
        <a href=https://github.com/alok-mishra143>
            <img src=https://avatars.githubusercontent.com/u/100504874?v=4 width="100;"  alt=ALOK MISHRA/>
            <br />
            <sub style="font-size:14px"><b>ALOK MISHRA</b></sub>
        </a>
    </td>
    <td align="center" style="word-wrap: break-word; width: 150.0; height: 150.0">
        <a href=https://github.com/subhamagarrwal>
            <img src=https://avatars.githubusercontent.com/u/130570909?v=4 width="100;"  alt=subhamagarrwal/>
            <br />
            <sub style="font-size:14px"><b>subhamagarrwal</b></sub>
        </a>
    </td>
    <td align="center" style="word-wrap: break-word; width: 150.0; height: 150.0">
        <a href=https://github.com/T-Rahul-prabhu-38>
            <img src=https://avatars.githubusercontent.com/u/167653990?v=4 width="100;"  alt=t rahul prabhu/>
            <br />
            <sub style="font-size:14px"><b>t rahul prabhu</b></sub>
        </a>
    </td>
</tr>
</table>
<br/>

## License

This project is licensed under the [MIT License!](https://github.com/Suraj-kumar00/Flash-Fathom-AI/blob/main/LICENSE)

## Support via giving a ⭐ star

If you like this project, please give it a ⭐ star. Your support means a lot to us!
