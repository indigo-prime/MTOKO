export async function fetchGooglePlaces(searchTerm: string) {
    try {
        const res = await fetch(`/api/google/places`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ searchTerm }),
        });

        if (!res.ok) {
            console.error("Failed to fetch places", res.statusText);
            return [];
        }

        const data = await res.json();
        return data.places || [];
    } catch (error) {
        console.error("Error fetching places:", error);
        return [];
    }
}
