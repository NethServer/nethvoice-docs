const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

let migrationStatusGenerated = false;

function runMigrationStatusExtractor(siteDir) {
  const scriptPath = path.join(siteDir, 'scripts', 'extract-migration-status.py');

  if (!fs.existsSync(scriptPath)) {
    throw new Error(`Migration status extractor not found: ${scriptPath}`);
  }

  console.log('[generate-migration-status] Running scripts/extract-migration-status.py');
  const result = spawnSync('python3', [scriptPath], {
    cwd: siteDir,
    stdio: 'inherit',
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    throw new Error(
      `[generate-migration-status] scripts/extract-migration-status.py exited with code ${result.status ?? 'unknown'}`
    );
  }
}

module.exports = function generateMigrationStatusPlugin(context) {
  return {
    name: 'docusaurus-plugin-generate-migration-status',
    async loadContent() {
      if (migrationStatusGenerated) {
        return null;
      }
      migrationStatusGenerated = true;
      runMigrationStatusExtractor(context.siteDir);
      return null;
    },
  };
};
