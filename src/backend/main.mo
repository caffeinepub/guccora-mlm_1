import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import List "mo:core/List";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Int "mo:core/Int";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Types
  public type User = {
    userId : Principal;
    username : Text;
    fullName : Text;
    email : Text;
    phone : Text;
    sponsorId : Principal;
    position : Position;
    joinDate : Time.Time;
    rank : Rank;
    isActive : Bool;
    leftChild : ?Principal;
    rightChild : ?Principal;
    leftVolume : Nat;
    rightVolume : Nat;
  };

  public type UserProfile = {
    username : Text;
    fullName : Text;
    email : Text;
    phone : Text;
    rank : Rank;
    joinDate : Time.Time;
    isActive : Bool;
  };

  public type Position = {
    #left;
    #right;
  };

  public type Rank = {
    #starter;
    #bronze;
    #silver;
    #gold;
    #platinum;
    #diamond;
  };

  public type Wallet = {
    userId : Principal;
    totalEarnings : Nat;
    availableBalance : Nat;
    pendingBalance : Nat;
    withdrawnAmount : Nat;
  };

  public type Transaction = {
    transactionId : Text;
    userId : Principal;
    amount : Nat;
    transactionType : TransactionType;
    date : Time.Time;
    status : TransactionStatus;
    relatedUser : ?Principal;
  };

  public type TransactionType = {
    #binaryCommission;
    #directReferralBonus;
    #rankBonus;
    #withdrawal;
    #adjustment;
  };

  public type TransactionStatus = {
    #pending;
    #approved;
    #rejected;
  };

  public type Package = {
    id : Nat;
    name : Text;
    price : Nat;
    benefits : Text;
  };

  public type PackagePurchase = {
    userId : Principal;
    packageId : Nat;
    purchaseDate : Time.Time;
  };

  public type Announcement = {
    title : Text;
    content : Text;
    createdAt : Time.Time;
  };

  public type WithdrawalRequest = {
    requestId : Text;
    userId : Principal;
    amount : Nat;
    status : TransactionStatus;
    requestDate : Time.Time;
    processedDate : ?Time.Time;
    paymentMethod : Text;
    paymentDetails : Text;
  };

  module User {
    public func compare(a : User, b : User) : Order.Order {
      principalToText(a.userId).compare(principalToText(b.userId));
    };

    func principalToText(principal : Principal) : Text {
      principal.toText();
    };
  };

  module Transaction {
    public func compare(a : Transaction, b : Transaction) : Order.Order {
      a.transactionId.compare(b.transactionId);
    };
  };

  // Authorization system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Data stores
  let users = Map.empty<Principal, User>();
  let wallets = Map.empty<Principal, Wallet>();
  let transactions = Map.empty<Text, Transaction>();
  let packages = Map.empty<Nat, Package>();
  let announcements = Map.empty<Nat, Announcement>();
  let withdrawalRequests = Map.empty<Text, WithdrawalRequest>();
  var packagePurchases = List.empty<(Principal, Nat)>();
  var nextTransactionId : Nat = 0;
  var nextWithdrawalId : Nat = 0;
  var nextAnnouncementId : Nat = 0;

  // Helper function to generate transaction ID
  func generateTransactionId() : Text {
    let id = nextTransactionId;
    nextTransactionId += 1;
    "TX" # id.toText();
  };

  // Helper function to generate withdrawal ID
  func generateWithdrawalId() : Text {
    let id = nextWithdrawalId;
    nextWithdrawalId += 1;
    "WD" # id.toText();
  };

  // User Profile Functions (Required by Frontend)
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    
    switch (users.get(caller)) {
      case null { null };
      case (?user) {
        ?{
          username = user.username;
          fullName = user.fullName;
          email = user.email;
          phone = user.phone;
          rank = user.rank;
          joinDate = user.joinDate;
          isActive = user.isActive;
        };
      };
    };
  };

  public query ({ caller }) func getUserProfile(userId : Principal) : async ?UserProfile {
    if (caller != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile or be an admin");
    };
    
    switch (users.get(userId)) {
      case null { null };
      case (?user) {
        ?{
          username = user.username;
          fullName = user.fullName;
          email = user.email;
          phone = user.phone;
          rank = user.rank;
          joinDate = user.joinDate;
          isActive = user.isActive;
        };
      };
    };
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    
    switch (users.get(caller)) {
      case null {
        Runtime.trap("User not found");
      };
      case (?existingUser) {
        let updatedUser : User = {
          userId = existingUser.userId;
          username = profile.username;
          fullName = profile.fullName;
          email = profile.email;
          phone = profile.phone;
          sponsorId = existingUser.sponsorId;
          position = existingUser.position;
          joinDate = existingUser.joinDate;
          rank = existingUser.rank;
          isActive = existingUser.isActive;
          leftChild = existingUser.leftChild;
          rightChild = existingUser.rightChild;
          leftVolume = existingUser.leftVolume;
          rightVolume = existingUser.rightVolume;
        };
        users.add(caller, updatedUser);
      };
    };
  };

  // User registration - Anyone can register (including guests)
  public shared ({ caller }) func registerUser(username : Text, fullName : Text, email : Text, phone : Text, sponsorId : Principal, position : Position) : async Principal {
    assert (username.size() > 2 and fullName.size() > 5 and email.size() > 5);

    if (users.containsKey(caller)) {
      Runtime.trap("User already registered");
    };

    let newUser : User = {
      userId = caller;
      username;
      fullName;
      email;
      phone;
      sponsorId;
      position;
      rank = #starter;
      isActive = true;
      joinDate = Time.now();
      leftChild = null;
      rightChild = null;
      leftVolume = 0;
      rightVolume = 0;
    };

    users.add(caller, newUser);
    wallets.add(
      caller,
      {
        userId = caller;
        totalEarnings = 0;
        availableBalance = 0;
        pendingBalance = 0;
        withdrawnAmount = 0;
      },
    );
    caller;
  };

  // Get user info - Users can view any user's basic info
  public query ({ caller }) func getUser(userId : Principal) : async ?User {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view user information");
    };
    users.get(userId);
  };

  // Get all users - Admin only
  public query ({ caller }) func getAllUsers() : async [User] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all users");
    };
    users.values().toArray().sort();
  };

  // Create first admin - Only works if no users exist
  public shared ({ caller }) func createFirstAdmin() : async () {
    if (not users.isEmpty()) {
      Runtime.trap("Admin already exists");
    };
    
    let adminUser : User = {
      userId = caller;
      username = "admin";
      fullName = "Admin User";
      email = "admin@example.com";
      phone = "";
      sponsorId = caller;
      position = #left;
      joinDate = Time.now();
      rank = #starter;
      isActive = true;
      leftChild = null;
      rightChild = null;
      leftVolume = 0;
      rightVolume = 0;
    };
    users.add(caller, adminUser);
    wallets.add(
      caller,
      {
        userId = caller;
        totalEarnings = 0;
        availableBalance = 0;
        pendingBalance = 0;
        withdrawnAmount = 0;
      },
    );
  };

  // Package management - Anyone can view packages
  public query ({ caller }) func getAllPackages() : async [Package] {
    packages.values().toArray();
  };

  // Add package - Admin only
  public shared ({ caller }) func addPackage(name : Text, price : Nat, benefits : Text) : async Nat {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add packages");
    };
    
    let packageId = packages.size();
    let newPackage : Package = {
      id = packageId;
      name;
      price;
      benefits;
    };
    packages.add(packageId, newPackage);
    packageId;
  };

  // Purchase package - Users only
  public shared ({ caller }) func purchasePackage(packageId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can purchase packages");
    };
    
    if (not users.containsKey(caller)) {
      Runtime.trap("User not registered");
    };
    
    if (not packages.containsKey(packageId)) {
      Runtime.trap("Package not found");
    };
    
    packagePurchases.put(0, (caller, packageId));
  };

  // Announcements - Anyone can view
  public query ({ caller }) func getAllAnnouncements() : async [Announcement] {
    announcements.values().toArray();
  };

  // Add announcement - Admin only
  public shared ({ caller }) func addAnnouncement(title : Text, content : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add announcements");
    };
    
    let announcementId = nextAnnouncementId;
    nextAnnouncementId += 1;
    
    let announcement : Announcement = {
      title;
      content;
      createdAt = Time.now();
    };
    announcements.add(announcementId, announcement);
  };

  // Wallet functions - Users can only view their own wallet, admins can view any
  public query ({ caller }) func getUserWallet(userId : Principal) : async ?Wallet {
    if (caller != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own wallet or be an admin");
    };
    wallets.get(userId);
  };

  // Get caller's wallet - Users only
  public query ({ caller }) func getMyWallet() : async ?Wallet {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view wallets");
    };
    wallets.get(caller);
  };

  // Transaction functions - Users can only view their own transactions, admins can view any
  public query ({ caller }) func getUserTransactions(userId : Principal) : async [Transaction] {
    if (caller != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own transactions or be an admin");
    };
    
    transactions.values().toArray().filter(
      func(tx) { tx.userId == userId }
    );
  };

  // Get caller's transactions - Users only
  public query ({ caller }) func getMyTransactions() : async [Transaction] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view transactions");
    };
    
    transactions.values().toArray().filter(
      func(tx) { tx.userId == caller }
    );
  };

  // Add transaction - Admin only
  public shared ({ caller }) func addTransaction(userId : Principal, amount : Nat, transactionType : TransactionType, relatedUser : ?Principal) : async Text {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add transactions");
    };
    
    let transactionId = generateTransactionId();
    let transaction : Transaction = {
      transactionId;
      userId;
      amount;
      transactionType;
      date = Time.now();
      status = #approved;
      relatedUser;
    };
    transactions.add(transactionId, transaction);
    transactionId;
  };

  // Withdrawal request - Users can only request for themselves
  public shared ({ caller }) func requestWithdrawal(amount : Nat, paymentMethod : Text, paymentDetails : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can request withdrawals");
    };
    
    switch (wallets.get(caller)) {
      case null {
        Runtime.trap("Wallet not found");
      };
      case (?wallet) {
        if (wallet.availableBalance < amount) {
          Runtime.trap("Insufficient balance");
        };
        
        let requestId = generateWithdrawalId();
        let request : WithdrawalRequest = {
          requestId;
          userId = caller;
          amount;
          status = #pending;
          requestDate = Time.now();
          processedDate = null;
          paymentMethod;
          paymentDetails;
        };
        withdrawalRequests.add(requestId, request);
        requestId;
      };
    };
  };

  // Get withdrawal requests - Users can only see their own, admins can see all
  public query ({ caller }) func getWithdrawalRequests(userId : ?Principal) : async [WithdrawalRequest] {
    switch (userId) {
      case null {
        // Get all requests - Admin only
        if (not (AccessControl.isAdmin(accessControlState, caller))) {
          Runtime.trap("Unauthorized: Only admins can view all withdrawal requests");
        };
        withdrawalRequests.values().toArray();
      };
      case (?uid) {
        // Get specific user's requests
        if (caller != uid and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own withdrawal requests or be an admin");
        };
        withdrawalRequests.values().toArray().filter(
          func(req) { req.userId == uid }
        );
      };
    };
  };

  // Approve/reject withdrawal - Admin only
  public shared ({ caller }) func processWithdrawalRequest(requestId : Text, approve : Bool) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can process withdrawal requests");
    };
    
    switch (withdrawalRequests.get(requestId)) {
      case null {
        Runtime.trap("Withdrawal request not found");
      };
      case (?request) {
        if (request.status != #pending) {
          Runtime.trap("Withdrawal request already processed");
        };
        
        let updatedRequest : WithdrawalRequest = {
          requestId = request.requestId;
          userId = request.userId;
          amount = request.amount;
          status = if (approve) { #approved } else { #rejected };
          requestDate = request.requestDate;
          processedDate = ?Time.now();
          paymentMethod = request.paymentMethod;
          paymentDetails = request.paymentDetails;
        };
        withdrawalRequests.add(requestId, updatedRequest);
        
        if (approve) {
          // Update wallet
          switch (wallets.get(request.userId)) {
            case null {};
            case (?wallet) {
              let updatedWallet : Wallet = {
                userId = wallet.userId;
                totalEarnings = wallet.totalEarnings;
                availableBalance = wallet.availableBalance - request.amount;
                pendingBalance = wallet.pendingBalance;
                withdrawnAmount = wallet.withdrawnAmount + request.amount;
              };
              wallets.add(request.userId, updatedWallet);
            };
          };
        };
      };
    };
  };

  // Update user rank - Admin only
  public shared ({ caller }) func updateUserRank(userId : Principal, newRank : Rank) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update user ranks");
    };
    
    switch (users.get(userId)) {
      case null {
        Runtime.trap("User not found");
      };
      case (?user) {
        let updatedUser : User = {
          userId = user.userId;
          username = user.username;
          fullName = user.fullName;
          email = user.email;
          phone = user.phone;
          sponsorId = user.sponsorId;
          position = user.position;
          joinDate = user.joinDate;
          rank = newRank;
          isActive = user.isActive;
          leftChild = user.leftChild;
          rightChild = user.rightChild;
          leftVolume = user.leftVolume;
          rightVolume = user.rightVolume;
        };
        users.add(userId, updatedUser);
      };
    };
  };

  // Activate/deactivate user - Admin only
  public shared ({ caller }) func setUserActiveStatus(userId : Principal, isActive : Bool) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can change user active status");
    };
    
    switch (users.get(userId)) {
      case null {
        Runtime.trap("User not found");
      };
      case (?user) {
        let updatedUser : User = {
          userId = user.userId;
          username = user.username;
          fullName = user.fullName;
          email = user.email;
          phone = user.phone;
          sponsorId = user.sponsorId;
          position = user.position;
          joinDate = user.joinDate;
          rank = user.rank;
          isActive;
          leftChild = user.leftChild;
          rightChild = user.rightChild;
          leftVolume = user.leftVolume;
          rightVolume = user.rightVolume;
        };
        users.add(userId, updatedUser);
      };
    };
  };

  // Get global stats - Admin only
  public query ({ caller }) func getGlobalStats() : async {
    totalUsers : Nat;
    activeUsers : Nat;
    totalPaidOut : Nat;
  } {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view global stats");
    };
    
    let allUsers = users.values().toArray();
    let activeCount = allUsers.filter(func(u : User) : Bool { u.isActive }).size();
    
    var totalPaid : Nat = 0;
    for (wallet in wallets.values()) {
      totalPaid += wallet.withdrawnAmount;
    };
    
    {
      totalUsers = users.size();
      activeUsers = activeCount;
      totalPaidOut = totalPaid;
    };
  };
};
