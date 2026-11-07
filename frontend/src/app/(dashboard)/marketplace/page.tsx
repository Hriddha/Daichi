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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {listings.map((item) => (
          <GlassCard key={item.id}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="inline-block px-3 py-1 bg-daichi-sand/60 text-daichi-forest text-xs font-semibold rounded-full mb-2">
                  {item.grade}
                </span>
                <h3 className="text-lg font-bold text-daichi-charcoal">{item.crop}</h3>
              </div>
              <span className="text-xl font-bold text-daichi-forest">{item.askingPrice}</span>
            </div>

            <div className="space-y-2 text-xs text-daichi-muted mb-6">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-daichi-sage" />
                <span>Quantity: <strong className="text-daichi-charcoal">{item.quantity}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-daichi-sage" />
                <span>Harvest Date: {item.harvestDate}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-white/60 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-daichi-muted uppercase tracking-wider">Current High Bid</p>
                <p className="text-base font-bold text-daichi-clay">
                  {item.topBid ?? "No bids yet"}{" "}
                  {item.bidsCount > 0 && (
                    <span className="text-xs font-normal text-daichi-muted">({item.bidsCount} offers)</span>
                  )}
                </p>
              </div>
              <button 
                onClick={() => {
                  setIsCreateListingOpen(false);
                  setSelectedListing(item);
                }}
                type="button"
                className="flex items-center gap-1 text-xs font-bold text-daichi-forest hover:underline"
              >
                View Bids <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </GlassCard>
        ))}
      </div>

      {isCreateListingOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm flex justify-end z-50"
          onClick={() => setIsCreateListingOpen(false)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-listing-title"
            className="w-full max-w-md glass-panel h-full p-6 space-y-6 overflow-y-auto border-l border-white/80 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-white/60 pb-4">
              <h3 id="create-listing-title" className="font-bold text-lg text-daichi-charcoal">
                Create New Listing
              </h3>
              <button
                type="button"
                onClick={() => setIsCreateListingOpen(false)}
                aria-label="Close create listing form"
                className="text-daichi-muted hover:text-black"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateListing} className="space-y-4">
              <label className="block space-y-1 text-sm font-medium text-daichi-charcoal">
                Crop name
                <input
                  name="crop"
                  required
                  maxLength={100}
                  className="w-full rounded-warm border border-white/80 bg-white/60 px-3 py-2 text-sm"
                  placeholder="e.g. Organic rice"
                />
              </label>
              <label className="block space-y-1 text-sm font-medium text-daichi-charcoal">
                Quantity (kg)
                <input
                  name="quantity"
                  type="number"
                  required
                  min="1"
                  step="any"
                  className="w-full rounded-warm border border-white/80 bg-white/60 px-3 py-2 text-sm"
                  placeholder="500"
                />
              </label>
              <label className="block space-y-1 text-sm font-medium text-daichi-charcoal">
                Asking price (৳ per kg)
                <input
                  name="askingPrice"
                  type="number"
                  required
                  min="0.01"
                  step="0.01"
                  className="w-full rounded-warm border border-white/80 bg-white/60 px-3 py-2 text-sm"
                  placeholder="48"
                />
              </label>
              <label className="block space-y-1 text-sm font-medium text-daichi-charcoal">
                Harvest date
                <input
                  name="harvestDate"
                  type="date"
                  required
                  className="w-full rounded-warm border border-white/80 bg-white/60 px-3 py-2 text-sm"
                />
              </label>
              <label className="block space-y-1 text-sm font-medium text-daichi-charcoal">
                Grade
                <select
                  name="grade"
                  className="w-full rounded-warm border border-white/80 bg-white/60 px-3 py-2 text-sm"
                  defaultValue="Grade A"
                >
                  <option>Grade A+</option>
                  <option>Grade A</option>
                  <option>Grade B</option>
                  <option>Grade C</option>
                </select>
              </label>
              <button
                type="submit"
                className="w-full bg-daichi-forest text-white py-2.5 rounded-warm font-medium text-sm hover:bg-daichi-forest/90 transition shadow-md"
              >
                Publish Listing
              </button>
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