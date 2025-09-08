"use client";

import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faRegularHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as faSolidHeart } from "@fortawesome/free-solid-svg-icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

interface PlaceCardProps {
    placeId: string;
    username?: string | null;
    avatarSrc?: string | null;
    name?: string | null;
    imageSrc?: string | null;
    likes?: number;
    location?: string | null;
    categories?: string[];
    moods?: string[];
    priceMin?: number;
    priceMax?: number;
    description?: string | null;
    onUnsave?: () => void; // 🔥 callback prop
}

export default function PlaceCard2({
                                       placeId,
                                       username = "Unknown",
                                       avatarSrc = "/default-avatar.png",
                                       name,
                                       imageSrc = "/default-image.jpg",
                                       likes = 0,
                                       location = "Unknown",
                                       categories = [],
                                       moods = [],
                                       priceMin = 0,
                                       priceMax = 0,
                                       description = "",
                                       onUnsave,
                                   }: PlaceCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [hasLiked, setHasLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(likes);
    const [message, setMessage] = useState<string | null>(null);

    const { data: session, status } = useSession();

    const truncatedDescription =
        (description ?? "").length > 100
            ? (description ?? "").substring(0, 100) + "..."
            : description ?? "";

    const currencyFormatter = new Intl.NumberFormat("sw-TZ", {
        style: "currency",
        currency: "TZS",
        maximumFractionDigits: 0,
    });

    useEffect(() => {
        if (!placeId) return;
        (async () => {
            try {
                const res = await fetch(`/api/place/status?placeId=${placeId}`, {
                    method: "GET",
                    credentials: "include",
                });
                if (!res.ok) throw new Error("status failed");
                const data = await res.json();
                setHasLiked(Boolean(data.liked));
                setIsBookmarked(Boolean(data.saved));
                setLikeCount(typeof data.likeCount === "number" ? data.likeCount : likes);
            } catch (e) {
                console.error(e);
                showMessage("Failed to load user actions");
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [placeId, status]);

    const showMessage = (text: string) => {
        setMessage(text);
        setTimeout(() => setMessage(null), 2500);
    };

    const requireLogin = async () => {
        if (!session?.user?.id) {
            await signIn();
            return false;
        }
        return true;
    };

    const handleLike = async () => {
        if (!(await requireLogin())) return;
        try {
            const res = await fetch("/api/place/like", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ placeId }),
            });
            if (!res.ok) throw new Error("like failed");
            const data = await res.json();
            setHasLiked(Boolean(data.liked));
            if (typeof data.likeCount === "number") setLikeCount(data.likeCount);

            toast.success(data.liked ? "❤️ Place liked!" : "💔 Place unliked!");
        } catch (e) {
            console.error(e);
            toast.error("Failed to update like");
        }
    };

    const handleBookmark = async () => {
        if (!(await requireLogin())) return;
        try {
            const res = await fetch("/api/place/bookmark", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ placeId }),
            });
            if (!res.ok) throw new Error("bookmark failed");
            const data = await res.json();
            setIsBookmarked(Boolean(data.saved));

            toast.success(data.saved ? "🔖 Place saved!" : "❌ Place unsaved!");

            if (!data.saved && onUnsave) {
                onUnsave();
            }
        } catch (e) {
            console.error(e);
            toast.error("Failed to update bookmark");
        }
    };

    return (
        <div className="bg-white border border-transparent rounded-lg mb-6 relative w-full max-w-[935px] mx-2">


            <div className="flex justify-between items-center p-[14px_16px]">
                <div className="flex items-center gap-2.5">

                    <Link href={`/places/${placeId}`}>
                        <span className="font-semibold text-sm text-mtoko-dark">{username}</span>
                    </Link>
                </div>

                <FontAwesomeIcon
                    icon={faBookmark}
                    className={`text-[24px] cursor-pointer ${
                        isBookmarked ? "text-mtoko-primary" : "hover:text-mtoko-primary"
                    }`}
                    onClick={handleBookmark}
                />
            </div>

            <div className="w-full relative">
                <Image
                    src={imageSrc}
                    alt={name || "Place"}
                    width={800}
                    height={500}
                    className="w-full h-64 sm:h-72 md:h-80 lg:h-96 object-cover rounded-md"
                />
            </div>

            <div className="px-4 pb-4">
                <p className="text-muted-foreground mb-4 flex-1">
                    {isExpanded ? description : truncatedDescription}
                    {description.length > 100 && (
                        <Button
                            variant="link"
                            size="sm"
                            className="p-0 h-auto text-sunset-orange"
                            onClick={() => setIsExpanded(!isExpanded)}
                        >
                            {isExpanded ? "Show Less" : "Read More"}
                        </Button>
                    )}
                </p>

                <div className="flex items-center gap-2 text-sm text-mtoko-dark mb-4">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-[20px] text-mtoko-secondary" />
                    <span>{location}</span>
                </div>

                <div className="flex flex-col gap-2 mb-4">
                    <div className="flex flex-wrap gap-2">
                        {categories.map((category, i) => (
                            <Badge
                                key={i}
                                variant="outline"
                                style={{
                                    borderColor: "#28A745",
                                    color: "#28A745",
                                    backgroundColor: "rgba(40,167,69,0.1)",
                                    fontSize: "12px",
                                }}
                            >
                                {category}
                            </Badge>
                        ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {moods.map((mood, i) => (
                            <Badge
                                key={i}
                                variant="outline"
                                style={{
                                    borderColor: "#1E90FF",
                                    color: "#1E90FF",
                                    backgroundColor: "rgba(30,144,255,0.1)",
                                    fontSize: "12px",
                                }}
                            >
                                {mood}
                            </Badge>
                        ))}
                    </div>
                </div>

                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={handleLike}>
                        <FontAwesomeIcon
                            icon={hasLiked ? faSolidHeart : faRegularHeart}
                            className={`text-[20px] ${hasLiked ? "text-red-500" : "text-gray-500"}`}
                        />
                        <span className="text-sm text-mtoko-dark">{likeCount} Likes</span>
                    </div>

                    <Badge
                        variant="secondary"
                        className="px-4 py-2 text-[14px] bg-mtoko-secondary text-mtoko-light hover:bg-savannah-gold/30"
                    >
                        {currencyFormatter.format(priceMin)} - {currencyFormatter.format(priceMax)}
                    </Badge>
                </div>
            </div>
        </div>
    );
}
