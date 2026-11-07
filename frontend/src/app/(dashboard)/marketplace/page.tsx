"use client";

import { useState, type FormEvent } from "react";
import GlassCard from "@/components/ui/GlassCard";
import { Tag, Calendar, ArrowUpRight } from "lucide-react";

type Listing = {
  id: number;
  crop: string;
  quantity: string;
  askingPrice: string;
  topBid: string | null;
  bidsCount: number;
  harvestDate: string;
  grade: string;
};

const MOCK_LISTINGS: Listing[] = [
  {
    id: 1,
    crop: "Organic BRRI Dhan-28 Rice",
    quantity: "500 kg",
    askingPrice: "৳48 / kg",
    topBid: "৳46 / kg",
    bidsCount: 4,
    harvestDate: "Nov 12, 2026",
    grade: "Grade A",
  },
  {
    id: 2,
    crop: "Fresh Red Potatoes (Granola)",
    quantity: "1200 kg",
    askingPrice: "৳22 / kg",
    topBid: "৳21.5 / kg",
    bidsCount: 8,
    harvestDate: "Nov 08, 2026",
    grade: "Grade A+",
  },
];

function formatHarvestDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

export default function MarketplacePage() {
  const [listings, setListings] = useState(MOCK_LISTINGS);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [isCreateListingOpen, setIsCreateListingOpen] = useState(false);

  function handleCreateListing(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const crop = String(formData.get("crop")).trim();
    const quantity = Number(formData.get("quantity"));
    const askingPrice = Number(formData.get("askingPrice"));
    const harvestDate = String(formData.get("harvestDate"));
    const grade = String(formData.get("grade"));

    setListings((currentListings) => [
      {
        id: Date.now(),
        crop,
        quantity: `${quantity} kg`,
        askingPrice: `৳${askingPrice} / kg`,
        topBid: null,
        bidsCount: 0,
        harvestDate: formatHarvestDate(harvestDate),
        grade,
      },
      ...currentListings,
    ]);
    setIsCreateListingOpen(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-daichi-charcoal">Produce Marketplace</h2>
          <p className="text-xs text-daichi-muted">Direct buyer bidding with transparent pricing.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setSelectedListing(null);
            setIsCreateListingOpen(true);
          }}
          className="bg-daichi-forest text-white px-5 py-2.5 rounded-warm font-medium text-sm hover:bg-daichi-forest/90 transition shadow-md"
        >
          + Create New Listing
        </button>
      </div>


            </form>
          </section>
        </div>
      )}

      {/* Glass Drawer Modal */}
      {selectedListing && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex justify-end z-50">
          <div className="w-full max-w-md glass-panel h-full p-6 space-y-6 overflow-y-auto border-l border-white/80 shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/60 pb-4">
              <h3 className="font-bold text-lg text-daichi-charcoal">{selectedListing.crop}</h3>
              <button onClick={() => setSelectedListing(null)} className="text-daichi-muted hover:text-black">✕</button>
            </div>
            <div className="space-y-4">
              <h4 className="text-xs font-semibold text-daichi-muted uppercase">Received Offers</h4>
              <div className="p-4 rounded-warm border border-white/60 bg-white/40 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-sm">Dhaka Agro Wholesalers</span>
                  <span className="font-bold text-daichi-forest">৳46 / kg</span>
                </div>
                <p className="text-xs text-daichi-muted">Payment on Delivery</p>
                <button className="w-full mt-2 bg-daichi-forest text-white text-xs py-2 rounded-warm font-medium shadow-sm">
                  Accept Bid
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}