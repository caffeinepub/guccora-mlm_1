import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Globe,
  Shield,
  Star,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";

const features = [
  {
    icon: TrendingUp,
    title: "Binary MLM System",
    desc: "Build two powerful legs and earn binary commissions from every sale in your network.",
  },
  {
    icon: Users,
    title: "Direct Referral Bonus",
    desc: "Earn instant bonuses every time you personally refer a new member to GUCCORA.",
  },
  {
    icon: Award,
    title: "Rank Advancement",
    desc: "Progress from Starter to Diamond with increasing bonuses and privileges at each rank.",
  },
  {
    icon: Shield,
    title: "Secure Blockchain",
    desc: "Your earnings and transactions are secured on the Internet Computer blockchain.",
  },
  {
    icon: Zap,
    title: "Instant Payouts",
    desc: "Request withdrawals any time. Funds are processed quickly and transparently.",
  },
  {
    icon: Globe,
    title: "Global Network",
    desc: "Join members worldwide and build an international income-generating network.",
  },
];

const plans = [
  {
    rank: "Starter",
    icon: "○",
    color: "text-muted-foreground",
    bonus: "5%",
    desc: "Your journey begins here",
  },
  {
    rank: "Bronze",
    icon: "🥉",
    color: "text-[oklch(65%_0.12_55)]",
    bonus: "8%",
    desc: "Building momentum",
  },
  {
    rank: "Silver",
    icon: "⭐",
    color: "text-[oklch(75%_0.02_240)]",
    bonus: "12%",
    desc: "Growing your network",
  },
  {
    rank: "Gold",
    icon: "⭐",
    color: "text-primary",
    bonus: "16%",
    desc: "Achieving excellence",
  },
  {
    rank: "Platinum",
    icon: "💠",
    color: "text-[oklch(80%_0.04_220)]",
    bonus: "20%",
    desc: "Elite performer",
  },
  {
    rank: "Diamond",
    icon: "💎",
    color: "text-[oklch(75%_0.18_260)]",
    bonus: "25%",
    desc: "The pinnacle of success",
  },
];

const testimonials = [
  {
    name: "Amara Johnson",
    rank: "Gold Member",
    quote:
      "GUCCORA transformed my financial life. Within 6 months, I reached Gold rank and now earn passive income every week.",
  },
  {
    name: "Marcus Williams",
    rank: "Platinum Member",
    quote:
      "The binary system is brilliantly designed. My left and right legs are growing automatically as my team expands.",
  },
  {
    name: "Priya Sharma",
    rank: "Diamond Member",
    quote:
      "I've tried many MLM programs but none compare to GUCCORA's transparency and blockchain-verified earnings.",
  },
];

export function LandingPage() {
  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url(/assets/generated/guccora-hero-bg.dim_1920x1080.jpg)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-6">
              <Star size={14} fill="currentColor" />
              The Premium Network Marketing Platform
            </div>

            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold leading-tight mb-6">
              <span className="gold-gradient-text">Build Wealth.</span>
              <br />
              <span className="text-foreground">Build Legacy.</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 font-body leading-relaxed">
              GUCCORA is a premium binary MLM platform where ambition meets
              opportunity. Join thousands of members earning real income on the
              blockchain.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button
                  size="lg"
                  className="gold-gradient text-primary-foreground font-bold px-8 py-3 text-base rounded-full shadow-gold hover:opacity-90 transition-opacity"
                  data-ocid="landing.primary_button"
                >
                  Start Your Journey <ArrowRight size={18} className="ml-2" />
                </Button>
              </Link>
              <Link to="/plan">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary/40 text-primary hover:bg-primary/10 px-8 py-3 text-base rounded-full"
                  data-ocid="landing.secondary_button"
                >
                  View Comp Plan
                </Button>
              </Link>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-6 max-w-md mx-auto">
              {[
                { label: "Active Members", value: "10,000+" },
                { label: "Total Paid Out", value: "₹50L+" },
                { label: "Countries", value: "45+" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="font-display text-2xl font-bold text-primary">
                    {stat.value}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl font-bold mb-4">
              Why Choose <span className="gold-gradient-text">GUCCORA</span>?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Built on transparency, powered by blockchain. Every transaction is
              verified, every earning is real.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, i) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card className="bg-card border-border card-glow hover:border-primary/30 transition-all duration-300 h-full">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                      <feat.icon size={22} className="text-primary" />
                    </div>
                    <h3 className="font-display text-lg font-semibold mb-2">
                      {feat.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {feat.desc}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Rank System */}
      <section className="py-24 px-4 bg-card/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl font-bold mb-4">
              Rise Through the <span className="gold-gradient-text">Ranks</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Six distinct ranks with increasing commission rates and exclusive
              benefits.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.rank}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <Card
                  className={`bg-card border-border text-center p-4 hover:border-primary/40 transition-all ${i === 5 ? "border-primary/50 gold-glow" : ""}`}
                >
                  <div className={`text-3xl mb-2 ${plan.color}`}>
                    {plan.icon}
                  </div>
                  <div className="font-display font-bold text-sm mb-1">
                    {plan.rank}
                  </div>
                  <div className="text-primary font-bold text-lg">
                    {plan.bonus}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {plan.desc}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl font-bold mb-4">
              Success <span className="gold-gradient-text">Stories</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
              >
                <Card className="bg-card border-border card-glow h-full">
                  <CardContent className="p-6">
                    <div className="flex gap-1 mb-4">
                      {[1, 2, 3, 4, 5].map((j) => (
                        <Star
                          key={j}
                          size={14}
                          className="text-primary"
                          fill="currentColor"
                        />
                      ))}
                    </div>
                    <p className="text-foreground text-sm leading-relaxed mb-6 italic">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full gold-gradient flex items-center justify-center text-primary-foreground text-sm font-bold">
                        {t.name.slice(0, 2)}
                      </div>
                      <div>
                        <div className="font-semibold text-sm">{t.name}</div>
                        <div className="text-xs text-primary">{t.rank}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="p-12 rounded-2xl border border-primary/30 bg-card/50 card-glow relative overflow-hidden">
              <div className="absolute inset-0 gold-gradient opacity-5" />
              <div className="relative z-10">
                <h2 className="font-display text-4xl font-bold mb-4">
                  Ready to{" "}
                  <span className="gold-gradient-text">Join GUCCORA</span>?
                </h2>
                <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                  Join thousands of ambitious entrepreneurs building financial
                  freedom. Your journey starts with one decision.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/register">
                    <Button
                      size="lg"
                      className="gold-gradient text-primary-foreground font-bold px-10 rounded-full"
                      data-ocid="landing.cta_button"
                    >
                      Create Account <ArrowRight size={18} className="ml-2" />
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-border hover:border-primary/50 rounded-full"
                      data-ocid="landing.login_button"
                    >
                      Sign In
                    </Button>
                  </Link>
                </div>
                <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
                  {[
                    "No Setup Fees",
                    "Instant Onboarding",
                    "Blockchain Verified",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-primary" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
