#!/bin/bash

set -e  # Exit immediately if a command exits with a non-zero status

# Display the current directory for debugging
echo "Current directory: $(pwd)"

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "Error: package.json not found"
    exit 1
fi

# Create backup of original package.json
cp package.json package.json.bak

# Check if global_package.json exists and merge dependencies
if [ -f "global_package.json" ]; then
    echo "Found global_package.json, merging dependencies"
    
    # Extract dependencies from both package.json files
    LOCAL_DEPS=$(node -e "console.log(JSON.stringify(require('./package.json').dependencies || {}))")
    LOCAL_DEV_DEPS=$(node -e "console.log(JSON.stringify(require('./package.json').devDependencies || {}))")
    GLOBAL_DEPS=$(node -e "console.log(JSON.stringify(require('./global_package.json').dependencies || {}))")
    GLOBAL_DEV_DEPS=$(node -e "console.log(JSON.stringify(require('./global_package.json').devDependencies || {}))")
    
    # Create a merged package.json file
    node -e "
    const fs = require('fs');
    const pkg = require('./package.json');
    const localDeps = JSON.parse('${LOCAL_DEPS}');
    const localDevDeps = JSON.parse('${LOCAL_DEV_DEPS}');
    const globalDeps = JSON.parse('${GLOBAL_DEPS}');
    const globalDevDeps = JSON.parse('${GLOBAL_DEV_DEPS}');
    
    // Merge dependencies
    pkg.dependencies = Object.assign({}, globalDeps, localDeps);
    
    // Merge dev dependencies
    pkg.devDependencies = pkg.devDependencies || {};
    pkg.devDependencies = Object.assign({}, pkg.devDependencies, globalDevDeps);
    
    fs.writeFileSync('./package.json', JSON.stringify(pkg, null, 2));
    "
    
    echo "Successfully merged global and local dependencies"
else
    echo "No global_package.json found, using only local package.json"
fi

# Install base dependencies
echo "Installing base dependencies"
npm install

# Install specific versions of critical dependencies
echo "Installing specific Next.js and React versions"
npm install next@12 react@18 react-dom@18 --legacy-peer-deps

# Install UI and component libraries
echo "Installing UI libraries"
npm install tailwindcss postcss autoprefixer --legacy-peer-deps
npm install framer-motion lucide-react --legacy-peer-deps
npm install @radix-ui/react-icons @radix-ui/react-dialog @radix-ui/react-label @radix-ui/react-slot --legacy-peer-deps

# Check if tsconfig.json exists and ensure path aliases are properly configured
if [ -f "tsconfig.json" ]; then
    echo "Ensuring path aliases are configured correctly in tsconfig.json"
    # Add or ensure proper path aliases configuration
    node -e "
    const fs = require('fs');
    const tsconfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
    
    // Ensure compilerOptions and paths exist
    tsconfig.compilerOptions = tsconfig.compilerOptions || {};
    tsconfig.compilerOptions.baseUrl = '.';
    tsconfig.compilerOptions.paths = tsconfig.compilerOptions.paths || {};
    
    // Set up the path aliases
    tsconfig.compilerOptions.paths = {
      ...tsconfig.compilerOptions.paths,
      '@/*': ['./*'],
      '@/components/*': ['./components/*'],
      '@/lib/*': ['./lib/*'],
      '@/hooks/*': ['./hooks/*'],
      '@/app/*': ['./app/*']
    };
    
    // Write the updated config back to the file
    fs.writeFileSync('tsconfig.json', JSON.stringify(tsconfig, null, 2));
    console.log('Updated tsconfig.json with path aliases');
    "
fi

# Ensure next.config.js has correct configuration
if [ -f "next.config.js" ]; then
    echo "Updating next.config.js with correct configuration"
    # Create a backup
    cp next.config.js next.config.js.bak
    
    # Create a simplified next.config.js that works with Netlify
    cat > next.config.js << 'EOL'
module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['i.ytimg.com', 'img.youtube.com'],
  },
};
EOL
fi

# Set environment variables
export NODE_ENV=production
export NEXT_TELEMETRY_DISABLED=1

# Run build
echo "Running next build command"
npm run build --legacy-peer-deps
