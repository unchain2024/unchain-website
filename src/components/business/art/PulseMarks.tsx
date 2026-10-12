/* Hand-drawn in the style of the generated marks in Marks.tsx, which must not be
   hand-edited. The "03" reuses the "0" from the export's "02" and draws the "3" from
   the same 8.33 stroke and the same gradient pair; the Pulse mark is the product's own
   brand mark from pulse.co.jp, made tintable. */

type Props = { className?: string };

/* Display "03". */
export const NumberThree = ({ className }: Props) => (
<svg width="63.23" height="47.99" viewBox="119.77 129.48 63.23 47.99" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
<defs>
<linearGradient id="pulse_num_a" x1="119.771" y1="161.199" x2="152.557" y2="161.199" gradientUnits="userSpaceOnUse">
<stop stopColor="#D9EEFA"/>
<stop offset="1" stopColor="#89B7D1"/>
</linearGradient>
<linearGradient id="pulse_num_b" x1="119.77" y1="145.751" x2="152.557" y2="145.751" gradientUnits="userSpaceOnUse">
<stop stopColor="#0E3067"/>
<stop offset="1" stopColor="#D9E5FA"/>
</linearGradient>
<linearGradient id="pulse_num_c" x1="158.5" y1="153.47" x2="183" y2="153.47" gradientUnits="userSpaceOnUse">
<stop stopColor="#0E3067"/>
<stop offset="1" stopColor="#D9E5FA"/>
</linearGradient>
<linearGradient id="pulse_num_d" x1="183" y1="129.48" x2="158.5" y2="177.47" gradientUnits="userSpaceOnUse">
<stop stopColor="#D9EEFA"/>
<stop offset="1" stopColor="#89B7D1"/>
</linearGradient>
</defs>
<path d="M136.611 177.469C145.418 177.469 152.557 170.33 152.557 161.524V153.411H144.229V161.524C144.229 165.731 140.818 169.141 136.611 169.141H135.716C131.509 169.141 128.098 165.731 128.098 161.524V153.411H119.77V161.524C119.77 170.33 126.909 177.469 135.716 177.469H136.611Z" fill="url(#pulse_num_a)"/>
<path opacity="0.8" d="M135.716 129.481C126.909 129.481 119.77 136.62 119.77 145.427V153.539H128.098V145.427C128.098 141.22 131.509 137.809 135.716 137.809H136.611C140.818 137.809 144.229 141.22 144.229 145.427V153.539H152.557V145.427C152.557 136.62 145.418 129.481 136.611 129.481H135.716Z" fill="url(#pulse_num_b)"/>
<path opacity="0.8" d="M158.5 129.48H171A12 12 0 0 1 171 153.47H160.5V149.3H171A3.67 3.67 0 0 0 171 137.81H158.5Z" fill="url(#pulse_num_c)"/>
<path d="M160.5 153.47H171A12 12 0 0 1 171 177.47H158.5V169.14H171A3.67 3.67 0 0 0 171 161.8H160.5Z" fill="url(#pulse_num_c)"/>
<path d="M160.5 153.47H171A12 12 0 0 1 171 177.47H158.5V169.14H171A3.67 3.67 0 0 0 171 161.8H160.5Z" fill="url(#pulse_num_d)" opacity="0.6"/>
</svg>
);

/* Pulse brand mark, tintable. */
export const PulseMark = ({ className }: Props) => (
<svg width="68" height="76" viewBox="0 0 68 76" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
<path d="M34.0078 55.7188C39.4268 55.7189 43.8193 60.1122 43.8193 65.5312C43.8192 70.9501 39.4267 75.3426 34.0078 75.3428C28.5888 75.3428 24.1955 70.9502 24.1953 65.5312C24.1953 60.1121 28.5887 55.7188 34.0078 55.7188ZM58.1406 13.9316C63.5596 13.9318 67.9521 18.3251 67.9521 23.7441C67.9521 27.0162 66.3498 29.9127 63.8877 31.6943C61.8704 33.1542 59.9775 35.1837 59.9775 37.6738C59.9776 40.1639 61.8706 42.1932 63.8877 43.6533C66.3499 45.4355 67.9521 48.3332 67.9521 51.6055C67.952 57.0244 63.5595 61.4168 58.1406 61.417C52.7216 61.417 48.3283 57.0245 48.3281 51.6055C48.3281 49.69 47.6772 47.6718 46.0186 46.7139L45.957 46.6787C44.2285 45.6806 42.0657 46.1589 40.4033 47.2637C38.5822 48.4741 36.3966 49.1797 34.0459 49.1797C27.691 49.1797 22.5391 44.0277 22.5391 37.6729C22.5391 37.4519 22.5453 37.2325 22.5576 37.0146C22.6723 34.9919 21.9968 32.845 20.2422 31.832L20.1367 31.7715C18.4751 30.8122 16.4217 31.2414 14.7666 32.2119C13.1188 33.1782 11.6729 34.7578 11.6729 36.668V37.6514C11.6729 40.1467 13.5761 42.1777 15.6025 43.6338C18.0805 45.4143 19.6943 48.321 19.6943 51.6055C19.6942 57.0244 15.3017 61.4168 9.88281 61.417C4.46378 61.417 0.0704702 57.0245 0.0703125 51.6055C0.0703125 48.358 1.64836 45.4791 4.0791 43.6934C6.08557 42.2193 7.96867 40.186 7.96875 37.6963C7.96875 35.1921 6.06434 33.1509 4.04004 31.6768C1.59158 29.8935 0.000156691 27.0053 0 23.7441C0 18.325 4.39337 13.9316 9.8125 13.9316C15.2316 13.9317 19.625 18.3251 19.625 23.7441C19.6249 25.6105 20.2675 27.5698 21.8838 28.5029L22.0723 28.6113C23.8433 29.6334 26.0594 29.142 27.7725 28.0254C29.5768 26.8494 31.7315 26.166 34.0459 26.166C40.4008 26.1661 45.5527 31.3179 45.5527 37.6729C45.5527 37.9004 45.5463 38.1264 45.5332 38.3506C45.4158 40.3527 46.0854 42.4758 47.8223 43.4785L47.9287 43.5391C49.5626 44.4822 51.5798 44.0707 53.21 43.1211C54.8439 42.1693 56.2734 40.6049 56.2734 38.7139V37.6738C56.2734 35.1791 54.3801 33.1446 52.3643 31.6748C49.918 29.8912 48.3282 27.0037 48.3281 23.7441C48.3281 18.325 52.7215 13.9316 58.1406 13.9316ZM34.0078 0C39.4268 0.00015771 43.8193 4.39346 43.8193 9.8125C43.8192 15.2314 39.4267 19.6239 34.0078 19.624C28.5888 19.624 24.1955 15.2315 24.1953 9.8125C24.1953 4.39337 28.5887 0 34.0078 0Z" fill="currentColor"/>
</svg>
);

/* Card icons, on the same 1.67 round stroke as the advisor list's icons. */
export const IconBrief = ({ className }: Props) => (
<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
<path d="M4.167 3.75h11.666c.92 0 1.667.746 1.667 1.667v10.416c0 .921-.746 1.667-1.667 1.667H4.167A1.667 1.667 0 0 1 2.5 15.833V5.417c0-.921.746-1.667 1.667-1.667ZM2.5 8.333h15M6.667 2.083v3.334M13.333 2.083v3.334M6.25 12.083h4.167" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
);

export const IconNotes = ({ className }: Props) => (
<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
<path d="M10 1.667a3.333 3.333 0 0 1 3.333 3.333v4.167a3.333 3.333 0 1 1-6.666 0V5A3.333 3.333 0 0 1 10 1.667ZM4.167 9.167a5.833 5.833 0 0 0 11.666 0M10 15v3.333M6.667 18.333h6.666" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
);

export const IconFollowUp = ({ className }: Props) => (
<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
<path d="M17.5 2.5 9.167 10.833M17.5 2.5l-5.417 15-2.916-6.25L2.5 8.333 17.5 2.5Z" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
);

export const IconChat = ({ className }: Props) => (
<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
<path d="M4.167 3.333h11.666c.92 0 1.667.746 1.667 1.667v7.5c0 .92-.746 1.667-1.667 1.667H9.167L5.833 17.5v-3.333H4.167A1.667 1.667 0 0 1 2.5 12.5V5c0-.92.746-1.667 1.667-1.667ZM6.667 7.5h6.666M6.667 10.417h4.166" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
);
