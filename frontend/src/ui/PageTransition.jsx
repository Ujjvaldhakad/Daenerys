import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import gsap from 'gsap';
import './PageTransition.css';

const PageTransition = forwardRef((props, ref) => {
    const wrapperRef = useRef(null);
    const pathRef = useRef(null);

    useImperativeHandle(ref, () => ({
        playTransition: (midPointCallback) => {
            const start = "M 0 100 V 50 Q 50 0 100 50 V 100 z";
            const end = "M 0 100 V 0 Q 50 0 100 0 V 100 z";
            
            gsap.set(wrapperRef.current, { visibility: 'visible' });
            gsap.set(pathRef.current, { attr: { d: "M 0 100 V 100 Q 50 100 100 100 V 100 z" } });
            
            let tl = gsap.timeline({
                onComplete: () => {
                    if(midPointCallback) midPointCallback();
                    
                    // Small delay to ensure React renders the new page
                    setTimeout(() => tl.reverse(), 100);
                },
                onReverseComplete: () => {
                    gsap.set(wrapperRef.current, { visibility: 'hidden' });
                }
            });

            tl.to(pathRef.current, { attr: { d: start }, duration: 0.5, ease: "power2.in" })
              .to(pathRef.current, { attr: { d: end }, duration: 0.5, ease: "power2.out" });
        }
    }));

    return (
        <div className="transition-wrapper" ref={wrapperRef}>
            <svg className="transition-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                    <linearGradient id="grad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                        <stop offset="0.2" stopColor="rgb(255, 135, 9)" />
                        <stop offset="0.7" stopColor="rgb(247, 189, 248)" />
                    </linearGradient>
                </defs>
                <path ref={pathRef} className="path" stroke="url(#grad)" fill="url(#grad)" strokeWidth="2px" vectorEffect="non-scaling-stroke" d="M 0 100 V 100 Q 50 100 100 100 V 100 z" />
            </svg>
        </div>
    );
});

export default PageTransition;
