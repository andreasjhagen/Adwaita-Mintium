# Mint-Y Dark Theme - Modular Structure

## Overview

The Mint-Y Dark theme has been refactored into a modular structure for easier maintenance and customization. Instead of one monolithic 4000+ line CSS file, the theme is now organized into logical, focused modules.

## Directory Structure

```
gtk-3.0/
├── gtk-dark.css                 # Original monolithic file (backup)
├── gtk-dark.css.backup          # Additional backup
├── gtk-dark-modular.css         # New modular main file
├── extract_modules.sh           # Script used to extract modules
└── modules/                     # Modular CSS files
    ├── _colors.css              # Color definitions and variables
    ├── _base.css                # Global base styles
    ├── _animations.css          # Keyframe animations
    ├── _osd.css                 # On-Screen Display styles
    ├── _selection.css           # Selection and highlight styles
    ├── _labels.css              # Label text styles
    ├── _views.css               # Text views and icon views
    ├── _entries.css             # Text entry fields
    ├── _buttons.css             # All button variants
    ├── _switches.css            # Toggle switches
    ├── _checkradio.css          # Checkboxes and radio buttons
    ├── _scales.css              # Scales and sliders
    ├── _progressbars.css        # Progress and level bars
    ├── _toolbars.css            # Toolbars and action bars
    ├── _headerbar.css           # Header bars and title bars
    ├── _menus.css               # Menus and menu items
    ├── _popovers.css            # Popovers and popups
    ├── _notebooks.css           # Notebooks and tabs
    ├── _frames.css              # Frames and scrolled windows
    ├── _sidebars.css            # Sidebars and side panels
    ├── _lists.css               # Lists and list rows
    ├── _treeviews.css           # Tree view widgets
    ├── _scrollbars.css          # Scrollbar styling
    ├── _infobars.css            # Info and notification bars
    ├── _dialogs.css             # Dialogs and message boxes
    ├── _misc_widgets.css        # Tooltips, calendar, etc.
    ├── _window_decorations.css  # Window decorations
    ├── _panels.css              # Desktop panel integration
    ├── _lightdm.css             # LightDM login manager
    └── _applications.css        # App-specific overrides
```

## Benefits of Modular Structure

### 1. Easy Maintenance

- **Find components quickly**: Need to change button styling? Edit `_buttons.css`
- **Isolated changes**: Modify one widget type without affecting others
- **Smaller files**: Each module is 50-300 lines instead of 4000+ lines

### 2. Better Organization

- **Logical grouping**: Related styles are together
- **Clear dependencies**: Import order shows relationships
- **Self-documenting**: Module names clearly indicate their purpose

### 3. Easier Customization

- **Theme variants**: Create color variants by swapping `_colors.css`
- **Feature toggles**: Comment out @import lines to disable features
- **Component testing**: Test individual widgets in isolation

### 4. Version Control Friendly

- **Smaller diffs**: Changes affect only relevant modules
- **Clearer history**: See exactly which components changed
- **Easier merging**: Fewer merge conflicts with focused files

### 5. Reusability

- **Share modules**: Use same modules across different theme variants
- **Mix and match**: Combine modules from different themes
- **Port easily**: Adapt individual modules to GTK4 or other toolkits

## Usage

### Using the Modular Theme

To use the modular theme, replace the original `gtk-dark.css`:

```bash
cd /home/andi/Schreibtisch/Titanite/gtk-3.0/
mv gtk-dark.css gtk-dark.css.original
mv gtk-dark-modular.css gtk-dark.css
```

Or create a symbolic link:

```bash
ln -sf gtk-dark-modular.css gtk-dark.css
```

### Customizing Colors

The easiest way to customize the theme is to edit `modules/_colors.css`:

```css
/* Change the accent color */
@define-color accent_color #YOUR_COLOR;
@define-color selected_bg_color #YOUR_COLOR;

/* Adjust text colors */
@define-color theme_fg_color rgba(255, 255, 255, 0.90);

/* Modify background colors */
@define-color theme_bg_color #YOUR_BG_COLOR;
```

### Customizing Individual Components

1. Identify the component you want to change
2. Open the relevant module file (e.g., `modules/_buttons.css`)
3. Make your changes
4. Save and test

### Disabling Features

To remove certain features, comment out their @import in `gtk-dark-modular.css`:

```css
/* Disable application-specific styles */
/* @import url("modules/_applications.css"); */
```

## Applying to Light Theme

The same modular structure can be applied to the light theme (`gtk.css`):

1. Use the same extraction script with `gtk.css` as input
2. Create a corresponding `gtk-modular.css` import file
3. Adjust color definitions in a new `_colors.css` for the light variant

## Module Details

### Core Modules (Required)

- **\_colors.css**: All color definitions. Edit this first when customizing.
- **\_base.css**: Global styles that affect everything.
- **\_animations.css**: Keyframe animations used throughout the theme.

### Widget Modules

Each widget module is self-contained and can be modified independently:

- **Input widgets**: \_entries.css, \_buttons.css, \_switches.css, \_checkradio.css
- **Selection widgets**: \_scales.css, \_lists.css, \_treeviews.css
- **Containers**: \_toolbars.css, \_headerbar.css, \_notebooks.css, \_frames.css
- **Feedback**: \_progressbars.css, \_infobars.css, \_dialogs.css

### Special Modules

- **\_osd.css**: On-screen overlays (volume, brightness, etc.)
- **\_window_decorations.css**: Window borders and titlebar buttons
- **\_panels.css**: Integration with desktop panels (MATE, XFCE, etc.)
- **\_lightdm.css**: Login screen styling
- **\_applications.css**: App-specific fixes and overrides

## Best Practices

### When Editing Modules

1. **Keep modules focused**: Each module should have a clear purpose
2. **Maintain import order**: Some modules depend on earlier ones
3. **Test thoroughly**: Changes to one module might affect others
4. **Document changes**: Add comments explaining non-obvious modifications

### When Creating Variants

1. Start with `_colors.css` - this gives the biggest impact
2. Override specific modules as needed
3. Keep the same import structure for consistency
4. Name variants clearly (e.g., `gtk-dark-blue-modular.css`)

### When Reporting Issues

1. Identify the affected component
2. Check the relevant module file
3. Test with original theme to confirm it's not a regression
4. Report the specific module file with the issue

## Maintenance

### Updating from Upstream

When Linux Mint releases theme updates:

1. Download the new `gtk-dark.css`
2. Run the extraction script: `bash extract_modules.sh`
3. Compare changes: `diff -r modules/ modules.new/`
4. Merge changes carefully, preserving your customizations

### Adding New Components

To add a new component module:

1. Create a new file in `modules/` with `_` prefix
2. Add styles for the component
3. Add @import line in `gtk-dark-modular.css` at appropriate position
4. Test the theme

## Performance

The modular structure has no negative performance impact:

- **Load time**: CSS @import statements are resolved at parse time
- **Rendering**: No difference once loaded
- **Memory**: Identical to monolithic file after parsing

## Compatibility

The modular theme is fully compatible with:

- GTK 3.22+
- All Linux Mint editions (Cinnamon, MATE, Xfce)
- Standard GTK applications
- Custom GTK themes that extend Mint-Y

## Troubleshooting

### Theme Not Loading

If the modular theme doesn't load:

1. Check file paths in @import statements
2. Ensure all module files exist in `modules/` directory
3. Check for syntax errors: `gtk-query-settings`
4. Revert to backup: `mv gtk-dark.css.backup gtk-dark.css`

### Missing Styles

If some elements appear unstyled:

1. Check if the relevant module is imported
2. Verify the module file is not empty
3. Compare with original theme using `diff`

### Import Order Issues

If widgets look wrong, the import order might be incorrect. The correct order is:

1. Colors and variables
2. Base styles
3. Simple widgets
4. Container widgets
5. Complex widgets
6. Special components
7. Application overrides

## Contributing

To contribute improvements to the modular structure:

1. Test changes thoroughly
2. Maintain the existing organization
3. Update documentation
4. Keep modules focused and logical

## License

Same as original Mint-Y theme (GPL-3.0)

## Credits

- Original Theme: Linux Mint Team
- Modularization: Created for easier maintenance and customization
- Based on: Mint-Y Dark theme

---

**Last Updated**: October 2025  
**GTK Version**: 3.0  
**Theme Version**: Modular v1.0
