//    Forked from https://github.com/fthx/tasks-in-panel
//    Modified by @mikebrucker 2026

import Gio from "gi://Gio";
import Gdk from "gi://Gdk";
import Gtk from "gi://Gtk";
import Adw from "gi://Adw";

import { ExtensionPreferences } from "resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js";

export default class TasksInPanelPreferences extends ExtensionPreferences {
  fillPreferencesWindow(window) {
    const settings = this.getSettings();

    window.add(this._buildPanelPage(settings));
    window.add(this._buildIndicatorsPage(settings));
    window.add(this._buildDashPage(settings));
    window.add(this._buildTasksPage(settings));
  }

  _addSwitchRow(group, settings, key, title, subtitle) {
    const row = new Adw.SwitchRow({ title, subtitle: subtitle ?? "" });
    group.add(row);
    settings.bind(key, row, "active", Gio.SettingsBindFlags.DEFAULT);
    return row;
  }

  _addAlignRow(group, settings, key, title, subtitle) {
    const values = ["left", "center", "right"];
    const row = new Adw.ComboRow({
      title,
      subtitle: subtitle ?? "",
      model: Gtk.StringList.new(["Left", "Center", "Right"]),
      selected: Math.max(0, values.indexOf(settings.get_string(key))),
    });
    group.add(row);
    row.connect("notify::selected", () => settings.set_string(key, values[row.selected]));
    return row;
  }

  _addSpinRow(group, settings, key, title, adjustment, subtitle) {
    const row = new Adw.SpinRow({ title, subtitle: subtitle ?? "", adjustment });
    group.add(row);
    settings.bind(key, row, "value", Gio.SettingsBindFlags.DEFAULT);
    return row;
  }

  _buildColorRow(settings, key, useKey, title, subtitle) {
    const row = new Adw.ActionRow({ title, subtitle: subtitle ?? "" });

    const colorButton = new Gtk.ColorDialogButton({
      valign: Gtk.Align.CENTER,
      dialog: new Gtk.ColorDialog({ with_alpha: true }),
    });

    const rgba = new Gdk.RGBA();
    rgba.parse(settings.get_string(key));
    colorButton.rgba = rgba;

    colorButton.connect("notify::rgba", () => {
      settings.set_string(key, colorButton.rgba.to_string());
      settings.set_boolean(useKey, true); // picking a color means using it
    });

    row.add_suffix(colorButton);
    row.activatable_widget = colorButton;

    return row;
  }

  // turning either key on turns the other off
  _makeExclusive(settings, keyA, keyB) {
    settings.connect(`changed::${keyA}`, () => {
      if (settings.get_boolean(keyA)) settings.set_boolean(keyB, false);
    });
    settings.connect(`changed::${keyB}`, () => {
      if (settings.get_boolean(keyB)) settings.set_boolean(keyA, false);
    });
  }

  _buildPanelPage(settings) {
    const page = new Adw.PreferencesPage({
      title: "Panel",
      icon_name: "emblem-system-symbolic",
    });

    const group = new Adw.PreferencesGroup();
    page.add(group);

    this._addSwitchRow(
      group,
      settings,
      "light-style",
      "Light style mode",
      "GNOME Shell follows the system dark/light setting.",
    );
    this._addSwitchRow(group, settings, "yaru-panel", "Use normal font weight in the panel");
    this._addSwitchRow(
      group,
      settings,
      "accent-panel",
      "Use accent color",
      "Panel background uses the GNOME accent color.",
    );
    this._addSwitchRow(
      group,
      settings,
      "use-background-color",
      "Use custom background color",
      "Panel background uses the custom color.",
    );

    group.add(
      this._buildColorRow(
        settings,
        "background-color",
        "use-background-color",
        "Custom background color",
        "Dark/light setting does not affect this color.",
      ),
    );

    this._makeExclusive(settings, "accent-panel", "use-background-color");

    this._addSwitchRow(
      group,
      settings,
      "move-date",
      "Move the clock to the right",
      "Skipped if another extension already moved it.",
    );
    this._addSwitchRow(group, settings, "scroll-panel", "Scroll on the panel to switch workspace");
    this._addSwitchRow(
      group,
      settings,
      "multi-monitor",
      "Multi-monitor support",
      "A task panel on each secondary monitor.\nTasks follow their window's monitor.",
    );

    return page;
  }

  _buildIndicatorsPage(settings) {
    const page = new Adw.PreferencesPage({
      title: "Indicators",
      icon_name: "focus-top-bar-symbolic",
    });

    const group = new Adw.PreferencesGroup();
    page.add(group);

    this._addSwitchRow(group, settings, "show-user-id", "Show user name");
    this._addSwitchRow(
      group,
      settings,
      "show-show-desktop",
      "Show desktop button",
      "Minimizes all windows when at least one is visible.\nRestores all windows when they are all minimized.",
    );
    this._addSwitchRow(group, settings, "show-workspaces-bar", "Show workspaces bar");
    this._addSwitchRow(
      group,
      settings,
      "show-plus-minus",
      "Show +/- to add/remove workspace",
      "Hidden when GNOME's dynamic workspaces option is active.\nMinus removes the active workspace.",
    );
    this._addSwitchRow(group, settings, "show-favorites-menu", "Show favorites menu button");
    this._addSwitchRow(group, settings, "show-recent-apps-menu", "Show recent applications menu button");

    this._addSpinRow(
      group,
      settings,
      "recent-apps-list-length",
      "Maximum number of recent applications",
      new Gtk.Adjustment({ lower: 1, upper: 20, step_increment: 1 }),
    );

    return page;
  }

  _buildDashPage(settings) {
    const page = new Adw.PreferencesPage({
      title: "Dash",
      icon_name: "view-app-grid-symbolic",
    });

    const group = new Adw.PreferencesGroup();
    page.add(group);

    this._addSwitchRow(group, settings, "show-dash", "Show dash");
    this._addAlignRow(group, settings, "dash-align", "Dash alignment", "Dash is aligned to the left by default.");
    this._addSwitchRow(group, settings, "show-app-grid-button", "Show app grid button in the dash");
    this._addSwitchRow(
      group,
      settings,
      "dash-labels-above",
      "Show dash hover labels above the icons",
      "Turn this on if the panel is moved to the bottom.",
    );

    this._addSpinRow(
      group,
      settings,
      "dash-icon-size",
      "Dash icon size (px)",
      new Gtk.Adjustment({ lower: 12, upper: 48, step_increment: 1 }),
    );

    this._addSpinRow(
      group,
      settings,
      "dash-icon-margin",
      "Dash app button horizontal margin (px)",
      new Gtk.Adjustment({ lower: 0, upper: 20, step_increment: 1 }),
    );

    this._addSwitchRow(group, settings, "show-dash-separator", "Show dash separator");
    const separatorMarginRow = this._addSpinRow(
      group,
      settings,
      "dash-separator-margin",
      "Dash separator margin (px)",
      new Gtk.Adjustment({ lower: 0, upper: 16, step_increment: 1 }),
    );
    separatorMarginRow.snap_to_ticks = true;

    this._addSwitchRow(group, settings, "dash-indicator-accent", "Running indicator uses the accent color");
    this._addSwitchRow(group, settings, "dash-indicator-use-color", "Use custom running indicator color");
    group.add(
      this._buildColorRow(
        settings,
        "dash-indicator-color",
        "dash-indicator-use-color",
        "Custom running indicator color",
      ),
    );
    this._makeExclusive(settings, "dash-indicator-accent", "dash-indicator-use-color");
    this._addSpinRow(
      group,
      settings,
      "dash-indicator-width",
      "Running indicator width (px)",
      new Gtk.Adjustment({ lower: 1, upper: 48, step_increment: 1 }),
    );
    this._addSpinRow(
      group,
      settings,
      "dash-indicator-thickness",
      "Running indicator thickness (px)",
      new Gtk.Adjustment({ lower: 1, upper: 12, step_increment: 1 }),
    );
    this._addSpinRow(
      group,
      settings,
      "dash-indicator-offset-y",
      "Running indicator vertical offset (px)",
      new Gtk.Adjustment({ lower: -12, upper: 16, step_increment: 1 }),
      "Negative values will move the indicator below the panel making them disappear.",
    );

    return page;
  }

  _buildTasksPage(settings) {
    const page = new Adw.PreferencesPage({
      title: "Tasks",
      icon_name: "focus-windows-symbolic",
    });

    const group = new Adw.PreferencesGroup();
    page.add(group);

    this._addSwitchRow(group, settings, "show-tasks", "Show tasks");
    this._addAlignRow(group, settings, "tasks-align", "Tasks alignment", "Tasks are aligned to the left by default.");
    this._addSwitchRow(group, settings, "show-window-icon", "Show window icon");

    this._addSpinRow(
      group,
      settings,
      "task-icon-size",
      "Window icon size (px)",
      new Gtk.Adjustment({ lower: 12, upper: 48, step_increment: 1 }),
    );

    this._addSwitchRow(group, settings, "show-window-title", "Show window title");
    this._addSwitchRow(group, settings, "show-window-app", "Show application name");
    this._addSwitchRow(
      group,
      settings,
      "force-bold-tasks",
      "Force bold font weight in tasks",
      "Overrides the panel's normal font weight option.",
    );
    this._addSwitchRow(group, settings, "show-active-workspace", "Show on active workspace only");
    this._addSwitchRow(
      group,
      settings,
      "show-focused-window",
      "Show focused window only",
      "Left-click opens the app menu instead of toggling the window.",
    );
    this._addSwitchRow(
      group,
      settings,
      "group-windows",
      "Group by app",
      "Only the topmost window of each app is shown.\nOther windows are available from the app menu.",
    );
    this._addSwitchRow(
      group,
      settings,
      "middle-click-close",
      "Close window on middle-click",
      "Replaces opening a new application window.",
    );
    this._addSwitchRow(group, settings, "hover-raise-window", "Raise window on hover");

    this._addSpinRow(
      group,
      settings,
      "hover-delay",
      "Hover delay before raising window (ms)",
      new Gtk.Adjustment({ lower: 0, upper: 1000, step_increment: 50 }),
    );

    this._addSwitchRow(
      group,
      settings,
      "undecorated-task-buttons",
      "Undecorated buttons",
      "Unfocused buttons are dimmed.",
    );
    this._addSwitchRow(group, settings, "desaturate-icon", "Monochrome icon", "Some apps do have a symbolic icon.");

    this._addSpinRow(
      group,
      settings,
      "button-width",
      "Task button natural width (px)",
      new Gtk.Adjustment({ lower: -1, upper: 999, step_increment: 10 }),
      "Reduced if the available width is insufficient.\nSet to -1 to fit content.",
    );

    this._addSwitchRow(group, settings, "animate-on-close", "Animate on close");

    return page;
  }
}
