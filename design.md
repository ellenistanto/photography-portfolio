# Design System — Editorial Photography Portfolio

> Design reference: https://www.martinusragita.com/
>
> Purpose: This document defines the visual language, layout principles, interaction patterns, and implementation rules for an editorial-style photography portfolio.
>
> The goal is NOT to clone the reference website pixel-by-pixel. Extract its design philosophy and apply it consistently to the project.

---

## 1. Design Direction

### Core aesthetic

The website should feel:

- Editorial
- Minimal
- Cinematic
- Sophisticated
- Quiet
- Photography-first
- Human
- Timeless
- Slightly artistic
- Premium without feeling luxurious or corporate

The interface should feel like a carefully designed photography book rather than a conventional SaaS website.

The photographs are the hero.

UI elements exist to guide the viewer through the work, not compete with it.

### Design philosophy

Follow these principles:

1. Less UI, more photography.
2. Whitespace is an intentional design element.
3. Typography should feel editorial rather than technological.
4. Avoid excessive cards, borders, gradients, and decorative UI.
5. Let image composition determine visual rhythm.
6. Content hierarchy should be obvious without being loud.
7. Animations should feel slow, subtle, and intentional.
8. The interface should disappear when the user is looking at photographs.

---

# 2. Visual Personality

The visual language should resemble:

- Contemporary photography magazine
- Independent creative studio
- Art direction portfolio
- High-end editorial publication
- Film photography book
- Modern photographer portfolio

Avoid the feeling of:

- SaaS dashboard
- Startup landing page
- Generic portfolio template
- Dribbble-style UI showcase
- AI-generated portfolio
- Excessive glassmorphism
- Neon cyberpunk aesthetics
- Over-designed agency website

---

# 3. Color System

Use a restrained monochrome palette.

### Primary

```css
--color-background: #F5F5F3;
--color-surface: #FFFFFF;
--color-text: #111111;
--color-text-secondary: #6F6F6F;
--color-border: #DCDCDC;
```

For dark photography-focused sections:

```css
--color-dark: #111111;
--color-dark-surface: #181818;
--color-dark-text: #F5F5F3;
```

### Rules

- Default interface should remain neutral.
- Do not introduce bright accent colors unless the project has a strong branding requirement.
- Photography itself should provide the color.
- Do not add gradients merely to make the UI "look modern".
- Avoid colored shadows.
- Avoid excessive pure-black blocks.
- White/cream backgrounds are preferred for editorial content.

### Important

The photographs are the primary source of visual color.

The UI should remain visually quiet so colorful photography can dominate.

---

# 4. Typography

Typography should feel editorial and refined.

Use a combination of:

### Primary display font

A high-contrast or contemporary serif can be used for major editorial headings.

Examples:

- Cormorant Garamond
- Instrument Serif
- Playfair Display
- DM Serif Display

### Interface / body font

Use a clean neutral sans-serif.

Examples:

- Inter
- Geist
- Helvetica Neue
- Neue Montreal
- Manrope

Recommended pairing:

```text
Display:
Instrument Serif

Body/UI:
Inter
```

### Typography hierarchy

```text
Display / Hero
Large
Elegant
Low-density

Section heading
Medium-large
Strong but restrained

Body
Small to medium
Comfortable line height

Metadata
Small
Uppercase or subtle tracking

Navigation
Small
Clean
Minimal
```

### Typography rules

DO:

- Use large editorial headlines.
- Use generous line-height.
- Use whitespace around headings.
- Use subtle letter spacing for metadata.
- Allow typography to occupy space.

DON'T:

- Use huge bold sans-serif text everywhere.
- Use excessive font weights.
- Use gradient text.
- Use text shadows.
- Use uppercase for entire paragraphs.
- Use more than 2 font families.

---

# 5. Layout Philosophy

The layout should be asymmetrical when appropriate.

Do not force everything into perfectly symmetrical cards.

Photography portfolios benefit from visual rhythm.

Use:

- Large image compositions
- Variable image sizes
- Editorial grids
- Generous margins
- Full-width imagery
- Occasional asymmetry
- Intentional empty space

Avoid:

```text
[ CARD ][ CARD ][ CARD ]
[ CARD ][ CARD ][ CARD ]
[ CARD ][ CARD ][ CARD ]
```

when the content would feel more natural as an editorial gallery.

Prefer layouts such as:

```text
┌──────────────────────────────┐
│                              │
│        LARGE IMAGE           │
│                              │
└──────────────────────────────┘

        SMALL TITLE

┌──────────────┐
│              │
│    IMAGE     │
│              │
└──────────────┘

                    ┌──────────┐
                    │          │
                    │  IMAGE   │
                    │          │
                    └──────────┘
```

The exact composition can vary based on the photographs.

---

# 6. Container

Use a generous desktop container.

Recommended:

```css
max-width: 1440px;
margin-inline: auto;
padding-inline: 32px;
```

Large screens may use:

```css
padding-inline: 48px;
```

Mobile:

```css
padding-inline: 20px;
```

Do not make the content unnecessarily narrow.

Photography needs room to breathe.

---

# 7. Navigation

Navigation should be extremely minimal.

Recommended structure:

```text
[NAME / LOGO]                     WORK   ABOUT   CONTACT
```

Possible portfolio navigation:

```text
Home
Music & Concert
Portraits
People & Places
Brands & Products
Connect
```

The reference website uses a similarly restrained navigation hierarchy, including a "Beyond the Stage" grouping for Portraits, People & Places, and Brands & Products.

### Navigation behavior

Desktop:

- Minimal height
- Plenty of horizontal whitespace
- Small typography
- No oversized navigation buttons

Mobile:

- Compact menu
- Simple menu trigger
- Full-screen or clean dropdown navigation
- Avoid complicated mega menus

### Active state

Use subtle visual indicators.

Examples:

```text
Music & Concert
───────────────
```

or a small opacity/weight change.

Avoid:

- Pills
- Bright colored active states
- Giant underlines
- Animated blobs

---

# 8. Hero Section

The hero should immediately communicate:

1. Who the photographer is
2. What they photograph
3. The visual quality of their work

Recommended structure:

```text
[Large editorial photograph]

Martinus Ragita

Photographer based in Indonesia.

Concerts. Portraits. Travel.
Human moments in between.
```

The reference site positions the photographer identity around concerts, portraits, travel, and human moments, emphasizing storytelling and restrained aesthetics.

### Hero rules

- Image should dominate.
- Text should remain secondary.
- Avoid huge marketing slogans.
- Avoid CTA overload.
- One primary CTA is enough.
- Do not place multiple floating cards over the image.

---

# 9. Photography Gallery

The gallery is the most important component.

Images should feel like photographs displayed in an exhibition.

### Image rules

- Preserve original aspect ratio whenever possible.
- Avoid aggressive cropping.
- Do not force every image into identical dimensions.
- Use `object-fit: cover` only when intentional.
- High-resolution images should be lazy-loaded.
- Use responsive image sizes.
- Avoid rounded corners by default.

Recommended:

```css
border-radius: 0;
```

Photography should feel physical and editorial rather than like UI cards.

---

# 10. Gallery Grid

Use several gallery patterns.

### Pattern A — Editorial Grid

```text
┌──────────────────┐  ┌──────────────┐
│                  │  │              │
│                  │  │              │
│      IMAGE       │  │    IMAGE     │
│                  │  │              │
│                  │  │              │
└──────────────────┘  └──────────────┘
```

### Pattern B — Full Width

```text
┌────────────────────────────────────┐
│                                    │
│              IMAGE                 │
│                                    │
└────────────────────────────────────┘
```

### Pattern C — Asymmetric

```text
┌──────────────────────┐
│                      │
│        IMAGE         │
│                      │
└──────────────────────┘

                    ┌─────────────┐
                    │             │
                    │    IMAGE    │
                    │             │
                    └─────────────┘
```

### Pattern D — Masonry

Use only when it improves the photographic presentation.

Do not use masonry simply because it is trendy.

---

# 11. Image Hover

Hover interactions should be subtle.

Recommended:

```css
transform: scale(1.015);
transition: transform 600ms cubic-bezier(...);
```

Optional:

- Slight opacity transition
- Caption reveal
- Minimal metadata

Avoid:

- Huge zoom
- Glitch effects
- RGB split
- Flashing effects
- Excessive parallax
- Cursor-following effects everywhere

The interaction should make the user feel that the image is alive, not that the website is showing off.

---

# 12. Project / Work Pages

Each photography project should feel like a mini editorial story.

Recommended structure:

```text
PROJECT TITLE

Location / Year
Category

Introductory text

[Large Image]

[Image] [Image]

[Full-width Image]

[Image]

Project information

More work
```

The reference portfolio separates photography into distinct bodies of work such as music/concerts, portraits, and people/places rather than presenting everything as one undifferentiated gallery.

### Project page rules

Do not:

- Add unnecessary sidebars
- Add huge UI panels
- Add excessive project metadata
- Turn every project into a "product card"

The images should tell the story.

---

# 13. Category Pages

Recommended categories:

```text
Music & Concert
Portraits
People & Places
Brands & Products
```

These categories reflect the structure of the reference portfolio.

Each category should begin with:

```text
CATEGORY

Short editorial description

Featured work
```

Then transition into the gallery.

---

# 14. Project Metadata

Keep metadata small and quiet.

Example:

```text
HINDIA
Jakarta · 2025
Music & Concert
```

or:

```text
TOYAMA
Japan · 2024
People & Places
```

Metadata should never visually compete with the photograph.

---

# 15. About Section

The About section should feel personal rather than corporate.

Recommended structure:

```text
ABOUT

I'm [Name],
a photographer based in Indonesia.

Short personal statement.

Selected clients / collaborators

Experience / milestones
```

The reference site uses a concise personal introduction followed by collaborators/clients and a timeline of milestones.

### Experience section

Use a simple editorial timeline rather than dashboard-style statistics.

Example:

```text
2013
First discovered photography

2014
Entered stage photography

2018
Lifestyle projects

2022
First international project

NOW
More moments ahead
```

---

# 16. Statistics

If statistics are used, keep them editorial.

Example:

```text
10+
creative partners

150+
live stages

800+
moments documented
```

The reference site uses this kind of compact numeric storytelling in its Connect/About content.

Avoid:

```text
┌────────┐ ┌────────┐ ┌────────┐
│ 800+   │ │ 150+   │ │ 10+    │
│ Photos │ │ Events │ │ Clients│
└────────┘ └────────┘ └────────┘
```

with excessive card styling.

Numbers should feel integrated into the editorial layout.

---

# 17. Clients / Collaborators

Client names can function as a visual credibility section.

Example:

```text
SELECTED CLIENTS

HINDIA
.FEAST
LOMBA SIHIR
IDGITAF
BERNADYA
RAISA ANGGIANI

UNIQLO
NIKE
VANS
IM3
MILLS
```

The reference site uses artist and brand names as part of the portfolio identity.

Keep these typographic and simple.

Avoid logos unless actual official logos are available.

---

# 18. Contact Section

Contact should feel like an invitation rather than a conversion funnel.

Recommended:

```text
LET'S CREATE SOMETHING

Have a project, an idea,
or a story worth capturing?

Let's create something meaningful together.

Instagram
Email
WhatsApp
```

The reference website uses a similarly direct closing invitation to connect.

Avoid:

- 5-field forms by default
- "BOOK NOW!!!"
- Sales language
- Pricing cards
- Countdown timers
- Artificial urgency

---

# 19. Footer

Minimal.

Example:

```text
[NAME]

Instagram
Email

© 2026 [NAME]
```

Do not fill the footer with unnecessary navigation.

---

# 20. Spacing System

Use generous vertical spacing.

Suggested scale:

```text
4px
8px
12px
16px
24px
32px
48px
64px
96px
128px
160px
```

Large editorial sections may use:

```text
120–180px
```

vertical spacing on desktop.

Mobile:

```text
64–96px
```

Do not compress sections simply to fit more content on screen.

Whitespace is part of the design.

---

# 21. Border Radius

Default:

```css
border-radius: 0;
```

Use small radius only where usability requires it.

Avoid the common AI-generated pattern:

```css
border-radius: 24px;
```

on every component.

Photography portfolios should feel editorial, not like a SaaS dashboard.

---

# 22. Shadows

Use shadows extremely sparingly.

Default:

```css
box-shadow: none;
```

If needed, use very subtle shadows only for functional overlays such as:

- Mobile menu
- Lightbox controls
- Dialogs

Never use large soft shadows as decoration.

---

# 23. Buttons

Buttons should be minimal.

Primary:

```text
VIEW WORK →
```

Secondary:

```text
ABOUT
```

Style:

- Small/medium height
- Minimal border
- Neutral colors
- Moderate padding
- No gradients
- No excessive radius

Avoid oversized CTA buttons.

---

# 24. Lightbox

A lightbox is appropriate for photography.

Behavior:

1. Click image.
2. Open image-focused overlay.
3. Dark neutral background.
4. Large photograph centered.
5. Minimal controls.
6. Escape closes.
7. Arrow keys navigate.
8. Swipe navigation on mobile.

UI should disappear as much as possible.

---

# 25. Animation

Animation should communicate physical movement and improve navigation.

Recommended duration:

```text
150ms — micro interaction
300ms — normal transition
500–700ms — image transition
800ms+ — editorial entrance
```

Use:

```css
ease-out
cubic-bezier(...)
```

Prefer opacity + transform.

Example:

```css
opacity: 0 → 1;
transform: translateY(12px) → translateY(0);
```

Avoid:

- Bounce
- Elastic animations
- Excessive stagger
- Constant floating elements
- Scroll-jacking
- Excessive parallax
- Animated gradients

---

# 26. Page Transitions

If implemented, transitions should be almost invisible.

Recommended:

```text
fade
+
very subtle vertical movement
```

Do not use dramatic cinematic transitions between every page.

The photography should provide the cinematic quality.

---

# 27. Responsive Design

### Desktop

Use:

- Large imagery
- Generous whitespace
- Multi-column editorial grids
- Horizontal navigation

### Tablet

Reduce:

- Grid complexity
- Horizontal spacing
- Font scale

### Mobile

Prioritize:

1. Photography
2. Navigation
3. Typography
4. Metadata

Avoid shrinking the desktop layout.

The mobile design should be intentionally composed.

---

# 28. Mobile Gallery

Recommended:

```text
IMAGE

Title
Location / Year

IMAGE

Title
Location / Year
```

Full-width imagery generally works better than cramped multi-column grids.

Use two columns only when the images benefit from it.

---

# 29. Accessibility

Even though this is a highly visual portfolio:

- Every image must have meaningful `alt` text.
- Keyboard navigation must work.
- Focus states must remain visible.
- Text must maintain sufficient contrast.
- Lightbox must support Escape.
- Buttons must have accessible labels.
- Do not communicate important information through color alone.
- Respect `prefers-reduced-motion`.

---

# 30. Performance

Photography websites can become extremely heavy.

Implementation must prioritize:

- WebP/AVIF
- Responsive image sizes
- Lazy loading
- Proper image dimensions
- Blur/low-quality placeholders if appropriate
- Progressive loading
- CDN/image optimization
- Avoid loading full-resolution images before needed

Do not sacrifice performance for visual effects.

---

# 31. SEO

Each project should have:

- Descriptive title
- Meta description
- Semantic headings
- Image alt text
- Open Graph image
- Canonical URL
- Structured project metadata when appropriate

Photography titles should remain human-readable.

---

# 32. Anti-AI-Slop Rules

This section is mandatory.

The implementation must NOT automatically introduce common AI-generated design patterns.

### Never do this without explicit design justification:

- Purple/blue gradient backgrounds
- Glassmorphism everywhere
- Floating gradient blobs
- Excessive rounded cards
- Huge bold Inter text
- Giant "BUILD. CREATE. INSPIRE." slogans
- Excessive badges
- Pills everywhere
- 3-column SaaS card grids
- Giant CTA buttons
- Neon accents
- Decorative noise everywhere
- Random geometric shapes
- Excessive shadows
- Excessive animations
- Cursor-following effects
- Fake statistics
- Unnecessary icons
- Emoji as UI decoration
- Excessive border radius
- Generic AI-generated hero sections

### Especially avoid this pattern:

```text
BIG GRADIENT HERO
        ↓
3 GLASS CARDS
        ↓
FEATURE GRID
        ↓
TESTIMONIALS
        ↓
PRICING
        ↓
BIG CTA
```

That is NOT the intended visual language.

---

# 33. Photography Comes First

When there is a conflict between:

```text
UI aesthetics
```

and

```text
photography presentation
```

always prioritize the photography.

The interface should support:

- Composition
- Emotion
- Story
- Scale
- Atmosphere
- Rhythm

Never cover important parts of photographs with unnecessary UI.

---

# 34. Content Density

Prefer:

```text
less content
+
larger visual presence
+
more whitespace
```

over:

```text
more content
+
smaller cards
+
dense layouts
```

The portfolio should feel curated.

Not everything needs to be shown simultaneously.

---

# 35. Editorial Rhythm

A page should alternate between:

```text
IMAGE
↓
TEXT
↓
WHITESPACE
↓
IMAGE
↓
SMALL METADATA
↓
LARGE IMAGE
↓
WHITESPACE
```

Avoid repeating the exact same component indefinitely.

Visual rhythm is more important than component consistency.

---

# 36. Design Tokens

Suggested initial tokens:

```css
:root {
  --background: #F5F5F3;
  --surface: #FFFFFF;
  --foreground: #111111;
  --muted: #6F6F6F;
  --border: #DCDCDC;

  --font-display: "Instrument Serif", serif;
  --font-body: "Inter", sans-serif;

  --container: 1440px;

  --space-xs: 8px;
  --space-sm: 16px;
  --space-md: 32px;
  --space-lg: 64px;
  --space-xl: 96px;
  --space-2xl: 128px;
  --space-3xl: 160px;

  --transition-fast: 180ms;
  --transition-normal: 300ms;
  --transition-slow: 600ms;
}
```

These are starting values, not immutable requirements.

Adjust based on actual content.

---

# 37. Component Philosophy

Components should be small and purposeful.

Recommended:

```text
Header
Navigation
Hero
SectionIntro
ProjectGrid
ProjectCard
ImageGallery
ProjectMeta
ClientList
Timeline
ContactSection
Footer
Lightbox
```

Avoid creating components simply because a UI element exists.

Component abstraction should improve maintainability.

---

# 38. Implementation Priority

When implementing the design, follow this order:

### Priority 1

Photography presentation.

### Priority 2

Layout and spacing.

### Priority 3

Typography.

### Priority 4

Navigation.

### Priority 5

Responsive behavior.

### Priority 6

Interaction and animation.

### Priority 7

Decorative details.

Never reverse this order.

---

# 39. Design Quality Checklist

Before considering a page finished, verify:

### Visual

- [ ] Photography dominates the interface.
- [ ] Layout feels editorial.
- [ ] Whitespace is intentional.
- [ ] Typography feels refined.
- [ ] Colors are restrained.
- [ ] No unnecessary gradients.
- [ ] No excessive rounded cards.
- [ ] No excessive shadows.

### UX

- [ ] Navigation is obvious.
- [ ] Projects are easy to browse.
- [ ] Images are easy to view.
- [ ] Mobile experience feels intentional.
- [ ] Loading states are unobtrusive.
- [ ] Lightbox works correctly.

### Performance

- [ ] Images are optimized.
- [ ] Lazy loading is implemented.
- [ ] Responsive image sizes are used.
- [ ] No unnecessary JavaScript animations.

### Anti-slop

- [ ] No generic SaaS layout.
- [ ] No unnecessary glassmorphism.
- [ ] No random gradients.
- [ ] No excessive pills.
- [ ] No excessive animation.
- [ ] No decorative elements without purpose.

---

# 40. Final Design Principle

> Make the website feel like a photographer's body of work, not a website showing off that it was designed.

The visitor should remember:

1. The photographs.
2. The photographer.
3. The stories behind the photographs.

They should NOT remember:

- The animations
- The gradients
- The cards
- The UI effects
- The framework
- The implementation

The best interface is the one that becomes invisible while the photography remains unforgettable.