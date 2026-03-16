import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Time "mo:core/Time";

module {
  type Position = {
    #left;
    #right;
  };

  type Rank = {
    #starter;
    #bronze;
    #silver;
    #gold;
    #platinum;
    #diamond;
  };

  type User = {
    userId : Principal.Principal;
    username : Text;
    fullName : Text;
    email : Text;
    phone : Text;
    sponsorId : Principal.Principal;
    position : Position;
    joinDate : Time.Time;
    rank : Rank;
    isActive : Bool;
    leftChild : ?Principal.Principal;
    rightChild : ?Principal.Principal;
    leftVolume : Nat;
    rightVolume : Nat;
    sponsorCode : ?Text;
  };

  type Wallet = {
    userId : Principal.Principal;
    totalEarnings : Nat;
    availableBalance : Nat;
    pendingBalance : Nat;
    withdrawnAmount : Nat;
  };

  type TransactionStatus = {
    #pending;
    #approved;
    #rejected;
  };

  type TransactionTypeV1 = {
    #binaryCommission;
    #directReferralBonus;
    #rankBonus;
    #withdrawal;
    #adjustment;
  };

  type TransactionTypeV2 = {
    #binaryCommission;
    #directReferralBonus;
    #rankBonus;
    #withdrawal;
    #adjustment;
    #levelIncome;
  };

  type TransactionV1 = {
    transactionId : Text;
    userId : Principal.Principal;
    amount : Nat;
    transactionType : TransactionTypeV1;
    date : Time.Time;
    status : TransactionStatus;
    relatedUser : ?Principal.Principal;
  };

  type TransactionV2 = {
    transactionId : Text;
    userId : Principal.Principal;
    amount : Nat;
    transactionType : TransactionTypeV2;
    date : Time.Time;
    status : TransactionStatus;
    relatedUser : ?Principal.Principal;
  };

  type Package = {
    id : Nat;
    name : Text;
    price : Nat;
    benefits : Text;
  };

  type Announcement = {
    title : Text;
    content : Text;
    createdAt : Time.Time;
  };

  type WithdrawalRequest = {
    requestId : Text;
    userId : Principal.Principal;
    amount : Nat;
    status : TransactionStatus;
    requestDate : Time.Time;
    processedDate : ?Time.Time;
    paymentMethod : Text;
    paymentDetails : Text;
  };

  type OldActor = {
    users : Map.Map<Principal.Principal, User>;
    wallets : Map.Map<Principal.Principal, Wallet>;
    transactions : Map.Map<Text, TransactionV1>;
    packages : Map.Map<Nat, Package>;
    announcements : Map.Map<Nat, Announcement>;
    withdrawalRequests : Map.Map<Text, WithdrawalRequest>;
    packagePurchases : List.List<(Principal.Principal, Nat)>;
    nextTransactionId : Nat;
    nextWithdrawalId : Nat;
    nextAnnouncementId : Nat;
  };

  type NewActor = {
    users : Map.Map<Principal.Principal, User>;
    wallets : Map.Map<Principal.Principal, Wallet>;
    transactions : Map.Map<Text, TransactionV2>;
    packages : Map.Map<Nat, Package>;
    announcements : Map.Map<Nat, Announcement>;
    withdrawalRequests : Map.Map<Text, WithdrawalRequest>;
    packagePurchases : List.List<(Principal.Principal, Nat)>;
    nextTransactionId : Nat;
    nextWithdrawalId : Nat;
    nextAnnouncementId : Nat;
  };

  // Map old TransactionV1 to new TransactionV2
  func toTransactionV2(tx : TransactionV1) : TransactionV2 {
    let newType : TransactionTypeV2 = switch (tx.transactionType) {
      case (#binaryCommission) { #binaryCommission };
      case (#directReferralBonus) { #directReferralBonus };
      case (#rankBonus) { #rankBonus };
      case (#withdrawal) { #withdrawal };
      case (#adjustment) { #adjustment };
    };
    {
      transactionId = tx.transactionId;
      userId = tx.userId;
      amount = tx.amount;
      transactionType = newType;
      date = tx.date;
      status = tx.status;
      relatedUser = tx.relatedUser;
    };
  };

  public func run(old : OldActor) : NewActor {
    let newTransactions = old.transactions.map<Text, TransactionV1, TransactionV2>(
      func(_, txV1) { toTransactionV2(txV1) }
    );
    { old with transactions = newTransactions };
  };
};
