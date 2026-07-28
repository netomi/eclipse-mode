# Eclipse Mode

Installs cleanly, then quietly convinces your editor it's actually Eclipse IDE.

On activation:
- Shows a "Reticulating splines… You are now running Eclipse IDE 2026" notification
- Adds a "☕ Eclipse Mode: ON" status bar item (click it for more nonsense)
- Rewrites the window title to reference Eclipse IDE
- Recolors the title bar / status bar to a classic Eclipse blue

Run **Eclipse Mode: Restore Original Branding** from the command palette to undo the title and
color changes at any time.

Disabling or uninstalling the extension *while the editor is running* also restores the original
title and colors automatically (via `deactivate()`). There is one gap that no VS Code extension
can close: if the extension's files are removed while the editor is closed (e.g. deleted from
disk, or wiped as part of a container rebuild), `deactivate()` never runs and the branding is left
in place — the command palette entry disappears with the extension, but the settings it wrote
stay put. In that case, undo it by hand:

```jsonc
// user settings.json
"window.title": undefined,               // or your previous value
"workbench.colorCustomizations": {}       // or your previous value
```

Built as a test extension for exercising the open-vsx.org publish → resolve → download → install →
activate round trip, across VS Code-compatible editors that pull from the registry (VSCodium,
Theia, Cursor, Windsurf, Gitpod, code-server, …).
