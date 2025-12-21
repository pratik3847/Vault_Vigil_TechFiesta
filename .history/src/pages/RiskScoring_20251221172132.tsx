import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { RiskMeter } from "@/components/RiskMeter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { StatsCard } from "@/components/StatsCard";
import {
  Gauge,
  Search,
  AlertTriangle,
  Link2,
  DollarSign,
  MapPin,
  Smartphone,
  Globe,
  TrendingUp,
  ShieldAlert,
  CheckCircle,
} from "lucide-react";
import { mockTransactions, riskFactors } from "@/data/mockData";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

/**
 * RISK SCORING MODULE - USER VERIFICATION & RISK ASSESSMENT
 * 
 * Purpose: Evaluate transaction and account risk using multi-factor analysis
 * 
 * Input: Transaction ID or Account ID
 * 
 * Analysis Factors:
 * 1. Transaction anomalies (amount, frequency, pattern)
 * 2. Fraud link analysis results (network connections)
 * 3. Device/IP reuse patterns
 * 4. Location consistency
 * 5. Historical fraud indicators
 * 
 * Output:
 * - Risk Score: 0-100 (Safe/Suspicious/Fraud)
 * - Factor Breakdown: Individual risk contributors
 * - Status Indicators: Visual risk level
 * 
 * MOCK LOGIC:
 * - Simulates ML model risk assessment
 * - Combines multiple fraud signals
 * - Provides clear factor explanations
 * 
 * TODO: Connect to ML model API for real-time scoring
 */

interface RiskResult {
  id: string;
  type: "transaction" | "account";
  score: number;
  factors: typeof riskFactors;
  details: {
    linkedFraudAccounts: number;
    abnormalAmount: boolean;
    locationMismatch: boolean;
    deviceReuse: boolean;
    ipReuse: boolean;
  };
}

const RiskScoring = () => {
  const [searchId, setSearchId] = useState("");
  const [result, setResult] = useState<RiskResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const evaluateRisk = () => {
    if (!searchId.trim()) {
      toast({
        title: "Invalid Input",
        description: "Please enter a Transaction ID or Account ID.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const isTransaction = searchId.toUpperCase().startsWith("TXN");
      const foundTx = mockTransactions.find(
        (tx) =>
          tx.id.toUpperCase() === searchId.toUpperCase() ||
          tx.senderId.toUpperCase() === searchId.toUpperCase()
      );

      if (foundTx || searchId.toUpperCase().startsWith("ACC")) {
        const isFraud = foundTx?.status === "fraud" || Math.random() > 0.5;
        const score = isFraud ? Math.floor(Math.random() * 30 + 70) : Math.floor(Math.random() * 30);

        setResult({
          id: searchId.toUpperCase(),
          type: isTransaction ? "transaction" : "account",
          score,
          factors: riskFactors.filter(() => Math.random() > 0.3),
          details: {
            linkedFraudAccounts: isFraud ? Math.floor(Math.random() * 3 + 1) : 0,
            abnormalAmount: isFraud && Math.random() > 0.5,
            locationMismatch: isFraud && Math.random() > 0.4,
            deviceReuse: isFraud && Math.random() > 0.5,
            ipReuse: isFraud && Math.random() > 0.6,
          },
        });
      } else {
        toast({
          title: "Not Found",
          description: "No matching transaction or account found.",
          variant: "destructive",
        });
        setResult(null);
      }

      setIsLoading(false);
    }, 800);
  };

  const getStatusColor = (score: number) => {
    if (score <= 30) return "safe";
    if (score <= 70) return "warning";
    return "fraud";
  };

  const severityColors = {
    high: "text-fraud bg-fraud/10 border-fraud/30",
    medium: "text-warning bg-warning/10 border-warning/30",
    low: "text-primary bg-primary/10 border-primary/30",
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Risk <span className="text-gradient">Scoring</span>
          </h1>
          <p className="text-muted-foreground">
            Evaluate transaction and account risk with multi-factor analysis.
          </p>
        </div>

        {/* Search */}
        <div className="glass-card p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="searchId" className="mb-2 block">
                Transaction ID or Account ID
              </Label>
              <Input
                id="searchId"
                placeholder="Enter TXN-001 or ACC-1234"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && evaluateRisk()}
                className="font-mono"
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={evaluateRisk}
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                {isLoading ? (
                  <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
                Evaluate Risk
              </Button>
            </div>
          </div>

          {/* Quick search suggestions */}
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-sm text-muted-foreground">Try:</span>
            {["TXN-001", "TXN-002", "ACC-9012", "ACC-1234"].map((id) => (
              <Badge
                key={id}
                variant="outline"
                className="cursor-pointer hover:bg-secondary"
                onClick={() => {
                  setSearchId(id);
                  setTimeout(evaluateRisk, 100);
                }}
              >
                {id}
              </Badge>
            ))}
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="grid gap-6 lg:grid-cols-3 animate-fade-in">
            {/* Risk Score Display */}
            <div className="lg:col-span-1">
              <div className="glass-card p-8 flex flex-col items-center">
                <h2 className="text-lg font-semibold mb-6">Risk Assessment</h2>
                <RiskMeter score={result.score} size="lg" />

                <div className="mt-6 w-full space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Entity Type</span>
                    <Badge variant="outline">
                      {result.type.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Entity ID</span>
                    <span className="font-mono font-semibold">{result.id}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Risk Level</span>
                    <Badge variant={getStatusColor(result.score)}>
                      {result.score <= 30 ? "LOW" : result.score <= 70 ? "MEDIUM" : "HIGH"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Risk Factors */}
            <div className="lg:col-span-2 space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <StatsCard
                  title="Fraud Links"
                  value={result.details.linkedFraudAccounts}
                  icon={Link2}
                  variant={result.details.linkedFraudAccounts > 0 ? "fraud" : "safe"}
                />
                <StatsCard
                  title="Amount Flag"
                  value={result.details.abnormalAmount ? "Yes" : "No"}
                  icon={DollarSign}
                  variant={result.details.abnormalAmount ? "warning" : "safe"}
                />
                <StatsCard
                  title="Location"
                  value={result.details.locationMismatch ? "Mismatch" : "OK"}
                  icon={MapPin}
                  variant={result.details.locationMismatch ? "fraud" : "safe"}
                />
                <StatsCard
                  title="Device/IP"
                  value={result.details.deviceReuse || result.details.ipReuse ? "Reused" : "Unique"}
                  icon={Smartphone}
                  variant={result.details.deviceReuse || result.details.ipReuse ? "warning" : "safe"}
                />
              </div>

              {/* Detailed Factors */}
              <div className="glass-card p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5 text-primary" />
                  Risk Factors Analysis
                </h2>

                <div className="space-y-3">
                  {result.factors.length === 0 ? (
                    <div className="flex items-center gap-3 rounded-lg bg-safe/10 border border-safe/30 p-4">
                      <CheckCircle className="h-5 w-5 text-safe" />
                      <span className="text-safe">No significant risk factors detected</span>
                    </div>
                  ) : (
                    result.factors.map((factor, i) => (
                      <div
                        key={i}
                        className={cn(
                          "flex items-center justify-between rounded-lg border p-4 transition-all duration-300 hover:scale-[1.01]",
                          severityColors[factor.severity]
                        )}
                      >
                        <div className="flex items-center gap-3">
                          {factor.severity === "high" ? (
                            <AlertTriangle className="h-5 w-5" />
                          ) : factor.severity === "medium" ? (
                            <TrendingUp className="h-5 w-5" />
                          ) : (
                            <Gauge className="h-5 w-5" />
                          )}
                          <span className="font-medium">{factor.factor}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge
                            variant={
                              factor.severity === "high"
                                ? "fraud"
                                : factor.severity === "medium"
                                ? "warning"
                                : "normal"
                            }
                          >
                            {factor.severity.toUpperCase()}
                          </Badge>
                          <span className="font-mono font-bold">+{factor.score}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Total */}
                {result.factors.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                    <span className="font-semibold">Total Risk Score</span>
                    <span
                      className={cn(
                        "text-2xl font-mono font-bold",
                        result.score <= 30
                          ? "text-safe"
                          : result.score <= 70
                          ? "text-warning"
                          : "text-fraud"
                      )}
                    >
                      {result.score}/100
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!result && !isLoading && (
          <div className="glass-card p-12 text-center">
            <Gauge className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Ready to Evaluate</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Enter a Transaction ID or Account ID above to run a comprehensive
              risk assessment with multi-factor analysis.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default RiskScoring;
