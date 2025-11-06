import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'NethVoice documentation',
  tagline: 'NethVoice is a complete and flexible VoIP solution for NethServer',
  favicon: 'img/favicon.ico',

  // Custom fields for theme configuration
  customFields: {
    productVersion: '8.0',
  },

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  plugins: [
    './plugins/docusaurus-plugin-generate-trunks',
  ],

  scripts: [
    {
      src: "https://widget.kapa.ai/kapa-widget.bundle.js",
      "data-website-id": "54bcf336-8574-4f4e-b02d-27916cc99e46",
      "data-project-name": "NethVoice Documentation",
      "data-project-color": "#059669",
      "data-project-logo": "https://docs.nethvoice.com/img/favicon_white.ico",
      "data-source-group-ids-include": "e92a7b49-112e-479c-8813-0b8562b9e652",
      async: true,
    },
  ],

  // Set the production url of your site here
  // Production: https://docs.nethvoice.com with empty baseUrl
  // Development: GitHub pages deployment
  url: process.env.NODE_ENV === 'production' 
    ? 'https://docs.nethvoice.com' 
    : 'https://nethserver.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: process.env.NODE_ENV === 'production' 
    ? '/' 
    : '/nethvoice-docs/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'NethServer', // Usually your GitHub org/user name.
  projectName: 'nethvoice-docs', // Usually your repo name.
  deploymentBranch: 'gh-pages', // The branch that GitHub pages will deploy from.
  trailingSlash: false, // Set to true if you want to add a trailing slash to all URLss

  onBrokenLinks: 'warn',

  // Markdown configuration
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'it'],
    path: 'i18n',
    localeConfigs: {
      en: {
        label: 'English',
        direction: 'ltr',
        htmlLang: 'en-US',
        calendar: 'gregory',
        path: 'en',
      },
      it: {
        label: 'Italian',
        direction: 'ltr',
        htmlLang: 'it-IT',
        calendar: 'gregory',
        path: 'it',
      },
    },
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: '',
      logo: {
        alt: 'NethVoice',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'administratorManualSidebar',
          position: 'left',
          label: 'Administrator manual',
        },
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Tutorial',
        },
        {
          type: 'docSidebar',
          sidebarId: 'userManualSidebar',
          position: 'left',
          label: 'User manual',
        },
        {
          type: 'localeDropdown',
          position: 'right',
        },
        {
          href: 'https://github.com/NethServer/nethvoice-docs',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Administrator manual',
              to: '/docs/administrator-manual',
            },
            {
              label: 'User manual',
              to: '/docs/user-manual',
            },
            {
              label: 'Tutorial',
              to: '/docs/tutorial',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'NethServer Community (English)',
              href: 'https://community.nethserver.org/',
            },
            {
              label: 'Partner Community (Italian)',
              href: 'https://partner.nethesis.it',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/NethServer/nethvoice-docs',
            },
            {
              label: 'NethServer documentations',
              href: 'https://ns8.nethserver.org',
            },
            {
              label: 'NethServer website',
              href: 'https://www.nethserver.org',
            },
            {
              label: 'Nethesis website',
              href: 'https://www.nethesis.it',
            }
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Nethesis`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
