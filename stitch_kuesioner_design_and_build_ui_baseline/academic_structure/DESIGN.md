---
name: Academic Structure
colors:
  surface: '#f8f9fa'
  surface-dim: '#d9dadb'
  surface-bright: '#f8f9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f5'
  surface-container: '#edeeef'
  surface-container-high: '#e7e8e9'
  surface-container-highest: '#e1e3e4'
  on-surface: '#191c1d'
  on-surface-variant: '#414750'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f2'
  outline: '#727781'
  outline-variant: '#c1c7d2'
  surface-tint: '#1a61a0'
  primary: '#025695'
  on-primary: '#ffffff'
  primary-container: '#2f6faf'
  on-primary-container: '#e7efff'
  inverse-primary: '#a0c9ff'
  secondary: '#1c6775'
  on-secondary: '#ffffff'
  secondary-container: '#a7eafa'
  on-secondary-container: '#226b79'
  tertiary: '#33567d'
  on-tertiary: '#ffffff'
  tertiary-container: '#4c6f97'
  on-tertiary-container: '#e7f0ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d2e4ff'
  primary-fixed-dim: '#a0c9ff'
  on-primary-fixed: '#001c37'
  on-primary-fixed-variant: '#00497f'
  secondary-fixed: '#aaedfd'
  secondary-fixed-dim: '#8ed1e0'
  on-secondary-fixed: '#001f25'
  on-secondary-fixed-variant: '#004e5a'
  tertiary-fixed: '#d1e4ff'
  tertiary-fixed-dim: '#a6c9f6'
  on-tertiary-fixed: '#001d36'
  on-tertiary-fixed-variant: '#24496e'
  background: '#f8f9fa'
  on-background: '#191c1d'
  surface-variant: '#e1e3e4'
typography:
  display-xl:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 60px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-md:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  title-lg:
    fontFamily: Public Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Public Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Public Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Public Sans
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Public Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max-width: 1200px
  gutter: 24px
  margin-desktop: 40px
  margin-mobile: 16px
---

## Brand & Style

This design system is engineered for the academic rigor and institutional prestige of the Institut Teknologi Bandung (ITB). It targets a diverse user base of researchers, students, and institutional partners who require a platform that prioritizes data integrity and cognitive clarity.

The visual direction follows a **Corporate / Modern** aesthetic with distinct **Academic / Editorial** influences. It balances the utilitarian needs of a high-density questionnaire platform with the sophisticated elegance of a scholarly publication. The atmosphere is intentional and structured, utilizing generous white space to reduce survey fatigue while maintaining a formal hierarchy through classical typography and a disciplined color palette.

## Colors

The color strategy uses deep, saturated tones to anchor the interface. The **Deep Teal** is reserved for high-level navigation, providing a strong institutional header. **Medium Blue** serves as the primary action color for buttons and active states, ensuring high visibility without the aggression of a standard "digital" blue.

Contrast is achieved through a dual-surface approach: crisp **White** cards for primary data entry and **Soft Beige** for secondary information or sidebar content. A specialized "Risk Level" palette is included for data visualization, transitioning from neutral gray through a semantic traffic-light system to indicate severity levels in survey results.

## Typography

The typography system employs a "Serif-Display, Sans-UI" pairing to signal authority and accessibility simultaneously. 

**Playfair Display** is used exclusively for page titles and section headers. Its high-contrast strokes and elegant serifs evoke the feeling of a printed academic journal. **Public Sans** is utilized for all functional elements, including body text, input labels, and data tables. It was chosen for its neutral, institutional character and exceptional legibility in dense form layouts. 

For mobile devices, Headline-LG scales down to 28px to ensure word wrap consistency on smaller viewports.

## Layout & Spacing

This design system uses a **Fixed Grid** model for desktop to ensure content remains readable and focused, centering a 1200px container on the page background. 

The rhythm is built on an 8px base unit. Section spacing follows a "generous breathing room" philosophy, with 40px–64px vertical gaps between major content blocks. 

- **Desktop (1200px+):** 12-column grid, 24px gutters, 40px outer margins.
- **Tablet (768px-1199px):** 8-column grid, 20px gutters, 24px outer margins.
- **Mobile (Under 767px):** 4-column grid, 16px gutters, 16px outer margins.

## Elevation & Depth

Hierarchy is communicated through **Tonal Layering** and **Subtle Shadows** rather than heavy decorative effects. 

The primary surface is the light gray page background. Content is housed in white or beige "containers" (cards). These containers use a very soft, diffused shadow (0px 4px 20px rgba(0, 0, 0, 0.05)) to separate them from the background. 

Floating elements, such as dropdowns or modals, use a secondary shadow tier with more spread to indicate higher Z-index. Borders are kept thin (1px) and light (#D9D9D9) to provide structure without adding visual noise.

## Shapes

The shape language is defined as **Rounded**, utilizing a consistent 8px-12px radius across all interactive elements. 

- **Standard Components (Inputs, Buttons):** 8px radius.
- **Large Containers (Cards, Modals):** 12px radius.
- **Small Elements (Chips, Tags):** 4px or fully rounded (pill) depending on context.

This level of rounding softens the formal tone, making the platform feel modern and approachable while maintaining enough structural "sharpness" to remain professional.

## Components

### Buttons
Primary buttons use a solid Medium Blue fill with white text. Secondary buttons use a transparent background with a Medium Blue border and text. All buttons feature an 8px corner radius and a subtle hover state transition.

### Cards
Cards are the primary organizational unit. They should feature 12px rounded corners, a #D9D9D9 border, and a soft shadow. Use the soft beige background for "Sidebar" or "Instructional" cards to differentiate them from "Data Entry" cards.

### Input Fields
Inputs use a white background with a 1px #D9D9D9 border. On focus, the border shifts to Medium Blue with a 2px outer "glow" of the same color at 20% opacity. Labels are always positioned above the field in Public Sans Bold.

### Likert Scales & Matrices
For survey questions, use a matrix layout with alternating row highlights (using the soft beige) to aid horizontal tracking. Radio buttons within the matrix should be clearly centered and use the primary blue for selected states.

### Progress Steppers
A horizontal stepper at the top of the questionnaire provides orientation. Completed steps use the Success Green with a checkmark icon; the active step uses the Primary Blue circle with a white number.