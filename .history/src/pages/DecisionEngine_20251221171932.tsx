import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { RiskMeter } from "@/components/RiskMeter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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

/**
 * DECISION ENGINE MODULE - FINAL STAGE
 * 
 * Combines AI Risk Score + Link Risk Score to make final decision
 * 
 * Decision Logic:
 * - Risk Score 0-30 → ALLOW (process normally)
 * - Risk Score 31-70 → ALERT (requires review/2FA)
 * - Risk Score 71-100 → BLOCK (immediate blocking)
 * 
 * Factors Considered:
 * 1. Transaction anomaly score
 * 2. Link analysis risk
 * 3. Device/IP reputation
 * 4. Velocity patterns
 * 5. Historical fraud indicators
 * 
 * TODO: Backend integration for real-time decision logging
 */

interface Decision {
  action: "allow" | "alert" | "block";
  riskScore: number;
  linkRiskScore: number;
  fraudProbability: number;
  reasons: string[];
  recommendation: string;
  details: {
    transactionRisk: number;
    networkRisk: number;
    velocityRisk: number;
    locationRisk: number;
  };
}

const DecisionEngine = () => {
  const [transactionId, setTransactionId] = useState("");
  const [decision, setDecision] = useState<Decision | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * DECISION EVALUATION LOGIC
   * Simulates ML model + rule engine combination
   * 
   * In production, this would:
   * 1. Call ML model API for fraud probability
   * 2. Query link analysis service for network risk
   * 3. Check velocity rules against recent transactions
   * 4. Apply business rules (amount limits, location blocks, etc.)
   */
  const evaluateDecision = () => {
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
      
      // Simulate different risk components
      const transactionRisk = isFraud 
        ? Math.floor(Math.random() * 30 + 60) 
        : Math.floor(Math.random() * 25);
      const networkRisk = isFraud 
        ? Math.floor(Math.random() * 25 + 50) 
        : Math.floor(Math.random() * 20);
      const velocityRisk = Math.floor(Math.random() * 30);
      const locationRisk = isFraud 
        ? Math.floor(Math.random() * 20 + 30) 
        : Math.floor(Math.random() * 15);

      // Combined risk score (weighted average)
      const riskScore = Math.round(
        transactionRisk * 0.4 + 
        networkRisk * 0.3 + 
        velocityRisk * 0.2 + 
        locationRisk * 0.1
      );
      
      const linkRiskScore = networkRisk;
      const fraudProbability = riskScore / 100;

      let action: Decision["action"];
      let reasons: string[];
      let recommendation: string;

      // DECISION THRESHOLDS
      if (riskScore <= 30) {
        action = "allow";
        reasons = [
          "✓ No linked fraud accounts detected in network analysis",
          "✓ Transaction amount within historical normal range ($" + (foundTx?.amount || 1500) + ")",
          "✓ Location consistent with account profile",
          "✓ Device and IP address verified and trusted",
          "✓ Transaction velocity within acceptable limits",
        ];
        recommendation =
          "This transaction shows no significant fraud indicators and can be processed normally. All verification checks passed. Customer authentication successful.";
      } else if (riskScore <= 70) {
        action = "alert";
        reasons = [
          "⚠ Transaction amount slightly elevated compared to user average",
          "⚠ Minor geographic deviation from normal transaction locations",
          "⚠ Account flagged for enhanced monitoring in recent period",
          "⚠ Device fingerprint partially matches known risky patterns",
          "→ Recommend implementing step-up authentication (2FA/SMS)",
        ];
        recommendation =
          "This transaction has moderate risk indicators that warrant additional verification. Recommended actions: (1) Request 2FA verification from customer, (2) Flag for manual review queue, (3) Monitor for follow-up suspicious activity. Transaction can proceed after additional authentication.";
      } else {
        action = "block";
        reasons = [
          "✗ Multiple linked fraud accounts detected in network graph",
          "✗ Transaction amount significantly exceeds normal patterns (>3σ deviation)",
          "✗ Location/timezone mismatch with account origin country",
          "✗ Device/IP address associated with previous confirmed fraud cases",
          "✗ High transaction velocity detected (5+ transactions in 10 minutes)",
          "✗ Account shows characteristics of money mule or compromised account",
        ];
        recommendation =
          "This transaction has HIGH fraud probability and should be BLOCKED immediately. Recommended actions: (1) Decline transaction and notify customer via secure channel, (2) Temporarily freeze account pending verification, (3) Initiate fraud investigation workflow, (4) Alert fraud ops team for manual review. Do NOT proceed with transaction.";
      }

      setDecision({
        action,
        riskScore,
        linkRiskScore,
        fraudProbability,
        reasons,
        recommendation,
        details: {
          transactionRisk,
          networkRisk,
          velocityRisk,
          locationRisk,
        },
      });

      setIsLoading(false);
    }, 1000);
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
                        decision.fraudProbability > 0.7
                          ? "text-fraud"
                          : decision.fraudProbability > 0.3
                          ? "text-warning"
                          : "text-safe"
                      )}
                    >
                      {(decision.fraudProbability * 100).toFixed(1)}%
                    </div>
                    <p className="text-muted-foreground">Fraud Probability</p>
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
                  <span>Transaction Received</span>
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

            {/* Risk Components Breakdown */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Risk Score Breakdown
              </h3>
              <div className="space-y-4">
                {[
                  { name: "Transaction Risk", value: decision.details.transactionRisk, weight: 40, icon: Scale },
                  { name: "Network Risk", value: decision.details.networkRisk, weight: 30, icon: Lightbulb },
                  { name: "Velocity Risk", value: decision.details.velocityRisk, weight: 20, icon: AlertTriangle },
                  { name: "Location Risk", value: decision.details.locationRisk, weight: 10, icon: FileText },
                ].map((component) => (
                  <div key={component.name}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <component.icon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{component.name}</span>
                        <Badge variant="outline" className="text-xs">{component.weight}% weight</Badge>
                      </div>
                      <span className={cn(
                        "text-sm font-mono font-semibold",
                        component.value > 70 ? "text-fraud" : component.value > 40 ? "text-warning" : "text-safe"
                      )}>
                        {component.value}/100
                      </span>
                    </div>
                    <div className="relative h-2 rounded-full bg-secondary overflow-hidden">
                      <div 
                        className={cn(
                          "absolute inset-y-0 left-0 rounded-full transition-all duration-1000",
                          component.value > 70 ? "bg-fraud" : component.value > 40 ? "bg-warning" : "bg-safe"
                        )}
                        style={{ width: `${component.value}%` }}
                      />
                    </div>
                  </div>
                ))}
                <div className="pt-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Combined Risk Score</span>
                    <span className={cn(
                      "text-xl font-mono font-bold",
                      decision.riskScore > 70 ? "text-fraud" : decision.riskScore > 30 ? "text-warning" : "text-safe"
                    )}>
                      {decision.riskScore}/100
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Calculated using weighted average of all risk components
                  </p>
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
                      Process Transaction
                    </Button>
                  )}
                  {decision.action === "alert" && (
                    <>
                      <Button variant="warning" className="flex-1">
                        <AlertTriangle className="h-4 w-4" />
                        Request Verification
                      </Button>
                      <Button variant="outline" className="flex-1">
                        Manual Review
                      </Button>
                    </>
                  )}
                  {decision.action === "block" && (
                    <>
                      <Button variant="fraud" className="flex-1">
                        <XCircle className="h-4 w-4" />
                        Confirm Block
                      </Button>
                      <Button variant="outline" className="flex-1">
                        Escalate to Analyst
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
              Enter a Transaction ID to receive an automated fraud decision with
              transparent reasoning and actionable recommendations.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default DecisionEngine;
