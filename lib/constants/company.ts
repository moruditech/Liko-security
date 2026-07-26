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
  psiraNumber: '4509070',
  centreNumber: '4333985',
  address: {
    line1: 'KwaMajova, opp. Cashbuild',
    city: 'Mount Frere',
  },
} as const;
