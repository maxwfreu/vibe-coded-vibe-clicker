import { useState, useEffect } from 'react';
import BigNumber from 'bignumber.js';

interface NewsMilestone {
  threshold: BigNumber;
  headline: string;
}

interface NewsReelProps {
  vibePerSecond: BigNumber;
}

// News headlines for different VPS milestones
const VPS_MILESTONES: NewsMilestone[] = [
  { threshold: new BigNumber(1), headline: "Local Developer Discovers the Power of Clicking" },
  { threshold: new BigNumber(10), headline: "Breaking: Vibe Production Reaches Double Digits" },
  { threshold: new BigNumber(50), headline: "Vibe Economy Booms as Production Soars" },
  { threshold: new BigNumber(100), headline: "Vibe Millionaire Emerges from Clicking Spree" },
  { threshold: new BigNumber(500), headline: "Scientists Baffled by Unprecedented Vibe Generation" },
  { threshold: new BigNumber(1000), headline: "Vibe Production Reaches Critical Mass" },
  { threshold: new BigNumber(5000), headline: "World Leaders Meet to Discuss Vibe Crisis" },
  { threshold: new BigNumber(10000), headline: "Vibe Production Exceeds Global GDP" },
  { threshold: new BigNumber(50000), headline: "Vibe Singularity Imminent" },
  { threshold: new BigNumber(100000), headline: "Vibe Production Breaks Space-Time Continuum" },
  { threshold: new BigNumber(500000), headline: "Vibe Production Creates New Universe" },
  { threshold: new BigNumber(1000000), headline: "Vibe Production Reaches Godlike Levels" },
];

export default function NewsReel({ vibePerSecond }: NewsReelProps) {
  const [currentHeadline, setCurrentHeadline] = useState<NewsMilestone | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [shownHeadlines, setShownHeadlines] = useState<Set<string>>(new Set());

  // Check for VPS milestones
  useEffect(() => {
    // Find the highest milestone that we've reached
    const reachedMilestones = VPS_MILESTONES.filter(m =>
      vibePerSecond.isGreaterThanOrEqualTo(m.threshold)
    );
    const highestMilestone = reachedMilestones[reachedMilestones.length - 1];

    // Only update if we have a new milestone that hasn't been shown yet
    if (highestMilestone && !shownHeadlines.has(highestMilestone.headline)) {
      setCurrentHeadline(highestMilestone);
      setIsVisible(true);
      setShownHeadlines(prev => new Set([...prev, highestMilestone.headline]));
    }
  }, [vibePerSecond, shownHeadlines]);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  if (!currentHeadline) return null;

  return (
    <div className={`toast toast-top toast-center transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="alert alert-info">
        <span>📰 {currentHeadline.headline}</span>
        <button
          onClick={() => setIsVisible(false)}
          className="btn btn-sm btn-circle btn-ghost"
        >
          ✕
        </button>
      </div>
    </div>
  );
} 