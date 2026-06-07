"use client";

import { useState, useMemo, useCallback, useEffect, useRef, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import OrderStatCard from "@/components/admin/OrderStatCard";
import { formatCurrency } from "@/lib/currency";

/* ─── Types ─────────────────────────────────────────── */
type OrderStatus =
  | "paid"
  | "pending"
  | "shipped"
  | "cancelled"
  | "processing"
  | "delivered"
  | "in_transit"
  | "refunded";

interface OrderCustomer {
  name: string;
  initials: string;
  avatarBg: string;
  avatarText: string;
  email: string;
}

interface Order {
  id: string;
  customer: OrderCustomer;
  date: string;
  sortDate: number; // timestamp for sorting
  total: number;
  status: OrderStatus;
  items: number;
  address: string;
  payment: string;
}

/* ─── Status Config ──────────────────────────────────── */
const STATUS_CFG: Record<
  OrderStatus,
  { label: string; bg: string; text: string; dot: string }
> = {
  paid: {
    label: "Paid",
    bg: "bg-[#a5f95b]",
    text: "text-[#3b7100]",
    dot: "bg-[#386b00]",
  },
  pending: {
    label: "Pending",
    bg: "bg-[#e3e3dd]",
    text: "text-[#424843]",
    dot: "bg-[#9ca8a3]",
  },
  shipped: {
    label: "Shipped",
    bg: "bg-[#1b3c2a]",
    text: "text-[#aacfb6]",
    dot: "bg-[#aacfb6]",
  },
  cancelled: {
    label: "Cancelled",
    bg: "bg-[#ffdad6]",
    text: "text-[#ba1a1a]",
    dot: "bg-[#ba1a1a]",
  },
  processing: {
    label: "Processing",
    bg: "bg-[#fff3cd]",
    text: "text-[#7a4b00]",
    dot: "bg-[#f59e0b]",
  },
  delivered: {
    label: "Delivered",
    bg: "bg-[#d4f4a0]",
    text: "text-[#3b7100]",
    dot: "bg-[#386b00]",
  },
  in_transit: {
    label: "In Transit",
    bg: "bg-[#dbeafe]",
    text: "text-[#1d4ed8]",
    dot: "bg-[#3b82f6]",
  },
  refunded: {
    label: "Refunded",
    bg: "bg-[#f4f4ee]",
    text: "text-[#727973]",
    dot: "bg-[#9ca8a3]",
  },
};

/* ─── Avatar Palette ─────────────────────────────────── */
const AVATAR_PALETTE = [
  { bg: "#a5f95b", text: "#3b7100" },
  { bg: "#1b3c2a", text: "#aacfb6" },
  { bg: "#e1e4da", text: "#444841" },
  { bg: "#ffdad6", text: "#ba1a1a" },
  { bg: "#d4f4a0", text: "#386b00" },
  { bg: "#c6ecd1", text: "#032616" },
  { bg: "#eeeee9", text: "#424843" },
];

function makeCustomer(
  name: string,
  email: string,
  paletteIdx: number
): OrderCustomer {
  const parts = name.split(" ");
  const initials = parts.map((p) => p[0]).join("").slice(0, 2).toUpperCase();
  const pal = AVATAR_PALETTE[paletteIdx % AVATAR_PALETTE.length];
  return { name, email, initials, avatarBg: pal.bg, avatarText: pal.text };
}

/* ─── Mock Data ──────────────────────────────────────── */
const MOCK_ORDERS: Order[] = [
  // Page 1 — design-accurate first 4
  {
    id: "HH-2938",
    customer: makeCustomer("Sarah Miller", "s.miller@email.com", 0),
    date: "Oct 24, 2023",
    sortDate: 20231024,
    total: 11849,
    status: "paid",
    items: 3,
    address: "412 Maple Dr, Portland, OR 97201",
    payment: "Visa •••• 4321",
  },
  {
    id: "HH-2939",
    customer: makeCustomer("James Rodriguez", "j.rodriguez@email.com", 1),
    date: "Oct 24, 2023",
    sortDate: 20231024,
    total: 7399,
    status: "pending",
    items: 2,
    address: "88 Oak Street, Seattle, WA 98101",
    payment: "PayPal",
  },
  {
    id: "HH-2940",
    customer: makeCustomer("Avery Lane", "a.lane@email.com", 2),
    date: "Oct 23, 2023",
    sortDate: 20231023,
    total: 17499,
    status: "shipped",
    items: 5,
    address: "1500 Pine Ave, Denver, CO 80202",
    payment: "Mastercard •••• 8765",
  },
  {
    id: "HH-2941",
    customer: makeCustomer("Tom Kensington", "t.kensington@email.com", 3),
    date: "Oct 23, 2023",
    sortDate: 20231023,
    total: 3749,
    status: "cancelled",
    items: 1,
    address: "220 Elm St, Austin, TX 78701",
    payment: "Visa •••• 9988",
  },
  // Page 2
  {
    id: "HH-2942",
    customer: makeCustomer("Eleanor Marsh", "e.marsh@email.com", 4),
    date: "Oct 23, 2023",
    sortDate: 20231023,
    total: 26999,
    status: "processing",
    items: 6,
    address: "39 Birch Ln, Boston, MA 02101",
    payment: "Visa •••• 1234",
  },
  {
    id: "HH-2943",
    customer: makeCustomer("Marcus Webb", "m.webb@email.com", 5),
    date: "Oct 22, 2023",
    sortDate: 20231022,
    total: 5619,
    status: "delivered",
    items: 2,
    address: "7 Cedar Way, Chicago, IL 60601",
    payment: "Amex •••• 6677",
  },
  {
    id: "HH-2944",
    customer: makeCustomer("Lily Chen", "l.chen@email.com", 6),
    date: "Oct 22, 2023",
    sortDate: 20231022,
    total: 15399,
    status: "in_transit",
    items: 4,
    address: "563 Walnut Rd, San Francisco, CA 94102",
    payment: "PayPal",
  },
  {
    id: "HH-2945",
    customer: makeCustomer("David Park", "d.park@email.com", 0),
    date: "Oct 22, 2023",
    sortDate: 20231022,
    total: 7749,
    status: "shipped",
    items: 3,
    address: "1024 Spruce St, Miami, FL 33101",
    payment: "Mastercard •••• 2200",
  },
  // Page 3
  {
    id: "HH-2946",
    customer: makeCustomer("Rachel Torres", "r.torres@email.com", 1),
    date: "Oct 21, 2023",
    sortDate: 20231021,
    total: 4329,
    status: "paid",
    items: 1,
    address: "88 Aspen Ct, Phoenix, AZ 85001",
    payment: "Visa •••• 5544",
  },
  {
    id: "HH-2947",
    customer: makeCustomer("Sam Butler", "s.butler@email.com", 2),
    date: "Oct 21, 2023",
    sortDate: 20231021,
    total: 34749,
    status: "processing",
    items: 8,
    address: "300 Willow Ave, Nashville, TN 37201",
    payment: "Visa •••• 3399",
  },
  {
    id: "HH-2948",
    customer: makeCustomer("Nina Patel", "n.patel@email.com", 3),
    date: "Oct 21, 2023",
    sortDate: 20231021,
    total: 6349,
    status: "delivered",
    items: 2,
    address: "15 Poplar St, Minneapolis, MN 55401",
    payment: "PayPal",
  },
  {
    id: "HH-2949",
    customer: makeCustomer("Chris Foster", "c.foster@email.com", 4),
    date: "Oct 20, 2023",
    sortDate: 20231020,
    total: 10799,
    status: "refunded",
    items: 3,
    address: "78 Magnolia Dr, Atlanta, GA 30301",
    payment: "Mastercard •••• 4422",
  },
  // Page 4
  {
    id: "HH-2950",
    customer: makeCustomer("Mia Johnson", "m.johnson@email.com", 5),
    date: "Oct 20, 2023",
    sortDate: 20231020,
    total: 20349,
    status: "shipped",
    items: 5,
    address: "2200 Oak Park Blvd, Dallas, TX 75201",
    payment: "Visa •••• 8811",
  },
  {
    id: "HH-2951",
    customer: makeCustomer("Ethan Reyes", "e.reyes@email.com", 6),
    date: "Oct 20, 2023",
    sortDate: 20231020,
    total: 3199,
    status: "pending",
    items: 1,
    address: "110 Fern Way, Las Vegas, NV 89101",
    payment: "Amex •••• 7755",
  },
  {
    id: "HH-2952",
    customer: makeCustomer("Sofia Chang", "s.chang@email.com", 0),
    date: "Oct 19, 2023",
    sortDate: 20231019,
    total: 13449,
    status: "in_transit",
    items: 4,
    address: "450 Cypress St, Portland, OR 97204",
    payment: "Visa •••• 6633",
  },
  {
    id: "HH-2953",
    customer: makeCustomer("Henry Liu", "h.liu@email.com", 1),
    date: "Oct 19, 2023",
    sortDate: 20231019,
    total: 24149,
    status: "paid",
    items: 6,
    address: "830 Elm Lane, Seattle, WA 98103",
    payment: "PayPal",
  },
  // Page 5
  {
    id: "HH-2954",
    customer: makeCustomer("Grace Kim", "g.kim@email.com", 2),
    date: "Oct 19, 2023",
    sortDate: 20231019,
    total: 4579,
    status: "delivered",
    items: 2,
    address: "19 Hazel Ct, Denver, CO 80203",
    payment: "Mastercard •••• 1100",
  },
  {
    id: "HH-2955",
    customer: makeCustomer("Oliver Brown", "o.brown@email.com", 3),
    date: "Oct 18, 2023",
    sortDate: 20231018,
    total: 9349,
    status: "cancelled",
    items: 3,
    address: "7 Laurel Ave, Austin, TX 78702",
    payment: "Visa •••• 2277",
  },
  {
    id: "HH-2956",
    customer: makeCustomer("Priya Sharma", "p.sharma@email.com", 4),
    date: "Oct 18, 2023",
    sortDate: 20231018,
    total: 31399,
    status: "processing",
    items: 7,
    address: "660 Sycamore Rd, Boston, MA 02102",
    payment: "Amex •••• 5599",
  },
  {
    id: "HH-2957",
    customer: makeCustomer("Lucas White", "l.white@email.com", 5),
    date: "Oct 17, 2023",
    sortDate: 20231017,
    total: 6749,
    status: "shipped",
    items: 2,
    address: "333 Chestnut Blvd, Chicago, IL 60602",
    payment: "Visa •••• 3388",
  },
  // Page 6
  {
    id: "HH-2958",
    customer: makeCustomer("Ava Thompson", "a.thompson@email.com", 6),
    date: "Oct 17, 2023",
    sortDate: 20231017,
    total: 16349,
    status: "in_transit",
    items: 4,
    address: "89 Redwood Dr, San Jose, CA 95101",
    payment: "PayPal",
  },
  {
    id: "HH-2959",
    customer: makeCustomer("Noah Davis", "n.davis@email.com", 0),
    date: "Oct 16, 2023",
    sortDate: 20231016,
    total: 6149,
    status: "delivered",
    items: 2,
    payment: "Mastercard •••• 9900",
    address: "212 Juniper Ave, Miami, FL 33102",
  },
  {
    id: "HH-2960",
    customer: makeCustomer("Isla Martin", "i.martin@email.com", 1),
    date: "Oct 16, 2023",
    sortDate: 20231016,
    total: 41949,
    status: "paid",
    items: 9,
    address: "17 Rosewood Ln, Phoenix, AZ 85002",
    payment: "Visa •••• 7744",
  },
  {
    id: "HH-2961",
    customer: makeCustomer("Ben Clark", "b.clark@email.com", 2),
    date: "Oct 15, 2023",
    sortDate: 20231015,
    total: 3499,
    status: "refunded",
    items: 1,
    address: "450 Ironwood St, Nashville, TN 37202",
    payment: "Amex •••• 8866",
  },
  // Page 7
  {
    id: "HH-2962",
    customer: makeCustomer("Chloe Evans", "c.evans@email.com", 3),
    date: "Oct 15, 2023",
    sortDate: 20231015,
    total: 11649,
    status: "processing",
    items: 3,
    address: "60 Maplewood Rd, Minneapolis, MN 55402",
    payment: "Visa •••• 2233",
  },
  {
    id: "HH-2963",
    customer: makeCustomer("Finn Hall", "f.hall@email.com", 4),
    date: "Oct 14, 2023",
    sortDate: 20231014,
    total: 18749,
    status: "shipped",
    items: 5,
    address: "9 Sequoia Way, Atlanta, GA 30302",
    payment: "Mastercard •••• 5511",
  },
  {
    id: "HH-2964",
    customer: makeCustomer("Zoe Scott", "z.scott@email.com", 5),
    date: "Oct 14, 2023",
    sortDate: 20231014,
    total: 8199,
    status: "pending",
    items: 3,
    address: "175 Birchwood Ct, Dallas, TX 75202",
    payment: "PayPal",
  },
  {
    id: "HH-2965",
    customer: makeCustomer("Jack Wilson", "j.wilson@email.com", 6),
    date: "Oct 13, 2023",
    sortDate: 20231013,
    total: 13549,
    status: "delivered",
    items: 4,
    address: "831 Cottonwood Ave, Las Vegas, NV 89102",
    payment: "Visa •••• 4477",
  },
];

/* ─── Constants ──────────────────────────────────────── */
const ITEMS_PER_PAGE = 4;

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "total_high", label: "Highest Total" },
  { value: "total_low", label: "Lowest Total" },
] as const;

type SortOption = (typeof SORT_OPTIONS)[number]["value"];

const FILTER_CHIPS: { label: string; value: string }[] = [
  { label: "All Orders", value: "" },
  { label: "Paid", value: "paid" },
  { label: "Pending", value: "pending" },
  { label: "Processing", value: "processing" },
  { label: "Shipped", value: "shipped" },
  { label: "In Transit", value: "in_transit" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
  { label: "Refunded", value: "refunded" },
];

/* ─── Page ───────────────────────────────────────────── */
export default function AdminOrdersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [exportLoading, setExportLoading] = useState(false);
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);

  const sortMenuRef = useRef<HTMLDivElement>(null);
  const rowMenuRef = useRef<HTMLTableRowElement>(null);

  /* Close dropdowns on outside click */
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        sortMenuRef.current &&
        !sortMenuRef.current.contains(e.target as Node)
      ) {
        setShowSortMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    function close() { setOpenMenuId(null); }
    if (openMenuId) document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [openMenuId]);

  /* Filtering + sorting */
  const filtered = useMemo(() => {
    let result = MOCK_ORDERS.filter((o) => {
      const q = search.toLowerCase();
      const matchSearch =
        !search ||
        o.id.toLowerCase().includes(q) ||
        o.customer.name.toLowerCase().includes(q) ||
        o.customer.email.toLowerCase().includes(q);
      const matchStatus = !statusFilter || o.status === statusFilter;
      return matchSearch && matchStatus;
    });

    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case "newest": return b.sortDate - a.sortDate;
        case "oldest": return a.sortDate - b.sortDate;
        case "total_high": return b.total - a.total;
        case "total_low": return a.total - b.total;
        default: return 0;
      }
    });

    return result;
  }, [search, statusFilter, sortBy]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const safePage = Math.min(currentPage, Math.max(totalPages, 1));
  const paginated = filtered.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE
  );

  const showingFrom = filtered.length === 0 ? 0 : (safePage - 1) * ITEMS_PER_PAGE + 1;
  const showingTo = Math.min(safePage * ITEMS_PER_PAGE, filtered.length);

  /* Page window: always show 3 pages centered on current */
  const pageNums = useMemo(() => {
    if (totalPages <= 3) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const start = Math.max(1, Math.min(safePage - 1, totalPages - 2));
    return [start, start + 1, start + 2];
  }, [totalPages, safePage]);

  /* Handlers */
  const handleFilterChange = useCallback((setter: (v: string) => void) => (v: string) => {
    setter(v);
    setCurrentPage(1);
  }, []);

  const handleExport = useCallback(async () => {
    setExportLoading(true);
    await new Promise((r) => setTimeout(r, 1400));
    setExportLoading(false);
  }, []);

  const handleOpenDetails = useCallback((order: Order) => {
    setSelectedOrder(order);
    setOpenMenuId(null);
  }, []);

  const handleStatusUpdate = useCallback(async (orderId: string) => {
    setUpdatingStatusId(orderId);
    await new Promise((r) => setTimeout(r, 800));
    setUpdatingStatusId(null);
    setSelectedOrder(null);
  }, []);

  return (
    <>
      <div className="space-y-5 pb-20 md:pb-6">
        {/* ─── Page Header ───────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
        >
          <div>
            <h1 className="font-[var(--font-libre-caslon)] text-[28px] md:text-[32px] font-bold text-[#032616] leading-tight">
              Order Management
            </h1>
            <p className="text-sm text-[#727973] font-[var(--font-work-sans)] mt-1">
              Track, manage, and fulfill organic harvest deliveries.
            </p>
          </div>
          <motion.button
            onClick={handleExport}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            disabled={exportLoading}
            className="flex items-center gap-2 bg-[#386b00] text-white font-bold text-[11px] tracking-widest uppercase font-[var(--font-work-sans)] px-5 py-3 rounded-lg shadow-sm hover:bg-[#4a8a00] transition-colors shrink-0 disabled:opacity-70"
          >
            {exportLoading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                />
                Exporting…
              </>
            ) : (
              <>
                <DownloadIcon />
                Export All Data
              </>
            )}
          </motion.button>
        </motion.div>

        {/* ─── Stat Cards ────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <OrderStatCard
            label="Total Orders Today"
            value="142"
            note="+12% from yesterday"
            noteVariant="green"
            iconBg="#1b3c2a"
            icon={<CartIcon />}
            delay={0}
          />
          <OrderStatCard
            label="Pending Shipments"
            value="28"
            note="Due for pickup by 4:00 PM"
            noteVariant="neutral"
            iconBg="#a5f95b"
            icon={<TruckIcon color="#3b7100" />}
            delay={0.1}
          />
          <OrderStatCard
            label="Weekly Revenue"
            value="₹10,68,000"
            note="Estimated farm-gate value"
            noteVariant="neutral"
            iconBg="#e1e4da"
            icon={<PaymentsIcon />}
            delay={0.2}
          />
        </div>

        {/* ─── Orders Table Card ──────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25, ease: [0.25, 0.4, 0.25, 1] }}
          className="bg-white rounded-xl border border-[#e3e3dd] shadow-sm overflow-hidden"
        >
          {/* Toolbar */}
          <div className="px-6 py-5 border-b border-[#f4f4ee] flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="relative flex-1 min-w-0">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca8a3] pointer-events-none"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  handleFilterChange(setSearch)(e.target.value);
                }}
                placeholder="Search orders by ID or customer..."
                className="w-full pl-9 pr-4 py-2.5 border border-[#e3e3dd] rounded-lg text-sm text-[#1a1c19] placeholder:text-[#b0b8b0] font-[var(--font-work-sans)] bg-white focus:outline-none focus:border-[#386b00] focus:ring-1 focus:ring-[#386b00]/30 transition-colors"
              />
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {/* Filter toggle */}
              <motion.button
                onClick={() => setShowFilters((s) => !s)}
                whileTap={{ scale: 0.93 }}
                className={`p-2.5 rounded-lg border transition-colors ${
                  showFilters
                    ? "bg-[#032616] border-[#032616] text-white"
                    : "border-[#e3e3dd] text-[#9ca8a3] hover:text-[#424843] hover:bg-[#f4f4ee]"
                }`}
                aria-label="Toggle filters"
              >
                <FilterListIcon />
              </motion.button>
              {/* Sort menu */}
              <div ref={sortMenuRef} className="relative">
                <motion.button
                  onClick={() => setShowSortMenu((s) => !s)}
                  whileTap={{ scale: 0.93 }}
                  className={`p-2.5 rounded-lg border transition-colors ${
                    showSortMenu
                      ? "bg-[#032616] border-[#032616] text-white"
                      : "border-[#e3e3dd] text-[#9ca8a3] hover:text-[#424843] hover:bg-[#f4f4ee]"
                  }`}
                  aria-label="Sort orders"
                >
                  <SortIcon />
                </motion.button>
                <AnimatePresence>
                  {showSortMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-44 bg-white rounded-xl border border-[#e3e3dd] shadow-lg z-30 overflow-hidden"
                    >
                      {SORT_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => {
                            setSortBy(opt.value);
                            setCurrentPage(1);
                            setShowSortMenu(false);
                          }}
                          className={`w-full text-left px-4 py-3 text-[12px] font-[var(--font-work-sans)] transition-colors ${
                            sortBy === opt.value
                              ? "bg-[#f4f4ee] font-bold text-[#032616]"
                              : "text-[#424843] hover:bg-[#fafaf4]"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Filter chips row */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden border-b border-[#f4f4ee]"
              >
                <div className="px-6 py-3 flex flex-wrap gap-2">
                  {FILTER_CHIPS.map((chip) => (
                    <motion.button
                      key={chip.value}
                      onClick={() => {
                        setStatusFilter(chip.value);
                        setCurrentPage(1);
                      }}
                      whileTap={{ scale: 0.93 }}
                      className={`text-[11px] font-bold px-3 py-1.5 rounded-full font-[var(--font-work-sans)] transition-colors ${
                        statusFilter === chip.value
                          ? "bg-[#032616] text-white"
                          : "bg-[#f4f4ee] text-[#424843] hover:bg-[#e8e8e3]"
                      }`}
                    >
                      {chip.label}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Table */}
          <div className="overflow-x-auto">
            <table
              className="w-full text-left border-collapse min-w-[700px]"
              aria-label="Orders table"
            >
              <thead className="border-b border-[#f4f4ee] bg-[#fafaf4]/60">
                <tr>
                  {["Order ID", "Customer", "Date", "Total", "Status", "Actions"].map(
                    (col, i) => (
                      <th
                        key={col}
                        className={`px-6 py-4 text-[11px] font-bold tracking-widest uppercase font-[var(--font-work-sans)] text-[#727973] ${
                          i === 5 ? "text-right" : ""
                        }`}
                      >
                        {col}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="wait" initial={false}>
                  {paginated.length === 0 ? (
                    <tr key="empty">
                      <td colSpan={6}>
                        <OrdersEmptyState hasFilters={!!(search || statusFilter)} onReset={() => { setSearch(""); setStatusFilter(""); setCurrentPage(1); }} />
                      </td>
                    </tr>
                  ) : (
                    paginated.map((order, i) => (
                      <motion.tr
                        key={order.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: i * 0.05, duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
                        className={`border-b border-[#f4f4ee] last:border-0 transition-colors ${
                          selectedOrder?.id === order.id
                            ? "bg-[#f4f4ee]/60"
                            : "hover:bg-[#fafaf4]"
                        }`}
                      >
                        {/* Order ID */}
                        <td className="px-6 py-4">
                          <span className="font-bold text-sm text-[#032616] font-[var(--font-work-sans)]">
                            #{order.id}
                          </span>
                        </td>

                        {/* Customer */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-[11px] font-[var(--font-work-sans)] shrink-0"
                              style={{
                                background: order.customer.avatarBg,
                                color: order.customer.avatarText,
                              }}
                            >
                              {order.customer.initials}
                            </div>
                            <span className="text-sm text-[#1a1c19] font-[var(--font-work-sans)]">
                              {order.customer.name}
                            </span>
                          </div>
                        </td>

                        {/* Date */}
                        <td className="px-6 py-4">
                          <span className="text-sm text-[#727973] font-[var(--font-work-sans)] whitespace-nowrap">
                            {order.date}
                          </span>
                        </td>

                        {/* Total */}
                        <td className="px-6 py-4">
                          <span className="text-sm font-bold text-[#1a1c19] font-[var(--font-work-sans)] tabular-nums">
                            {formatCurrency(order.total)}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wider uppercase font-[var(--font-work-sans)] ${
                              STATUS_CFG[order.status].bg
                            } ${STATUS_CFG[order.status].text}`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full shrink-0 ${STATUS_CFG[order.status].dot}`}
                            />
                            {STATUS_CFG[order.status].label}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-1">
                            <motion.button
                              onClick={() => handleOpenDetails(order)}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.96 }}
                              className="text-[12px] font-bold text-[#424843] font-[var(--font-work-sans)] px-3 py-1.5 rounded-lg hover:bg-[#f4f4ee] hover:text-[#032616] transition-colors"
                            >
                              Details
                            </motion.button>
                            {/* ⋮ Menu */}
                            <div className="relative">
                              <motion.button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenMenuId(
                                    openMenuId === order.id ? null : order.id
                                  );
                                }}
                                whileTap={{ scale: 0.9 }}
                                className="p-1.5 rounded-lg text-[#9ca8a3] hover:text-[#424843] hover:bg-[#f4f4ee] transition-colors"
                                aria-label="More options"
                              >
                                <MoreVertIcon />
                              </motion.button>
                              <AnimatePresence>
                                {openMenuId === order.id && (
                                  <motion.div
                                    initial={{ opacity: 0, y: 6, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 4, scale: 0.95 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl border border-[#e3e3dd] shadow-lg z-30 overflow-hidden"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    {[
                                      { label: "View Details", icon: <EyeIcon />, action: () => handleOpenDetails(order) },
                                      { label: "Update Status", icon: <RefreshIcon />, action: () => handleOpenDetails(order) },
                                      { label: "Print Invoice", icon: <PrintIcon />, action: () => setOpenMenuId(null) },
                                    ].map((item) => (
                                      <button
                                        key={item.label}
                                        onClick={() => { item.action(); setOpenMenuId(null); }}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-[12px] text-[#424843] font-[var(--font-work-sans)] hover:bg-[#fafaf4] transition-colors text-left"
                                      >
                                        <span className="text-[#9ca8a3]">{item.icon}</span>
                                        {item.label}
                                      </button>
                                    ))}
                                    <div className="border-t border-[#f4f4ee]">
                                      <button
                                        onClick={() => setOpenMenuId(null)}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-[12px] text-[#ba1a1a] font-bold font-[var(--font-work-sans)] hover:bg-[#ffd9d5]/20 transition-colors text-left"
                                      >
                                        <span><CancelIcon /></span>
                                        Cancel Order
                                      </button>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filtered.length > 0 && (
            <div className="px-6 py-4 flex items-center justify-between border-t border-[#f4f4ee] bg-[#fafaf4]/60 flex-wrap gap-3">
              <span className="text-[12px] text-[#9ca8a3] font-[var(--font-work-sans)]">
                Showing{" "}
                <span className="font-bold text-[#424843]">
                  {showingFrom}–{showingTo}
                </span>{" "}
                of{" "}
                <span className="font-bold text-[#424843]">{filtered.length}</span>{" "}
                orders
              </span>
              <div className="flex items-center gap-1.5" role="navigation" aria-label="Pagination">
                <PageBtn
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={safePage === 1}
                  aria-label="Previous page"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                </PageBtn>
                {pageNums.map((num) => (
                  <PageBtn
                    key={num}
                    onClick={() => setCurrentPage(num)}
                    active={safePage === num}
                    aria-label={`Page ${num}`}
                  >
                    {num}
                  </PageBtn>
                ))}
                <PageBtn
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={safePage === totalPages}
                  aria-label="Next page"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </PageBtn>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* ─── Order Details Panel ────────────────────── */}
      <AnimatePresence>
        {selectedOrder && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="fixed inset-0 bg-black/20 z-40"
            />

            {/* Drawer */}
            <motion.aside
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 280, damping: 28 }}
              className="fixed top-0 right-0 bottom-0 w-full sm:w-[420px] bg-[#fafaf4] z-50 shadow-2xl overflow-y-auto flex flex-col"
              aria-label="Order details"
            >
              {/* Drawer Header */}
              <div className="px-6 py-5 bg-white border-b border-[#e3e3dd] flex items-center justify-between shrink-0">
                <div>
                  <h2 className="font-[var(--font-libre-caslon)] text-lg font-bold text-[#032616]">
                    Order #{selectedOrder.id}
                  </h2>
                  <span
                    className={`inline-flex items-center gap-1.5 mt-1 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase font-[var(--font-work-sans)] ${
                      STATUS_CFG[selectedOrder.status].bg
                    } ${STATUS_CFG[selectedOrder.status].text}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${STATUS_CFG[selectedOrder.status].dot}`} />
                    {STATUS_CFG[selectedOrder.status].label}
                  </span>
                </div>
                <motion.button
                  onClick={() => setSelectedOrder(null)}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-lg text-[#9ca8a3] hover:text-[#032616] hover:bg-[#f4f4ee] transition-colors"
                  aria-label="Close panel"
                >
                  <CloseIcon />
                </motion.button>
              </div>

              {/* Drawer Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                {/* Customer */}
                <section className="bg-white rounded-xl p-5 border border-[#e3e3dd]">
                  <h3 className="text-[11px] font-bold tracking-widest uppercase text-[#727973] font-[var(--font-work-sans)] mb-3">
                    Customer
                  </h3>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm font-[var(--font-work-sans)] shrink-0"
                      style={{
                        background: selectedOrder.customer.avatarBg,
                        color: selectedOrder.customer.avatarText,
                      }}
                    >
                      {selectedOrder.customer.initials}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-[#1a1c19] font-[var(--font-work-sans)]">
                        {selectedOrder.customer.name}
                      </p>
                      <p className="text-[12px] text-[#9ca8a3] font-[var(--font-work-sans)]">
                        {selectedOrder.customer.email}
                      </p>
                    </div>
                  </div>
                </section>

                {/* Order Summary */}
                <section className="bg-white rounded-xl p-5 border border-[#e3e3dd]">
                  <h3 className="text-[11px] font-bold tracking-widest uppercase text-[#727973] font-[var(--font-work-sans)] mb-3">
                    Order Summary
                  </h3>
                  <div className="space-y-2.5">
                    {Array.from({ length: selectedOrder.items }).map((_, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-[#f4f4ee] shrink-0" />
                          <div>
                            <p className="text-[12px] font-bold text-[#1a1c19] font-[var(--font-work-sans)]">
                              {["Broccoli Microgreens", "Purple Radish Greens", "Chef's Starter Kit", "Sunflower Microgreens", "Kale Seeds", "Herb Blend", "Harvest Kit", "Basil Tray"][i % 8]}
                            </p>
                            <p className="text-[10px] text-[#9ca8a3] font-[var(--font-work-sans)]">
                              Qty: 1
                            </p>
                          </div>
                        </div>
                        <span className="text-[12px] font-bold text-[#1a1c19] font-[var(--font-work-sans)] tabular-nums">
                          {formatCurrency(selectedOrder.total / selectedOrder.items)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-[#f4f4ee] mt-4 pt-4 space-y-1.5">
                    <div className="flex justify-between text-[12px] text-[#727973] font-[var(--font-work-sans)]">
                      <span>Subtotal</span>
                      <span>{formatCurrency(selectedOrder.total * 0.95)}</span>
                    </div>
                    <div className="flex justify-between text-[12px] text-[#727973] font-[var(--font-work-sans)]">
                      <span>Tax (5%)</span>
                      <span>{formatCurrency(selectedOrder.total * 0.05)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-[#032616] font-[var(--font-work-sans)] pt-1">
                      <span>Total</span>
                      <span>{formatCurrency(selectedOrder.total)}</span>
                    </div>
                  </div>
                </section>

                {/* Shipping + Payment */}
                <section className="bg-white rounded-xl p-5 border border-[#e3e3dd] space-y-4">
                  <div>
                    <h3 className="text-[11px] font-bold tracking-widest uppercase text-[#727973] font-[var(--font-work-sans)] mb-1.5">
                      Shipping Address
                    </h3>
                    <p className="text-sm text-[#424843] font-[var(--font-work-sans)]">
                      {selectedOrder.address}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-[11px] font-bold tracking-widest uppercase text-[#727973] font-[var(--font-work-sans)] mb-1.5">
                      Payment Method
                    </h3>
                    <p className="text-sm text-[#424843] font-[var(--font-work-sans)]">
                      {selectedOrder.payment}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-[11px] font-bold tracking-widest uppercase text-[#727973] font-[var(--font-work-sans)] mb-1.5">
                      Order Date
                    </h3>
                    <p className="text-sm text-[#424843] font-[var(--font-work-sans)]">
                      {selectedOrder.date}
                    </p>
                  </div>
                </section>
              </div>

              {/* Drawer Footer */}
              <div className="px-6 py-5 bg-white border-t border-[#e3e3dd] shrink-0 space-y-2.5">
                <motion.button
                  onClick={() => handleStatusUpdate(selectedOrder.id)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.97 }}
                  disabled={updatingStatusId === selectedOrder.id}
                  className="w-full bg-[#032616] text-white font-bold text-[11px] tracking-widest uppercase font-[var(--font-work-sans)] py-3.5 rounded-xl hover:bg-[#386b00] transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {updatingStatusId === selectedOrder.id ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      />
                      Updating…
                    </>
                  ) : (
                    "Update Order Status"
                  )}
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  className="w-full border border-[#e3e3dd] text-[#424843] font-bold text-[11px] tracking-widest uppercase font-[var(--font-work-sans)] py-3 rounded-xl hover:bg-[#f4f4ee] transition-colors"
                >
                  Print Invoice
                </motion.button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

/* ─── Sub-components ─────────────────────────────────── */
function PageBtn({
  children,
  onClick,
  active = false,
  disabled = false,
  "aria-label": ariaLabel,
}: {
  children: ReactNode;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  "aria-label"?: string;
}) {
  return (
    <motion.button
      onClick={disabled ? undefined : onClick}
      whileTap={disabled ? {} : { scale: 0.9 }}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`min-w-[36px] h-9 px-2 rounded-lg text-[12px] font-bold font-[var(--font-work-sans)] flex items-center justify-center transition-colors ${
        active
          ? "bg-[#386b00] text-white shadow-sm"
          : disabled
          ? "border border-[#e3e3dd] text-[#c1c8c1] cursor-not-allowed"
          : "border border-[#e3e3dd] text-[#424843] hover:bg-[#f4f4ee] cursor-pointer"
      }`}
    >
      {children}
    </motion.button>
  );
}

function OrdersEmptyState({
  hasFilters,
  onReset,
}: {
  hasFilters: boolean;
  onReset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-6">
      <div className="w-14 h-14 rounded-2xl bg-[#f4f4ee] flex items-center justify-center mb-4">
        <svg className="w-7 h-7 text-[#c1c8c1]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3" />
          <rect width="13" height="8" x="9" y="11" rx="1" />
          <circle cx="12" cy="19" r="2" /><circle cx="19" cy="19" r="2" />
        </svg>
      </div>
      <h3 className="font-[var(--font-libre-caslon)] text-xl font-bold text-[#1a1c19] mb-2">
        {hasFilters ? "No orders found" : "No orders yet"}
      </h3>
      <p className="text-sm text-[#9ca8a3] font-[var(--font-work-sans)] max-w-xs mb-5">
        {hasFilters ? "Try adjusting your search or filter criteria." : "Orders will appear here once customers start purchasing."}
      </p>
      {hasFilters && (
        <motion.button
          onClick={onReset}
          whileTap={{ scale: 0.97 }}
          className="text-[11px] font-bold tracking-widest uppercase font-[var(--font-work-sans)] bg-[#032616] text-white px-5 py-2.5 rounded-lg hover:bg-[#386b00] transition-colors"
        >
          Clear Filters
        </motion.button>
      )}
    </div>
  );
}

/* ─── Icons ──────────────────────────────────────────── */
function DownloadIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}
function CartIcon() {
  return (
    <svg className="w-5 h-5 text-[#83a78f]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}
function TruckIcon({ color = "#424843" }: { color?: string }) {
  return (
    <svg className="w-5 h-5" fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24">
      <path d="M1 3h15v13H1z" /><path d="M16 8h4l3 3v5h-7V8z" />
      <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );
}
function PaymentsIcon() {
  return (
    <svg className="w-5 h-5 text-[#444841]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  );
}
function FilterListIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="16" y2="12" /><line x1="12" y1="18" x2="12" y2="18" strokeLinecap="round" strokeWidth="3" />
    </svg>
  );
}
function SortIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path d="m3 16 4 4 4-4M7 20V4M21 8l-4-4-4 4M17 4v16" />
    </svg>
  );
}
function MoreVertIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" />
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}
function EyeIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
  );
}
function RefreshIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-4" />
    </svg>
  );
}
function PrintIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" />
    </svg>
  );
}
function CancelIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" /><path d="m15 9-6 6M9 9l6 6" />
    </svg>
  );
}
