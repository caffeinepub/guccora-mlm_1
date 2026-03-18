import { Link } from "@tanstack/react-router";
import {
  Award,
  ChevronRight,
  Crown,
  Diamond,
  Globe,
  Network,
  Shield,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

// Scroll-reveal hook
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function Section({
  children,
  className = "",
}: { children: React.ReactNode; className?: string }) {
  const { ref, visible } = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: "opacity 0.7s ease, transform 0.7s ease",
      }}
    >
      {children}
    </div>
  );
}

const plans = [
  {
    name: "Starter Wellness Kit",
    price: "₹499",
    desc: "Begin your wealth journey",
    features: [
      "Direct Referral Income",
      "10 Level Income",
      "Binary Income",
      "Team Support",
    ],
    badge: null,
    gradient:
      "linear-gradient(135deg, rgba(30,30,30,0.95), rgba(20,20,20,0.95))",
    border: "rgba(212,175,55,0.3)",
  },
  {
    name: "Smart Growth Kit",
    price: "₹999",
    desc: "Accelerate your growth",
    features: [
      "Direct Referral Income",
      "10 Level Income",
      "Binary Income",
      "Higher Rewards",
      "Priority Support",
    ],
    badge: null,
    gradient:
      "linear-gradient(135deg, rgba(35,35,40,0.95), rgba(20,20,25,0.95))",
    border: "rgba(180,180,200,0.35)",
  },
  {
    name: "Premium Success Kit",
    price: "₹1,999",
    desc: "The premium choice",
    features: [
      "All Silver Benefits",
      "Premium Direct Income",
      "Full Binary System",
      "Leadership Bonus",
      "VIP Support",
    ],
    badge: "MOST POPULAR",
    gradient:
      "linear-gradient(135deg, rgba(40,32,10,0.97), rgba(25,20,5,0.97))",
    border: "#D4AF37",
  },
  {
    name: "Royal Leader Kit",
    price: "₹2,999",
    desc: "Maximum rewards & status",
    features: [
      "All Gold Benefits",
      "Diamond Rank Bonus",
      "Global Royalty Pool",
      "Luxury Rewards",
      "Exclusive Events",
    ],
    badge: "DIAMOND ELITE",
    gradient:
      "linear-gradient(135deg, rgba(20,10,35,0.97), rgba(15,8,25,0.97))",
    border: "rgba(180,120,255,0.5)",
  },
];

const stats = [
  { value: "10,000+", label: "Members" },
  { value: "₹50L+", label: "Paid Out" },
  { value: "4", label: "Countries" },
  { value: "5 Yrs", label: "Established" },
];

const incomeStreams = [
  {
    icon: Users,
    title: "Direct Referral Income",
    percent: "10%",
    desc: "Earn 10% direct commission every time someone joins under your referral link.",
  },
  {
    icon: TrendingUp,
    title: "Level Income",
    percent: "Up to 10 Levels",
    desc: "Earn from 10 levels of your downline — maximum passive income depth.",
  },
  {
    icon: Network,
    title: "Binary Matching Income",
    percent: "10% Match",
    desc: "Build left and right legs. Earn matching bonus on weaker leg volume.",
  },
];

const testimonials = [
  {
    name: "Rahul Sharma",
    location: "Mumbai",
    text: "GUCCORA transformed my financial life. In just 6 months I earned more than my annual salary. Truly life-changing!",
    plan: "Diamond",
    initials: "RS",
  },
  {
    name: "Priya Nair",
    location: "Kerala",
    text: "The binary income system is brilliant. My team of 200+ members generates passive income every single day.",
    plan: "Gold",
    initials: "PN",
  },
  {
    name: "Amit Patel",
    location: "Gujarat",
    text: "Best MLM platform in India. Transparent, fair, and the support team is incredible. 100% recommended!",
    plan: "Silver",
    initials: "AP",
  },
];

const PARTICLES = [
  { id: "p1", size: 2, left: "5%", top: "15%", dur: 4, delay: 0 },
  { id: "p2", size: 3, left: "15%", top: "30%", dur: 6, delay: 1 },
  { id: "p3", size: 2, left: "25%", top: "60%", dur: 5, delay: 2 },
  { id: "p4", size: 1, left: "35%", top: "20%", dur: 7, delay: 0.5 },
  { id: "p5", size: 3, left: "45%", top: "75%", dur: 4, delay: 1.5 },
  { id: "p6", size: 2, left: "55%", top: "10%", dur: 6, delay: 3 },
  { id: "p7", size: 1, left: "65%", top: "45%", dur: 5, delay: 0.8 },
  { id: "p8", size: 3, left: "75%", top: "80%", dur: 7, delay: 2.2 },
  { id: "p9", size: 2, left: "85%", top: "25%", dur: 4, delay: 1.2 },
  { id: "p10", size: 1, left: "92%", top: "55%", dur: 6, delay: 3.5 },
  { id: "p11", size: 2, left: "10%", top: "85%", dur: 5, delay: 0.3 },
  { id: "p12", size: 3, left: "20%", top: "42%", dur: 4, delay: 2.8 },
  { id: "p13", size: 1, left: "30%", top: "92%", dur: 7, delay: 1.8 },
  { id: "p14", size: 2, left: "40%", top: "5%", dur: 5, delay: 0.7 },
  { id: "p15", size: 3, left: "50%", top: "50%", dur: 6, delay: 4 },
  { id: "p16", size: 1, left: "60%", top: "70%", dur: 4, delay: 2.5 },
  { id: "p17", size: 2, left: "70%", top: "35%", dur: 7, delay: 1 },
  { id: "p18", size: 1, left: "80%", top: "65%", dur: 5, delay: 3.2 },
  { id: "p19", size: 3, left: "88%", top: "90%", dur: 4, delay: 0.4 },
  { id: "p20", size: 2, left: "95%", top: "40%", dur: 6, delay: 2 },
];
export function LandingPage() {
  return (
    <div style={{ background: "#0a0a0a", color: "#fff" }}>
      {/* ======= HERO ======= */}
      <section
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse at 50% 60%, rgba(212,175,55,0.07) 0%, transparent 65%), #0a0a0a",
        }}
      >
        {/* Floating gold orbs */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 500,
            height: 500,
            left: "-150px",
            top: "-100px",
            background:
              "radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 70%)",
            animation: "pulse 6s ease-in-out infinite",
          }}
        />
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 400,
            height: 400,
            right: "-100px",
            bottom: "50px",
            background:
              "radial-gradient(circle, rgba(212,175,55,0.05) 0%, transparent 70%)",
            animation: "pulse 8s ease-in-out infinite reverse",
          }}
        />
        {/* Gold particle dots */}
        {PARTICLES.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: p.size,
              height: p.size,
              left: p.left,
              top: p.top,
              background: "rgba(212,175,55,0.4)",
              animation: `twinkle ${p.dur}s ease-in-out infinite`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="relative z-10 text-center px-4 max-w-5xl mx-auto"
        >
          {/* Crown badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 mb-8 px-5 py-2 rounded-full"
            style={{
              background: "rgba(212,175,55,0.1)",
              border: "1px solid rgba(212,175,55,0.35)",
            }}
          >
            <Crown size={14} style={{ color: "#D4AF37" }} />
            <span
              style={{
                color: "#D4AF37",
                fontSize: "12px",
                letterSpacing: "0.15em",
                fontWeight: 600,
              }}
            >
              PREMIUM NETWORK MARKETING
            </span>
          </motion.div>

          <h1
            className="font-display font-bold leading-none mb-6"
            style={{ fontSize: "clamp(56px, 10vw, 120px" }}
          >
            <span
              className="block"
              style={{
                background:
                  "linear-gradient(135deg, #D4AF37 0%, #FFD700 40%, #D4AF37 70%, #B8960C 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Build Wealth.
            </span>
            <span
              className="block"
              style={{
                background:
                  "linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.85) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Build Legacy.
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="mx-auto mb-10 text-lg"
            style={{
              color: "rgba(255,255,255,0.6)",
              maxWidth: "580px",
              lineHeight: 1.7,
            }}
          >
            Join GUCCORA's exclusive network and unlock financial freedom
            through our proven MLM system with binary income, direct referrals,
            and 10-level rewards.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/register" data-ocid="hero.primary_button">
              <button
                type="button"
                style={{
                  background: "linear-gradient(135deg, #D4AF37, #FFD700)",
                  color: "#0a0a0a",
                  border: "none",
                  padding: "14px 36px",
                  borderRadius: "32px",
                  fontWeight: 700,
                  fontSize: "16px",
                  cursor: "pointer",
                  letterSpacing: "0.06em",
                  boxShadow: "0 0 30px rgba(212,175,55,0.35)",
                  transition: "all 0.25s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow =
                    "0 0 50px rgba(212,175,55,0.6)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow =
                    "0 0 30px rgba(212,175,55,0.35)";
                }}
              >
                Join Now
              </button>
            </Link>
            <Link to="/business-plan" data-ocid="hero.secondary_button">
              <button
                type="button"
                style={{
                  background: "transparent",
                  color: "#D4AF37",
                  border: "1px solid rgba(212,175,55,0.5)",
                  padding: "13px 36px",
                  borderRadius: "32px",
                  fontWeight: 600,
                  fontSize: "16px",
                  cursor: "pointer",
                  letterSpacing: "0.04em",
                  transition: "all 0.25s",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor =
                    "#D4AF37";
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "rgba(212,175,55,0.08)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor =
                    "rgba(212,175,55,0.5)";
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "transparent";
                }}
              >
                View Business Plan <ChevronRight size={16} />
              </button>
            </Link>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.7 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-20 max-w-2xl mx-auto"
          >
            {stats.map((s) => (
              <div key={s.value} className="text-center">
                <div
                  className="font-display font-bold text-2xl"
                  style={{
                    background: "linear-gradient(135deg, #D4AF37, #FFD700)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {s.value}
                </div>
                <div
                  style={{
                    color: "rgba(255,255,255,0.45)",
                    fontSize: "12px",
                    marginTop: "2px",
                    letterSpacing: "0.08em",
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{
            height: "120px",
            background: "linear-gradient(transparent, #0a0a0a)",
          }}
        />
      </section>

      {/* ======= COMPANY INTRO ======= */}
      <section style={{ background: "#0d0d0d", padding: "100px 0" }}>
        <div className="max-w-6xl mx-auto px-4">
          <Section>
            <div className="text-center mb-14">
              <div
                className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full"
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
                  WHY CHOOSE US
                </span>
              </div>
              <h2
                className="font-display font-bold mb-4"
                style={{
                  fontSize: "clamp(32px, 5vw, 52px)",
                  background:
                    "linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.75) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Why Choose GUCCORA?
              </h2>
              <p
                style={{
                  color: "rgba(255,255,255,0.5)",
                  maxWidth: "520px",
                  margin: "0 auto",
                  lineHeight: 1.7,
                }}
              >
                We combine luxury with opportunity. GUCCORA offers a
                transparent, proven system for building real wealth.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: Globe,
                  title: "Global Network",
                  desc: "4 countries, 10,000+ active members. Our network spans across borders giving you unlimited income potential.",
                },
                {
                  icon: Shield,
                  title: "Proven System",
                  desc: "5 years of transparent operations. Automated income distribution. Every rupee tracked and paid on time.",
                },
                {
                  icon: Award,
                  title: "Luxury Rewards",
                  desc: "Exclusive bonuses, luxury product bundles, rank rewards, and VIP events for our top performers.",
                },
              ].map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="p-8 rounded-2xl transition-all duration-300"
                  style={{
                    background: "rgba(212,175,55,0.04)",
                    border: "1px solid rgba(212,175,55,0.15)",
                    backdropFilter: "blur(8px)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.border =
                      "1px solid rgba(212,175,55,0.4)";
                    (e.currentTarget as HTMLDivElement).style.transform =
                      "translateY(-4px)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.border =
                      "1px solid rgba(212,175,55,0.15)";
                    (e.currentTarget as HTMLDivElement).style.transform =
                      "translateY(0)";
                  }}
                >
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center mb-5"
                    style={{
                      background: "rgba(212,175,55,0.1)",
                      border: "1px solid rgba(212,175,55,0.25)",
                    }}
                  >
                    <Icon size={24} style={{ color: "#D4AF37" }} />
                  </div>
                  <h3
                    className="font-display font-bold text-xl mb-3"
                    style={{ color: "#fff" }}
                  >
                    {title}
                  </h3>
                  <p
                    style={{
                      color: "rgba(255,255,255,0.5)",
                      lineHeight: 1.7,
                      fontSize: "14px",
                    }}
                  >
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </Section>
        </div>
      </section>

      {/* ======= PACKAGES ======= */}
      <section style={{ background: "#0a0a0a", padding: "100px 0" }}>
        <div className="max-w-6xl mx-auto px-4">
          <Section>
            <div className="text-center mb-14">
              <div
                className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full"
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
              <h2
                className="font-display font-bold"
                style={{
                  fontSize: "clamp(32px, 5vw, 52px)",
                  background:
                    "linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.75) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Our Exclusive Packages
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className="relative rounded-2xl p-6 flex flex-col transition-all duration-300"
                  style={{
                    background: plan.gradient,
                    border: `1px solid ${plan.border}`,
                    boxShadow:
                      plan.badge === "MOST POPULAR"
                        ? "0 0 40px rgba(212,175,55,0.15)"
                        : "0 4px 24px rgba(0,0,0,0.4)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.transform =
                      "translateY(-6px)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.transform =
                      "translateY(0)";
                  }}
                >
                  {plan.badge && (
                    <div
                      className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold"
                      style={{
                        background:
                          plan.badge === "DIAMOND ELITE"
                            ? "linear-gradient(135deg, #7c3aed, #9f67fa)"
                            : "linear-gradient(135deg, #D4AF37, #FFD700)",
                        color:
                          plan.badge === "DIAMOND ELITE" ? "#fff" : "#0a0a0a",
                        whiteSpace: "nowrap",
                        letterSpacing: "0.08em",
                      }}
                    >
                      {plan.badge}
                    </div>
                  )}
                  <div
                    className="mb-1"
                    style={{
                      color: "rgba(255,255,255,0.5)",
                      fontSize: "12px",
                      letterSpacing: "0.1em",
                    }}
                  >
                    {plan.desc}
                  </div>
                  <div
                    className="font-display font-bold text-2xl mb-1"
                    style={{
                      background: "linear-gradient(135deg, #D4AF37, #FFD700)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {plan.name}
                  </div>
                  <div
                    className="font-display font-bold text-3xl mb-5"
                    style={{ color: "#fff" }}
                  >
                    {plan.price}
                  </div>
                  <ul className="space-y-2 flex-1 mb-6">
                    {plan.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-center gap-2 text-sm"
                        style={{ color: "rgba(255,255,255,0.7)" }}
                      >
                        <Star
                          size={12}
                          style={{ color: "#D4AF37", flexShrink: 0 }}
                        />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link to="/register" data-ocid="packages.primary_button">
                    <button
                      type="button"
                      style={{
                        width: "100%",
                        background: "linear-gradient(135deg, #D4AF37, #FFD700)",
                        color: "#0a0a0a",
                        border: "none",
                        padding: "10px 0",
                        borderRadius: "24px",
                        fontWeight: 700,
                        fontSize: "14px",
                        cursor: "pointer",
                        letterSpacing: "0.05em",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.boxShadow =
                          "0 0 20px rgba(212,175,55,0.4)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.boxShadow =
                          "none";
                      }}
                    >
                      Get Started
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          </Section>
        </div>
      </section>

      {/* ======= INCOME PLAN ======= */}
      <section style={{ background: "#0d0d0d", padding: "100px 0" }}>
        <div className="max-w-5xl mx-auto px-4">
          <Section>
            <div className="text-center mb-14">
              <div
                className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full"
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
                  INCOME SYSTEM
                </span>
              </div>
              <h2
                className="font-display font-bold"
                style={{
                  fontSize: "clamp(32px, 5vw, 52px)",
                  background:
                    "linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.75) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Multiple Income Streams
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {incomeStreams.map(({ icon: Icon, title, percent, desc }) => (
                <div
                  key={title}
                  className="p-7 rounded-2xl text-center"
                  style={{
                    background: "rgba(212,175,55,0.04)",
                    border: "1px solid rgba(212,175,55,0.15)",
                  }}
                >
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{
                      background: "rgba(212,175,55,0.1)",
                      border: "1px solid rgba(212,175,55,0.25)",
                    }}
                  >
                    <Icon size={24} style={{ color: "#D4AF37" }} />
                  </div>
                  <div
                    className="font-display font-bold text-2xl mb-1"
                    style={{
                      background: "linear-gradient(135deg, #D4AF37, #FFD700)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {percent}
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-2 text-white">
                    {title}
                  </h3>
                  <p
                    style={{
                      color: "rgba(255,255,255,0.5)",
                      fontSize: "14px",
                      lineHeight: 1.6,
                    }}
                  >
                    {desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Level income table */}
            <div
              className="rounded-2xl overflow-hidden"
              style={{ border: "1px solid rgba(212,175,55,0.2)" }}
            >
              <div
                className="px-6 py-4"
                style={{
                  background: "rgba(212,175,55,0.08)",
                  borderBottom: "1px solid rgba(212,175,55,0.2)",
                }}
              >
                <h3
                  className="font-display font-bold text-lg"
                  style={{ color: "#D4AF37" }}
                >
                  Level Income Distribution
                </h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5">
                {[
                  { level: "Level 1", pct: "10%" },
                  { level: "Level 2", pct: "5%" },
                  { level: "Level 3", pct: "4%" },
                  { level: "Level 4", pct: "3%" },
                  { level: "Level 5", pct: "2%" },
                  { level: "Level 6", pct: "2%" },
                  { level: "Level 7", pct: "1%" },
                  { level: "Level 8", pct: "1%" },
                  { level: "Level 9", pct: "1%" },
                  { level: "Level 10", pct: "1%" },
                ].map(({ level, pct }) => (
                  <div
                    key={level}
                    className="p-4 text-center"
                    style={{
                      borderRight: "1px solid rgba(212,175,55,0.1)",
                      borderBottom: "1px solid rgba(212,175,55,0.1)",
                    }}
                  >
                    <div
                      style={{
                        color: "rgba(255,255,255,0.45)",
                        fontSize: "11px",
                        marginBottom: "4px",
                      }}
                    >
                      {level}
                    </div>
                    <div
                      className="font-display font-bold text-lg"
                      style={{
                        background: "linear-gradient(135deg, #D4AF37, #FFD700)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      {pct}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Section>
        </div>
      </section>

      {/* ======= TESTIMONIALS ======= */}
      <section style={{ background: "#0a0a0a", padding: "100px 0" }}>
        <div className="max-w-5xl mx-auto px-4">
          <Section>
            <div className="text-center mb-14">
              <div
                className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full"
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
                  SUCCESS STORIES
                </span>
              </div>
              <h2
                className="font-display font-bold"
                style={{
                  fontSize: "clamp(32px, 5vw, 52px)",
                  background:
                    "linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.75) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                What Our Members Say
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t) => (
                <div
                  key={t.name}
                  className="p-7 rounded-2xl"
                  style={{
                    background: "rgba(212,175,55,0.04)",
                    border: "1px solid rgba(212,175,55,0.12)",
                  }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center font-display font-bold text-sm"
                      style={{
                        background: "linear-gradient(135deg, #D4AF37, #FFD700)",
                        color: "#0a0a0a",
                      }}
                    >
                      {t.initials}
                    </div>
                    <div>
                      <div className="font-semibold text-white text-sm">
                        {t.name}
                      </div>
                      <div
                        style={{
                          color: "rgba(255,255,255,0.4)",
                          fontSize: "12px",
                        }}
                      >
                        {t.location} · {t.plan} Member
                      </div>
                    </div>
                  </div>
                  <p
                    style={{
                      color: "rgba(255,255,255,0.6)",
                      fontSize: "14px",
                      lineHeight: 1.7,
                      fontStyle: "italic",
                    }}
                  >
                    "{t.text}"
                  </p>
                  <div className="flex gap-1 mt-4">
                    {["s1", "s2", "s3", "s4", "s5"].map((s) => (
                      <Star
                        key={s}
                        size={12}
                        fill="#D4AF37"
                        style={{ color: "#D4AF37" }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </div>
      </section>

      {/* ======= CTA ======= */}
      <section style={{ padding: "80px 0" }}>
        <div className="max-w-4xl mx-auto px-4">
          <Section>
            <div
              className="rounded-3xl p-12 text-center relative overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, rgba(212,175,55,0.15), rgba(255,215,0,0.08))",
                border: "1px solid rgba(212,175,55,0.3)",
              }}
            >
              <div
                className="absolute inset-0 rounded-3xl pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(212,175,55,0.08) 0%, transparent 60%)",
                }}
              />
              <Diamond
                size={36}
                className="mx-auto mb-5"
                style={{ color: "#D4AF37" }}
              />
              <h2
                className="font-display font-bold mb-3"
                style={{
                  fontSize: "clamp(28px, 5vw, 46px)",
                  background: "linear-gradient(135deg, #D4AF37, #FFD700)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Start Your Journey Today
              </h2>
              <p
                className="mb-8 text-lg"
                style={{ color: "rgba(255,255,255,0.6)" }}
              >
                Join thousands of successful members building real wealth with
                GUCCORA.
              </p>
              <Link to="/register" data-ocid="cta.primary_button">
                <button
                  type="button"
                  style={{
                    background: "linear-gradient(135deg, #D4AF37, #FFD700)",
                    color: "#0a0a0a",
                    border: "none",
                    padding: "14px 48px",
                    borderRadius: "32px",
                    fontWeight: 700,
                    fontSize: "17px",
                    cursor: "pointer",
                    letterSpacing: "0.06em",
                    boxShadow: "0 0 40px rgba(212,175,55,0.3)",
                  }}
                >
                  Register Now
                </button>
              </Link>
            </div>
          </Section>
        </div>
      </section>

      {/* Animation keyframes */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}
