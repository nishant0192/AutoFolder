import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Splits the input text into an array of paths, ignoring empty lines.
 * If a line ends with '/', it's treated as a folder; otherwise, a file.
 */
function parseSimplePaths(input: string): string[] {
  return input
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line.length > 0);
}

/**
 * Given a list of paths, creates folders/files on disk.
 */
function createPaths(basePath: string, paths: string[]) {
  for (const relPath of paths) {
    const fullPath = path.join(basePath, relPath);

    // If it ends with '/', treat as a folder
    if (relPath.endsWith('/')) {
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
      }
    } else {
      // It's a file
      const dirPath = path.dirname(fullPath);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
      if (!fs.existsSync(fullPath)) {
        fs.writeFileSync(fullPath, '', 'utf8');
      }
    }
  }
}

/**
 * Command #1 (visible in the Command Palette): Create Folder Structure
 * - Creates or opens "folder-structure.md" with sample content.
 * - Shows CodeLens at the top (Accept / Reject).
 */
async function createFolderStructure() {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders || workspaceFolders.length === 0) {
    vscode.window.showErrorMessage('No workspace folder open.');
    return;
  }

  const workspacePath = workspaceFolders[0].uri.fsPath;
  const filePath = path.join(workspacePath, 'folder-structure.md');

  const content = `# Define Your Folder Structure

Edit the lines below. Folders end with '/', files do not. One path per line.
(Use the CodeLens above to Accept or Reject.)

\`\`\`
frontend/
frontend/public/
frontend/public/assets/
frontend/public/images/
frontend/public/fonts/
frontend/pages/
frontend/pages/api/
frontend/pages/index.tsx
frontend/pages/login.tsx
frontend/pages/dashboard.tsx
frontend/pages/tasks.tsx
frontend/pages/team.tsx
frontend/components/
frontend/components/Header.tsx
frontend/components/Footer.tsx
frontend/components/TaskCard.tsx
frontend/components/TeamMemberCard.tsx
frontend/hooks/
frontend/hooks/useAuth.ts
frontend/hooks/useTasks.ts
frontend/hooks/useTeam.ts
frontend/styles/
frontend/styles/global.css
frontend/styles/Home.module.css
frontend/styles/Tasks.module.css
frontend/utils/
frontend/utils/api.ts
frontend/utils/logger.ts
frontend/context/
frontend/context/AuthContext.tsx
frontend/context/TaskContext.tsx
frontend/context/TeamContext.tsx
frontend/types/
frontend/types/task.ts
frontend/types/user.ts
frontend/types/team.ts
frontend/next.config.js
frontend/package.json
frontend/tsconfig.json
frontend/.env
frontend/README.md
\`\`\`
`;

  fs.writeFileSync(filePath, content, 'utf8');

  const doc = await vscode.workspace.openTextDocument(filePath);
  await vscode.window.showTextDocument(doc);
}

/**
 * Hidden command: Accepts the folder structure in "folder-structure.md"
 * (reads lines, creates folders/files). Not shown in Command Palette.
 */
async function acceptStructure() {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders || workspaceFolders.length === 0) {
    vscode.window.showErrorMessage('No workspace folder open.');
    return;
  }

  const workspacePath = workspaceFolders[0].uri.fsPath;
  const filePath = path.join(workspacePath, 'folder-structure.md');

  if (!fs.existsSync(filePath)) {
    vscode.window.showErrorMessage('folder-structure.md not found in workspace.');
    return;
  }

  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const lines = parseSimplePaths(fileContent);
    createPaths(workspacePath, lines);
    vscode.window.showInformationMessage('Folder structure created successfully!');
  } catch (error) {
    vscode.window.showErrorMessage(`Error creating folder structure: ${error}`);
  }
}

/**
 * Hidden command: Reject the folder structure creation. Not shown in Command Palette.
 */
function rejectStructure() {
  vscode.window.showInformationMessage('Folder structure creation canceled.');
}

/**
 * A CodeLensProvider that places "Accept" / "Reject" codelenses at line 0
 * for the file named "folder-structure.md".
 */
class FolderStructureCodeLensProvider implements vscode.CodeLensProvider {
  public provideCodeLenses(document: vscode.TextDocument): vscode.CodeLens[] {
    const fileName = path.basename(document.fileName);
    if (fileName !== 'folder-structure.md') {
      return [];
    }

    // Always place CodeLens on line 0
    const topOfFile = new vscode.Range(0, 0, 0, 0);

    // Lens #1: Accept
    const acceptLens = new vscode.CodeLens(topOfFile, {
      title: 'Accept Folder Structure',
      command: 'autofolder.acceptStructure',
      tooltip: 'Parse this file and create the folders/files.'
    });

    // Lens #2: Reject
    const rejectLens = new vscode.CodeLens(topOfFile, {
      title: 'Reject Folder Structure',
      command: 'autofolder.rejectStructure',
      tooltip: 'Cancel folder structure creation.'
    });

    return [acceptLens, rejectLens];
  }
}

/**
 * Extension activation
 */
export function activate(context: vscode.ExtensionContext) {
  // Register the single visible command
  const createDisposable = vscode.commands.registerCommand('autofolder.createFolderStructure', createFolderStructure);
  context.subscriptions.push(createDisposable);

  // Register the hidden commands (no package.json entry => no Command Palette item)
  const acceptDisposable = vscode.commands.registerCommand('autofolder.acceptStructure', acceptStructure);
  context.subscriptions.push(acceptDisposable);

  const rejectDisposable = vscode.commands.registerCommand('autofolder.rejectStructure', rejectStructure);
  context.subscriptions.push(rejectDisposable);

  // Register the CodeLens provider
  const codeLensProvider = new FolderStructureCodeLensProvider();
  const codeLensSelector: vscode.DocumentSelector = { pattern: '**/folder-structure.md' };
  const codeLensRegistration = vscode.languages.registerCodeLensProvider(codeLensSelector, codeLensProvider);
  context.subscriptions.push(codeLensRegistration);
}

/**
 * Extension deactivation
 */
export function deactivate() {}
