# Contributing to SETU

Thank you for your interest in contributing to SETU. This project is built to serve students in tribal welfare residential schools in Telangana — every contribution, however small, has a real human impact.

## Before You Start

Please open an [issue](https://github.com/jayarama-06/Project-SETU/issues) before starting significant work. This avoids duplicate effort and lets us discuss the best approach together.

## Ways to Contribute

You do not have to be a developer to contribute.

- **Code** — bug fixes, new features, performance improvements
- **Design** — UI/UX improvements for low-literacy and mobile users
- **Translation** — Telugu localisation is a Phase 2 priority
- **Documentation** — setup guides, API docs, usage examples
- **Testing** — manual testing, writing tests, accessibility checks
- **Research** — field research support, stakeholder interviews

## Development Setup

```bash
git clone https://github.com/jayarama-06/Project-SETU.git
cd Project-SETU

# Backend
cd backend
cp .env.example .env
npm install
npx prisma migrate deploy
npm run dev

# Frontend (separate terminal)
cd frontend
npm install
npm run dev
```

Or use Docker:

```bash
docker-compose up --build
```

See the [README](./README.md) for full setup instructions.

## Submitting a Pull Request

1. Fork the repository
2. Create a branch: `git checkout -b feature/your-feature-name`
3. Make your changes
4. Commit using [Conventional Commits](https://www.conventionalcommits.org/):
   ```
   feat: add Telugu language support
   fix: correct priority score calculation
   docs: update API reference
   ```
5. Push and open a pull request against `main`
6. Describe what you changed and why

## Code Style

- TypeScript throughout — no plain JS in new files
- Prettier for formatting (`npm run format` in both `frontend/` and `backend/`)
- ESLint rules are enforced — run `npm run lint` before committing

## Reporting Bugs

Open an issue with:
- What you expected to happen
- What actually happened
- Steps to reproduce
- Your OS, browser, and Node version

## Priority Contribution Areas

These are the most impactful areas right now:

- **Offline / PWA support** — critical for low-connectivity rural schools
- **Telugu localisation** — most school staff are more comfortable in Telugu
- **Accessibility** — WCAG 2.1 AA compliance for low-literacy users
- **Mobile UI** — many staff will use SETU on low-end Android phones

## Code of Conduct

Be respectful. This project serves a vulnerable community — the same standard of care applies to how we treat each other as contributors.

## Contact

**Akulapalli Jayaram** — a.jairam1206@gmail.com
