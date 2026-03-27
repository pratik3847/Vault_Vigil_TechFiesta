import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { NetworkGraph } from "@/components/NetworkGraph";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Network,
  Users,
  Smartphone,
  Globe,
  AlertTriangle,
  Link2,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

type RiskLevel = "safe" | "warning" | "fraud";

type GraphNode = {
  id: string;
  x: number;
  y: number;
  type: "account" | "device" | "ip";
  isFraud: boolean;
  label: string;
  riskLevel?: RiskLevel;
};

type GraphEdge = {
  from: string;
  to: string;
  type: "transaction" | "shared_device" | "shared_ip";
  isSuspicious: boolean;
  riskLevel?: RiskLevel;
};

type RelationshipInput = {
  accountAId: string;
  accountBId: string;
  sharedDeviceId?: string;
  sharedIpAddress?: string;
  transferCount: number;
};

type RiskContribution = {
  reason: string;
  value: number;
};

type AnalyzedRelationship = RelationshipInput & {
  id: string;
  riskScore: number;
  riskLevel: RiskLevel;
  contributions: RiskContribution[];
};

interface LinkedAccount {
  id: string;
  type: "direct" | "shared_device" | "shared_ip";
  riskLevel: "safe" | "warning" | "fraud";
  connection: string;
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const normalizeAccountId = (value: string) => value.trim().toUpperCase();

const normalizeDeviceId = (value?: string) => {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  const upper = trimmed.toUpperCase();
  return upper.startsWith("DEV-") ? upper : `DEV-${upper}`;
};

const normalizeIpId = (value?: string) => {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  const normalized = trimmed.startsWith("IP-") ? trimmed.slice(3) : trimmed;
  return `IP-${normalized}`;
};

const ipLabelFromId = (ipNodeId: string) => ipNodeId.startsWith("IP-") ? ipNodeId.slice(3) : ipNodeId;

const hashToUnit = (input: string) => {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return (hash % 1000) / 1000;
};

const positionForNode = (id: string, type: GraphNode["type"]) => {
  const base = hashToUnit(id);
  const base2 = hashToUnit(`${id}::y`);

  const jitter = (n: number) => (n - 0.5) * 10;
  const xBase = 10 + base * 80;
  const yBase = 10 + base2 * 80;

  if (type === "device") {
    return {
      x: clamp(50 + jitter(base), 15, 85),
      y: clamp(35 + jitter(base2), 15, 85),
    };
  }

  if (type === "ip") {
    return {
      x: clamp(70 + jitter(base), 15, 90),
      y: clamp(70 + jitter(base2), 15, 90),
    };
  }

  return {
    x: clamp(xBase, 10, 90),
    y: clamp(yBase, 10, 90),
  };
};

const analyzeRelationship = (input: RelationshipInput): Omit<AnalyzedRelationship, "id"> => {
  const contributions: RiskContribution[] = [];

  if (input.sharedDeviceId) {
    contributions.push({ reason: "Shared device detected", value: 30 });
  }

  if (input.sharedIpAddress) {
    contributions.push({ reason: "Shared IP address detected", value: 30 });
  }

  if (input.transferCount > 5) {
    const extra = clamp((input.transferCount - 5) * 3, 0, 15);
    contributions.push({
      reason: `High transfer count (${input.transferCount})`,
      value: 20 + extra,
    });
  }

  const riskScore = clamp(
    contributions.reduce((sum, c) => sum + c.value, 0),
    0,
    100
  );

  const riskLevel: RiskLevel = riskScore >= 75 ? "fraud" : riskScore >= 40 ? "warning" : "safe";

  return {
    ...input,
    riskScore,
    riskLevel,
    contributions,
  };
};

const toNodeRisk = (level: RiskLevel) => {
  if (level === "fraud") return { isFraud: true, riskLevel: "fraud" as const };
  if (level === "warning") return { isFraud: false, riskLevel: "warning" as const };
  return { isFraud: false, riskLevel: "safe" as const };
};

const mergeRiskLevel = (current: RiskLevel | undefined, next: RiskLevel): RiskLevel => {
  if (current === "fraud" || next === "fraud") return "fraud";
  if (current === "warning" || next === "warning") return "warning";
  return "safe";
};

const buildGraphFromRelationships = (relationships: AnalyzedRelationship[]) => {
  const nodeMap = new Map<string, GraphNode>();
  const edges: GraphEdge[] = [];

  const upsertNode = (id: string, type: GraphNode["type"], label: string, risk: RiskLevel) => {
    const existing = nodeMap.get(id);
    const mergedRisk = mergeRiskLevel(existing?.riskLevel, risk);
    const pos = existing ? { x: existing.x, y: existing.y } : positionForNode(id, type);
    const nodeRisk = toNodeRisk(mergedRisk);

    nodeMap.set(id, {
      id,
      type,
      label,
      x: pos.x,
      y: pos.y,
      ...nodeRisk,
    });
  };

  for (const rel of relationships) {
    const a = normalizeAccountId(rel.accountAId);
    const b = normalizeAccountId(rel.accountBId);
    const deviceId = normalizeDeviceId(rel.sharedDeviceId);
    const ipId = normalizeIpId(rel.sharedIpAddress);

    upsertNode(a, "account", a, rel.riskLevel);
    upsertNode(b, "account", b, rel.riskLevel);

    edges.push({
      from: a,
      to: b,
      type: "transaction",
      isSuspicious: rel.riskLevel === "fraud",
      riskLevel: rel.riskLevel,
    });

    if (deviceId) {
      upsertNode(deviceId, "device", deviceId, rel.riskLevel);
      edges.push({
        from: a,
        to: deviceId,
        type: "shared_device",
        isSuspicious: rel.riskLevel === "fraud",
        riskLevel: rel.riskLevel,
      });
      edges.push({
        from: b,
        to: deviceId,
        type: "shared_device",
        isSuspicious: rel.riskLevel === "fraud",
        riskLevel: rel.riskLevel,
      });
    }

    if (ipId) {
      upsertNode(ipId, "ip", ipLabelFromId(ipId), rel.riskLevel);
      edges.push({
        from: a,
        to: ipId,
        type: "shared_ip",
        isSuspicious: rel.riskLevel === "fraud",
        riskLevel: rel.riskLevel,
      });
      edges.push({
        from: b,
        to: ipId,
        type: "shared_ip",
        isSuspicious: rel.riskLevel === "fraud",
        riskLevel: rel.riskLevel,
      });
    }
  }

  return {
    nodes: Array.from(nodeMap.values()),
    edges,
  };
};

const FraudAnalysis = () => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const [form, setForm] = useState({
    accountAId: "",
    accountBId: "",
    sharedDeviceId: "",
    sharedIpAddress: "",
    transferCount: "",
  });
  const [bulkJson, setBulkJson] = useState(
    `[
  {
    "accountAId": "ACC-9012",
    "accountBId": "ACC-3456",
    "sharedDeviceId": "DEV-C3D4",
    "sharedIpAddress": "10.0.0.55",
    "transferCount": 6
  }
]`
  );

  const [relationships, setRelationships] = useState<AnalyzedRelationship[]>([]);

  const { nodes, edges } = buildGraphFromRelationships(relationships);

  const getLinkedAccounts = (nodeId: string): LinkedAccount[] => {
    if (!nodeId) return [];

    const linked: LinkedAccount[] = [];
    edges.forEach((edge) => {
      if (edge.from === nodeId) {
        const node = nodes.find((n) => n.id === edge.to);
        if (node) {
          linked.push({
            id: node.id,
            type: edge.type === "transaction" ? "direct" : edge.type === "shared_device" ? "shared_device" : "shared_ip",
            riskLevel: node.riskLevel ?? (node.isFraud ? "fraud" : edge.isSuspicious ? "fraud" : "safe"),
            connection: edge.type,
          });
        }
      } else if (edge.to === nodeId) {
        const node = nodes.find((n) => n.id === edge.from);
        if (node && node.type === "account") {
          linked.push({
            id: node.id,
            type: edge.type === "transaction" ? "direct" : edge.type === "shared_device" ? "shared_device" : "shared_ip",
            riskLevel: node.riskLevel ?? (node.isFraud ? "fraud" : edge.isSuspicious ? "fraud" : "safe"),
            connection: edge.type,
          });
        }
      }
    });

    return linked;
  };

  const selectedNodeData = nodes.find((n) => n.id === selectedNode);
  const linkedAccounts = selectedNode ? getLinkedAccounts(selectedNode) : [];

  const suspiciousLinks = relationships
    .filter((r) => r.riskLevel !== "safe")
    .sort((a, b) => b.riskScore - a.riskScore);

  const addRelationshipFromForm = () => {
    const accountAId = normalizeAccountId(form.accountAId);
    const accountBId = normalizeAccountId(form.accountBId);
    const transferCount = Number(form.transferCount);

    if (!accountAId || !accountBId || Number.isNaN(transferCount)) {
      toast({
        title: "Missing or invalid fields",
        description: "Account A, Account B, and Transfer Count are required.",
        variant: "destructive",
      });
      return;
    }

    if (accountAId === accountBId) {
      toast({
        title: "Invalid relationship",
        description: "Account A and Account B must be different.",
        variant: "destructive",
      });
      return;
    }

    const input: RelationshipInput = {
      accountAId,
      accountBId,
      sharedDeviceId: normalizeDeviceId(form.sharedDeviceId),
      sharedIpAddress: form.sharedIpAddress.trim() ? form.sharedIpAddress.trim() : undefined,
      transferCount: clamp(Math.floor(transferCount), 0, 999),
    };

    const analyzed = analyzeRelationship(input);
    const rel: AnalyzedRelationship = {
      id: `rel-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      ...analyzed,
    };

    setRelationships((prev) => [rel, ...prev]);
    setSelectedNode(null);
    setForm({ accountAId: "", accountBId: "", sharedDeviceId: "", sharedIpAddress: "", transferCount: "" });

    toast({
      title: "Relationship added",
      description: `Computed Link Risk Score: ${rel.riskScore}/100 (${rel.riskLevel.toUpperCase()})`,
    });
  };

  const loadRelationshipsFromJson = () => {
    try {
      const raw = JSON.parse(bulkJson);
      if (!Array.isArray(raw)) {
        throw new Error("JSON must be an array of relationship objects.");
      }

      const parsed: RelationshipInput[] = raw.map((item, index) => {
        const accountAId = normalizeAccountId(String(item.accountAId ?? ""));
        const accountBId = normalizeAccountId(String(item.accountBId ?? ""));
        const transferCount = Number(item.transferCount);
        if (!accountAId || !accountBId || Number.isNaN(transferCount)) {
          throw new Error(`Invalid item at index ${index}. Required: accountAId, accountBId, transferCount.`);
        }
        return {
          accountAId,
          accountBId,
          sharedDeviceId: normalizeDeviceId(item.sharedDeviceId ? String(item.sharedDeviceId) : undefined),
          sharedIpAddress: item.sharedIpAddress ? String(item.sharedIpAddress) : undefined,
          transferCount: clamp(Math.floor(transferCount), 0, 999),
        };
      });

      const analyzed: AnalyzedRelationship[] = parsed.map((r) => {
        const a = analyzeRelationship(r);
        return {
          id: `rel-${Date.now()}-${Math.random().toString(16).slice(2)}`,
          ...a,
        };
      });

      setRelationships(analyzed);
      setSelectedNode(null);

      toast({
        title: "Relationships loaded",
        description: `Loaded ${analyzed.length} relationship(s) from JSON.`,
      });
    } catch (err) {
      toast({
        title: "Invalid JSON",
        description: err instanceof Error ? err.message : "Unable to parse JSON.",
        variant: "destructive",
      });
    }
  };

  const clearRelationships = () => {
    setRelationships([]);
    setSelectedNode(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Fraud Link <span className="text-gradient">Analysis</span>
          </h1>
          <p className="text-muted-foreground">
            Visualize account networks and detect suspicious connection patterns.
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-3">
           
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Flow: Input 3 Analysis 3 Risk Scoring 3 Decision 3 Explanation
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Network Graph */}
          <div className="lg:col-span-2">
            <div className="glass-card p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Network className="h-5 w-5 text-primary" />
                  Network Visualization
                </h2>
                <Button variant="ghost" size="sm" onClick={() => setSelectedNode(null)}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Clear selection
                </Button>
              </div>

              {/* Input Panel */}
              <Card className="mb-4 border-border/50 bg-card/50">
                <CardHeader>
                  <CardTitle className="text-base">Relationship Input</CardTitle>
                  <CardDescription>
                    Frontend-only prototype. Add relationships to generate the graph and compute a Link Risk Score.
                  </CardDescription>
                  <div className="flex flex-wrap items-center gap-2">
                  
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 lg:grid-cols-2">
                    <div className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="accountAId">Account A ID</Label>
                        <Input
                          id="accountAId"
                          value={form.accountAId}
                          onChange={(e) => setForm((p) => ({ ...p, accountAId: e.target.value }))}
                          placeholder="ACC-1234"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="accountBId">Account B ID</Label>
                        <Input
                          id="accountBId"
                          value={form.accountBId}
                          onChange={(e) => setForm((p) => ({ ...p, accountBId: e.target.value }))}
                          placeholder="ACC-5678"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="sharedDeviceId">Shared Device ID (optional)</Label>
                        <Input
                          id="sharedDeviceId"
                          value={form.sharedDeviceId}
                          onChange={(e) => setForm((p) => ({ ...p, sharedDeviceId: e.target.value }))}
                          placeholder="DEV-C3D4"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="sharedIpAddress">Shared IP Address (optional)</Label>
                        <Input
                          id="sharedIpAddress"
                          value={form.sharedIpAddress}
                          onChange={(e) => setForm((p) => ({ ...p, sharedIpAddress: e.target.value }))}
                          placeholder="10.0.0.55"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="transferCount">Transfer Count</Label>
                        <Input
                          id="transferCount"
                          inputMode="numeric"
                          value={form.transferCount}
                          onChange={(e) => setForm((p) => ({ ...p, transferCount: e.target.value }))}
                          placeholder="6"
                        />
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Button onClick={addRelationshipFromForm}>Add Relationship</Button>
                        <Button variant="secondary" onClick={clearRelationships}>
                          Clear All
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="grid gap-2">
                        <Label htmlFor="bulkJson">Bulk JSON Input</Label>
                        <Textarea
                          id="bulkJson"
                          value={bulkJson}
                          onChange={(e) => setBulkJson(e.target.value)}
                          className="min-h-[230px] font-mono text-xs"
                        />
                        <p className="text-xs text-muted-foreground">
                          Expected fields per item: <span className="font-mono">accountAId</span>, <span className="font-mono">accountBId</span>,
                          optional <span className="font-mono">sharedDeviceId</span>/<span className="font-mono">sharedIpAddress</span>, and <span className="font-mono">transferCount</span>.
                          {/* TODO: Replace with backend/ML-driven link intelligence. */}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" onClick={loadRelationshipsFromJson}>
                          Load JSON
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {nodes.length === 0 ? (
                <div className="rounded-xl border border-border/50 bg-card/30 p-8 text-center text-muted-foreground">
                  <Network className="h-10 w-10 mx-auto mb-3 opacity-60" />
                  <p className="font-medium text-foreground">No relationships yet</p>
                  <p className="text-sm text-muted-foreground">
                    Add a relationship (form or JSON) to generate the network graph.
                  </p>
                </div>
              ) : (
              <NetworkGraph
                nodes={nodes}
                edges={edges}
                onNodeClick={setSelectedNode}
                selectedNode={selectedNode}
              />
              )}
            </div>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Selected Node Info */}
            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Node Details
              </h2>

              {selectedNodeData ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Node ID</span>
                    <span className="font-mono font-semibold">{selectedNodeData.id}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Type</span>
                    <Badge variant={selectedNodeData.isFraud ? "fraud" : "safe"}>
                      {selectedNodeData.type.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <Badge variant={selectedNodeData.isFraud ? "fraud" : "safe"}>
                      {selectedNodeData.isFraud ? "FLAGGED" : "CLEAN"}
                    </Badge>
                  </div>

                  {/* Linked Accounts */}
                  <div className="border-t border-border pt-4 mt-4">
                    <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                      <Link2 className="h-4 w-4" />
                      Connected Entities ({linkedAccounts.length})
                    </h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {linkedAccounts.map((account) => (
                        <div
                          key={account.id}
                          className="flex items-center justify-between rounded-lg bg-secondary/50 p-3 text-sm cursor-pointer hover:bg-secondary transition-colors"
                          onClick={() => setSelectedNode(account.id)}
                        >
                          <div className="flex items-center gap-2">
                            {account.type === "shared_device" ? (
                              <Smartphone className="h-4 w-4 text-warning" />
                            ) : account.type === "shared_ip" ? (
                              <Globe className="h-4 w-4 text-primary" />
                            ) : (
                              <Users className="h-4 w-4 text-muted-foreground" />
                            )}
                            <span className="font-mono">{account.id}</span>
                          </div>
                          <Badge
                            variant={
                              account.riskLevel === "fraud"
                                ? "fraud"
                                : account.riskLevel === "warning"
                                ? "warning"
                                : "safe"
                            }
                          >
                            {account.riskLevel.toUpperCase()}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Network className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Click on a node in the graph to view details</p>
                </div>
              )}
            </div>

            {/* Suspicious Links */}
            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-fraud" />
                Suspicious Links
              </h2>

              {suspiciousLinks.length === 0 ? (
                <div className="rounded-lg border border-border/50 bg-card/30 p-4 text-sm text-muted-foreground">
                  No suspicious links detected yet. Add relationships to see analysis.
                </div>
              ) : (
                <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
                  {suspiciousLinks.map((rel) => (
                    <div
                      key={rel.id}
                      className={
                        rel.riskLevel === "fraud"
                          ? "rounded-lg border border-fraud/30 bg-fraud/5 p-4"
                          : "rounded-lg border border-warning/30 bg-warning/5 p-4"
                      }
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge
                              variant={rel.riskLevel === "fraud" ? "fraud" : "warning"}
                              className="cursor-pointer hover:opacity-80"
                              onClick={() => setSelectedNode(normalizeAccountId(rel.accountAId))}
                            >
                              {normalizeAccountId(rel.accountAId)}
                            </Badge>
                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                            <Badge
                              variant={rel.riskLevel === "fraud" ? "fraud" : "warning"}
                              className="cursor-pointer hover:opacity-80"
                              onClick={() => setSelectedNode(normalizeAccountId(rel.accountBId))}
                            >
                              {normalizeAccountId(rel.accountBId)}
                            </Badge>
                          </div>
                          <p className="mt-2 text-sm text-muted-foreground">
                            Link Risk Score: <span className="font-mono font-semibold text-foreground">{rel.riskScore}/100</span>
                          </p>
                        </div>

                        <Badge variant={rel.riskLevel === "fraud" ? "fraud" : "warning"}>
                          {rel.riskLevel.toUpperCase()}
                        </Badge>
                      </div>

                      <div className="mt-3 space-y-2">
                        {rel.contributions.length === 0 ? (
                          <div className="text-sm text-muted-foreground">No risk factors triggered.</div>
                        ) : (
                          rel.contributions.map((c) => (
                            <div key={c.reason} className="flex items-center justify-between text-sm">
                              <span className="text-foreground">{c.reason}</span>
                              <span className="font-mono text-muted-foreground">+{c.value}</span>
                            </div>
                          ))
                        )}
                      </div>

                      {(rel.sharedDeviceId || rel.sharedIpAddress) && (
                        <div className="mt-3 grid gap-2 text-xs text-muted-foreground">
                          {rel.sharedDeviceId && (
                            <div className="flex items-center gap-2">
                              <Smartphone className="h-3.5 w-3.5 text-warning" />
                              <span className="font-mono">{normalizeDeviceId(rel.sharedDeviceId)}</span>
                            </div>
                          )}
                          {rel.sharedIpAddress && (
                            <div className="flex items-center gap-2">
                              <Globe className="h-3.5 w-3.5 text-primary" />
                              <span className="font-mono">{rel.sharedIpAddress}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FraudAnalysis;