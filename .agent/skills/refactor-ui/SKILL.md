---
name: refactor-ui
description: AGGRESSIVELY refactors UI components to fit small 14-inch screens. AUTHORIZED to change layout structure and force-replace CSS classes.
tools: [read_file, write_file]
---

# UI Refactor: "Vostro 14" Aggressive Protocol (v2)

## TRIGGER
User says "it's still too big," "make it compact," "fix density," or shows screenshots of sparse UI.

## THE CORE PROBLEM
Reducing padding isn't enough. You must **ROTATE** layouts.
* **Vertical Stacks (Flex-Col)** take up too much Height.
* **Horizontal Rows (Flex-Row)** save Height.

## CORE DIRECTIVE
**"Preservation Bias" is disabled.** Do not try to keep the original spacing "just in case."
You must aggressively condense the UI to fit a **1280px viewport** with **125% OS scaling**.
The user wants to see MORE data on the screen, not whitespace.

## 1. THE "FORCE MAPPING" DICTIONARY
You must perform these exact string replacements. Do not calculate—just replace.

### Spacing (The 50% Cut)
| Original | **FORCE REPLACEMENT** |
| :--- | :--- |
| `p-12`, `p-10`, `p-8` | **`p-4`** |
| `p-6` | **`p-3`** |
| `py-anything > 4` | **`py-2`** |
| `gap-8`, `gap-6` | **`gap-3`** |
| `my-`, `mt-`, `mb-` | Reduce all vertical margins by **50%**. |

### Controls & Inputs
| Original | **FORCE REPLACEMENT** |
| :--- | :--- |
| `h-16`, `h-14`, `h-12` | **`h-9`** (36px) |
| `px-6`, `px-5` | **`px-3`** |
| `text-lg` (inside inputs) | **`text-sm`** |

### Typography
| Original | **FORCE REPLACEMENT** |
| :--- | :--- |
| `text-5xl`+ | `text-3xl` |
| `text-xl`, `text-2xl` | `text-lg` |
| `text-lg`, `text-base` | **`text-sm`** (This is mandatory) |
| `text-sm` (secondary) | `text-xs` |

## 2. STRUCTURAL OVERRIDES (Layout)
1.  **Kill the "Container":** If the code uses `max-w-7xl` or `max-w-screen-2xl`, REPLACE it with `max-w-full` or `max-w-screen-xl`.
2.  **Grid Collapse:**
    * If `grid-cols-3` causes cards to look squashed -> Change to `grid-cols-2`.
    * If `grid-cols-4` -> Change to `grid-cols-3`.
3.  **Card Flattening:**
    * Remove `shadow-xl` or `shadow-2xl` (they take up mental space). Use `shadow-sm` and `border`.
    * Remove separate "Card Header" containers if they only contain a title. Merge them into the main body with a divider.

## 3. COMPONENT SPECIFICS

### Tables (The "Excel" Mode)
If you see a Table (`<table>`, `div` role="table"):
1.  Set cell padding to `py-2` and `px-3`.
2.  Set header font size to `text-xs uppercase tracking-wider`.
3.  Set row height to `h-10`.
4.  **CRITICAL:** If the table is too wide, wrap it in `<div className="overflow-x-auto">`.

### Stats/Metrics Cards
1.  Move the "Icon" to the side of the value (Flex Row), not above it (Flex Col), to save vertical height.
2.  Reduce the "Label" text to `text-xs text-muted-foreground`.

## 4. FINAL QUALITY CHECK
Before saving, ask yourself:
* "Did I just reduce the size by 5%, or did I fundamentally densify the layout?"
* **Action:** If the change feels subtle, **do it again harder.**