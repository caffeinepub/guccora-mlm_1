import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Megaphone, Plus } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useAddAnnouncement, useAnnouncements } from "../../hooks/useQueries";
import { formatDate } from "../../lib/formatters";

export function AdminAnnouncements() {
  const { data: announcements, isLoading } = useAnnouncements();
  const addMutation = useAddAnnouncement();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [formOpen, setFormOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!content.trim()) {
      toast.error("Content is required");
      return;
    }
    try {
      await addMutation.mutateAsync({
        title: title.trim(),
        content: content.trim(),
      });
      toast.success("Announcement posted!");
      setTitle("");
      setContent("");
      setFormOpen(false);
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to post announcement");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold flex items-center gap-3">
          <Megaphone size={24} className="text-primary" />
          Announcements
        </h1>
        <Button
          onClick={() => setFormOpen(!formOpen)}
          className="gold-gradient text-primary-foreground font-semibold"
          data-ocid="announcements.open_modal_button"
        >
          <Plus size={16} className="mr-2" />
          New Announcement
        </Button>
      </div>

      {formOpen && (
        <Card
          className="bg-card border-primary/30 card-glow"
          data-ocid="announcements.dialog"
        >
          <CardHeader>
            <CardTitle className="text-base">Post Announcement</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <Label>Title</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Announcement title"
                  className="bg-muted/30 border-border"
                  data-ocid="announcements.input"
                />
              </div>
              <div className="space-y-1">
                <Label>Content</Label>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your announcement..."
                  rows={4}
                  className="bg-muted/30 border-border"
                  data-ocid="announcements.textarea"
                />
              </div>
              <div className="flex gap-3">
                <Button
                  type="submit"
                  className="gold-gradient text-primary-foreground font-semibold"
                  disabled={addMutation.isPending}
                  data-ocid="announcements.submit_button"
                >
                  {addMutation.isPending ? (
                    <>
                      <Loader2 size={16} className="mr-2 animate-spin" />
                      Posting...
                    </>
                  ) : (
                    "Post Announcement"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setFormOpen(false)}
                  data-ocid="announcements.cancel_button"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {isLoading ? (
          <div className="space-y-3" data-ocid="announcements.loading_state">
            {["a", "b", "c"].map((k) => (
              <Skeleton key={k} className="h-24 w-full rounded-xl" />
            ))}
          </div>
        ) : !announcements || announcements.length === 0 ? (
          <Card className="bg-card border-border">
            <CardContent
              className="p-8 text-center text-muted-foreground"
              data-ocid="announcements.empty_state"
            >
              No announcements yet. Post one to inform your members.
            </CardContent>
          </Card>
        ) : (
          announcements.map((ann, i) => (
            <motion.div
              key={`ann-${ann.title}-${i}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              data-ocid={`announcements.item.${i + 1}`}
            >
              <Card className="bg-card border-border">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-primary mb-2">
                        {ann.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {ann.content}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatDate(ann.createdAt)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
