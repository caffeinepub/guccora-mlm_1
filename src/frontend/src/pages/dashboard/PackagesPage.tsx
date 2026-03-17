import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, Crown, Gem, Loader2, Package, Star } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useActor } from "../../hooks/useActor";
import { useMobileSession } from "../../hooks/useMobileSession";
import { usePackages, usePurchasePackage } from "../../hooks/useQueries";
import { formatRupees } from "../../lib/formatters";

const PLAN_PRICES: Record<number, number> = {
  1: 499,
  2: 999,
  3: 1999,
  4: 2999,
};

const PLAN_CONFIG = [
  {
    cardClass: "plan-card-starter",
    btnClass: "btn-starter",
    accentColor: "oklch(72.6% 0.116 73)",
    icon: <Star size={20} style={{ color: "oklch(72.6% 0.116 73)" }} />,
    iconBg: "oklch(72.6% 0.116 73 / 0.12)",
    priceColor: "oklch(72.6% 0.116 73)",
    checkColor: "oklch(72.6% 0.116 73)",
    badge: null,
  },
  {
    cardClass: "plan-card-silver",
    btnClass: "btn-silver",
    accentColor: "oklch(80% 0.02 240)",
    icon: (
      <Star
        size={20}
        style={{ color: "oklch(80% 0.02 240)" }}
        fill="oklch(80% 0.02 240)"
      />
    ),
    iconBg: "oklch(75% 0.02 240 / 0.12)",
    priceColor: "oklch(82% 0.03 240)",
    checkColor: "oklch(72.6% 0.116 73)",
    badge: null,
  },
  {
    cardClass: "plan-card-gold",
    btnClass: "btn-gold",
    accentColor: "oklch(80.4% 0.108 77)",
    icon: <Crown size={20} style={{ color: "oklch(10% 0.08 298)" }} />,
    iconBg: "oklch(72.6% 0.116 73)",
    priceColor: "oklch(90% 0.12 78)",
    checkColor: "oklch(80.4% 0.108 77)",
    badge: "MOST POPULAR",
  },
  {
    cardClass: "plan-card-diamond",
    btnClass: "btn-diamond",
    accentColor: "oklch(70% 0.15 260)",
    icon: <Gem size={20} style={{ color: "oklch(78% 0.12 260)" }} />,
    iconBg: "oklch(70% 0.15 260 / 0.18)",
    priceColor: "oklch(78% 0.12 260)",
    checkColor: "oklch(70% 0.15 260)",
    badge: null,
  },
];

export function PackagesPage() {
  const { isLoading } = usePackages();
  const purchaseMutation = usePurchasePackage();
  const { mobileSession } = useMobileSession();
  const { actor } = useActor();
  const [purchasing, setPurchasing] = useState<bigint | null>(null);
  const [currentPlanId, setCurrentPlanId] = useState<number>(0);
  const [loadingPlan, setLoadingPlan] = useState(false);

  // Fetch current active plan
  useEffect(() => {
    if (!mobileSession?.phone || !actor) return;
    setLoadingPlan(true);
    actor
      .getMobileUserActivePlan(mobileSession.phone)
      .then((result) => {
        if (result && Array.isArray(result) && result.length > 0) {
          setCurrentPlanId(Number(result[0]));
        } else if (result && typeof result === "object" && "Some" in result) {
          setCurrentPlanId(Number((result as { Some: bigint }).Some));
        } else {
          setCurrentPlanId(0);
        }
      })
      .catch(() => setCurrentPlanId(0))
      .finally(() => setLoadingPlan(false));
  }, [mobileSession?.phone, actor]);

  const samplePackages = [
    {
      id: 1n,
      name: "Starter Plan",
      price: 499n,
      benefits:
        "Binary Income, Direct Referral Income, 10 Level Income, Welcome Bonus",
    },
    {
      id: 2n,
      name: "Silver Plan",
      price: 999n,
      benefits:
        "Binary Income, Direct Referral Income, 10 Level Income, Rank Bonus",
    },
    {
      id: 3n,
      name: "Gold Plan",
      price: 1999n,
      benefits:
        "Binary Income, Direct Referral Income, 10 Level Income, Rank Bonus, Bonus Income",
    },
    {
      id: 4n,
      name: "Diamond Plan",
      price: 2999n,
      benefits:
        "Binary Income, Direct Referral Income, 10 Level Income, Rank Bonus, Bonus Income, VIP Support",
    },
  ];

  const displayPackages = samplePackages;

  const handlePurchaseOrUpgrade = async (packageId: bigint) => {
    if (!mobileSession?.isLoggedIn) {
      toast.error("Please login to purchase a plan.");
      return;
    }
    if (!actor) {
      toast.error("Not connected to backend. Please try again.");
      return;
    }
    setPurchasing(packageId);
    try {
      if (mobileSession.phone) {
        const newPlanId = Number(packageId);
        if (currentPlanId > 0 && newPlanId > currentPlanId) {
          // Upgrade path
          const result = await actor.upgradeMobileUserPlan(
            mobileSession.phone,
            packageId,
          );
          toast.success(
            typeof result === "string" ? result : "Plan upgraded successfully!",
          );
          setCurrentPlanId(newPlanId);
        } else {
          // Fresh purchase
          const result = await actor.purchaseMobileUserPlan(
            mobileSession.phone,
            packageId,
          );
          toast.success(
            typeof result === "string"
              ? result
              : "Plan purchased successfully!",
          );
          setCurrentPlanId(newPlanId);
        }
      } else {
        await purchaseMutation.mutateAsync(packageId);
        toast.success("Package purchased successfully!");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      toast.error(message || "Purchase failed. Please try again.");
    } finally {
      setPurchasing(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold flex items-center gap-3">
          <Package size={24} className="text-primary" />
          Membership Packages
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Choose a package to activate your earning potential
        </p>
        {mobileSession?.isLoggedIn && (
          <p className="text-xs text-green-400 mt-1">
            Logged in as{" "}
            <span className="font-semibold">{mobileSession.fullName}</span> (
            {mobileSession.userId})
          </p>
        )}
      </div>

      {isLoading || loadingPlan ? (
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          data-ocid="packages.loading_state"
        >
          {["a", "b", "c", "d"].map((k) => (
            <Skeleton key={k} className="h-64 w-full rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayPackages.map((pkg, i) => {
            const cfg = PLAN_CONFIG[i];
            const isPurchasing = purchasing === pkg.id;
            const planNum = Number(pkg.id);
            const isCurrentPlan = currentPlanId === planNum;
            const isLowerPlan = currentPlanId > 0 && planNum < currentPlanId;
            const isUpgrade = currentPlanId > 0 && planNum > currentPlanId;
            const currentPlanPrice = PLAN_PRICES[currentPlanId] ?? 0;
            const upgradeFee = isUpgrade
              ? PLAN_PRICES[planNum] - currentPlanPrice
              : 0;

            return (
              <motion.div
                key={pkg.id.toString()}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: isLowerPlan || isCurrentPlan ? 0 : -4 }}
                className="h-full"
              >
                <div
                  className={`${
                    cfg.cardClass
                  } rounded-2xl h-full flex flex-col transition-all duration-300 relative ${
                    isCurrentPlan ? "ring-2 ring-primary" : ""
                  } ${isLowerPlan ? "opacity-50" : ""}`}
                  data-ocid={`packages.card.${i + 1}`}
                >
                  {/* Current plan badge */}
                  {isCurrentPlan && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                      <span
                        className="text-xs font-bold px-4 py-1 rounded-full tracking-widest uppercase"
                        style={{
                          background:
                            "linear-gradient(135deg, oklch(50% 0.18 145), oklch(65% 0.2 145))",
                          color: "white",
                          boxShadow: "0 2px 12px oklch(50% 0.18 145 / 0.5)",
                        }}
                      >
                        Current Plan
                      </span>
                    </div>
                  )}

                  {/* Popular badge */}
                  {cfg.badge && !isCurrentPlan && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                      <span
                        className="text-xs font-bold px-4 py-1 rounded-full tracking-widest uppercase"
                        style={{
                          background:
                            "linear-gradient(135deg, oklch(72.6% 0.116 73), oklch(80.4% 0.108 77))",
                          color: "oklch(10% 0.08 298)",
                          boxShadow: "0 2px 12px oklch(72.6% 0.116 73 / 0.5)",
                        }}
                      >
                        {cfg.badge}
                      </span>
                    </div>
                  )}

                  <div className="p-6 pb-0">
                    {/* Icon badge */}
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                      style={{ background: cfg.iconBg }}
                    >
                      {cfg.icon}
                    </div>

                    {/* Plan name */}
                    <div className="font-display text-lg font-bold text-foreground mb-1">
                      {pkg.name}
                    </div>

                    {/* Price */}
                    <div
                      className="font-display text-4xl font-extrabold mb-1"
                      style={{ color: cfg.priceColor }}
                    >
                      {formatRupees(pkg.price)}
                    </div>

                    {/* Upgrade fee label */}
                    {isUpgrade && (
                      <div
                        className="text-xs font-semibold mb-3 px-3 py-1 rounded-full inline-block"
                        style={{
                          background: "oklch(72.6% 0.116 73 / 0.15)",
                          color: "oklch(72.6% 0.116 73)",
                        }}
                      >
                        Upgrade fee: {formatRupees(BigInt(upgradeFee))}
                      </div>
                    )}
                  </div>

                  {/* Divider */}
                  <div
                    className={`mx-6 h-px ${isUpgrade ? "mb-2" : "mb-4"}`}
                    style={{
                      background: `linear-gradient(90deg, transparent, ${cfg.accentColor}50, transparent)`,
                    }}
                  />

                  {/* Benefits */}
                  <div className="px-6 flex-1">
                    <ul className="space-y-2 mb-6">
                      {pkg.benefits.split(",").map((b) => (
                        <li
                          key={b}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <CheckCircle2
                            size={14}
                            className="shrink-0 mt-0.5"
                            style={{ color: cfg.checkColor }}
                          />
                          {b.trim()}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <div className="p-6 pt-0">
                    {isCurrentPlan ? (
                      <Button
                        className="w-full font-semibold rounded-full py-3"
                        variant="ghost"
                        disabled
                        data-ocid={`packages.primary_button.${i + 1}`}
                        style={{
                          opacity: 0.7,
                          background: "oklch(50% 0.18 145 / 0.15)",
                          color: "oklch(65% 0.2 145)",
                        }}
                      >
                        Active Plan
                      </Button>
                    ) : isLowerPlan ? (
                      <Button
                        className="w-full font-semibold rounded-full py-3 opacity-40"
                        variant="ghost"
                        disabled
                        data-ocid={`packages.primary_button.${i + 1}`}
                      >
                        Lower Plan
                      </Button>
                    ) : (
                      <Button
                        className={`w-full font-semibold rounded-full py-3 transition-all duration-200 hover:scale-105 ${cfg.btnClass}`}
                        variant="ghost"
                        onClick={() => handlePurchaseOrUpgrade(pkg.id)}
                        disabled={isPurchasing}
                        data-ocid={`packages.primary_button.${i + 1}`}
                      >
                        {isPurchasing ? (
                          <>
                            <Loader2 size={16} className="mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : isUpgrade ? (
                          `Upgrade — ${formatRupees(BigInt(upgradeFee))}`
                        ) : (
                          "Purchase Package"
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
