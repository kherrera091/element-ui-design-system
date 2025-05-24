// scripts/changelog-helper.js
const fs = require('fs');
const path = require('path');

const CHANGELOG_PATH = 'CHANGELOG.md';

// Helper function to get current date in YYYY-MM-DD format
function getCurrentDate() {
  return new Date().toISOString().split('T')[0];
}

// Helper function to read the current changelog
function readChangelog() {
  if (!fs.existsSync(CHANGELOG_PATH)) {
    console.error('CHANGELOG.md not found. Please create it first.');
    process.exit(1);
  }
  return fs.readFileSync(CHANGELOG_PATH, 'utf8');
}

// Helper function to write the changelog
function writeChangelog(content) {
  fs.writeFileSync(CHANGELOG_PATH, content);
}

// Function to start a new version
function startNewVersion(version) {
  const changelog = readChangelog();
  const date = getCurrentDate();
  
  // Check if version already exists
  if (changelog.includes(`## [${version}]`)) {
    console.error(`Version ${version} already exists in changelog.`);
    process.exit(1);
  }
  
  // Replace [Unreleased] section
  const newVersionSection = `## [Unreleased]

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

## [${version}] - ${date}`;
  
  const updatedChangelog = changelog.replace(
    '## [Unreleased]',
    newVersionSection
  );
  
  writeChangelog(updatedChangelog);
  console.log(`✅ Started new version ${version} in changelog`);
  console.log('📝 Edit CHANGELOG.md to add your changes under [Unreleased]');
}

// Function to finalize a version (move unreleased to version)
function finalizeVersion(version) {
  const changelog = readChangelog();
  const date = getCurrentDate();
  
  // Extract unreleased content
  const unreleasedMatch = changelog.match(/## \[Unreleased\]([\s\S]*?)(?=## \[|$)/);
  if (!unreleasedMatch) {
    console.error('Could not find [Unreleased] section');
    process.exit(1);
  }
  
  const unreleasedContent = unreleasedMatch[1].trim();
  
  // Check if there are actual changes (not just empty sections)
  const hasChanges = unreleasedContent.includes('- ') && 
                    !unreleasedContent.match(/### (Added|Changed|Deprecated|Removed|Fixed|Security)\n- \n/g);
  
  if (!hasChanges) {
    console.error('No changes found in [Unreleased] section. Please add your changes first.');
    process.exit(1);
  }
  
  // Replace unreleased section with new version
  const newSection = `## [Unreleased]

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

## [${version}] - ${date}
${unreleasedContent}`;
  
  const updatedChangelog = changelog.replace(
    /## \[Unreleased\][\s\S]*?(?=## \[)/,
    newSection
  );
  
  writeChangelog(updatedChangelog);
  console.log(`✅ Finalized version ${version} in changelog`);
}

// Function to show help
function showHelp() {
  console.log(`
Changelog Helper - Manual changelog management

Usage:
  node scripts/changelog-helper.js <command> [version]

Commands:
  start <version>     Start a new version section
  finalize <version>  Move unreleased changes to version
  help               Show this help

Examples:
  node scripts/changelog-helper.js start 1.1.0
  node scripts/changelog-helper.js finalize 1.1.0
  `);
}

// Main script logic
const args = process.argv.slice(2);
const command = args[0];
const version = args[1];

switch (command) {
  case 'start':
    if (!version) {
      console.error('Please provide a version number');
      process.exit(1);
    }
    startNewVersion(version);
    break;
    
  case 'finalize':
    if (!version) {
      console.error('Please provide a version number');
      process.exit(1);
    }
    finalizeVersion(version);
    break;
    
  case 'help':
  default:
    showHelp();
    break;
}