// scripts/release.js
const fs = require('fs');
const { execSync } = require('child_process');

function getCurrentDate() {
  return new Date().toISOString().split('T')[0];
}

function updateChangelog(newVersion) {
  const changelog = fs.readFileSync('CHANGELOG.md', 'utf8');
  const date = getCurrentDate();
  
  // Replace the first occurrence of [Unreleased] with the new version
  const updatedChangelog = changelog.replace(
    /## \[Unreleased\]([\s\S]*?)(?=## \[)/,
    `## [Unreleased]

### Added
- 

### Changed
- 

### Deprecated
- 

### Removed
- 

### Fixed
- 

### Security
- 

## [${newVersion}] - ${date}$1`
  );
  
  fs.writeFileSync('CHANGELOG.md', updatedChangelog);
}

function release(type = 'patch') {
  console.log(`🚀 Starting ${type} release...`);
  
  try {
    // Get current version
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const currentVersion = packageJson.version;
    console.log(`📦 Current version: ${currentVersion}`);
    
    // Bump version
    execSync(`npm version ${type} --no-git-tag-version`, { stdio: 'inherit' });
    
    // Get new version
    const newPackageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const newVersion = newPackageJson.version;
    console.log(`📦 New version: ${newVersion}`);
    
    // Update changelog
    updateChangelog(newVersion);
    console.log('📝 Updated CHANGELOG.md');
    
    // Build tokens
    console.log('🔨 Building design tokens...');
    execSync('npm run build', { stdio: 'inherit' });
    
    console.log(`\n✅ Release ${newVersion} prepared successfully!`);
    console.log('\n📋 Next steps:');
    console.log('1. Review and edit CHANGELOG.md to add your actual changes');
    console.log('2. Commit your changes: git add . && git commit -m "Release v' + newVersion + '"');
    console.log('3. Tag the release: git tag v' + newVersion);
    console.log('4. Push to repository: git push && git push --tags');
    console.log('5. Optionally publish to npm: npm publish');
    
  } catch (error) {
    console.error('❌ Release failed:', error.message);
    process.exit(1);
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const releaseType = args[0] || 'patch';

if (!['patch', 'minor', 'major'].includes(releaseType)) {
  console.error('❌ Invalid release type. Use: patch, minor, or major');
  process.exit(1);
}

release(releaseType);