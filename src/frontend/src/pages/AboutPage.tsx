import { Link } from "@tanstack/react-router";
import {
  Award,
  Globe,
  Heart,
  Shield,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { motion } from "motion/react";

export function AboutPage() {
  return (
    <div style={{ background: "#0a0a0a", color: "#fff" }}>
      {/* Hero */}
      <section
        className="relative py-28 text-center"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(212,175,55,0.08), transparent 60%), #0a0a0a",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
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
              OUR STORY
            </span>
          </div>
          <h1
            className="font-display font-bold mb-4"
            style={{
              fontSize: "clamp(40px, 6vw, 72px)",
              background:
                "linear-gradient(135deg, #D4AF37, #FFD700 50%, #B8960C)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            About GUCCORA
          </h1>
          <div
            style={{
              width: "80px",
              height: "3px",
              background: "linear-gradient(90deg, #D4AF37, #FFD700)",
              margin: "0 auto 24px",
            }}
          />
          <p
            style={{
              color: "rgba(255,255,255,0.6)",
              fontSize: "18px",
              lineHeight: 1.8,
            }}
          >
            Founded with a singular vision: to create real financial freedom
            through a transparent, ethical, and proven network marketing system.
          </p>
        </motion.div>
      </section>

      {/* Company Story */}
      <section style={{ background: "#0d0d0d", padding: "80px 0" }}>
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <h2
                className="font-display font-bold text-3xl mb-6"
                style={{ color: "#D4AF37" }}
              >
                Our Story
              </h2>
              <p
                style={{
                  color: "rgba(255,255,255,0.65)",
                  lineHeight: 1.8,
                  marginBottom: "16px",
                }}
              >
                GUCCORA was born in 2019 with a revolutionary idea: luxury-grade
                network marketing that actually delivers. Our founders, seasoned
                entrepreneurs, saw a gap in the market — premium products,
                transparent payouts, and a system designed for the everyday
                Indian to build extraordinary wealth.
              </p>
              <p
                style={{
                  color: "rgba(255,255,255,0.65)",
                  lineHeight: 1.8,
                  marginBottom: "16px",
                }}
              >
                In just 5 years, we've grown to 10,000+ members across 4
                countries, paid out over ₹50 lakhs in commissions, and built a
                community that stands for excellence, integrity, and
                transformation.
              </p>
              <p style={{ color: "rgba(255,255,255,0.65)", lineHeight: 1.8 }}>
                Every plan we offer — from Starter to Diamond — is crafted to
                ensure that every member, at every level, has a genuine
                opportunity to build a sustainable income.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <div
                className="rounded-2xl p-8"
                style={{
                  background: "rgba(212,175,55,0.04)",
                  border: "1px solid rgba(212,175,55,0.15)",
                }}
              >
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { value: "2019", label: "Founded" },
                    { value: "10K+", label: "Members" },
                    { value: "4", label: "Countries" },
                    { value: "₹50L+", label: "Paid Out" },
                  ].map((s) => (
                    <div
                      key={s.value}
                      className="text-center p-5 rounded-xl"
                      style={{ background: "rgba(212,175,55,0.06)" }}
                    >
                      <div
                        className="font-display font-bold text-3xl"
                        style={{
                          background:
                            "linear-gradient(135deg, #D4AF37, #FFD700)",
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
                          fontSize: "13px",
                          marginTop: "4px",
                        }}
                      >
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section style={{ background: "#0a0a0a", padding: "80px 0" }}>
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2
              className="font-display font-bold"
              style={{
                fontSize: "clamp(28px, 4vw, 44px)",
                background:
                  "linear-gradient(135deg, #fff, rgba(255,255,255,0.75))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Mission & Vision
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: Target,
                title: "Our Mission",
                desc: "To empower every member with the tools, training, and technology needed to build a sustainable income from anywhere in the world — with complete transparency and integrity.",
              },
              {
                icon: Globe,
                title: "Our Vision",
                desc: "To become India's most trusted luxury network marketing platform, expanding to 25 countries with 1 million+ members, delivering premium products and life-changing financial rewards.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="p-8 rounded-2xl"
                style={{
                  background: "rgba(212,175,55,0.04)",
                  border: "1px solid rgba(212,175,55,0.15)",
                }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                  style={{
                    background: "rgba(212,175,55,0.1)",
                    border: "1px solid rgba(212,175,55,0.25)",
                  }}
                >
                  <Icon size={22} style={{ color: "#D4AF37" }} />
                </div>
                <h3
                  className="font-display font-bold text-xl mb-3"
                  style={{ color: "#D4AF37" }}
                >
                  {title}
                </h3>
                <p style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>
                  {desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section style={{ background: "#0d0d0d", padding: "80px 0" }}>
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2
              className="font-display font-bold"
              style={{
                fontSize: "clamp(28px, 4vw, 44px)",
                background:
                  "linear-gradient(135deg, #fff, rgba(255,255,255,0.75))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Our Core Values
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            {[
              { icon: Shield, label: "Integrity" },
              { icon: Heart, label: "Care" },
              { icon: TrendingUp, label: "Growth" },
              { icon: Award, label: "Excellence" },
              { icon: Users, label: "Community" },
              { icon: Globe, label: "Diversity" },
              { icon: Target, label: "Focus" },
              { icon: Award, label: "Luxury" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="p-5 rounded-2xl text-center"
                style={{
                  background: "rgba(212,175,55,0.04)",
                  border: "1px solid rgba(212,175,55,0.12)",
                }}
              >
                <Icon
                  size={24}
                  className="mx-auto mb-3"
                  style={{ color: "#D4AF37" }}
                />
                <div
                  style={{
                    color: "rgba(255,255,255,0.75)",
                    fontWeight: 600,
                    fontSize: "14px",
                  }}
                >
                  {label}
                </div>
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
            Ready to Build Your Legacy?
          </h2>
          <p className="mb-8" style={{ color: "rgba(255,255,255,0.55)" }}>
            Join GUCCORA today and start your journey toward financial freedom.
          </p>
          <Link to="/register" data-ocid="about.primary_button">
            <button
              type="button"
              style={{
                background: "linear-gradient(135deg, #D4AF37, #FFD700)",
                color: "#0a0a0a",
                border: "none",
                padding: "13px 40px",
                borderRadius: "32px",
                fontWeight: 700,
                fontSize: "15px",
                cursor: "pointer",
                boxShadow: "0 0 30px rgba(212,175,55,0.25)",
              }}
            >
              Join GUCCORA Now
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
