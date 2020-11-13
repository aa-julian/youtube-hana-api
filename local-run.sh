#!/usr/bin/env bash

credentials=$(cf service-key aaj-hackathon-db aaj-hackathon-db-key | sed -n 3,14p)
if [[ -z "$credentials" ]]; then
  echo "service-key 'gca-db-key' not found"
  exit 1
fi

echo "{\"hana\": $credentials }" > /tmp/default-services.json
echo "{\"hana\": $credentials }" > ./default-services.json

npm run dev