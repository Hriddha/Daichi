"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, MotionConfig, motion, type Variants } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import { Tag, Calendar, ArrowUpRight, Check, ShieldCheck, TrendingUp, X } from "lucide-react";

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

const listingVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

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
  const [language, setLanguage] = useState<"en" | "bn">("en");
  const [acceptedListingId, setAcceptedListingId] = useState<number | null>(null);
  const copy = language === "en"
    ? {
        title: "Produce Marketplace",
        subtitle: "Your harvest, offered directly to buyers.",
        create: "Create New Listing",
        currentBid: "Current High Bid",
        offers: "Review Offers",
        noBids: "No offers yet",
        quantity: "Quantity",
        harvest: "Harvest date",
        aboveMarket: "above Bogura market rate",
        noFee: "Middleman fee",
        createTitle: "Create New Listing",
        cropName: "Crop name",
        quantityKg: "Quantity (kg)",
        askingPrice: "Asking price (৳ per kg)",
        harvestDate: "Harvest date",
        publish: "Publish Listing",
        receivedOffers: "Buyer offers",
        close: "Close offers",
        payment: "Payment on delivery",
        accept: "Accept Fair Bid",
        accepted: "Bid accepted",
        grade: "Produce grade",
        buyer: "Dhaka Agro Wholesalers",
        emptyTitle: "No buyer offers yet",
        emptyCopy: "Your listing is published. We’ll show offers here when buyers respond.",
      }
    : {
        title: "কৃষিপণ্য বাজার",
        subtitle: "আপনার ফসল, সরাসরি ক্রেতার কাছে।",
        create: "নতুন পণ্য যোগ করুন",
        currentBid: "সর্বোচ্চ দর",
        offers: "দর দেখুন",
        noBids: "এখনও কোনো দর নেই",
        quantity: "পরিমাণ",
        harvest: "ফসল তোলার তারিখ",
        aboveMarket: "বগুড়ার বাজারদরের চেয়ে বেশি",
        noFee: "মধ্যস্বত্বভোগীর ফি",
        createTitle: "নতুন পণ্য যোগ করুন",
        cropName: "ফসলের নাম",
        quantityKg: "পরিমাণ (কেজি)",
        askingPrice: "দাম (৳ প্রতি কেজি)",
        harvestDate: "ফসল তোলার তারিখ",
        publish: "পণ্য তালিকাভুক্ত করুন",
        receivedOffers: "ক্রেতার দর",
        close: "দর বন্ধ করুন",
        payment: "পণ্য পৌঁছালে মূল্য পরিশোধ",
        accept: "ন্যায্য দর গ্রহণ করুন",
        accepted: "দর গ্রহণ করা হয়েছে",
        grade: "পণ্যের মান",
        buyer: "ঢাকা এগ্রো হোলসেলার্স",
        emptyTitle: "এখনও কোনো ক্রেতার দর নেই",
        emptyCopy: "আপনার পণ্য তালিকাভুক্ত হয়েছে। ক্রেতারা দর দিলে এখানে দেখতে পাবেন।",
      };

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
    <MotionConfig reducedMotion="user">
    <div className="space-y-7 text-[#0f291e]">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-3 flex items-center gap-3">
            <h2 className="text-3xl font-black tracking-tight text-[#0f291e] md:text-[2.4rem]">
              {copy.title}
            </h2>
            <div className="relative flex items-center rounded-full border border-white/90 bg-white/55 p-1 shadow-[inset_0_1px_2px_rgba(15,41,30,0.08)] backdrop-blur-xl">
              {(["bn", "en"] as const).map((option) => (
                <button
                  type="button"
                  key={option}
                  onClick={() => setLanguage(option)}
                  aria-pressed={language === option}
                  className="relative z-10 rounded-full px-3 py-1.5 text-xs font-semibold text-[#0f291e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f291e]"
                >
                  {language === option && (
                    <motion.span
                      layoutId="marketplace-language-pill"
                      className="absolute inset-0 -z-10 rounded-full border border-white/90 bg-white/90 shadow-sm"
                      transition={{ type: "spring", stiffness: 420, damping: 32 }}
                    />
                  )}
                  {option === "bn" ? "বাংলা" : "EN"}
                </button>
              ))}
            </div>
          </div>
          <p className="text-sm text-[#40564a] md:text-base">{copy.subtitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 md:justify-end">
          <motion.button
            type="button"
            onClick={() => {
              setSelectedListing(null);
              setIsCreateListingOpen(true);
            }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center justify-center rounded-[1.15rem] bg-[#0f4935] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_30px_rgba(15,73,53,0.2)] transition-colors hover:bg-[#0b3d2c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f291e]"
          >
            + {copy.create}
          </motion.button>
        </div>
      </div>

      <motion.div
        className="grid grid-cols-1 gap-6 md:grid-cols-2"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
      >
        {listings.map((item, index) => (
          <motion.div
            key={item.id}
            variants={listingVariants}
            whileHover={{ y: -4 }}
            className={index === 0 ? "group md:col-span-2" : "group"}
          >
          <GlassCard className="h-full border-white/80 bg-white/60 backdrop-blur-xl transition-[border-color,box-shadow] group-hover:border-[#9ecab0] group-hover:shadow-[0_18px_44px_rgba(15,41,30,0.13),inset_0_1px_0_rgba(255,255,255,0.95)]">
            <div className="relative">
              <div className={`mb-5 flex flex-col gap-5 ${index === 0 ? "md:flex-row md:items-start md:justify-between" : "sm:flex-row sm:items-start sm:justify-between"}`}>
                <div className="space-y-2">
                  <span className="inline-flex items-center rounded-full border border-[#d9e7dc] bg-[#e8f2e9] px-3 py-1 text-xs font-semibold text-[#214d38]">
                    {copy.grade}: {item.grade.replace("Grade ", "")}
                  </span>
                  <h3 className="max-w-[30rem] text-xl font-extrabold leading-tight text-[#0f291e] md:text-2xl">
                    {item.crop}
                  </h3>
                </div>
                <span className="text-xl font-bold tracking-tight text-[#214d38] md:text-2xl">
                  {item.askingPrice}
                </span>
              </div>

              <div className={`mb-6 flex flex-col gap-2.5 text-sm text-[#40564a] ${index === 0 ? "md:flex-row md:gap-8" : ""}`}>
                <div className="flex items-center gap-2.5">
                  <Tag className="h-4 w-4 text-daichi-sage" />
                  <span>
                    {copy.quantity}: <strong className="font-semibold text-[#0f291e]">{item.quantity}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Calendar className="h-4 w-4 text-daichi-sage" />
                  <span>{copy.harvest}: {item.harvestDate}</span>
                </div>
              </div>

              <div className={`flex flex-col gap-5 border-t border-[#dce8df] pt-4 ${index === 0 ? "md:flex-row md:items-end md:justify-between" : "sm:flex-row sm:items-end sm:justify-between"}`}>
                <div className={index === 0 ? "md:flex-1" : ""}>
                  <p className="text-xs font-semibold text-[#40564a]">
                    {copy.currentBid}
                  </p>
                  <p className={`mt-1 font-black leading-none tracking-tight text-[#0f291e] ${index === 0 ? "text-4xl md:text-5xl" : "text-2xl"}`}>
                    {item.topBid ?? copy.noBids}{" "}
                    {item.bidsCount > 0 && (
                      <span className="text-sm font-medium text-[#52675b]">({item.bidsCount} offers)</span>
                    )}
                  </p>
                  {index === 0 && item.topBid && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-[#f1dd9f] bg-[#fff8df] px-3 py-1.5 text-xs font-semibold text-[#573e08]">
                        <TrendingUp className="h-3.5 w-3.5" />
                        +8% {copy.aboveMarket}
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-[#c6e4d1] bg-[#e5f5e9] px-3 py-1.5 text-xs font-semibold text-[#17452e]">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        0% {copy.noFee}
                      </span>
                    </div>
                  )}
                </div>
                <motion.button
                  onClick={() => {
                    setIsCreateListingOpen(false);
                    setSelectedListing(item);
                    setAcceptedListingId(null);
                  }}
                  type="button"
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center justify-center gap-1.5 self-start rounded-full border border-[#cbded0] bg-white/70 px-4 py-2.5 text-sm font-bold text-[#17452e] transition hover:border-[#8db49a] hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f291e]"
                >
                  {copy.offers} <ArrowUpRight className="h-4 w-4" />
                </motion.button>
              </div>
            </div>
          </GlassCard>
          </motion.div>
        ))}
      </motion.div>

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
                {copy.createTitle}
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
                {copy.cropName}
                <input
                  name="crop"
                  required
                  maxLength={100}
                  className="w-full rounded-warm border border-white/80 bg-white/60 px-3 py-2 text-sm"
                  placeholder="e.g. Organic rice"
                />
              </label>
              <label className="block space-y-1 text-sm font-medium text-daichi-charcoal">
                {copy.quantityKg}
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
                {copy.askingPrice}
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
                {copy.harvestDate}
                <input
                  name="harvestDate"
                  type="date"
                  required
                  className="w-full rounded-warm border border-white/80 bg-white/60 px-3 py-2 text-sm"
                />
              </label>
              <label className="block space-y-1 text-sm font-medium text-daichi-charcoal">
                {copy.grade}
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
                {copy.publish}
              </button>
            </form>
          </section>
        </div>
      )}

      <AnimatePresence>
        {selectedListing && (
          <motion.div
            className="fixed inset-0 z-50 flex justify-end bg-[#0f291e]/25 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedListing(null)}
          >
            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-labelledby="offers-title"
              className="glass-panel h-full w-full max-w-md overflow-y-auto border-l border-white/80 bg-white/75 p-6 shadow-2xl backdrop-blur-xl sm:p-8"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 280 }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4 border-b border-[#dce8df] pb-5">
                <div>
                  <p className="text-sm font-semibold text-[#52675b]">{copy.receivedOffers}</p>
                  <h3 id="offers-title" className="mt-1 text-xl font-bold leading-tight text-[#0f291e]">
                    {selectedListing.crop}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedListing(null)}
                  aria-label={copy.close}
                  className="rounded-full p-2 text-[#40564a] transition hover:bg-white/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f291e]"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              {selectedListing.topBid ? (
                <div className="mt-6 rounded-[1.4rem] border border-white/90 bg-white/65 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-[#0f291e]">{copy.buyer}</p>
                      <p className="mt-1 text-sm text-[#52675b]">{copy.payment}</p>
                    </div>
                    <p className="text-lg font-extrabold text-[#0f4935]">{selectedListing.topBid}</p>
                  </div>
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setAcceptedListingId(selectedListing.id)}
                    disabled={acceptedListingId === selectedListing.id}
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0f4935] px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#0b3d2c] disabled:cursor-default disabled:bg-[#3f7559] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f291e]"
                  >
                    {acceptedListingId === selectedListing.id ? (
                      <><Check className="h-4 w-4" /> {copy.accepted}</>
                    ) : copy.accept}
                  </motion.button>
                </div>
              ) : (
                <div className="mt-8 rounded-[1.4rem] border border-[#dce8df] bg-white/55 p-5">
                  <h4 className="font-semibold text-[#0f291e]">{copy.emptyTitle}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-[#40564a]">{copy.emptyCopy}</p>
                </div>
              )}
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </MotionConfig>
  );
}