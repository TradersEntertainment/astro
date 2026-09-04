// Biletler gişeden yay çizerek masaya gelir (MotionPath, tembel), ana bilete damga vurulur;
// ilk açılışta koçan gerçekten yırtılır, panel katlanarak açılır, görselde spot süpürmesi.
import { gsap } from '../gsap.js';
import { state } from '../state.js';
import { sfx } from '../sfx.js';

const STRAIGHT = 'polygon(0% 0%, 0% 10%, 0% 25%, 0% 40%, 0% 55%, 0% 70%, 0% 85%, 0% 100%, 100% 100%, 100% 0%)';
const JAGGED = 'polygon(0% 0%, 3% 10%, 0.5% 25%, 4% 40%, 1% 55%, 5% 70%, 2% 85%, 0% 100%, 100% 100%, 100% 0%)';

export const ticketsMotion = {
    name: 'tickets',
    sel: '.tickets',
    init(wrap, c, ctx) {
        const tickets = [...wrap.querySelectorAll('.ticket')];
        const stamp = wrap.querySelector('.stamp');
        let killed = false;

        if (tickets.length) {
            gsap.set(tickets, { opacity: 0 });
            if (stamp) gsap.set(stamp, { opacity: 0, scale: 2.6, rotation: -4, transformOrigin: '50% 50%' });

            const afterDeal = () => {
                gsap.set(tickets, { clearProps: 'transform' });
                state.ticketsDealt = true;
                document.dispatchEvent(new Event('tickets:dealt'));
                if (stamp) {
                    const host = stamp.closest('.ticket');
                    gsap.timeline()
                        .to(stamp, { opacity: 0.92, scale: 1, rotation: -12, duration: 0.38, ease: 'power4.in', onStart: () => sfx('stamp') })
                        .fromTo(host, { y: 0 }, { y: 4, duration: 0.07, yoyo: true, repeat: 1, ease: 'power1.out', clearProps: 'transform' }, '>-0.02');
                }
            };
            const deal = (withPath) => ctx.add(() => {
                const vars = {
                    opacity: 1, duration: 1.15, stagger: 0.16, ease: 'power3.out', onComplete: afterDeal,
                    scrollTrigger: { id: 'tickets', trigger: wrap, start: 'top 78%', once: true },
                };
                if (withPath) {
                    gsap.set(tickets, { transformOrigin: '50% 100%', rotation: -12, scale: 0.86 });
                    gsap.to(tickets, { ...vars, rotation: 0, scale: 1, motionPath: { path: [{ x: 640, y: 320 }, { x: 260, y: -60 }, { x: 0, y: 0 }], curviness: 1.3 } });
                } else {
                    gsap.set(tickets, { y: 70, rotation: (i) => (i % 2 ? 1.6 : -1.6), transformOrigin: '50% 100%' });
                    gsap.to(tickets, { ...vars, y: 0, rotation: 0 });
                }
            });
            import('gsap/MotionPathPlugin')
                .then(({ MotionPathPlugin }) => { if (killed) return; gsap.registerPlugin(MotionPathPlugin); deal(true); })
                .catch(() => { if (!killed) deal(false); });
        }

        const onToggle = (e) => {
            const { ticket, open } = e.detail;
            if (!wrap.contains(ticket)) return;
            const stub = ticket.querySelector('.ticket__stub');
            const inner = ticket.querySelector('.ticket__panel-inner');
            const media = ticket.querySelector('.ticket__panel .media');
            if (stub) {
                if (open && !stub.classList.contains('is-torn')) {
                    stub.classList.add('is-torn');
                    gsap.fromTo(stub, { clipPath: STRAIGHT, x: 0, rotation: 0 }, { clipPath: JAGGED, x: 8, rotation: 2.5, duration: 0.55, ease: 'power2.out', onStart: () => sfx('tear') });
                } else {
                    gsap.fromTo(stub, { x: open ? 13 : 3 }, { x: 8, duration: 0.8, ease: 'elastic.out(1, 0.4)' });
                }
            }
            if (open && inner) gsap.fromTo(inner, { rotationX: -55, opacity: 0.3, transformPerspective: 900, transformOrigin: '50% 0%' }, { rotationX: 0, opacity: 1, duration: 0.7, ease: 'power3.out', clearProps: 'transform,opacity' });
            if (open && media) gsap.fromTo(media, { '--sweep': '-130%' }, { '--sweep': '130%', duration: 1.1, ease: 'power2.inOut', delay: 0.25 });
        };
        document.addEventListener('ticket:toggle', onToggle);
        return () => { killed = true; document.removeEventListener('ticket:toggle', onToggle); };
    },
};
