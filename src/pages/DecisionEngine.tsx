import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { RiskMeter } from "@/components/RiskMeter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Scale,
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowRight,
  Shield,
  Lightbulb,
  FileText,
} from "lucide-react";
import { mockTransactions } from "@/data/mockData";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type DecisionType = "transaction" | "link";

interface Decision {
  type: DecisionType;
  subject: string;
  action: "allow" | "alert" | "block";
  riskScore: number;
  probability: number;
  probabilityLabel: string;
  reasons: string[];
  recommendation: string;
}

type LinkFactor = {
  label: string;
  points: number;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const suspiciousKeywords = [
  "login",
  "secure",
  "verify",
  "verification",
  "account",
  "update",
  "password",
  "reset",
  "billing",
  "invoice",
  "support",
  "bank",
  "wallet",
];

const analyzeLinkHeuristics = (rawInput: string) => {
  const trimmed = rawInput.trim();
  if (!trimmed) {
    throw new Error("Please enter a URL.");
  }

  const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `http://${trimmed}`;

  let url: URL;
  try {
    url = new URL(candidate);
  } catch {
    throw new Error("Please enter a valid URL or domain (e.g., https://example.com or example.com/path).");
  }

  const normalized = url.href;
  const host = url.hostname.toLowerCase();
  const pathAndQuery = `${url.pathname}${url.search}`.toLowerCase();
  const full = `${host}${pathAndQuery}`;

  const factors: LinkFactor[] = [];

  if (url.protocol !== "https:") {
    factors.push({ label: "Missing HTTPS (connection not encrypted)", points: 25 });
  }

  const keywordHits = suspiciousKeywords.filter((k) => full.includes(k));
  if (keywordHits.length > 0) {
    factors.push({
      label: `Suspicious keywords present: ${keywordHits.slice(0, 6).join(", ")}${keywordHits.length > 6 ? ", …" : ""}`,
      points: clamp(10 + keywordHits.length * 5, 10, 30),
    });
  }

  const hyphenCount = (host.match(/-/g) ?? []).length;
  const digitCount = (host.match(/\d/g) ?? []).length;
  const partCount = host.split(".").filter(Boolean).length;

  if (host.length >= 32) {
    factors.push({ label: `Unusually long domain (${host.length} characters)`, points: 15 });
  }
  if (partCount >= 4) {
    factors.push({ label: `Many subdomains (${partCount - 2}) can disguise the real domain`, points: 12 });
  }
  if (hyphenCount >= 3) {
    factors.push({ label: `Multiple hyphens in domain (${hyphenCount})`, points: 10 });
  }
  if (digitCount >= 4) {
    factors.push({ label: `Many digits in domain (${digitCount})`, points: 10 });
  }

  if (host.includes("xn--")) {
    factors.push({ label: "Punycode domain detected (possible lookalike characters)", points: 25 });
  }

  const score = clamp(
    factors.reduce((sum, f) => sum + f.points, 0),
    0,
    100
  );

  return { normalized, factors, score };
};

const decisionFromScore = (score: number) => {
  if (score <= 30) return "allow" as const;
  if (score <= 70) return "alert" as const;
  return "block" as const;
};

const DecisionEngine = () => {
  const [decisionType, setDecisionType] = useState<DecisionType>("transaction");
  const [transactionId, setTransactionId] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [decision, setDecision] = useState<Decision | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const evaluateDecision = () => {
    if (decisionType === "transaction") {
      if (!transactionId.trim()) {
        toast({
          title: "Invalid Input",
          description: "Please enter a Transaction ID.",
          variant: "destructive",
        });
        return;
      }

      setIsLoading(true);

      setTimeout(() => {
        const foundTx = mockTransactions.find(
          (tx) => tx.id.toUpperCase() === transactionId.toUpperCase()
        );

        const isFraud = foundTx?.status === "fraud" || Math.random() > 0.6;
        const riskScore = isFraud
          ? Math.floor(Math.random() * 30 + 70)
          : Math.floor(Math.random() * 40);
        const probability = riskScore / 100;

        let action: Decision["action"];
        let reasons: string[];
        let recommendation: string;

        if (riskScore <= 30) {
          action = "allow";
          reasons = [
            "No linked fraud accounts detected",
            "Transaction amount within normal range",
            "Location consistent with account history",
            "Device and IP address are trusted",
          ];
          recommendation =
            "This transaction shows no indicators of fraud and can be processed normally. All verification checks passed.";
        } else if (riskScore <= 70) {
          action = "alert";
          reasons = [
            "Slightly elevated transaction amount",
            "Minor location deviation detected",
            "Account flagged for review recently",
            "Recommend secondary verification",
          ];
          recommendation =
            "This transaction has moderate risk indicators. Consider implementing step-up authentication or manual review before processing.";
        } else {
          action = "block";
          reasons = [
            "Multiple linked fraud accounts detected",
            "Transaction amount significantly above normal",
            "Location mismatch with account origin",
            "Device/IP associated with previous fraud",
            "High velocity of transactions detected",
          ];
          recommendation =
            "This transaction has high fraud probability. Immediate blocking recommended with investigation initiated. Contact customer for verification.";
        }

        setDecision({
          type: "transaction",
          subject: transactionId.toUpperCase(),
          action,
          riskScore,
          probability,
          probabilityLabel: "Fraud Probability",
          reasons,
          recommendation,
        });

        setIsLoading(false);
      }, 1000);

      return;
    }

    // Link decision
    if (!linkUrl.trim()) {
      toast({
        title: "Invalid Input",
        description: "Please enter a URL to analyze.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      try {
        const { normalized, factors, score } = analyzeLinkHeuristics(linkUrl);
        const action = decisionFromScore(score);
        const probability = score / 100;

        const reasons = factors.length
          ? factors
              .slice()
              .sort((a, b) => b.points - a.points)
              .map((f) => `${f.label} (+${f.points})`)
          : ["No heuristic risk factors triggered"];

        const recommendation =
          action === "allow"
            ? "This link appears low-risk based on frontend heuristics. Open normally, but stay alert for unexpected prompts."
            : action === "alert"
            ? "This link looks suspicious. Avoid entering credentials or payment details. Verify the sender and open the official site directly."
            : "This link is highly likely to be a scam/phishing attempt. Do not open it. Report it and reset credentials if you interacted with it.";

        setDecision({
          type: "link",
          subject: normalized,
          action,
          riskScore: score,
          probability,
          probabilityLabel: "Scam Probability",
          reasons,
          recommendation,
        });

        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        toast({
          title: "Invalid URL",
          description: err instanceof Error ? err.message : "Please enter a valid URL.",
          variant: "destructive",
        });
      }
    }, 900);
  };

  const decisionConfig = {
    allow: {
      icon: CheckCircle2,
      label: "ALLOW",
      color: "text-safe",
      bg: "bg-safe/10",
      border: "border-safe/30",
      glow: "shadow-safe/20",
    },
    alert: {
      icon: AlertTriangle,
      label: "ALERT",
      color: "text-warning",
      bg: "bg-warning/10",
      border: "border-warning/30",
      glow: "shadow-warning/20",
    },
    block: {
      icon: XCircle,
      label: "BLOCK",
      color: "text-fraud",
      bg: "bg-fraud/10",
      border: "border-fraud/30",
      glow: "shadow-fraud/20",
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Decision <span className="text-gradient">Engine</span>
          </h1>
          <p className="text-muted-foreground">
            Automated fraud decision-making with transparent reasoning.
          </p>
        </div>

        {/* Search */}
        <div className="glass-card p-6 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">Frontend-only Prototype</Badge>
              <Badge variant="outline">Simulated AI Logic</Badge>
            </div>
          </div>

          <Tabs
            value={decisionType}
            onValueChange={(v) => {
              const next = v as DecisionType;
              setDecisionType(next);
              setDecision(null);
            }}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="transaction">Transaction</TabsTrigger>
              <TabsTrigger value="link">Link</TabsTrigger>
            </TabsList>

            <TabsContent value="transaction" className="mt-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Label htmlFor="transactionId" className="mb-2 block">
                    Transaction ID
                  </Label>
                  <Input
                    id="transactionId"
                    placeholder="Enter TXN-001"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && evaluateDecision()}
                    className="font-mono"
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    onClick={evaluateDecision}
                    disabled={isLoading}
                    className="w-full sm:w-auto"
                  >
                    {isLoading ? (
                      <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Scale className="h-4 w-4" />
                    )}
                    Evaluate Decision
                  </Button>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-sm text-muted-foreground">Try:</span>
                {["TXN-001", "TXN-002", "TXN-003", "TXN-004"].map((id) => (
                  <Badge
                    key={id}
                    variant="outline"
                    className="cursor-pointer hover:bg-secondary"
                    onClick={() => {
                      setTransactionId(id);
                    }}
                  >
                    {id}
                  </Badge>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="link" className="mt-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Label htmlFor="linkUrl" className="mb-2 block">
                    Unknown URL
                  </Label>
                  <Input
                    id="linkUrl"
                    placeholder="https://example.com/login?verify=1"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && evaluateDecision()}
                    className="font-mono"
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    onClick={evaluateDecision}
                    disabled={isLoading}
                    className="w-full sm:w-auto"
                  >
                    {isLoading ? (
                      <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                    Analyze Link
                  </Button>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-sm text-muted-foreground">Try:</span>
                {[
                  "http://secure-login.verify-account.example.com",
                  "https://example.com/help",
                  "https://xn--paypa-7ve.example/login",
                ].map((u) => (
                  <Badge
                    key={u}
                    variant="outline"
                    className="cursor-pointer hover:bg-secondary"
                    onClick={() => {
                      setLinkUrl(u);
                    }}
                  >
                    <span className="font-mono">{u.length > 28 ? `${u.slice(0, 28)}…` : u}</span>
                  </Badge>
                ))}
              </div>

              <p className="mt-3 text-xs text-muted-foreground">
                {/* TODO: Replace heuristics with backend threat intelligence / ML model. */}
                Heuristics include HTTPS presence, suspicious keywords, and domain structure signals.
              </p>
            </TabsContent>
          </Tabs>
        </div>

        {/* Decision Result */}
        {decision && (
          <div className="animate-fade-in space-y-6">
            {/* Main Decision Card */}
            <div
              className={cn(
                "glass-card p-8 border-2 transition-all duration-500",
                decisionConfig[decision.action].border,
                decisionConfig[decision.action].bg
              )}
            >
              <div className="grid gap-8 lg:grid-cols-3">
                {/* Decision Badge */}
                <div className="flex flex-col items-center justify-center">
                  <div
                    className={cn(
                      "relative p-6 rounded-full mb-4",
                      decisionConfig[decision.action].bg,
                      `shadow-2xl ${decisionConfig[decision.action].glow}`
                    )}
                  >
                    {(() => {
                      const Icon = decisionConfig[decision.action].icon;
                      return (
                        <Icon
                          className={cn(
                            "h-16 w-16",
                            decisionConfig[decision.action].color
                          )}
                        />
                      );
                    })()}
                    <div
                      className={cn(
                        "absolute inset-0 rounded-full blur-2xl opacity-50",
                        decision.action === "allow"
                          ? "bg-safe"
                          : decision.action === "alert"
                          ? "bg-warning"
                          : "bg-fraud"
                      )}
                    />
                  </div>
                  <h2
                    className={cn(
                      "text-3xl font-bold tracking-wider",
                      decisionConfig[decision.action].color
                    )}
                  >
                    {decisionConfig[decision.action].label}
                  </h2>
                  <p className="text-muted-foreground mt-2">Transaction Decision</p>
                </div>

                {/* Risk Score */}
                <div className="flex flex-col items-center justify-center">
                  <RiskMeter score={decision.riskScore} size="md" />
                  <p className="text-sm text-muted-foreground mt-4">
                    Overall Risk Score
                  </p>
                </div>

                {/* Fraud Probability */}
                <div className="flex flex-col items-center justify-center">
                  <div className="text-center">
                    <div
                      className={cn(
                        "text-5xl font-mono font-bold mb-2",
                        decision.probability > 0.7
                          ? "text-fraud"
                          : decision.probability > 0.3
                          ? "text-warning"
                          : "text-safe"
                      )}
                    >
                      {(decision.probability * 100).toFixed(1)}%
                    </div>
                    <p className="text-muted-foreground">{decision.probabilityLabel}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Decision Flow */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <ArrowRight className="h-5 w-5 text-primary" />
                Decision Flow
              </h3>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <div className="flex items-center gap-2 rounded-lg bg-secondary px-4 py-2">
                  <Shield className="h-5 w-5 text-primary" />
                    <span>{decision.type === "transaction" ? "Transaction Received" : "Link Submitted"}</span>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                <div className="flex items-center gap-2 rounded-lg bg-secondary px-4 py-2">
                  <Scale className="h-5 w-5 text-primary" />
                  <span>Risk Analysis</span>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                <div className="flex items-center gap-2 rounded-lg bg-secondary px-4 py-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <span>Score: {decision.riskScore}</span>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                <div
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-4 py-2",
                    decisionConfig[decision.action].bg,
                    decisionConfig[decision.action].border,
                    "border"
                  )}
                >
                  {(() => {
                    const Icon = decisionConfig[decision.action].icon;
                    return (
                      <Icon
                        className={cn("h-5 w-5", decisionConfig[decision.action].color)}
                      />
                    );
                  })()}
                  <span className={decisionConfig[decision.action].color}>
                    {decisionConfig[decision.action].label}
                  </span>
                </div>
              </div>
            </div>

            {/* Explanation Panel */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Reasons */}
              <div className="glass-card p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Why This Decision
                </h3>
                <div className="mb-4 rounded-lg border border-border/50 bg-card/30 p-3 text-xs text-muted-foreground">
                  <div className="font-mono break-all text-foreground">{decision.subject}</div>
                  <div className="mt-1">{decision.type === "transaction" ? "Transaction ID" : "Analyzed URL"}</div>
                </div>
                <ul className="space-y-3">
                  {decision.reasons.map((reason, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 rounded-lg bg-secondary/50 p-3"
                    >
                      <div
                        className={cn(
                          "mt-0.5 h-2 w-2 rounded-full flex-shrink-0",
                          decision.action === "allow"
                            ? "bg-safe"
                            : decision.action === "alert"
                            ? "bg-warning"
                            : "bg-fraud"
                        )}
                      />
                      <span className="text-sm">{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommendation */}
              <div className="glass-card p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-warning" />
                  Recommendation
                </h3>
                <div
                  className={cn(
                    "rounded-lg border p-4",
                    decisionConfig[decision.action].border,
                    decisionConfig[decision.action].bg
                  )}
                >
                  <p className="text-sm leading-relaxed">{decision.recommendation}</p>
                </div>

                {/* Action buttons based on decision */}
                <div className="mt-6 flex flex-wrap gap-3">
                  {decision.action === "allow" && (
                    <Button variant="safe" className="flex-1">
                      <CheckCircle2 className="h-4 w-4" />
                      {decision.type === "transaction" ? "Process Transaction" : "Allow Link"}
                    </Button>
                  )}
                  {decision.action === "alert" && (
                    <>
                      <Button variant="warning" className="flex-1">
                        <AlertTriangle className="h-4 w-4" />
                        {decision.type === "transaction" ? "Request Verification" : "Warn User"}
                      </Button>
                      <Button variant="outline" className="flex-1">
                        {decision.type === "transaction" ? "Manual Review" : "Open in Safe View"}
                      </Button>
                    </>
                  )}
                  {decision.action === "block" && (
                    <>
                      <Button variant="fraud" className="flex-1">
                        <XCircle className="h-4 w-4" />
                        {decision.type === "transaction" ? "Confirm Block" : "Block Link"}
                      </Button>
                      <Button variant="outline" className="flex-1">
                        {decision.type === "transaction" ? "Escalate to Analyst" : "Report"}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!decision && !isLoading && (
          <div className="glass-card p-12 text-center">
            <Scale className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Decision Engine Ready</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Choose Transaction or Link to receive an automated decision with
              transparent reasoning and actionable recommendations.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default DecisionEngine;
