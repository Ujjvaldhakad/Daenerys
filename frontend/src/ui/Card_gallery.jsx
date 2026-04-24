import React, { useRef } from 'react';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { useGSAP } from '@gsap/react';
import './Ui.css';

gsap.registerPlugin(Draggable);

const Card_gallery = () => {
    const galleryRef = useRef(null);
    const cardsRef = useRef(null);
    const dragProxyRef = useRef(null);

    const products = [
        { image: "https://res.cloudinary.com/dl3ijmjrb/image/upload/w_500,q_auto,f_auto/v1776953769/Bride1_hsnhyx.jpg", name: "Classic Bride", product: "Bridal Lehenga", price: "$1,200" },
        { image: "https://res.cloudinary.com/dl3ijmjrb/image/upload/w_500,q_auto,f_auto/v1776953772/Groom1_rnrglp.jpg", name: "Classic Groom", product: "Sherwani Suit", price: "$1,100" },
        { image: "https://res.cloudinary.com/dl3ijmjrb/image/upload/w_500,q_auto,f_auto/v1776953769/Bride2_jer20c.jpg", name: "Elegant Bride", product: "Designer Lehenga", price: "$1,500" },
        { image: "https://res.cloudinary.com/dl3ijmjrb/image/upload/w_500,q_auto,f_auto/v1776953777/Groom2_lbeoap.jpg", name: "Elegant Groom", product: "Jodhpuri Suit", price: "$1,300" },
        { image: "https://res.cloudinary.com/dl3ijmjrb/image/upload/w_500,q_auto,f_auto/v1776953775/Bride3_qwc3a9.jpg", name: "Royal Bride", product: "Wedding Saree", price: "$2,000" },
        { image: "https://res.cloudinary.com/dl3ijmjrb/image/upload/w_500,q_auto,f_auto/v1776953772/Groom3_ruzuxw.jpg", name: "Royal Groom", product: "Designer Sherwani", price: "$1,800" },
        { image: "https://res.cloudinary.com/dl3ijmjrb/image/upload/w_500,q_auto,f_auto/v1776953780/Bride4_fqgptz.jpg", name: "Modern Bride", product: "Indo-Western Gown", price: "$1,350" },
        { image: "https://res.cloudinary.com/dl3ijmjrb/image/upload/w_500,q_auto,f_auto/v1776953766/Groom4_mgqoe3.jpg", name: "Modern Groom", product: "Tuxedo Suit", price: "$1,200" },
        { image: "https://res.cloudinary.com/dl3ijmjrb/image/upload/w_500,q_auto,f_auto/v1776953777/Bride5_thnomb.jpg", name: "Vintage Bride", product: "Traditional Lehenga", price: "$1,800" },
        { image: "https://res.cloudinary.com/dl3ijmjrb/image/upload/w_500,q_auto,f_auto/v1776953768/Groom5_la7sre.jpg", name: "Vintage Groom", product: "Kurta Set", price: "$900" },
    ];
    
    // Repeat items to ensure smooth infinite auto-scrolling
    const galleryItems = [...products, ...products, ...products];

    useGSAP(() => {
        gsap.set('.cards li', { xPercent: 400, opacity: 0, scale: 0 });

        const spacing = 0.1,
            cards = gsap.utils.toArray('.cards li'),
            animateFunc = element => {
                const tl = gsap.timeline();
                tl.fromTo(element, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, zIndex: 100, duration: 0.5, yoyo: true, repeat: 1, ease: "power1.in", immediateRender: false })
                    .fromTo(element, { xPercent: 400 }, { xPercent: -400, duration: 1, ease: "none", immediateRender: false }, 0);
                return tl;
            },

            buildSeamlessLoop = (items, spacing, animateFunc) => {
                let overlap = Math.ceil(1 / spacing),
                    startTime = items.length * spacing + 0.5,
                    loopTime = (items.length + overlap) * spacing + 1,
                    rawSequence = gsap.timeline({ paused: true }),
                    seamlessLoop = gsap.timeline({
                        paused: true,
                        repeat: -1,
                        onRepeat() {
                            this._time === this._dur && (this._tTime += this._dur - 0.01);
                        }
                    }),
                    l = items.length + overlap * 2,
                    time, i, index;

                for (i = 0; i < l; i++) {
                    index = i % items.length;
                    time = i * spacing;
                    rawSequence.add(animateFunc(items[index]), time);
                    i <= items.length && seamlessLoop.add("label" + i, time);
                }

                rawSequence.time(startTime);
                seamlessLoop.to(rawSequence, {
                    time: loopTime,
                    duration: loopTime - startTime,
                    ease: "none"
                }).fromTo(rawSequence, { time: overlap * spacing + 1 }, {
                    time: startTime,
                    duration: startTime - (overlap * spacing + 1),
                    immediateRender: false,
                    ease: "none"
                });
                return seamlessLoop;
            },
            seamlessLoop = buildSeamlessLoop(cards, spacing, animateFunc),
            playhead = { offset: 0 },
            wrapTime = gsap.utils.wrap(0, seamlessLoop.duration()),
            scrub = gsap.to(playhead, {
                offset: 0,
                onUpdate() {
                    seamlessLoop.time(wrapTime(playhead.offset));
                },
                duration: 0.5,
                ease: "power3",
                paused: true
            });

        seamlessLoop.time(wrapTime(0));

        let autoplayTimer;
        
        function scrollToOffset(offset) { 
            scrub.vars.offset = offset;
            scrub.invalidate().restart();
            resetAutoplay();
        }

        function resetAutoplay() {
            clearInterval(autoplayTimer);
            autoplayTimer = setInterval(() => {
                scrollToOffset(scrub.vars.offset + spacing);
            }, 1500);
        }

        resetAutoplay();

        const handleNextClick = () => scrollToOffset(scrub.vars.offset + spacing);
        const handlePrevClick = () => scrollToOffset(scrub.vars.offset - spacing);

        const nextBtn = document.querySelector(".next");
        const prevBtn = document.querySelector(".prev");

        if (nextBtn && prevBtn) {
            nextBtn.addEventListener("click", handleNextClick);
            prevBtn.addEventListener("click", handlePrevClick);
        }

        const draggable = Draggable.create(dragProxyRef.current, {
            type: "x",
            trigger: cardsRef.current,
            onPress() {
                clearInterval(autoplayTimer);
                this.startOffset = scrub.vars.offset;
            },
            onDrag() {
                let newOffset = this.startOffset + (this.startX - this.x) * 0.001;
                scrub.vars.offset = newOffset;
                scrub.invalidate().restart(); 
            },
            onDragEnd() {
                const snapTime = gsap.utils.snap(spacing);
                scrollToOffset(snapTime(scrub.vars.offset));
            }
        });

        const handleMouseEnter = () => clearInterval(autoplayTimer);
        const handleMouseLeave = () => resetAutoplay();

        galleryRef.current.addEventListener('mouseenter', handleMouseEnter);
        galleryRef.current.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            clearInterval(autoplayTimer);
            if (nextBtn && prevBtn) {
                nextBtn.removeEventListener("click", handleNextClick);
                prevBtn.removeEventListener("click", handlePrevClick);
            }
            if (draggable && draggable[0]) {
                draggable[0].kill();
            }
            if (galleryRef.current) {
                galleryRef.current.removeEventListener('mouseenter', handleMouseEnter);
                galleryRef.current.removeEventListener('mouseleave', handleMouseLeave);
            }
        };

    }, { scope: galleryRef });

    return (
        <div className="card-container">
            <div className="gallery" ref={galleryRef}>
                <ul className="cards" ref={cardsRef}>
                    {galleryItems.map((item, index) => (
                        <li key={index} style={{ backgroundImage: `url(${item.image})` }}>
                            <div className="card-info">
                                <h3>{item.name}</h3>
                                <p>{item.product}</p>
                                <p className="price">{item.price}</p>
                            </div>
                        </li>
                    ))}
                </ul>
                <div className="actions">
                    <button className="prev">Prev</button>
                    <button className="next">Next</button>
                </div>
            </div>
            <div className="drag-proxy" ref={dragProxyRef}></div>
        </div>
    );
};

export default Card_gallery;