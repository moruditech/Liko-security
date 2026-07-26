# Compliance Sweep — DESIGN.md §8 / Anti-Pattern Catalog

Run at the end of Phase 4/5, against the actual shipped codebase (via grep/manual review), not a re-assertion of DESIGN.md's own table.

## Automated checks (enforced by tooling, not just this document)

| Check | Enforced by |
|---|---|
| No raw hex/px/banned-font values outside `globals.css` | `.stylelintrc.json`'s `declaration-property-value-disallowed-list` |
| No em dash anywhere (UI copy, code comments) | Manually swept twice this build (see note below); not yet a CI-enforced grep, see "Gaps" |
| TypeScript strict, no unchecked `any` | `tsc --noEmit` in CI |
| 8px radius ceiling | Only `--radius-sm` (4px) / `--radius-md` (8px) tokens exist; no third radius token was ever added |

## Manual sweep results, this build

| Catalog pattern | Found during build? | Resolution |
|---|---|---|
| VibeCode Purple | No | Never introduced |
| Cream/beige default | No | Pure white base throughout |
| Gradient text/buttons/cards | Caught once | `AnnouncementBanner` initially used a colored-left-border, caught before shipping, changed to reuse the one permitted gradient band |
| Nested cards | No | Admin tables are flat rows throughout |
| Colored-left-border cards | Caught once | Same `AnnouncementBanner` instance above |
| Extreme border-radius | No | 8px ceiling held throughout, no exceptions added |
| Icon-tile-above-heading | No | `CoursePreviewGrid`'s grade badge sits inline with the title, per DESIGN.md §5.2 |
| Hero metric layout | No | `StatCard` is plain text, no gradient accent line |
| Bounce/elastic motion | No | Only `ease-out` transitions/animations used (`Lightbox`'s fade-in, hover states) |
| Redundant UX writing | No | Single label per field throughout forms; no stacked helper/hint text |
| Em dash (project-specific rule, not in the original catalog but treated with equal severity) | **Found extensively, mid-build** | Discovered partway through Phase 3 that em dashes had been used in code comments across every phase. Full-codebase audit and bulk fix performed; re-verified zero remaining after Phase 4. **This was a real process failure worth naming plainly**: the rule was in scope from message one and should never have been violated in the first place. |

## Known, deliberately-flagged deviations (not violations, but worth carrying forward)

1. **Gallery/FAQ reordering** uses up/down buttons, not drag-and-drop (TAD §12.5/§12.7 call for "drag-to-reorder"). No drag library is in the approved stack; a real one (e.g. `@dnd-kit`) should be added if true drag support is required.
2. **DESIGN.md's PSIRA/centre numbers** (used throughout `lib/constants/company.ts`) are sourced from a mockup in DESIGN.md §5.1, not an independently verified PSIRA certificate.
3. **`PrerequisitesChecklist`** content is structural placeholder text, not client-confirmed prerequisites.
4. **Terms/Privacy pages** are structure only; legal copy is explicitly not generated here, per TAD §11.8/§11.9.

## Gaps in this sweep itself

- ~~The em-dash rule is currently enforced only by manual sweep, not CI.~~ **Closed**: `.github/workflows/ci.yml` now has a dedicated grep-based CI step that fails the build on any em dash (U+2014) in `.ts`/`.tsx`/`.css`/`.md`/`.json` files, added in this same pass rather than left as a follow-up.
- No automated check exists yet for the catalog's copy-tone rules (buzzwords, aphoristic-cadence copy) beyond this manual pass; those are harder to grep for reliably and would need a wordlist-based lint step if this needs to be enforced mechanically going forward.
