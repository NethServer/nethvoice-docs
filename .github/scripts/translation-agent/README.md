# Documentation Translation Sync System

This system automates translation synchronization in NethVoice documentation.

## How It Works

### Trigger
The workflow automatically activates when a Pull Request is created or updated targeting the `main` branch that modifies documentation files (`.md` or `.mdx`).

### Process
1. **API Verification**: Tests access to GitHub Models API before proceeding
2. **Change Analysis**: The system identifies which files have been modified
3. **Categorization**: Distinguishes between changes to English files (`docs/`) and Italian files (`i18n/it/`)
4. **Translation Generation**: Uses GitHub Models (GPT-4o Mini) to translate new sections
5. **Application**: Applies translations to corresponding files in the other language
6. **Commit**: Adds changes with Conventional Commits format to the original PR branch

### Path Mapping
- English file: `docs/tutorial/example.md`
- Italian file: `i18n/it/docusaurus-plugin-content-docs/current/tutorial/example.md`

## Commit Standards

The system uses **Conventional Commits** for standardized management:
- Format: `docs: auto-sync translations for PR #<number>`
- Single commit for all translations in a PR
- Descriptive and consistent message

## Configuration

### Requirements
- Active GitHub Copilot subscription for the organization
- `GITHUB_TOKEN` with access to Copilot APIs (automatically available)
- Write permissions for GitHub Actions

### System Files
- `.github/workflows/sync-translations.yml`: Main workflow
- `.github/scripts/translation-sync-agent.py`: Python agent for translation
- `.github/scripts/test-copilot-access.py`: API connectivity test (integrated in workflow)

## Usage Example

1. **Scenario**: Add a new section to the file `docs/tutorial/getting-started.md`
2. **Added content**:
   ```markdown
   ## Feedback
   
   If you encounter any issues, please contact: test@example.com
   ```
3. **Result**: The system automatically creates the Italian version in `i18n/it/docusaurus-plugin-content-docs/current/tutorial/getting-started.md`:
   ```markdown
   ## Feedback
   
   Se riscontri problemi, contatta: test@example.com
   ```

## Translation Rules

### Preserved Elements
- Section IDs: `{#section-id}`
- Internal and external links
- Code blocks and configuration
- Email addresses and URLs

### Translation Style
- **Italian**: Formal tone, technical terminology in English when appropriate
- **English**: Professional tone, consistent terminology

### Formatting
- UI labels in bold: **Install**, **Installa**
- Code in backticks: `Nethesis,1234`
- Email links: `[email](mailto:email)`

## Security and Fail-Fast

### Preliminary API Test
The system implements a **preliminary test** for GitHub Models API access:
- ✅ **Verifies connectivity** before processing files
- ❌ **Blocks execution** if API is not accessible
- 🔒 **Prevents partial executions** without translation capability

### Fail-Fast Benefits
- **Immediate feedback** on API access issues
- **No unnecessary processing** of files without translation possibility
- **Clear error messages** for quick diagnosis and resolution

## Current Limitations

- The system adds new content but doesn't handle complex modifications to existing sections
- Works best with complete section additions
- Requires human supervision to verify translation quality

## Monitoring

Check workflow logs in GitHub Actions for:
- Processed files
- Generated translations
- Any errors

## Future Developments

- Improved intelligence for complex modifications
- Support for document restructuring
- Integration with review systems for translations