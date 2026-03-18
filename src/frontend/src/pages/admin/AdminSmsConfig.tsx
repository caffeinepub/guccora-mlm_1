import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, Loader2, MessageSquare, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useActor } from "../../hooks/useActor";

export function AdminSmsConfig() {
  const { actor } = useActor();
  const [authKey, setAuthKey] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [senderId, setSenderId] = useState("GUCCOR");
  const [configured, setConfigured] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!actor) return;
    actor
      .getMsg91Config()
      .then((cfg) => {
        setConfigured(cfg.configured);
        setTemplateId(cfg.templateId);
        setSenderId(cfg.senderId || "GUCCOR");
      })
      .catch(() => {})
      .finally(() => setFetching(false));
  }, [actor]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor) {
      toast.error("Not connected to backend");
      return;
    }
    if (!authKey.trim()) {
      toast.error("Auth Key is required");
      return;
    }
    if (!templateId.trim()) {
      toast.error("Template ID is required");
      return;
    }
    if (!senderId.trim()) {
      toast.error("Sender ID is required");
      return;
    }
    setLoading(true);
    try {
      await actor.setMsg91Config(
        authKey.trim(),
        templateId.trim(),
        senderId.trim(),
      );
      setConfigured(true);
      setAuthKey(""); // Clear auth key from UI after save
      toast.success("SMS configuration saved! Real SMS OTP will now be sent.");
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Failed to save configuration",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-3">
          <MessageSquare size={24} className="text-primary" />
          SMS Configuration
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Configure MSG91 credentials to enable real SMS OTP delivery.
        </p>
      </div>

      {/* Status Banner */}
      {!fetching && (
        <div
          className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium ${
            configured
              ? "bg-green-500/10 border-green-500/30 text-green-300"
              : "bg-yellow-500/10 border-yellow-500/30 text-yellow-300"
          }`}
          data-ocid="sms_config.success_state"
        >
          {configured ? (
            <>
              <CheckCircle size={18} className="shrink-0" />
              <span>SMS Active — Real SMS will be sent to users</span>
            </>
          ) : (
            <>
              <Settings size={18} className="shrink-0" />
              <span>Dev Mode — OTP shown on screen (SMS not configured)</span>
            </>
          )}
        </div>
      )}

      <Card className="bg-card border-red-500/10">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold">
            MSG91 Credentials
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Get your credentials from{" "}
            <a
              href="https://msg91.com"
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:underline"
            >
              msg91.com
            </a>
            . Without configuration, OTP codes are displayed on screen for
            testing only.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="authKey">Auth Key</Label>
              <Input
                id="authKey"
                type="password"
                value={authKey}
                onChange={(e) => setAuthKey(e.target.value)}
                placeholder={
                  configured
                    ? "••••••••••••••• (saved)"
                    : "Enter MSG91 Auth Key"
                }
                className="bg-muted/30 border-border"
                data-ocid="sms_config.input"
              />
              <p className="text-xs text-muted-foreground">
                Found in MSG91 dashboard → API → Auth Key
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="templateId">Template ID</Label>
              <Input
                id="templateId"
                type="text"
                value={templateId}
                onChange={(e) => setTemplateId(e.target.value)}
                placeholder="e.g. 65abc123def456"
                className="bg-muted/30 border-border"
                data-ocid="sms_config.input"
              />
              <p className="text-xs text-muted-foreground">
                Create a DLT-approved OTP template in MSG91 and paste its ID
                here.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="senderId">Sender ID</Label>
              <Input
                id="senderId"
                type="text"
                value={senderId}
                onChange={(e) =>
                  setSenderId(e.target.value.toUpperCase().slice(0, 6))
                }
                placeholder="GUCCOR"
                maxLength={6}
                className="bg-muted/30 border-border"
                data-ocid="sms_config.input"
              />
              <p className="text-xs text-muted-foreground">
                6-character DLT-registered sender ID (default: GUCCOR).
              </p>
            </div>

            <Button
              type="submit"
              className="w-full gold-gradient text-primary-foreground font-bold rounded-full"
              disabled={loading}
              data-ocid="sms_config.submit_button"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save SMS Configuration"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-card border-red-500/10">
        <CardContent className="p-5">
          <h3 className="text-sm font-semibold mb-3 text-primary">
            How it works
          </h3>
          <ul className="space-y-2 text-xs text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold mt-0.5">1.</span>
              <span>
                Without configuration: OTP is shown on screen for easy testing.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold mt-0.5">2.</span>
              <span>
                With MSG91 configuration: OTP is sent silently via SMS to the
                user's phone.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold mt-0.5">3.</span>
              <span>OTP expires after 2 minutes for security.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold mt-0.5">4.</span>
              <span>
                Credentials are stored securely on the Internet Computer
                blockchain.
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
