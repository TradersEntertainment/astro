// Tabela ampulleri: tek tur kovalama, sonra rastgele nefes. Görünümde değilken durur.
import { gsap, ScrollTrigger } from '../gsap.js';

export const marquee = {
    name: 'marquee',
    sel: '.marquee',
    init() {
        const cleanups = [...document.querySelectorAll('.marquee')].map((m) => {
            const bulbs = [...m.querySelectorAll('.marquee__bulb')];
            if (!bulbs.length) return () => {};
            gsap.set(bulbs, { opacity: 0.3 });
            const tl = gsap.timeline({ paused: true });
            tl.to(bulbs, { opacity: 1, duration: 0.12, stagger: { each: 0.06, repeat: 1, yoyo: true } })
              .to(bulbs, { opacity: 0.95, duration: 0.9, yoyo: true, repeat: -1, ease: 'sine.inOut', stagger: { each: 0.11, from: 'random' } }, '>-0.1');
            const st = ScrollTrigger.create({
                trigger: m, start: 'top 95%', end: 'bottom 5%',
                onToggle: (self) => (self.isActive ? tl.play() : tl.pause()),
            });
            return () => { st.kill(); tl.kill(); };
        });
        return () => cleanups.forEach((f) => f());
    },
};
