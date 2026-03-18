import { Link } from "@tanstack/react-router";
import { CheckCircle, Crown, Diamond, Star, Zap } from "lucide-react";
import { motion } from "motion/react";

const plans = [
  {
    tier: "Starter",
    icon: Star,
    price: "₹499",
    color: "#D4AF37",
    gradient:
      "linear-gradient(135deg, rgba(30,30,20,0.98), rgba(15,15,10,0.98))",
    border: "rgba(212,175,55,0.35)",
    badge: null,
    features: [
      "Direct Referral Income (10%)",
      "10 Level Downline Income",
      "Binary Matching Income",
      "Member Dashboard Access",
      "Referral Link & Tracking",
      "Email & Chat Support",
    ],
  },
  {
    tier: "Silver",
    icon: Zap,
    price: "₹999",
    color: "#C0C0C0",
    gradient:
      "linear-gradient(135deg, rgba(28,28,35,0.98), rgba(15,15,20,0.98))",
    border: "rgba(192,192,200,0.4)",
    badge: null,
    features: [
      "All Starter Benefits",
      "Enhanced Referral Rewards",
      "Priority Member Status",
      "Advanced Income Reports",
      "Silver Rank Rewards",
      "Priority Support",
    ],
  },
  {
    tier: "Gold",
    icon: Crown,
    price: "₹1,999",
    color: "#FFD700",
    gradient: "linear-gradient(135deg, rgba(38,30,8,0.99), rgba(22,17,5,0.99))",
    border: "#D4AF37",
    badge: "MOST POPULAR",
    features: [
      "All Silver Benefits",
      "Premium Direct Income",
      "Full Binary System Access",
      "Leadership Bonus Pool",
      "Gold Rank Status",
      "VIP Support & Training",
    ],
  },
  {
    tier: "Diamond",
    icon: Diamond,
    price: "₹2,999",
    color: "#a78bfa",
    gradient:
      "linear-gradient(135deg, rgba(20,10,35,0.99), rgba(12,6,22,0.99))",
    border: "rgba(167,139,250,0.5)",
    badge: "DIAMOND ELITE",
    features: [
      "All Gold Benefits",
      "Diamond Rank Bonus",
      "Global Royalty Pool",
      "Luxury Product Bundle",
      "Exclusive Events Access",
      "Dedicated Account Manager",
    ],
  },
];

export function ProductsPage() {
  return (
    <div style={{ background: "#0a0a0a", color: "#fff" }}>
      {/* Hero */}
      <section
        className="py-24 text-center relative"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(212,175,55,0.07), transparent 60%), #0a0a0a",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mx-auto px-4"
        >
          <div
            className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full"
            style={{
              background: "rgba(212,175,55,0.08)",
              border: "1px solid rgba(212,175,55,0.2)",
            }}
          >
            <span
              style={{
                color: "#D4AF37",
                fontSize: "11px",
                letterSpacing: "0.15em",
                fontWeight: 600,
              }}
            >
              MEMBERSHIP PLANS
            </span>
          </div>
          <h1
            className="font-display font-bold mb-4"
            style={{
              fontSize: "clamp(36px, 6vw, 66px)",
              background:
                "linear-gradient(135deg, #D4AF37, #FFD700 50%, #B8960C)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Our Products
          </h1>
          <div
            style={{
              width: "80px",
              height: "3px",
              background: "linear-gradient(90deg, #D4AF37, #FFD700)",
              margin: "0 auto 20px",
            }}
          />
          <p
            style={{
              color: "rgba(255,255,255,0.55)",
              fontSize: "17px",
              lineHeight: 1.7,
            }}
          >
            Choose the plan that matches your ambition. Every plan includes
            direct income, binary income, and 10-level downline rewards.
          </p>
        </motion.div>
      </section>

      {/* Plans Grid */}
      <section style={{ padding: "60px 0 100px" }}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan, i) => {
              const Icon = plan.icon;
              return (
                <motion.div
                  key={plan.tier}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="relative rounded-2xl p-7 flex flex-col"
                  style={{
                    background: plan.gradient,
                    border: `1px solid ${plan.border}`,
                    boxShadow:
                      plan.badge === "MOST POPULAR"
                        ? "0 0 40px rgba(212,175,55,0.12)"
                        : "0 4px 24px rgba(0,0,0,0.4)",
                  }}
                >
                  {plan.badge && (
                    <div
                      className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold"
                      style={{
                        background:
                          plan.badge === "DIAMOND ELITE"
                            ? "linear-gradient(135deg, #7c3aed, #9f67fa)"
                            : "linear-gradient(135deg, #D4AF37, #FFD700)",
                        color:
                          plan.badge === "DIAMOND ELITE" ? "#fff" : "#0a0a0a",
                        letterSpacing: "0.08em",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {plan.badge}
                    </div>
                  )}

                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center mb-5"
                    style={{
                      background: `rgba(${plan.color === "#D4AF37" ? "212,175,55" : plan.color === "#FFD700" ? "255,215,0" : plan.color === "#C0C0C0" ? "192,192,192" : "167,139,250"},0.12)`,
                      border: `1px solid ${plan.border}`,
                    }}
                  >
                    <Icon size={24} style={{ color: plan.color }} />
                  </div>

                  <div
                    style={{
                      color: "rgba(255,255,255,0.4)",
                      fontSize: "12px",
                      letterSpacing: "0.08em",
                    }}
                  >
                    {plan.tier} Plan
                  </div>
                  <div
                    className="font-display font-bold text-3xl my-1"
                    style={{ color: plan.color }}
                  >
                    {plan.price}
                  </div>
                  <div
                    style={{
                      color: "rgba(255,255,255,0.3)",
                      fontSize: "12px",
                      marginBottom: "20px",
                    }}
                  >
                    One-time activation
                  </div>

                  <ul className="space-y-3 flex-1 mb-7">
                    {plan.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-2.5 text-sm"
                        style={{ color: "rgba(255,255,255,0.7)" }}
                      >
                        <CheckCircle
                          size={14}
                          style={{
                            color: plan.color,
                            flexShrink: 0,
                            marginTop: "2px",
                          }}
                        />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Link to="/register" data-ocid="products.primary_button">
                    <button
                      type="button"
                      style={{
                        width: "100%",
                        background:
                          plan.badge === "MOST POPULAR"
                            ? "linear-gradient(135deg, #D4AF37, #FFD700)"
                            : "transparent",
                        color:
                          plan.badge === "MOST POPULAR"
                            ? "#0a0a0a"
                            : plan.color,
                        border: `1px solid ${plan.border}`,
                        padding: "11px 0",
                        borderRadius: "24px",
                        fontWeight: 700,
                        fontSize: "14px",
                        cursor: "pointer",
                        letterSpacing: "0.05em",
                        transition: "all 0.2s",
                      }}
                    >
                      Get {plan.tier} Plan
                    </button>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
