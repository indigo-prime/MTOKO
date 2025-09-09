"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { IoCafeOutline } from "react-icons/io5";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter, Check } from "lucide-react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { supabase } from "@/lib/supabase";

export interface FilterValues {
    searchTerm: string;
    selectedMood: string;
    selectedCategories: string[];
    priceRange: [number, number];
}

interface CombinedSearchFilterProps {
    onFilterChange: (filters: FilterValues) => void;
}

interface Category {
    name: string;
    image: string | null;
}

export default function CombinedSearchFilter3({ onFilterChange }: CombinedSearchFilterProps) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [categoryError, setCategoryError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedMood, setSelectedMood] = useState("All");
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState<[number, number]>([2000, 10000]);

    const min = 0;
    const max = 15000;
    const step = 500;

    const currencyFormatter = new Intl.NumberFormat("sw-TZ", {
        style: "currency",
        currency: "TZS",
        maximumFractionDigits: 0,
    });

    // Match database mood values (uppercase, underscore)
    const moods = [
        "All",
        "ROMANTIC",
        "FAMILY_FRIENDLY",
        "ADVENTUROUS",
        "CULTURAL",
        "RELAXED",
        "BUSINESS",
        "EDUCATIONAL",
        "SHOPPING",
        "HISTORICAL",
    ];

    // Fetch categories from SubCategory table
    useEffect(() => {
        async function fetchCategories() {
            try {
                const { data, error } = await supabase.from("SubCategory").select("name, imageUrl");

                if (error) {
                    console.error("Error fetching categories:", error);
                    setCategoryError(`Failed to load categories: ${error.message}`);
                    return;
                }

                const fetchedCategories: Category[] = data.map((item: any) => ({
                    name: item.name,
                    image: item.imageUrl || null,
                }));

                setCategories(fetchedCategories);
            } catch (err: any) {
                console.error("Unexpected error fetching categories:", err);
                setCategoryError("Unexpected error occurred while loading categories");
            } finally {
                setLoadingCategories(false);
            }
        }

        fetchCategories();
    }, []);

    // Emit filter changes when state updates
    useEffect(() => {
        onFilterChange({
            searchTerm,
            selectedMood,
            selectedCategories,
            priceRange,
        });
    }, [searchTerm, selectedMood, selectedCategories, priceRange, onFilterChange]);

    const toggleCategory = (categoryName: string) => {
        setSelectedCategories((prev) => {
            const next = prev.includes(categoryName)
                ? prev.filter((c) => c !== categoryName)
                : [...prev, categoryName];
            return next;
        });
    };

    if (categoryError) {
        return <p className="text-red-500">{categoryError}</p>;
    }

    if (loadingCategories) {
        return <p>Loading categories...</p>;
    }

    return (
        <div className="space-y-6">
            {/* Category scroller */}
            <section className="mt-[72px] px-[20px] sm:px-[10px] md:px-[15px]">
                <div className="max-w-[935px] mx-auto">
                    <div className="bg-gradient-to-br from-mtoko-light via-mtoko-secondary to-mtoko-primary rounded-[16px] p-[20px] overflow-x-auto whitespace-nowrap shadow-[0_4px_12px_rgba(0,0,0,0.15)]">
                        <div className="inline-flex gap-[20px]">
                            {categories.map((category) => {
                                const isSelected = selectedCategories.includes(category.name);
                                return (
                                    <button
                                        type="button"
                                        key={category.name}
                                        onClick={() => toggleCategory(category.name)}
                                        className="flex flex-col items-center text-mtoko-light w-[70px] flex-shrink-0 cursor-pointer hover:scale-105 transition-transform duration-300 relative focus:outline-none"
                                        aria-pressed={isSelected}
                                        title={category.name}
                                    >
                                        <div className="w-[70px] h-[70px] rounded-full p-[3px] bg-mtoko-light flex items-center justify-center relative">
                                            {category.image ? (
                                                <Image
                                                    src={category.image}
                                                    width={100}
                                                    height={100}
                                                    alt={category.name}
                                                    className="w-full h-full rounded-full border-2 border-mtoko-primary object-cover"
                                                />
                                            ) : (
                                                <IoCafeOutline className="w-full h-full text-mtoko-primary" />
                                            )}
                                            {isSelected && (
                                                <Check className="absolute top-0 right-0 w-5 h-5 text-green-500 bg-white rounded-full p-1" />
                                            )}
                                        </div>
                                        <span className="mt-[8px] text-[14px] font-medium text-center text-mtoko-light max-w-[70px] truncate">
                      {category.name}
                    </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* Filters card */}
            <Card className="mb-8 shadow-soft max-w-[935px] mx-auto">
                <CardContent className="p-6 space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                        <Filter className="w-5 h-5 text-sunset-orange" />
                        <h3 className="text-lg font-semibold text-ocean-blue">Filters</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Search by location/name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Location / Name
                            </label>
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder="Search places..."
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                    }}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        {/* Mood */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mood</label>
                            <Select
                                value={selectedMood}
                                onValueChange={(value) => {
                                    setSelectedMood(value);
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Mood" />
                                </SelectTrigger>
                                <SelectContent>
                                    {moods && moods.length > 0 ? (
                                        moods.map((mood) => (
                                            <SelectItem key={mood} value={mood}>
                                                {mood.replace("_", " ")} {/* Display user-friendly mood names */}
                                            </SelectItem>
                                        ))
                                    ) : (
                                        <SelectItem value="none" disabled>
                                            No moods available
                                        </SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Price Range */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Price Range
                        </label>
                        <div className="flex justify-between text-xs text-gray-600 mb-2">
                            <span>{currencyFormatter.format(priceRange[0])}</span>
                            <span>{currencyFormatter.format(priceRange[1])}</span>
                        </div>
                        <Slider
                            range
                            min={min}
                            max={max}
                            step={step}
                            value={priceRange}
                            onChange={(val) => {
                                const newRange = val as [number, number];
                                setPriceRange(newRange);
                            }}
                            railStyle={{ backgroundColor: "#ccc", height: 6 }}
                            trackStyle={{ backgroundColor: "#FF6B00", height: 6 }}
                            handleStyle={{
                                width: 18,
                                height: 18,
                                border: "2px solid #FF6B00",
                                backgroundColor: "#fff",
                            }}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}