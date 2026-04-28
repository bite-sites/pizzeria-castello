# bite-sites-base

Base repository for the Bite Sites multi-repo setup.

## Purpose

This repo keeps only shared artifacts:

- reusable website skeleton in `template/`
- shared AI skills in `skills/`
- assistant mirrors in `.claude/skills/` and `.github/skills/`
- utility scripts in `scripts/`
- nested independent restaurant repos in `restaurants/` (ignored by base git)

## Structure

```
.
├─ template/
│  ├─ index.html
│  └─ assets/
│     ├─ css/styles.css
│     └─ js/{i18n.js,main.js,menu.js}
├─ skills/
│  └─ bite-site/SKILL.md
├─ .claude/skills/
│  └─ bite-site/SKILL.md
├─ .github/skills/
│  └─ bite-site/SKILL.md
├─ scripts/
│  └─ sync-skills.sh
└─ restaurants/ # independent git repos
```

## Skill Source of Truth

Canonical skills live in `skills/`.

Mirrors for assistants are synced to:

- `.claude/skills/`
- `.github/skills/`

Use the sync script from repo root:

```bash
./scripts/sync-skills.sh
```

Verify parity without modifying files:

```bash
./scripts/sync-skills.sh --check
```

## Restaurant Repos

Each folder in `restaurants/` is a standalone git repo.

Initialize or reinitialize a restaurant repo:

```bash
cd restaurants/<slug>
git init
git symbolic-ref HEAD refs/heads/main
```

Base repo policy:

- base `.gitignore` ignores `/restaurants/**`
- changes inside restaurant repos are managed from within each nested repo

## Workflow

1. Update shared template or skills in base repo.
2. Run `./scripts/sync-skills.sh` after skill edits.
3. Work on each restaurant site inside its own repo under `restaurants/`.
4. Commit/push base and restaurant repos independently.
