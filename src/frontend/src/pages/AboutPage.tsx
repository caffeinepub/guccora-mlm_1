import { Card, CardContent } from "@/components/ui/card";
import { Globe, Heart, Shield, TrendingUp } from "lucide-react";
import { motion } from "motion/react";

export function AboutPage() {
  return (
    <div className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="font-display text-5xl font-bold mb-4">
            About <span className="gold-gradient-text">GUCCORA</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A premium network marketing platform built for the modern era of
            decentralized finance.
          </p>
        </motion.div>

        <div className="space-y-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="bg-card border-border card-glow">
              <CardContent className="p-8">
                <h2 className="font-display text-2xl font-bold mb-4 gold-gradient-text">
                  Our Mission
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  GUCCORA was founded with a singular vision: to create a
                  transparent, fair, and lucrative network marketing ecosystem
                  powered by blockchain technology. We believe that financial
                  freedom should be accessible to everyone — regardless of
                  background, geography, or prior experience.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  By leveraging the Internet Computer blockchain, every
                  transaction on GUCCORA is immutable, transparent, and
                  verifiable. Your earnings are real, your network is permanent,
                  and your legacy is secure.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: Shield,
                title: "Transparency First",
                desc: "Every commission, bonus, and withdrawal is recorded on-chain. No hidden fees, no manipulation.",
              },
              {
                icon: Globe,
                title: "Global Community",
                desc: "Our members span 45+ countries, creating a truly international network of ambitious entrepreneurs.",
              },
              {
                icon: TrendingUp,
                title: "Proven System",
                desc: "The binary MLM system is one of the most powerful compensation models in network marketing history.",
              },
              {
                icon: Heart,
                title: "Member Success",
                desc: "Our success is measured by our members' success. We invest in tools, training, and support.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="bg-card border-border h-full">
                  <CardContent className="p-6">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <item.icon size={20} className="text-primary" />
                    </div>
                    <h3 className="font-display font-semibold text-lg mb-2">
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="bg-card border-border card-glow">
              <CardContent className="p-8">
                <h2 className="font-display text-2xl font-bold mb-4">
                  Why <span className="gold-gradient-text">Blockchain MLM</span>
                  ?
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Traditional MLM companies operate on centralized databases
                  that can be manipulated. GUCCORA is different: our backend
                  runs on the Internet Computer — a world-class blockchain that
                  processes thousands of transactions per second with
                  near-instant finality.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  This means your commissions are calculated and distributed
                  automatically by smart contracts. No human can alter the rules
                  mid-game. What you sign up for is what you get.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
