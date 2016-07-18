#!/usr/bin/env bash
search="$1"
cmd="$2"
dist="$3"

find src -name "$search" | while read -r f; do
	f_dist="$dist/$(dirname "$f" | sed 's~src/~~')"
	mkdir -p "$f_dist"
	echo "Running $cmd '$f' > '$f_dist/$(basename "$f")'"
	$cmd "$f" > "$f_dist/$(basename "$f")"
done
