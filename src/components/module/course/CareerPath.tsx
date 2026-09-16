"use client";

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import RocketImg from "@/assets/images/rocket.png";
import RocketReverseImg from "@/assets/images/rocket-reverse.png";
import { fullStackPath, SingleMission } from './careerPathData';




export default function CareerPath() {
    const [gsapLoaded, setGsapLoaded] = useState(false);
    const rocketRef = useRef<HTMLImageElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const pathRef = useRef<SVGPathElement>(null);
    const [isFlipped, setIsFlipped] = useState<boolean>(false);
    const [isSmDevice, setIsSmDevice] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsSmDevice(window.innerWidth <= 900);
        };

        checkScreenSize();
        window.addEventListener("resize", checkScreenSize);
        return () => window.removeEventListener("resize", checkScreenSize);
    }, [isSmDevice]);

    useEffect(() => {
        const loadGsap = async () => {
            const gsapModule = await import('gsap');
            const MotionPathPlugin = (await import('gsap/MotionPathPlugin'))
                .MotionPathPlugin;
            const ScrollTrigger = (await import('gsap/ScrollTrigger')).ScrollTrigger;

            gsapModule.gsap.registerPlugin(MotionPathPlugin, ScrollTrigger);

            if (rocketRef.current && scrollRef.current && pathRef.current) {

                let previousScroll = 0;

                gsapModule.gsap.to(rocketRef.current, {
                    motionPath: {
                        path: pathRef.current,
                        align: pathRef.current,
                        autoRotate: true, // Auto-align with path
                        alignOrigin: [0.5, 0.5],
                    },
                    duration: 2.5, // Adjust speed (higher = slower)
                    ease: "linear",
                    scrollTrigger: {
                        trigger: scrollRef.current,
                        start: 'top top',
                        end: 'bottom bottom',
                        scrub: 0.5,
                        onUpdate: (self: { progress: number }) => {

                            const currentScroll = self.progress;
                            // Check if the scroll direction has changed
                            if (currentScroll < previousScroll) {
                                // Scrolling up - flip the image
                                setIsFlipped(true);
                            } else if (currentScroll > previousScroll) {
                                // Scrolling down - reset to the normal image
                                setIsFlipped(false);
                            }
                            previousScroll = currentScroll;
                        },
                    },
                });
            }
        };
        if (typeof window !== 'undefined') {
            setGsapLoaded(true);
            loadGsap();
        }
    }, [isSmDevice]);

    return (
        <div ref={scrollRef} className="mt-40 md:mt-10">
            <section className="relative px-4 sm:px-6 md:px-16 pb-10 md:pb-12">
                <div className="">
                    <div className="w-full py-4 md:py-8">
                        <div className="text-center mb-12">
                            <h1 className='text-[28px] md:text-3xl lg:text-4xl font-bold font-monaExpanded uppercase w-4/5 mx-auto'>What You’ll Gain from <br className='hidden lg:block' /> the <span className='text-primary'>Full-Stack_ Career Path</span></h1>
                            <p className='text-[16px] mt-4'>A Summary of the Key Skills and Concepts Covered in This Journey</p>

                        </div>

                        <div className="relative">
                            {/* Line  */}

                            <svg
                                className='absolute w-full top-60 left-0 h-[4365px] hidden lg:block'
                                width="563"
                                height="3522"
                                viewBox="0 0 563 3522"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    ref={pathRef}
                                    d="M15 1H514C540.51 1 562 22.4903 562 49V284.5C562 311.01 540.51 332.5 514 332.5H55C28.4903 332.5 7 353.99 7 380.5V602C7 628.51 28.4903 650 55 650H514C540.51 650 562 671.49 562 698V935.5C562 962.01 540.51 983.5 514 983.5H49.5C22.9903 983.5 1.5 1004.99 1.5 1031.5V1234C1.5 1260.51 22.9903 1282 49.5 1282H514C540.51 1282 562 1303.49 562 1330V1595C562 1621.51 540.51 1643 514 1643H49.5C22.9903 1643 1.5 1664.49 1.5 1691V1921C1.5 1947.51 22.9903 1969 49.5 1969H514C540.51 1969 562 1990.49 562 2017V2242C562 2268.51 540.51 2290 514 2290H49.5C22.9903 2290 1.5 2311.49 1.5 2338V2565C1.5 2591.51 22.9903 2613 49.5 2613H514C540.51 2613 562 2634.49 562 2661V2820V2888C562 2914.51 540.51 2936 514 2936H49.5C22.9903 2936 1.5 2957.49 1.5 2984V3209.5C1.5 3236.01 22.9903 3257.5 49.5 3257.5H514C540.51 3257.5 562 3278.99 562 3305.5V3522"
                                    stroke="#FFCBC1"
                                    strokeWidth="2"
                                    strokeDasharray="6 12"
                                >
                                    <animate
                                        attributeName="stroke-dashoffset"
                                        from="120"
                                        to="0"
                                        dur="8s"
                                        repeatCount="indefinite"
                                    />
                                </path>
                            </svg>


                            {gsapLoaded ? (
                                <Image
                                    ref={rocketRef}
                                    height={36}
                                    width={70}
                                    src={
                                        isFlipped
                                            ? RocketReverseImg
                                            : RocketImg
                                    }
                                    alt="Rocket"
                                    className="absolute top-0 left-0 pointer-events-none hidden lg:block"
                                />
                            ) : null}
                        </div>





                        <div className="max-w-7xl mx-auto">
                            <div className='hidden lg:block'>
                                <div className="mt-5 pt-5 sm:pt-0 relative grid gap-y-20 grid-cols-1 sm:grid-cols-2">
                                    {fullStackPath.map(({ title, topics, badge }, i) => (
                                        <div
                                            key={title}
                                            className={`mt-${i == 0 && 20} h-80 py-auto col-start-${(i + 1) % 2 === 0 ? 2 : 1} row-start-${i + 1}`}
                                        >
                                            <SingleMission
                                                title={title}
                                                topics={topics}
                                                badge={badge}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className='block lg:hidden'>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                    {fullStackPath.map(({ title, topics, badge }) => (
                                        <div
                                            key={title}
                                        >
                                            <SingleMission
                                                title={title}
                                                topics={topics}
                                                badge={badge}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

