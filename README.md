# Website

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

## Installation

```bash
yarn install
```

## Local Development

To open the English website locally for development, run:

```bash
yarn run start
```

To open the Italian website locally for development, run:

```bash
yarn run start --locale it
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

## Build

```bash
yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

## Deployment

Using SSH:

```bash
USE_SSH=true yarn deploy
```

Not using SSH:

```bash
GIT_USER=<Your GitHub username> yarn deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.

## Adding content

Directory structure:

- `docs/` - English documentation content
- `i18n/it/docusaurus-plugin-content-docs/current/` - Italian

To add a new documentation page, follow these steps:

1. Create a new English Markdown file (`.md` or `.mdx`) in the `docs/` directory.
2. Create a corresponding Italian Markdown file in the `i18n/it/docusaurus-plugin-content-docs/current/` directory.
3. If you need a new section, just create a new subdirectory in both `docs/` and the Italian directory, and add an `index.md` file in each to serve as the section's landing page.

Conventions:
- use always lowercase letters and underscores (`_`) for file and directory names
- use meaningful titles in the front matter of each Markdown file
- use explicit headings with IDs to allow the reuse of same links across different languages

After adding new content, run the following command to update the heading IDs in the documentation:
Eg:
```bash
yarn write-heading-ids --overwrite docs/ docs/user-manual/
```

Always build the documentation to verify there are no broken links or anchor issues:
```bash
yarn build --locale en
```
And for Italian:
```bash
yarn build --locale it
```

## Translation Automation

The project includes an automated translation sync system that helps maintain consistency between English and Italian documentation. When documentation files are modified in Pull Requests, the system automatically generates corresponding translations using AI.

For technical details, see the [Translation Agent Documentation](./.github/scripts/translation-agent/README.md).