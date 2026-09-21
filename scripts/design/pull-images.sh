#!/usr/bin/env bash
# Download every remote image of a Stitch export into public/images/lootora/<prefix>-NN.jpg.
# Usage: bash scripts/design/pull-images.sh <code.html> <prefix>
# Prints "NN  data-alt" so the mock data can reference each file by index.
set -euo pipefail

html="$1"
prefix="$2"
out="public/images/lootora"
mkdir -p "$out"

n=0
tr -d '\r' < "$html" | grep -o '<img[^>]*>' | while read -r tag; do
  src=$(printf '%s' "$tag" | grep -o 'src="https://lh3[^"]*"' | sed 's/^src="//; s/"$//') || true
  [ -z "$src" ] && continue
  n=$((n + 1))
  file=$(printf '%s/%s-%02d.jpg' "$out" "$prefix" "$n")
  [ -f "$file" ] || curl -sS -m 60 -o "$file" "$src"
  alt=$(printf '%s' "$tag" | grep -o 'data-alt="[^"]*"\|alt="[^"]*"' | head -1 | cut -c1-90) || true
  printf '%02d  %s\n' "$n" "$alt"
done
