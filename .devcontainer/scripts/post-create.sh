#!/bin/bash

echo "Verificando si hay actualizaciones remotas..."
git fetch origin

LOCAL=$(git rev-parse @)
REMOTE=$(git rev-parse @{u})

if [ "$LOCAL" != "$REMOTE" ]; then
  echo "Hay cambios remotos. Ejecutando git pull..."
  git pull
else
  echo "Tu rama está actualizada."
fi
