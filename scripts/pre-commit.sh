#!/bin/sh
# Auto-regenerate content-dates.json when SEO data files are staged.
# Installed by the "postinstall" npm script.

STAGED_DATA=$(git diff --cached --name-only --diff-filter=ACM | grep '^lib/seo-pages/data/.*\.json$' | head -1)

if [ -n "$STAGED_DATA" ]; then
  echo "[pre-commit] SEO data files changed — regenerating content-dates.json..."
  node scripts/generate-content-dates.mjs
  git add lib/seo-pages/content-dates.json
fi
