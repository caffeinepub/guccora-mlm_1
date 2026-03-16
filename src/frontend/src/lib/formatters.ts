import { Rank, TransactionStatus, TransactionType } from "../backend";

export function formatICP(amount: bigint): string {
  return `${(Number(amount) / 100_000_000).toFixed(2)} ICP`;
}

export function formatDate(time: bigint): string {
  const ms = Number(time / 1_000_000n);
  return new Date(ms).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(time: bigint): string {
  const ms = Number(time / 1_000_000n);
  return new Date(ms).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function rankLabel(rank: Rank): string {
  const labels: Record<Rank, string> = {
    [Rank.starter]: "Starter",
    [Rank.bronze]: "Bronze",
    [Rank.silver]: "Silver",
    [Rank.gold]: "Gold",
    [Rank.platinum]: "Platinum",
    [Rank.diamond]: "Diamond",
  };
  return labels[rank] ?? rank;
}

export function rankOrder(rank: Rank): number {
  const orders: Record<Rank, number> = {
    [Rank.starter]: 0,
    [Rank.bronze]: 1,
    [Rank.silver]: 2,
    [Rank.gold]: 3,
    [Rank.platinum]: 4,
    [Rank.diamond]: 5,
  };
  return orders[rank] ?? 0;
}

export function txTypeLabel(type: TransactionType): string {
  const labels: Record<TransactionType, string> = {
    [TransactionType.binaryCommission]: "Binary Commission",
    [TransactionType.directReferralBonus]: "Direct Referral Bonus",
    [TransactionType.rankBonus]: "Rank Bonus",
    [TransactionType.withdrawal]: "Withdrawal",
    [TransactionType.adjustment]: "Adjustment",
    [TransactionType.levelIncome]: "Level Income",
  };
  return labels[type] ?? type;
}

export function txStatusLabel(status: TransactionStatus): string {
  const labels: Record<TransactionStatus, string> = {
    [TransactionStatus.pending]: "Pending",
    [TransactionStatus.approved]: "Approved",
    [TransactionStatus.rejected]: "Rejected",
  };
  return labels[status] ?? status;
}

export function truncatePrincipal(principal: string): string {
  if (principal.length <= 16) return principal;
  return `${principal.slice(0, 8)}...${principal.slice(-6)}`;
}
