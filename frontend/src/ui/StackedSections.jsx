import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';
import { useGSAP } from '@gsap/react';
import { products } from '../data/products';
import './StackedSections.css';

gsap.registerPlugin(ScrollTrigger, Flip);

const StackedSections = ({ onShopClick }) => {
    const containerRef = useRef(null);
    const modalRef = useRef(null);
    const modalContentRef = useRef(null);
    const overlayRef = useRef(null);
    const activeBoxIndexRef = useRef(null);

    useGSAP(() => {
        // --- SCROLLTRIGGER STACKED SECTIONS LOGIC ---
        const panels = gsap.utils.toArray('.section', containerRef.current);
        panels.pop();

        panels.forEach((panel, i) => {
            let innerpanel = panel.querySelector(".section-inner");
            let panelHeight = innerpanel.offsetHeight;
            let windowHeight = window.innerHeight;
            let difference = panelHeight - windowHeight;
            let fakeScrollRatio = difference > 0 ? (difference / (difference + windowHeight)) : 0;
            
            if (fakeScrollRatio) {
                panel.style.marginBottom = panelHeight * fakeScrollRatio + "px";
            }
            
            let tl = gsap.timeline({
                scrollTrigger: {
                    trigger: panel,
                    start: "bottom bottom",
                    end: () => fakeScrollRatio ? `+=${innerpanel.offsetHeight}` : "bottom top",
                    pinSpacing: false,
                    pin: true,
                    scrub: true
                }
            });
            
            if (fakeScrollRatio) {
                tl.to(innerpanel, {yPercent: -100, y: windowHeight, duration: 1 / (1 - fakeScrollRatio) - 1, ease: "none"});
            }
            tl.fromTo(panel, {scale: 1, opacity: 1}, {scale: 0.7, opacity: 0.5, duration: 0.9})
              .to(panel, {opacity: 0, duration: 0.1});
        });

        // Ensure GSAP calculates heights correctly for the Footer
        ScrollTrigger.refresh();

        // --- FLIP MODAL LOGIC ---
        const boxes = gsap.utils.toArray(".boxes-container .box");
        const boxesContent = gsap.utils.toArray(".box-content");

        const closeFlip = () => {
            if (activeBoxIndexRef.current !== null) {
                const box = boxesContent[activeBoxIndexRef.current];
                const state = Flip.getState(box);
                boxes[activeBoxIndexRef.current].appendChild(box);
                activeBoxIndexRef.current = null;
                
                gsap.to([modalRef.current, overlayRef.current], {
                    autoAlpha: 0,
                    ease: "power1.inOut",
                    duration: 0.35
                });
                
                Flip.from(state, {
                    duration: 0.7,
                    ease: "power1.inOut",
                    absolute: true,
                    onComplete: () => gsap.set(box, { zIndex: "auto" })
                });
                gsap.set(box, { zIndex: 1002 });
            }
        };

        boxesContent.forEach((box, i) => {
            const handleClick = () => {
                if (activeBoxIndexRef.current === null) {
                    const state = Flip.getState(box);
                    modalContentRef.current.appendChild(box);
                    activeBoxIndexRef.current = i;
                    
                    gsap.set(modalRef.current, { autoAlpha: 1 });
                    
                    Flip.from(state, {
                        duration: 0.7,
                        ease: "power1.inOut"
                    });
                    
                    gsap.to(overlayRef.current, { autoAlpha: 0.85, duration: 0.35 });
                }
            };
            box.addEventListener("click", handleClick);
        });

        overlayRef.current.addEventListener("click", closeFlip);

    }, { scope: containerRef });

    return (
        <div className="slides-wrapper" ref={containerRef}>
            <section className="section section-1">
                <div className="section-content">
                    <div className="section-inner" style={{ paddingTop: '5vh' }}>
                        <div className="boxes-container">
                            <div className="box"><div className="box-content one"></div></div>
                            <div className="box"><div className="box-content two"></div></div>
                            <div className="box"><div className="box-content three"></div></div>
                            <div className="box"><div className="box-content four"></div></div>
                            <div className="box"><div className="box-content five"></div></div>
                            <div className="box"><div className="box-content six"></div></div>
                        </div>
                        <button className="shop-now-btn" onClick={onShopClick}>Shop Now</button>
                    </div>
                </div>
            </section>

            <section className="section section-2">
                <div className="section-content">
                    <div className="section-inner">
                        <h1>Our Heritage</h1>
                        <p>Daenerys represents the pinnacle of luxury wedding couture. For over a decade, we have dedicated ourselves to the art of bespoke tailoring, sourcing only the finest fabrics from around the globe to ensure every stitch speaks of elegance.</p>
                        <p>Our philosophy is rooted in the belief that your wedding day should be adorned with perfection. Whether it's intricately hand-embroidered bridal lehengas or impeccably tailored bespoke tuxedos, our master artisans pour their soul into every creation.</p>
                        <p>We blend traditional craftsmanship with modern silhouettes. Every sequin, every cut, and every drape is meticulously designed to reflect your unique personality and grace. At Daenerys, you are not just wearing an outfit; you are embodying a legacy of style.</p>
                        <p>Step into our world and experience a seamless journey from consultation to the final fitting. Because your special day deserves nothing less than a masterpiece.</p>
                    </div>
                </div>
            </section>
            
            <section className="section section-3">
                <div className="section-content">
                    <div className="section-inner">
                        <div className="text-content">
                            <h1>Signature Collection</h1>
                            <p>Discover our exclusive range of timeless classics and avant-garde designs. From enchanting bridal wear to distinguished groom attire, our latest collection is a tribute to eternal love and extraordinary craftsmanship.</p>
                            <button className="shop-now-btn" onClick={onShopClick}>Shop Now</button>
                        </div>
                        <img className="image" src="https://res.cloudinary.com/dl3ijmjrb/image/upload/w_500,q_auto,f_auto/v1776953780/Bride4_fqgptz.jpg" alt="Signature Bride" />
                    </div>
                </div>
            </section>

            {/* FLIP MODAL */}
            <div className="modal" ref={modalRef}>
                <div className="overlay" ref={overlayRef}></div>
                <div className="content" ref={modalContentRef}></div>
            </div>
        </div>
    );
};

export default StackedSections;
