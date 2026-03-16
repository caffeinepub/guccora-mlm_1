import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Network } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { User } from "../../backend";
import { useAllUsers } from "../../hooks/useQueries";

type TreeNodeProps = {
  user: User | null;
  allUsers: User[];
  depth: number;
  position?: "left" | "right" | "root";
  maxDepth?: number;
};

function TreeNode({
  user,
  allUsers,
  depth,
  position,
  maxDepth = 5,
}: TreeNodeProps) {
  const [expanded, setExpanded] = useState(depth < 2);

  if (depth > maxDepth) return null;

  const leftChild = user?.leftChild
    ? (allUsers.find(
        (u) => u.userId.toString() === user.leftChild!.toString(),
      ) ?? null)
    : null;
  const rightChild = user?.rightChild
    ? (allUsers.find(
        (u) => u.userId.toString() === user.rightChild!.toString(),
      ) ?? null)
    : null;

  const hasChildren = leftChild || rightChild;

  return (
    <div className="flex flex-col items-center select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: depth * 0.07 }}
        className="relative"
      >
        {/* Connector line from parent */}
        {depth > 0 && (
          <div className="absolute -top-6 left-1/2 w-px h-6 bg-yellow-500/40" />
        )}

        <div
          className={`flex flex-col items-center p-3 rounded-xl border text-center w-28 relative z-10 transition-all cursor-pointer hover:shadow-md ${
            depth === 0
              ? "border-yellow-500/60 bg-yellow-500/10 shadow-yellow-500/10 shadow-lg"
              : position === "left"
                ? "border-purple-500/40 bg-purple-900/20"
                : "border-blue-500/40 bg-blue-900/20"
          }`}
          onClick={() => hasChildren && setExpanded(!expanded)}
          onKeyDown={(e) =>
            e.key === "Enter" && hasChildren && setExpanded(!expanded)
          }
          role={hasChildren ? "button" : undefined}
          tabIndex={hasChildren ? 0 : undefined}
          aria-expanded={hasChildren ? expanded : undefined}
        >
          {user ? (
            <>
              <div
                className={`h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold mb-2 ${
                  depth === 0
                    ? "bg-yellow-500 text-black"
                    : "bg-muted text-foreground"
                }`}
              >
                {user.username?.slice(0, 2).toUpperCase() || "GC"}
              </div>
              <div className="text-xs font-semibold truncate w-full">
                {user.sponsorCode || user.username || "Member"}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {user.fullName?.split(" ")[0] || ""}
              </div>
              {position && position !== "root" && (
                <div
                  className={`text-xs font-medium mt-1 ${
                    position === "left" ? "text-purple-400" : "text-blue-400"
                  }`}
                >
                  {position.charAt(0).toUpperCase() + position.slice(1)}
                </div>
              )}
              <div className="mt-1.5">
                {user.isActive ? (
                  <Badge className="text-xs bg-emerald-500/20 text-emerald-400 border-emerald-500/30 px-1.5 py-0">
                    Active
                  </Badge>
                ) : (
                  <Badge className="text-xs bg-red-500/20 text-red-400 border-red-500/30 px-1.5 py-0">
                    Inactive
                  </Badge>
                )}
              </div>
              {hasChildren && (
                <div className="mt-1 text-xs text-muted-foreground">
                  {expanded ? "▲ collapse" : "▼ expand"}
                </div>
              )}
            </>
          ) : (
            <>
              <div className="h-9 w-9 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center mb-2">
                <span className="text-muted-foreground/50 text-lg">+</span>
              </div>
              <div className="text-xs text-muted-foreground/60">Open Slot</div>
              {position && position !== "root" && (
                <div
                  className={`text-xs font-medium mt-1 ${
                    position === "left"
                      ? "text-purple-400/50"
                      : "text-blue-400/50"
                  }`}
                >
                  {position.charAt(0).toUpperCase() + position.slice(1)}
                </div>
              )}
            </>
          )}
        </div>
      </motion.div>

      {/* Children */}
      {expanded &&
        depth < maxDepth &&
        (leftChild !== null ||
          rightChild !== null ||
          (user && (user.leftChild || user.rightChild))) && (
          <div className="relative mt-6">
            {/* Horizontal connector */}
            <div className="absolute top-0 left-[calc(50%-64px)] right-[calc(50%-64px)] h-px bg-yellow-500/40" />
            <div className="flex gap-6">
              <div className="flex flex-col items-center">
                <div className="w-px h-6 bg-yellow-500/40" />
                <TreeNode
                  user={leftChild}
                  allUsers={allUsers}
                  depth={depth + 1}
                  position="left"
                  maxDepth={maxDepth}
                />
              </div>
              <div className="flex flex-col items-center">
                <div className="w-px h-6 bg-yellow-500/40" />
                <TreeNode
                  user={rightChild}
                  allUsers={allUsers}
                  depth={depth + 1}
                  position="right"
                  maxDepth={maxDepth}
                />
              </div>
            </div>
          </div>
        )}
    </div>
  );
}

export function AdminTreePage() {
  const { data: allUsers, isLoading } = useAllUsers();

  const adminUser =
    (allUsers ?? []).find((u) => u.sponsorCode === "ADMIN001") ?? null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center">
          <Network size={20} className="text-red-400" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold flex items-center gap-2">
            Binary Tree View
          </h1>
          <p className="text-muted-foreground text-sm">
            Visual representation of the entire MLM network
          </p>
        </div>
      </div>

      <div className="flex gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <span className="text-muted-foreground">Admin/Root</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-purple-500/60" />
          <span className="text-muted-foreground">Left Leg</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-blue-500/60" />
          <span className="text-muted-foreground">Right Leg</span>
        </div>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-base">Network Structure</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div
              className="flex justify-center py-16"
              data-ocid="admin.tree.loading_state"
            >
              <div className="space-y-6 flex flex-col items-center">
                <Skeleton className="h-24 w-32" />
                <div className="flex gap-6">
                  <Skeleton className="h-24 w-28" />
                  <Skeleton className="h-24 w-28" />
                </div>
              </div>
            </div>
          ) : !adminUser ? (
            <div
              className="flex flex-col items-center justify-center py-20 text-center"
              data-ocid="admin.tree.empty_state"
            >
              <Network size={48} className="text-muted-foreground/20 mb-4" />
              <p className="text-muted-foreground font-medium">
                No members yet. Set up admin first.
              </p>
              <p className="text-muted-foreground/60 text-sm mt-1">
                Go to Admin Overview and click "Setup GUCCORA Admin"
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto pb-6">
              <div className="min-w-max flex justify-center py-4">
                <TreeNode
                  user={adminUser}
                  allUsers={allUsers ?? []}
                  depth={0}
                  position="root"
                  maxDepth={5}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary */}
      {allUsers && allUsers.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="text-muted-foreground text-sm mb-1">
                Total Members
              </div>
              <div className="font-display text-2xl font-bold text-red-400">
                {allUsers.length}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="text-muted-foreground text-sm mb-1">
                Active Members
              </div>
              <div className="font-display text-2xl font-bold text-emerald-400">
                {allUsers.filter((u) => u.isActive).length}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border sm:block hidden">
            <CardContent className="p-4">
              <div className="text-muted-foreground text-sm mb-1">
                Tree Depth
              </div>
              <div className="font-display text-2xl font-bold text-yellow-400">
                {Math.min(allUsers.length, 5)} levels
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
