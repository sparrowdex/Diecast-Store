# Codebase Analysis

This document outlines key design and development principles for the diecast-store project, ensuring consistency, accessibility, and performance.

## 1. Defensive Design (Content vs. Layout)

Always design for the worst-case scenario to prevent content from breaking the layout.

*   **The Longest String Rule**: Never assume short text for dynamic content like product names or descriptions. Use truncation utilities (e.g., `truncate`, `line-clamp-2`) or padding "gutters" to ensure text breaks gracefully.
*   **Touch Targets**: On mobile, ensure all clickable elements have a minimum physical size of 44x44px for usability. This can be achieved with padding (e.g., `p-3`).

## 2. The Accessibility (A11y) Baseline

Strive to keep the Vercel Accessibility Toolbar score high (green).

*   **Semantic HTML**: Use appropriate HTML5 tags like `<main>`, `<nav>`, `<header>`, and `<footer>` to define page structure. This is crucial for screen readers and fixes "Landmark" errors.
*   **Contrast (Halation)**: Use an off-white (`#FAFAFA`) and a soft black (`#0A0A0A`) instead of pure white and black to reduce eye strain while maintaining a brutalist aesthetic.
*   **Keyboard Navigation**: Do not remove the default `focus` outline without providing a clear replacement. Use classes like `focus:outline-none focus:ring-2 focus:ring-[#0A0A0A]` for all interactive elements.
*   **Hidden Decorators**: For purely decorative elements, use `aria-hidden="true"` to prevent screen readers from announcing them and confusing visually impaired users.

## 3. Mobile vs. Desktop Interaction States

Design interactions that work seamlessly across all devices.

*   **The Hover Trap**: Avoid relying on `hover` states for critical actions or information, as they do not exist on touch devices. Ensure information is permanently visible or triggered by a tap on mobile.
*   **Scroll Trapping**: Be cautious when placing horizontally scrolling elements within vertically scrolling pages. Clearly indicate their behavior to prevent user frustration.

## 4. Performance & Core Web Vitals (Next.js)

Performance is a critical part of the user interface, especially for an image-heavy e-commerce site.

*   **CLS (Cumulative Layout Shift)**: Use aspect ratio containers (e.g., `aspect-[4/3]`) for images to reserve space before they load, preventing page layout shifts.
*   **LCP (Largest Contentful Paint)**: For the largest image visible in the initial viewport (e.g., a hero image), add the `priority` prop to the Next.js `<Image />` component to signal the browser to load it first.

## 5. Motion & Vibe Consistency

Maintain a consistent feel that aligns with the F1/Brutalist theme.

*   **Easing Curves**: Use fast, snappy easing functions like `ease-out` for animations to create a sense of precision and speed, like a race car shifting gears.
*   **Micro-interactions**: Provide immediate and satisfying visual feedback for user actions, such as adding an item to the vault.
