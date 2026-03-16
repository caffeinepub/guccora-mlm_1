import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Principal } from "@icp-sdk/core/principal";
import { DollarSign, GitBranch, Layers, Loader2, Users } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import {
  useAwardBinaryPairIncome,
  useAwardDirectReferralIncome,
  useAwardLevelIncome,
} from "../../hooks/useQueries";

function parsePrincipal(value: string): Principal | null {
  try {
    return Principal.fromText(value.trim());
  } catch {
    return null;
  }
}

export function AdminIncomeDistribution() {
  // Direct Referral
  const [drUser, setDrUser] = useState("");
  const [drAmount, setDrAmount] = useState("");
  const [drFrom, setDrFrom] = useState("");

  // Binary Pair
  const [bpUser, setBpUser] = useState("");
  const [bpAmount, setBpAmount] = useState("");

  // Level Income
  const [lvUser, setLvUser] = useState("");
  const [lvAmount, setLvAmount] = useState("");
  const [lvLevel, setLvLevel] = useState("1");
  const [lvFrom, setLvFrom] = useState("");

  const awardDirect = useAwardDirectReferralIncome();
  const awardBinary = useAwardBinaryPairIncome();
  const awardLevel = useAwardLevelIncome();

  const handleDirectReferral = async () => {
    const toUser = parsePrincipal(drUser);
    if (!toUser) return toast.error("Invalid User Principal");
    const amount = Number.parseFloat(drAmount);
    if (!amount || amount <= 0) return toast.error("Invalid amount");
    const fromUser = drFrom.trim() ? parsePrincipal(drFrom) : null;
    if (drFrom.trim() && !fromUser)
      return toast.error("Invalid From User principal");
    try {
      await awardDirect.mutateAsync({
        toUser,
        amount: BigInt(Math.round(amount * 100_000_000)),
        fromUser,
      });
      toast.success("Direct referral income awarded successfully");
      setDrUser("");
      setDrAmount("");
      setDrFrom("");
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to award income");
    }
  };

  const handleBinaryPair = async () => {
    const toUser = parsePrincipal(bpUser);
    if (!toUser) return toast.error("Invalid User Principal");
    const amount = Number.parseFloat(bpAmount);
    if (!amount || amount <= 0) return toast.error("Invalid amount");
    try {
      await awardBinary.mutateAsync({
        toUser,
        amount: BigInt(Math.round(amount * 100_000_000)),
      });
      toast.success("Binary pair income awarded successfully");
      setBpUser("");
      setBpAmount("");
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to award income");
    }
  };

  const handleLevelIncome = async () => {
    const toUser = parsePrincipal(lvUser);
    if (!toUser) return toast.error("Invalid User Principal");
    const amount = Number.parseFloat(lvAmount);
    if (!amount || amount <= 0) return toast.error("Invalid amount");
    const level = Number.parseInt(lvLevel, 10);
    if (!level || level < 1 || level > 10)
      return toast.error("Invalid level (1–10)");
    const fromUser = lvFrom.trim() ? parsePrincipal(lvFrom) : null;
    if (lvFrom.trim() && !fromUser)
      return toast.error("Invalid From User principal");
    try {
      await awardLevel.mutateAsync({
        toUser,
        amount: BigInt(Math.round(amount * 100_000_000)),
        level: BigInt(level),
        fromUser,
      });
      toast.success(`Level ${level} income awarded successfully`);
      setLvUser("");
      setLvAmount("");
      setLvLevel("1");
      setLvFrom("");
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to award income");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-3"
      >
        <div className="h-10 w-10 rounded-xl gold-gradient flex items-center justify-center">
          <DollarSign size={20} className="text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-display font-bold gold-gradient-text">
            Income Distribution
          </h1>
          <p className="text-sm text-muted-foreground">
            Manually award income to members
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Direct Referral */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <Card className="border-emerald-500/20 bg-card/60 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base">
                <Users size={18} className="text-emerald-400" />
                Award Direct Referral Income
              </CardTitle>
              <CardDescription>
                Reward a user for a direct referral
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="dr-user">User Principal</Label>
                <Input
                  id="dr-user"
                  placeholder="e.g. aaaaa-aa"
                  value={drUser}
                  onChange={(e) => setDrUser(e.target.value)}
                  data-ocid="dr.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="dr-amount">Amount (ICP)</Label>
                <Input
                  id="dr-amount"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={drAmount}
                  onChange={(e) => setDrAmount(e.target.value)}
                  data-ocid="dr.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="dr-from">From User (optional)</Label>
                <Input
                  id="dr-from"
                  placeholder="Referring user principal"
                  value={drFrom}
                  onChange={(e) => setDrFrom(e.target.value)}
                  data-ocid="dr.input"
                />
              </div>
              <Button
                className="w-full gold-gradient text-primary-foreground font-semibold"
                onClick={handleDirectReferral}
                disabled={awardDirect.isPending}
                data-ocid="dr.primary_button"
              >
                {awardDirect.isPending ? (
                  <Loader2 size={16} className="animate-spin mr-2" />
                ) : null}
                Award Direct Referral
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Binary Pair */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <Card className="border-blue-500/20 bg-card/60 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base">
                <GitBranch size={18} className="text-blue-400" />
                Award Binary Pair Income
              </CardTitle>
              <CardDescription>
                Award income for a completed binary pair
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="bp-user">User Principal</Label>
                <Input
                  id="bp-user"
                  placeholder="e.g. aaaaa-aa"
                  value={bpUser}
                  onChange={(e) => setBpUser(e.target.value)}
                  data-ocid="bp.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="bp-amount">Amount (ICP)</Label>
                <Input
                  id="bp-amount"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={bpAmount}
                  onChange={(e) => setBpAmount(e.target.value)}
                  data-ocid="bp.input"
                />
              </div>
              <Button
                className="w-full gold-gradient text-primary-foreground font-semibold"
                onClick={handleBinaryPair}
                disabled={awardBinary.isPending}
                data-ocid="bp.primary_button"
              >
                {awardBinary.isPending ? (
                  <Loader2 size={16} className="animate-spin mr-2" />
                ) : null}
                Award Binary Pair
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Level Income */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <Card className="border-orange-500/20 bg-card/60 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base">
                <Layers size={18} className="text-orange-400" />
                Award Level Income (10 Levels)
              </CardTitle>
              <CardDescription>
                Distribute income across 10 upline levels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="lv-user">User Principal</Label>
                <Input
                  id="lv-user"
                  placeholder="e.g. aaaaa-aa"
                  value={lvUser}
                  onChange={(e) => setLvUser(e.target.value)}
                  data-ocid="lv.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lv-amount">Amount (ICP)</Label>
                <Input
                  id="lv-amount"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={lvAmount}
                  onChange={(e) => setLvAmount(e.target.value)}
                  data-ocid="lv.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lv-level">Level (1–10)</Label>
                <Select value={lvLevel} onValueChange={setLvLevel}>
                  <SelectTrigger id="lv-level" data-ocid="lv.select">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((l) => (
                      <SelectItem key={l} value={String(l)}>
                        Level {l}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lv-from">From User (optional)</Label>
                <Input
                  id="lv-from"
                  placeholder="Source user principal"
                  value={lvFrom}
                  onChange={(e) => setLvFrom(e.target.value)}
                  data-ocid="lv.input"
                />
              </div>
              <Button
                className="w-full gold-gradient text-primary-foreground font-semibold"
                onClick={handleLevelIncome}
                disabled={awardLevel.isPending}
                data-ocid="lv.primary_button"
              >
                {awardLevel.isPending ? (
                  <Loader2 size={16} className="animate-spin mr-2" />
                ) : null}
                Award Level Income
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
