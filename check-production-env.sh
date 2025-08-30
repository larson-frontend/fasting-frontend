#!/bin/bash
# Wrapper: moved to scripts/dev/check-production-env.sh
exec "$(dirname "$0")/scripts/dev/check-production-env.sh" "$@"
