import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";

const plans = [
  {
    name: "Starter Plan",
    price: "₹499",
    icon: "○",
    color: "text-muted-foreground",
    bg: "bg-muted/30",
    binary: "5%",
    referral: "10%",
    levels: "10 Levels",
    cardClass: "plan-card-starter",
    priceGradient:
      "linear-gradient(135deg, oklch(72.6% 0.116 73 / 0.18), oklch(72.6% 0.116 73 / 0.06))",
    priceBorder: "1px solid oklch(72.6% 0.116 73 / 0.35)",
    priceColor: "oklch(72.6% 0.116 73)",
    accentColor: "oklch(72.6% 0.116 73)",
    features: [
      "Binary Income",
      "Direct Referral Income",
      "10 Level Income",
      "Welcome Bonus",
    ],
  },
  {
    name: "Silver Plan",
    price: "₹999",
    icon: "⭐",
    color: "text-[oklch(75%_0.02_240)]",
    bg: "bg-[oklch(55%_0.02_240/0.15)]",
    binary: "8%",
    referral: "12%",
    levels: "10 Levels",
    cardClass: "plan-card-silver",
    priceGradient:
      "linear-gradient(135deg, oklch(65% 0.02 240 / 0.25), oklch(55% 0.02 250 / 0.15))",
    priceBorder: "1px solid oklch(75% 0.02 240 / 0.45)",
    priceColor: "oklch(84% 0.02 240)",
    accentColor: "oklch(75% 0.02 240)",
    features: [
      "Binary Income",
      "Direct Referral Income",
      "10 Level Income",
      "Rank Bonus",
    ],
  },
  {
    name: "Gold Plan",
    price: "₹1,999",
    icon: "👑",
    color: "text-primary",
    bg: "bg-primary/15",
    binary: "10%",
    referral: "15%",
    levels: "10 Levels",
    cardClass: "plan-card-gold",
    priceGradient:
      "linear-gradient(135deg, oklch(72.6% 0.116 73), oklch(80.4% 0.108 77))",
    priceBorder: "none",
    priceColor: "oklch(10% 0.08 298)",
    accentColor: "oklch(72.6% 0.116 73)",
    features: [
      "Binary Income",
      "Direct Referral Income",
      "10 Level Income",
      "Rank Bonus",
      "Bonus Income",
    ],
  },
  {
    name: "Diamond Plan",
    price: "₹2,999",
    icon: "💎",
    color: "text-[oklch(70%_0.18_260)]",
    bg: "bg-gradient-to-br from-[oklch(60%_0.18_250/0.2)] to-[oklch(70%_0.15_290/0.2)]",
    binary: "15%",
    referral: "20%",
    levels: "10 Levels",
    cardClass: "plan-card-diamond",
    priceGradient:
      "linear-gradient(135deg, oklch(40% 0.15 260 / 0.5), oklch(50% 0.18 280 / 0.4))",
    priceBorder: "1px solid oklch(70% 0.15 260 / 0.45)",
    priceColor: "oklch(78% 0.12 260)",
    accentColor: "oklch(70% 0.15 260)",
    features: [
      "Binary Income",
      "Direct Referral Income",
      "10 Level Income",
      "Rank Bonus",
      "Bonus Income",
      "VIP Support",
    ],
  },
];

const bonusTypes = [
  {
    title: "Binary Income",
    desc: "Earn a percentage of the weaker leg volume every pay cycle. The more balanced your tree, the more you earn.",
    icon: "🌲",
  },
  {
    title: "Direct Referral Income",
    desc: "Instantly earn a bonus when someone you personally sponsor purchases a package. Paid immediately to your wallet.",
    icon: "👥",
  },
  {
    title: "10 Level Income",
    desc: "Earn income from your entire downline across 10 levels deep. Every plan unlocks all 10 levels of team income.",
    icon: "📊",
  },
];

export function PlanPage() {
  return (
    <div className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="font-display text-5xl font-bold mb-4">
            Compensation <span className="gold-gradient-text">Plan</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            GUCCORA&apos;s binary compensation plan rewards you with binary
            income, direct referral income, and 10 level income on every plan.
          </p>
        </motion.div>

        {/* How it works */}
        <section className="mb-16">
          <h2 className="font-display text-3xl font-bold mb-8 text-center">
            How the Binary System Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: "1",
                title: "Join & Choose Position",
                desc: "Register under your sponsor and choose Left or Right position in their binary tree.",
              },
              {
                step: "2",
                title: "Build Your Two Legs",
                desc: "Personally sponsor members and place them in your left or right leg. Your downline also places members, growing your tree automatically.",
              },
              {
                step: "3",
                title: "Earn All 3 Incomes",
                desc: "Earn binary income, direct referral income, and 10 level income automatically as your network grows.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <Card className="bg-card border-border h-full">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 rounded-full gold-gradient flex items-center justify-center text-primary-foreground font-display font-bold text-xl mx-auto mb-4">
                      {item.step}
                    </div>
                    <h3 className="font-semibold text-base mb-2">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Income Types */}
        <section className="mb-16">
          <h2 className="font-display text-3xl font-bold mb-8 text-center">
            3 Income Streams on Every Plan
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {bonusTypes.map((bonus, i) => (
              <motion.div
                key={bonus.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="bg-card border-border card-glow h-full">
                  <CardContent className="p-6">
                    <div className="text-3xl mb-3">{bonus.icon}</div>
                    <h3 className="font-display font-semibold text-lg mb-2">
                      {bonus.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {bonus.desc}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Membership Plans */}
        <section className="mb-16">
          <h2 className="font-display text-3xl font-bold mb-8 text-center">
            Membership Plans
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4 }}
              >
                <div
                  className={`${plan.cardClass} rounded-2xl h-full flex flex-col transition-all duration-300 relative overflow-hidden`}
                >
                  {i === 2 && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                      <span
                        className="text-xs font-bold px-4 py-1 rounded-full tracking-widest uppercase whitespace-nowrap"
                        style={{
                          background:
                            "linear-gradient(135deg, oklch(72.6% 0.116 73), oklch(80.4% 0.108 77))",
                          color: "oklch(10% 0.08 298)",
                          boxShadow: "0 2px 12px oklch(72.6% 0.116 73 / 0.5)",
                        }}
                      >
                        MOST POPULAR
                      </span>
                    </div>
                  )}

                  <div className="p-5 pt-7">
                    {/* Header row */}
                    <div className="flex items-center gap-3 mb-4">
                      <span className={`text-2xl ${plan.color}`}>
                        {plan.icon}
                      </span>
                      <div className="font-display font-bold">{plan.name}</div>
                    </div>

                    {/* Price pill */}
                    <div
                      className="inline-flex items-center px-3 py-1 rounded-full font-display font-bold text-sm mb-4"
                      style={{
                        background: plan.priceGradient,
                        border: plan.priceBorder,
                        color: plan.priceColor,
                      }}
                    >
                      {plan.price}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div
                        className="rounded-lg p-2 text-center"
                        style={{
                          background: `${plan.accentColor.replace(")", " / 0.1)").replace("oklch(", "oklch(")}`,
                        }}
                      >
                        <div
                          className="font-bold text-sm"
                          style={{ color: plan.accentColor }}
                        >
                          {plan.binary}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Binary
                        </div>
                      </div>
                      <div
                        className="rounded-lg p-2 text-center"
                        style={{
                          background: `${plan.accentColor.replace(")", " / 0.1)").replace("oklch(", "oklch(")}`,
                        }}
                      >
                        <div
                          className="font-bold text-sm"
                          style={{ color: plan.accentColor }}
                        >
                          {plan.referral}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Referral
                        </div>
                      </div>
                    </div>

                    {/* Features */}
                    <ul className="space-y-1">
                      {plan.features.map((feat) => (
                        <li
                          key={feat}
                          className="flex items-center gap-2 text-xs text-muted-foreground"
                        >
                          <CheckCircle2
                            size={12}
                            className="shrink-0"
                            style={{ color: plan.accentColor }}
                          />
                          {feat}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <div className="text-center">
          <Link to="/register">
            <Button
              size="lg"
              className="btn-shimmer text-primary-foreground font-bold px-12 py-4 rounded-full text-base transition-all duration-200 hover:scale-105"
              style={{ color: "oklch(10% 0.08 298)" }}
              data-ocid="plan.primary_button"
            >
              Join Now <ArrowRight size={18} className="ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
