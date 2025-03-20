# AutoFolder

**AutoFolder** is an open-source Visual Studio Code extension that automates creating complex folder structures from a single Markdown file. It's perfect for quickly scaffolding out frontends, backends, or any other project layout with just a few clicks.

## Features

1. **Simple One-Click Setup**  
   A single command creates a template file, and CodeLens actions let you generate your entire project structure instantly.

2. **Minimal Interface**  
   Only one command appears in the Command Palette:  
   **AutoFolder: Create Folder Structure**  
   This command creates (or overwrites) a `folder-structure.md` file in your workspace.

3. **Intuitive Inline Actions**  
   - **Accept Folder Structure** – Reads the file and creates all folders and files.  
   - **Reject Folder Structure** – Cancels the operation.

4. **Straightforward Path Format**  
   - Each line in `folder-structure.md` represents either a folder or file.  
   - **Folders** end with a trailing slash (`/`).  
   - **Files** do not have a trailing slash.  
   - Empty files and directories are created automatically.

## Installation

Install **AutoFolder** directly from the **Visual Studio Code Marketplace**:

1. Open the **Extensions** view (Ctrl+Shift+X or Cmd+Shift+X).
2. Search for **"AutoFolder"**.
3. Click **Install**.
4. Reload or restart VS Code if prompted.

## Usage

1. **Open** a folder in VS Code as your workspace.
2. **Open Command Palette** (Ctrl+Shift+P on Windows/Linux, Cmd+Shift+P on macOS).
3. **Run** the command: **AutoFolder: Create Folder Structure**.
   - A `folder-structure.md` file will be created in your workspace root.
   - The file will open automatically in your editor.
4. **Edit** the file to define your project structure:
   - Add folders (with trailing slash `/`)
   - Add files (without trailing slash)
   - Lines starting with `#` are ignored
5. **Click** the **Accept Folder Structure** CodeLens action at the top of the file.
6. All folders and files will be created according to your specification.

## Example

Here's an example of what `folder-structure.md` might look like:

```markdown
# Define Your Folder Structure

frontend/
frontend/public/
frontend/public/assets/
frontend/pages/
frontend/pages/index.tsx
frontend/components/
frontend/components/Header.tsx
frontend/components/Footer.tsx
frontend/package.json
frontend/tsconfig.json
frontend/.env
frontend/README.md
```

Click "Accept Folder Structure" to generate these folders and files in your workspace.

## Generate Structures with AI

You can use AI assistants to help generate complex folder structures. Copy the prompt below and paste it to your preferred AI assistant:

```
Create a folder structure for a [YOUR PROJECT TYPE] project with the following requirements:
[YOUR REQUIREMENTS]

Format the structure with the following rules:
- Folders must end with a trailing slash (/)
- Files must not have a trailing slash
- Each path should be on a new line
- Include common configuration files

Example format:
src/
src/components/
src/components/Button.js
src/pages/
src/pages/Home.js
config.json
```

## Keyboard Shortcuts

For even faster workflow, consider adding a keyboard shortcut in VS Code:

1. Open the **Keyboard Shortcuts** editor (File > Preferences > Keyboard Shortcuts)
2. Search for "AutoFolder: Create Folder Structure"
3. Click the plus icon to add your preferred shortcut

## Contributing

Contributions are welcome! Feel free to submit issues or pull requests on the GitHub repository.

## License

This extension is released under the MIT License.
