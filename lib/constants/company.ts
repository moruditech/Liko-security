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
  email: 'info@likosecurity.co.za',
  tagline: 'Empowering Professionals. Building Safer Communities.',
  psiraNumber: '4509070',
  centreNumber: '4333985',
  address: {
    line1: 'KwaMajova, opp. Cashbuild',
    city: 'Mount Frere',
  },

  /**
   * FLAG: none of the provided documents or the backend confirm these
   * numbers or descriptions. They match the approved homepage design
   * reference exactly, but are placeholder marketing claims, not verified
   * Liko statistics. Get real numbers/copy from the client before this
   * ships, same caution as the PSIRA/centre numbers above.
   */
  stats: {
    studentsTrained: { value: '1,000+', label: 'Students Trained', description: 'Empowering individuals for successful careers.' },
    passRate: { value: '98%', label: 'Pass Rate', description: 'Built on success rate across all our programs.' },
    yearsExperience: { value: '15+', label: 'Years Experience', description: 'Delivering trusted training with proven results.' },
    partnerCompanies: { value: '50+', label: 'Partner Companies', description: 'Building strong relationships across industries.' },
  },

  /**
   * FLAG: no video exists yet. Left undefined on purpose, Hero only
   * renders the "Watch Video" button when this is actually set, rather
   * than shipping a dead button.
   */
  heroVideoUrl: undefined as string | undefined,

  /**
   * FLAG: none of the provided documents or the backend's Settings model
   * confirm real social media accounts for Liko. Left undefined on purpose
   * rather than filled with placeholder URLs, dead '#' links are worse
   * than no link at all. SiteHeader only renders an icon when the
   * corresponding URL is actually set, fill these in once real handles
   * exist.
   */
  socialLinks: {
    facebook: undefined as string | undefined,
    instagram: undefined as string | undefined,
    linkedin: undefined as string | undefined,
  },
};
