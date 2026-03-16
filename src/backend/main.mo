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
    sponsorCode : ?Text;
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
    #levelIncome;
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

  public type IncomeStats = {
    directReferral : Nat;
    binaryPair : Nat;
    levelIncome : Nat;
    rankBonus : Nat;
    totalIncome : Nat;
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

  // ── STABLE STORAGE (persists data across canister upgrades) ──────────────
  stable var _usersStable : [(Principal, User)] = [];
  stable var _walletsStable : [(Principal, Wallet)] = [];
  stable var _transactionsStable : [(Text, Transaction)] = [];
  stable var _withdrawalRequestsStable : [(Text, WithdrawalRequest)] = [];
  stable var _packagesStable : [(Nat, Package)] = [];
  stable var _announcementsStable : [(Nat, Announcement)] = [];
  stable var _nextTransactionIdStable : Nat = 0;
  stable var _nextWithdrawalIdStable : Nat = 0;
  stable var _nextAnnouncementIdStable : Nat = 0;
  stable var _adminPassword : Text = "admin123";

  // Serialize all Maps into stable arrays before the upgrade wasm swap.
  system func preupgrade() {
    _usersStable := users.toArray();
    _walletsStable := wallets.toArray();
    _transactionsStable := transactions.toArray();
    _withdrawalRequestsStable := withdrawalRequests.toArray();
    _packagesStable := packages.toArray();
    _announcementsStable := announcements.toArray();
    _nextTransactionIdStable := nextTransactionId;
    _nextWithdrawalIdStable := nextWithdrawalId;
    _nextAnnouncementIdStable := nextAnnouncementId;
  };

  // Restore Maps from stable arrays after the upgrade and re-grant roles.
  system func postupgrade() {
    for ((k, v) in _usersStable.values()) { users.add(k, v) };
    for ((k, v) in _walletsStable.values()) { wallets.add(k, v) };
    for ((k, v) in _transactionsStable.values()) { transactions.add(k, v) };
    for ((k, v) in _withdrawalRequestsStable.values()) { withdrawalRequests.add(k, v) };
    for ((k, v) in _packagesStable.values()) { packages.add(k, v) };
    for ((k, v) in _announcementsStable.values()) { announcements.add(k, v) };
    nextTransactionId := _nextTransactionIdStable;
    nextWithdrawalId := _nextWithdrawalIdStable;
    nextAnnouncementId := _nextAnnouncementIdStable;

    // Re-grant access control roles from the restored users data.
    // The admin is whoever holds sponsorCode == "ADMIN001".
    for ((principal, user) in _usersStable.values()) {
      switch (user.sponsorCode) {
        case (?code) {
          if (code == "ADMIN001") {
            accessControlState.userRoles.add(principal, #admin);
            accessControlState.adminAssigned := true;
          } else {
            accessControlState.userRoles.add(principal, #user);
          };
        };
        case null {
          accessControlState.userRoles.add(principal, #user);
        };
      };
    };
  };
  // ── END STABLE STORAGE ────────────────────────────────────────────────────

  // ── ADMIN CHECK HELPER ────────────────────────────────────────────────────
  // Checks both the Caffeine accessControlState AND the users map (sponsorCode
  // == "ADMIN001") so admin actions work even when accessControlState has not
  // yet been restored from stable storage in the current session.
  func isAdminCaller(caller : Principal) : Bool {
    if (AccessControl.isAdmin(accessControlState, caller)) { return true };
    switch (users.get(caller)) {
      case (?u) {
        switch (u.sponsorCode) {
          case (?code) { code == "ADMIN001" };
          case null { false };
        };
      };
      case null { false };
    };
  };
  // ── END ADMIN CHECK HELPER ────────────────────────────────────────────────

  // Helper: check if ADMIN001 sponsor already exists in the users table
  func admin001Exists() : Bool {
    for ((_, user) in users.toArray().values()) {
      switch (user.sponsorCode) {
        case (? code) {
          if (code.toLower() == "admin001") { return true };
        };
        case (null) {};
      };
    };
    false;
  };

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

  // Helper function for income distribution
  func creditIncomeToWallet(userId : Principal, amount : Nat, txType : TransactionType, relatedUser : ?Principal) {
    let transactionId = generateTransactionId();
    let transaction : Transaction = {
      transactionId;
      userId;
      amount;
      transactionType = txType;
      date = Time.now();
      status = #approved;
      relatedUser;
    };
    transactions.add(transactionId, transaction);
    switch (wallets.get(userId)) {
      case (null) { Runtime.trap("Wallet not found for user") };
      case (?wallet) {
        let updatedWallet : Wallet = {
          userId = wallet.userId;
          totalEarnings = wallet.totalEarnings + amount;
          availableBalance = wallet.availableBalance + amount;
          pendingBalance = wallet.pendingBalance;
          withdrawnAmount = wallet.withdrawnAmount;
        };
        wallets.add(userId, updatedWallet);
      };
    };
  };


  // ── AUTO INCOME DISTRIBUTION ─────────────────────────────────────────────
  let DIRECT_REFERRAL_AMOUNT : Nat = 100;
  let BINARY_PAIR_AMOUNT     : Nat = 200;
  func levelIncomeAmount(level : Nat) : Nat {
    if (level == 1)      { 50 }
    else if (level == 2) { 40 }
    else if (level <= 5) { 20 }
    else                 { 10 }
  };

  func distributeLevelIncome(newUserPrincipal : Principal, baseAmount : Nat) {
    var current = newUserPrincipal;
    var level = 1;
    label levelLoop while (level <= 10) {
      switch (users.get(current)) {
        case null { break levelLoop };
        case (?u) {
          let sponsorPrinc = u.sponsorId;
          if (sponsorPrinc == current) { break levelLoop };
          switch (wallets.get(sponsorPrinc)) {
            case null {};
            case (?_) {
              let amt = (baseAmount * levelIncomeAmount(level)) / 1000;
              if (amt > 0) {
                creditIncomeToWallet(sponsorPrinc, amt, #levelIncome, ?newUserPrincipal);
              };
            };
          };
          current := sponsorPrinc;
          level += 1;
        };
      };
    };
  };

  func autoDistributeOnJoin(newUserPrincipal : Principal, sponsorPrincipal : Principal) {
    switch (wallets.get(sponsorPrincipal)) {
      case null {};
      case (?_) {
        creditIncomeToWallet(sponsorPrincipal, DIRECT_REFERRAL_AMOUNT, #directReferralBonus, ?newUserPrincipal);
      };
    };
    switch (users.get(sponsorPrincipal)) {
      case null {};
      case (?sp) {
        switch (sp.leftChild, sp.rightChild) {
          case (?_, ?_) {
            switch (wallets.get(sponsorPrincipal)) {
              case null {};
              case (?_) {
                creditIncomeToWallet(sponsorPrincipal, BINARY_PAIR_AMOUNT, #binaryCommission, ?newUserPrincipal);
              };
            };
          };
          case _ {};
        };
      };
    };
    distributeLevelIncome(newUserPrincipal, 1000);
  };

  func autoDistributeOnPlanActivation(buyer : Principal, packagePrice : Nat) {
    switch (users.get(buyer)) {
      case null {};
      case (?u) {
        let sponsorPrincipal = u.sponsorId;
        let directAmt = packagePrice / 10;
        switch (wallets.get(sponsorPrincipal)) {
          case null {};
          case (?_) {
            if (directAmt > 0) {
              creditIncomeToWallet(sponsorPrincipal, directAmt, #directReferralBonus, ?buyer);
            };
          };
        };
        distributeLevelIncome(buyer, packagePrice);
      };
    };
  };
  // ── END AUTO INCOME DISTRIBUTION ─────────────────────────────────────────

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
    if (caller != userId and not isAdminCaller(caller)) {
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
          sponsorCode = existingUser.sponsorCode;
        };
        users.add(caller, updatedUser);
      };
    };
  };

  // User registration - Anyone can register (including guests)
  public shared ({ caller }) func registerUser(
    username : Text,
    fullName : Text,
    email : Text,
    phone : Text,
    sponsorId : Principal,
    position : Position,
    sponsorCode : ?Text,
  ) : async Principal {
    if (username.size() < 3) {
      Runtime.trap("Username must be at least 3 characters");
    };
    if (fullName.size() < 2) {
      Runtime.trap("Full name is required");
    };
    if (email.size() < 6) {
      Runtime.trap("A valid email address is required");
    };

    // Duplicate check (by username, email, phone)
    for ((_, existingUser) in users.toArray().values()) {
      if (existingUser.username.toLower() == username.toLower()) {
        Runtime.trap("Username already taken. Please choose a different username.");
      };
      if (existingUser.email.toLower() == email.toLower()) {
        Runtime.trap("Email address already registered. Please use a different email.");
      };
      if (existingUser.phone.size() > 0 and phone.size() > 0 and existingUser.phone == phone) {
        Runtime.trap("Phone number already registered. Please use a different phone number.");
      };
    };

    // Sponsor validation
    let sponsor = switch (users.get(sponsorId)) {
      case null {
        Runtime.trap("Sponsor not found. Make sure ADMIN001 has been set up at /admin before registering.");
      };
      case (?s) { s };
    };

    // Binary position availability check
    switch (position) {
      case (#left) {
        switch (sponsor.leftChild) {
          case (?_) {
            Runtime.trap("The left position under this sponsor is already occupied. Please choose the right position.");
          };
          case null {};
        };
      };
      case (#right) {
        switch (sponsor.rightChild) {
          case (?_) {
            Runtime.trap("The right position under this sponsor is already occupied. Please choose the left position.");
          };
          case null {};
        };
      };
    };

    // Create new user and save to users map
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
      sponsorCode;
    };
    users.add(caller, newUser);

    // Update sponsor's child pointer in the binary tree
    let updatedSponsor : User = {
      userId = sponsor.userId;
      username = sponsor.username;
      fullName = sponsor.fullName;
      email = sponsor.email;
      phone = sponsor.phone;
      sponsorId = sponsor.sponsorId;
      position = sponsor.position;
      joinDate = sponsor.joinDate;
      rank = sponsor.rank;
      isActive = sponsor.isActive;
      leftChild = switch (position) {
        case (#left) { ?caller };
        case (#right) { sponsor.leftChild };
      };
      rightChild = switch (position) {
        case (#right) { ?caller };
        case (#left) { sponsor.rightChild };
      };
      leftVolume = sponsor.leftVolume;
      rightVolume = sponsor.rightVolume;
      sponsorCode = sponsor.sponsorCode;
    };
    users.add(sponsorId, updatedSponsor);

    // Create wallet for new user
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

    // Grant #user role so the new member can access all user APIs
    accessControlState.userRoles.add(caller, #user);

    // Auto income distribution on join
    autoDistributeOnJoin(caller, sponsorId);

    caller;
  };

  // Get user info - Users can view any user's basic info
  public query ({ caller }) func getUser(userId : Principal) : async ?User {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view user information");
    };
    users.get(userId);
  };

  // Get all users - Admin only.
  public query ({ caller }) func getAllUsers() : async [User] {
    if (not isAdminCaller(caller)) {
      Runtime.trap("Unauthorized: Only admins can view all users");
    };
    users.values().toArray();
  };

  // Create first admin
  public shared ({ caller }) func createFirstAdmin() : async () {
    if (admin001Exists()) {
      Runtime.trap("Admin already exists");
    };
    if (users.containsKey(caller) and not isAdminCaller(caller)) {
      Runtime.trap("Caller is already registered as a regular user");
    };
    let adminUser : User = {
      userId = caller;
      username = "admin";
      fullName = "GUCCORA Admin";
      email = "admin@guccora.com";
      phone = "";
      sponsorId = caller;
      position = #left;
      joinDate = Time.now();
      rank = #diamond;
      isActive = true;
      leftChild = null;
      rightChild = null;
      leftVolume = 0;
      rightVolume = 0;
      sponsorCode = ?"ADMIN001";
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
    accessControlState.userRoles.add(caller, #admin);
    accessControlState.adminAssigned := true;
  };

  // Allow any authenticated IC principal to claim admin by providing the password.
  // This links the caller principal to ADMIN001 so backend actions work.
  public shared ({ caller }) func loginAsAdmin(password : Text) : async Bool {
    if (caller.isAnonymous()) { return false };
    if (password != _adminPassword) { return false };
    // Create or update admin entry for this principal
    if (not users.containsKey(caller)) {
      let adminUser : User = {
        userId = caller;
        username = "admin";
        fullName = "GUCCORA Admin";
        email = "admin@guccora.com";
        phone = "";
        sponsorId = caller;
        position = #left;
        joinDate = Time.now();
        rank = #diamond;
        isActive = true;
        leftChild = null;
        rightChild = null;
        leftVolume = 0;
        rightVolume = 0;
        sponsorCode = ?"ADMIN001";
      };
      users.add(caller, adminUser);
      wallets.add(caller, {
        userId = caller;
        totalEarnings = 0;
        availableBalance = 0;
        pendingBalance = 0;
        withdrawnAmount = 0;
      });
    } else {
      // Update existing entry to have ADMIN001 sponsorCode
      switch (users.get(caller)) {
        case (?u) {
          let updated : User = {
            userId = u.userId;
            username = u.username;
            fullName = u.fullName;
            email = u.email;
            phone = u.phone;
            sponsorId = u.sponsorId;
            position = u.position;
            joinDate = u.joinDate;
            rank = #diamond;
            isActive = true;
            leftChild = u.leftChild;
            rightChild = u.rightChild;
            leftVolume = u.leftVolume;
            rightVolume = u.rightVolume;
            sponsorCode = ?"ADMIN001";
          };
          users.add(caller, updated);
        };
        case null {};
      };
    };
    // Grant admin role in access control
    accessControlState.userRoles.add(caller, #admin);
    accessControlState.adminAssigned := true;
    true;
  };

  public query func isAdminConfigured() : async Bool {
    admin001Exists();
  };

  public query func lookupSponsorByCode(code : Text) : async ?Principal {
    let usersArray = users.toArray();
    for ((principal, user) in usersArray.values()) {
      switch (user.sponsorCode) {
        case (null) {};
        case (?userCode) {
          if (userCode.toLower() == code.toLower()) {
            return ?principal;
          };
        };
      };
    };
    null;
  };

  public query ({ caller }) func getAllPackages() : async [Package] {
    packages.values().toArray();
  };

  public shared ({ caller }) func addPackage(name : Text, price : Nat, benefits : Text) : async Nat {
    if (not isAdminCaller(caller)) {
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

    switch (packages.get(packageId)) {
      case null {};
      case (?pkg) {
        autoDistributeOnPlanActivation(caller, pkg.price);
      };
    };
  };

  public query ({ caller }) func getAllAnnouncements() : async [Announcement] {
    announcements.values().toArray();
  };

  public shared ({ caller }) func addAnnouncement(title : Text, content : Text) : async () {
    if (not isAdminCaller(caller)) {
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

  public query ({ caller }) func getUserWallet(userId : Principal) : async ?Wallet {
    if (caller != userId and not isAdminCaller(caller)) {
      Runtime.trap("Unauthorized: Can only view your own wallet or be an admin");
    };
    wallets.get(userId);
  };

  public query ({ caller }) func getMyWallet() : async ?Wallet {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view wallets");
    };
    wallets.get(caller);
  };

  public query ({ caller }) func getUserTransactions(userId : Principal) : async [Transaction] {
    if (caller != userId and not isAdminCaller(caller)) {
      Runtime.trap("Unauthorized: Can only view your own transactions or be an admin");
    };
    transactions.values().toArray().filter(
      func(tx) { tx.userId == userId }
    );
  };

  public query ({ caller }) func getMyTransactions() : async [Transaction] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view transactions");
    };
    transactions.values().toArray().filter(
      func(tx) { tx.userId == caller }
    );
  };

  public shared ({ caller }) func addTransaction(userId : Principal, amount : Nat, transactionType : TransactionType, relatedUser : ?Principal) : async Text {
    if (not isAdminCaller(caller)) {
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
    
    switch (transactionType) {
      case (#withdrawal) {};
      case (#adjustment) {};
      case (_) {
        switch (wallets.get(userId)) {
          case (null) { Runtime.trap("Wallet not found for user") };
          case (?wallet) {
            let updatedWallet : Wallet = {
              userId = wallet.userId;
              totalEarnings = wallet.totalEarnings + amount;
              availableBalance = wallet.availableBalance + amount;
              pendingBalance = wallet.pendingBalance;
              withdrawnAmount = wallet.withdrawnAmount;
            };
            wallets.add(userId, updatedWallet);
          };
        };
      };
    };
    
    transactionId;
  };

  public shared ({ caller }) func awardDirectReferralIncome(toUser : Principal, amount : Nat, fromUser : ?Principal) : async () {
    if (not isAdminCaller(caller)) {
      Runtime.trap("Unauthorized: Only admins can award direct referral income");
    };
    creditIncomeToWallet(toUser, amount, #directReferralBonus, fromUser);
  };

  public shared ({ caller }) func awardBinaryPairIncome(toUser : Principal, amount : Nat) : async () {
    if (not isAdminCaller(caller)) {
      Runtime.trap("Unauthorized: Only admins can award binary pair income");
    };
    creditIncomeToWallet(toUser, amount, #binaryCommission, null);
  };

  public shared ({ caller }) func awardLevelIncome(toUser : Principal, amount : Nat, level : Nat, fromUser : ?Principal) : async () {
    if (not isAdminCaller(caller)) {
      Runtime.trap("Unauthorized: Only admins can award level income");
    };
    if (level < 1 or level > 10) { Runtime.trap("Income level must be between 1 and 10") };
    creditIncomeToWallet(toUser, amount, #levelIncome, fromUser);
  };

  public query ({ caller }) func getIncomeStats(userId : Principal) : async IncomeStats {
    if (caller != userId and not isAdminCaller(caller)) {
      Runtime.trap("Unauthorized: Can only view your own stats or be an admin");
    };

    let userTransactions = transactions.values().toArray().filter(
      func(tx) { tx.userId == userId and tx.status == #approved }
    );

    var directReferral = 0;
    var binaryPair = 0;
    var levelIncome = 0;
    var rankBonus = 0;

    for (tx in userTransactions.values()) {
      switch (tx.transactionType) {
        case (#directReferralBonus) { directReferral += tx.amount };
        case (#binaryCommission) { binaryPair += tx.amount };
        case (#levelIncome) { levelIncome += tx.amount };
        case (#rankBonus) { rankBonus += tx.amount };
        case (_) {};
      };
    };

    {
      directReferral;
      binaryPair;
      levelIncome;
      rankBonus;
      totalIncome = directReferral + binaryPair + levelIncome + rankBonus;
    };
  };

  public query ({ caller }) func getMyIncomeStats() : async IncomeStats {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view income stats");
    };
    
    let userTransactions = transactions.values().toArray().filter(
      func(tx) { tx.userId == caller and tx.status == #approved }
    );

    var directReferral = 0;
    var binaryPair = 0;
    var levelIncome = 0;
    var rankBonus = 0;

    for (tx in userTransactions.values()) {
      switch (tx.transactionType) {
        case (#directReferralBonus) { directReferral += tx.amount };
        case (#binaryCommission) { binaryPair += tx.amount };
        case (#levelIncome) { levelIncome += tx.amount };
        case (#rankBonus) { rankBonus += tx.amount };
        case (_) {};
      };
    };

    {
      directReferral;
      binaryPair;
      levelIncome;
      rankBonus;
      totalIncome = directReferral + binaryPair + levelIncome + rankBonus;
    };
  };

  public query ({ caller }) func getMyWithdrawalRequests() : async [WithdrawalRequest] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view withdrawal requests");
    };
    withdrawalRequests.values().toArray().filter(
      func(req) { req.userId == caller }
    );
  };

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

  public query ({ caller }) func getWithdrawalRequests(userId : ?Principal) : async [WithdrawalRequest] {
    switch (userId) {
      case null {
        if (not isAdminCaller(caller)) {
          Runtime.trap("Unauthorized: Only admins can view all withdrawal requests");
        };
        withdrawalRequests.values().toArray();
      };
      case (?uid) {
        if (caller != uid and not isAdminCaller(caller)) {
          Runtime.trap("Unauthorized: Can only view your own withdrawal requests or be an admin");
        };
        withdrawalRequests.values().toArray().filter(
          func(req) { req.userId == uid }
        );
      };
    };
  };

  public shared ({ caller }) func processWithdrawalRequest(requestId : Text, approve : Bool) : async () {
    if (not isAdminCaller(caller)) {
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

  public shared ({ caller }) func updateUserRank(userId : Principal, newRank : Rank) : async () {
    if (not isAdminCaller(caller)) {
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
          sponsorCode = user.sponsorCode;
        };
        users.add(userId, updatedUser);
      };
    };
  };

  public shared ({ caller }) func setUserActiveStatus(userId : Principal, isActive : Bool) : async () {
    if (not isAdminCaller(caller)) {
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
          sponsorCode = user.sponsorCode;
        };
        users.add(userId, updatedUser);
      };
    };
  };

  public query ({ caller }) func getGlobalStats() : async {
    totalUsers : Nat;
    activeUsers : Nat;
    totalPaidOut : Nat;
  } {
    if (not isAdminCaller(caller)) {
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
