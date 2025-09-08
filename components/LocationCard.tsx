"use client";

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Navigation } from 'lucide-react';

export const LocationCard = () => {
    const [isExpanded, setIsExpanded] = useState(false);

    const openBoltApp = () => {
        window.open("https://bolt.eu/en-tz/ride?lat=-6.7924&lng=39.2083", "_blank");
    };

    const openMaps = () => {
        window.open("https://maps.google.com/?q=-6.7924,39.2083", "_blank");
    };

    const description =
        "A beautiful beach with golden sands, calm waters, and breathtaking sunsets. Perfect for family outings, romantic evenings, and water sports enthusiasts.";
    const truncatedDescription =
        description.length > 100 ? description.substring(0, 100) + "..." : description;

    return (
        <Card className="group h-full hover:shadow-bold transition-all duration-300 animate-fade-in-up">
            <CardContent className="p-6 flex flex-col h-full">
                {/* Header */}
                <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                        <h3 className="text-xl font-semibold text-ocean-blue group-hover:text-sunset-orange transition-colors mb-1">
                            Sunset Beach
                        </h3>
                        <p className="text-sm text-muted-foreground">Zanzibar North Coast</p>
                    </div>
                    <Badge
                        variant="secondary"
                        className="hover:bg-savannah-gold/30"
                        style={{ backgroundColor: "rgba(255, 193, 7, 0.2)", color: "#FFC107" }}
                    >
                        $$
                    </Badge>
                </div>

                {/* Description */}
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

                {/* Category and Mood Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                    <Badge
                        variant="outline"
                        style={{
                            borderColor: "#1E90FF",
                            color: "#1E90FF",
                            backgroundColor: "rgba(30,144,255,0.1)",
                        }}
                    >
                        Beach
                    </Badge>
                    <Badge
                        variant="outline"
                        className="border-sunset-orange/50 text-sunset-orange bg-sunset-orange/10"
                    >
                        Relaxing
                    </Badge>
                    <Badge
                        variant="outline"
                        className="border-sunset-orange/50 text-sunset-orange bg-sunset-orange/10"
                    >
                        Romantic
                    </Badge>
                    <Badge variant="outline" className="border-muted text-muted-foreground">
                        +2
                    </Badge>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-auto">
                    <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 btn-mobile hover:bg-ocean-blue hover:text-white transition-colors"
                        onClick={openMaps}
                    >
                        <MapPin className="w-4 h-4 mr-2" />
                        View on Map
                    </Button>
                    <Button
                        size="sm"
                        className="flex-1 bg-coral-red hover:bg-coral-red/90 text-white btn-mobile"
                        onClick={openBoltApp}
                    >
                        <Navigation className="w-4 h-4 mr-2" />
                        Ride with Bolt
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};
