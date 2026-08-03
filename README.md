# NethVoice Documentation Website

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.



## Contributing guidelines

All contributions to this documentation repository are welcome!

If you'd like to contribute documentation, tutorials, or translations to this repository, please follow the lightweight guidelines below so contributions stay consistent and build cleanly.

1. Pick a location

	- Add general documentation pages under `docs/`.
	- Add tutorial-style guides under `docs/tutorial/` and use the tutorial template at `templates/tutorial.md` as a starting point.
	- Add Italian translations under `i18n/it/docusaurus-plugin-content-docs/current/` mirroring the English structure.

2. File and front-matter conventions

	- Use lowercase letters and underscores for filenames and directories (example: `export_phonebook.md`).
	- Always include meaningful front-matter `title:` and (when useful) `sidebar_position:`.
	- Use explicit heading IDs for any headings that may be linked from other pages, e.g. `## Section Title {#section-title}`.

3. Translations

    - Create content in English or Italian first, depending on your preference. English is generally preferred.
    - Translations are maintained manually: when you add or change a page, update its counterpart in the same PR so both languages stay aligned.
    - English pages live under `docs/`, Italian pages under `i18n/it/docusaurus-plugin-content-docs/current/` with the same file names and directory structure.
    - Keep headings, heading IDs, and terminology consistent between the two versions.

4. Style and formatting

	- Use standard Markdown supported by Docusaurus. Keep paragraphs concise and use headings to structure pages.
	- Use relative links for internal documents like `[Install guide](../install/index.md)`.
	- Wrap literal values in backticks, and UI button labels in double asterisks (example: **Install**).

5. Validation and local checks

	- After adding or editing pages, update heading IDs if needed:

    ```bash
    yarn write-heading-ids --overwrite docs/ docs/user-manual/
    ```

	- Build the site locally to detect link/anchor issues and warnings:

    ```bash
    yarn build --locale en
    yarn build --locale it
    ```

	- To preview the site locally during authoring, run the dev server:

    ```bash
    yarn run start
    # or Italian preview
    yarn run start --locale it
    ```

6. Avoid committing generated or plan files

	- Do not commit build artifacts from `build/`.
	- Plan files (for internal planning) belong in `plans/` but should not be committed; use them locally when needed.

7. Checklist before opening a PR

	- [ ] File added to the correct directory and named with lowercase + underscores.
	- [ ] Front-matter includes a clear title (and sidebar position if relevant).
	- [ ] Headings include explicit IDs where cross-linking is needed.
	- [ ] Build runs locally without errors.
	- [ ] If adding a tutorial, it follows the `templates/tutorial.md` structure.

If you're unsure about anything, open an issue or contact a documentation maintainer for guidance before opening a PR.

## Deployment and Local Development

### yarn version

Usa an updated version of yarn

```bash
yarn --version
```

Version 1.22.22 is fine [(install instructions)](https://classic.yarnpkg.com/lang/en/docs/install/)

### Installation

```bash
yarn install
```

This installs all required dependencies, including Docusaurus and the faster build plugin.

### Local Development

To open the English website locally for development, run:

```bash
yarn run start
```

To open the Italian website locally for development, run:

```bash
yarn run start --locale it
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Build

```bash
yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service. It also refreshes the migration-status data through the Docusaurus plugin before the site is built.

### Deployment

Deployment is automated via GitHub Actions: every time changes are merged into the `main` branch, the site is rebuilt and deployed to [https://docs.nethvoice.com/](https://docs.nethvoice.com/).
