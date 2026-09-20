# Deploy this project to Vercel

Import the repository from its root directory. Do not set
`artifacts/noise-remover-clone` as the Vercel Root Directory because this is a
pnpm workspace and its dependencies are resolved from the repository root.

The repository root must contain:

- `package.json`
- `pnpm-lock.yaml`
- `pnpm-workspace.yaml`
- `vercel.json`
- `artifacts/`

The included `vercel.json` already configures:

- Install command: `pnpm install --frozen-lockfile`
- Build command: `pnpm --filter @workspace/noise-remover-clone run build`
- Output directory: `artifacts/noise-remover-clone/dist/public`

If Vercel shows `No Output Directory named "public" found`, set **Root
Directory** to `./` and remove any dashboard override that says `public`.