#!/usr/bin/env bash
set -euo pipefail

THEMES=(
  amber-minimal amethyst-haze bold-tech bubblegum caffeine candyland catppuccin claude claymorphism clean-slate
  cosmic-night cyberpunk darkmatter doom-64 elegant-luxury graphite kodama-grove midnight-bloom mocha-mousse modern-minimal
  mono nature neo-brutalism northern-lights notebook ocean-breeze pastel-dreams perpetuity quantum-rose retro-arcade soft-pop
  solar-dusk starry-night sunset-horizon supabase t3-chat tangerine twitter vercel vintage-paper violet-bloom
)

for t in "${THEMES[@]}"; do
  echo "Adding theme: $t"
  pnpm dlx shadcn@latest add "https://tweakcn.com/r/themes/${t}.json"
done

echo "All themes attempted. Review changes and run pnpm format."

