import type { Principal } from "@icp-sdk/core/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Rank, TransactionType, UserProfile, UserRole } from "../backend";
import { useActor } from "./useActor";

export function useMyProfile() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["myProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMyWallet() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["myWallet"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMyWallet();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMyTransactions() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["myTransactions"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyTransactions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMyRole() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["myRole"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function usePackages() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["packages"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPackages();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAnnouncements() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["announcements"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllAnnouncements();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllUsers() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["allUsers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllUsers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGlobalStats() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["globalStats"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getGlobalStats();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useWithdrawalRequests(userId: Principal | null = null) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["withdrawals", userId?.toString() ?? "all"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getWithdrawalRequests(userId);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUser(userId: Principal | undefined) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["user", userId?.toString()],
    queryFn: async () => {
      if (!actor || !userId) return null;
      return actor.getUser(userId);
    },
    enabled: !!actor && !isFetching && !!userId,
  });
}

export function useMyIncomeStats() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["myIncomeStats"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMyIncomeStats();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMyWithdrawalRequests() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["myWithdrawals"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyWithdrawalRequests();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveProfile() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Not connected");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["myProfile"] }),
  });
}

export function usePurchasePackage() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (packageId: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.purchasePackage(packageId);
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["myWallet", "myTransactions"] }),
  });
}

export function useRequestWithdrawal() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      amount,
      paymentMethod,
      paymentDetails,
    }: { amount: bigint; paymentMethod: string; paymentDetails: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.requestWithdrawal(amount, paymentMethod, paymentDetails);
    },
    onSuccess: () =>
      qc.invalidateQueries({
        queryKey: ["myWallet", "myTransactions", "withdrawals"],
      }),
  });
}

export function useProcessWithdrawal() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      requestId,
      approve,
    }: { requestId: string; approve: boolean }) => {
      if (!actor) throw new Error("Not connected");
      return actor.processWithdrawalRequest(requestId, approve);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["withdrawals"] }),
  });
}

export function useAddAnnouncement() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      title,
      content,
    }: { title: string; content: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.addAnnouncement(title, content);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["announcements"] }),
  });
}

export function useAddPackage() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      price,
      benefits,
    }: { name: string; price: bigint; benefits: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.addPackage(name, price, benefits);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["packages"] }),
  });
}

export function useSetUserActive() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      userId,
      isActive,
    }: { userId: Principal; isActive: boolean }) => {
      if (!actor) throw new Error("Not connected");
      return actor.setUserActiveStatus(userId, isActive);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["allUsers"] }),
  });
}

export function useUpdateUserRank() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, rank }: { userId: Principal; rank: Rank }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateUserRank(userId, rank);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["allUsers"] }),
  });
}

export function useAssignRole() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      userId,
      role,
    }: { userId: Principal; role: UserRole }) => {
      if (!actor) throw new Error("Not connected");
      return actor.assignCallerUserRole(userId, role);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["allUsers"] }),
  });
}

export function useCreateFirstAdmin() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      return actor.createFirstAdmin();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["isAdmin", "myRole"] }),
  });
}

export function useAddTransaction() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      userId,
      amount,
      transactionType,
      relatedUser,
    }: {
      userId: Principal;
      amount: bigint;
      transactionType: TransactionType;
      relatedUser: Principal | null;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.addTransaction(userId, amount, transactionType, relatedUser);
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["myTransactions", "allUsers"] }),
  });
}

export function useAwardDirectReferralIncome() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      toUser,
      amount,
      fromUser,
    }: { toUser: Principal; amount: bigint; fromUser: Principal | null }) => {
      if (!actor) throw new Error("Not connected");
      return actor.awardDirectReferralIncome(toUser, amount, fromUser);
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["allUsers", "withdrawals"] }),
  });
}

export function useAwardBinaryPairIncome() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      toUser,
      amount,
    }: { toUser: Principal; amount: bigint }) => {
      if (!actor) throw new Error("Not connected");
      return actor.awardBinaryPairIncome(toUser, amount);
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["allUsers", "withdrawals"] }),
  });
}

export function useAwardLevelIncome() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      toUser,
      amount,
      level,
      fromUser,
    }: {
      toUser: Principal;
      amount: bigint;
      level: bigint;
      fromUser: Principal | null;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.awardLevelIncome(toUser, amount, level, fromUser);
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["allUsers", "withdrawals"] }),
  });
}
