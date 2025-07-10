/**
 * Animated subtitle component for the app header using FlipWords
 */

import { FlipWords } from "./flip-words";

// Convert category enum to readable words that work without "items"
const categoryWords = [
  "clothing",
  "electronics", 
  "furniture",
  "jewelry",
  "footwear",
  "decor",
  "books",
  "sportswear",
  "cosmetics",
  "kitchenware",
  "toys",
  "supplements",
  "tools",
  "stationery",
  "accessories",
  "games"
];

interface AnimatedSubtitleProps {
  className?: string;
}

const AnimatedSubtitle = ({ className = "" }: AnimatedSubtitleProps) => {
  return (
    <div className={`text-gray-400 max-w-lg mx-auto text-center ${className}`}>
      <div>
        Upload any image, AI identifies{" "}
        <span className="inline-block w-16 text-left">        <FlipWords 
          words={categoryWords} 
          duration={1000}
          className="!text-[#30B3A4] font-semibold px-0"
        />
        </span>
      </div>
      <div>
        and finds matches instantly!
      </div>
    </div>
  );
};

export default AnimatedSubtitle;
