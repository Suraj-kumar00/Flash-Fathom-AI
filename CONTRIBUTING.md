# Contributing Guidelines 🌍

This documentation contains a set of guidelines to help you during the contribution process.  
We are happy to welcome all the contributions from anyone willing to improve/add new projects (doesn't matter which language) to this Repository.

<br>

# Code of Conduct

Please read and follow our [Code of Conduct.](https://github.com/Suraj-kumar00/Flash-Fathom-AI/blob/main/CODE_OF_CONDUCT.md)

<br>

# Need Help with the Basics? 🤔

If you're new to Git and GitHub, no worries! Here are some useful resources:

- [Forking a Repository](https://help.github.com/en/github/getting-started-with-github/fork-a-repo)
- [Cloning a Repository](https://help.github.com/en/desktop/contributing-to-projects/creating-an-issue-or-pull-request)
- [How to Create a Pull Request](https://opensource.com/article/19/7/create-pull-request-github)
- [Getting Started with Git and GitHub](https://towardsdatascience.com/getting-started-with-git-and-github-6fcd0f2d4ac6)
- [Learn GitHub from Scratch](https://docs.github.com/en/get-started/start-your-journey/git-and-github-learning-resources)

<br>

# Project Structure 📂

```bash
FLASH-FATHOM-AI/
├── .github/                  # GitHub-related configurations such as workflows, issue templates, etc
│
├── public/                   # Contains some images for the public purpose
│
├── src/                      # Contains all the source components of the project
│
├── .env.example
│
├── .eslintrc.json
│
├── .gitignore
│
├── CODE_OF_CONDUCT.md         # Some rules for the contributors
│
├── CONTRIBUTING.md            # Instructions about how to contribute
│
├── Dockerfile
│
├── LICENSE                    # Basically a permission to do something
│
├── README.md                  # Some basic instructions to follow
├──
├── components.json
├──
├── docker-compose.yml
├──
├── next.config.mjs
├──
├── package.json
├──
├── pnpm-lock.yaml
├──
├── postcss.config.mjs
├──
├── tailwind.config.ts
├──
├── tsconfig.json
```

<br>

# Before contributing to the repository, here are a few steps you can follow to understand the project

## Installation

For Installation on local machine follow bellow steps:
First [fork the reqpository](https://github.com/Suraj-kumar00/Flash-Fathom-AI/fork)

```bash
git clone https://github.com/your-username/Flash-Fathom-AI/
```

```bash
cd Flash-Fathom-AI
```

## Install the dependencies

**The package manager**

```bash
npm install -g pnpm
```

**Install pnpm pakcage manager**

```bash
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

**Stripe**

```bash
pnpm add @stripe/stripe-js
```

**Shadcn UI**

```bash
pnpm add @shadcn/ui
```

<br>

# Running the project using Docker

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

<br>

# Contributing 🫱🏼‍🫲🏻

We welcome contributions to enhance the AI Customer Support system! To contribute:

**Note:** To assign the issue to yourself type `.take` in the commant on the issue.

1. **Star this repository**
   Click on the top right corner marked as **Stars** at last.

2. **Fork this repository**
   Click on the top right corner marked as **Fork** at second last.

3. **Clone the forked repository**

```bash
git clone https://github.com/<your-github-username>/Flash-Fathom-AI.git
```

4. **Navigate to the project directory**

```bash
cd Flash-Fathom-AI
```

5. **Create a new branch**

```bash
git checkout -b <your_branch_name>
```

6. **To make changes**

```bash
git add .
```

7. **Now to commit**

```bash
git commit -m "add comment according to your changes or addition of features inside this"
```

8. **Push your local commits to the remote repository**

```bash
git push -u origin <your_branch_name>
```

9. **Create a Pull Request**

10. **Congratulations! 🎉 you've made your contribution**

<br>

# For Help And Support 💬

- Admin :- Suraj
- Contact :- [Email](suraj.ukumar.p@gmail.com)

<br>

# For Open-Source And Git & Github Learning 🎯

**Open-Source Blog** :- [Opensource](https://blog.devsuraj.me/what-is-open-source-beginners-guide-how-to-get-started)

**Git And Github** :- [Git and Github](https://blog.devsuraj.me/getting-to-know-git-and-github-your-codes-best-friends)

<br>

# Good Coding Practices 🧑‍💻

1. **Follow the Project's Code Style**

   - Maintain consistency with the existing code style (indentation, spacing, comments).
   - Use meaningful and descriptive names for variables, functions, and classes.
   - Keep functions short and focused on a single task.
   - Avoid hardcoding values; instead, use constants or configuration files when possible.

2. **Write Clear and Concise Comments**

   - Use comments to explain why you did something, not just what you did.
   - Avoid unnecessary comments that state the obvious.
   - Document complex logic and functions with brief explanations to help others understand your thought -process.

3. **Keep Code DRY (Don't Repeat Yourself)**

   - Avoid duplicating code. Reuse functions, methods, and components whenever possible.
   - If you find yourself copying and pasting code, consider creating a new function or component.

4. **Write Tests**

   - Write unit tests for your functions and components.
   - Ensure your tests cover both expected outcomes and edge cases.
   - Run tests locally before making a pull request to make sure your changes don’t introduce new bugs.

5. **Code Reviews and Feedback**

   - Be open to receiving constructive feedback from other contributors.
   - Conduct code reviews for others and provide meaningful suggestions to improve the code.
   - Always refactor your code based on feedback to meet the project's standards.

<br>

# Pull Request Process 🚀

When submitting a pull request, please adhere to the following:

1. **Self-review your code** before submission. 😀
2. Include a detailed description of the functionality you’ve added or modified.
3. Comment your code, especially in complex sections, to aid understanding.
4. Add relevant screenshots to assist in the review process.
5. Submit your PR using the provided template and hang tight; we'll review it as soon as possible! 🚀

<br>

# Issue Report Process 📌

To report an issue, follow these steps:

1. Navigate to the project's issues section :- [Issues](https://github.com/Suraj-kumar00/Flash-Fathom-AI/issues)
2. Provide a clear and concise description of the issue.
3. Wait until someone looks into your report.
4. Begin working on the issue only after you have been assigned to it. 🚀

<br>

# Thank you for contributing 💗

We truly appreciate your time and effort to help improve our project. Feel free to reach out if you have any questions or need guidance. Happy coding! 🚀

##
