# Documentation Translation Sync System

This system automates translation synchronization between English and Italian versions of NethVoice documentation.

## Overview

The translation workflow automatically detects changes to documentation files and generates corresponding translations using AI, maintaining consistency between the English (`docs/`) and Italian (`i18n/it/`) documentation.

## How It Works

### When It Triggers
The workflow activates automatically when:
- A Pull Request is created or updated
- The PR targets the `main` branch
- Documentation files (`.md` or `.mdx`) are modified

### What It Does
1. **Verifies API Access**: Tests GitHub Models API connectivity before processing
2. **Analyzes Changes**: Identifies which documentation files have been modified
3. **Calls Translation Agent**: Invokes the Python agent to process changed files
4. **Generates Translations**: Uses AI to translate new or modified content
5. **Commits Results**: Adds translations to the same PR branch

### Translation Agent Role
The Python agent (`translation-sync-agent.py`) handles the core translation logic:
- Processes git diffs to identify new content
- Maps file paths between English and Italian directories
- Uses GitHub Models API (GPT-4o) for translation
- Applies translations while preserving markdown formatting
- Maintains technical terminology consistency

## File Structure

### English Documentation
```
docs/
├── tutorial/
├── administrator-manual/
└── user-manual/
```

### Italian Documentation
```
i18n/it/docusaurus-plugin-content-docs/current/
├── tutorial/
├── administrator-manual/
└── user-manual/
```

## Requirements

- Active GitHub Copilot subscription for the organization
- Standard GitHub Actions permissions (automatically configured)
- Documentation files in Docusaurus markdown format

## Usage Example

When you add content to an English file:
```markdown
## New Feature
This feature helps users manage their settings.
```

The system automatically creates the Italian equivalent:
```markdown
## Nuova Funzionalità
Questa funzionalità aiuta gli utenti a gestire le loro impostazioni.
```

## Architecture Details

For technical implementation details, file specifications, and advanced configuration options, see [ARCHITECTURE.md](./ARCHITECTURE.md).

## Monitoring

Check the GitHub Actions workflow logs to monitor:
- Translation processing progress
- API connectivity status  
- Generated translations quality