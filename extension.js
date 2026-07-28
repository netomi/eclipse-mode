const vscode = require('vscode');

const TITLE_KEY = 'eclipseMode.previousWindowTitle';
const COLORS_KEY = 'eclipseMode.previousColorCustomizations';
const JOKE_TITLE = '☕ Eclipse IDE 2026 — ${activeEditorShort}${separator}${rootName}';
const ECLIPSE_COLORS = {
  'titleBar.activeBackground': '#3f6ea5',
  'titleBar.activeForeground': '#ffffff',
  'titleBar.inactiveBackground': '#2c4d75',
  'statusBar.background': '#3f6ea5',
  'statusBar.foreground': '#ffffff'
};

const ABOUT_LINES = [
  'Eclipse IDE 2026 — Window > Preferences is that way. Somewhere. Nested three dialogs deep.',
  'Workspace has been reticulated. Please allow up to 45 seconds for the perspective to switch.',
  'Fun fact: you can still find the "Restore Original Branding" command if the nostalgia wears off.'
];

// deactivate() has no arguments in the VS Code API, so activate() stashes the
// context here to give the shutdown-time restore something to read from.
let extensionContext;

function restoreBranding(context) {
  const windowConfig = vscode.workspace.getConfiguration('window');
  const restoreTitle = windowConfig.update(
    'title',
    context.globalState.get(TITLE_KEY),
    vscode.ConfigurationTarget.Global
  );

  const workbenchConfig = vscode.workspace.getConfiguration('workbench');
  const restoreColors = workbenchConfig.update(
    'colorCustomizations',
    context.globalState.get(COLORS_KEY),
    vscode.ConfigurationTarget.Global
  );

  return Promise.all([restoreTitle, restoreColors]);
}

function activate(context) {
  extensionContext = context;

  const windowConfig = vscode.workspace.getConfiguration('window');
  if (context.globalState.get(TITLE_KEY) === undefined) {
    context.globalState.update(TITLE_KEY, windowConfig.get('title'));
  }
  windowConfig.update('title', JOKE_TITLE, vscode.ConfigurationTarget.Global);

  const workbenchConfig = vscode.workspace.getConfiguration('workbench');
  if (context.globalState.get(COLORS_KEY) === undefined) {
    context.globalState.update(COLORS_KEY, workbenchConfig.get('colorCustomizations'));
  }
  const previousColors = context.globalState.get(COLORS_KEY) || {};
  workbenchConfig.update(
    'colorCustomizations',
    { ...previousColors, ...ECLIPSE_COLORS },
    vscode.ConfigurationTarget.Global
  );

  const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  statusBarItem.text = '$(coffee) Eclipse Mode: ON';
  statusBarItem.tooltip = 'Click to relive 2005. This editor identifies as Eclipse IDE now.';
  statusBarItem.command = 'eclipseMode.showAbout';
  statusBarItem.show();
  context.subscriptions.push(statusBarItem);

  context.subscriptions.push(
    vscode.commands.registerCommand('eclipseMode.showAbout', () => {
      const line = ABOUT_LINES[Math.floor(Math.random() * ABOUT_LINES.length)];
      vscode.window.showInformationMessage(line);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('eclipseMode.restore', async () => {
      await restoreBranding(context);
      statusBarItem.hide();
      vscode.window.showInformationMessage('Eclipse Mode disabled. Welcome back to whatever you were running before.');
    })
  );

  setTimeout(() => {
    vscode.window.showInformationMessage(
      'Reticulating splines… You are now running Eclipse IDE 2026. Please restart your muscle memory.'
    );
  }, 1500);
}

function deactivate() {
  // Best-effort only: this runs when the editor disables/uninstalls the
  // extension while itself running. There is no VS Code API hook for the
  // case where the extension folder is deleted while the editor is closed,
  // so that path still leaves the branding in place.
  if (extensionContext) {
    return restoreBranding(extensionContext);
  }
}

module.exports = { activate, deactivate };
