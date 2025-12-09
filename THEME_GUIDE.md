# Theme System Guide

## How Components Automatically Change Colors Based on Theme

Components automatically adapt to the theme when they use **CSS variables** instead of hardcoded colors.

### How It Works

1. **CSS Variables are defined** in `osu-theme.css` (light theme) and `osu-theme-dark.css` (dark theme)
2. **The `dark-theme` class** is added/removed from the `<html>` element when the theme changes
3. **CSS variables automatically switch** based on which theme is active
4. **Components using CSS variables** automatically get the correct colors

### Step 1: Use CSS Variables in Your Component CSS

Instead of hardcoded colors:
```css
/* ❌ BAD - Hardcoded colors don't change with theme */
.my-component {
    background: #ffffff;
    color: #000000;
    border: 1px solid #ddd;
}
```

Use CSS variables:
```css
/* ✅ GOOD - CSS variables automatically change with theme */
.my-component {
    background: var(--osu-surface);
    color: var(--osu-text-main);
    border: 1px solid var(--osu-border-soft);
}
```

### Step 2: Available CSS Variables

Here are the main CSS variables you can use:

#### Background Colors
- `var(--osu-bg)` - Main background
- `var(--osu-surface)` - Card/surface background
- `var(--osu-card-bg)` - Card background (dark theme specific)
- `var(--osu-input-bg)` - Input field background

#### Text Colors
- `var(--osu-text-main)` - Main text color
- `var(--osu-muted)` - Muted/secondary text

#### Border Colors
- `var(--osu-border-soft)` - Soft borders
- `var(--osu-card-border)` - Card borders
- `var(--osu-input-border)` - Input borders

#### Accent Colors (Grey)
- `var(--accent-blue)` - Main accent (#6b7280)
- `var(--accent-blue-light)` - Light accent (#9ca3af)
- `var(--accent-blue-dark)` - Dark accent (#4b5563)
- `var(--accent-blue-alpha-12)` - Accent with 12% opacity
- `var(--accent-blue-alpha-20)` - Accent with 20% opacity

#### Brand Colors
- `var(--osu-orange)` - OSU orange (#D73F09)
- `var(--osu-orange-bright)` - Bright orange (#FF6A00)
- `var(--osu-black)` - Black (#000000)

### Step 3: Example Component Update

**Before (hardcoded colors):**
```css
.ai-prompt-field {
    border: 2px solid #ddd;
    background-color: #ffffff;
    color: #000000;
}

.ai-prompt-field:focus {
    border-color: #007bff;
}
```

**After (CSS variables):**
```css
.ai-prompt-field {
    border: 2px solid var(--osu-input-border);
    background-color: var(--osu-input-bg);
    color: var(--osu-text-main);
}

.ai-prompt-field:focus {
    border-color: var(--accent-blue);
    outline: 2px solid var(--accent-blue);
}
```

### Step 4: Dark Theme Specific Overrides

If you need theme-specific styles, you can add overrides:

```css
/* Base styles */
.my-component {
    background: var(--osu-surface);
    color: var(--osu-text-main);
}

/* Dark theme specific override (if needed) */
html.dark-theme .my-component {
    /* Additional dark theme styles */
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}
```

### Best Practices

1. **Always use CSS variables** for colors that should change with theme
2. **Use existing OSU theme classes** when possible (e.g., `osu-card`, `osu-card-title`)
3. **Only add dark theme overrides** if absolutely necessary
4. **Test both themes** to ensure colors work correctly

### Quick Reference: Component CSS Template

```css
.my-component {
    /* Use CSS variables for all colors */
    background: var(--osu-surface);
    color: var(--osu-text-main);
    border: 1px solid var(--osu-border-soft);
    padding: 1rem;
    border-radius: 8px;
}

.my-component-title {
    color: var(--osu-text-main);
    font-weight: 600;
}

.my-component-subtitle {
    color: var(--osu-muted);
    font-size: 0.9rem;
}

.my-component-button {
    background: var(--osu-orange);
    color: #fff;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
}
```

