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

# Step 2: Upload to server using scp
echo -e "${YELLOW}📤 Uploading to server...${NC}"
scp -r -o StrictHostKeyChecking=no "$LOCAL_DIST/"* "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/"

echo -e "${GREEN}✅ Deployment completed!${NC}"
echo -e "Site available at: http://$REMOTE_HOST/policy-report/"