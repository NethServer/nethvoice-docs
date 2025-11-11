#!/usr/bin/env python3
"""
Translation Sync Agent for NethVoice Documentation

This agent analyzes changes in documentation files and automatically
synchronizes translations between English and Italian versions.
Uses GitHub Copilot Chat API for translations.
"""

import os
import sys
import json
import re
from pathlib import Path
from typing import Dict, List, Tuple, Optional
import subprocess
import requests
from git import Repo

class DocumentationSyncAgent:
    def __init__(self):
        self.repo = Repo('.')
        self.github_token = os.getenv('GITHUB_TOKEN')
        self.base_path = Path('.')
        
        # Path mappings
        self.en_docs_path = Path('docs')
        self.it_docs_path = Path('i18n/it/docusaurus-plugin-content-docs/current')
        
        # GitHub Models API endpoint
        self.models_api_url = "https://models.github.ai/inference/chat/completions"
        
    def get_changed_files(self) -> List[str]:
        """Get list of changed files between main branch (target) and current PR branch (source)"""
        try:
            # Get changed files compared to origin/main using three-dot notation for merge-base
            result = subprocess.run(
                ['git', 'diff', '--name-only', 'origin/main...HEAD', '--', '*.md', '*.mdx'],
                capture_output=True, text=True, check=True
            )
            files = [f.strip() for f in result.stdout.split('\n') if f.strip()]
            # Files are already filtered by git diff, but double-check
            return [f for f in files if f.endswith(('.md', '.mdx'))]
        except subprocess.CalledProcessError as e:
            print(f"Error getting changed files: {e}")
            return []

    def categorize_files(self, changed_files: List[str]) -> Tuple[List[str], List[str]]:
        """Categorize files into English and Italian"""
        en_files = []
        it_files = []
        
        for file in changed_files:
            if file.startswith('docs/'):
                en_files.append(file)
            elif file.startswith('i18n/it/docusaurus-plugin-content-docs/current/'):
                it_files.append(file)
                
        return en_files, it_files

    def get_file_content(self, file_path: str) -> str:
        """Get content of a file"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                return f.read()
        except FileNotFoundError:
            return ""

    def get_file_diff(self, file_path: str) -> str:
        """Get git diff for a specific file"""
        try:
            result = subprocess.run(
                ['git', 'diff', 'origin/main...HEAD', '--', file_path],
                capture_output=True, text=True, check=True
            )
            return result.stdout
        except subprocess.CalledProcessError:
            return ""

    def map_file_paths(self, en_file: str) -> str:
        """Map English file path to Italian equivalent"""
        # Remove 'docs/' prefix and add Italian path
        relative_path = en_file[5:]  # Remove 'docs/'
        return f"i18n/it/docusaurus-plugin-content-docs/current/{relative_path}"

    def map_it_to_en_path(self, it_file: str) -> str:
        """Map Italian file path to English equivalent"""
        # Remove Italian path prefix and add 'docs/'
        relative_path = it_file[len('i18n/it/docusaurus-plugin-content-docs/current/'):]
        return f"docs/{relative_path}"

    def analyze_changes_with_ai(self, file_path: str, diff_content: str, source_lang: str, target_lang: str) -> Optional[str]:
        """Use GitHub Models to analyze changes and generate translation"""
        
        prompt = f"""You are a documentation translation agent for NethVoice, an open source PBX system.

TASK: Analyze the git diff below and provide ONLY the translation of the NEW/MODIFIED content.

SOURCE LANGUAGE: {source_lang}
TARGET LANGUAGE: {target_lang}
FILE: {file_path}

GIT DIFF:
```
{diff_content}
```

INSTRUCTIONS:
1. Identify what content was ADDED or MODIFIED (lines starting with +)
2. Extract ONLY the new/modified markdown content (ignore git diff syntax)
3. Translate the content to {target_lang}
4. Maintain all markdown formatting, links, and IDs exactly as they are
5. Keep technical terms consistent (NethVoice, NethServer, etc.)
6. For Italian: use formal tone, keep button labels in **bold**, code in `backticks`

IMPORTANT FORMATTING RULES:
- Keep heading IDs unchanged: ## Section Title {{#section-id}}
- Keep email links: [email@domain.com](mailto:email@domain.com)
- Keep internal links: [text](relative/path.md)
- Bold for UI elements: **Install**, **Configure**
- Backticks for code/values: `Nethesis,1234`

OUTPUT FORMAT:
Return ONLY the translated markdown content that should be added/modified, without any explanations or git diff syntax.
"""

        try:
            headers = {
                "Authorization": f"Bearer {self.github_token}",
                "Accept": "application/vnd.github+json",
                "Content-Type": "application/json"
            }
            
            payload = {
                "messages": [
                    {
                        "role": "system", 
                        "content": "You are an expert technical documentation translator specializing in telecommunications and PBX systems."
                    },
                    {
                        "role": "user", 
                        "content": prompt
                    }
                ],
                "model": "openai/gpt-5-mini",
                "temperature": 1
            }
            
            response = requests.post(
                self.models_api_url,
                headers=headers,
                json=payload,
                timeout=30
            )
            
            if response.status_code == 200:
                result = response.json()
                return result["choices"][0]["message"]["content"].strip()
            else:
                print(f"GitHub Models API error: {response.status_code} - {response.text}")
                return None
                
        except Exception as e:
            print(f"Error with GitHub Models translation: {e}")
            return None

    def apply_translation_to_file(self, target_file: str, original_content: str, translated_content: str, diff_content: str):
        """Apply translated content to target file"""
        
        # Create target directory if it doesn't exist
        target_path = Path(target_file)
        target_path.parent.mkdir(parents=True, exist_ok=True)
        
        # If target file doesn't exist, create it with translated content
        if not target_path.exists():
            with open(target_path, 'w', encoding='utf-8') as f:
                f.write(translated_content)
            print(f"Created new file: {target_file}")
            return
        
        # Read current target file content
        with open(target_path, 'r', encoding='utf-8') as f:
            current_content = f.read()
        
        # For now, append the translated content at the end
        # In a more sophisticated version, we could try to match sections
        if translated_content and translated_content not in current_content:
            # Try to find a good insertion point or append at the end
            updated_content = current_content.rstrip() + '\n\n' + translated_content
            
            with open(target_path, 'w', encoding='utf-8') as f:
                f.write(updated_content)
            print(f"Updated file: {target_file}")

    def sync_translation(self, source_file: str, target_file: str, source_lang: str, target_lang: str):
        """Sync translation from source to target file"""
        
        # Get the diff for source file
        diff_content = self.get_file_diff(source_file)
        if not diff_content:
            print(f"No changes detected in {source_file}")
            return
        
        print(f"Processing changes in {source_file}")
        print(f"Diff content preview: {diff_content[:200]}...")
        
        # Get AI translation
        translated_content = self.analyze_changes_with_ai(
            source_file, diff_content, source_lang, target_lang
        )
        
        if not translated_content:
            print(f"Could not generate translation for {source_file}")
            return
        
        print(f"Generated translation: {translated_content[:200]}...")
        
        # Get original content for context
        original_content = self.get_file_content(source_file)
        
        # Apply translation
        self.apply_translation_to_file(target_file, original_content, translated_content, diff_content)

    def run(self, specific_file: str = None):
        """Main execution method"""
        print("🤖 Starting Documentation Translation Sync Agent (GitHub Models)")
        
        # Check if GitHub token is available
        if not self.github_token:
            print("❌ GITHUB_TOKEN not found. Cannot access GitHub Models API.")
            return
        
        # Get changed files (either specific file or all changed files)
        if specific_file:
            changed_files = [specific_file] if specific_file.endswith(('.md', '.mdx')) else []
            print(f"📝 Processing specific file: {specific_file}")
        else:
            changed_files = self.get_changed_files()
            if not changed_files:
                print("✅ No documentation files changed")
                return
            print(f"📝 Found {len(changed_files)} changed files:")
            for f in changed_files:
                print(f"  - {f}")
        
        if not changed_files:
            print("✅ No relevant files to process")
            return
        
        # Categorize files
        en_files, it_files = self.categorize_files(changed_files)
        
        # Process English to Italian translations
        for en_file in en_files:
            it_file = self.map_file_paths(en_file)
            print(f"\n🔄 EN → IT: {en_file} → {it_file}")
            self.sync_translation(en_file, it_file, "English", "Italian")
        
        # Process Italian to English translations
        for it_file in it_files:
            en_file = self.map_it_to_en_path(it_file)
            print(f"\n🔄 IT → EN: {it_file} → {en_file}")
            self.sync_translation(it_file, en_file, "Italian", "English")
        
        print("\n✅ Translation sync completed!")

if __name__ == "__main__":
    import sys
    
    agent = DocumentationSyncAgent()
    
    # Check if a specific file was passed as argument
    specific_file = sys.argv[1] if len(sys.argv) > 1 else None
    agent.run(specific_file)