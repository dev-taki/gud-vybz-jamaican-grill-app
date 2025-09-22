# Font System Documentation

This application uses a centralized font system with two main fonts:

## Fonts Used

### 1. Young Serif
- **Usage**: Logos and all heading tags (h1, h2, h3, h4, h5, h6)
- **Weight**: 400 (Normal)
- **Source**: Google Fonts

### 2. Bitter
- **Usage**: Paragraphs and body text
- **Weight**: 100 (Thin) for paragraphs, 300 (Light) for other elements
- **Source**: Google Fonts

## How to Use

### Method 1: Using Font Components (Recommended)

Import the font components from `app/components/common/FontProvider.tsx`:

```tsx
import { 
  Logo, 
  Heading1, 
  Heading2, 
  Heading3, 
  Heading4, 
  Heading5, 
  Heading6,
  Paragraph,
  ParagraphSmall,
  ParagraphLarge,
  Body,
  BodySmall,
  BodyLarge
} from '../components/common/FontProvider';

// Usage examples:
<Logo>Your Logo</Logo>
<Heading1>Main Title</Heading1>
<Heading2>Section Title</Heading2>
<Paragraph>This is a paragraph with Bitter Thin font.</Paragraph>
<Body>This is body text with Bitter Light font.</Body>
```

### Method 2: Using CSS Classes

Use the predefined CSS classes:

```tsx
// For logos and headings
<span className="font-young-serif font-normal">Logo</span>
<h1 className="font-young-serif font-normal text-4xl">Heading</h1>

// For paragraphs
<p className="font-bitter font-thin">Paragraph text</p>

// For body text
<div className="font-bitter font-light">Body text</div>
```

### Method 3: Using Tailwind Classes

Use Tailwind's font family classes:

```tsx
// Young Serif
<div className="font-young-serif">Young Serif text</div>

// Bitter
<div className="font-bitter">Bitter text</div>

// Font weights
<div className="font-bitter font-thin">Thin (100)</div>
<div className="font-bitter font-extralight">Extra Light (200)</div>
<div className="font-bitter font-light">Light (300)</div>
<div className="font-bitter font-normal">Normal (400)</div>
<div className="font-bitter font-medium">Medium (500)</div>
<div className="font-bitter font-semibold">Semi Bold (600)</div>
<div className="font-bitter font-bold">Bold (700)</div>
<div className="font-bitter font-extrabold">Extra Bold (800)</div>
<div className="font-bitter font-black">Black (900)</div>
```

## Font Configuration

The font configuration is centralized in `app/config/fonts.ts`. This file contains:

- Font imports from Google Fonts
- Font family definitions
- Font weight definitions
- Utility classes
- CSS custom properties
- Tailwind configuration

## Global Styles

The global styles in `app/globals.css` automatically apply:

- **All h1-h6 tags**: Young Serif, weight 400
- **All p tags**: Bitter, weight 100 (Thin)
- **All other elements**: Bitter, weight 300 (Light)

## Best Practices

1. **Use the Font Components** for consistent typography
2. **Don't override font families** unless absolutely necessary
3. **Use the predefined weights** for consistency
4. **Keep the centralized configuration** for easy maintenance

## Examples

### Logo
```tsx
<Logo className="text-2xl text-primary-main">Side Quest</Logo>
```

### Page Title
```tsx
<Heading1 className="text-center mb-6">Welcome to Side Quest</Heading1>
```

### Section Title
```tsx
<Heading2 className="mb-4">Available Plans</Heading2>
```

### Paragraph
```tsx
<Paragraph className="text-gray-600 mb-4">
  Choose from our carefully curated selection of adventure plans.
</Paragraph>
```

### Body Text
```tsx
<Body className="text-sm text-gray-500">
  Additional information goes here.
</Body>
```
