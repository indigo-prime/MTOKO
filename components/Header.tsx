"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
    IoHomeOutline,
    IoSearchOutline,
    IoLocationOutline,
    IoTrendingUpOutline,
    IoCalendarOutline,
    IoMenuOutline,
    IoFastFoodOutline,
    IoPeopleOutline,
    IoMoonOutline,
    IoInformationCircleOutline,
    IoInformationOutline,
    IoMailOutline,
    IoPersonOutline,
    IoChatbubblesOutline,
    IoBookmarkOutline,
    IoSettingsOutline,
} from "react-icons/io5";
import { SignOut } from "@/components/sign-out";
import { useSession, SessionProvider } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function Header() {
    const { data: session } = useSession();
    const pathname = usePathname();

    // Dropdown states
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAboutOpen, setIsAboutOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    // Ref for detecting outside clicks
    const navRef = useRef<HTMLDivElement | null>(null);

    // Handle outside clicks to close dropdowns
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (navRef.current && !navRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
                setIsAboutOpen(false);
                setIsProfileOpen(false);
            }
        };
        document.addEventListener("click", handleClickOutside, { capture: true });
        return () =>
            document.removeEventListener("click", handleClickOutside, {
                capture: true,
            });
    }, []);

    // Close dropdowns whenever route/path changes
    useEffect(() => {
        setIsMenuOpen(false);
        setIsAboutOpen(false);
        setIsProfileOpen(false);
    }, [pathname]);

    return (
        <SessionProvider>
            <header className="fixed top-0 left-0 w-full bg-gradient-to-br from-mtoko-light via-mtoko-secondary to-mtoko-primary py-[10px] z-[100] shadow-[0_4px_12px_rgba(0,0,0,0.15)] rounded-b-[16px]">
                <div className="max-w-[975px] mx-auto flex justify-between items-center px-[20px]">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="text-[24px] font-bold text-mtoko-light"
                    >
                        <Image src="/mtoko.png" alt="Mtoko" width={100} height={30} />
                    </Link>

                    {/* Nav Links */}
                    <nav ref={navRef} className="flex items-center gap-[22px] md:gap-[30px]">
                        <Link href="/" className="text-mtoko-light hover:text-mtoko-accent">
                            <IoHomeOutline className="text-[24px]" />
                        </Link>
                        <Link
                            href="/search"
                            className="text-mtoko-light hover:text-mtoko-accent"
                        >
                            <IoSearchOutline className="text-[24px]" />
                        </Link>
                        <Link
                            href="/near-me"
                            className="text-mtoko-light hover:text-mtoko-accent"
                        >
                            <IoLocationOutline className="text-[24px]" />
                        </Link>
                        <Link
                            href="/trending"
                            className="text-mtoko-light hover:text-mtoko-accent"
                        >
                            <IoTrendingUpOutline className="text-[24px]" />
                        </Link>

                        {/* Menu Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => {
                                    setIsMenuOpen(!isMenuOpen);
                                    setIsAboutOpen(false);
                                    setIsProfileOpen(false);
                                }}
                                className="text-mtoko-light hover:text-mtoko-accent focus:outline-none"
                            >
                                <IoMenuOutline className="text-[24px]" />
                            </button>
                            {isMenuOpen && (
                                <div className="absolute top-[2.5rem] right-0 bg-gradient-to-br from-mtoko-primary via-mtoko-secondary to-mtoko-accent rounded-[8px] p-[8px] grid gap-[4px] min-w-[150px] shadow-[0_4px_12px_rgba(0,0,0,0.15)]">
                                    <div className="absolute -top-[6px] right-[10px] w-[10px] h-[10px] bg-mtoko-primary border-t border-l border-mtoko-dark rotate-45"></div>
                                    <Link href="/category/food" className="flex items-center gap-[10px] px-[12px] py-[8px] hover:bg-mtoko-dark/50 hover:scale-105 rounded-[4px] text-mtoko-light text-[14px]">
                                        <IoFastFoodOutline className="text-[16px]" />
                                        <span>Food & Restaurants</span>
                                    </Link>
                                    <Link href="/category/family" className="flex items-center gap-[10px] px-[12px] py-[8px] hover:bg-mtoko-dark/50 hover:scale-105 rounded-[4px] text-mtoko-light text-[14px]">
                                        <IoPeopleOutline className="text-[16px]" />
                                        <span>Family & Kids</span>
                                    </Link>
                                    <Link href="/category/nightlife" className="flex items-center gap-[10px] px-[12px] py-[8px] hover:bg-mtoko-dark/50 hover:scale-105 rounded-[4px] text-mtoko-light text-[14px]">
                                        <IoMoonOutline className="text-[16px]" />
                                        <span>NightLife & Bars</span>
                                    </Link>
                                    <Link href="/category/arts-and-culture" className="flex items-center gap-[10px] px-[12px] py-[8px] hover:bg-mtoko-dark/50 hover:scale-105 rounded-[4px] text-mtoko-light text-[14px]">
                                        <IoCalendarOutline className="text-[16px]" />
                                        <span>Arts & Culture</span>
                                    </Link>
                                    <Link href="/category/nature-and-outdoor" className="flex items-center gap-[10px] px-[12px] py-[8px] hover:bg-mtoko-dark/50 hover:scale-105 rounded-[4px] text-mtoko-light text-[14px]">
                                        <IoCalendarOutline className="text-[16px]" />
                                        <span>Nature & Outdoor</span>
                                    </Link>
                                    <Link href="/category/shopping-and-lifestyle" className="flex items-center gap-[10px] px-[12px] py-[8px] hover:bg-mtoko-dark/50 hover:scale-105 rounded-[4px] text-mtoko-light text-[14px]">
                                        <IoCalendarOutline className="text-[16px]" />
                                        <span>Shopping & Lifestyle</span>
                                    </Link>
                                    <Link href="/category/events-and-experiences" className="flex items-center gap-[10px] px-[12px] py-[8px] hover:bg-mtoko-dark/50 hover:scale-105 rounded-[4px] text-mtoko-light text-[14px]">
                                        <IoCalendarOutline className="text-[16px]" />
                                        <span>Events & Experiences</span>
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* About Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => {
                                    setIsAboutOpen(!isAboutOpen);
                                    setIsMenuOpen(false);
                                    setIsProfileOpen(false);
                                }}
                                className="text-mtoko-light hover:text-mtoko-accent focus:outline-none"
                            >
                                <IoInformationCircleOutline className="text-[24px]" />
                            </button>
                            {isAboutOpen && (
                                <div className="absolute top-[2.5rem] right-0 bg-gradient-to-br from-mtoko-primary via-mtoko-secondary to-mtoko-accent rounded-[8px] p-[8px] grid gap-[4px] min-w-[150px] shadow-[0_4px_12px_rgba(0,0,0,0.15)]">
                                    <div className="absolute -top-[6px] right-[10px] w-[10px] h-[10px] bg-mtoko-primary border-t border-l border-mtoko-dark rotate-45"></div>
                                    <Link href="/about" className="flex items-center gap-[10px] px-[12px] py-[8px] hover:bg-mtoko-dark/50 hover:scale-105 rounded-[4px] text-mtoko-light text-[14px]">
                                        <IoInformationOutline className="text-[16px]" />
                                        <span>About Mtoko</span>
                                    </Link>
                                    <Link href="/contact-us" className="flex items-center gap-[10px] px-[12px] py-[8px] hover:bg-mtoko-dark/50 hover:scale-105 rounded-[4px] text-mtoko-light text-[14px]">
                                        <IoMailOutline className="text-[16px]" />
                                        <span>Contact Us</span>
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Profile Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => {
                                    setIsProfileOpen(!isProfileOpen);
                                    setIsMenuOpen(false);
                                    setIsAboutOpen(false);
                                }}
                                className="text-mtoko-light hover:text-mtoko-accent focus:outline-none"
                            >
                                <Image
                                    width={24}
                                    height={24}
                                    src={session?.user?.image || "/images/avatar.jpg"}
                                    alt="Profile"
                                    className="rounded-full"
                                />
                            </button>
                            {isProfileOpen && (
                                <div className="absolute top-[2.5rem] right-0 bg-gradient-to-br from-mtoko-primary via-mtoko-secondary to-mtoko-accent rounded-[8px] p-[8px] grid gap-[4px] min-w-[150px] shadow-[0_4px_12px_rgba(0,0,0,0.15)]">
                                    <div className="absolute -top-[6px] right-[10px] w-[10px] h-[10px] bg-mtoko-primary border-t border-l border-mtoko-dark rotate-45"></div>
                                    <Link href="/profile" className="flex items-center gap-[10px] px-[12px] py-[8px] hover:bg-mtoko-dark/50 hover:scale-105 rounded-[4px] text-mtoko-light text-[14px]">
                                        <IoPersonOutline className="text-[16px]" />
                                        <span>Profile</span>
                                    </Link>
                                    <Link href="/group-chats" className="flex items-center gap-[10px] px-[12px] py-[8px] hover:bg-mtoko-dark/50 hover:scale-105 rounded-[4px] text-mtoko-light text-[14px]">
                                        <IoChatbubblesOutline className="text-[16px]" />
                                        <span>Group Chats</span>
                                    </Link>
                                    <Link href="/saved" className="flex items-center gap-[10px] px-[12px] py-[8px] hover:bg-mtoko-dark/50 hover:scale-105 rounded-[4px] text-mtoko-light text-[14px]">
                                        <IoBookmarkOutline className="text-[16px]" />
                                        <span>Saved</span>
                                    </Link>
                                    <Link href="/reservation" className="flex items-center gap-[10px] px-[12px] py-[8px] hover:bg-mtoko-dark/50 hover:scale-105 rounded-[4px] text-mtoko-light text-[14px]">
                                        <IoCalendarOutline className="text-[16px]" />
                                        <span>Reservation</span>
                                    </Link>
                                    <Link href="/settings" className="flex items-center gap-[10px] px-[12px] py-[8px] hover:bg-mtoko-dark/50 hover:scale-105 rounded-[4px] text-mtoko-light text-[14px]">
                                        <IoSettingsOutline className="text-[16px]" />
                                        <span>Settings</span>
                                    </Link>
                                    <SignOut />
                                </div>
                            )}
                        </div>
                    </nav>
                </div>
            </header>
        </SessionProvider>
    );
}
