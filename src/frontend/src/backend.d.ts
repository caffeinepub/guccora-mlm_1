import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Wallet {
    availableBalance: bigint;
    userId: Principal;
    totalEarnings: bigint;
    pendingBalance: bigint;
    withdrawnAmount: bigint;
}
export type Time = bigint;
export interface User {
    username: string;
    joinDate: Time;
    userId: Principal;
    rightChild?: Principal;
    rank: Rank;
    sponsorId: Principal;
    leftChild?: Principal;
    fullName: string;
    isActive: boolean;
    email: string;
    leftVolume: bigint;
    phone: string;
    rightVolume: bigint;
    position: Position;
}
export interface Announcement {
    title: string;
    content: string;
    createdAt: Time;
}
export interface WithdrawalRequest {
    status: TransactionStatus;
    requestId: string;
    paymentMethod: string;
    userId: Principal;
    paymentDetails: string;
    processedDate?: Time;
    amount: bigint;
    requestDate: Time;
}
export interface Package {
    id: bigint;
    name: string;
    benefits: string;
    price: bigint;
}
export interface UserProfile {
    username: string;
    joinDate: Time;
    rank: Rank;
    fullName: string;
    isActive: boolean;
    email: string;
    phone: string;
}
export interface Transaction {
    status: TransactionStatus;
    transactionType: TransactionType;
    userId: Principal;
    date: Time;
    amount: bigint;
    relatedUser?: Principal;
    transactionId: string;
}
export enum Position {
    left = "left",
    right = "right"
}
export enum Rank {
    bronze = "bronze",
    starter = "starter",
    gold = "gold",
    diamond = "diamond",
    platinum = "platinum",
    silver = "silver"
}
export enum TransactionStatus {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
}
export enum TransactionType {
    adjustment = "adjustment",
    directReferralBonus = "directReferralBonus",
    rankBonus = "rankBonus",
    withdrawal = "withdrawal",
    binaryCommission = "binaryCommission"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addAnnouncement(title: string, content: string): Promise<void>;
    addPackage(name: string, price: bigint, benefits: string): Promise<bigint>;
    addTransaction(userId: Principal, amount: bigint, transactionType: TransactionType, relatedUser: Principal | null): Promise<string>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createFirstAdmin(): Promise<void>;
    getAllAnnouncements(): Promise<Array<Announcement>>;
    getAllPackages(): Promise<Array<Package>>;
    getAllUsers(): Promise<Array<User>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getGlobalStats(): Promise<{
        activeUsers: bigint;
        totalPaidOut: bigint;
        totalUsers: bigint;
    }>;
    getMyTransactions(): Promise<Array<Transaction>>;
    getMyWallet(): Promise<Wallet | null>;
    getUser(userId: Principal): Promise<User | null>;
    getUserProfile(userId: Principal): Promise<UserProfile | null>;
    getUserTransactions(userId: Principal): Promise<Array<Transaction>>;
    getUserWallet(userId: Principal): Promise<Wallet | null>;
    getWithdrawalRequests(userId: Principal | null): Promise<Array<WithdrawalRequest>>;
    isCallerAdmin(): Promise<boolean>;
    processWithdrawalRequest(requestId: string, approve: boolean): Promise<void>;
    purchasePackage(packageId: bigint): Promise<void>;
    registerUser(username: string, fullName: string, email: string, phone: string, sponsorId: Principal, position: Position): Promise<Principal>;
    requestWithdrawal(amount: bigint, paymentMethod: string, paymentDetails: string): Promise<string>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setUserActiveStatus(userId: Principal, isActive: boolean): Promise<void>;
    updateUserRank(userId: Principal, newRank: Rank): Promise<void>;
}
