import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, Loader2, Package } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { usePackages, usePurchasePackage } from "../../hooks/useQueries";
import { formatRupees } from "../../lib/formatters";

export function PackagesPage() {
  const { data: packages, isLoading } = usePackages();
  const purchaseMutation = usePurchasePackage();
  const [purchasing, setPurchasing] = useState<bigint | null>(null);

  const handlePurchase = async (packageId: bigint) => {
    setPurchasing(packageId);
    try {
      await purchaseMutation.mutateAsync(packageId);
      toast.success("Package purchased successfully!");
    } catch (err: any) {
      toast.error(err?.message ?? "Purchase failed");
    } finally {
      setPurchasing(null);
    }
  };

  const samplePackages = [
    {
      id: 1n,
      name: "Starter Pack",
      price: 10_000_000n,
      benefits:
        "Access to binary tree, 5% binary commission, direct referral bonus",
    },
    {
      id: 2n,
      name: "Growth Pack",
      price: 50_000_000n,
      benefits:
        "Enhanced binary commission, priority support, rank bonus eligibility",
    },
    {
      id: 3n,
      name: "Premium Pack",
      price: 100_000_000n,
      benefits:
        "Maximum binary rates, exclusive Diamond track, all bonuses unlocked",
    },
  ];

  const displayPackages =
    packages && packages.length > 0 ? packages : samplePackages;

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
      </div>

      {isLoading ? (
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          data-ocid="packages.loading_state"
        >
          {["a", "b", "c"].map((k) => (
            <Skeleton key={k} className="h-64 w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
