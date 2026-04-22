import {
  BadgeDollarSign,
  CircleCheckBig,
  ClipboardList,
  Mail,
  ShieldCheck,
  Truck,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

import { LoadingButton } from "../Components/LoadingControl.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { apiRequest } from "../lib/api.js";
import { formatStoreCurrency } from "../../shared/storefrontConfig.js";

const formatDate = (value) => {
  if (!value) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
};

const formatCurrency = (amount, currency = "INR") =>
  formatStoreCurrency(amount, { currency });

const formatDeliveryAddress = (address = {}) => {
  if (!address || typeof address !== "object") {
    return "";
  }

  const hasMeaningfulFields = Boolean(
    address.fullName ||
      address.line1 ||
      address.line2 ||
      address.landmark ||
      address.city ||
      address.state ||
      address.postalCode ||
      address.phone
  );

  if (!hasMeaningfulFields) {
    return "";
  }

  return [
    address.fullName,
    [address.line1, address.line2].filter(Boolean).join(", "),
    address.landmark ? `Landmark: ${address.landmark}` : "",
    [address.city, address.state, address.postalCode].filter(Boolean).join(", "),
    address.country,
    address.phone ? `Phone: ${address.phone}` : "",
  ]
    .filter(Boolean)
    .join(" • ");
};

const getBillType = (order) =>
  order?.bill?.type ||
  (String(order?.subscriptionType || "").toLowerCase() === "subscription"
    ? "Subscription bill"
    : "One-time order bill");

const statusTone = {
  new: "bg-[#FFF4D6] text-[#8A5A09]",
  "in-review": "bg-[#E8F1FF] text-[#265A9A]",
  resolved: "bg-[#EAF7E9] text-[#1E6B2D]",
};

const fetchAdminData = async (token) => {
  const [dashboard, users, support, subscribers, orders] = await Promise.all([
    apiRequest("/admin/dashboard", { token }),
    apiRequest("/admin/users", { token }),
    apiRequest("/admin/support-requests", { token }),
    apiRequest("/admin/newsletter-subscribers", { token }),
    apiRequest("/admin/orders", { token }),
  ]);

  return {
    dashboard,
    users: users.users,
    supportRequests: support.supportRequests,
    subscribers: subscribers.subscribers,
    orders: orders.orders,
  };
};

const getSupportStatusCounts = (supportRequests) =>
  supportRequests.reduce(
    (counts, request) => {
      const normalized = String(request.status || "").toLowerCase();
      if (normalized === "new" || normalized === "in-review" || normalized === "resolved") {
        counts[normalized] += 1;
      } else {
        counts.other += 1;
      }
      return counts;
    },
    { new: 0, "in-review": 0, resolved: 0, other: 0 }
  );

const getOrderSummary = (orders) =>
  orders.reduce(
    (summary, order) => {
      const amount = Number(order.totalAmount || 0);
      const paymentStatus = String(order.paymentStatus || "").toLowerCase();
      const subscriptionType = String(order.subscriptionType || "").toLowerCase();
      summary.totalOrders += 1;
      summary.totalRevenue += amount;
      if (paymentStatus === "paid") {
        summary.paidOrders += 1;
        summary.paidRevenue += amount;
      }
      if (paymentStatus === "pending") {
        summary.pendingPayments += 1;
      }
      if (subscriptionType === "subscription") {
        summary.subscriptionOrders += 1;
      } else {
        summary.oneTimeOrders += 1;
      }
      return summary;
    },
    {
      totalOrders: 0,
      totalRevenue: 0,
      paidOrders: 0,
      paidRevenue: 0,
      pendingPayments: 0,
      subscriptionOrders: 0,
      oneTimeOrders: 0,
    }
  );

const getSubscriptionSummary = (users) => {
  const dogParents = users.filter((user) => user.role !== "admin");
  const withSubscription = dogParents.filter((user) => {
    const status = String(user.subscription?.status || "").toLowerCase();
    return Boolean(user.subscription) && status !== "cancelled" && status !== "none";
  });
  const active = withSubscription.filter(
    (user) => String(user.subscription?.status || "").toLowerCase() === "active"
  );
  return {
    dogParents,
    withSubscription,
    activeCount: active.length,
    withCount: withSubscription.length,
    withoutCount: dogParents.length - withSubscription.length,
  };
};

const getDeliverySummary = (deliveryQueue) => {
  const now = Date.now();
  const sevenDaysAhead = now + 1000 * 60 * 60 * 24 * 7;
  const dueNow = deliveryQueue.filter((entry) => {
    const time = new Date(entry.nextDelivery).getTime();
    return Number.isFinite(time) && time <= now;
  }).length;
  const dueSoon = deliveryQueue.filter((entry) => {
    const time = new Date(entry.nextDelivery).getTime();
    return Number.isFinite(time) && time > now && time <= sevenDaysAhead;
  }).length;
  return { dueNow, dueSoon, queued: deliveryQueue.length };
};

const AdminDashboardPage = () => {
  const { logout, token, user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [users, setUsers] = useState([]);
  const [supportRequests, setSupportRequests] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState({ type: "", message: "" });
  const [updatingRequestId, setUpdatingRequestId] = useState("");
  const [activePanel, setActivePanel] = useState("dog-parents");

  useEffect(() => {
    let isActive = true;
    const load = async () => {
      setLoading(true);
      try {
        const response = await fetchAdminData(token);
        if (!isActive) return;
        setDashboard(response.dashboard);
        setUsers(response.users);
        setSupportRequests(response.supportRequests);
        setSubscribers(response.subscribers);
        setOrders(response.orders);
      } catch (error) {
        if (isActive) {
          setStatusMessage({ type: "error", message: error.message || "Admin data could not be loaded." });
        }
      } finally {
        if (isActive) setLoading(false);
      }
    };
    load();
    return () => {
      isActive = false;
    };
  }, [token]);

  const handleStatusChange = async (requestId, nextStatus) => {
    setUpdatingRequestId(requestId);
    setStatusMessage({ type: "", message: "" });
    try {
      const response = await apiRequest(`/admin/support-requests/${requestId}/status`, {
        method: "PATCH",
        token,
        body: { status: nextStatus },
      });
      setSupportRequests((currentRequests) =>
        currentRequests.map((request) => (request.id === requestId ? response.supportRequest : request))
      );
      setStatusMessage({ type: "success", message: response.message });
    } catch (error) {
      setStatusMessage({ type: "error", message: error.message || "Status could not be updated." });
    } finally {
      setUpdatingRequestId("");
    }
  };

  if (loading) {
    return (
      <main className="min-h-[70vh] bg-[#FBF8EF] px-6 py-16">
        <div className="mx-auto max-w-3xl rounded-[32px] border border-[#E6DFCF] bg-white px-8 py-14 text-center shadow-[0_24px_80px_rgba(34,30,18,0.08)]">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0F4A12]">Admin</p>
          <h1 className="mt-3 text-3xl font-semibold text-[#1A1A1A]">Loading care operations...</h1>
        </div>
      </main>
    );
  }

  if (!dashboard) {
    return (
      <main className="min-h-[70vh] bg-[#FBF8EF] px-6 py-16">
        <div className="mx-auto max-w-3xl rounded-[32px] border border-[#F3D3CC] bg-white px-8 py-14 text-center shadow-[0_24px_80px_rgba(34,30,18,0.08)]">
          <h1 className="text-3xl font-semibold text-[#1A1A1A]">Admin dashboard unavailable</h1>
          <p className="mt-3 text-sm leading-6 text-[#695B54]">
            {statusMessage.message || "We could not load the data right now."}
          </p>
        </div>
      </main>
    );
  }

  const supportCounts = getSupportStatusCounts(supportRequests);
  const orderSummary = getOrderSummary(orders);
  const billingSummary = orders.reduce(
    (summary, order) => {
      summary.totalShipping += Number(
        order.bill?.shippingAmount || order.pricing?.shippingAmount || 0
      );

      if (String(order.paymentStatus || "").toLowerCase() === "paid") {
        summary.paidBills += 1;
      }

      return summary;
    },
    {
      totalShipping: 0,
      paidBills: 0,
    }
  );
  const subscriptionSummary = getSubscriptionSummary(users);
  const dogParents = subscriptionSummary.dogParents;
  const withSubscription = subscriptionSummary.withSubscription;
  const withSubscriptionCount = subscriptionSummary.withCount;
  const withoutSubscriptionCount = subscriptionSummary.withoutCount;
  const activeSubscriptionCount = subscriptionSummary.activeCount;
  const deliveryQueue = Array.isArray(dashboard.deliveryQueue) ? dashboard.deliveryQueue : [];
  const deliverySummary = getDeliverySummary(deliveryQueue);
  const visibleSupport =
    activePanel === "open"
      ? supportRequests.filter((request) => request.status !== "resolved")
      : supportRequests;

  const cards = [
    { key: "dog-parents", label: "Dog parents", value: dogParents.length, helper: `${withSubscriptionCount} subscribed`, icon: Users },
    { key: "support", label: "Support tickets", value: supportRequests.length, helper: `${supportCounts.resolved} solved`, icon: ClipboardList },
    { key: "open", label: "Open tickets", value: supportRequests.filter((request) => request.status !== "resolved").length, helper: `${supportCounts["in-review"]} in review`, icon: CircleCheckBig },
    { key: "newsletter", label: "Newsletter tickets", value: subscribers.length, helper: "Latest signups", icon: Mail },
    { key: "orders", label: "Orders", value: orders.length, helper: formatCurrency(orderSummary.totalRevenue), icon: BadgeDollarSign },
    { key: "bill", label: "Bill", value: orders.length, helper: `${billingSummary.paidBills} paid`, icon: BadgeDollarSign },
    { key: "subscriptions", label: "Subscriptions", value: withSubscriptionCount, helper: `${activeSubscriptionCount} active`, icon: ShieldCheck },
    { key: "deliveries", label: "Deliveries due", value: deliverySummary.dueNow + deliverySummary.dueSoon, helper: `${deliverySummary.dueSoon} in 7 days`, icon: Truck },
  ];

  return (
    <main className="bg-[#FBF8EF] px-6 py-8 md:px-10 lg:px-16">
      <div className="mx-auto max-w-[1320px] space-y-6">
        <section className="rounded-[36px] bg-[#1A1A1A] p-8 text-white shadow-[0_32px_100px_rgba(18,18,18,0.22)] md:p-10">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#EBF466]">Admin control room</p>
              <h1 className="mt-4 text-4xl font-semibold leading-tight md:text-5xl">{user?.name}, click any card for full data.</h1>
            </div>
            <LoadingButton
              type="button"
              className="rounded-full border border-white/14 px-5 py-3 text-sm font-semibold text-white"
              lockOnClick
              loadingText="Signing out..."
              onClick={logout}
            >
              Sign out
            </LoadingButton>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => {
              const Icon = card.icon;
              const isActive = activePanel === card.key;
              return (
                <button
                  key={card.key}
                  type="button"
                  onClick={() => setActivePanel(card.key)}
                  className={`rounded-[28px] border p-5 text-left transition ${isActive ? "border-[#EBF466] bg-white/16" : "border-white/8 bg-white/6 hover:bg-white/10"}`}
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EBF466] text-[#1A1A1A]"><Icon size={20} /></div>
                  <p className="mt-4 text-sm text-white/72">{card.label}</p>
                  <h2 className="mt-1 text-2xl font-semibold">{card.value}</h2>
                  <p className="mt-1 text-xs font-medium uppercase tracking-[0.12em] text-white/65">{card.helper}</p>
                </button>
              );
            })}
          </div>
        </section>

        {statusMessage.message ? (
          <div className={`rounded-[28px] px-5 py-4 text-sm ${statusMessage.type === "success" ? "bg-[#EEF6E7] text-[#0F4A12]" : "bg-[#FFF1EE] text-[#A13A2C]"}`}>
            {statusMessage.message}
          </div>
        ) : null}

        <section className="rounded-[36px] border border-[#E6DFCF] bg-white p-8 shadow-[0_24px_80px_rgba(34,30,18,0.08)] md:p-10">
          <h2 className="text-3xl font-semibold text-[#1A1A1A]">
            {activePanel === "dog-parents" && "Dog parents data"}
            {activePanel === "support" && "Support tickets data"}
            {activePanel === "open" && "Open tickets data"}
            {activePanel === "newsletter" && "Newsletter subscribers"}
            {activePanel === "orders" && "Orders and revenue"}
            {activePanel === "bill" && "Bills and addresses"}
            {activePanel === "subscriptions" && "Subscription split"}
            {activePanel === "deliveries" && "Delivery queue"}
          </h2>

          {(activePanel === "support" || activePanel === "open") && (
            <div className="mt-6 grid gap-3 md:grid-cols-3">
              <div className="rounded-[20px] bg-[#FFF4D6] px-4 py-4"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8A5A09]">New</p><p className="mt-2 text-2xl font-semibold text-[#1A1A1A]">{supportCounts.new}</p></div>
              <div className="rounded-[20px] bg-[#E8F1FF] px-4 py-4"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#265A9A]">In review</p><p className="mt-2 text-2xl font-semibold text-[#1A1A1A]">{supportCounts["in-review"]}</p></div>
              <div className="rounded-[20px] bg-[#EAF7E9] px-4 py-4"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#1E6B2D]">Solved</p><p className="mt-2 text-2xl font-semibold text-[#1A1A1A]">{supportCounts.resolved}</p></div>
            </div>
          )}

          <div className="mt-6 space-y-3">
            {activePanel === "dog-parents" &&
              (dogParents.length > 0 ? dogParents.map((account) => (
                <article key={account.id} className="rounded-[24px] bg-[#FBF8EF] p-4">
                  <h3 className="text-lg font-semibold text-[#1A1A1A]">{account.name}</h3>
                  <p className="text-sm text-[#5F5B4F]">{account.email}</p>
                  <p className="mt-2 text-xs font-medium uppercase tracking-[0.12em] text-[#6A6458]">
                    {account.subscription?.planName || "No subscription"} | Next delivery: {formatDate(account.subscription?.nextDelivery)}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#5F5B4F]">
                    {formatDeliveryAddress(account.deliveryAddress) || "Delivery address not saved yet."}
                  </p>
                </article>
              )) : <p className="rounded-[24px] bg-[#FBF8EF] px-4 py-5 text-sm text-[#5F5B4F]">No dog-parent accounts yet.</p>)}

            {(activePanel === "support" || activePanel === "open") &&
              (visibleSupport.length > 0 ? visibleSupport.map((request) => (
                <article key={request.id} className="rounded-[24px] bg-[#FBF8EF] p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#0F4A12]">{request.team}</p>
                      <h3 className="mt-1 text-xl font-semibold text-[#1A1A1A]">{request.subject}</h3>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${statusTone[request.status] || "bg-[#EEE7D8] text-[#5B5448]"}`}>{request.status}</span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-[#5C584D]">{request.message}</p>
                  <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
                    <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#6A6458]">{request.email} | {formatDate(request.createdAt)}</p>
                    <select value={request.status} onChange={(event) => handleStatusChange(request.id, event.target.value)} disabled={updatingRequestId === request.id} className="rounded-full border border-[#D9D1BF] bg-white px-4 py-2 text-sm font-semibold text-[#1A1A1A] outline-none">
                      <option value="new">New</option>
                      <option value="in-review">In review</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </div>
                </article>
              )) : <p className="rounded-[24px] bg-[#FBF8EF] px-4 py-5 text-sm text-[#5F5B4F]">No tickets for this filter.</p>)}

            {activePanel === "newsletter" &&
              (subscribers.length > 0 ? subscribers.map((subscriber) => (
                <article key={subscriber.id} className="rounded-[24px] bg-[#FBF8EF] p-4">
                  <p className="font-semibold text-[#1A1A1A]">{subscriber.email}</p>
                  <p className="mt-1 text-xs font-medium uppercase tracking-[0.12em] text-[#6A6458]">{subscriber.source} | {formatDate(subscriber.createdAt)}</p>
                </article>
              )) : <p className="rounded-[24px] bg-[#FBF8EF] px-4 py-5 text-sm text-[#5F5B4F]">No subscribers yet.</p>)}

            {activePanel === "orders" && (
              <>
                <div className="grid gap-3 md:grid-cols-3">
                  <div className="rounded-[20px] bg-[#EEF6E7] px-4 py-4"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#1E6B2D]">Total orders</p><p className="mt-2 text-2xl font-semibold text-[#1A1A1A]">{orderSummary.totalOrders}</p></div>
                  <div className="rounded-[20px] bg-[#FFF4D6] px-4 py-4"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8A5A09]">Pending</p><p className="mt-2 text-2xl font-semibold text-[#1A1A1A]">{orderSummary.pendingPayments}</p></div>
                  <div className="rounded-[20px] bg-[#E8F1FF] px-4 py-4"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#265A9A]">Total value</p><p className="mt-2 text-2xl font-semibold text-[#1A1A1A]">{formatCurrency(orderSummary.totalRevenue)}</p></div>
                </div>
                {orders.length > 0 ? orders.map((order) => (
                  <article key={order.id} className="rounded-[24px] bg-[#FBF8EF] p-4">
                    <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#0F4A12]">{order.orderNumber}</p>
                    <h3 className="mt-1 text-lg font-semibold text-[#1A1A1A]">{order.customerName || "Guest customer"}</h3>
                    <p className="mt-2 text-xs font-medium uppercase tracking-[0.12em] text-[#6A6458]">
                      Amount: {formatCurrency(order.totalAmount, order.currency || "INR")} | Payment: {order.paymentStatus || "pending"} | Type: {order.subscriptionType || "one-time"}
                    </p>
                    {order.subscription ? (
                      <p className="mt-2 text-sm text-[#5F5B4F]">
                        {order.subscription.planName} | Cadence: {order.subscription.deliveryCadence} | Status: {order.subscription.status}
                      </p>
                    ) : null}
                    <p className="mt-2 text-sm leading-6 text-[#5F5B4F]">
                      Ship to: {formatDeliveryAddress(order.deliveryAddress) || "Delivery address not saved yet."}
                    </p>
                  </article>
                )) : <p className="rounded-[24px] bg-[#FBF8EF] px-4 py-5 text-sm text-[#5F5B4F]">No orders yet.</p>}
              </>
            )}

            {activePanel === "bill" && (
              <>
                <div className="grid gap-3 md:grid-cols-3">
                  <div className="rounded-[20px] bg-[#EEF6E7] px-4 py-4"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#1E6B2D]">Paid bills</p><p className="mt-2 text-2xl font-semibold text-[#1A1A1A]">{billingSummary.paidBills}</p></div>
                  <div className="rounded-[20px] bg-[#E8F1FF] px-4 py-4"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#265A9A]">Shipping total</p><p className="mt-2 text-2xl font-semibold text-[#1A1A1A]">{formatCurrency(billingSummary.totalShipping)}</p></div>
                  <div className="rounded-[20px] bg-[#FFF4D6] px-4 py-4"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8A5A09]">Average bill</p><p className="mt-2 text-2xl font-semibold text-[#1A1A1A]">{formatCurrency(orderSummary.totalOrders > 0 ? orderSummary.totalRevenue / orderSummary.totalOrders : 0)}</p></div>
                </div>
                {orders.length > 0 ? orders.map((order) => (
                  <article key={order.id} className="rounded-[24px] bg-[#FBF8EF] p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#0F4A12]">{order.orderNumber}</p>
                        <h3 className="mt-1 text-xl font-semibold text-[#1A1A1A]">{getBillType(order)}</h3>
                      </div>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#5B5448]">
                        {order.paymentStatus || "pending"}
                      </span>
                    </div>

                    <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_0.95fr]">
                      <div className="rounded-[20px] bg-white p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#0F4A12]">Bill to</p>
                        <p className="mt-2 text-lg font-semibold text-[#1A1A1A]">
                          {order.bill?.billedTo?.name || order.customerName || "Guest customer"}
                        </p>
                        <p className="mt-1 text-sm text-[#5F5B4F]">
                          {order.bill?.billedTo?.email || order.customerEmail || "Email not saved"}
                        </p>
                        <p className="mt-1 text-sm text-[#5F5B4F]">
                          {order.bill?.billedTo?.phone || "Phone not saved"}
                        </p>
                        <p className="mt-3 text-sm leading-6 text-[#5F5B4F]">
                          {formatDeliveryAddress(order.bill?.deliveryAddress || order.deliveryAddress) || "Delivery address not saved yet."}
                        </p>
                      </div>

                      <div className="rounded-[20px] bg-white p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#0F4A12]">Charges</p>
                        <div className="mt-3 space-y-2 text-sm text-[#5F5B4F]">
                          <div className="flex items-center justify-between">
                            <span>Subtotal</span>
                            <span className="font-semibold text-[#1A1A1A]">
                              {formatCurrency(order.bill?.subtotalAmount || order.pricing?.subtotalAmount || 0, order.currency || "INR")}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Shipping</span>
                            <span className="font-semibold text-[#1A1A1A]">
                              {formatCurrency(order.bill?.shippingAmount || order.pricing?.shippingAmount || 0, order.currency || "INR")}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Total</span>
                            <span className="font-semibold text-[#1A1A1A]">
                              {formatCurrency(order.bill?.totalAmount || order.totalAmount || 0, order.currency || "INR")}
                            </span>
                          </div>
                        </div>
                        <p className="mt-4 text-xs font-medium uppercase tracking-[0.12em] text-[#6A6458]">
                          Items: {(order.items || []).map((item) => `${item.name} x${item.quantity}`).join(", ") || "No items"}
                        </p>
                      </div>
                    </div>
                  </article>
                )) : <p className="rounded-[24px] bg-[#FBF8EF] px-4 py-5 text-sm text-[#5F5B4F]">No bills yet.</p>}
              </>
            )}

            {activePanel === "subscriptions" && (
              <>
                <div className="grid gap-3 md:grid-cols-3">
                  <div className="rounded-[20px] bg-[#EEF6E7] px-4 py-4"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#1E6B2D]">Active</p><p className="mt-2 text-2xl font-semibold text-[#1A1A1A]">{activeSubscriptionCount}</p></div>
                  <div className="rounded-[20px] bg-[#E8F1FF] px-4 py-4"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#265A9A]">With subscription</p><p className="mt-2 text-2xl font-semibold text-[#1A1A1A]">{withSubscriptionCount}</p></div>
                  <div className="rounded-[20px] bg-[#FFF4D6] px-4 py-4"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8A5A09]">Without subscription</p><p className="mt-2 text-2xl font-semibold text-[#1A1A1A]">{withoutSubscriptionCount}</p></div>
                </div>
                {withSubscription.map((account) => (
                  <article key={account.id} className="rounded-[24px] bg-[#FBF8EF] p-4">
                    <h3 className="text-lg font-semibold text-[#1A1A1A]">{account.name}</h3>
                    <p className="text-sm text-[#5F5B4F]">{account.email}</p>
                    <p className="mt-2 text-xs font-medium uppercase tracking-[0.12em] text-[#6A6458]">
                      {account.subscription?.planName || "Plan not set"} | Next delivery: {formatDate(account.subscription?.nextDelivery)}
                    </p>
                    <p className="mt-2 text-sm text-[#5F5B4F]">
                      Cadence: {account.subscription?.deliveryCadence || "Not set"} | Status: {account.subscription?.status || "none"}
                    </p>
                  </article>
                ))}
              </>
            )}

            {activePanel === "deliveries" && (
              <>
                <div className="grid gap-3 md:grid-cols-3">
                  <div className="rounded-[20px] bg-[#FFF4D6] px-4 py-4"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8A5A09]">Due now</p><p className="mt-2 text-2xl font-semibold text-[#1A1A1A]">{deliverySummary.dueNow}</p></div>
                  <div className="rounded-[20px] bg-[#E8F1FF] px-4 py-4"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#265A9A]">Due this week</p><p className="mt-2 text-2xl font-semibold text-[#1A1A1A]">{deliverySummary.dueSoon}</p></div>
                  <div className="rounded-[20px] bg-[#EEF6E7] px-4 py-4"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#1E6B2D]">Queue</p><p className="mt-2 text-2xl font-semibold text-[#1A1A1A]">{deliverySummary.queued}</p></div>
                </div>
                {deliveryQueue.length > 0 ? deliveryQueue.map((entry) => (
                  <article key={entry.id} className="rounded-[24px] bg-[#FBF8EF] p-4">
                    <h3 className="text-lg font-semibold text-[#1A1A1A]">{entry.name}</h3>
                    <p className="text-sm text-[#5F5B4F]">{entry.email}</p>
                    <p className="mt-2 text-xs font-medium uppercase tracking-[0.12em] text-[#6A6458]">
                      Dog: {entry.subscription?.dogProfile?.name || "Not set"} | Next delivery: {formatDate(entry.nextDelivery)}
                    </p>
                  </article>
                )) : <p className="rounded-[24px] bg-[#FBF8EF] px-4 py-5 text-sm text-[#5F5B4F]">Delivery queue is empty.</p>}
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default AdminDashboardPage;
