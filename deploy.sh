#!/bin/bash
# Deploy script for policy-report browser

set -e

# Configuration
REMOTE_HOST="47.254.15.184"
REMOTE_USER="hicooper"
REMOTE_PATH="/home/hicooper/policy-report/dist"
LOCAL_DIST="./dist"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}🚀 Starting deployment...${NC}"

# Step 1: Build the project
echo -e "${YELLOW}📦 Building project...${NC}"
cd /Users/xueancao/Projects/QoderProjects/make-me-rich/policy-report
npm run build

# Step 2: Copy report files to dist
if [ -d "./report" ]; then
  echo -e "${YELLOW}📋 Copying report files to dist...${NC}"
  cp -r ./report ./dist/

  echo -e "${YELLOW}🔄 Renaming reports by ID...${NC}"
  node -e "
  const fs = require('fs');
  const path = require('path');
  const content = fs.readFileSync('./src/data/reports.ts', 'utf-8');
  const regex = /id:\s*(\d+),[\s\S]*?file:\s*'\/report\/(.+?\.html)'/g;
  const dir = './dist/report/';
  let match;
  while ((match = regex.exec(content)) !== null) {
    const id = match[1];
    const file = match[2];
    const src = path.join(dir, file);
    const dst = path.join(dir, id + '.html');
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dst);
      console.log('Copied: ' + file + ' -> ' + id + '.html');
    }
  }
  "
fi

# Step 3: Upload to server using scp
echo -e "${YELLOW}📤 Uploading to server...${NC}"
scp -r -o StrictHostKeyChecking=no "$LOCAL_DIST/"* "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/"

echo -e "${GREEN}✅ Deployment completed!${NC}"
echo -e "Site available at: http://$REMOTE_HOST/policy-report/"