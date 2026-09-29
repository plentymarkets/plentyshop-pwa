#!/usr/bin/env bash
# Checks that marketplace.json exists and passes marketplace listing requirements.
# Usage: MODULE_PATH=packages/module-my-extension ./validate-marketplace-json.sh
set -euo pipefail

MARKETPLACE_JSON="$MODULE_PATH/marketplace.json"
REQUIRED_LANGS=(en de)

if [[ ! -f "$MARKETPLACE_JSON" ]]; then
  echo "Missing required file: marketplace.json" >&2
  exit 1
fi

if ! jq_error=$(jq empty "$MARKETPLACE_JSON" 2>&1); then
  echo "marketplace.json is not valid JSON: $jq_error" >&2
  exit 1
fi

errors=()

check_localized_string() {
  local field="$1"
  local field_type
  field_type=$(jq -r --arg f "$field" '.[$f] | type' "$MARKETPLACE_JSON")

  if [[ "$field_type" != "object" ]]; then
    errors+=("\"$field\" must be an object keyed by language ({ \"en\": ..., \"de\": ... })")
    return
  fi

  local extra_langs
  extra_langs=$(jq -r --arg f "$field" '[.[$f] | keys[] | select(. != "en" and . != "de")] | join(", ")' "$MARKETPLACE_JSON")
  if [[ -n "$extra_langs" ]]; then
    errors+=("\"$field\" must only contain the languages en, de, found extra: $extra_langs")
  fi

  local lang is_valid
  for lang in "${REQUIRED_LANGS[@]}"; do
    is_valid=$(jq -r --arg f "$field" --arg l "$lang" '
      (.[$f][$l] // "") as $v
      | if ($v | type) == "string" then ($v | test("\\S")) else false end
    ' "$MARKETPLACE_JSON")
    if [[ "$is_valid" != "true" ]]; then
      errors+=("\"$field.$lang\" is required and must be a non-empty string")
    fi
  done
}

check_localized_string "marketplaceName"
check_localized_string "shortDescription"

price_type=$(jq -r '.price | type' "$MARKETPLACE_JSON")
price_value=$(jq -r '.price' "$MARKETPLACE_JSON")

price_line=$(grep -m1 '"price"' "$MARKETPLACE_JSON" || true)
raw_price=""
if [[ "$price_line" =~ \"price\"[[:space:]]*:[[:space:]]*(-?[0-9]+(\.[0-9]+)?) ]]; then
  raw_price="${BASH_REMATCH[1]}"
fi

if [[ "$price_type" != "number" ]]; then
  errors+=('"price" is required and must be a number')
elif [[ "$raw_price" != *.* ]]; then
  errors+=('"price" must be written as a float with a decimal point (e.g. 0.00 or 10.00), not a plain integer')
elif awk -v p="$price_value" 'BEGIN { exit !(p != 0 && p < 10) }'; then
  errors+=("\"price\" must be 0.00 (free) or at least 10.00 (paid), got ${price_value}")
fi

categories_length=$(jq -r '(.categories // []) | if type == "array" then length else -1 end' "$MARKETPLACE_JSON")
if [[ "$categories_length" -lt 1 ]]; then
  errors+=('"categories" is required and must be a non-empty array with at least one category ID')
fi

if jq -e 'has("keywords")' "$MARKETPLACE_JSON" > /dev/null; then
  keywords_type=$(jq -r '.keywords | type' "$MARKETPLACE_JSON")
  if [[ "$keywords_type" != "array" ]]; then
    errors+=('"keywords" must be an array when present')
  fi
fi

if [[ ${#errors[@]} -gt 0 ]]; then
  echo "marketplace.json failed validation:" >&2
  printf '  - %s\n' "${errors[@]}" >&2
  exit 1
fi

echo "marketplace.json passes validation."
