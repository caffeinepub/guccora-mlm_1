import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, TrendingUp } from "lucide-react";
import { motion } from "motion/react";

const ranks = [
  {
    name: "Starter",
    icon: "○",
    color: "text-muted-foreground",
    bg: "bg-muted/30",
    binary: "5%",
    referral: "10%",
    requirements: ["Join and verify account", "No volume requirement"],
  },
  {
    name: "Bronze",
    icon: "🥉",
    color: "text-[oklch(65%_0.12_55)]",
    bg: "bg-[oklch(35%_0.10_55/0.2)]",
    binary: "8%",
    referral: "12%",
    requirements: ["500 points left leg", "500 points right leg"],
  },
  {
    name: "Silver",
    icon: "⭐",
    color: "text-[oklch(75%_0.02_240)]",
    bg: "bg-[oklch(55%_0.02_240/0.15)]",
    binary: "12%",
    referral: "14%",
    requirements: ["2,000 points left leg", "2,000 points right leg"],
  },
  {
    name: "Gold",
    icon: "⭐",
    color: "text-primary",
    bg: "bg-primary/15",
    binary: "16%",
    referral: "16%",
    requirements: ["5,000 points left leg", "5,000 points right leg"],
  },
  {
    name: "Platinum",
    icon: "💠",
    color: "text-[oklch(80%_0.04_220)]",
    bg: "bg-[oklch(70%_0.03_220/0.15)]",
    binary: "20%",
    referral: "18%",
    requirements: ["15,000 points left leg", "15,000 points right leg"],
  },
  {
    name: "Diamond",
    icon: "💎",
    color: "text-[oklch(70%_0.18_260)]",
    bg: "bg-gradient-to-br from-[oklch(60%_0.18_250/0.2)] to-[oklch(70%_0.15_290/0.2)]",
    binary: "25%",
    referral: "20%",
    requirements: ["50,000 points left leg", "50,000 points right leg"],
  },
];

const bonusTypes = [
  {
    title: "Binary Commission",
    desc: "Earn a percentage of the weaker leg volume every pay cycle. The more balanced your tree, the more you earn.",
    icon: "🌲",
  },
  {
    title: "Direct Referral Bonus",
    desc: "Instantly earn a bonus when someone you personally sponsor purchases a package. Paid immediately.",
    icon: "👥",
  },
  {
    title: "Rank Advancement Bonus",
    desc: "Receive a one-time celebration bonus each time you advance to a new rank.",
    icon: "🏆",
  },
];

export function PlanPage() {
  return (
    <div className="py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="font-display text-5xl font-bold mb-4">
            Compensation <span className="gold-gradient-text">Plan</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            GUCCORA&apos;s binary compensation plan is designed to reward both
            builders and connectors.
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
                title: "Earn Commissions",
                desc: "Every pay cycle, the system calculates your weaker leg volume and pays you a binary commission based on your rank.",
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

        {/* Bonus Types */}
        <section className="mb-16">
          <h2 className="font-display text-3xl font-bold mb-8 text-center">
            Bonus Types
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

        {/* Rank Table */}
        <section className="mb-16">
          <h2 className="font-display text-3xl font-bold mb-8 text-center">
            Rank Structure
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ranks.map((rank, i) => (
              <motion.div
                key={rank.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Card
                  className={`border-border h-full ${i === 5 ? "border-primary/40 card-glow" : ""}`}
                >
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <span className={`text-2xl ${rank.color}`}>
                        {rank.icon}
                      </span>
                      <div>
                        <div className="font-display font-bold">
                          {rank.name}
                        </div>
                        <div
                          className={`text-xs px-2 py-0.5 rounded-full inline-block ${rank.bg} ${rank.color} font-medium`}
                        >
                          Rank {i + 1}
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-muted/30 rounded-lg p-3 text-center">
                        <div className="text-primary font-bold text-lg">
                          {rank.binary}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Binary
                        </div>
                      </div>
                      <div className="bg-muted/30 rounded-lg p-3 text-center">
                        <div className="text-primary font-bold text-lg">
                          {rank.referral}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Referral
                        </div>
                      </div>
                    </div>
                    <ul className="space-y-1">
                      {rank.requirements.map((req) => (
                        <li
                          key={req}
                          className="flex items-center gap-2 text-xs text-muted-foreground"
                        >
                          <CheckCircle2
                            size={12}
                            className="text-primary shrink-0"
                          />
                          {req}
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
