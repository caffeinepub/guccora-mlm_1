import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, Loader2, Package } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useActor } from "../../hooks/useActor";
import { useMobileSession } from "../../hooks/useMobileSession";
import { usePackages, usePurchasePackage } from "../../hooks/useQueries";
import { formatRupees } from "../../lib/formatters";

export function PackagesPage() {
  const { data: packages, isLoading } = usePackages();
  const purchaseMutation = usePurchasePackage();
  const { mobileSession } = useMobileSession();
  const { actor } = useActor();
  const [purchasing, setPurchasing] = useState<bigint | null>(null);

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

  const displayPackages =
    packages && packages.length > 0 ? packages : samplePackages;

  const handlePurchase = async (packageId: bigint) => {
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
        // Mobile user purchase path — no IC auth required
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = await (actor as any).purchaseMobileUserPlan(
          mobileSession.phone,
          packageId,
        );
        toast.success(
          typeof result === "string" ? result : "Plan purchased successfully!",
        );
      } else {
        // IC identity user purchase path
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

      {isLoading ? (
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          data-ocid="packages.loading_state"
        >
          {["a", "b", "c", "d"].map((k) => (
            <Skeleton key={k} className="h-64 w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayPackages.map((pkg, i) => (
            <motion.div
              key={pkg.id.toString()}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card
                className={`bg-card border-border h-full flex flex-col ${
                  i === 2 ? "border-primary/50 card-glow" : ""
                }`}
                data-ocid={`packages.card.${i + 1}`}
              >
                {i === 2 && (
                  <div className="px-5 pt-4">
                    <span className="text-xs bg-primary text-primary-foreground px-3 py-1 rounded-full font-bold">
                      MOST POPULAR
                    </span>
                  </div>
                )}
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl font-display">
                    {pkg.name}
                  </CardTitle>
                  <div className="font-display text-3xl font-bold text-primary mt-2">
                    {formatRupees(pkg.price)}
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between">
                  <ul className="space-y-2 mb-6">
                    {pkg.benefits.split(",").map((b) => (
                      <li
                        key={b}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <CheckCircle2
                          size={14}
                          className="text-primary shrink-0 mt-0.5"
                        />
                        {b.trim()}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full font-semibold rounded-full ${
                      i === 2
                        ? "gold-gradient text-primary-foreground"
                        : "border border-primary/50 text-primary hover:bg-primary/10"
                    }`}
                    variant={i === 2 ? "default" : "outline"}
                    onClick={() => handlePurchase(pkg.id)}
                    disabled={purchasing === pkg.id}
                    data-ocid={`packages.primary_button.${i + 1}`}
                  >
                    {purchasing === pkg.id ? (
                      <>
                        <Loader2 size={16} className="mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Purchase Package"
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
