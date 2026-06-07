"use client";

import { formatCurrency } from "@/lib/currency";
import {
  useState,
  useMemo,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Types ──────────────────────────────────────────── */
type UserStatus = "active" | "inactive" | "suspended" | "pending";
type SubscriptionPlan =
  | "Weekly Harvest"
  | "Monthly Hearth"
  | "Seasonal Box"
  | "None";

interface User {
  id: string;
  name: string;
  email: string;
  initials: string;
  avatarBg?: string;
  avatarText?: string;
  avatarUrl?: string;
  subscription: SubscriptionPlan;
  joinDate: string;
  joinSortDate: number;
  orders: number;
  status: UserStatus;
  address: string;
  phone: string;
  totalSpend: number;
}

/* ─── Config ─────────────────────────────────────────── */
const STATUS_CFG: Record<
  UserStatus,
  { label: string; dot: string; text: string }
> = {
  active:    { label: "Active",    dot: "bg-[#386b00]", text: "text-[#386b00]" },
  inactive:  { label: "Inactive",  dot: "bg-[#727973]", text: "text-[#727973]" },
  suspended: { label: "Suspended", dot: "bg-[#ba1a1a]", text: "text-[#ba1a1a]" },
  pending:   { label: "Pending",   dot: "bg-[#f59e0b]", text: "text-[#7a4b00]" },
};

const PLAN_CFG: Record<
  SubscriptionPlan,
  { bg: string; text: string }
> = {
  "Weekly Harvest": { bg: "bg-[#a5f95b]",  text: "text-[#3b7100]"  },
  "Monthly Hearth": { bg: "bg-[#e1e4da]",  text: "text-[#444841]"  },
  "Seasonal Box":   { bg: "bg-[#c6ecd1]",  text: "text-[#032616]"  },
  "None":           { bg: "bg-[#e3e3dd]",  text: "text-[#424843]"  },
};

const AVATAR_PALETTE = [
  { bg: "#1b3c2a", text: "#aacfb6" },
  { bg: "#a5f95b", text: "#3b7100" },
  { bg: "#e1e4da", text: "#444841" },
  { bg: "#c6ecd1", text: "#032616" },
  { bg: "#ffdad6", text: "#ba1a1a" },
  { bg: "#386b00", text: "#ffffff" },
  { bg: "#eeeee9", text: "#424843" },
];

function mkUser(
  id: string,
  name: string,
  email: string,
  subscription: SubscriptionPlan,
  joinDate: string,
  joinSortDate: number,
  orders: number,
  status: UserStatus,
  address: string,
  phone: string,
  totalSpend: number,
  paletteIdx: number,
  avatarUrl?: string
): User {
  const parts = name.split(" ");
  const initials = parts.map((p) => p[0]).join("").slice(0, 2).toUpperCase();
  const pal = AVATAR_PALETTE[paletteIdx % AVATAR_PALETTE.length];
  return {
    id,
    name,
    email,
    initials,
    avatarBg: pal.bg,
    avatarText: pal.text,
    avatarUrl,
    subscription,
    joinDate,
    joinSortDate,
    orders,
    status,
    address,
    phone,
    totalSpend,
  };
}

/* ─── Mock Data — 40 users ───────────────────────────── */
const MOCK_USERS: User[] = [
  mkUser("USR-001", "Eleanor Vance",    "e.vance@example.com",         "Weekly Harvest",  "Oct 12, 2023", 20231012,  24, "active",    "42 Fern Way, Portland, OR 97201",         "+1 503 555 0101", 152962, 0),
  mkUser("USR-002", "Marcus Thorne",    "m.thorne@design.co",          "Monthly Hearth",  "Nov 05, 2023", 20231105,  12, "active",    "88 Birch Ave, Seattle, WA 98101",         "+1 206 555 0182", 64740,  1),
  mkUser("USR-003", "Sarah Jenkins",    "sarah.j@outlook.com",         "None",            "Jan 20, 2024", 20240120,   2, "inactive",  "215 Maple Dr, Austin, TX 78701",          "+1 512 555 0247",  7470,  2),
  mkUser("USR-004", "Dr. Leo Grant",    "leo.grant@university.edu",    "Weekly Harvest",  "Dec 02, 2023", 20231202,  48, "suspended", "1100 Oak St, Boston, MA 02101",           "+1 617 555 0338", 258960, 3),
  mkUser("USR-005", "Priya Mehta",      "p.mehta@startuplab.io",       "Seasonal Box",    "Mar 14, 2024", 20240314,   7, "active",    "560 Pine Ln, San Francisco, CA 94102",    "+1 415 555 0442",  39861,  4),
  mkUser("USR-006", "James Okafor",     "j.okafor@globalmail.com",     "Weekly Harvest",  "Feb 28, 2024", 20240228,  31, "active",    "73 Cedar Blvd, Chicago, IL 60601",        "+1 312 555 0519", 177620, 5),
  mkUser("USR-007", "Natalie Cruz",     "n.cruz@creativehub.net",      "Monthly Hearth",  "Sep 09, 2023", 20230909,  18, "active",    "9 Walnut Ct, Denver, CO 80202",           "+1 720 555 0673", 97110, 6),
  mkUser("USR-008", "Tom Halvorsen",    "t.halv@nordic.no",            "None",            "Apr 03, 2024", 20240403,   1, "pending",   "44 Spruce Rd, Minneapolis, MN 55401",     "+1 651 555 0710",  3735,   0),
  mkUser("USR-009", "Amelia Stone",     "a.stone@freshstart.org",      "Weekly Harvest",  "Jul 18, 2023", 20230718,  36, "active",    "201 Aspen Way, Nashville, TN 37201",      "+1 615 555 0829", 194220, 1),
  mkUser("USR-010", "Chen Wei",         "c.wei@techventure.cn",        "Seasonal Box",    "Nov 22, 2023", 20231122,  14, "active",    "305 Poplar Ave, Miami, FL 33101",         "+1 305 555 0953",  75592,  2),
  mkUser("USR-011", "Olivia Hart",      "o.hart@greenthumb.com",       "Weekly Harvest",  "Jun 05, 2023", 20230605,  55, "active",    "18 Elm St, Portland, OR 97204",           "+1 971 555 1011", 296725, 3),
  mkUser("USR-012", "Ryan Patel",       "r.patel@bluewave.in",         "Monthly Hearth",  "Aug 30, 2023", 20230830,   9, "inactive",  "67 Magnolia Ln, Phoenix, AZ 85001",       "+1 602 555 1122",  48555,  4),
  mkUser("USR-013", "Sophie Lefebvre", "s.lefebvre@vive.fr",           "None",            "Mar 01, 2024", 20240301,   0, "pending",   "12 Laurel Dr, Atlanta, GA 30301",         "+1 404 555 1243",     0,   5),
  mkUser("USR-014", "Daniel Osei",      "d.osei@afrotech.gh",          "Weekly Harvest",  "Oct 31, 2023", 20231031,  22, "active",    "490 Chestnut Blvd, Dallas, TX 75201",     "+1 214 555 1314", 118690, 6),
  mkUser("USR-015", "Isabella Novak",   "i.novak@creativeprague.cz",   "Seasonal Box",    "Jan 07, 2024", 20240107,  11, "active",    "33 Birchwood Ct, Las Vegas, NV 89101",    "+1 702 555 1455",  59387,  0),
  mkUser("USR-016", "Haruto Tanaka",    "h.tanaka@zenith.jp",          "Weekly Harvest",  "May 16, 2023", 20230516,  44, "active",    "850 Willow Ave, Seattle, WA 98103",       "+1 206 555 1536", 237380, 1),
  mkUser("USR-017", "Lena Müller",      "l.muller@organic.de",         "Monthly Hearth",  "Feb 10, 2024", 20240210,   6, "active",    "120 Redwood Dr, Denver, CO 80203",        "+1 720 555 1627",  32370,  2),
  mkUser("USR-018", "Carlos Rivera",    "c.rivera@solmarket.mx",       "None",            "Apr 25, 2024", 20240425,   3, "inactive",  "7 Ironwood Way, Austin, TX 78702",        "+1 512 555 1748",  11205,  3),
  mkUser("USR-019", "Fatima Al-Rashid", "f.alrashid@freshfields.ae",   "Weekly Harvest",  "Dec 18, 2023", 20231218,  29, "active",    "560 Maplewood Rd, Boston, MA 02102",      "+1 617 555 1839", 156455, 4),
  mkUser("USR-020", "Jack Brennan",     "j.brennan@islandco.ie",       "Seasonal Box",    "Sep 27, 2023", 20230927,  17, "active",    "240 Sycamore St, San Francisco, CA 94103","+1 415 555 1904", 91736, 5),
  mkUser("USR-021", "Yuki Sato",        "y.sato@harvestmoon.jp",       "Weekly Harvest",  "Jul 04, 2023", 20230704,  41, "active",    "88 Cypress Ave, Portland, OR 97205",      "+1 971 555 2015", 221195, 6),
  mkUser("USR-022", "Grace Kimani",     "g.kimani@bloomkenya.ke",      "Monthly Hearth",  "Mar 20, 2024", 20240320,   5, "active",    "19 Sequoia Rd, Chicago, IL 60602",        "+1 312 555 2136",  26975,  0),
  mkUser("USR-023", "Noah Adams",       "n.adams@rootsy.com",          "None",            "May 01, 2024", 20240501,   0, "pending",   "430 Hazel Ct, Miami, FL 33102",           "+1 305 555 2241",     0,   1),
  mkUser("USR-024", "Mei Lin",          "m.lin@greenpath.sg",          "Seasonal Box",    "Oct 08, 2023", 20231008,  20, "active",    "55 Rosewood Ln, Nashville, TN 37202",     "+1 615 555 2382", 107900, 2),
  mkUser("USR-025", "Ethan Brooks",     "e.brooks@farmfresh.ca",       "Weekly Harvest",  "Jan 15, 2024", 20240115,  16, "active",    "8 Cottonwood Blvd, Phoenix, AZ 85002",    "+1 602 555 2473", 86320, 3),
  mkUser("USR-026", "Aisha Diallo",     "a.diallo@soleil.sn",          "Monthly Hearth",  "Aug 12, 2023", 20230812,  10, "inactive",  "77 Juniper Ave, Atlanta, GA 30302",       "+1 404 555 2554",  53950,  4),
  mkUser("USR-027", "Oscar Lindqvist",  "o.lind@nordic.se",            "Weekly Harvest",  "Nov 14, 2023", 20231114,  33, "active",    "300 Fern Blvd, Dallas, TX 75202",         "+1 214 555 2635", 178035, 5),
  mkUser("USR-028", "Chloe Dupont",     "c.dupont@cuisine.fr",         "Seasonal Box",    "Feb 05, 2024", 20240205,   8, "active",    "14 Redwood Ct, Las Vegas, NV 89102",      "+1 702 555 2716",  43202,  6),
  mkUser("USR-029", "Samuel Owusu",     "s.owusu@agritech.gh",         "Weekly Harvest",  "Jun 20, 2023", 20230620,  50, "suspended", "650 Oakwood Dr, Seattle, WA 98104",       "+1 206 555 2857", 269750, 0),
  mkUser("USR-030", "Valentina Rossi",  "v.rossi@ortobiologico.it",     "Monthly Hearth",  "Apr 11, 2024", 20240411,   4, "active",    "92 Pinecrest Ave, Denver, CO 80204",      "+1 720 555 2938",  21580,  1),
  mkUser("USR-031", "Finn McCarthy",    "f.mc@irishgreens.ie",         "Weekly Harvest",  "Mar 08, 2024", 20240308,  19, "active",    "175 Birch Ln, Boston, MA 02103",          "+1 617 555 3019", 102505, 2),
  mkUser("USR-032", "Zara Hussain",     "z.hussain@spicetrail.pk",     "None",            "May 18, 2024", 20240518,   1, "pending",   "510 Elm St, San Francisco, CA 94104",     "+1 415 555 3140",  4565,   3),
  mkUser("USR-033", "Lucas Ferreira",   "l.ferreira@quintal.br",       "Seasonal Box",    "Dec 09, 2023", 20231209,  15, "active",    "28 Aspen Ct, Portland, OR 97206",         "+1 971 555 3251",  80987,  4),
  mkUser("USR-034", "Ingrid Björk",     "i.bjork@naturlig.se",         "Weekly Harvest",  "Aug 01, 2023", 20230801,  38, "active",    "3 Willow Way, Chicago, IL 60603",         "+1 312 555 3332", 205010, 5),
  mkUser("USR-035", "Mohammed Al-Amin", "m.alamin@freshsuq.sa",        "Monthly Hearth",  "Jan 28, 2024", 20240128,   7, "active",    "840 Magnolia Blvd, Miami, FL 33103",      "+1 305 555 3463",  37765,  6),
  mkUser("USR-036", "Isla MacGregor",   "i.mac@highlands.co.uk",       "Weekly Harvest",  "Oct 19, 2023", 20231019,  27, "active",    "61 Cedar Way, Nashville, TN 37203",       "+1 615 555 3544", 145665, 0),
  mkUser("USR-037", "Ben Nakamura",     "b.nak@tokyofarm.jp",          "Seasonal Box",    "Feb 22, 2024", 20240222,   9, "active",    "114 Spruce Ave, Phoenix, AZ 85003",       "+1 602 555 3625",  48597,  1),
  mkUser("USR-038", "Adaeze Obi",       "a.obi@ngoharvest.ng",         "None",            "May 30, 2024", 20240530,   0, "inactive",  "230 Ironwood Rd, Atlanta, GA 30303",      "+1 404 555 3706",     0,   2),
  mkUser("USR-039", "Pierre Dubois",    "p.dubois@marchebio.fr",       "Weekly Harvest",  "Sep 15, 2023", 20230915,  32, "active",    "78 Chestnut Dr, Dallas, TX 75203",        "+1 214 555 3887", 172640, 3),
  mkUser("USR-040", "Nadia Petrov",     "n.petrov@organiceast.ru",     "Monthly Hearth",  "Apr 17, 2024", 20240417,   6, "active",    "33 Sequoia Ln, Las Vegas, NV 89103",      "+1 702 555 3948",  32370,  4),
];

/* ─── Constants ──────────────────────────────────────── */
const ITEMS_PER_PAGE = 10;

const SORT_OPTIONS = [
  { value: "newest",     label: "Newest First"   },
  { value: "oldest",     label: "Oldest First"   },
  { value: "orders_hi",  label: "Most Orders"    },
  { value: "orders_lo",  label: "Fewest Orders"  },
  { value: "spend_hi",   label: "Highest Spend"  },
] as const;
type SortOpt = (typeof SORT_OPTIONS)[number]["value"];

/* ─── Page ───────────────────────────────────────────── */
export default function AdminUsersPage() {
  const [search, setSearch]           = useState("");
  const [statusFilter, setStatus]     = useState("");
  const [planFilter, setPlan]         = useState("");
  const [sortBy, setSortBy]           = useState<SortOpt>("newest");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [currentPage, setPage]        = useState(1);
  const [selectedUser, setUser]       = useState<User | null>(null);
  const [openMenuId, setOpenMenuId]   = useState<string | null>(null);
  const [csvLoading, setCsvLoading]   = useState(false);
  const [inviteOpen, setInviteOpen]   = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteSent, setInviteSent]   = useState(false);
  const [updatingId, setUpdatingId]   = useState<string | null>(null);

  const sortRef = useRef<HTMLDivElement>(null);

  /* Close dropdowns on outside click */
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setShowSortMenu(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    function close() { setOpenMenuId(null); }
    if (openMenuId) document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [openMenuId]);

  /* Derived stats */
  const totalUsers  = MOCK_USERS.length;
  const activeNow   = MOCK_USERS.filter((u) => u.status === "active").length;

  /* Filtered + sorted */
  const filtered = useMemo(() => {
    let r = MOCK_USERS.filter((u) => {
      const q = search.toLowerCase();
      const matchQ =
        !search ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.id.toLowerCase().includes(q);
      const matchS = !statusFilter || u.status === statusFilter;
      const matchP = !planFilter   || u.subscription === planFilter;
      return matchQ && matchS && matchP;
    });
    r = [...r].sort((a, b) => {
      switch (sortBy) {
        case "newest":    return b.joinSortDate - a.joinSortDate;
        case "oldest":    return a.joinSortDate - b.joinSortDate;
        case "orders_hi": return b.orders - a.orders;
        case "orders_lo": return a.orders - b.orders;
        case "spend_hi":  return b.totalSpend - a.totalSpend;
        default: return 0;
      }
    });
    return r;
  }, [search, statusFilter, planFilter, sortBy]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const safePage   = Math.min(currentPage, Math.max(totalPages, 1));
  const paginated  = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);
  const showFrom   = filtered.length === 0 ? 0 : (safePage - 1) * ITEMS_PER_PAGE + 1;
  const showTo     = Math.min(safePage * ITEMS_PER_PAGE, filtered.length);

  /* Pagination window: 3 page numbers + ellipsis + last */
  const pageWindow = useMemo(() => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const near = Math.max(1, Math.min(safePage - 1, totalPages - 3));
    const nums: (number | null)[] = [near, near + 1, near + 2];
    if (near + 2 < totalPages) { nums.push(null); nums.push(totalPages); }
    return nums;
  }, [totalPages, safePage]);

  /* Handlers */
  const resetAll = useCallback(() => {
    setSearch(""); setStatus(""); setPlan(""); setPage(1);
  }, []);

  const handleCsv = useCallback(async () => {
    setCsvLoading(true);
    await new Promise((r) => setTimeout(r, 1400));
    setCsvLoading(false);
  }, []);

  const handleInvite = useCallback(async () => {
    if (!inviteEmail.trim()) return;
    setUpdatingId("invite");
    await new Promise((r) => setTimeout(r, 1000));
    setUpdatingId(null);
    setInviteSent(true);
    setTimeout(() => { setInviteSent(false); setInviteEmail(""); setInviteOpen(false); }, 2000);
  }, [inviteEmail]);

  const handleStatusChange = useCallback(async (userId: string) => {
    setUpdatingId(userId);
    await new Promise((r) => setTimeout(r, 700));
    setUpdatingId(null);
    setUser(null);
  }, []);

  return (
    <>
      <div className="space-y-5 pb-20 md:pb-6">
        {/* ── Page Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
        >
          <div>
            <h1 className="font-[var(--font-libre-caslon)] text-[28px] md:text-[36px] font-bold text-[#032616] leading-tight">
              User Management
            </h1>
            <div className="flex items-center gap-4 mt-2 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold tracking-widest uppercase font-[var(--font-work-sans)] text-[#386b00]">
                  Total Users
                </span>
                <span className="font-[var(--font-libre-caslon)] text-xl font-bold text-[#032616]">
                  {totalUsers.toLocaleString()}
                </span>
              </div>
              <span className="w-px h-4 bg-[#c1c8c1]" />
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold tracking-widest uppercase font-[var(--font-work-sans)] text-[#424843]">
                  Active Now
                </span>
                <span className="font-[var(--font-libre-caslon)] text-xl font-bold text-[#032616]">
                  {activeNow}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            {/* Export CSV */}
            <motion.button
              onClick={handleCsv}
              disabled={csvLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 bg-[#e8e8e3] text-[#032616] font-bold text-[11px] tracking-widest uppercase font-[var(--font-work-sans)] px-5 py-3 rounded-lg hover:bg-[#dcdcd8] transition-colors disabled:opacity-70"
            >
              {csvLoading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}
                    className="w-4 h-4 border-2 border-[#032616]/20 border-t-[#032616] rounded-full"
                  />
                  Exporting…
                </>
              ) : (
                <>
                  <DownloadIcon />
                  Export CSV
                </>
              )}
            </motion.button>
            {/* Manual Invite */}
            <motion.button
              onClick={() => setInviteOpen(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 bg-[#386b00] text-white font-bold text-[11px] tracking-widest uppercase font-[var(--font-work-sans)] px-5 py-3 rounded-lg shadow-sm hover:bg-[#4a8a00] transition-colors"
            >
              <PersonAddIcon />
              Manual Invite
            </motion.button>
          </div>
        </motion.div>

        {/* ── Search / Filter Bar ── */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1, ease: [0.25, 0.4, 0.25, 1] }}
          className="bg-white rounded-xl p-5 border border-[#e3e3dd] shadow-sm"
          aria-label="User filters"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
            {/* Search */}
            <div className="relative flex-1 min-w-0">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca8a3] pointer-events-none"
                fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search by name, email, or ID..."
                className="w-full pl-11 pr-4 py-3 border border-[#e3e3dd] rounded-lg text-sm text-[#1a1c19] placeholder:text-[#b0b8b0] font-[var(--font-work-sans)] bg-white focus:outline-none focus:border-[#386b00] focus:ring-1 focus:ring-[#386b00]/30 transition-colors"
              />
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Status filter */}
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => { setStatus(e.target.value); setPage(1); }}
                  className="appearance-none bg-white border border-[#e3e3dd] rounded-lg pl-4 pr-9 py-3 text-sm text-[#1a1c19] font-[var(--font-work-sans)] focus:outline-none focus:border-[#386b00] focus:ring-1 focus:ring-[#386b00]/30 transition-colors cursor-pointer min-w-[140px]"
                >
                  <option value="">Status: All</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                  <option value="pending">Pending</option>
                </select>
                <ChevronDownIcon />
              </div>

              {/* Plan filter */}
              <div className="relative">
                <select
                  value={planFilter}
                  onChange={(e) => { setPlan(e.target.value); setPage(1); }}
                  className="appearance-none bg-white border border-[#e3e3dd] rounded-lg pl-4 pr-9 py-3 text-sm text-[#1a1c19] font-[var(--font-work-sans)] focus:outline-none focus:border-[#386b00] focus:ring-1 focus:ring-[#386b00]/30 transition-colors cursor-pointer min-w-[160px]"
                >
                  <option value="">Plan: All Plans</option>
                  <option value="Weekly Harvest">Weekly Harvest</option>
                  <option value="Monthly Hearth">Monthly Hearth</option>
                  <option value="Seasonal Box">Seasonal Box</option>
                  <option value="None">None</option>
                </select>
                <ChevronDownIcon />
              </div>

              {/* Sort menu */}
              <div ref={sortRef} className="relative">
                <motion.button
                  onClick={() => setShowSortMenu((s) => !s)}
                  whileTap={{ scale: 0.93 }}
                  className={`p-3 rounded-lg border transition-colors ${
                    showSortMenu
                      ? "bg-[#032616] border-[#032616] text-white"
                      : "border-[#e3e3dd] text-[#9ca8a3] hover:text-[#424843] hover:bg-[#f4f4ee]"
                  }`}
                  aria-label="Sort"
                >
                  <FilterListIcon />
                </motion.button>
                <AnimatePresence>
                  {showSortMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl border border-[#e3e3dd] shadow-lg z-30 overflow-hidden"
                    >
                      {SORT_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => { setSortBy(opt.value); setPage(1); setShowSortMenu(false); }}
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
        </motion.section>

        {/* ── Table Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
          className="bg-white rounded-xl border border-[#e3e3dd] shadow-sm overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[760px]" aria-label="Users table">
              <thead className="border-b border-[#f4f4ee] bg-[#fafaf4]/60">
                <tr>
                  {["User Details", "Subscription", "Join Date", "Orders", "Status", ""].map((col, i) => (
                    <th
                      key={col + i}
                      className={`px-6 py-4 text-[11px] font-bold tracking-widest uppercase font-[var(--font-work-sans)] text-[#727973] ${
                        i === 3 ? "text-center" : i === 5 ? "text-right" : ""
                      }`}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="wait" initial={false}>
                  {paginated.length === 0 ? (
                    <tr key="empty">
                      <td colSpan={6}>
                        <UsersEmptyState
                          hasFilters={!!(search || statusFilter || planFilter)}
                          onReset={resetAll}
                        />
                      </td>
                    </tr>
                  ) : (
                    paginated.map((user, i) => (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: i * 0.04, duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
                        className={`border-b border-[#f4f4ee] last:border-0 transition-colors ${
                          selectedUser?.id === user.id ? "bg-[#f4f4ee]/60" : "hover:bg-[#fafaf4]"
                        }`}
                      >
                        {/* User Details */}
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <UserAvatar user={user} size="md" />
                            <div className="min-w-0">
                              <p className="font-bold text-sm text-[#032616] font-[var(--font-work-sans)] truncate">
                                {user.name}
                              </p>
                              <p className="text-[12px] text-[#9ca8a3] font-[var(--font-work-sans)] truncate">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Subscription */}
                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex px-3 py-1.5 rounded-full text-[11px] font-bold font-[var(--font-work-sans)] ${
                              PLAN_CFG[user.subscription].bg
                            } ${PLAN_CFG[user.subscription].text}`}
                          >
                            {user.subscription}
                          </span>
                        </td>

                        {/* Join Date */}
                        <td className="px-6 py-5">
                          <span className="text-sm text-[#424843] font-[var(--font-work-sans)] whitespace-nowrap">
                            {user.joinDate}
                          </span>
                        </td>

                        {/* Orders */}
                        <td className="px-6 py-5 text-center">
                          <span className="font-bold text-sm text-[#032616] font-[var(--font-work-sans)] tabular-nums">
                            {user.orders}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-5">
                          <div className={`flex items-center gap-2 ${STATUS_CFG[user.status].text}`}>
                            <span className={`w-2 h-2 rounded-full shrink-0 ${STATUS_CFG[user.status].dot}`} />
                            <span className="font-bold text-[12px] font-[var(--font-work-sans)]">
                              {STATUS_CFG[user.status].label}
                            </span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-5">
                          <div className="flex items-center justify-end gap-1">
                            <motion.button
                              onClick={() => setUser(user)}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.96 }}
                              className="text-[12px] font-bold text-[#032616] font-[var(--font-work-sans)] px-3 py-1.5 rounded-lg hover:bg-[#f4f4ee] transition-colors hover:underline"
                            >
                              View Profile
                            </motion.button>
                            <div className="relative">
                              <motion.button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenMenuId(openMenuId === user.id ? null : user.id);
                                }}
                                whileTap={{ scale: 0.9 }}
                                className="p-1.5 rounded-lg text-[#9ca8a3] hover:text-[#424843] hover:bg-[#f4f4ee] transition-colors"
                                aria-label="More options"
                              >
                                <MoreVertIcon />
                              </motion.button>
                              <AnimatePresence>
                                {openMenuId === user.id && (
                                  <motion.div
                                    initial={{ opacity: 0, y: 6, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 4, scale: 0.95 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl border border-[#e3e3dd] shadow-lg z-30 overflow-hidden"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    {[
                                      { label: "View Profile",    icon: <EyeIcon />,     action: () => setUser(user) },
                                      { label: "Edit User",       icon: <EditIcon />,    action: () => setUser(user) },
                                      { label: "Reset Password",  icon: <KeyIcon />,     action: () => setOpenMenuId(null) },
                                      { label: "View Orders",     icon: <CartSmIcon />,  action: () => setOpenMenuId(null) },
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
                                      {user.status === "suspended" ? (
                                        <button
                                          onClick={() => { handleStatusChange(user.id); setOpenMenuId(null); }}
                                          className="w-full flex items-center gap-3 px-4 py-3 text-[12px] text-[#386b00] font-bold font-[var(--font-work-sans)] hover:bg-[#f4f4ee] transition-colors text-left"
                                        >
                                          <span><CheckIcon /></span>
                                          Reactivate User
                                        </button>
                                      ) : (
                                        <button
                                          onClick={() => { setOpenMenuId(null); }}
                                          className="w-full flex items-center gap-3 px-4 py-3 text-[12px] text-[#ba1a1a] font-bold font-[var(--font-work-sans)] hover:bg-[#ffd9d5]/20 transition-colors text-left"
                                        >
                                          <span><SuspendIcon /></span>
                                          Suspend User
                                        </button>
                                      )}
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
            <div className="px-6 py-4 border-t border-[#f4f4ee] bg-[#fafaf4]/60 flex items-center justify-between flex-wrap gap-3">
              <span className="text-[12px] text-[#9ca8a3] font-[var(--font-work-sans)]">
                Showing{" "}
                <span className="font-bold text-[#424843]">{showFrom} to {showTo}</span>
                {" "}of{" "}
                <span className="font-bold text-[#424843]">{filtered.length}</span> users
              </span>
              <div className="flex items-center gap-1.5" role="navigation" aria-label="Pagination">
                <PageBtn
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={safePage === 1}
                  aria-label="Previous page"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                </PageBtn>
                {pageWindow.map((num, idx) =>
                  num === null ? (
                    <span key={`ellipsis-${idx}`} className="px-1 text-[#9ca8a3] text-sm select-none">…</span>
                  ) : (
                    <PageBtn
                      key={num}
                      onClick={() => setPage(num)}
                      active={safePage === num}
                      aria-label={`Page ${num}`}
                    >
                      {num}
                    </PageBtn>
                  )
                )}
                <PageBtn
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
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

      {/* ── User Profile Drawer ── */}
      <AnimatePresence>
        {selectedUser && (
          <>
            <motion.div
              key="user-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setUser(null)}
              className="fixed inset-0 bg-black/20 z-40"
            />
            <motion.aside
              key="user-drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 280, damping: 28 }}
              className="fixed top-0 right-0 bottom-0 w-full sm:w-[420px] bg-[#fafaf4] z-50 shadow-2xl flex flex-col"
              aria-label="User profile"
            >
              {/* Drawer Header */}
              <div className="px-6 py-5 bg-white border-b border-[#e3e3dd] flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <UserAvatar user={selectedUser} size="lg" />
                  <div>
                    <h2 className="font-[var(--font-libre-caslon)] text-lg font-bold text-[#032616]">
                      {selectedUser.name}
                    </h2>
                    <p className="text-[12px] text-[#9ca8a3] font-[var(--font-work-sans)]">
                      {selectedUser.id}
                    </p>
                  </div>
                </div>
                <motion.button
                  onClick={() => setUser(null)}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-lg text-[#9ca8a3] hover:text-[#032616] hover:bg-[#f4f4ee] transition-colors"
                  aria-label="Close"
                >
                  <CloseIcon />
                </motion.button>
              </div>

              {/* Drawer Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                {/* Status + Plan */}
                <div className="flex gap-3 flex-wrap">
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold font-[var(--font-work-sans)] ${STATUS_CFG[selectedUser.status].text}`}
                    style={{ background: selectedUser.status === "active" ? "#d4f4a0" : selectedUser.status === "suspended" ? "#ffdad6" : selectedUser.status === "pending" ? "#fff3cd" : "#e3e3dd" }}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${STATUS_CFG[selectedUser.status].dot}`} />
                    {STATUS_CFG[selectedUser.status].label}
                  </div>
                  <span className={`inline-flex px-3 py-1.5 rounded-full text-[11px] font-bold font-[var(--font-work-sans)] ${PLAN_CFG[selectedUser.subscription].bg} ${PLAN_CFG[selectedUser.subscription].text}`}>
                    {selectedUser.subscription}
                  </span>
                </div>

                {/* Contact */}
                <section className="bg-white rounded-xl p-5 border border-[#e3e3dd]">
                  <h3 className="text-[11px] font-bold tracking-widest uppercase text-[#727973] font-[var(--font-work-sans)] mb-3">
                    Contact
                  </h3>
                  <div className="space-y-2">
                    <InfoRow label="Email"     value={selectedUser.email} />
                    <InfoRow label="Phone"     value={selectedUser.phone} />
                    <InfoRow label="Address"   value={selectedUser.address} />
                  </div>
                </section>

                {/* Activity Stats */}
                <section className="bg-white rounded-xl p-5 border border-[#e3e3dd]">
                  <h3 className="text-[11px] font-bold tracking-widest uppercase text-[#727973] font-[var(--font-work-sans)] mb-3">
                    Activity
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    <StatMini label="Orders"     value={String(selectedUser.orders)} />
                    <StatMini label="Total Spend" value={formatCurrency(selectedUser.totalSpend)} />
                    <StatMini label="Member Since" value={selectedUser.joinDate.split(",")[0]} />
                  </div>
                </section>

                {/* Recent Orders placeholder */}
                <section className="bg-white rounded-xl p-5 border border-[#e3e3dd]">
                  <h3 className="text-[11px] font-bold tracking-widest uppercase text-[#727973] font-[var(--font-work-sans)] mb-3">
                    Recent Orders
                  </h3>
                  {selectedUser.orders === 0 ? (
                    <p className="text-sm text-[#9ca8a3] font-[var(--font-work-sans)]">No orders placed yet.</p>
                  ) : (
                    <div className="space-y-2.5">
                      {Array.from({ length: Math.min(selectedUser.orders, 3) }).map((_, i) => (
                        <div key={i} className="flex items-center justify-between py-2 border-b border-[#f4f4ee] last:border-0">
                          <div>
                            <p className="text-[12px] font-bold text-[#1a1c19] font-[var(--font-work-sans)]">
                              #HH-{2900 + (selectedUser.orders - i)}
                            </p>
                            <p className="text-[10px] text-[#9ca8a3] font-[var(--font-work-sans)]">
                              {["Broccoli Microgreens", "Chef's Starter Kit", "Weekly Harvest Box"][i % 3]}
                            </p>
                          </div>
                          <span className="text-[12px] font-bold text-[#1a1c19] font-[var(--font-work-sans)] tabular-nums">
                            {formatCurrency(selectedUser.totalSpend / selectedUser.orders)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              </div>

              {/* Drawer Footer */}
              <div className="px-6 py-5 bg-white border-t border-[#e3e3dd] shrink-0 space-y-2.5">
                <motion.button
                  onClick={() => handleStatusChange(selectedUser.id)}
                  disabled={updatingId === selectedUser.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.97 }}
                  className={`w-full font-bold text-[11px] tracking-widest uppercase font-[var(--font-work-sans)] py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-60 ${
                    selectedUser.status === "suspended"
                      ? "bg-[#386b00] text-white hover:bg-[#4a8a00]"
                      : selectedUser.status === "active"
                      ? "bg-[#032616] text-white hover:bg-[#386b00]"
                      : "bg-[#032616] text-white hover:bg-[#386b00]"
                  }`}
                >
                  {updatingId === selectedUser.id ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      />
                      Updating…
                    </>
                  ) : selectedUser.status === "suspended" ? (
                    "Reactivate Account"
                  ) : (
                    "Update Account Status"
                  )}
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  className="w-full border border-[#e3e3dd] text-[#424843] font-bold text-[11px] tracking-widest uppercase font-[var(--font-work-sans)] py-3 rounded-xl hover:bg-[#f4f4ee] transition-colors"
                >
                  Reset Password
                </motion.button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Manual Invite Modal ── */}
      <AnimatePresence>
        {inviteOpen && (
          <>
            <motion.div
              key="invite-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setInviteOpen(false); setInviteEmail(""); setInviteSent(false); }}
              className="fixed inset-0 bg-black/30 z-50"
            />
            <motion.div
              key="invite-modal"
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ type: "spring", stiffness: 300, damping: 26 }}
              className="fixed inset-0 flex items-center justify-center z-50 px-4"
            >
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-[var(--font-libre-caslon)] text-xl font-bold text-[#032616]">
                    Manual Invite
                  </h2>
                  <motion.button
                    onClick={() => { setInviteOpen(false); setInviteEmail(""); setInviteSent(false); }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-lg text-[#9ca8a3] hover:text-[#032616] hover:bg-[#f4f4ee] transition-colors"
                  >
                    <CloseIcon />
                  </motion.button>
                </div>
                <AnimatePresence mode="wait">
                  {inviteSent ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center gap-3 py-4"
                    >
                      <div className="w-12 h-12 rounded-full bg-[#d4f4a0] flex items-center justify-center">
                        <CheckIcon className="w-6 h-6 text-[#386b00]" />
                      </div>
                      <p className="font-bold text-[#032616] font-[var(--font-work-sans)]">Invitation Sent!</p>
                      <p className="text-sm text-[#727973] font-[var(--font-work-sans)] text-center">
                        {inviteEmail} will receive an invite shortly.
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div key="form" className="space-y-5">
                      <div>
                        <label className="block text-[11px] font-bold tracking-widest uppercase text-[#727973] font-[var(--font-work-sans)] mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={inviteEmail}
                          onChange={(e) => setInviteEmail(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleInvite()}
                          placeholder="user@example.com"
                          className="w-full px-4 py-3 border border-[#e3e3dd] rounded-lg text-sm text-[#1a1c19] placeholder:text-[#b0b8b0] font-[var(--font-work-sans)] bg-white focus:outline-none focus:border-[#386b00] focus:ring-1 focus:ring-[#386b00]/30 transition-colors"
                          autoFocus
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold tracking-widest uppercase text-[#727973] font-[var(--font-work-sans)] mb-2">
                          Subscription Plan
                        </label>
                        <div className="relative">
                          <select className="w-full appearance-none bg-white border border-[#e3e3dd] rounded-lg px-4 pr-9 py-3 text-sm text-[#1a1c19] font-[var(--font-work-sans)] focus:outline-none focus:border-[#386b00] focus:ring-1 focus:ring-[#386b00]/30 cursor-pointer">
                            <option>Weekly Harvest</option>
                            <option>Monthly Hearth</option>
                            <option>Seasonal Box</option>
                            <option>None</option>
                          </select>
                          <ChevronDownIcon />
                        </div>
                      </div>
                      <motion.button
                        onClick={handleInvite}
                        disabled={!inviteEmail.trim() || updatingId === "invite"}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.97 }}
                        className="w-full bg-[#386b00] text-white font-bold text-[11px] tracking-widest uppercase font-[var(--font-work-sans)] py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-[#4a8a00] transition-colors disabled:opacity-50"
                      >
                        {updatingId === "invite" ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}
                              className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                            />
                            Sending…
                          </>
                        ) : (
                          <>
                            <PersonAddIcon />
                            Send Invitation
                          </>
                        )}
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

/* ─── UserAvatar ─────────────────────────────────────── */
function UserAvatar({ user, size = "md" }: { user: User; size?: "md" | "lg" }) {
  const dim = size === "lg" ? "w-12 h-12 text-sm" : "w-10 h-10 text-[11px]";
  return (
    <div
      className={`${dim} rounded-full flex items-center justify-center font-bold font-[var(--font-work-sans)] shrink-0 overflow-hidden ring-2 ring-[#e3e3dd]`}
      style={{
        background: user.avatarBg,
        color: user.avatarText,
      }}
    >
      {user.initials}
    </div>
  );
}

/* ─── InfoRow ────────────────────────────────────────── */
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-[11px] text-[#9ca8a3] font-[var(--font-work-sans)] shrink-0 mt-0.5">{label}</span>
      <span className="text-[12px] text-[#424843] font-[var(--font-work-sans)] text-right">{value}</span>
    </div>
  );
}

/* ─── StatMini ───────────────────────────────────────── */
function StatMini({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[#f4f4ee] rounded-lg p-3 text-center">
      <p className="font-[var(--font-libre-caslon)] text-xl font-bold text-[#032616] leading-none mb-1">
        {value}
      </p>
      <p className="text-[10px] text-[#9ca8a3] font-[var(--font-work-sans)] uppercase tracking-wider">
        {label}
      </p>
    </div>
  );
}

/* ─── PageBtn ────────────────────────────────────────── */
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
          ? "bg-[#032616] text-white shadow-sm"
          : disabled
          ? "border border-[#e3e3dd] text-[#c1c8c1] cursor-not-allowed"
          : "border border-[#e3e3dd] text-[#424843] hover:bg-[#f4f4ee] cursor-pointer"
      }`}
    >
      {children}
    </motion.button>
  );
}

/* ─── EmptyState ─────────────────────────────────────── */
function UsersEmptyState({ hasFilters, onReset }: { hasFilters: boolean; onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-6">
      <div className="w-14 h-14 rounded-2xl bg-[#f4f4ee] flex items-center justify-center mb-4">
        <svg className="w-7 h-7 text-[#c1c8c1]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      </div>
      <h3 className="font-[var(--font-libre-caslon)] text-xl font-bold text-[#1a1c19] mb-2">
        {hasFilters ? "No users found" : "No users yet"}
      </h3>
      <p className="text-sm text-[#9ca8a3] font-[var(--font-work-sans)] max-w-xs mb-5">
        {hasFilters ? "Try adjusting your search or filter criteria." : "Users will appear here once they register."}
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
function PersonAddIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
      <line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" />
    </svg>
  );
}
function FilterListIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path d="m3 16 4 4 4-4M7 20V4M21 8l-4-4-4 4M17 4v16" />
    </svg>
  );
}
function ChevronDownIcon() {
  return (
    <svg
      className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#727973] pointer-events-none"
      fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"
    >
      <path d="m6 9 6 6 6-6" />
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
function EditIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4Z" />
    </svg>
  );
}
function KeyIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="7.5" cy="15.5" r="5.5" />
      <path d="m21 2-9.6 9.6M15.5 7.5l3 3" />
    </svg>
  );
}
function CartSmIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}
function SuspendIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" /><path d="M4.93 4.93l14.14 14.14" />
    </svg>
  );
}
function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className ?? "w-3.5 h-3.5"} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
