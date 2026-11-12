# terraforming-mars-setup

## Spec Kit with Codex

Initialized with GitHub Spec Kit (`specify-cli` 1.3.2), using the official
[existing-project instructions](https://github.com/github/spec-kit/blob/main/docs/how-to/existing-projects.md)
and [Codex integration](https://github.com/github/spec-kit/blob/main/docs/integrations/codex.md).

The development tools require Python 3.11+, `uv`, and Codex CLI. To install the
same Specify CLI version:

```sh
uv tool install specify-cli==1.3.2
```

Ensure uv's tool executable directory is on `PATH`. In the prepared cloud
environment, Specify is installed at `/workspace/.tools/bin/specify`; use
`export PATH="/workspace/.tools/bin:$PATH"` to invoke it as `specify`.

Codex discovers the repository's `.agents/skills/speckit-*/SKILL.md` files.
Start a new Codex session in this repository to load them, then invoke skills
with a dollar prefix, such as `$speckit-constitution`. Shared templates,
Bash helpers, workflow metadata, and an unfilled constitution template live in
`.specify/`.

## Game configuration and GitHub Pages

US1 configures player count, expansions, eligible boards and variants. Choices
remain in memory across Back/Continue navigation. US2 generates public board,
first-player, colony and objective selections on first setup entry. Customize
reveals eligible choices and rerolls; manual replacement objectives lock in place.
Board changes confirm affected objective losses before committing.

Configuration is read-only after successful generation in this increment; public
choices remain customizable and unchanged revisits preserve results. Physical
setup guidance, summary and the general configuration-edit/Reset workflow belong
to later stories. No session persistence is provided. Use Node 24 LTS from `.nvmrc`:

```sh
npm ci
npm run dev
```

Open the printed URL at `/terraforming-mars-setup/`. Production builds validate
all game catalogs before emitting static assets:

```sh
npm run build
npm run preview
```

See [GitHub Pages deployment](docs/github-pages.md) for the required one-time
repository settings, verification/smoke commands and the merge-to-main workflow.
Pull requests verify only; successful pushes to `main` deploy through the
`github-pages` environment once those settings are applied.
