import Sidebar from "../../components/layout/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-daichi-bg md:flex-row">
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
        <div className="ambient-glow ambient-glow--top" />
        <div className="ambient-glow ambient-glow--bottom" />
        <svg className="growth-plant" viewBox="0 0 160 240" fill="none">
          <path className="rice-ground" d="M27 218c29-4 77-4 106 0" />
          <path className="rice-stem rice-stem--main" d="M80 217c1-42-2-81 0-122 1-17 0-31 1-48" />
          <path className="rice-blade rice-blade--one" d="M80 193C67 164 53 130 40 95c20 17 34 48 40 91Z" />
          <path className="rice-blade rice-blade--two" d="M80 174c15-35 29-66 44-94-4 34-19 68-43 99Z" />
          <path className="rice-blade rice-blade--three" d="M80 153C63 128 50 103 43 75c20 17 33 42 37 78Z" />
          <path className="rice-blade rice-blade--four" d="M81 132c11-29 22-52 34-73-2 27-13 51-34 77Z" />
          <path className="rice-panicle-stem" d="M81 70c-10-17-20-29-33-42" />
          <path className="rice-panicle-branch" d="M52 31c-8-4-14-8-20-14m23 17c-3-9-4-16-4-23m11 30c-10-3-18-3-26-2m30 7c-5-9-7-17-8-24m15 35c-9-7-16-11-24-14m26 17c0-11 2-19 6-27m-3 36c-7-8-13-13-20-18" />
          <g className="rice-grains rice-grains--one">
            <ellipse cx="27" cy="14" rx="2.4" ry="5" transform="rotate(-48 27 14)" />
            <ellipse cx="33" cy="12" rx="2.4" ry="5" transform="rotate(-50 33 12)" />
            <ellipse cx="38" cy="19" rx="2.4" ry="5" transform="rotate(-54 38 19)" />
            <ellipse cx="42" cy="9" rx="2.4" ry="5" transform="rotate(-8 42 9)" />
            <ellipse cx="47" cy="14" rx="2.4" ry="5" transform="rotate(-17 47 14)" />
          </g>
          <g className="rice-grains rice-grains--two">
            <ellipse cx="38" cy="31" rx="2.4" ry="5" transform="rotate(-82 38 31)" />
            <ellipse cx="44" cy="35" rx="2.4" ry="5" transform="rotate(-72 44 35)" />
            <ellipse cx="51" cy="27" rx="2.4" ry="5" transform="rotate(-15 51 27)" />
            <ellipse cx="57" cy="31" rx="2.4" ry="5" transform="rotate(-25 57 31)" />
            <ellipse cx="61" cy="39" rx="2.4" ry="5" transform="rotate(-38 61 39)" />
            <ellipse cx="68" cy="39" rx="2.4" ry="5" transform="rotate(-12 68 39)" />
            <ellipse cx="70" cy="48" rx="2.4" ry="5" transform="rotate(-31 70 48)" />
          </g>
          <path className="rice-vein" d="M80 207 43 106m38 80 38-92M80 145 47 83m34 31 30-49" />
        </svg>
      </div>

      {/* Glass Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="relative z-10 min-w-0 flex-1 overflow-y-auto px-4 py-5 md:p-6">
        <div className="max-w-5xl mx-auto space-y-6">{children}</div>
      </main>
    </div>
  );
}