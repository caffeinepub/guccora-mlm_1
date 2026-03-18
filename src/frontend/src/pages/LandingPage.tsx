import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowRight,
  Award,
  BadgeCheck,
  CheckCircle,
  CheckCircle2,
  Crown,
  Gift,
  Globe,
  ImageOff,
  Loader2,
  Phone,
  Shield,
  Star,
  TrendingUp,
  UserPlus,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useActor } from "../hooks/useActor";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  category: string;
  isActive: boolean;
  createdAt: string;
}

const PRODUCTS_KEY = "guccora_products";

const FALLBACK_PRODUCTS: Product[] = [
  {
    id: "sample-1",
    name: "GUCCORA Gold Serum",
    description:
      "Premium 24K gold-infused anti-aging serum for radiant, youthful skin. Clinically tested formula.",
    price: 1999,
    imageUrl: "",
    category: "beauty",
    isActive: true,
    createdAt: "",
  },
  {
    id: "sample-2",
    name: "Immunity Booster Pro",
    description:
      "Advanced immunity formula with Ashwagandha, Vitamin C & Zinc. Strengthen your body naturally.",
    price: 999,
    imageUrl: "",
    category: "health",
    isActive: true,
    createdAt: "",
  },
  {
    id: "sample-3",
    name: "GUCCORA Elite Perfume",
    description:
      "Luxury oriental fragrance with oud and rose. 50ml long-lasting EDP for the discerning elite.",
    price: 2999,
    imageUrl: "",
    category: "lifestyle",
    isActive: true,
    createdAt: "",
  },
  {
    id: "sample-4",
    name: "NutriShield Complete",
    description:
      "Complete daily nutrition pack with 30 essential vitamins, minerals and plant-based proteins.",
    price: 499,
    imageUrl: "",
    category: "nutrition",
    isActive: true,
    createdAt: "",
  },
];

const incomePlans = [
  {
    price: 499,
    label: "Starter Plan",
    popular: false,
    icon: Star,
    benefits: [
      "Direct Income: 10%",
      "Binary Income: 5%",
      "10 Level Income",
      "Welcome Bonus",
    ],
  },
  {
    price: 999,
    label: "Silver Plan",
    popular: false,
    icon: BadgeCheck,
    benefits: [
      "Direct Income: 12%",
      "Binary Income: 8%",
      "10 Level Income",
      "Rank Bonus",
    ],
  },
  {
    price: 1999,
    label: "Gold Plan",
    popular: true,
    icon: Crown,
    benefits: [
      "Direct Income: 15%",
      "Binary Income: 10%",
      "10 Level Income",
      "Rank Bonus",
      "Bonus Income",
    ],
  },
  {
    price: 2999,
    label: "Diamond Plan",
    popular: false,
    icon: Gift,
    benefits: [
      "Direct Income: 20%",
      "Binary Income: 15%",
      "10 Level Income",
      "Rank Bonus",
      "Bonus Income",
      "VIP Support",
    ],
  },
];

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

const CATEGORY_ICONS: Record<string, string> = {
  health: "💚",
  beauty: "✨",
  nutrition: "🌿",
  lifestyle: "🏆",
  technology: "⚡",
  other: "🎁",
};

function OtpRegistrationCard() {
  const { actor } = useActor();
  const navigate = useNavigate();
  const [regName, setRegName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regSponsor, setRegSponsor] = useState("");
  const [regPosition, setRegPosition] = useState("Left");
  const [regPassword, setRegPassword] = useState("");
  const [regOtp, setRegOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [regLoading, setRegLoading] = useState(false);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim()) {
      toast.error("Please enter your full name");
      return;
    }
    if (!/^\d{10}$/.test(regPhone)) {
      toast.error("Enter a valid 10-digit mobile number");
      return;
    }
    if (!regPassword || regPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (!actor) {
      toast.error("Not connected to backend");
      return;
    }
    setRegLoading(true);
    try {
      const result = await actor.sendOtpToPhone(`+91${regPhone}`);
      if (result === "sent") {
        setGeneratedOtp("");
        toast.success("OTP sent to your mobile number via SMS");
      } else {
        setGeneratedOtp(result);
        toast.success(`OTP: ${result} (Dev mode - SMS not configured)`);
      }
      setOtpSent(true);
    } catch {
      toast.error("Failed to send OTP. Please try again.");
    } finally {
      setRegLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor) {
      toast.error("Not connected to backend");
      return;
    }
    setRegLoading(true);
    try {
      const isValid = await actor.verifyPhoneOtp(`+91${regPhone}`, regOtp);
      if (!isValid) {
        toast.error("Incorrect or expired OTP. Please try again.");
        setRegLoading(false);
        return;
      }
      const sponsorCode = regSponsor.trim() || "ADMIN001";
      const userId = await actor.registerMobileUser(
        regName.trim(),
        `+91${regPhone}`,
        regPassword,
        sponsorCode,
      );
      const resolvedId =
        typeof userId === "string" && userId.length > 0
          ? userId
          : `GC${Date.now().toString().slice(-4)}`;
      const session = {
        userId: resolvedId,
        fullName: regName.trim(),
        phone: `+91${regPhone}`,
        sponsorCode,
        joinDate: Date.now(),
        isLoggedIn: true,
      };
      localStorage.setItem("guccora_mobile_session", JSON.stringify(session));
      setOtpVerified(true);
      toast.success("Account created! Redirecting to dashboard...");
      setTimeout(() => navigate({ to: "/dashboard" }), 1200);
    } catch (err: any) {
      toast.error(err?.message ?? "Registration failed. Please try again.");
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <Card className="border border-yellow-600/40 bg-black/80 rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-6 pt-6 pb-4 border-b border-yellow-600/20">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl gold-gradient flex items-center justify-center">
              <UserPlus size={18} className="text-black" />
            </div>
            <h2 className="font-display text-xl font-bold gold-gradient-text">
              Start Your GUCCORA Journey
            </h2>
          </div>
          <p className="text-muted-foreground text-sm pl-12">
            Register now with mobile OTP verification
          </p>
        </div>

        <CardContent className="p-6">
          {otpVerified ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-16 h-16 rounded-full bg-green-500/20 border-2 border-green-500/40 flex items-center justify-center mx-auto">
                <CheckCircle size={32} className="text-green-400" />
              </div>
              <p className="font-display text-lg font-bold text-green-400">
                Account Created!
              </p>
              <p className="text-muted-foreground text-sm">
                Redirecting to your dashboard...
              </p>
              <Loader2
                size={20}
                className="animate-spin text-primary mx-auto"
              />
            </div>
          ) : !otpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-yellow-300/80 text-xs uppercase tracking-wide">
                    Full Name *
                  </Label>
                  <Input
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Enter your full name"
                    className="bg-black/60 border-yellow-600/40 text-yellow-100 placeholder:text-yellow-900/50 focus:border-yellow-500"
                    data-ocid="reg.input"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-yellow-300/80 text-xs uppercase tracking-wide">
                    Mobile Number *
                  </Label>
                  <div className="flex">
                    <span className="flex items-center px-3 bg-yellow-600/20 border border-r-0 border-yellow-600/40 rounded-l-md text-yellow-400 text-sm">
                      +91
                    </span>
                    <Input
                      value={regPhone}
                      onChange={(e) =>
                        setRegPhone(
                          e.target.value.replace(/\D/g, "").slice(0, 10),
                        )
                      }
                      placeholder="10-digit number"
                      className="bg-black/60 border-yellow-600/40 text-yellow-100 placeholder:text-yellow-900/50 focus:border-yellow-500 rounded-l-none"
                      data-ocid="reg.input"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-yellow-300/80 text-xs uppercase tracking-wide">
                    Sponsor ID (optional)
                  </Label>
                  <Input
                    value={regSponsor}
                    onChange={(e) => setRegSponsor(e.target.value)}
                    placeholder="e.g. ADMIN001"
                    className="bg-black/60 border-yellow-600/40 text-yellow-100 placeholder:text-yellow-900/50 focus:border-yellow-500"
                    data-ocid="reg.input"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-yellow-300/80 text-xs uppercase tracking-wide">
                    Placement
                  </Label>
                  <select
                    value={regPosition}
                    onChange={(e) => setRegPosition(e.target.value)}
                    className="w-full h-10 px-3 rounded-md bg-black/60 border border-yellow-600/40 text-yellow-100 focus:border-yellow-500 focus:outline-none text-sm"
                    data-ocid="reg.select"
                  >
                    <option value="Left">Left</option>
                    <option value="Right">Right</option>
                  </select>
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label className="text-yellow-300/80 text-xs uppercase tracking-wide">
                    Password *
                  </Label>
                  <Input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    className="bg-black/60 border-yellow-600/40 text-yellow-100 placeholder:text-yellow-900/50 focus:border-yellow-500"
                    data-ocid="reg.input"
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full gold-gradient text-black font-bold rounded-xl h-11 text-base"
                data-ocid="reg.primary_button"
              >
                <Phone size={16} className="mr-2" />
                Send OTP
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-4">
              {/* OTP Display Box */}
              <div className="rounded-xl border-2 border-yellow-500/60 bg-yellow-600/10 p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <AlertCircle size={16} className="text-yellow-400" />
                  <span className="text-yellow-300/80 text-xs font-medium uppercase tracking-wide">
                    Your OTP for testing
                  </span>
                </div>
                <div className="font-display text-4xl font-bold tracking-[0.3em] text-yellow-400">
                  {generatedOtp}
                </div>
                <p className="text-yellow-600/70 text-xs mt-2">
                  This OTP expires in 2 minutes
                </p>
              </div>

              <div className="space-y-1.5">
                <Label className="text-yellow-300/80 text-xs uppercase tracking-wide">
                  Enter OTP *
                </Label>
                <Input
                  value={regOtp}
                  onChange={(e) =>
                    setRegOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  className="bg-black/60 border-yellow-600/40 text-yellow-100 placeholder:text-yellow-900/50 focus:border-yellow-500 text-center text-xl tracking-widest h-12"
                  data-ocid="reg.input"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 border-yellow-600/40 text-yellow-400 hover:bg-yellow-600/10"
                  onClick={() => {
                    setOtpSent(false);
                    setRegOtp("");
                    setGeneratedOtp("");
                  }}
                  data-ocid="reg.secondary_button"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={regLoading || regOtp.length !== 6}
                  className="flex-2 flex-1 gold-gradient text-black font-bold rounded-xl"
                  data-ocid="reg.primary_button"
                >
                  {regLoading ? (
                    <>
                      <Loader2 size={16} className="mr-2 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    "Verify & Create Account"
                  )}
                </Button>
              </div>

              <p className="text-center text-xs text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="text-yellow-400 hover:underline">
                  Sign In
                </Link>
              </p>
            </form>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function LandingPage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(PRODUCTS_KEY);
      const stored: Product[] = raw ? JSON.parse(raw) : [];
      const activeStored = stored.filter((p) => p.isActive);
      setProducts(activeStored.length > 0 ? activeStored : FALLBACK_PRODUCTS);
    } catch {
      setProducts(FALLBACK_PRODUCTS);
    }
  }, []);

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

      {/* OTP Registration Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-background to-card/30">
        <div className="max-w-lg mx-auto">
          <OtpRegistrationCard />
        </div>
      </section>

      {/* Premium Products Showcase */}
      <section className="py-24 px-4 bg-card/20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-medium mb-4">
              <Star size={11} fill="currentColor" /> Premium Collection
            </div>
            <h2 className="font-display text-4xl font-bold mb-4">
              Premium <span className="gold-gradient-text">Products</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              World-class products curated for health, beauty, and prosperity.
              Quality that speaks for itself.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 4).map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <Card className="bg-card border-border card-glow hover:border-primary/40 transition-all duration-300 overflow-hidden group">
                  {product.imageUrl ? (
                    <div className="h-40 overflow-hidden">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <div className="h-40 bg-gradient-to-br from-primary/10 to-primary/5 flex flex-col items-center justify-center gap-2">
                      <span className="text-3xl">
                        {CATEGORY_ICONS[product.category] ?? "🎁"}
                      </span>
                      <ImageOff size={16} className="text-primary/20" />
                    </div>
                  )}
                  <CardContent className="p-5">
                    <div className="text-xs text-primary font-medium capitalize mb-1">
                      {product.category}
                    </div>
                    <h3 className="font-display font-semibold text-sm mb-2 line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                      {product.description}
                    </p>
                    <div className="font-display text-lg font-bold gold-gradient-text">
                      ₹{product.price.toLocaleString("en-IN")}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Income Plans */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-medium mb-4">
              <TrendingUp size={11} /> Income Plans
            </div>
            <h2 className="font-display text-4xl font-bold mb-4">
              Choose Your{" "}
              <span className="gold-gradient-text">Income Plan</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Four flexible plans designed to match your ambition. Upgrade
              anytime as your network grows.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {incomePlans.map((plan, i) => (
              <motion.div
                key={plan.price}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="relative"
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
                    <span className="gold-gradient text-primary-foreground text-xs font-bold px-4 py-1 rounded-full shadow-gold whitespace-nowrap">
                      ⭐ Most Popular
                    </span>
                  </div>
                )}
                <Card
                  className={`h-full flex flex-col transition-all duration-300 ${
                    plan.popular
                      ? "border-primary/60 bg-gradient-to-b from-primary/10 to-card gold-glow scale-[1.02]"
                      : "bg-card border-border hover:border-primary/30 card-glow"
                  }`}
                >
                  <CardContent className="p-6 flex flex-col gap-5 flex-1">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          plan.popular
                            ? "gold-gradient"
                            : "bg-primary/10 border border-primary/20"
                        }`}
                      >
                        <plan.icon
                          size={20}
                          className={
                            plan.popular ? "text-black" : "text-primary"
                          }
                        />
                      </div>
                      <div>
                        <div className="font-display font-bold text-base">
                          {plan.label}
                        </div>
                        <div className="font-display text-2xl font-bold gold-gradient-text">
                          ₹{plan.price.toLocaleString("en-IN")}
                        </div>
                      </div>
                    </div>

                    <ul className="space-y-2.5 flex-1">
                      {plan.benefits.map((benefit) => (
                        <li
                          key={benefit}
                          className="flex items-center gap-2 text-sm"
                        >
                          <CheckCircle2
                            size={14}
                            className="text-primary shrink-0"
                          />
                          <span className="text-muted-foreground">
                            {benefit}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <Link to="/register">
                      <Button
                        className={`w-full rounded-full font-semibold ${
                          plan.popular
                            ? "gold-gradient text-primary-foreground"
                            : "border-primary/40 text-primary hover:bg-primary/10"
                        }`}
                        variant={plan.popular ? "default" : "outline"}
                        data-ocid={`landing.plan_button.${i + 1}`}
                      >
                        Get Started
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4 bg-card/20">
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
