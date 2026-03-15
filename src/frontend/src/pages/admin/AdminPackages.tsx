import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Loader2, Package, Plus } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useAddPackage, usePackages } from "../../hooks/useQueries";
import { formatICP } from "../../lib/formatters";

export function AdminPackages() {
  const { data: packages, isLoading } = usePackages();
  const addMutation = useAddPackage();
  const [formOpen, setFormOpen] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [benefits, setBenefits] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Package name is required");
      return;
    }
    const priceNum = Number.parseFloat(price);
    if (!priceNum || priceNum <= 0) {
      toast.error("Enter a valid price");
      return;
    }
    if (!benefits.trim()) {
      toast.error("Benefits are required");
      return;
    }
    try {
      const priceE8s = BigInt(Math.floor(priceNum * 100_000_000));
      await addMutation.mutateAsync({
        name: name.trim(),
        price: priceE8s,
        benefits: benefits.trim(),
      });
      toast.success("Package added!");
      setName("");
      setPrice("");
      setBenefits("");
      setFormOpen(false);
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to add package");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold flex items-center gap-3">
          <Package size={24} className="text-primary" />
          Manage Packages
        </h1>
        <Button
          onClick={() => setFormOpen(!formOpen)}
          className="gold-gradient text-primary-foreground font-semibold"
          data-ocid="packages.open_modal_button"
        >
          <Plus size={16} className="mr-2" />
          Add Package
        </Button>
      </div>

      {formOpen && (
        <Card
          className="bg-card border-primary/30 card-glow"
          data-ocid="packages.dialog"
        >
          <CardHeader>
            <CardTitle className="text-base">New Package</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>Package Name</Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Premium Pack"
                    className="bg-muted/30 border-border"
                    data-ocid="packages.input"
                  />
                </div>
                <div className="space-y-1">
                  <Label>Price (ICP)</Label>
                  <Input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="1.00"
                    className="bg-muted/30 border-border"
                    data-ocid="packages.input"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label>Benefits (comma-separated)</Label>
                <Textarea
                  value={benefits}
                  onChange={(e) => setBenefits(e.target.value)}
                  placeholder="Binary commission 20%, Direct referral bonus, Rank bonus eligibility"
                  rows={3}
                  className="bg-muted/30 border-border"
                  data-ocid="packages.textarea"
                />
              </div>
              <div className="flex gap-3">
                <Button
                  type="submit"
                  className="gold-gradient text-primary-foreground font-semibold"
                  disabled={addMutation.isPending}
                  data-ocid="packages.submit_button"
                >
                  {addMutation.isPending ? (
                    <>
                      <Loader2 size={16} className="mr-2 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    "Add Package"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setFormOpen(false)}
                  data-ocid="packages.cancel_button"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
          data-ocid="packages.loading_state"
        >
          {["a", "b", "c"].map((k) => (
            <Skeleton key={k} className="h-48 w-full rounded-xl" />
          ))}
        </div>
      ) : !packages || packages.length === 0 ? (
        <Card className="bg-card border-border">
          <CardContent
            className="p-8 text-center"
            data-ocid="packages.empty_state"
          >
            <Package size={32} className="text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No packages created yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {packages.map((pkg, i) => (
            <motion.div
              key={pkg.id.toString()}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Card
                className="bg-card border-border h-full"
                data-ocid={`packages.card.${i + 1}`}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-display font-bold text-lg">
                      {pkg.name}
                    </h3>
                    <div className="font-bold text-primary">
                      {formatICP(pkg.price)}
                    </div>
                  </div>
                  <ul className="space-y-1.5">
                    {pkg.benefits.split(",").map((b) => (
                      <li
                        key={b.trim()}
                        className="flex items-start gap-2 text-xs text-muted-foreground"
                      >
                        <CheckCircle2
                          size={12}
                          className="text-primary shrink-0 mt-0.5"
                        />
                        {b.trim()}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 pt-3 border-t border-border">
                    <span className="text-xs text-muted-foreground">
                      Package ID: #{pkg.id.toString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
