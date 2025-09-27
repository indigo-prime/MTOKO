import ClientImageRotator from "./ImageBackgroundRotator";


const ITEMS: { src: string; leftText: string; rightText: string }[] = [
   { src: "/images/beach-B3.png", leftText: "Sun. Sand. Smiles", rightText: "chill vibes with Mtoko!" },
  { src: "/images/hotel-B5.jpg", leftText: "Your Poolside Escape ", rightText: "Starts with Mtoko 🏖️" },
  { src: "/images/night-club-B2.jpg", leftText: "Nightlife with us 🔥", rightText: "makes the night feel alive" },
  { src: "/images/pizza-B1.png", leftText: "Take a slice", rightText: "One Bite. Endless Joy" },
];

export default function VideoBackgroundSection() {
  const items = ITEMS && ITEMS.length > 0
    ? ITEMS
    : [{ src: "/images/beach-B3.png", leftText: "Explore", rightText: "something new!" }];

  return (
    <section className="relative h-screen w-full overflow-hidden">
      <ClientImageRotator items={items} />
    </section>
  );
}
