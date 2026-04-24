import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import gsap from 'gsap';
import './PageTransition.css';

const PageTransition = forwardRef((props, ref) => {
    const wrapperRef = useRef(null);
    const pathRef = useRef(null);
    const logoRef = useRef(null);

    useImperativeHandle(ref, () => ({
        playTransition: (midPointCallback) => {
            const start = "M 0 100 V 50 Q 50 0 100 50 V 100 z";
            const end = "M 0 100 V 0 Q 50 0 100 0 V 100 z";
            
            gsap.set(wrapperRef.current, { visibility: 'visible' });
            gsap.set(pathRef.current, { attr: { d: "M 0 100 V 100 Q 50 100 100 100 V 100 z" } });
            gsap.set(logoRef.current, { opacity: 0, scale: 0.5, y: 20 });
            
            let tl = gsap.timeline({
                onComplete: () => {
                    if(midPointCallback) midPointCallback();
                    setTimeout(() => tl.reverse(), 300);
                },
                onReverseComplete: () => {
                    gsap.set(wrapperRef.current, { visibility: 'hidden' });
                }
            });

            tl.to(pathRef.current, { attr: { d: start }, duration: 0.5, ease: "power2.in" })
              .to(pathRef.current, { attr: { d: end }, duration: 0.5, ease: "power2.out" })
              .to(logoRef.current, { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "back.out(1.7)" }, "-=0.4");
        }
    }));

    return (
        <div className="transition-wrapper" ref={wrapperRef}>
            <svg className="transition-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                    <linearGradient id="grad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                        <stop offset="0.2" stopColor="#0e100f" />
                        <stop offset="0.7" stopColor="#1a1a1a" />
                    </linearGradient>
                </defs>
                <path ref={pathRef} className="path" stroke="url(#grad)" fill="url(#grad)" strokeWidth="2px" vectorEffect="non-scaling-stroke" d="M 0 100 V 100 Q 50 100 100 100 V 100 z" />
            </svg>
            <div className="transition-logo" ref={logoRef}>
                <span className="transition-logo-d">D</span>
                <span className="transition-logo-text">aenerys</span>
            </div>
        </div>
    );
});

export default PageTransition;
