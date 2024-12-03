#!/bin/bash

function display_help() {
  echo "Usage: $0 [option...]"
  echo
  echo "   -h, --help       Show this help message"
  echo "   -v, --version    Show script version"
  echo "   -f, --force      Force delete .yarnrc.yml without asking"
  echo
}

function display_version() {
  echo "Script version 1.0"
}

# Parse command line arguments
FORCE_DELETE=false
while [[ "$1" != "" ]]; do
  case $1 in
    -h | --help )
      display_help
      exit
      ;;
    -v | --version )
      display_version
      exit
      ;;
    -f | --force )
      FORCE_DELETE=true
      ;;
    * )
      echo "Invalid option: $1"
      display_help
      exit 1
  esac
  shift
done

function delete_yarnrc() {
  if [ -f .yarnrc.yml ]; then
    if [ "$FORCE_DELETE" = true ]; then
      rm .yarnrc.yml
    else
      read -p "Do you really want to delete your current .yarnrc.yml? [Y/n] " -n 1 -r
      echo
      if [[ $REPLY =~ ^[Yy]$ ]] || [[ -z $REPLY ]]; then
        rm .yarnrc.yml
      else
        exit 1
      fi
    fi
  fi
}

# Main script
corepack enable
delete_yarnrc
yarn set version stable
yarn set version 4.5.3 --yarn-path
yarn config set nodeLinker node-modules
yarn config set npmScopes.plentymarkets.npmRegistryServer "https://npm.pkg.github.com"
yarn config set npmScopes.plentymarkets.npmAlwaysAuth true
if [ -n "$GITHUB_ACTIONS" ]; then
  if [ -z "$NPM_AUTH_TOKEN" ]; then
    echo "NPM_AUTH_TOKEN is not set in the GitHub Actions environment"
    exit 1
  fi
  yarn config set npmScopes.plentymarkets.npmAuthToken $NPM_AUTH_TOKEN
elif grep -q "NPM_AUTH_TOKEN" ./apps/web/.env; then
  export $(grep "NPM_AUTH_TOKEN" ./apps/web/.env | xargs)
  yarn config set npmScopes.plentymarkets.npmAuthToken $NPM_AUTH_TOKEN
else
  echo "NPM_AUTH_TOKEN not found in ./apps/web/.env"
  exit 1
fi
yarn
