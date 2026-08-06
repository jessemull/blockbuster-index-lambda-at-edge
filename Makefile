.PHONY: lint test format format-check build package security preflight push-validate clean

lint:
	npm run lint

test:
	npm test

format:
	npm run format

format-check:
	npm run format:check

build:
	npm run build

package:
	npm run package

security:
	npm audit

clean:
	npm run clean

preflight:
	./scripts/preflight.sh

push-validate:
	./scripts/push_validate.sh
