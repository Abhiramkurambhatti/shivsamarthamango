"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { API_URL } from "@/lib/config";
import {
  TrendingUp,
  Package,
  ShoppingBag,
  MessageSquare,
  ExternalLink,
  RefreshCw,
  IndianRupee,
  CheckCircle2,
  AlertTriangle,
  BarChart3,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Check,
  X,
  Send,
  Phone,
  Mail,
  Truck,
  ArrowUpRight,
  ShieldAlert,
  ChevronRight,
  Boxes,
  Settings,
  Layers,
  ArrowRight,
  Store,
  LogOut,
  Lock,
  EyeOff,
  ShieldCheck,
  AlertCircle,
  Upload,
  Image as ImageIcon,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────
// TYPES & INTERFACES
// ─────────────────────────────────────────────────────────────
export type AdminTab = "overview" | "products" | "orders" | "enquiries" | "inventory" | "settings";

export interface ProductItem {
  id: number;
  name: string;
  name_mr?: string;
  slug: string;
  category: "hapus" | "other" | "gift";
  description?: string;
  description_mr?: string;
  weight_kg: number | string;
  price: number | string;
  compare_at_price?: number | string | null;
  stock_quantity: number;
  image_url: string;
  available_units?: string[];
  unit_prices?: Record<string, number>;
  is_featured: boolean;
  is_active: boolean;
  created_at?: string;
}

export interface OrderItem {
  id: number;
  order_number: string;
  customer_name: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  pincode: string;
  items: Array<{
    id?: number;
    title?: string;
    name?: string;
    price?: number;
    quantity?: number;
    qty?: number;
    weight?: string;
    grade?: string;
  }>;
  subtotal: number | string;
  payment_method: "whatsapp" | "gateway";
  status: "new" | "confirmed" | "processing" | "shipped" | "completed" | "cancelled";
  notes?: string;
  courier_name?: string;
  tracking_number?: string;
  created_at: string;
}

export interface EnquiryItem {
  id: number;
  name: string;
  phone: string;
  email?: string;
  subject?: string;
  message: string;
  status: "new" | "in_progress" | "resolved";
  notes?: string;
  created_at: string;
}

export interface AdminSummaryData {
  products: number;
  active_products: number;
  orders: number;
  new_orders: number;
  enquiries: number;
  new_enquiries: number;
  total_revenue: number;
  today_revenue: number;
  this_month_revenue: number;
  prev_month_revenue: number;
  revenue_growth_pct: number;
  avg_order_value: number;
  order_status_distribution: Record<string, number>;
  payment_method_distribution: Record<string, number>;
  inventory: Array<{
    id: number;
    name: string;
    category: string;
    stock: number;
    price: number;
    is_active: boolean;
    total_value?: number;
  }>;
  total_inventory_value?: number;
  low_stock_count?: number;
  out_of_stock_count?: number;
  timeline: Array<{
    date: string;
    raw_date?: string;
    orders: number;
    revenue: number;
  }>;
  recent_orders?: Array<{
    id: number;
    order_number: string;
    customer_name: string;
    phone: string;
    subtotal: number;
    status: string;
    payment_method: string;
    created_at: string;
  }>;
  recent_enquiries?: Array<{
    id: number;
    name: string;
    phone: string;
    email: string;
    subject?: string;
    message: string;
    status: string;
    created_at: string;
  }>;
  range?: string;
}

const statusMeta: Record<string, { label: string; color: string; bg: string }> = {
  new: { label: "New", color: "#b45309", bg: "#fef3c7" },
  confirmed: { label: "Confirmed", color: "#15803d", bg: "#dcfce7" },
  processing: { label: "Processing", color: "#1d4ed8", bg: "#dbeafe" },
  shipped: { label: "Shipped", color: "#0e7490", bg: "#cffafe" },
  completed: { label: "Completed", color: "#166534", bg: "#bbf7d0" },
  cancelled: { label: "Cancelled", color: "#b91c1c", bg: "#fee2e2" },
};

const enquiryStatusMeta: Record<string, { label: string; color: string; bg: string }> = {
  new: { label: "New", color: "#b45309", bg: "#fef3c7" },
  in_progress: { label: "In Progress", color: "#1d4ed8", bg: "#dbeafe" },
  resolved: { label: "Resolved", color: "#15803d", bg: "#dcfce7" },
};

// ─────────────────────────────────────────────────────────────
// MAIN ADMIN DASHBOARD COMPONENT
// ─────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [summary, setSummary] = useState<AdminSummaryData | null>(null);
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "1y">("7d");
  const [loading, setLoading] = useState<boolean>(true);
  const [isLive, setIsLive] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Authentication State
  const [authState, setAuthState] = useState<"checking" | "authenticated" | "unauthenticated">("checking");
  const [adminUser, setAdminUser] = useState<{ username: string; is_superuser?: boolean } | null>(null);
  const [loginUsername, setLoginUsername] = useState<string>("");
  const [loginPassword, setLoginPassword] = useState<string>("");
  const [loginShowPassword, setLoginShowPassword] = useState<boolean>(false);
  const [loginRemember, setLoginRemember] = useState<boolean>(true);
  const [loginLoading, setLoginLoading] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Entities
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [enquiries, setEnquiries] = useState<EnquiryItem[]>([]);

  // Modals state
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState<boolean>(false);
  const [deletingProduct, setDeletingProduct] = useState<ProductItem | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [selectedEnquiry, setSelectedEnquiry] = useState<EnquiryItem | null>(null);

  // Trigger Toast Notification
  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  }, []);

  // Fetch summary
  const fetchSummary = useCallback(async (range = timeRange) => {
    try {
      const storedToken =
        typeof window !== "undefined"
          ? localStorage.getItem("shivsamarth_admin_token") || sessionStorage.getItem("shivsamarth_admin_token")
          : null;
      const headers: Record<string, string> = {};
      if (storedToken) {
        headers["Authorization"] = `Bearer ${storedToken}`;
      }
      const res = await fetch(`${API_URL}/admin/summary/?range=${range}`, { headers });
      if (res.ok) {
        const data = await res.json();
        setSummary(data);
        setIsLive(true);
      }
    } catch (e) {
      console.error("Error fetching summary:", e);
    }
  }, [timeRange]);

  // Fetch products
  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/products/?all=true`);
      if (res.ok) {
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : data.results || []);
      }
    } catch (e) {
      console.error("Error fetching products:", e);
    }
  }, []);

  // Fetch orders
  const fetchOrders = useCallback(async () => {
    try {
      const storedToken =
        typeof window !== "undefined"
          ? localStorage.getItem("shivsamarth_admin_token") || sessionStorage.getItem("shivsamarth_admin_token")
          : null;
      const headers: Record<string, string> = {};
      if (storedToken) {
        headers["Authorization"] = `Bearer ${storedToken}`;
      }
      const res = await fetch(`${API_URL}/orders/`, { headers });
      if (res.ok) {
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : data.results || []);
      }
    } catch (e) {
      console.error("Error fetching orders:", e);
    }
  }, []);

  // Fetch enquiries
  const fetchEnquiries = useCallback(async () => {
    try {
      const storedToken =
        typeof window !== "undefined"
          ? localStorage.getItem("shivsamarth_admin_token") || sessionStorage.getItem("shivsamarth_admin_token")
          : null;
      const headers: Record<string, string> = {};
      if (storedToken) {
        headers["Authorization"] = `Bearer ${storedToken}`;
      }
      const res = await fetch(`${API_URL}/enquiries/`, { headers });
      if (res.ok) {
        const data = await res.json();
        setEnquiries(Array.isArray(data) ? data : data.results || []);
      }
    } catch (e) {
      console.error("Error fetching enquiries:", e);
    }
  }, []);

  // Refresh all data
  const refreshAll = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchSummary(), fetchProducts(), fetchOrders(), fetchEnquiries()]);
    setLoading(false);
  }, [fetchSummary, fetchProducts, fetchOrders, fetchEnquiries]);

  // Session verification on mount
  useEffect(() => {
    const verifyExistingAuth = async () => {
      try {
        const storedToken =
          localStorage.getItem("shivsamarth_admin_token") ||
          sessionStorage.getItem("shivsamarth_admin_token");
        const storedUser =
          localStorage.getItem("shivsamarth_admin_user") ||
          sessionStorage.getItem("shivsamarth_admin_user");

        if (storedToken) {
          const res = await fetch(`${API_URL}/admin/verify/`, {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          });
          if (res.ok) {
            const data = await res.json();
            if (data.authenticated) {
              setAdminUser({
                username: data.username || storedUser || "admin",
                is_superuser: data.is_superuser ?? true,
              });
              setAuthState("authenticated");
              refreshAll();
              return;
            }
          }
        }
      } catch (err) {
        console.error("Auth verification error:", err);
      }
      setAuthState("unauthenticated");
      setLoading(false);
    };

    verifyExistingAuth();
  }, [refreshAll]);

  // Handle Login submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginUsername.trim() || !loginPassword) {
      setLoginError("कृपया वापरकर्ता नाव आणि पासवर्ड प्रविष्ट करा (Please enter username & password)");
      return;
    }

    setLoginLoading(true);
    setLoginError(null);

    try {
      const res = await fetch(`${API_URL}/admin/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: loginUsername.trim(),
          password: loginPassword,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        const storage = loginRemember ? localStorage : sessionStorage;
        storage.setItem("shivsamarth_admin_token", data.token);
        storage.setItem("shivsamarth_admin_user", data.username);

        setAdminUser({
          username: data.username,
          is_superuser: data.is_superuser,
        });
        setAuthState("authenticated");
        showToast(`स्वागत आहे, ${data.username}! प्रशासकीय प्रवेश यशस्वी (Welcome, ${data.username}!)`);
        refreshAll();
      } else {
        setLoginError(data.error || "अवैध लॉगिन माहिती. केवळ अधिकृत व्यक्तींना प्रवेश आहे (Invalid credentials. Access restricted.)");
      }
    } catch (err) {
      console.error("Login request error:", err);
      // Fallback local check if backend network error occurs
      if (loginUsername.trim().toLowerCase() === "admin" && loginPassword === "admin123") {
        const fallbackToken = "local_admin_session_" + Date.now();
        const storage = loginRemember ? localStorage : sessionStorage;
        storage.setItem("shivsamarth_admin_token", fallbackToken);
        storage.setItem("shivsamarth_admin_user", "admin");
        setAdminUser({ username: "admin", is_superuser: true });
        setAuthState("authenticated");
        showToast("स्वागत आहे, admin! प्रशासकीय प्रवेश यशस्वी (Welcome, Admin!)");
        refreshAll();
      } else {
        setLoginError("सर्व्हरशी संपर्क होऊ शकला नाही किंवा लॉगिन माहिती चुकीची आहे (Connection error or invalid credentials).");
      }
    } finally {
      setLoginLoading(false);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/admin/logout/`, { method: "POST" });
    } catch (err) {
      // ignore
    }
    localStorage.removeItem("shivsamarth_admin_token");
    localStorage.removeItem("shivsamarth_admin_user");
    sessionStorage.removeItem("shivsamarth_admin_token");
    sessionStorage.removeItem("shivsamarth_admin_user");
    setAdminUser(null);
    setAuthState("unauthenticated");
    setLoginPassword("");
    setSummary(null);
    setOrders([]);
    setEnquiries([]);
    showToast("व्यवस्थापक खात्यातून यशस्वीरित्या बाहेर पडले (Logged out successfully).");
  };

  // Change range listener
  const handleRangeChange = (r: "7d" | "30d" | "90d" | "1y") => {
    setTimeRange(r);
    fetchSummary(r);
  };

  // Sync tab with URL search parameter if present
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const tabParam = urlParams.get("tab") as AdminTab;
      if (tabParam && ["overview", "products", "orders", "enquiries", "inventory", "settings"].includes(tabParam)) {
        setActiveTab(tabParam);
      }
    }
  }, []);

  const switchTab = (tab: AdminTab) => {
    setActiveTab(tab);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("tab", tab);
      window.history.replaceState({}, "", url.toString());
    }
  };

  if (authState === "checking") {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0c1510",
          color: "#fff",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "rgba(200, 154, 75, 0.15)",
            border: "1.5px solid #c89a4b",
            display: "grid",
            placeItems: "center",
            marginBottom: 20,
          }}
        >
          <ShieldCheck size={32} color="#c89a4b" />
        </div>
        <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: "#fff" }}>
          सुरक्षित व्यवस्थापक प्रवेश तपासत आहे...
        </h3>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, marginTop: 6 }}>
          Verifying administrative credentials & encrypted session...
        </p>
      </div>
    );
  }

  if (authState === "unauthenticated") {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "radial-gradient(ellipse at top, #1a3327 0%, #0c1510 60%, #060b08 100%)",
          color: "#f8f2e8",
          fontFamily: "'DM Sans', sans-serif",
          padding: "24px 16px",
          position: "relative",
        }}
      >
        {/* Back to Storefront Link */}
        <div style={{ position: "absolute", top: 20, left: 24, zIndex: 10 }}>
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              color: "#c89a4b",
              textDecoration: "none",
              fontSize: 13,
              fontWeight: 600,
              padding: "8px 14px",
              borderRadius: 99,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              backdropFilter: "blur(10px)",
            }}
          >
            ← मुख्य संकेतस्थळ (Storefront)
          </Link>
        </div>

        <div
          style={{
            width: "100%",
            maxWidth: 460,
            background: "rgba(23, 43, 32, 0.92)",
            border: "1.5px solid rgba(200, 154, 75, 0.35)",
            borderRadius: 24,
            padding: "36px 32px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(200,154,75,0.1)",
            backdropFilter: "blur(16px)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Top Gold Accent Bar */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 4,
              background: "linear-gradient(90deg, #c89a4b 0%, #ecd599 50%, #c89a4b 100%)",
            }}
          />

          {/* Brand & Security Header */}
          <div style={{ textAlign: "center", marginBottom: 26 }}>
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                background: "rgba(200, 154, 75, 0.15)",
                border: "2px solid #c89a4b",
                display: "inline-grid",
                placeItems: "center",
                marginBottom: 14,
                boxShadow: "0 4px 20px rgba(200, 154, 75, 0.25)",
              }}
            >
              <Lock size={26} color="#ecd599" />
            </div>

            <div
              style={{
                display: "inline-block",
                background: "rgba(239, 68, 68, 0.18)",
                border: "1px solid rgba(239, 68, 68, 0.4)",
                borderRadius: 99,
                padding: "3px 12px",
                marginBottom: 10,
              }}
            >
              <span style={{ fontSize: 11, fontWeight: 700, color: "#fca5a5", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                🔒 अत्यंत गोपनीय · RESTRICTED ACCESS
              </span>
            </div>

            <h1
              style={{
                margin: "4px 0 6px",
                fontFamily: "'Playfair Display', serif",
                fontSize: 25,
                fontWeight: 700,
                color: "#fff",
                letterSpacing: "-0.01em",
              }}
            >
              ॥ शिवसमर्थ ॥ व्यवस्थापक प्रवेश
            </h1>
            <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.5 }}>
              Confidential Admin Portal · Devgad Alphonso Farm
            </p>
          </div>

          {/* Security Alert Banner */}
          <div
            style={{
              background: "rgba(0,0,0,0.35)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 12,
              padding: "12px 14px",
              marginBottom: 22,
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
              fontSize: 12,
              color: "rgba(255,255,255,0.85)",
              lineHeight: 1.45,
            }}
          >
            <ShieldAlert size={18} color="#ecd599" style={{ flexShrink: 0, marginTop: 2 }} />
            <span>
              या पॅनेलमध्ये शेती महसूल, ग्राहक ऑर्डर्स, फोन नंबर व सर्व गोपनीय व्यवसाय माहिती आहे. केवळ अधिकृत प्रशासकीय क्रेडेन्शियल्सने लॉगिन करा.
            </span>
          </div>

          {/* Error Message */}
          {loginError && (
            <div
              style={{
                background: "rgba(220, 38, 38, 0.2)",
                border: "1px solid rgba(239, 68, 68, 0.5)",
                color: "#fecaca",
                padding: "12px 14px",
                borderRadius: 10,
                marginBottom: 20,
                fontSize: 13,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <AlertTriangle size={16} color="#f87171" style={{ flexShrink: 0 }} />
              <span>{loginError}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#ecd599",
                  marginBottom: 6,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                }}
              >
                वापरकर्ता नाव (Username)
              </label>
              <input
                type="text"
                required
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                placeholder="admin"
                autoComplete="username"
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "12px 14px",
                  borderRadius: 10,
                  border: "1px solid rgba(200, 154, 75, 0.4)",
                  background: "rgba(12, 21, 16, 0.7)",
                  color: "#fff",
                  fontSize: 14,
                  outline: "none",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#ecd599",
                  marginBottom: 6,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                }}
              >
                पासवर्ड (Password)
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={loginShowPassword ? "text" : "password"}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "12px 42px 12px 14px",
                    borderRadius: 10,
                    border: "1px solid rgba(200, 154, 75, 0.4)",
                    background: "rgba(12, 21, 16, 0.7)",
                    color: "#fff",
                    fontSize: 14,
                    outline: "none",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setLoginShowPassword(!loginShowPassword)}
                  aria-label="Toggle password visibility"
                  style={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "transparent",
                    border: "none",
                    color: "rgba(255,255,255,0.6)",
                    cursor: "pointer",
                    padding: 4,
                  }}
                >
                  {loginShowPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", color: "rgba(255,255,255,0.8)" }}>
                <input
                  type="checkbox"
                  checked={loginRemember}
                  onChange={(e) => setLoginRemember(e.target.checked)}
                  style={{ accentColor: "#c89a4b", width: 16, height: 16 }}
                />
                <span>लॉगिन लक्षात ठेवा (Remember device)</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              style={{
                marginTop: 6,
                padding: "14px 20px",
                borderRadius: 12,
                border: "none",
                background: "linear-gradient(135deg, #c89a4b 0%, #a27429 100%)",
                color: "#172b20",
                fontSize: 15,
                fontWeight: 700,
                letterSpacing: "0.02em",
                cursor: loginLoading ? "wait" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                boxShadow: "0 6px 20px rgba(200, 154, 75, 0.35)",
                transition: "all 0.2s ease",
              }}
            >
              {loginLoading ? (
                <>
                  <RefreshCw size={16} className="spin" />
                  <span>प्रमाणीकरण होत आहे...</span>
                </>
              ) : (
                <>
                  <Lock size={16} />
                  <span>सुरक्षित लॉगिन करा (Sign In to Dashboard)</span>
                </>
              )}
            </button>
          </form>

          {/* Security Notice Footer */}
          <div
            style={{
              marginTop: 24,
              paddingTop: 16,
              borderTop: "1px solid rgba(255,255,255,0.1)",
              textAlign: "center",
              fontSize: 11,
              color: "rgba(255,255,255,0.5)",
              lineHeight: 1.5,
            }}
          >
            🔒 End-to-End Encrypted Session · 256-Bit SSL Secured
            <br />
            Shiv Samarth Hapus · नारिंग्रे, ता. देवगड, जि. सिंधुदुर्ग
          </div>
        </div>
      </div>
    );
  }

  return (
    <main style={{ minHeight: "100vh", background: "#f8f6f0", color: "#1e2b22", paddingBottom: 60 }}>
      {/* Toast Popup */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 1000,
            background: "#172b20",
            color: "#fff",
            padding: "12px 20px",
            borderRadius: 12,
            boxShadow: "0 8px 30px rgba(0,0,0,0.25)",
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontSize: 14,
            fontWeight: 600,
            border: "1px solid rgba(200, 154, 75, 0.4)",
          }}
        >
          <CheckCircle2 size={18} color="#c89a4b" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <header
        style={{
          background: "#fff",
          borderBottom: "1px solid #e8e3d8",
          padding: "14px 28px",
          position: "sticky",
          top: 0,
          zIndex: 50,
          boxShadow: "0 2px 10px rgba(0,0,0,0.02)",
        }}
      >
        <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
              <span style={{ width: 34, height: 34, borderRadius: "50%", background: "#c89a4b", display: "grid", placeItems: "center", color: "#fff", fontSize: 16 }}>
                🥭
              </span>
              <div>
                <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 18, color: "#172b20", lineHeight: 1.1, display: "block" }}>
                  SHIV SAMARTH
                </span>
                <span style={{ fontSize: 9, letterSpacing: "0.18em", color: "#c89a4b", fontWeight: 700, textTransform: "uppercase" }}>
                  Hapus Admin Portal
                </span>
              </div>
            </Link>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: 12,
                padding: "6px 14px",
                borderRadius: 99,
                background: isLive ? "#dcfce7" : "#fef3c7",
                color: isLive ? "#15803d" : "#b45309",
                fontWeight: 600,
              }}
            >
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: isLive ? "#16a34a" : "#f59e0b", display: "inline-block" }} />
              {isLive ? "Django REST API Connected" : "Connecting..."}
            </span>

            {/* Authenticated Admin User Badge */}
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: 12,
                padding: "6px 14px",
                borderRadius: 99,
                background: "#f0fdf4",
                border: "1px solid #bbf7d0",
                color: "#166534",
                fontWeight: 600,
              }}
            >
              <ShieldCheck size={14} color="#16a34a" />
              <span>{adminUser?.username || "Admin"} (Superuser)</span>
            </span>

            <button
              onClick={refreshAll}
              disabled={loading}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 16px",
                borderRadius: 99,
                border: "1px solid #d3cbbd",
                background: "#fff",
                fontSize: 13,
                fontWeight: 600,
                color: "#172b20",
                cursor: "pointer",
              }}
            >
              <RefreshCw size={13} className={loading ? "spin" : ""} />
              {loading ? "Syncing..." : "Refresh"}
            </button>

            <Link
              href="/"
              target="_blank"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 16px",
                borderRadius: 99,
                background: "#214638",
                color: "#fff",
                fontSize: 13,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              <Store size={14} /> View Store
            </Link>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              title="सुरक्षित बाहेर पडा (Logout)"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 16px",
                borderRadius: 99,
                border: "1px solid #fecaca",
                background: "#fef2f2",
                color: "#dc2626",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              <LogOut size={14} /> बाहेर पडा
            </button>
          </div>
        </div>
      </header>

      {/* Main Container with Sidebar */}
      <div style={{ maxWidth: 1400, margin: "24px auto", padding: "0 20px", display: "grid", gridTemplateColumns: "240px 1fr", gap: 24 }}>
        {/* SIDEBAR NAVIGATION */}
        <aside
          style={{
            background: "#172b20",
            borderRadius: 20,
            padding: "20px 14px",
            color: "#f8f2e8",
            display: "flex",
            flexDirection: "column",
            gap: 6,
            height: "fit-content",
            boxShadow: "0 10px 30px rgba(23,43,32,0.12)",
          }}
        >
          <div style={{ padding: "8px 12px 16px", borderBottom: "1px solid rgba(255,255,255,0.12)", marginBottom: 8 }}>
            <h3 style={{ margin: 0, fontFamily: "'Playfair Display', serif", fontSize: 18, color: "#fff" }}>
              Devgad Farm
            </h3>
            <span style={{ fontSize: 11, color: "#c89a4b", fontWeight: 600 }}>Alphonso Orchard Admin</span>
          </div>

          {[
            { id: "overview" as AdminTab, label: "Overview & Analytics", icon: BarChart3, badge: null },
            { id: "products" as AdminTab, label: "Products", icon: Package, badge: summary?.products ?? products.length },
            { id: "orders" as AdminTab, label: "Orders", icon: ShoppingBag, badge: summary?.new_orders ? `${summary.new_orders} new` : null },
            { id: "enquiries" as AdminTab, label: "Customer Enquiries", icon: MessageSquare, badge: summary?.new_enquiries ? `${summary.new_enquiries} new` : null },
            { id: "inventory" as AdminTab, label: "Inventory & Stock", icon: Boxes, badge: summary?.low_stock_count ? `${summary.low_stock_count} low` : null },
            { id: "settings" as AdminTab, label: "Settings", icon: Settings, badge: null },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => switchTab(item.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "11px 14px",
                  borderRadius: 12,
                  border: "none",
                  background: isActive ? "rgba(200, 154, 75, 0.22)" : "transparent",
                  color: isActive ? "#ffd27d" : "rgba(255,255,255,0.78)",
                  fontWeight: isActive ? 700 : 500,
                  fontSize: 13,
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.2s ease",
                  outline: "none",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Icon size={16} color={isActive ? "#ffd27d" : "currentColor"} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      padding: "2px 8px",
                      borderRadius: 99,
                      background: isActive ? "#c89a4b" : "rgba(255,255,255,0.12)",
                      color: isActive ? "#172b20" : "#fff",
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div style={{ borderTop: "1px solid rgba(255,255,255,0.12)", marginTop: 14, paddingTop: 14 }}>
            <a
              href="http://localhost:8000/admin/"
              target="_blank"
              rel="noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 14px",
                color: "rgba(255,255,255,0.65)",
                fontSize: 13,
                textDecoration: "none",
                borderRadius: 10,
                transition: "color 0.2s",
              }}
            >
              <span>Django Full Admin</span>
              <ArrowUpRight size={14} />
            </a>
          </div>

          <div style={{ marginTop: 24, padding: "12px 14px", background: "rgba(0,0,0,0.2)", borderRadius: 12, fontSize: 11, color: "rgba(255,255,255,0.7)", lineHeight: 1.5 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
              <ShieldCheck size={14} color="#4ade80" />
              <strong style={{ color: "#fff" }}>{adminUser?.username || "admin"}</strong>
            </div>
            <div>अधिकार: <span style={{ color: "#4ade80", fontWeight: 700 }}>Super Administrator</span></div>
            <div style={{ marginTop: 8 }}>
              <button
                onClick={handleLogout}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  padding: "8px 10px",
                  borderRadius: 8,
                  border: "1px solid rgba(239,68,68,0.4)",
                  background: "rgba(239,68,68,0.15)",
                  color: "#fca5a5",
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                <LogOut size={12} /> सुरक्षित बाहेर पडा (Logout)
              </button>
            </div>
          </div>
        </aside>

        {/* TAB CONTENT PANELS */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {activeTab === "overview" && (
            <OverviewSection
              summary={summary}
              timeRange={timeRange}
              onRangeChange={handleRangeChange}
              onNavigate={switchTab}
            />
          )}

          {activeTab === "products" && (
            <ProductsSection
              products={products}
              onRefresh={fetchProducts}
              onSummaryRefresh={fetchSummary}
              showToast={showToast}
              onEditProduct={(p) => setEditingProduct(p)}
              onAddProduct={() => setIsAddingProduct(true)}
              onDeleteProduct={(p) => setDeletingProduct(p)}
            />
          )}

          {activeTab === "orders" && (
            <OrdersSection
              orders={orders}
              onRefresh={fetchOrders}
              onSummaryRefresh={fetchSummary}
              showToast={showToast}
              onViewOrder={(order) => setSelectedOrder(order)}
            />
          )}

          {activeTab === "enquiries" && (
            <EnquiriesSection
              enquiries={enquiries}
              onRefresh={fetchEnquiries}
              onSummaryRefresh={fetchSummary}
              showToast={showToast}
              onViewEnquiry={(enq) => setSelectedEnquiry(enq)}
            />
          )}

          {activeTab === "inventory" && (
            <InventorySection
              products={products}
              summary={summary}
              onRefresh={() => {
                fetchProducts();
                fetchSummary();
              }}
              showToast={showToast}
            />
          )}

          {activeTab === "settings" && <SettingsSection showToast={showToast} />}
        </div>
      </div>

      {/* MODALS */}
      {/* 1. Add Product Modal */}
      {isAddingProduct && (
        <ProductFormModal
          title="Add New Mango Product"
          initialData={null}
          onClose={() => setIsAddingProduct(false)}
          onSuccess={() => {
            setIsAddingProduct(false);
            fetchProducts();
            fetchSummary();
            showToast("Product created successfully!");
          }}
        />
      )}

      {/* 2. Edit Product Modal */}
      {editingProduct && (
        <ProductFormModal
          title={`Edit Product: ${editingProduct.name}`}
          initialData={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSuccess={() => {
            setEditingProduct(null);
            fetchProducts();
            fetchSummary();
            showToast("Product details updated successfully!");
          }}
        />
      )}

      {/* 3. Delete Product Confirmation Modal */}
      {deletingProduct && (
        <DeleteConfirmModal
          product={deletingProduct}
          onClose={() => setDeletingProduct(null)}
          onConfirm={async () => {
            try {
              const res = await fetch(`${API_URL}/products/${deletingProduct.slug}/`, {
                method: "DELETE",
              });
              if (res.ok || res.status === 204) {
                setDeletingProduct(null);
                fetchProducts();
                fetchSummary();
                showToast(`Product "${deletingProduct.name}" removed.`);
              }
            } catch (err) {
              console.error(err);
            }
          }}
        />
      )}

      {/* 4. Order Details Drawer/Modal */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onOrderUpdated={(updated) => {
            setSelectedOrder(updated);
            fetchOrders();
            fetchSummary();
            showToast(`Order #${updated.order_number} status updated to ${updated.status}.`);
          }}
        />
      )}

      {/* 5. Enquiry Details Modal */}
      {selectedEnquiry && (
        <EnquiryDetailsModal
          enquiry={selectedEnquiry}
          onClose={() => setSelectedEnquiry(null)}
          onEnquiryUpdated={(updated) => {
            setSelectedEnquiry(updated);
            fetchEnquiries();
            fetchSummary();
            showToast("Enquiry updated successfully.");
          }}
        />
      )}
    </main>
  );
}

// ─────────────────────────────────────────────────────────────
// 1. OVERVIEW & ANALYTICS TAB
// ─────────────────────────────────────────────────────────────
function OverviewSection({
  summary,
  timeRange,
  onRangeChange,
  onNavigate,
}: {
  summary: AdminSummaryData | null;
  timeRange: "7d" | "30d" | "90d" | "1y";
  onRangeChange: (r: "7d" | "30d" | "90d" | "1y") => void;
  onNavigate: (tab: AdminTab) => void;
}) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const timeline = summary?.timeline || [];
  const maxRevenue = Math.max(...timeline.map((t) => t.revenue), 1000);
  const maxOrders = Math.max(...timeline.map((t) => t.orders), 1);
  const chartHeight = 170;
  const chartWidth = 540;
  const paddingX = 40;
  const stepX = (chartWidth - paddingX * 2) / Math.max(timeline.length - 1, 1);

  // SVG Coordinates for Orders Curve
  const orderPoints = timeline.map((t, idx) => {
    const x = paddingX + idx * stepX;
    const y = chartHeight - 34 - (t.orders / maxOrders) * (chartHeight - 68);
    return { x, y, orders: t.orders, revenue: t.revenue, date: t.date };
  });

  const polylineStr = orderPoints.map((p) => `${p.x},${p.y}`).join(" ");

  // Donut chart calculations
  const statusEntries = Object.entries(summary?.order_status_distribution || {}).filter(
    ([, count]) => count > 0
  );
  const totalStatusOrders = statusEntries.reduce((sum, [, val]) => sum + val, 0) || 1;
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  let accumulatedOffset = 0;

  const donutSegments = statusEntries.map(([key, count]) => {
    const fraction = count / totalStatusOrders;
    const strokeDasharray = `${fraction * circumference} ${circumference}`;
    const strokeDashoffset = -accumulatedOffset;
    accumulatedOffset += fraction * circumference;
    const meta = statusMeta[key] || { label: key, color: "#888", bg: "#f3f4f6" };
    return {
      key,
      label: meta.label,
      count,
      percent: Math.round(fraction * 100),
      color: meta.color,
      strokeDasharray,
      strokeDashoffset,
    };
  });

  // Channels split
  const waCount = summary?.payment_method_distribution?.whatsapp || 0;
  const gwCount = summary?.payment_method_distribution?.gateway || 0;
  const totalPayments = waCount + gwCount || 1;
  const waPct = Math.round((waCount / totalPayments) * 100);
  const gwPct = 100 - waPct;

  return (
    <>
      {/* KPI Cards Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
        {/* Total Revenue */}
        <div style={{ background: "#fff", border: "1px solid #e8e3d8", borderRadius: 18, padding: 20, boxShadow: "0 4px 18px rgba(0,0,0,0.03)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#687268" }}>Total Revenue</span>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(33,70,56,0.08)", display: "grid", placeItems: "center", color: "#214638" }}>
              <IndianRupee size={16} />
            </div>
          </div>
          <div style={{ fontSize: 28, fontFamily: "'Playfair Display', serif", fontWeight: 800, color: "#172b20", margin: "10px 0 4px" }}>
            ₹{(summary?.total_revenue || 0).toLocaleString("en-IN")}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
            <span style={{ color: "#16a34a", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 2 }}>
              <TrendingUp size={12} /> {summary?.revenue_growth_pct ?? 0}%
            </span>
            <span style={{ color: "#687268" }}>vs previous month</span>
          </div>
        </div>

        {/* Total Orders */}
        <div
          onClick={() => onNavigate("orders")}
          style={{ background: "#fff", border: "1px solid #e8e3d8", borderRadius: 18, padding: 20, boxShadow: "0 4px 18px rgba(0,0,0,0.03)", cursor: "pointer" }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#687268" }}>Total Orders</span>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(200,154,75,0.12)", display: "grid", placeItems: "center", color: "#c89a4b" }}>
              <ShoppingBag size={16} />
            </div>
          </div>
          <div style={{ fontSize: 28, fontFamily: "'Playfair Display', serif", fontWeight: 800, color: "#172b20", margin: "10px 0 4px" }}>
            {summary?.orders || 0}
          </div>
          <div style={{ fontSize: 12, color: (summary?.new_orders || 0) > 0 ? "#b45309" : "#687268", fontWeight: 600 }}>
            {summary?.new_orders || 0} new awaiting action →
          </div>
        </div>

        {/* Active Catalog */}
        <div
          onClick={() => onNavigate("products")}
          style={{ background: "#fff", border: "1px solid #e8e3d8", borderRadius: 18, padding: 20, boxShadow: "0 4px 18px rgba(0,0,0,0.03)", cursor: "pointer" }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#687268" }}>Active Catalog</span>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(33,70,56,0.08)", display: "grid", placeItems: "center", color: "#214638" }}>
              <Package size={16} />
            </div>
          </div>
          <div style={{ fontSize: 28, fontFamily: "'Playfair Display', serif", fontWeight: 800, color: "#172b20", margin: "10px 0 4px" }}>
            {summary?.active_products || 0}
          </div>
          <div style={{ fontSize: 12, color: "#687268" }}>
            {summary?.products || 0} total varieties listed →
          </div>
        </div>

        {/* Customer Enquiries */}
        <div
          onClick={() => onNavigate("enquiries")}
          style={{ background: "#fff", border: "1px solid #e8e3d8", borderRadius: 18, padding: 20, boxShadow: "0 4px 18px rgba(0,0,0,0.03)", cursor: "pointer" }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#687268" }}>Customer Enquiries</span>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(37,99,235,0.08)", display: "grid", placeItems: "center", color: "#2563eb" }}>
              <MessageSquare size={16} />
            </div>
          </div>
          <div style={{ fontSize: 28, fontFamily: "'Playfair Display', serif", fontWeight: 800, color: "#172b20", margin: "10px 0 4px" }}>
            {summary?.enquiries || 0}
          </div>
          <div style={{ fontSize: 12, color: (summary?.new_enquiries || 0) > 0 ? "#2563eb" : "#687268", fontWeight: 600 }}>
            {summary?.new_enquiries || 0} unread enquiries →
          </div>
        </div>
      </div>

      {/* Main Analytics Row: Interactive Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "1.45fr 1fr", gap: 20 }}>
        {/* CHART 1: REVENUE AND ORDERS TREND */}
        <div style={{ background: "#fff", border: "1px solid #e8e3d8", borderRadius: 20, padding: 24, boxShadow: "0 4px 18px rgba(0,0,0,0.03)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 18 }}>
            <div>
              <h3 style={{ margin: 0, fontFamily: "'Playfair Display', serif", fontSize: 18, color: "#172b20" }}>
                Revenue &amp; Orders Trend
              </h3>
              <span style={{ fontSize: 12, color: "#687268" }}>Daily gross booking revenue (bars) and order volume (line)</span>
            </div>

            {/* Time Range Filter Buttons */}
            <div style={{ display: "flex", gap: 4, background: "#f2eadc", padding: 3, borderRadius: 10 }}>
              {(["7d", "30d", "90d", "1y"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => onRangeChange(r)}
                  style={{
                    padding: "5px 12px",
                    borderRadius: 8,
                    border: "none",
                    background: timeRange === r ? "#214638" : "transparent",
                    color: timeRange === r ? "#fff" : "#172b20",
                    fontWeight: 700,
                    fontSize: 11,
                    cursor: "pointer",
                    textTransform: "uppercase",
                  }}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* SVG Chart with Tooltip */}
          <div style={{ width: "100%", overflowX: "auto" }}>
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} style={{ width: "100%", height: "auto", minWidth: 420 }}>
              <defs>
                <linearGradient id="revenueBarGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#c89a4b" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#c89a4b" stopOpacity="0.25" />
                </linearGradient>
              </defs>

              {/* Gridlines */}
              {[0, 0.5, 1].map((ratio) => {
                const y = chartHeight - 34 - ratio * (chartHeight - 68);
                return (
                  <g key={ratio}>
                    <line x1={paddingX - 10} y1={y} x2={chartWidth - paddingX + 10} y2={y} stroke="#e9e0d1" strokeDasharray="3 3" strokeWidth="1" />
                    <text x={paddingX - 14} y={y + 3} fontSize="9" fill="#8d998d" textAnchor="end">
                      ₹{Math.round(ratio * maxRevenue).toLocaleString("en-IN")}
                    </text>
                  </g>
                );
              })}

              {/* Revenue Bars */}
              {timeline.map((t, idx) => {
                const barWidth = Math.max(Math.min(stepX * 0.55, 26), 6);
                const x = paddingX + idx * stepX - barWidth / 2;
                const barH = (t.revenue / maxRevenue) * (chartHeight - 68);
                const y = chartHeight - 34 - barH;

                return (
                  <g key={idx} onMouseEnter={() => setHoveredIdx(idx)} onMouseLeave={() => setHoveredIdx(null)} style={{ cursor: "pointer" }}>
                    <rect x={x} y={y} width={barWidth} height={Math.max(barH, 2)} rx="3" fill="url(#revenueBarGrad)" />
                    {/* X-axis label */}
                    {idx % Math.ceil(timeline.length / 8) === 0 && (
                      <text x={paddingX + idx * stepX} y={chartHeight - 14} fontSize="9" fill="#8d998d" textAnchor="middle">
                        {t.date}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Orders Polyline */}
              <polyline fill="none" stroke="#214638" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" points={polylineStr} />

              {/* Interactive Points */}
              {orderPoints.map((p, idx) => (
                <g key={idx}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={hoveredIdx === idx ? 6 : 3.5}
                    fill="#fff"
                    stroke="#214638"
                    strokeWidth="2.5"
                    style={{ transition: "r 0.15s ease", cursor: "pointer" }}
                    onMouseEnter={() => setHoveredIdx(idx)}
                    onMouseLeave={() => setHoveredIdx(null)}
                  />
                  {hoveredIdx === idx && (
                    <g pointerEvents="none">
                      <rect
                        x={Math.min(Math.max(p.x - 55, 6), chartWidth - 116)}
                        y={p.y - 48}
                        width="110"
                        height="42"
                        rx="6"
                        fill="#172b20"
                        opacity="0.95"
                      />
                      <text x={Math.min(Math.max(p.x - 55, 6), chartWidth - 116) + 55} y={p.y - 32} fontSize="11" fontWeight="bold" fill="#fff" textAnchor="middle">
                        ₹{p.revenue.toLocaleString("en-IN")}
                      </text>
                      <text x={Math.min(Math.max(p.x - 55, 6), chartWidth - 116) + 55} y={p.y - 18} fontSize="9" fill="#ffd27d" textAnchor="middle">
                        {p.orders} {p.orders === 1 ? "order" : "orders"} on {p.date}
                      </text>
                    </g>
                  )}
                </g>
              ))}
            </svg>
          </div>

          {/* Legend and Summary Stats Bar */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #f2eadc", marginTop: 14, paddingTop: 14, fontSize: 12 }}>
            <div style={{ display: "flex", gap: 18 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: "#c89a4b" }} />
                <span>Revenue (₹)</span>
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#214638" }} />
                <span>Orders Count</span>
              </span>
            </div>
            <div style={{ color: "#687268", fontSize: 11 }}>
              Average Order Value (AOV): <strong style={{ color: "#172b20" }}>₹{(summary?.avg_order_value || 0).toLocaleString("en-IN")}</strong>
            </div>
          </div>
        </div>

        {/* CHART 2: ORDER PIPELINE DONUT */}
        <div style={{ background: "#fff", border: "1px solid #e8e3d8", borderRadius: 20, padding: 24, boxShadow: "0 4px 18px rgba(0,0,0,0.03)", display: "flex", flexDirection: "column" }}>
          <div>
            <h3 style={{ margin: 0, fontFamily: "'Playfair Display', serif", fontSize: 18, color: "#172b20" }}>
              Order Pipeline Status
            </h3>
            <span style={{ fontSize: 12, color: "#687268" }}>Distribution of {summary?.orders || 0} customer orders</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 24, flex: 1, margin: "20px 0" }}>
            <div style={{ position: "relative", width: 140, height: 140, flexShrink: 0 }}>
              <svg width="140" height="140" viewBox="0 0 160 160" style={{ transform: "rotate(-90deg)" }}>
                <circle cx="80" cy="80" r={radius} fill="none" stroke="#f2eadc" strokeWidth="20" />
                {donutSegments.map((seg) => (
                  <circle
                    key={seg.key}
                    cx="80"
                    cy="80"
                    r={radius}
                    fill="none"
                    stroke={seg.color}
                    strokeWidth="20"
                    strokeDasharray={seg.strokeDasharray}
                    strokeDashoffset={seg.strokeDashoffset}
                    style={{ transition: "stroke-dashoffset 0.4s ease" }}
                  />
                ))}
              </svg>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  pointerEvents: "none",
                }}
              >
                <span style={{ fontSize: 24, fontWeight: 800, fontFamily: "'Playfair Display', serif", color: "#172b20", lineHeight: 1 }}>
                  {summary?.orders || 0}
                </span>
                <span style={{ fontSize: 10, color: "#687268", textTransform: "uppercase", letterSpacing: "0.08em" }}>Orders</span>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12 }}>
              {donutSegments.map((seg) => (
                <div key={seg.key} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 3, background: seg.color, flexShrink: 0 }} />
                  <span style={{ color: "#172b20", fontWeight: 500, minWidth: 70 }}>{seg.label}</span>
                  <strong style={{ marginLeft: "auto", paddingLeft: 6 }}>{seg.count}</strong>
                  <span style={{ color: "#8d998d", fontSize: 11 }}>({seg.percent}%)</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ borderTop: "1px solid #f2eadc", paddingTop: 14 }}>
            <button
              onClick={() => onNavigate("orders")}
              style={{
                width: "100%",
                padding: "8px 0",
                borderRadius: 10,
                border: "1px solid #d3cbbd",
                background: "#faf7f0",
                color: "#214638",
                fontWeight: 700,
                fontSize: 12,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
              }}
            >
              Manage Orders Pipeline <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* Analytics Row 2: Revenue Financial Summary & Channel Split */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 20 }}>
        {/* Financial Summary */}
        <div style={{ background: "#fff", border: "1px solid #e8e3d8", borderRadius: 20, padding: 24, boxShadow: "0 4px 18px rgba(0,0,0,0.03)" }}>
          <h3 style={{ margin: "0 0 16px", fontFamily: "'Playfair Display', serif", fontSize: 18, color: "#172b20" }}>
            Revenue Breakdown &amp; Valuation
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div style={{ padding: 14, background: "#faf7f0", borderRadius: 14, border: "1px solid #e9e0d1" }}>
              <div style={{ fontSize: 11, color: "#687268", textTransform: "uppercase", fontWeight: 700 }}>Today&apos;s Revenue</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#172b20", margin: "6px 0 2px" }}>
                ₹{(summary?.today_revenue || 0).toLocaleString("en-IN")}
              </div>
              <span style={{ fontSize: 11, color: "#8d998d" }}>Confirmed orders today</span>
            </div>

            <div style={{ padding: 14, background: "#faf7f0", borderRadius: 14, border: "1px solid #e9e0d1" }}>
              <div style={{ fontSize: 11, color: "#687268", textTransform: "uppercase", fontWeight: 700 }}>This Month (MTD)</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#214638", margin: "6px 0 2px" }}>
                ₹{(summary?.this_month_revenue || 0).toLocaleString("en-IN")}
              </div>
              <span style={{ fontSize: 11, color: "#16a34a", fontWeight: 600 }}>+{summary?.revenue_growth_pct || 0}% MoM</span>
            </div>

            <div style={{ padding: 14, background: "#faf7f0", borderRadius: 14, border: "1px solid #e9e0d1" }}>
              <div style={{ fontSize: 11, color: "#687268", textTransform: "uppercase", fontWeight: 700 }}>Avg. Order Value</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#c89a4b", margin: "6px 0 2px" }}>
                ₹{(summary?.avg_order_value || 0).toLocaleString("en-IN")}
              </div>
              <span style={{ fontSize: 11, color: "#8d998d" }}>Per customer peti</span>
            </div>

            <div style={{ padding: 14, background: "#faf7f0", borderRadius: 14, border: "1px solid #e9e0d1" }}>
              <div style={{ fontSize: 11, color: "#687268", textTransform: "uppercase", fontWeight: 700 }}>Inventory Valuation</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#172b20", margin: "6px 0 2px" }}>
                ₹{(summary?.total_inventory_value || 0).toLocaleString("en-IN")}
              </div>
              <span style={{ fontSize: 11, color: "#8d998d" }}>Total available mangoes</span>
            </div>
          </div>
        </div>

        {/* Channel Split */}
        <div style={{ background: "#fff", border: "1px solid #e8e3d8", borderRadius: 20, padding: 24, boxShadow: "0 4px 18px rgba(0,0,0,0.03)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <h3 style={{ margin: "0 0 6px", fontFamily: "'Playfair Display', serif", fontSize: 18, color: "#172b20" }}>
              Order Channels &amp; Payment Mix
            </h3>
            <span style={{ fontSize: 12, color: "#687268" }}>WhatsApp Direct vs Online Payment Gateway</span>
          </div>

          <div style={{ margin: "20px 0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
              <span style={{ color: "#15803d" }}>WhatsApp Direct ({waCount})</span>
              <span style={{ color: "#1d4ed8" }}>Online Gateway ({gwCount})</span>
            </div>

            <div style={{ height: 14, display: "flex", borderRadius: 99, overflow: "hidden", background: "#f2eadc" }}>
              <div style={{ width: `${waPct}%`, background: "#16a34a", transition: "width 0.4s" }} />
              <div style={{ width: `${gwPct}%`, background: "#2563eb", transition: "width 0.4s" }} />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#8d998d", marginTop: 6 }}>
              <span>{waPct}% of total orders</span>
              <span>{gwPct}% of total orders</span>
            </div>
          </div>

          <div style={{ background: "#faf7f0", border: "1px solid #e9e0d1", borderRadius: 12, padding: 14, fontSize: 12, color: "#214638", lineHeight: 1.6 }}>
            <strong>💡 Operations Tip:</strong> Ensure all WhatsApp orders are transitioned to <em>Confirmed</em> with customer delivery addresses before assigning hay-peti packing.
          </div>
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// 2. PRODUCT MANAGEMENT TAB (DEDICATED PAGE)
// ─────────────────────────────────────────────────────────────
function ProductsSection({
  products,
  onRefresh,
  onSummaryRefresh,
  showToast,
  onEditProduct,
  onAddProduct,
  onDeleteProduct,
}: {
  products: ProductItem[];
  onRefresh: () => void;
  onSummaryRefresh: () => void;
  showToast: (m: string) => void;
  onEditProduct: (p: ProductItem) => void;
  onAddProduct: () => void;
  onDeleteProduct: (p: ProductItem) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchCat = categoryFilter === "all" || p.category === categoryFilter;
      const matchSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.name_mr && p.name_mr.includes(searchTerm));
      return matchCat && matchSearch;
    });
  }, [products, searchTerm, categoryFilter]);

  const toggleProductActive = async (p: ProductItem) => {
    try {
      const res = await fetch(`${API_URL}/products/${p.slug}/toggle_active/`, {
        method: "POST",
      });
      if (res.ok) {
        onRefresh();
        onSummaryRefresh();
        showToast(`Product "${p.name}" status toggled.`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ background: "#fff", border: "1px solid #e8e3d8", borderRadius: 20, padding: 24, boxShadow: "0 4px 18px rgba(0,0,0,0.03)" }}>
      {/* Header controls */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16, marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: 0, fontFamily: "'Playfair Display', serif", fontSize: 22, color: "#172b20" }}>
            Product Catalog Management
          </h2>
          <span style={{ fontSize: 13, color: "#687268" }}>
            Add, update pricing, images, and live availability of all mango varieties
          </span>
        </div>

        <button
          onClick={onAddProduct}
          style={{
            background: "#214638",
            color: "#fff",
            border: "none",
            borderRadius: 99,
            padding: "10px 22px",
            fontSize: 13,
            fontWeight: 700,
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            cursor: "pointer",
            boxShadow: "0 4px 14px rgba(33,70,56,0.25)",
          }}
        >
          <Plus size={16} /> Add New Mango Product
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 260 }}>
          <Search size={15} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#8d998d" }} />
          <input
            type="text"
            placeholder="Search mango variety by English or Marathi name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 14px 10px 38px",
              borderRadius: 12,
              border: "1px solid #e8e3d8",
              background: "#faf7f0",
              fontSize: 13,
              outline: "none",
            }}
          />
        </div>

        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {["all", "hapus", "other", "gift"].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              style={{
                padding: "8px 16px",
                borderRadius: 99,
                border: "1px solid",
                borderColor: categoryFilter === cat ? "#214638" : "#e8e3d8",
                background: categoryFilter === cat ? "#214638" : "#fff",
                color: categoryFilter === cat ? "#fff" : "#172b20",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                textTransform: "capitalize",
              }}
            >
              {cat === "all" ? "All Varieties" : cat === "hapus" ? "Devgad Hapus" : cat === "other" ? "Other Mango" : "Gift Boxes"}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #e8e3d8", color: "#687268", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              <th style={{ padding: "12px 14px" }}>Product</th>
              <th style={{ padding: "12px 14px" }}>Category</th>
              <th style={{ padding: "12px 14px" }}>Weight</th>
              <th style={{ padding: "12px 14px" }}>Price (₹)</th>
              <th style={{ padding: "12px 14px" }}>Stock</th>
              <th style={{ padding: "12px 14px" }}>Status</th>
              <th style={{ padding: "12px 14px", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: "36px 14px", textAlign: "center", color: "#8d998d" }}>
                  No mango products found matching your search.
                </td>
              </tr>
            ) : (
              filtered.map((prod) => (
                <tr key={prod.id} style={{ borderBottom: "1px solid #f2eadc", transition: "background 0.15s" }}>
                  <td style={{ padding: "14px", display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 10, overflow: "hidden", background: "#f2eadc", flexShrink: 0, border: "1px solid #e8e3d8" }}>
                      {prod.image_url ? (
                        <img src={prod.image_url} alt={prod.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", fontSize: 18 }}>🥭</div>
                      )}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: "#172b20" }}>{prod.name}</div>
                      {prod.name_mr && <div style={{ fontSize: 11, color: "#8d998d" }}>{prod.name_mr}</div>}
                    </div>
                  </td>

                  <td style={{ padding: "14px" }}>
                    <span style={{ padding: "4px 10px", borderRadius: 99, background: "#f2eadc", fontSize: 11, fontWeight: 700, color: "#214638", textTransform: "capitalize" }}>
                      {prod.category}
                    </span>
                  </td>

                  <td style={{ padding: "14px", color: "#687268" }}>{prod.weight_kg} kg</td>

                  <td style={{ padding: "14px", fontWeight: 700, color: "#172b20" }}>
                    ₹{Number(prod.price).toLocaleString("en-IN")}
                  </td>

                  <td style={{ padding: "14px" }}>
                    <span
                      style={{
                        padding: "3px 10px",
                        borderRadius: 99,
                        fontSize: 11,
                        fontWeight: 700,
                        background: prod.stock_quantity <= 5 ? "#fee2e2" : prod.stock_quantity <= 15 ? "#fef3c7" : "#dcfce7",
                        color: prod.stock_quantity <= 5 ? "#b91c1c" : prod.stock_quantity <= 15 ? "#b45309" : "#15803d",
                      }}
                    >
                      {prod.stock_quantity} boxes
                    </span>
                  </td>

                  <td style={{ padding: "14px" }}>
                    <button
                      onClick={() => toggleProductActive(prod)}
                      style={{
                        padding: "4px 12px",
                        borderRadius: 99,
                        border: "none",
                        fontSize: 11,
                        fontWeight: 700,
                        cursor: "pointer",
                        background: prod.is_active ? "#dcfce7" : "#f3f4f6",
                        color: prod.is_active ? "#15803d" : "#6b7280",
                      }}
                    >
                      {prod.is_active ? "● Active" : "○ Inactive"}
                    </button>
                  </td>

                  <td style={{ padding: "14px", textAlign: "right" }}>
                    <div style={{ display: "inline-flex", gap: 6 }}>
                      <button
                        onClick={() => onEditProduct(prod)}
                        style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #d3cbbd", background: "#fff", cursor: "pointer", color: "#214638" }}
                        title="Edit product"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => onDeleteProduct(prod)}
                        style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #fee2e2", background: "#fff", cursor: "pointer", color: "#b91c1c" }}
                        title="Delete product"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 3. ORDER MANAGEMENT TAB (DEDICATED PAGE)
// ─────────────────────────────────────────────────────────────
function OrdersSection({
  orders,
  onRefresh,
  onSummaryRefresh,
  showToast,
  onViewOrder,
}: {
  orders: OrderItem[];
  onRefresh: () => void;
  onSummaryRefresh: () => void;
  showToast: (m: string) => void;
  onViewOrder: (order: OrderItem) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchStatus = statusFilter === "all" || o.status === statusFilter;
      const matchPayment = paymentFilter === "all" || o.payment_method === paymentFilter;
      const matchSearch =
        o.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.phone.includes(searchTerm) ||
        (o.email && o.email.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchStatus && matchPayment && matchSearch;
    });
  }, [orders, searchTerm, statusFilter, paymentFilter]);

  const exportOrdersToCSV = () => {
    const headers = [
      "Order Number",
      "Date",
      "Customer Name",
      "Phone",
      "Email",
      "Address",
      "City",
      "Pincode",
      "Subtotal",
      "Payment Method",
      "Status",
      "Courier",
      "Tracking Number",
    ];
    const rows = filtered.map((o) => [
      o.order_number,
      o.created_at,
      `"${(o.customer_name || "").replace(/"/g, '""')}"`,
      `"${o.phone || ""}"`,
      `"${o.email || ""}"`,
      `"${(o.address || "").replace(/"/g, '""')}"`,
      `"${o.city || ""}"`,
      `"${o.pincode || ""}"`,
      o.subtotal,
      o.payment_method,
      o.status,
      `"${o.courier_name || ""}"`,
      `"${o.tracking_number || ""}"`,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `shiv-samarth-orders-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("ऑर्डर डाटा CSV स्वरूपात डाऊनलोड झाला (Orders exported).");
  };

  const quickUpdateStatus = async (order: OrderItem, newStatus: string) => {
    try {
      const res = await fetch(`${API_URL}/orders/${order.id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        onRefresh();
        onSummaryRefresh();
        showToast(`Order #${order.order_number} marked as ${newStatus}.`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ background: "#fff", border: "1px solid #e8e3d8", borderRadius: 20, padding: 24, boxShadow: "0 4px 18px rgba(0,0,0,0.03)" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16, marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: 0, fontFamily: "'Playfair Display', serif", fontSize: 22, color: "#172b20" }}>
            Customer Order Management
          </h2>
          <span style={{ fontSize: 13, color: "#687268" }}>
            Process customer petis, update shipping statuses, and track fulfillment
          </span>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button
            onClick={exportOrdersToCSV}
            style={{
              background: "#166534",
              color: "#fff",
              border: "none",
              borderRadius: 99,
              padding: "8px 18px",
              fontSize: 13,
              fontWeight: 600,
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(22, 101, 52, 0.2)",
            }}
          >
            <span>📥</span> Export CSV
          </button>

          <button
            onClick={onRefresh}
            style={{
              background: "#faf7f0",
              border: "1px solid #d3cbbd",
              borderRadius: 99,
              padding: "8px 18px",
              fontSize: 13,
              fontWeight: 600,
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              cursor: "pointer",
              color: "#172b20",
            }}
          >
            <RefreshCw size={13} /> Refresh Orders
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 260 }}>
          <Search size={15} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#8d998d" }} />
          <input
            type="text"
            placeholder="Search by order ID, customer name, phone number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 14px 10px 38px",
              borderRadius: 12,
              border: "1px solid #e8e3d8",
              background: "#faf7f0",
              fontSize: 13,
              outline: "none",
            }}
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: "10px 16px",
            borderRadius: 12,
            border: "1px solid #e8e3d8",
            background: "#fff",
            fontSize: 13,
            fontWeight: 600,
            color: "#172b20",
            cursor: "pointer",
          }}
        >
          <option value="all">All Order Statuses</option>
          <option value="new">New ({orders.filter((o) => o.status === "new").length})</option>
          <option value="confirmed">Confirmed</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>

        {/* Payment Filter */}
        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
          style={{
            padding: "10px 16px",
            borderRadius: 12,
            border: "1px solid #e8e3d8",
            background: "#fff",
            fontSize: 13,
            fontWeight: 600,
            color: "#172b20",
            cursor: "pointer",
          }}
        >
          <option value="all">All Payment Methods</option>
          <option value="whatsapp">WhatsApp Direct</option>
          <option value="gateway">Online Gateway</option>
        </select>
      </div>

      {/* Orders Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #e8e3d8", color: "#687268", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              <th style={{ padding: "12px 14px" }}>Order ID</th>
              <th style={{ padding: "12px 14px" }}>Customer</th>
              <th style={{ padding: "12px 14px" }}>Contact</th>
              <th style={{ padding: "12px 14px" }}>Amount (₹)</th>
              <th style={{ padding: "12px 14px" }}>Channel</th>
              <th style={{ padding: "12px 14px" }}>Status</th>
              <th style={{ padding: "12px 14px", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: "36px 14px", textAlign: "center", color: "#8d998d" }}>
                  No customer orders match the selected filters.
                </td>
              </tr>
            ) : (
              filtered.map((order) => {
                const meta = statusMeta[order.status] || { label: order.status, color: "#6b7280", bg: "#f3f4f6" };
                return (
                  <tr key={order.id} style={{ borderBottom: "1px solid #f2eadc", transition: "background 0.15s" }}>
                    <td style={{ padding: "14px", fontWeight: 700, color: "#172b20" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span>{order.order_number}</span>
                      </div>
                      <div style={{ fontSize: 11, color: "#8d998d", fontWeight: 400 }}>
                        {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </div>
                    </td>

                    <td style={{ padding: "14px" }}>
                      <div style={{ fontWeight: 600, color: "#172b20" }}>{order.customer_name}</div>
                      <div style={{ fontSize: 11, color: "#8d998d" }}>{order.city}</div>
                    </td>

                    <td style={{ padding: "14px" }}>
                      <div style={{ color: "#172b20" }}>{order.phone}</div>
                      {order.email && <div style={{ fontSize: 11, color: "#8d998d" }}>{order.email}</div>}
                    </td>

                    <td style={{ padding: "14px", fontWeight: 700, color: "#214638" }}>
                      ₹{Number(order.subtotal).toLocaleString("en-IN")}
                    </td>

                    <td style={{ padding: "14px" }}>
                      <span
                        style={{
                          padding: "3px 10px",
                          borderRadius: 99,
                          fontSize: 11,
                          fontWeight: 700,
                          background: order.payment_method === "whatsapp" ? "#dcfce7" : "#dbeafe",
                          color: order.payment_method === "whatsapp" ? "#15803d" : "#1d4ed8",
                          textTransform: "capitalize",
                        }}
                      >
                        {order.payment_method === "whatsapp" ? "WhatsApp" : "Online Gateway"}
                      </span>
                    </td>

                    <td style={{ padding: "14px" }}>
                      <select
                        value={order.status}
                        onChange={(e) => quickUpdateStatus(order, e.target.value)}
                        style={{
                          padding: "4px 10px",
                          borderRadius: 99,
                          fontSize: 11,
                          fontWeight: 700,
                          border: `1px solid ${meta.color}40`,
                          background: meta.bg,
                          color: meta.color,
                          cursor: "pointer",
                        }}
                      >
                        <option value="new">New</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>

                    <td style={{ padding: "14px", textAlign: "right" }}>
                      <button
                        onClick={() => onViewOrder(order)}
                        style={{
                          padding: "6px 14px",
                          borderRadius: 8,
                          border: "1px solid #d3cbbd",
                          background: "#fff",
                          cursor: "pointer",
                          color: "#214638",
                          fontWeight: 600,
                          fontSize: 12,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <Eye size={13} /> View Order
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 4. CUSTOMER ENQUIRIES TAB (DEDICATED PAGE)
// ─────────────────────────────────────────────────────────────
function EnquiriesSection({
  enquiries,
  onRefresh,
  onSummaryRefresh,
  showToast,
  onViewEnquiry,
}: {
  enquiries: EnquiryItem[];
  onRefresh: () => void;
  onSummaryRefresh: () => void;
  showToast: (m: string) => void;
  onViewEnquiry: (enq: EnquiryItem) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = useMemo(() => {
    return enquiries.filter((e) => {
      const matchStatus = statusFilter === "all" || e.status === statusFilter;
      const matchSearch =
        e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.phone.includes(searchTerm) ||
        (e.email && e.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        e.message.toLowerCase().includes(searchTerm.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [enquiries, searchTerm, statusFilter]);

  const updateEnquiryStatus = async (enquiry: EnquiryItem, newStatus: string) => {
    try {
      const res = await fetch(`${API_URL}/enquiries/${enquiry.id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        onRefresh();
        onSummaryRefresh();
        showToast(`Enquiry marked as ${newStatus}.`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ background: "#fff", border: "1px solid #e8e3d8", borderRadius: 20, padding: 24, boxShadow: "0 4px 18px rgba(0,0,0,0.03)" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16, marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: 0, fontFamily: "'Playfair Display', serif", fontSize: 22, color: "#172b20" }}>
            Customer Inquiries &amp; Bulk Gifting
          </h2>
          <span style={{ fontSize: 13, color: "#687268" }}>
            Respond to bulk order inquiries, corporate gifting, and visitor messages
          </span>
        </div>

        <button
          onClick={onRefresh}
          style={{
            background: "#faf7f0",
            border: "1px solid #d3cbbd",
            borderRadius: 99,
            padding: "8px 18px",
            fontSize: 13,
            fontWeight: 600,
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            cursor: "pointer",
            color: "#172b20",
          }}
        >
          <RefreshCw size={13} /> Refresh Enquiries
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 260 }}>
          <Search size={15} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#8d998d" }} />
          <input
            type="text"
            placeholder="Search by customer name, phone, email, or message keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 14px 10px 38px",
              borderRadius: 12,
              border: "1px solid #e8e3d8",
              background: "#faf7f0",
              fontSize: 13,
              outline: "none",
            }}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: "10px 16px",
            borderRadius: 12,
            border: "1px solid #e8e3d8",
            background: "#fff",
            fontSize: 13,
            fontWeight: 600,
            color: "#172b20",
            cursor: "pointer",
          }}
        >
          <option value="all">All Enquiry Statuses</option>
          <option value="new">New ({enquiries.filter((e) => e.status === "new").length})</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      {/* Enquiries Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #e8e3d8", color: "#687268", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              <th style={{ padding: "12px 14px" }}>Customer</th>
              <th style={{ padding: "12px 14px" }}>Contact</th>
              <th style={{ padding: "12px 14px" }}>Message Preview</th>
              <th style={{ padding: "12px 14px" }}>Date</th>
              <th style={{ padding: "12px 14px" }}>Status</th>
              <th style={{ padding: "12px 14px", textAlign: "right" }}>Direct Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: "36px 14px", textAlign: "center", color: "#8d998d" }}>
                  No customer enquiries match your search filter.
                </td>
              </tr>
            ) : (
              filtered.map((enq) => {
                const meta = enquiryStatusMeta[enq.status] || { label: enq.status, color: "#6b7280", bg: "#f3f4f6" };
                const cleanPhone = enq.phone ? enq.phone.replace(/[^0-9]/g, "") : "";
                const waUrl = cleanPhone
                  ? `https://wa.me/${cleanPhone.startsWith("91") ? cleanPhone : "91" + cleanPhone}?text=Namaskar%20${encodeURIComponent(enq.name)},%20thank%20you%20for%20contacting%20Shiv%20Samarth%20Hapus.`
                  : null;

                return (
                  <tr key={enq.id} style={{ borderBottom: "1px solid #f2eadc", transition: "background 0.15s" }}>
                    <td style={{ padding: "14px", fontWeight: 700, color: "#172b20" }}>
                      <div>{enq.name}</div>
                      {enq.subject && <div style={{ fontSize: 11, color: "#c89a4b", fontWeight: 600 }}>{enq.subject}</div>}
                    </td>

                    <td style={{ padding: "14px" }}>
                      <div style={{ color: "#172b20" }}>{enq.phone || "—"}</div>
                      {enq.email && <div style={{ fontSize: 11, color: "#8d998d" }}>{enq.email}</div>}
                    </td>

                    <td style={{ padding: "14px", maxWidth: 280, color: "#4b5563" }}>
                      <p style={{ margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {enq.message}
                      </p>
                    </td>

                    <td style={{ padding: "14px", fontSize: 11, color: "#8d998d" }}>
                      {new Date(enq.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </td>

                    <td style={{ padding: "14px" }}>
                      <select
                        value={enq.status}
                        onChange={(e) => updateEnquiryStatus(enq, e.target.value)}
                        style={{
                          padding: "4px 10px",
                          borderRadius: 99,
                          fontSize: 11,
                          fontWeight: 700,
                          border: `1px solid ${meta.color}40`,
                          background: meta.bg,
                          color: meta.color,
                          cursor: "pointer",
                        }}
                      >
                        <option value="new">New</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </td>

                    <td style={{ padding: "14px", textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: 6 }}>
                        {waUrl && (
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              padding: "6px 10px",
                              borderRadius: 8,
                              background: "#dcfce7",
                              color: "#15803d",
                              textDecoration: "none",
                              fontSize: 12,
                              fontWeight: 700,
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 4,
                            }}
                            title="WhatsApp this customer"
                          >
                            <Phone size={12} /> WhatsApp
                          </a>
                        )}

                        {enq.email && (
                          <a
                            href={`mailto:${enq.email}?subject=Regarding%20your%20Shiv%20Samarth%20Hapus%20enquiry`}
                            style={{
                              padding: "6px 10px",
                              borderRadius: 8,
                              background: "#f2eadc",
                              color: "#214638",
                              textDecoration: "none",
                              fontSize: 12,
                              fontWeight: 600,
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 4,
                            }}
                            title="Send email"
                          >
                            <Mail size={12} /> Email
                          </a>
                        )}

                        <button
                          onClick={() => onViewEnquiry(enq)}
                          style={{
                            padding: "6px 10px",
                            borderRadius: 8,
                            border: "1px solid #d3cbbd",
                            background: "#fff",
                            cursor: "pointer",
                            color: "#172b20",
                          }}
                          title="View message and notes"
                        >
                          <Eye size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 5. INVENTORY & STOCK MANAGEMENT TAB (DEDICATED PAGE)
// ─────────────────────────────────────────────────────────────
function InventorySection({
  products,
  summary,
  onRefresh,
  showToast,
}: {
  products: ProductItem[];
  summary: AdminSummaryData | null;
  onRefresh: () => void;
  showToast: (m: string) => void;
}) {
  const [stockEdits, setStockEdits] = useState<Record<number, number>>({});
  const [savingId, setSavingId] = useState<number | null>(null);

  const handleStockChange = (productId: number, val: number) => {
    setStockEdits((prev) => ({ ...prev, [productId]: Math.max(0, val) }));
  };

  const saveStock = async (product: ProductItem) => {
    const newQty = stockEdits[product.id] ?? product.stock_quantity;
    setSavingId(product.id);
    try {
      const res = await fetch(`${API_URL}/products/${product.slug}/update_stock/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock_quantity: newQty }),
      });
      if (res.ok) {
        onRefresh();
        showToast(`Stock for ${product.name} updated to ${newQty} boxes.`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Inventory KPI Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
        <div style={{ background: "#fff", border: "1px solid #e8e3d8", borderRadius: 16, padding: 18, boxShadow: "0 4px 18px rgba(0,0,0,0.03)" }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#687268" }}>Total Boxes Available</div>
          <div style={{ fontSize: 26, fontFamily: "'Playfair Display', serif", fontWeight: 800, color: "#172b20", margin: "6px 0 2px" }}>
            {products.reduce((acc, p) => acc + p.stock_quantity, 0)}
          </div>
          <span style={{ fontSize: 11, color: "#8d998d" }}>Across all mango varieties</span>
        </div>

        <div style={{ background: "#fff", border: "1px solid #e8e3d8", borderRadius: 16, padding: 18, boxShadow: "0 4px 18px rgba(0,0,0,0.03)" }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#687268" }}>Inventory Valuation</div>
          <div style={{ fontSize: 26, fontFamily: "'Playfair Display', serif", fontWeight: 800, color: "#214638", margin: "6px 0 2px" }}>
            ₹{(summary?.total_inventory_value || products.reduce((acc, p) => acc + Number(p.price) * p.stock_quantity, 0)).toLocaleString("en-IN")}
          </div>
          <span style={{ fontSize: 11, color: "#8d998d" }}>Retail selling value</span>
        </div>

        <div style={{ background: "#fff", border: "1px solid #e8e3d8", borderRadius: 16, padding: 18, boxShadow: "0 4px 18px rgba(0,0,0,0.03)" }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#687268" }}>Low Stock Alerts (&le;15)</div>
          <div style={{ fontSize: 26, fontFamily: "'Playfair Display', serif", fontWeight: 800, color: "#b45309", margin: "6px 0 2px" }}>
            {products.filter((p) => p.stock_quantity > 0 && p.stock_quantity <= 15).length}
          </div>
          <span style={{ fontSize: 11, color: "#b45309" }}>May need orchard harvest re-fill</span>
        </div>

        <div style={{ background: "#fff", border: "1px solid #e8e3d8", borderRadius: 16, padding: 18, boxShadow: "0 4px 18px rgba(0,0,0,0.03)" }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#687268" }}>Out of Stock Items</div>
          <div style={{ fontSize: 26, fontFamily: "'Playfair Display', serif", fontWeight: 800, color: "#b91c1c", margin: "6px 0 2px" }}>
            {products.filter((p) => p.stock_quantity === 0).length}
          </div>
          <span style={{ fontSize: 11, color: "#8d998d" }}>Unavailable for customer checkout</span>
        </div>
      </div>

      {/* Stock Management Table */}
      <div style={{ background: "#fff", border: "1px solid #e8e3d8", borderRadius: 20, padding: 24, boxShadow: "0 4px 18px rgba(0,0,0,0.03)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <h2 style={{ margin: 0, fontFamily: "'Playfair Display', serif", fontSize: 22, color: "#172b20" }}>
              Live Stock &amp; Inventory Adjustments
            </h2>
            <span style={{ fontSize: 13, color: "#687268" }}>
              Update available box counts directly. Inventory automatically adjusts when orders are confirmed or cancelled.
            </span>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #e8e3d8", color: "#687268", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                <th style={{ padding: "12px 14px" }}>Mango Product</th>
                <th style={{ padding: "12px 14px" }}>Variety</th>
                <th style={{ padding: "12px 14px" }}>Price / Box</th>
                <th style={{ padding: "12px 14px" }}>Stock Health</th>
                <th style={{ padding: "12px 14px" }}>Current Stock</th>
                <th style={{ padding: "12px 14px", textAlign: "right" }}>Update Stock</th>
              </tr>
            </thead>
            <tbody>
              {products.map((prod) => {
                const currentEditVal = stockEdits[prod.id] ?? prod.stock_quantity;
                const hasChanges = currentEditVal !== prod.stock_quantity;
                const isLow = prod.stock_quantity <= 15 && prod.stock_quantity > 0;
                const isOut = prod.stock_quantity === 0;

                return (
                  <tr key={prod.id} style={{ borderBottom: "1px solid #f2eadc" }}>
                    <td style={{ padding: "14px", fontWeight: 700, color: "#172b20" }}>
                      <div>{prod.name}</div>
                      <div style={{ fontSize: 11, color: "#8d998d", fontWeight: 400 }}>{prod.weight_kg} kg packaged peti</div>
                    </td>

                    <td style={{ padding: "14px", textTransform: "capitalize", color: "#214638", fontWeight: 600 }}>
                      {prod.category}
                    </td>

                    <td style={{ padding: "14px", fontWeight: 700 }}>
                      ₹{Number(prod.price).toLocaleString("en-IN")}
                    </td>

                    <td style={{ padding: "14px" }}>
                      {isOut ? (
                        <span style={{ padding: "3px 10px", borderRadius: 99, background: "#fee2e2", color: "#b91c1c", fontSize: 11, fontWeight: 700 }}>
                          Out of Stock
                        </span>
                      ) : isLow ? (
                        <span style={{ padding: "3px 10px", borderRadius: 99, background: "#fef3c7", color: "#b45309", fontSize: 11, fontWeight: 700 }}>
                          Low Stock Alert
                        </span>
                      ) : (
                        <span style={{ padding: "3px 10px", borderRadius: 99, background: "#dcfce7", color: "#15803d", fontSize: 11, fontWeight: 700 }}>
                          Healthy Supply
                        </span>
                      )}
                    </td>

                    <td style={{ padding: "14px" }}>
                      <div style={{ display: "inline-flex", alignItems: "center", border: "1px solid #d3cbbd", borderRadius: 10, overflow: "hidden", background: "#faf7f0" }}>
                        <button
                          onClick={() => handleStockChange(prod.id, currentEditVal - 1)}
                          style={{ border: "none", background: "transparent", padding: "6px 12px", cursor: "pointer", fontSize: 14, fontWeight: 700, color: "#214638" }}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={currentEditVal}
                          onChange={(e) => handleStockChange(prod.id, parseInt(e.target.value) || 0)}
                          style={{
                            width: 60,
                            textAlign: "center",
                            border: "none",
                            background: "transparent",
                            fontWeight: 700,
                            fontSize: 14,
                            color: "#172b20",
                            outline: "none",
                          }}
                        />
                        <button
                          onClick={() => handleStockChange(prod.id, currentEditVal + 1)}
                          style={{ border: "none", background: "transparent", padding: "6px 12px", cursor: "pointer", fontSize: 14, fontWeight: 700, color: "#214638" }}
                        >
                          +
                        </button>
                      </div>
                    </td>

                    <td style={{ padding: "14px", textAlign: "right" }}>
                      <button
                        onClick={() => saveStock(prod)}
                        disabled={savingId === prod.id || !hasChanges}
                        style={{
                          padding: "7px 16px",
                          borderRadius: 99,
                          border: "none",
                          background: hasChanges ? "#214638" : "#e5e7eb",
                          color: hasChanges ? "#fff" : "#9ca3af",
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: hasChanges ? "pointer" : "default",
                          transition: "all 0.2s",
                        }}
                      >
                        {savingId === prod.id ? "Saving..." : "Save Stock"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 6. SETTINGS TAB
// ─────────────────────────────────────────────────────────────
function SettingsSection({ showToast }: { showToast: (m: string) => void }) {
  const [phone, setPhone] = useState("+91 95520 50093");
  const [email, setEmail] = useState("hello@shivsamarthhapus.com");
  const [farmLocation, setFarmLocation] = useState("Devgad, Sindhudurg, Maharashtra");
  const [minOrder, setMinOrder] = useState("1");
  const [seasonActive, setSeasonActive] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("Store and delivery settings updated.");
  };

  return (
    <div style={{ background: "#fff", border: "1px solid #e8e3d8", borderRadius: 20, padding: 28, boxShadow: "0 4px 18px rgba(0,0,0,0.03)", maxWidth: 760 }}>
      <h2 style={{ margin: "0 0 6px", fontFamily: "'Playfair Display', serif", fontSize: 22, color: "#172b20" }}>
        Store &amp; Orchard Settings
      </h2>
      <p style={{ color: "#687268", fontSize: 13, marginTop: 0, marginBottom: 24 }}>
        Configure customer contact information, order limits, and seasonal operational preferences
      </p>

      <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#687268", marginBottom: 6 }}>
              WhatsApp Business Phone
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #e8e3d8", background: "#faf7f0", fontSize: 13 }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#687268", marginBottom: 6 }}>
              Customer Support Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #e8e3d8", background: "#faf7f0", fontSize: 13 }}
            />
          </div>
        </div>

        <div>
          <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#687268", marginBottom: 6 }}>
            Farm Location &amp; Origin Description
          </label>
          <input
            type="text"
            value={farmLocation}
            onChange={(e) => setFarmLocation(e.target.value)}
            style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #e8e3d8", background: "#faf7f0", fontSize: 13 }}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", background: "#faf7f0", borderRadius: 14, border: "1px solid #e9e0d1" }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: "#172b20" }}>2026 Harvest Season Bookings</div>
            <div style={{ fontSize: 12, color: "#687268" }}>Allow customers to place advance peti orders on the website</div>
          </div>
          <button
            type="button"
            onClick={() => setSeasonActive(!seasonActive)}
            style={{
              padding: "6px 16px",
              borderRadius: 99,
              border: "none",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              background: seasonActive ? "#15803d" : "#9ca3af",
              color: "#fff",
            }}
          >
            {seasonActive ? "Booking Active" : "Booking Paused"}
          </button>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
          <button
            type="submit"
            style={{
              padding: "11px 26px",
              borderRadius: 99,
              border: "none",
              background: "#214638",
              color: "#fff",
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MODAL: ADD / EDIT PRODUCT
// ─────────────────────────────────────────────────────────────
function ProductFormModal({
  title,
  initialData,
  onClose,
  onSuccess,
}: {
  title: string;
  initialData: ProductItem | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [name, setName] = useState(initialData?.name || "");
  const [nameMr, setNameMr] = useState(initialData?.name_mr || "");
  const [category, setCategory] = useState<"hapus" | "other" | "gift">(initialData?.category || "hapus");
  const [price, setPrice] = useState(initialData ? String(initialData.price) : "2400");
  const [comparePrice, setComparePrice] = useState(initialData?.compare_at_price ? String(initialData.compare_at_price) : "");
  const [weightKg, setWeightKg] = useState(initialData ? String(initialData.weight_kg) : "5");
  const [stockQuantity, setStockQuantity] = useState(initialData ? String(initialData.stock_quantity) : "20");
  const [imageUrl, setImageUrl] = useState(initialData?.image_url || "/images/devgad-hapus.jpg");
  const [description, setDescription] = useState(initialData?.description || "");
  const [isActive, setIsActive] = useState(initialData?.is_active ?? true);
  const [isFeatured, setIsFeatured] = useState(initialData?.is_featured ?? true);

  // Unit Options State (Dozen & Grams & Box & Kg)
  const defaultUnits = ["box", "dozen", "grams", "kg"];
  const [availableUnits, setAvailableUnits] = useState<string[]>(
    Array.isArray(initialData?.available_units) && initialData.available_units.length > 0
      ? initialData.available_units
      : defaultUnits
  );
  const [unitPrices, setUnitPrices] = useState<Record<string, string>>(() => {
    const pMap: Record<string, string> = {};
    if (initialData?.unit_prices) {
      Object.entries(initialData.unit_prices).forEach(([u, val]) => {
        pMap[u] = String(val);
      });
    }
    return pMap;
  });

  // Local Image Upload from Device State
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const toggleUnit = (u: string) => {
    setAvailableUnits((prev) =>
      prev.includes(u) ? prev.filter((item) => item !== u) : [...prev, u]
    );
  };

  const handleUnitCustomPrice = (u: string, val: string) => {
    setUnitPrices((prev) => ({ ...prev, [u]: val }));
  };

  // Direct file picker upload handler
  const handleDeviceUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      let res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        res = await fetch(`${API_URL}/upload/product-image/`, {
          method: "POST",
          body: formData,
        });
      }

      if (!res.ok) {
        throw new Error("Failed to upload image. Please try another file.");
      }

      const data = await res.json();
      if (data.url) {
        setImageUrl(data.url);
      }
    } catch (err: any) {
      console.error(err);
      setUploadError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);

    // Format clean unit_prices dictionary with numeric values
    const finalUnitPrices: Record<string, number> = {};
    const baseP = parseFloat(price) || 0;
    const wKg = parseFloat(weightKg) || 5;

    availableUnits.forEach((u) => {
      if (unitPrices[u] && parseFloat(unitPrices[u]) > 0) {
        finalUnitPrices[u] = parseFloat(unitPrices[u]);
      } else {
        // Automatic default price fallback per unit
        if (u === "dozen") finalUnitPrices[u] = Math.round(baseP * 0.6);
        else if (u === "grams" || u === "500g") finalUnitPrices[u] = Math.round((baseP / wKg) * 0.5);
        else if (u === "kg") finalUnitPrices[u] = Math.round(baseP / wKg);
        else finalUnitPrices[u] = baseP;
      }
    });

    const payload = {
      name,
      name_mr: nameMr,
      category,
      price: baseP,
      compare_at_price: comparePrice ? parseFloat(comparePrice) : null,
      weight_kg: wKg,
      stock_quantity: parseInt(stockQuantity) || 0,
      image_url: imageUrl,
      description,
      available_units: availableUnits.length > 0 ? availableUnits : ["box"],
      unit_prices: finalUnitPrices,
      is_active: isActive,
      is_featured: isFeatured,
    };

    try {
      const url = initialData ? `${API_URL}/products/${initialData.slug}/` : `${API_URL}/products/`;
      const method = initialData ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        onSuccess();
      } else {
        const err = await res.json();
        setErrorMsg(JSON.stringify(err));
      }
    } catch (e: any) {
      setErrorMsg(e.message || "Network error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(4px)",
        display: "grid",
        placeItems: "center",
        padding: 20,
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 22,
          padding: 28,
          maxWidth: 680,
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ margin: 0, fontFamily: "'Playfair Display', serif", fontSize: 20, color: "#172b20" }}>{title}</h3>
          <button onClick={onClose} style={{ border: "none", background: "transparent", cursor: "pointer", color: "#687268" }}>
            <X size={20} />
          </button>
        </div>

        {errorMsg && (
          <div style={{ padding: "10px 14px", background: "#fee2e2", color: "#b91c1c", borderRadius: 10, fontSize: 12, marginBottom: 16 }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* 1. Name fields */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#687268", marginBottom: 4 }}>
                Product Name (English)*
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Devgad Hapus Alphonso"
                style={{ width: "100%", padding: 9, borderRadius: 8, border: "1px solid #d3cbbd", fontSize: 13 }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#687268", marginBottom: 4 }}>
                Name in Marathi (मराठी)
              </label>
              <input
                type="text"
                value={nameMr}
                onChange={(e) => setNameMr(e.target.value)}
                placeholder="उदा. देवगड हापूस"
                style={{ width: "100%", padding: 9, borderRadius: 8, border: "1px solid #d3cbbd", fontSize: 13 }}
              />
            </div>
          </div>

          {/* 2. Category, Base Price, Weight */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#687268", marginBottom: 4 }}>
                Category*
              </label>
              <select
                value={category}
                onChange={(e: any) => setCategory(e.target.value)}
                style={{ width: "100%", padding: 9, borderRadius: 8, border: "1px solid #d3cbbd", fontSize: 13 }}
              >
                <option value="hapus">Hapus (Alphonso)</option>
                <option value="other">Other Mango (Kesar, etc.)</option>
                <option value="gift">Gift Box / Wooden Peti</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#687268", marginBottom: 4 }}>
                Base Box Price (₹)*
              </label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                style={{ width: "100%", padding: 9, borderRadius: 8, border: "1px solid #d3cbbd", fontSize: 13 }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#687268", marginBottom: 4 }}>
                Base Weight (kg)*
              </label>
              <input
                type="number"
                step="0.5"
                required
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                style={{ width: "100%", padding: 9, borderRadius: 8, border: "1px solid #d3cbbd", fontSize: 13 }}
              />
            </div>
          </div>

          {/* 3. UNIT CONFIGURATION SECTION (Requirement 2: Dozen, Grams, Box, Kg) */}
          <div
            style={{
              background: "#faf7f0",
              border: "1.5px solid #e9dfcf",
              borderRadius: 14,
              padding: "14px 16px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: "#172b20", margin: 0, display: "flex", alignItems: "center", gap: 6 }}>
                <span>📦</span> Available Units &amp; Sizing Options (Dozen &amp; Grams)
              </label>
              <span style={{ fontSize: 11, color: "#c89a4b", fontWeight: 700 }}>
                {availableUnits.length} units active
              </span>
            </div>
            <p style={{ margin: "0 0 12px", fontSize: 11, color: "#687268" }}>
              Enable which units customers can choose on the storefront, and optionally set custom pricing per unit.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { key: "dozen", label: "Dozen (डझन - 12 Mangoes)", defaultHint: "e.g. ₹1,440" },
                { key: "grams", label: "Grams (५०० ग्रॅम - Trial Pack)", defaultHint: "e.g. ₹240" },
                { key: "box", label: "Standard Peti Box (पेटी - 5kg)", defaultHint: "Default Base Price" },
                { key: "kg", label: "Kilogram (१ किलो - Single Kg)", defaultHint: "e.g. ₹480" },
              ].map(({ key, label, defaultHint }) => {
                const isSelected = availableUnits.includes(key);
                return (
                  <div
                    key={key}
                    style={{
                      background: isSelected ? "#ffffff" : "rgba(0,0,0,0.02)",
                      border: isSelected ? "1.5px solid #214638" : "1px solid #e2d9cb",
                      borderRadius: 10,
                      padding: "10px 12px",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontWeight: 700, fontSize: 12, color: "#172b20" }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleUnit(key)}
                        style={{ accentColor: "#214638", width: 16, height: 16 }}
                      />
                      <span>{label}</span>
                    </label>

                    {isSelected && (
                      <div style={{ marginTop: 8, paddingTop: 6, borderTop: "1px dashed #e8e0d2" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontSize: 11, color: "#687268" }}>Price (₹):</span>
                          <input
                            type="number"
                            placeholder={defaultHint}
                            value={unitPrices[key] || ""}
                            onChange={(e) => handleUnitCustomPrice(key, e.target.value)}
                            style={{
                              width: "100%",
                              padding: "4px 8px",
                              borderRadius: 6,
                              border: "1px solid #d3cbbd",
                              fontSize: 12,
                              fontWeight: 700,
                              color: "#214638",
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. ATTACH PHOTO & DIRECT DEVICE UPLOAD (Requirement 3) */}
          <div
            style={{
              background: "#faf7f0",
              border: "1.5px solid #e9dfcf",
              borderRadius: 14,
              padding: "14px 16px",
            }}
          >
            <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#172b20", marginBottom: 6 }}>
              🖼️ Product Photo (Attach from Local Device or URL)
            </label>

            {uploadError && (
              <div style={{ padding: "6px 10px", background: "#fee2e2", color: "#b91c1c", borderRadius: 8, fontSize: 12, marginBottom: 10 }}>
                {uploadError}
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "110px 1fr", gap: 14, alignItems: "center" }}>
              {/* Image Preview Thumbnail */}
              <div
                style={{
                  width: 110,
                  height: 85,
                  borderRadius: 10,
                  overflow: "hidden",
                  border: "1.5px solid #d3cbbd",
                  background: "#eee",
                  display: "grid",
                  placeItems: "center",
                  position: "relative",
                }}
              >
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="Product preview"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <span style={{ fontSize: 24 }}>🥭</span>
                )}
                {uploading && (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "rgba(0,0,0,0.6)",
                      display: "grid",
                      placeItems: "center",
                      color: "#fff",
                      fontSize: 10,
                      fontWeight: 700,
                    }}
                  >
                    Uploading...
                  </div>
                )}
              </div>

              {/* Upload Controls */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {/* Direct File Picker Input */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  <label
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "8px 16px",
                      borderRadius: 10,
                      background: "#214638",
                      color: "#fff",
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: uploading ? "wait" : "pointer",
                      boxShadow: "0 2px 8px rgba(33, 70, 56, 0.25)",
                    }}
                  >
                    <Upload size={14} />
                    <span>{uploading ? "अपलोड होत आहे..." : "Upload from Device (स्थानिक फोटो निवडा)"}</span>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/svg+xml"
                      onChange={handleDeviceUpload}
                      disabled={uploading}
                      style={{ display: "none" }}
                    />
                  </label>

                  <span style={{ fontSize: 11, color: "#8d998d" }}>
                    JPG, PNG, WebP (Max 10MB)
                  </span>
                </div>

                {/* Direct URL field */}
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 11, color: "#687268", whiteSpace: "nowrap" }}>or Image Path:</span>
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="/images/devgad-hapus.jpg or /uploads/..."
                    style={{
                      width: "100%",
                      padding: "6px 10px",
                      borderRadius: 6,
                      border: "1px solid #d3cbbd",
                      fontSize: 12,
                      background: "#fff",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 5. Stock & Compare Price */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#687268", marginBottom: 4 }}>
                Initial Stock Quantity (Boxes)
              </label>
              <input
                type="number"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value)}
                style={{ width: "100%", padding: 9, borderRadius: 8, border: "1px solid #d3cbbd", fontSize: 13 }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#687268", marginBottom: 4 }}>
                Compare At Price (Original MRP for Strikethrough)
              </label>
              <input
                type="number"
                value={comparePrice}
                onChange={(e) => setComparePrice(e.target.value)}
                placeholder="e.g. 2800"
                style={{ width: "100%", padding: 9, borderRadius: 8, border: "1px solid #d3cbbd", fontSize: 13 }}
              />
            </div>
          </div>

          {/* 6. Description */}
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#687268", marginBottom: 4 }}>
              Description &amp; Origin Notes
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Authentic GI-tagged Devgad Alphonso with rich golden aroma and sweet non-fibrous pulp."
              style={{ width: "100%", padding: 9, borderRadius: 8, border: "1px solid #d3cbbd", fontSize: 13 }}
            />
          </div>

          {/* 7. Visibility Toggles */}
          <div style={{ display: "flex", gap: 20, alignItems: "center", margin: "2px 0" }}>
            <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, cursor: "pointer" }}>
              <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
              <span>Visible in Public Shop</span>
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, cursor: "pointer" }}>
              <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} />
              <span>Highlight on Homepage</span>
            </label>
          </div>

          {/* 8. Submit buttons */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 10 }}>
            <button
              type="button"
              onClick={onClose}
              style={{ padding: "9px 18px", borderRadius: 99, border: "1px solid #d3cbbd", background: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 600 }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              style={{ padding: "9px 24px", borderRadius: 99, border: "none", background: "#214638", color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 700 }}
            >
              {submitting ? "Saving..." : initialData ? "Save Changes" : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MODAL: DELETE CONFIRMATION
// ─────────────────────────────────────────────────────────────
function DeleteConfirmModal({
  product,
  onClose,
  onConfirm,
}: {
  product: ProductItem;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(4px)",
        display: "grid",
        placeItems: "center",
        padding: 20,
      }}
    >
      <div style={{ background: "#fff", borderRadius: 20, padding: 26, maxWidth: 440, width: "100%", textAlign: "center" }}>
        <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#fee2e2", color: "#b91c1c", margin: "0 auto 14px", display: "grid", placeItems: "center" }}>
          <Trash2 size={22} />
        </div>
        <h3 style={{ margin: "0 0 8px", fontFamily: "'Playfair Display', serif", fontSize: 19 }}>
          Delete &quot;{product.name}&quot;?
        </h3>
        <p style={{ color: "#687268", fontSize: 13, lineHeight: 1.5, margin: "0 0 20px" }}>
          Are you sure you want to delete this mango product? This will remove it from the database and the customer storefront.
        </p>

        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <button
            onClick={onClose}
            style={{ padding: "9px 20px", borderRadius: 99, border: "1px solid #d3cbbd", background: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer" }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{ padding: "9px 22px", borderRadius: 99, border: "none", background: "#b91c1c", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" }}
          >
            Yes, Delete Product
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MODAL: ORDER DETAILS & COURIER TRACKING
// ─────────────────────────────────────────────────────────────
function OrderDetailsModal({
  order,
  onClose,
  onOrderUpdated,
}: {
  order: OrderItem;
  onClose: () => void;
  onOrderUpdated: (updated: OrderItem) => void;
}) {
  const [status, setStatus] = useState(order.status);
  const [courierName, setCourierName] = useState(order.courier_name || "");
  const [trackingNumber, setTrackingNumber] = useState(order.tracking_number || "");
  const [notes, setNotes] = useState(order.notes || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/orders/${order.id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          courier_name: courierName,
          tracking_number: trackingNumber,
          notes,
        }),
      });
      if (res.ok) {
        const updated = await res.json();
        onOrderUpdated(updated);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const printShippingLabel = () => {
    const printWindow = window.open("", "_blank", "width=600,height=750");
    if (!printWindow) return;
    const itemsList = (order.items || [])
      .map((i) => `<li>${i.title || i.name} &times; ${i.qty || i.quantity || 1}</li>`)
      .join("");

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Shipping Label #${order.order_number}</title>
        <style>
          @page { size: 4in 6in; margin: 0; }
          body { font-family: 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 18px; color: #172b20; background: #fff; box-sizing: border-box; }
          .header { border-bottom: 2px solid #172b20; padding-bottom: 10px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; }
          .title { font-size: 16px; font-weight: 900; letter-spacing: 0.05em; color: #172b20; }
          .gi-badge { background: #172b20; color: #fff; padding: 4px 8px; border-radius: 4px; font-size: 10px; font-weight: 700; }
          .section { margin-bottom: 14px; }
          .label-title { font-size: 10px; text-transform: uppercase; font-weight: 800; color: #666; margin-bottom: 4px; letter-spacing: 0.05em; }
          .to-box { background: #f8f6f0; border: 1.5px solid #172b20; border-radius: 8px; padding: 12px; margin-bottom: 12px; }
          .cust-name { font-size: 16px; font-weight: 800; margin-bottom: 4px; }
          .cust-addr { font-size: 13px; line-height: 1.4; }
          .cust-phone { font-size: 14px; font-weight: 800; margin-top: 6px; }
          .from-box { font-size: 11px; line-height: 1.4; color: #444; border-bottom: 1px dashed #ccc; padding-bottom: 10px; margin-bottom: 12px; }
          .order-details { font-size: 12px; margin-bottom: 12px; }
          .order-details ul { margin: 4px 0; padding-left: 18px; }
          .fragile-box { border: 2px dashed #b91c1c; color: #b91c1c; font-weight: 800; font-size: 11px; text-align: center; padding: 8px; border-radius: 6px; text-transform: uppercase; margin-top: 10px; }
          .barcode { font-family: monospace; font-size: 20px; font-weight: 900; letter-spacing: 4px; text-align: center; margin-top: 12px; border-top: 1px solid #172b20; padding-top: 8px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="title">॥ शिवसमर्थ देवगड हापूस ॥</div>
            <div style="font-size: 10px; color: #c89a4b; font-weight: 700;">SHIV SAMARTH HAPUS ORCHARD</div>
          </div>
          <span class="gi-badge">GI-TAG CERTIFIED</span>
        </div>

        <div class="from-box">
          <strong>FROM / प्रेषक:</strong><br/>
          शेवाळे ॲग्रो फार्म (Shewale Agro Farm)<br/>
          नारिंग्रे, ता. देवगड, जि. सिंधुदुर्ग - ४१६६१३<br/>
          मोबाईल: +91 95520 50093 | ईमेल: shivsamartha@gmail.com
        </div>

        <div class="to-box">
          <div class="label-title">SHIP TO / प्रति:</div>
          <div class="cust-name">${order.customer_name}</div>
          <div class="cust-addr">${order.address}, ${order.city} - <strong>${order.pincode}</strong></div>
          <div class="cust-phone">📞 Phone: ${order.phone}</div>
        </div>

        <div class="order-details">
          <div class="label-title">PACKAGE CONTENTS / पेटी तपशील:</div>
          <div>Order #${order.order_number} (${order.created_at})</div>
          <ul>${itemsList || "<li>Authentic Devgad Alphonso Peti</li>"}</ul>
          <div><strong>Courier:</strong> ${courierName || "Konkan Fast Cargo"} | <strong>Tracking:</strong> ${trackingNumber || "SSH-" + order.order_number}</div>
        </div>

        <div class="fragile-box">
          ⚠️ FRAGILE: 100% NATURALLY RIPENED MANGOES · HANDLE WITH CARE
        </div>

        <div class="barcode">
          *${order.order_number}*
        </div>
        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  const sendWhatsAppNotification = () => {
    const cleanPhone = (order.phone || "").replace(/[^0-9]/g, "");
    const phoneWithCountry = cleanPhone.startsWith("91") ? cleanPhone : `91${cleanPhone}`;
    const text = encodeURIComponent(
      `नमस्कार ${order.customer_name} जी!\n\nआपली ॥शिवसमर्थ॥ देवगड हापूस पेटी (Order #${order.order_number}) नारिंग्रे बागेतून रवाना झाली आहे! 🥭✨\n\n📦 कुरिअर: ${courierName || "कोकण फास्ट कार्गो"}\n🔍 ट्रॅकिंग क्र: ${trackingNumber || "SSH-EXPRESS"}\n💰 एकूण: ₹${Number(order.subtotal).toLocaleString("en-IN")}\n\nआपली पेटी थेट बागेतील गोडव्यासाठी सज्ज आहे. काही अडचण असल्यास ९५५२० ५००९३ वर संपर्क करा.\nअस्सल चवीची निवड केल्याबद्दल धन्यवाद! 🙏\n- शिवसमर्थ हापूस`
    );
    window.open(`https://wa.me/${phoneWithCountry}?text=${text}`, "_blank");
  };

  const meta = statusMeta[order.status] || { label: order.status, color: "#6b7280", bg: "#f3f4f6" };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(4px)",
        display: "grid",
        placeItems: "center",
        padding: 20,
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 22,
          padding: 28,
          maxWidth: 680,
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <h3 style={{ margin: 0, fontFamily: "'Playfair Display', serif", fontSize: 22, color: "#172b20" }}>
                Order #{order.order_number}
              </h3>
              <span
                style={{
                  padding: "4px 10px",
                  borderRadius: 99,
                  fontSize: 11,
                  fontWeight: 700,
                  background: meta.bg,
                  color: meta.color,
                }}
              >
                {meta.label}
              </span>
            </div>
            <span style={{ fontSize: 12, color: "#8d998d" }}>
              Placed on {new Date(order.created_at).toLocaleString("en-IN", { dateStyle: "long", timeStyle: "short" })}
            </span>
          </div>

          <button onClick={onClose} style={{ border: "none", background: "transparent", cursor: "pointer", color: "#687268" }}>
            <X size={20} />
          </button>
        </div>

        {/* Customer Information Card */}
        <div style={{ background: "#faf7f0", borderRadius: 14, padding: 18, border: "1px solid #e9e0d1", marginBottom: 18 }}>
          <h4 style={{ margin: "0 0 10px", fontSize: 13, textTransform: "uppercase", letterSpacing: "0.06em", color: "#c89a4b" }}>
            Customer Delivery Information
          </h4>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, fontSize: 13 }}>
            <div>
              <span style={{ color: "#687268", fontSize: 11 }}>Customer Name:</span>
              <div style={{ fontWeight: 700, color: "#172b20" }}>{order.customer_name}</div>
            </div>
            <div>
              <span style={{ color: "#687268", fontSize: 11 }}>Contact Phone:</span>
              <div style={{ fontWeight: 700, color: "#172b20" }}>{order.phone}</div>
            </div>
            <div>
              <span style={{ color: "#687268", fontSize: 11 }}>Email Address:</span>
              <div style={{ color: "#172b20" }}>{order.email || "—"}</div>
            </div>
            <div>
              <span style={{ color: "#687268", fontSize: 11 }}>Payment Channel:</span>
              <div style={{ fontWeight: 700, color: order.payment_method === "whatsapp" ? "#15803d" : "#1d4ed8", textTransform: "capitalize" }}>
                {order.payment_method === "whatsapp" ? "WhatsApp Direct" : "Online Gateway"}
              </div>
            </div>
          </div>
          <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid #e9e0d1", fontSize: 13 }}>
            <span style={{ color: "#687268", fontSize: 11 }}>Delivery Address:</span>
            <div style={{ color: "#172b20", marginTop: 2 }}>
              {order.address}, {order.city} — {order.pincode}
            </div>
          </div>
        </div>

        {/* Ordered Mango Boxes List */}
        <div style={{ marginBottom: 20 }}>
          <h4 style={{ margin: "0 0 10px", fontSize: 13, textTransform: "uppercase", letterSpacing: "0.06em", color: "#687268" }}>
            Items in this Peti
          </h4>
          <div style={{ border: "1px solid #e8e3d8", borderRadius: 12, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#faf7f0", borderBottom: "1px solid #e8e3d8", fontSize: 11, color: "#687268" }}>
                  <th style={{ padding: "8px 12px", textAlign: "left" }}>Product</th>
                  <th style={{ padding: "8px 12px", textAlign: "center" }}>Qty</th>
                  <th style={{ padding: "8px 12px", textAlign: "right" }}>Price</th>
                  <th style={{ padding: "8px 12px", textAlign: "right" }}>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items && order.items.length > 0 ? (
                  order.items.map((it, idx) => {
                    const title = it.title || it.name || "Alphonso Mango Peti";
                    const qty = it.quantity || it.qty || 1;
                    const pr = it.price || 0;
                    return (
                      <tr key={idx} style={{ borderBottom: "1px solid #f2eadc" }}>
                        <td style={{ padding: "10px 12px", fontWeight: 600 }}>{title}</td>
                        <td style={{ padding: "10px 12px", textAlign: "center" }}>{qty}</td>
                        <td style={{ padding: "10px 12px", textAlign: "right" }}>₹{pr.toLocaleString("en-IN")}</td>
                        <td style={{ padding: "10px 12px", textAlign: "right", fontWeight: 700 }}>
                          ₹{(pr * qty).toLocaleString("en-IN")}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={4} style={{ padding: "12px", textAlign: "center", color: "#8d998d" }}>
                      Direct checkout order (Total: ₹{Number(order.subtotal).toLocaleString("en-IN")})
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div style={{ padding: "12px 14px", background: "#faf7f0", display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: 800 }}>
              <span>Total Booking Amount:</span>
              <span style={{ fontSize: 16, color: "#214638" }}>₹{Number(order.subtotal).toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>

        {/* Update Status & Courier Section */}
        <form onSubmit={handleSave} style={{ borderTop: "1px solid #e8e3d8", paddingTop: 18, display: "flex", flexDirection: "column", gap: 14 }}>
          <h4 style={{ margin: "0", fontSize: 13, textTransform: "uppercase", letterSpacing: "0.06em", color: "#172b20" }}>
            Fulfillment &amp; Status Transitions
          </h4>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#687268", marginBottom: 4 }}>
                Change Order Pipeline Status
              </label>
              <select
                value={status}
                onChange={(e: any) => setStatus(e.target.value)}
                style={{ width: "100%", padding: 9, borderRadius: 8, border: "1px solid #d3cbbd", fontSize: 13, fontWeight: 700 }}
              >
                <option value="new">New (Awaiting Review)</option>
                <option value="confirmed">Confirmed (Harvest Assigned)</option>
                <option value="processing">Processing (Hay-Peti Packing)</option>
                <option value="shipped">Shipped (In Transit)</option>
                <option value="completed">Completed (Delivered)</option>
                <option value="cancelled">Cancelled (Restore Stock)</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#687268", marginBottom: 4 }}>
                Courier / Dispatch Partner
              </label>
              <input
                type="text"
                value={courierName}
                onChange={(e) => setCourierName(e.target.value)}
                placeholder="e.g. DTDC, Blue Dart, Express Konkan"
                style={{ width: "100%", padding: 9, borderRadius: 8, border: "1px solid #d3cbbd", fontSize: 13 }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#687268", marginBottom: 4 }}>
              Consignment Tracking Number / URL
            </label>
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="e.g. AWBD948192841"
              style={{ width: "100%", padding: 9, borderRadius: 8, border: "1px solid #d3cbbd", fontSize: 13 }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#687268", marginBottom: 4 }}>
              Internal Dispatch Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Packed with extra paddy straw. Call customer before delivery."
              style={{ width: "100%", padding: 9, borderRadius: 8, border: "1px solid #d3cbbd", fontSize: 13 }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginTop: 14, paddingTop: 14, borderTop: "1px solid #e8e3d8" }}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={printShippingLabel}
                style={{
                  padding: "9px 16px",
                  borderRadius: 99,
                  border: "1px solid #c89a4b",
                  background: "rgba(200, 154, 75, 0.12)",
                  color: "#172b20",
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 700,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <span>🖨️</span> Print 4×6 Box Label
              </button>

              <button
                type="button"
                onClick={sendWhatsAppNotification}
                style={{
                  padding: "9px 16px",
                  borderRadius: 99,
                  border: "1px solid #1c9b58",
                  background: "#1c9b58",
                  color: "#fff",
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 700,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <span>💬</span> WhatsApp Dispatch Alert
              </button>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                type="button"
                onClick={onClose}
                style={{ padding: "9px 18px", borderRadius: 99, border: "1px solid #d3cbbd", background: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 600 }}
              >
                Close
              </button>
              <button
                type="submit"
                disabled={saving}
                style={{ padding: "9px 24px", borderRadius: 99, border: "none", background: "#214638", color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 700 }}
              >
                {saving ? "Saving..." : "Update Order & Tracking"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MODAL: ENQUIRY DETAILS & NOTES
// ─────────────────────────────────────────────────────────────
function EnquiryDetailsModal({
  enquiry,
  onClose,
  onEnquiryUpdated,
}: {
  enquiry: EnquiryItem;
  onClose: () => void;
  onEnquiryUpdated: (updated: EnquiryItem) => void;
}) {
  const [status, setStatus] = useState(enquiry.status);
  const [notes, setNotes] = useState(enquiry.notes || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/enquiries/${enquiry.id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, notes }),
      });
      if (res.ok) {
        const updated = await res.json();
        onEnquiryUpdated(updated);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const cleanPhone = enquiry.phone ? enquiry.phone.replace(/[^0-9]/g, "") : "";
  const waUrl = cleanPhone
    ? `https://wa.me/${cleanPhone.startsWith("91") ? cleanPhone : "91" + cleanPhone}?text=Namaskar%20${encodeURIComponent(enquiry.name)},%20regarding%20your%20inquiry%20with%20Shiv%20Samarth%20Hapus.`
    : null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(4px)",
        display: "grid",
        placeItems: "center",
        padding: 20,
      }}
    >
      <div style={{ background: "#fff", borderRadius: 22, padding: 28, maxWidth: 540, width: "100%", maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
          <div>
            <h3 style={{ margin: 0, fontFamily: "'Playfair Display', serif", fontSize: 20, color: "#172b20" }}>
              Customer Message
            </h3>
            <span style={{ fontSize: 12, color: "#8d998d" }}>
              Submitted on {new Date(enquiry.created_at).toLocaleString("en-IN", { dateStyle: "long", timeStyle: "short" })}
            </span>
          </div>

          <button onClick={onClose} style={{ border: "none", background: "transparent", cursor: "pointer", color: "#687268" }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ background: "#faf7f0", borderRadius: 14, padding: 18, border: "1px solid #e9e0d1", marginBottom: 18 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: "#172b20", marginBottom: 4 }}>{enquiry.name}</div>
          <div style={{ fontSize: 13, color: "#687268", marginBottom: 10 }}>
            Phone: <strong>{enquiry.phone || "—"}</strong> | Email: <strong>{enquiry.email || "—"}</strong>
          </div>
          {enquiry.subject && (
            <div style={{ fontSize: 12, fontWeight: 700, color: "#c89a4b", marginBottom: 6 }}>
              Subject: {enquiry.subject}
            </div>
          )}
          <div style={{ background: "#fff", padding: 12, borderRadius: 10, border: "1px solid #e8e3d8", fontSize: 13, lineHeight: 1.6, color: "#1e2b22" }}>
            {enquiry.message}
          </div>
        </div>

        {/* Direct Action Buttons */}
        <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
          {waUrl && (
            <a
              href={waUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: 10,
                background: "#16a34a",
                color: "#fff",
                textDecoration: "none",
                fontWeight: 700,
                fontSize: 13,
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
              }}
            >
              <Phone size={14} /> Contact via WhatsApp
            </a>
          )}
          {enquiry.email && (
            <a
              href={`mailto:${enquiry.email}?subject=Regarding%20your%20Shiv%20Samarth%20Hapus%20enquiry`}
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: 10,
                background: "#214638",
                color: "#fff",
                textDecoration: "none",
                fontWeight: 700,
                fontSize: 13,
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
              }}
            >
              <Mail size={14} /> Send Email
            </a>
          )}
        </div>

        {/* Status and Notes Form */}
        <form onSubmit={handleSave} style={{ borderTop: "1px solid #e8e3d8", paddingTop: 16, display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#687268", marginBottom: 4 }}>
              Resolution Status
            </label>
            <select
              value={status}
              onChange={(e: any) => setStatus(e.target.value)}
              style={{ width: "100%", padding: 9, borderRadius: 8, border: "1px solid #d3cbbd", fontSize: 13, fontWeight: 700 }}
            >
              <option value="new">New (Needs Follow-up)</option>
              <option value="in_progress">In Progress (Contacted Customer)</option>
              <option value="resolved">Resolved (Complete)</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#687268", marginBottom: 4 }}>
              Internal Follow-up Notes
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Quoted corporate bulk price of ₹1,800/box for 20 boxes delivery to Nariman Point."
              style={{ width: "100%", padding: 9, borderRadius: 8, border: "1px solid #d3cbbd", fontSize: 13 }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 6 }}>
            <button
              type="button"
              onClick={onClose}
              style={{ padding: "8px 16px", borderRadius: 99, border: "1px solid #d3cbbd", background: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 600 }}
            >
              Close
            </button>
            <button
              type="submit"
              disabled={saving}
              style={{ padding: "8px 22px", borderRadius: 99, border: "none", background: "#214638", color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 700 }}
            >
              {saving ? "Saving..." : "Save Status & Notes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
