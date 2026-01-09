# Logo Setup Instructions

## Logo File Location
Place your logo image file here:
```
frontend/public/logo.png
```

## Logo Specifications
Based on your logo design:
- **Format:** PNG (with transparent background preferred)
- **Recommended size:** 200x200px to 400x400px
- **Aspect ratio:** Square (1:1)
- **Design:** ДААЦЫН ЦАМХАГ logo with buildings and orange/gold colors

## Current Status
- ✅ Logo component is ready
- ❌ `logo.png` file is missing in `frontend/public/` folder

## How to Add Logo

1. **Get your logo file:**
   - Export your logo as PNG
   - Make sure it has transparent background (if needed)
   - Recommended: 300x300px or larger

2. **Save the file:**
   - Copy your logo file
   - Paste it into: `frontend/public/logo.png`
   - Make sure the filename is exactly `logo.png` (lowercase)

3. **Verify:**
   - Restart frontend dev server if running
   - Hard refresh browser (Ctrl+Shift+R)
   - Logo should appear instead of "ДАЦ" placeholder

## Fallback
If `logo.png` doesn't exist, the component will show a styled placeholder with:
- Orange gradient background
- "ДАЦ" text in white
- Rounded corners
- Shadow effect

## Logo Usage
The logo is used in:
- Header (navigation bar)
- Footer
- Anywhere `<Logo />` component is imported
