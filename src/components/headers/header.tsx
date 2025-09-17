"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"

export default function Header() {

    const [scrolled, setScrolled] = useState(false);
    const router = useRouter();

    const topElements = [
        { id: 1, title: 'Main', link: '/' },
        { id: 2, title: 'Solutions', link: '/solutions' },
        { id: 3, title: 'Institutions', link: '/institutions' },
        { id: 4, title: 'Stake', link: '/stake'}
    ];

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header 
            className={`w-full py-5 bg-[#E5E7EB] flex flex-row gap-10 justify-center items-center fixed top-0 left-0 transition-opacity duration-300 ${scrolled ? 'opacity-70' : 'opacity-100'}`}
        >
            {topElements.map((element) => (
                <a 
                    className="text-3xl text-[#2563EB] cursor-pointer hover:bg-blue-200 rounded-md duration-150 px-3 py-2 text-bitcount" 
                    key={element.id}
                    onClick={() => router.push(element.link)}    
                > 
                        {element.title} 
                </a>
            ))}
        </header>
    );
}