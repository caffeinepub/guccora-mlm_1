import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { GitBranch } from "lucide-react";
import { motion } from "motion/react";
import type { User } from "../../backend";
import { RankBadge } from "../../components/shared/RankBadge";
import { useInternetIdentity } from "../../hooks/useInternetIdentity";
import { useAllUsers, useMyProfile } from "../../hooks/useQueries";

type TreeNodeProps = {
  user: User | null;
  allUsers: User[];
  depth: number;
  position?: "left" | "right";
  maxDepth?: number;
};

function TreeNode({
  user,
  allUsers,
  depth,
  position,
  maxDepth = 4,
}: TreeNodeProps) {
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

  return (
    <div className="flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: depth * 0.1 }}
        className="relative z-10"
      >
        {user ? (
          <div
            className={`flex flex-col items-center p-3 rounded-xl border text-center min-w-[100px] max-w-[120px] ${
              depth === 0
                ? "border-primary bg-primary/15 card-glow"
                : "border-border bg-card"
            }`}
          >
            <div
              className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold mb-2 ${
                depth === 0
                  ? "gold-gradient text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {user.username.slice(0, 2).toUpperCase()}
            </div>
            <div className="text-xs font-semibold truncate w-full">
              {user.username}
            </div>
            {position && (
              <div className="text-xs text-muted-foreground capitalize mt-0.5">
                {position}
              </div>
            )}
            <div className="mt-1">
              <RankBadge rank={user.rank} size="sm" />
            </div>
            {!user.isActive && (
              <span className="text-xs text-destructive mt-1">Inactive</span>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center p-3 rounded-xl border-2 border-dashed border-primary/30 text-center min-w-[100px] max-w-[120px] opacity-60">
            <div className="h-10 w-10 rounded-full border-2 border-dashed border-primary/40 flex items-center justify-center mb-2">
              <span className="text-primary text-lg">+</span>
            </div>
            <div className="text-xs text-primary/70 font-medium">Open Slot</div>
            {position && (
              <div className="text-xs text-muted-foreground capitalize mt-0.5">
                {position}
              </div>
            )}
          </div>
        )}
      </motion.div>

      {depth < maxDepth &&
        (leftChild !== undefined || rightChild !== undefined) && (
          <div className="relative mt-2 flex gap-4">
            <div className="absolute top-0 left-1/4 right-1/4 h-px bg-border" />
            <div className="absolute top-0 left-1/4 w-px h-4 bg-border" />
            <div className="absolute top-0 right-1/4 w-px h-4 bg-border" />
            <div className="mt-4">
              <TreeNode
                user={leftChild ?? null}
                allUsers={allUsers}
                depth={depth + 1}
                position="left"
                maxDepth={maxDepth}
              />
            </div>
            <div className="mt-4">
              <TreeNode
                user={rightChild ?? null}
                allUsers={allUsers}
                depth={depth + 1}
                position="right"
                maxDepth={maxDepth}
              />
            </div>
          </div>
        )}
    </div>
  );
}

export function TreePage() {
  const { identity } = useInternetIdentity();
  const { data: _profile } = useMyProfile();
  const { data: allUsers, isLoading } = useAllUsers();

  const myPrincipal = identity?.getPrincipal().toString();
  const myUser =
    allUsers?.find((u) => u.userId.toString() === myPrincipal) ?? null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold flex items-center gap-3">
          <GitBranch size={24} className="text-primary" />
          My Binary Tree
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Your network visualization (up to 4 levels deep)
        </p>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-base">Network Tree</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div
              className="flex justify-center py-12"
              data-ocid="tree.loading_state"
            >
              <div className="space-y-4">
                <Skeleton className="h-20 w-32 mx-auto" />
                <div className="flex gap-4">
                  <Skeleton className="h-20 w-28" />
                  <Skeleton className="h-20 w-28" />
                </div>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto pb-4">
              <div className="min-w-max flex justify-center">
                <TreeNode
                  user={myUser}
                  allUsers={allUsers ?? []}
                  depth={0}
                  maxDepth={4}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {myUser && (
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="p-5">
              <div className="text-muted-foreground text-sm mb-1">
                Left Leg Volume
              </div>
              <div className="font-display text-xl font-bold text-primary">
                {(Number(myUser.leftVolume) / 100_000_000).toFixed(2)} ICP
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-5">
              <div className="text-muted-foreground text-sm mb-1">
                Right Leg Volume
              </div>
              <div className="font-display text-xl font-bold text-primary">
                {(Number(myUser.rightVolume) / 100_000_000).toFixed(2)} ICP
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
