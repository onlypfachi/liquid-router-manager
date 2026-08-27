.PHONY: run web run-web

# Usage: make run web
run: web

web: run-web

run-web:
	cd web && bun run dev
