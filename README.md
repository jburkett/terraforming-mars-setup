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

Initialization only has been performed: no project principles, feature
specifications, implementation plans, tasks, or application code have been authored.
No API keys or application dependencies are required for this scaffolding.
