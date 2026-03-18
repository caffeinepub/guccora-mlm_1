import { Link } from "@tanstack/react-router";
import {
  ChevronDown,
  ChevronUp,
  Crown,
  Network,
  TrendingUp,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

const levelData = [
  { level: 1, pct: "10%", desc: "Your direct referrals" },
  { level: 2, pct: "5%", desc: "Referrals of your referrals" },
  { level: 3, pct: "4%", desc: "3rd tier network" },
  { level: 4, pct: "3%", desc: "4th tier network" },
  { level: 5, pct: "2%", desc: "5th tier network" },
  { level: 6, pct: "2%", desc: "6th tier network" },
  { level: 7, pct: "1%", desc: "7th tier network" },
  { level: 8, pct: "1%", desc: "8th tier network" },
  { level: 9, pct: "1%", desc: "9th tier network" },
  { level: 10, pct: "1%", desc: "10th tier network" },
];

const faqs = [
  {
    q: "How does the binary system work?",
    a: "In the binary system, you place members in two legs — Left and Right. When both legs have sales volume, you earn a matching bonus of 10% on the weaker leg's volume, rewarding balanced team building.",
  },
  {
    q: "When is income paid out?",
    a: "Direct referral income is credited instantly when a new member joins under you. Level income is distributed within 24 hours. Withdrawal requests are processed within 2-3 business days after admin approval.",
  },
  {
    q: "Can I upgrade my plan later?",
    a: "Yes! You can upgrade from Starter Wellness Kit → Smart Growth Kit → Premium Success Kit → Royal Leader Kit at any time. You only pay the price difference. For example, upgrading from ₹499 to ₹999 costs just ₹500.",
  },
  {
    q: "Is there a minimum withdrawal amount?",
    a: "The minimum withdrawal is ₹500. You can withdraw to any registered bank account or UPI ID. Make sure your bank details are updated in the dashboard.",
  },
  {
    q: "How do I add money to my wallet?",
    a: "You can recharge your wallet via UPI transfer or bank transfer. Submit the recharge request with your UTR number in the Wallet section. Admin approves within a few hours.",
  },
];

export function BusinessPlanPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div style={{ background: "#0a0a0a", color: "#fff" }}>
      {/* Hero */}
      <section
        className="py-24 text-center"
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
              COMPENSATION PLAN
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
            GUCCORA Business Plan
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
            Four powerful income streams designed to reward both action and team
            building.
          </p>
        </motion.div>
      </section>

      {/* Income Types */}
      <section style={{ background: "#0d0d0d", padding: "80px 0" }}>
        <div className="max-w-5xl mx-auto px-4">
          <h2
            className="font-display font-bold text-center mb-12"
            style={{
              fontSize: "clamp(26px, 4vw, 40px)",
              background:
                "linear-gradient(135deg, #fff, rgba(255,255,255,0.75))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Income Types
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: Users,
                title: "Direct Referral Income",
                reward: "10% of Plan Price",
                desc: "Every time someone joins under your referral link and activates a plan, you instantly earn 10% of their plan value. No waiting, no delays — instant credit.",
                example:
                  "Example: Someone joins on ₹1,999 Premium Success Kit → You earn ₹199.90",
              },
              {
                icon: TrendingUp,
                title: "Level Income",
                reward: "Up to 10 Levels Deep",
                desc: "When anyone in your downline — up to 10 levels deep — joins or activates a plan, you earn a percentage. This creates truly passive, compounding income.",
                example:
                  "Example: Level 1 earns 10%, Level 2 earns 5%, down to Level 10 at 1%",
              },
              {
                icon: Network,
                title: "Binary Matching Income",
                reward: "10% on Weaker Leg",
                desc: "Build two legs — left and right. Each time both sides generate matching volume, you earn a 10% matching bonus. Balancing your team maximizes this income.",
                example:
                  "Example: Left leg ₹5,000 + Right leg ₹5,000 → You earn ₹500 matching",
              },
              {
                icon: Crown,
                title: "Rank & Bonus Income",
                reward: "Special Rank Rewards",
                desc: "Achieve Smart Growth Kit, Premium Success Kit, or Royal Leader Kit rank to unlock exclusive bonus pools, luxury rewards, event invitations, and performance-based incentives from GUCCORA leadership.",
                example:
                  "Example: Royal Leader Kit rank members share in the Global Royalty Pool monthly",
              },
            ].map(({ icon: Icon, title, reward, desc, example }) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="p-7 rounded-2xl"
                style={{
                  background: "rgba(212,175,55,0.04)",
                  border: "1px solid rgba(212,175,55,0.15)",
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center"
                    style={{
                      background: "rgba(212,175,55,0.1)",
                      border: "1px solid rgba(212,175,55,0.25)",
                    }}
                  >
                    <Icon size={20} style={{ color: "#D4AF37" }} />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-white text-lg">
                      {title}
                    </h3>
                    <div
                      style={{
                        background: "linear-gradient(135deg, #D4AF37, #FFD700)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        fontWeight: 700,
                        fontSize: "13px",
                      }}
                    >
                      {reward}
                    </div>
                  </div>
                </div>
                <p
                  style={{
                    color: "rgba(255,255,255,0.55)",
                    fontSize: "14px",
                    lineHeight: 1.7,
                    marginBottom: "12px",
                  }}
                >
                  {desc}
                </p>
                <div
                  className="rounded-xl p-3 text-xs"
                  style={{
                    background: "rgba(212,175,55,0.06)",
                    color: "rgba(212,175,55,0.8)",
                    fontStyle: "italic",
                  }}
                >
                  {example}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Level Income Table */}
      <section style={{ background: "#0a0a0a", padding: "80px 0" }}>
        <div className="max-w-4xl mx-auto px-4">
          <h2
            className="font-display font-bold text-center mb-10"
            style={{
              fontSize: "clamp(26px, 4vw, 40px)",
              background:
                "linear-gradient(135deg, #fff, rgba(255,255,255,0.75))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            10-Level Income Table
          </h2>
          <div
            className="rounded-2xl overflow-hidden"
            style={{ border: "1px solid rgba(212,175,55,0.2)" }}
          >
            <div
              className="grid grid-cols-3 px-6 py-3 text-xs font-semibold"
              style={{
                background: "rgba(212,175,55,0.1)",
                color: "#D4AF37",
                letterSpacing: "0.08em",
              }}
            >
              <span>LEVEL</span>
              <span className="text-center">COMMISSION</span>
              <span className="text-right">DESCRIPTION</span>
            </div>
            {levelData.map((row, i) => (
              <div
                key={row.level}
                className="grid grid-cols-3 px-6 py-4 items-center"
                style={{
                  background:
                    i % 2 === 0 ? "rgba(255,255,255,0.015)" : "transparent",
                  borderTop: "1px solid rgba(212,175,55,0.07)",
                }}
              >
                <div
                  style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px" }}
                >
                  Level {row.level}
                </div>
                <div
                  className="text-center font-display font-bold text-xl"
                  style={{
                    background: "linear-gradient(135deg, #D4AF37, #FFD700)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {row.pct}
                </div>
                <div
                  className="text-right"
                  style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px" }}
                >
                  {row.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: "#0d0d0d", padding: "80px 0" }}>
        <div className="max-w-3xl mx-auto px-4">
          <h2
            className="font-display font-bold text-center mb-10"
            style={{
              fontSize: "clamp(26px, 4vw, 40px)",
              background:
                "linear-gradient(135deg, #fff, rgba(255,255,255,0.75))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={faq.q}
                className="rounded-2xl overflow-hidden"
                style={{ border: "1px solid rgba(212,175,55,0.15)" }}
              >
                <button
                  type="button"
                  className="w-full flex items-center justify-between px-6 py-5 text-left"
                  style={{
                    background:
                      openFaq === i
                        ? "rgba(212,175,55,0.06)"
                        : "rgba(212,175,55,0.02)",
                    border: "none",
                    cursor: "pointer",
                    color: "#fff",
                  }}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  data-ocid="business_plan.toggle"
                >
                  <span style={{ fontWeight: 600, fontSize: "15px" }}>
                    {faq.q}
                  </span>
                  {openFaq === i ? (
                    <ChevronUp
                      size={18}
                      style={{ color: "#D4AF37", flexShrink: 0 }}
                    />
                  ) : (
                    <ChevronDown
                      size={18}
                      style={{ color: "rgba(212,175,55,0.5)", flexShrink: 0 }}
                    />
                  )}
                </button>
                {openFaq === i && (
                  <div
                    className="px-6 pb-5"
                    style={{
                      background: "rgba(212,175,55,0.03)",
                      color: "rgba(255,255,255,0.55)",
                      fontSize: "14px",
                      lineHeight: 1.75,
                    }}
                  >
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "80px 0" }}>
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2
            className="font-display font-bold text-3xl mb-4"
            style={{ color: "#D4AF37" }}
          >
            Ready to Start Earning?
          </h2>
          <p className="mb-8" style={{ color: "rgba(255,255,255,0.5)" }}>
            Join GUCCORA today with as little as ₹499 and start building your
            income streams.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" data-ocid="business_plan.primary_button">
              <button
                type="button"
                style={{
                  background: "linear-gradient(135deg, #D4AF37, #FFD700)",
                  color: "#0a0a0a",
                  border: "none",
                  padding: "13px 36px",
                  borderRadius: "32px",
                  fontWeight: 700,
                  fontSize: "15px",
                  cursor: "pointer",
                }}
              >
                Join Now
              </button>
            </Link>
            <Link to="/products" data-ocid="business_plan.secondary_button">
              <button
                type="button"
                style={{
                  background: "transparent",
                  color: "#D4AF37",
                  border: "1px solid rgba(212,175,55,0.45)",
                  padding: "13px 36px",
                  borderRadius: "32px",
                  fontWeight: 600,
                  fontSize: "15px",
                  cursor: "pointer",
                }}
              >
                View Products
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
