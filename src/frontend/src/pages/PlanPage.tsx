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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Card
                  className={`border-border h-full ${
                    i === 2 ? "border-primary/40 card-glow" : ""
                  }`}
                >
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <span className={`text-2xl ${plan.color}`}>
                        {plan.icon}
                      </span>
                      <div>
                        <div className="font-display font-bold">
                          {plan.name}
                        </div>
                        <div
                          className={`text-xs px-2 py-0.5 rounded-full inline-block ${plan.bg} ${plan.color} font-medium`}
                        >
                          {plan.price}
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className="bg-muted/30 rounded-lg p-2 text-center">
                        <div className="text-primary font-bold">
                          {plan.binary}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Binary
                        </div>
                      </div>
                      <div className="bg-muted/30 rounded-lg p-2 text-center">
                        <div className="text-primary font-bold">
                          {plan.referral}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Referral
                        </div>
                      </div>
                    </div>
                    <ul className="space-y-1">
                      {plan.features.map((feat) => (
                        <li
                          key={feat}
                          className="flex items-center gap-2 text-xs text-muted-foreground"
                        >
                          <CheckCircle2
                            size={12}
                            className="text-primary shrink-0"
                          />
                          {feat}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <div className="text-center">
          <Link to="/register">
            <Button
              size="lg"
              className="gold-gradient text-primary-foreground font-bold px-10 rounded-full"
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
