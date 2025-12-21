import { useMemo, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { RiskMeter } from "@/components/RiskMeter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle2, Globe, Link2, ShieldAlert, XCircle } from "lucide-react";

type RiskLevel = "safe" | "suspicious" | "scam";

type Factor = {
  id: string;
  label: string;
  points: number;
  severity: RiskLevel;
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

const brandTokens = [
  { brand: "paypal", domains: ["paypal.com"] },
  { brand: "google", domains: ["google.com"] },
  { brand: "microsoft", domains: ["microsoft.com", "live.com"] },
  { brand: "apple", domains: ["apple.com", "icloud.com"] },
  { brand: "amazon", domains: ["amazon.com"] },
];

const classify = (score: number): RiskLevel => {
  if (score <= 30) return "safe";
  if (score <= 70) return "suspicious";
  return "scam";
};

const decisionFor = (level: RiskLevel) => {
  if (level === "safe") return { action: "Allow" as const, recommendation: "Open normally, but stay alert for unexpected prompts." };
  if (level === "suspicious") {
    return {
      action: "Warn" as const,
      recommendation:
        "Avoid entering credentials or payment details. Verify the sender and open the official site directly from a trusted bookmark.",
    };
  }
  return {
    action: "Block" as const,
    recommendation:
      "Do not open this link. Report it to your security team and reset credentials if you already interacted with it.",
  };
};

const getHostParts = (host: string) => host.split(".").filter(Boolean);

const analyzeUrl = (rawInput: string) => {
  const trimmed = rawInput.trim();
  if (!trimmed) {
    return { normalized: "", factors: [] as Factor[], score: 0, level: "safe" as RiskLevel };
  }

  // Heuristic: allow users to paste without scheme.
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

  const factors: Factor[] = [];

  // Missing HTTPS
  if (url.protocol !== "https:") {
    factors.push({
      id: "no-https",
      label: "Missing HTTPS (connection not encrypted)",
      points: 25,
      severity: "suspicious",
    });
  }

  // Suspicious keywords
  const keywordHits = suspiciousKeywords.filter((k) => full.includes(k));
  if (keywordHits.length > 0) {
    factors.push({
      id: "keywords",
      label: `Suspicious keywords present: ${keywordHits.slice(0, 6).join(", ")}${keywordHits.length > 6 ? ", …" : ""}`,
      points: clamp(10 + keywordHits.length * 5, 10, 30),
      severity: "suspicious",
    });
  }

  // Long / obfuscated host
  const hyphenCount = (host.match(/-/g) ?? []).length;
  const digitCount = (host.match(/\d/g) ?? []).length;
  const parts = getHostParts(host);

  if (host.length >= 32) {
    factors.push({
      id: "long-host",
      label: `Unusually long domain (${host.length} characters)`,
      points: 15,
      severity: "suspicious",
    });
  }

  if (parts.length >= 4) {
    factors.push({
      id: "many-subdomains",
      label: `Many subdomains (${parts.length - 2}) can be used to disguise the real domain`,
      points: 12,
      severity: "suspicious",
    });
  }

  if (hyphenCount >= 3) {
    factors.push({
      id: "hyphens",
      label: `Multiple hyphens in domain (${hyphenCount})`,
      points: 10,
      severity: "suspicious",
    });
  }

  if (digitCount >= 4) {
    factors.push({
      id: "digits",
      label: `Many digits in domain (${digitCount})`,
      points: 10,
      severity: "suspicious",
    });
  }

  // Punycode / IDN deception
  if (host.includes("xn--")) {
    factors.push({
      id: "punycode",
      label: "Punycode domain detected (possible lookalike characters)",
      points: 25,
      severity: "scam",
    });
  }

  // Brand impersonation heuristic
  for (const token of brandTokens) {
    if (!full.includes(token.brand)) continue;

    const isOfficial = token.domains.some((d) => host === d || host.endsWith(`.${d}`));
    if (!isOfficial) {
      factors.push({
        id: `brand-${token.brand}`,
        label: `Possible brand impersonation: contains “${token.brand}” but domain is not one of ${token.domains.join(", ")}`,
        points: 35,
        severity: "scam",
      });
    }
  }

  // Shortened URLs can hide the destination
  if (["bit.ly", "tinyurl.com", "t.co", "goo.gl"].some((d) => host === d || host.endsWith(`.${d}`))) {
    factors.push({
      id: "shortener",
      label: "Link shortener detected (destination is obscured)",
      points: 20,
      severity: "suspicious",
    });
  }

  // TODO: Replace heuristics with real threat intel / ML model when backend is available.

  const score = clamp(
    factors.reduce((sum, f) => sum + f.points, 0),
    0,
    100
  );

  return { normalized, factors, score, level: classify(score) };
};

const levelBadgeVariant = (level: RiskLevel) => {
  if (level === "safe") return "safe" as const;
  if (level === "suspicious") return "warning" as const;
  return "fraud" as const;
};

const iconForLevel = (level: RiskLevel) => {
  if (level === "safe") return CheckCircle2;
  if (level === "suspicious") return AlertTriangle;
  return XCircle;
};

const ScamLinkDetection = () => {
  const [input, setInput] = useState("");
  const [submitted, setSubmitted] = useState<string | null>(null);

  const analysis = useMemo(() => {
    if (!submitted) {
      return { normalized: "", factors: [] as Factor[], score: 0, level: "safe" as RiskLevel };
    }
    try {
      return analyzeUrl(submitted);
    } catch {
      return { normalized: "", factors: [] as Factor[], score: 0, level: "safe" as RiskLevel };
    }
  }, [submitted]);

  const decision = decisionFor(analysis.level);
  const LevelIcon = iconForLevel(analysis.level);

  const onAnalyze = () => {
    try {
      const result = analyzeUrl(input);
      setSubmitted(input);
      toast({
        title: "Link analyzed",
        description: `Scam Risk Score: ${result.score}/100 (${result.level.toUpperCase()})`,
      });
    } catch (err) {
      toast({
        title: "Invalid URL",
        description: err instanceof Error ? err.message : "Please enter a valid URL.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Scam / Phishing <span className="text-gradient">Link Detection</span>
          </h1>
          <p className="text-muted-foreground">
            Frontend-only heuristic analysis that demonstrates: Input → Analysis → Risk Scoring → Decision → Explanation.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card p-6">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <Link2 className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">Input</h2>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">Frontend-only Prototype</Badge>
                  <Badge variant="outline">Simulated AI Logic</Badge>
                </div>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="url">Unknown URL</Label>
                <Input
                  id="url"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="https://example.com/login?verify=1"
                />
                <div className="flex flex-wrap gap-2">
                  <Button onClick={onAnalyze}>
                    <Globe className="mr-2 h-4 w-4" />
                    Analyze Link
                  </Button>
                  <Button variant="secondary" onClick={() => { setInput(""); setSubmitted(null); }}>
                    Clear
                  </Button>
                </div>

                {analysis.normalized && (
                  <div className="mt-2 rounded-lg border border-border/50 bg-card/30 p-3 text-sm">
                    <div className="text-muted-foreground">Normalized</div>
                    <div className="mt-1 font-mono break-all text-foreground">{analysis.normalized}</div>
                  </div>
                )}
              </div>
            </div>

            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <ShieldAlert className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Analysis & Explanation</h2>
              </div>

              {submitted ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-2">
                      <LevelIcon
                        className={cn(
                          "h-5 w-5",
                          analysis.level === "safe" && "text-safe",
                          analysis.level === "suspicious" && "text-warning",
                          analysis.level === "scam" && "text-fraud"
                        )}
                      />
                      <span className="font-medium">Detected risk factors</span>
                    </div>
                    <Badge variant={levelBadgeVariant(analysis.level)}>{analysis.level.toUpperCase()}</Badge>
                  </div>

                  {analysis.factors.length === 0 ? (
                    <div className="rounded-lg border border-border/50 bg-card/30 p-4 text-sm text-muted-foreground">
                      No risk factors triggered by the heuristics.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {analysis.factors
                        .slice()
                        .sort((a, b) => b.points - a.points)
                        .map((f) => (
                          <Card key={f.id} className="border-border/50 bg-card/50">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <div className="text-sm font-medium text-foreground">{f.label}</div>
                                  <div className="mt-1 text-xs text-muted-foreground">Risk contribution (simulated)</div>
                                </div>
                                <div className="shrink-0 font-mono text-sm text-muted-foreground">+{f.points}</div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="rounded-lg border border-border/50 bg-card/30 p-4 text-sm text-muted-foreground">
                  Enter a URL and click “Analyze Link” to see the explanation.
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-card p-6">
              <div className="flex items-center justify-between gap-3 mb-4">
                <h2 className="text-lg font-semibold">Risk Scoring</h2>
                <Badge variant="outline">0–100</Badge>
              </div>

              <div className="flex items-center justify-center">
                <RiskMeter score={analysis.score} size="md" />
              </div>

              <div className="mt-4 text-sm text-muted-foreground">
                Score is computed from heuristic signals (keywords, HTTPS, domain structure, impersonation patterns).
              </div>
            </div>

            <div className="glass-card p-6">
              <div className="flex items-center justify-between gap-3 mb-4">
                <h2 className="text-lg font-semibold">Decision</h2>
                <Badge variant={levelBadgeVariant(analysis.level)}>{decision.action.toUpperCase()}</Badge>
              </div>

              <div className="space-y-3">
                <div className="text-sm">
                  <span className="text-muted-foreground">Classification: </span>
                  <span className="font-medium text-foreground">{analysis.level.toUpperCase()}</span>
                </div>
                <div className="rounded-lg border border-border/50 bg-card/30 p-4 text-sm text-muted-foreground">
                  {decision.recommendation}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ScamLinkDetection;
