/**
 * Single source of truth for static company facts referenced across the
 * public site and PDF headers (TAD §3). Values below are taken directly
 * from DESIGN.md §5.1's hero layout, the only place these numbers appear
 * in the provided documents.
 *
 * FLAG: DESIGN.md §5.1 is a layout mockup, not a confirmed-accurate legal
 * record. Verify PSIRA No., Centre No., and the registered address against
 * the client's actual PSIRA certificate before this ships, do not treat
 * the values below as verified without that check.
 */
export const COMPANY = {
  name: 'Liko Security Training',
  tagline: 'Empowering Professionals. Building Safer Communities.',
  psiraNumber: '4509070',
  centreNumber: '4333985',
  address: {
    line1: 'KwaMajova, opp. Cashbuild',
    city: 'Mount Frere',
  },
  /**
   * FLAG: none of the provided documents or the backend's Settings model
   * confirm real social media accounts for Liko. These are left undefined
   * on purpose rather than filled with placeholder URLs, dead '#' links are
   * worse than no link at all. SiteHeader only renders an icon when the
   * corresponding URL is actually set, fill these in once real handles
   * exist.
   */
  socialLinks: {
    facebook: undefined as string | undefined,
    instagram: undefined as string | undefined,
    linkedin: undefined as string | undefined,
  },
};
