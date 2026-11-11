# Dash and Tasks in panel

A GNOME Shell extension that puts the dash and a taskbar in the top panel, so you can launch and switch apps without opening the overview.

Supports GNOME Shell 50 and 51.

## Features

Every feature can be turned off in the settings. Turned-off features are not loaded.

### Dash

- Favorite and running apps, the same as the overview's dash.
- Clicking the app that has focus minimizes its window. Middle click or Ctrl+click opens a new window.
- Optional app grid button.
- Left, center or right alignment.
- Adjustable icon size, spacing and separator.
- Running indicator in the accent color or a custom color, with adjustable width, thickness and position.

### Tasks

- One button per window, showing its icon, title, app name or any combination of them.
- Click to focus a window, or click again to minimize it.
- Hover to raise the window for a quick look.
- Right click for the app menu.
- Middle click opens a new window, or closes this one if you choose that setting.
- Optional grouping by app, so each app shows only its top window.
- Windows asking for attention turn red, even on other workspaces.
- Shows only the current workspace's windows, or all of them.
- Shows the real icons of Chrome and Chromium web apps.
- Left, center or right alignment.

### Panel

- Light style for the shell, following the system's light/dark setting.
- Accent color or custom color for the panel background.
- Moves the clock to the right.
- Scroll on the panel to switch workspaces.
- A panel with tasks on every monitor. Each task follows its window to that window's monitor.

### Indicators

- Workspaces bar, with +/- buttons when the number of workspaces is fixed.
- Favorites menu and recent apps menu.
- Show desktop button.
- Your user name.

## Using it with other extensions

- **Panel at the bottom** (e.g. with Just Perfection): turn on "Show dash hover labels above the icons". Panels on other monitors follow the main panel's position and height.
- **Clock position:** "Move the clock to the right" does nothing if another extension has already moved the clock.

## Install

From source:

```sh
git clone https://github.com/mikebrucker/dash-tasks-panel.git \
  ~/.local/share/gnome-shell/extensions/dash-tasks-panel@mikebrucker
```

Log out and back in, then turn it on:

```sh
gnome-extensions enable dash-tasks-panel@mikebrucker
```

Open the settings with `gnome-extensions prefs dash-tasks-panel@mikebrucker` or from the Extensions app.

## Credits

- Forked from [Tasks in panel](https://github.com/fthx/tasks-in-panel) by fthx.
- The dash is based on Dash in panel by fthx.
- Light style mode comes from fmuellner's GNOME extension.

## License

GPL-3.0. See [LICENSE](LICENSE).
