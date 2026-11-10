// Animation libraries are bundled (no CDN). app.js reads them from window.
import { gsap } from 'gsap';
import { animate, inView } from 'motion';
window.gsap = gsap;
window.Motion = { animate, inView };
