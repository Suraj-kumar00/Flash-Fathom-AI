![flashfathom-ai](./public//Flash-Fathom-AI-Banner.png)

<div align="center">
  
</br>
    <img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/Suraj-kumar00/Flash-Fathom-AI?logo=github"> </img>
    <img alt="GitHub Repo forks" src="https://img.shields.io/github/forks/Suraj-kumar00/Flash-Fathom-AI?logo=github"> </img>
    <img alt="GitHub License" src="https://img.shields.io/github/license/Suraj-kumar00/Flash-Fathom-AI"></img>
    <img alt="GitHub Repo issues" src="https://img.shields.io/github/issues/Suraj-kumar00/Flash-Fathom-AI?logo=issues"> </img>
    <img alt="GitHub pull requests" src="https://img.shields.io/github/issues-pr/Suraj-kumar00/Flash-Fathom-AI?logo=github"></img>
    <img alt="Flash-Fathom-AI Release" src="https://img.shields.io/github/v/release/Suraj-kumar00/Flash-Fathom-AI?sort=semver"></img
                                                                                                       
[![Build and Push Docker Image to DockerHub](https://github.com/Suraj-kumar00/Flash-Fathom-AI/actions/workflows/publish-to-dockerhub.yml/badge.svg?branch=main)](https://github.com/Suraj-kumar00/Flash-Fathom-AI/actions/workflows/publish-to-dockerhub.yml)
                                                                                                      
[![CI Pipeline of GCR](https://github.com/Suraj-kumar00/Flash-Fathom-AI/actions/workflows/pulish-to-gcr.yml/badge.svg)](https://github.com/Suraj-kumar00/Flash-Fathom-AI/actions/workflows/pulish-to-gcr.yml)

<br>
</div>
<br>

Introducing **FlashFathom AI** – the ultimate flashcard generator. Effortlessly create and study personalized flashcards with AI precision, while enjoying seamless user experiences and secure payments.
[**Get started today**](https://flash-fathom-ai.vercel.app/), track your learning progress, and join a growing community of satisfied users. Would you be ready to elevate your study game? Sign up now and unlock your learning potential!

## Demo

<div align="center">
  <img src="./public/Flash-Fathom-AI-Signin-And-Card.gif" alt="Tutorial to demonstrate signin and generating flash cards" width="1000" ></img>
</div>

## Build with

- Next.js
- Clerk
- Firebase
- OpenAI
- Stripe.

## DevOps Practices

- Containerization(Docker)
- Automation(CI/CD) using GitHub Actions

## Project WorkFlow

![](./public/Flash-Fathom-AI-WorkFlow.png)

## Features

- **Clerk Authentication**: Secure, seamless user access.
- **SaaS UI & Landing Page**: Polished, user-friendly design.
- **AI Flashcards**: Instantly generate flashcards with OpenAI.
- **Firebase CRUD**: Easy data management.
- **Stripe Subscriptions**: Simple yearly and monthly payments.

## Installation

For Installation on local machine follow bellow steps:
First [fork the reqpository](https://github.com/Suraj-kumar00/Flash-Fathom-AI/fork)

```sh
git clone https://github.com/your-username/Flash-Fathom-AI/
cd Flash-Fathom-AI
```

## Install the dependencies

**The package manager**

```sh
npm install -g pnpm
```

**Install pnpm pakcage manager**

```sh
pnpm install
```

If required for you:
**Installing clerk**

```bash
pnpm add @clerk/clerk-sdk @clerk/nextjs
```

**OpenAI**

```bash
pnpm add openai
```

**Firebase**

```bash
pnpm add firebase
```

**Stripe**

```bash
pnpm add @stripe/stripe-js
```

**Shadcn UI**

```bash
pnpm add @shadcn/ui
```

## Running the project using Docker

First Install [**Docker Desktop**](https://www.docker.com/products/docker-desktop/)

**Pull the image**

```bash
docker pull surajkumar00/flashfathom-ai
```

**Run the Container**

```bash
docker run -it -p 3000:3000 surajkumar00/flashfathom-ai
```

**Check localhost**
[localhost:3000](localhost:3000)

## Issue Reporting 🐛✨

If you encounter any bugs or have feature requests, please follow this format when opening an issue:

- Issue Title: 📝 A concise and descriptive title.
- Description: 🔍 Clear and detailed description of the issue or feature request.
- Steps to Reproduce (if applicable): 🚶Detailed steps to reproduce the issue.
- Expected Behavior: ✅What you expected to happen.
- Actual Behavior: ❌What actually happened.

## Development 👨‍💻

Want to contribute? Great!
We welcome contributions from the community! Please check our Contributing Guidelines for more details on how you can help improve us.
[**Read the Contribution Guidlines**](https://github.com/Suraj-kumar00/Flash-Fathom-AI/blob/main/CONTRIBUTING.md)

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
        <a href=https://github.com/AnushkaChouhan25>
            <img src=https://avatars.githubusercontent.com/u/157525924?v=4 width="100;"  alt=Anushka Chouhan/>
            <br />
            <sub style="font-size:14px"><b>Anushka Chouhan</b></sub>
        </a>
    </td>
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
</tr>
<tr>
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
<br/>

## 📬 Contact

For questions or feedback, feel free to reach out via GitHub issues or contact the project maintainers. ✉️

## License

This project is licensed under the [MIT License!](https://github.com/Suraj-kumar00/Flash-Fathom-AI/blob/main/LICENSE)

## Support via giving a ⭐ star

If you like this project, please give it a ⭐ star. Your support means a lot to us!

<h2 align="center"> Happy Coding🚀✨</h2>
