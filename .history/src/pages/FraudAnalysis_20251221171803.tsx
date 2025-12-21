import { useState } from "react";
import Navbar from "@/components/Navbar";
import NetworkGraph from "@/components/NetworkGraph";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import {
  AlertCircle,
  Plus,
  Upload,
  Trash2,
  Network,
  AlertTriangle,
  CheckCircle2,
  Info,
  TrendingUp,
  Link2,
} from "lucide-react";

/**
 * Network node interface representing an account in the fraud network
 */
interface NetworkNode {
  id: string;
  label: string;
  x: number;
  y: number;
  risk: number;
  size?: number;
  color?: string;
}

/**
 * Network edge interface representing a link between accounts
 */
interface NetworkEdge {
  source: string;
  target: string;
  type: "transaction" | "shared_device" | "shared_ip";
  value?: string;
  amount?: number;
  timestamp?: string;
}

/**
 * Form data interface for manual link input
 */
interface LinkFormData {
  accountA: string;
  accountB: string;
  linkType: "transaction" | "shared_device" | "shared_ip";
  value: string;
  amount: string;
}

/**
 * Detected fraud chain interface
 */
interface FraudChain {
  accounts: string[];
  riskScore: number;
  reason: string;
  pattern: string;
}

/**
 * Circular pattern interface for money flow detection
 */
interface CircularPattern {
  path: string[];
  totalAmount: number;
  riskLevel: "high" | "medium" | "low";
}

const FraudAnalysis = () => {
  const { toast } = useToast();
  
  // State management
  const [nodes, setNodes] = useState<NetworkNode[]>([]);
  const [edges, setEdges] = useState<NetworkEdge[]>([]);
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);
  const [linkForm, setLinkForm] = useState<LinkFormData>({
    accountA: "",
    accountB: "",
    linkType: "transaction",
    value: "",
    amount: "",
  });
  const [jsonInput, setJsonInput] = useState("");
  const [fraudChains, setFraudChains] = useState<FraudChain[]>([]);
  const [circularPatterns, setCircularPatterns] = useState<CircularPattern[]>([]);

  /**
   * Calculates link risk score for a given account based on its connections
   * 
   * Mock AI Logic:
   * - Base risk from number of connections (more connections = higher risk)
   * - Shared device connections increase risk by 20 points each
   * - Shared IP connections increase risk by 15 points each
   * - Transaction connections with shared device/IP partners increase risk
   * - Caps at 100 (maximum risk)
   * 
   * @param accountId - The account ID to calculate risk for
   * @param edges - Array of all network edges
   * @returns Risk score between 0-100
   */
  const calculateLinkRisk = (accountId: string, edges: NetworkEdge[]): number => {
    const accountEdges = edges.filter(
      (e) => e.source === accountId || e.target === accountId
    );

    if (accountEdges.length === 0) return 0;

    let riskScore = 0;

    // Base risk: number of connections (max 30 points)
    riskScore += Math.min(accountEdges.length * 5, 30);

    // Shared device connections (20 points each, max 40)
    const sharedDevices = accountEdges.filter((e) => e.type === "shared_device").length;
    riskScore += Math.min(sharedDevices * 20, 40);

    // Shared IP connections (15 points each, max 30)
    const sharedIPs = accountEdges.filter((e) => e.type === "shared_ip").length;
    riskScore += Math.min(sharedIPs * 15, 30);

    // Additional risk if transactions exist with risky partners
    const transactions = accountEdges.filter((e) => e.type === "transaction");
    const riskyPartners = new Set<string>();

    accountEdges.forEach((edge) => {
      if (edge.type !== "transaction") {
        const partnerId = edge.source === accountId ? edge.target : edge.source;
        riskyPartners.add(partnerId);
      }
    });

    transactions.forEach((trans) => {
      const partnerId = trans.source === accountId ? trans.target : trans.source;
      if (riskyPartners.has(partnerId)) {
        riskScore += 10; // Additional risk for transacting with risky partners
      }
    });

    return Math.min(Math.round(riskScore), 100);
  };

  /**
   * Detects circular money flow patterns in the transaction network
   * 
   * Mock AI Logic:
   * - Uses depth-first search to find cycles in transaction graph
   * - Only considers transaction edges (not shared device/IP)
   * - Calculates total amount flowing in circle
   * - Risk level based on circle size and amount:
   *   - High: 4+ accounts or >$50,000 total
   *   - Medium: 3 accounts or >$20,000 total
   *   - Low: 2 accounts or smaller amounts
   * 
   * @param edges - Array of all network edges
   * @returns Array of detected circular patterns
   */
  const detectCircularPatterns = (edges: NetworkEdge[]): CircularPattern[] => {
    const patterns: CircularPattern[] = [];
    const transactionEdges = edges.filter((e) => e.type === "transaction");
    
    if (transactionEdges.length === 0) return patterns;

    // Build adjacency list for transactions
    const graph = new Map<string, Array<{ to: string; amount: number }>>();
    transactionEdges.forEach((edge) => {
      if (!graph.has(edge.source)) graph.set(edge.source, []);
      graph.get(edge.source)!.push({
        to: edge.target,
        amount: edge.amount || 0,
      });
    });

    // DFS to find cycles
    const visited = new Set<string>();
    const recursionStack = new Set<string>();
    const currentPath: string[] = [];

    const dfs = (node: string, pathAmount: number) => {
      visited.add(node);
      recursionStack.add(node);
      currentPath.push(node);

      const neighbors = graph.get(node) || [];
      for (const neighbor of neighbors) {
        const newAmount = pathAmount + neighbor.amount;

        if (!visited.has(neighbor.to)) {
          dfs(neighbor.to, newAmount);
        } else if (recursionStack.has(neighbor.to)) {
          // Found a cycle
          const cycleStartIndex = currentPath.indexOf(neighbor.to);
          if (cycleStartIndex !== -1) {
            const cyclePath = currentPath.slice(cycleStartIndex);
            cyclePath.push(neighbor.to); // Complete the cycle

            // Calculate risk level
            let riskLevel: "high" | "medium" | "low" = "low";
            if (cyclePath.length >= 4 || newAmount > 50000) {
              riskLevel = "high";
            } else if (cyclePath.length === 3 || newAmount > 20000) {
              riskLevel = "medium";
            }

            patterns.push({
              path: cyclePath,
              totalAmount: newAmount,
              riskLevel,
            });
          }
        }
      }

      currentPath.pop();
      recursionStack.delete(node);
    };

    // Run DFS from each unvisited node
    for (const [node] of graph) {
      if (!visited.has(node)) {
        dfs(node, 0);
      }
    }

    return patterns;
  };

  /**
   * Detects fraud chains by grouping suspicious accounts
   * 
   * Mock AI Logic:
   * - Groups accounts connected by shared devices or IPs
   * - Calculates aggregate risk score for each group
   * - Identifies patterns:
   *   - "Device Sharing Ring": 3+ accounts sharing devices
   *   - "IP Hopping Network": 3+ accounts sharing IPs
   *   - "Mixed Pattern": Combination of both
   * - Groups with risk > 60 are flagged as high-risk chains
   * 
   * @returns Array of detected fraud chains
   */
  const detectFraudChains = (): FraudChain[] => {
    const chains: FraudChain[] = [];
    const visited = new Set<string>();

    // Build groups of connected accounts
    const groups = new Map<string, Set<string>>();

    edges.forEach((edge) => {
      if (edge.type === "shared_device" || edge.type === "shared_ip") {
        if (!groups.has(edge.source)) {
          groups.set(edge.source, new Set([edge.source]));
        }
        if (!groups.has(edge.target)) {
          groups.set(edge.target, new Set([edge.target]));
        }

        // Merge groups
        const sourceGroup = groups.get(edge.source)!;
        const targetGroup = groups.get(edge.target)!;
        const mergedGroup = new Set([...sourceGroup, ...targetGroup]);

        sourceGroup.forEach((acc) => groups.set(acc, mergedGroup));
        targetGroup.forEach((acc) => groups.set(acc, mergedGroup));
      }
    });

    // Process unique groups
    const uniqueGroups = new Map<string, Set<string>>();
    groups.forEach((group) => {
      const key = Array.from(group).sort().join(",");
      uniqueGroups.set(key, group);
    });

    uniqueGroups.forEach((accountSet) => {
      const accounts = Array.from(accountSet);
      if (accounts.length < 2) return;

      // Calculate aggregate risk
      let totalRisk = 0;
      accounts.forEach((acc) => {
        totalRisk += calculateLinkRisk(acc, edges);
      });
      const avgRisk = Math.round(totalRisk / accounts.length);

      // Determine pattern type
      const deviceLinks = edges.filter(
        (e) =>
          e.type === "shared_device" &&
          accountSet.has(e.source) &&
          accountSet.has(e.target)
      );
      const ipLinks = edges.filter(
        (e) =>
          e.type === "shared_ip" &&
          accountSet.has(e.source) &&
          accountSet.has(e.target)
      );

      let pattern = "Mixed Pattern";
      let reason = "Multiple suspicious connections detected";

      if (deviceLinks.length > ipLinks.length) {
        pattern = "Device Sharing Ring";
        reason = `${accounts.length} accounts sharing ${deviceLinks.length} device(s)`;
      } else if (ipLinks.length > deviceLinks.length) {
        pattern = "IP Hopping Network";
        reason = `${accounts.length} accounts sharing ${ipLinks.length} IP address(es)`;
      } else {
        reason = `${accounts.length} accounts with ${deviceLinks.length} shared devices and ${ipLinks.length} shared IPs`;
      }

      if (avgRisk > 40) {
        chains.push({
          accounts,
          riskScore: avgRisk,
          reason,
          pattern,
        });
      }
    });

    return chains.sort((a, b) => b.riskScore - a.riskScore);
  };

  /**
   * Adds or updates a node in the network
   */
  const addOrUpdateNode = (accountId: string) => {
    setNodes((prevNodes) => {
      const existing = prevNodes.find((n) => n.id === accountId);
      if (existing) return prevNodes;

      const risk = calculateLinkRisk(accountId, edges);
      const newNode: NetworkNode = {
        id: accountId,
        label: accountId,
        x: Math.random() * 400 - 200,
        y: Math.random() * 400 - 200,
        risk,
        size: 20 + risk / 5,
        color: risk > 70 ? "#ef4444" : risk > 40 ? "#f97316" : "#22c55e",
      };

      return [...prevNodes, newNode];
    });
  };

  /**
   * Recalculates risk scores for all nodes
   */
  const recalculateRisks = () => {
    setNodes((prevNodes) =>
      prevNodes.map((node) => {
        const risk = calculateLinkRisk(node.id, edges);
        return {
          ...node,
          risk,
          size: 20 + risk / 5,
          color: risk > 70 ? "#ef4444" : risk > 40 ? "#f97316" : "#22c55e",
        };
      })
    );
  };

  /**
   * Adds a manual link from the form
   */
  const addManualLink = () => {
    if (!linkForm.accountA || !linkForm.accountB) {
      toast({
        title: "Validation Error",
        description: "Please enter both Account A and Account B",
        variant: "destructive",
      });
      return;
    }

    if (linkForm.accountA === linkForm.accountB) {
      toast({
        title: "Validation Error",
        description: "Accounts cannot be linked to themselves",
        variant: "destructive",
      });
      return;
    }

    const newEdge: NetworkEdge = {
      source: linkForm.accountA,
      target: linkForm.accountB,
      type: linkForm.linkType,
      value: linkForm.value || undefined,
      amount: linkForm.amount ? parseFloat(linkForm.amount) : undefined,
      timestamp: new Date().toISOString(),
    };

    setEdges((prev) => [...prev, newEdge]);
    addOrUpdateNode(linkForm.accountA);
    addOrUpdateNode(linkForm.accountB);

    setTimeout(() => {
      recalculateRisks();
      setFraudChains(detectFraudChains());
      setCircularPatterns(detectCircularPatterns(edges));
    }, 100);

    toast({
      title: "Link Added",
      description: `Successfully added ${linkForm.linkType} link between ${linkForm.accountA} and ${linkForm.accountB}`,
    });

    // Reset form
    setLinkForm({
      accountA: "",
      accountB: "",
      linkType: "transaction",
      value: "",
      amount: "",
    });
  };

  /**
   * Imports bulk links from JSON input
   */
  const importBulkLinks = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      
      if (!Array.isArray(parsed)) {
        throw new Error("JSON must be an array of links");
      }

      let validCount = 0;
      const newEdges: NetworkEdge[] = [];

      parsed.forEach((item, index) => {
        if (!item.source || !item.target || !item.type) {
          console.warn(`Skipping invalid link at index ${index}`);
          return;
        }

        newEdges.push({
          source: item.source,
          target: item.target,
          type: item.type,
          value: item.value,
          amount: item.amount ? parseFloat(item.amount) : undefined,
          timestamp: item.timestamp || new Date().toISOString(),
        });

        addOrUpdateNode(item.source);
        addOrUpdateNode(item.target);
        validCount++;
      });

      setEdges((prev) => [...prev, ...newEdges]);

      setTimeout(() => {
        recalculateRisks();
        setFraudChains(detectFraudChains());
        setCircularPatterns(detectCircularPatterns([...edges, ...newEdges]));
      }, 100);

      toast({
        title: "Import Successful",
        description: `Imported ${validCount} links from JSON`,
      });

      setJsonInput("");
    } catch (error) {
      toast({
        title: "Import Failed",
        description: error instanceof Error ? error.message : "Invalid JSON format",
        variant: "destructive",
      });
    }
  };

  /**
   * Clears all graph data
   */
  const clearGraph = () => {
    setNodes([]);
    setEdges([]);
    setSelectedNode(null);
    setFraudChains([]);
    setCircularPatterns([]);
    toast({
      title: "Graph Cleared",
      description: "All nodes and edges have been removed",
    });
  };

  /**
   * Handles node selection from the graph
   */
  const handleNodeClick = (nodeId: string) => {
    const node = nodes.find((n) => n.id === nodeId);
    if (node) {
      setSelectedNode(node);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Network className="h-8 w-8" />
            Fraud Link Analysis
          </h1>
          <p className="text-muted-foreground">
            Analyze connections between accounts to detect fraud patterns, circular money flows, and suspicious networks
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Input Controls */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add Links
                </CardTitle>
                <CardDescription>
                  Add connections manually or import in bulk
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="manual">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="manual">Manual</TabsTrigger>
                    <TabsTrigger value="bulk">Bulk Import</TabsTrigger>
                  </TabsList>

                  <TabsContent value="manual" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="accountA">Account A</Label>
                      <Input
                        id="accountA"
                        placeholder="e.g., ACC001"
                        value={linkForm.accountA}
                        onChange={(e) =>
                          setLinkForm({ ...linkForm, accountA: e.target.value })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="accountB">Account B</Label>
                      <Input
                        id="accountB"
                        placeholder="e.g., ACC002"
                        value={linkForm.accountB}
                        onChange={(e) =>
                          setLinkForm({ ...linkForm, accountB: e.target.value })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="linkType">Link Type</Label>
                      <Select
                        value={linkForm.linkType}
                        onValueChange={(value: any) =>
                          setLinkForm({ ...linkForm, linkType: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="transaction">Transaction</SelectItem>
                          <SelectItem value="shared_device">Shared Device</SelectItem>
                          <SelectItem value="shared_ip">Shared IP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {linkForm.linkType === "transaction" && (
                      <div className="space-y-2">
                        <Label htmlFor="amount">Amount ($)</Label>
                        <Input
                          id="amount"
                          type="number"
                          placeholder="e.g., 1000"
                          value={linkForm.amount}
                          onChange={(e) =>
                            setLinkForm({ ...linkForm, amount: e.target.value })
                          }
                        />
                      </div>
                    )}

                    {linkForm.linkType !== "transaction" && (
                      <div className="space-y-2">
                        <Label htmlFor="value">
                          {linkForm.linkType === "shared_device" ? "Device ID" : "IP Address"}
                        </Label>
                        <Input
                          id="value"
                          placeholder={
                            linkForm.linkType === "shared_device"
                              ? "e.g., DEV12345"
                              : "e.g., 192.168.1.1"
                          }
                          value={linkForm.value}
                          onChange={(e) =>
                            setLinkForm({ ...linkForm, value: e.target.value })
                          }
                        />
                      </div>
                    )}

                    <Button onClick={addManualLink} className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Link
                    </Button>
                  </TabsContent>

                  <TabsContent value="bulk" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="jsonInput">JSON Data</Label>
                      <Textarea
                        id="jsonInput"
                        placeholder={`[\n  {\n    "source": "ACC001",\n    "target": "ACC002",\n    "type": "transaction",\n    "amount": 5000\n  }\n]`}
                        rows={10}
                        value={jsonInput}
                        onChange={(e) => setJsonInput(e.target.value)}
                        className="font-mono text-sm"
                      />
                    </div>

                    <Button onClick={importBulkLinks} className="w-full">
                      <Upload className="h-4 w-4 mr-2" />
                      Import JSON
                    </Button>

                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertTitle>Format</AlertTitle>
                      <AlertDescription className="text-xs">
                        Each link must have: source, target, type. Optional: value, amount, timestamp
                      </AlertDescription>
                    </Alert>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Graph Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <div className="font-medium">Nodes:</div>
                    <div className="text-muted-foreground">{nodes.length}</div>
                  </div>
                  <div>
                    <div className="font-medium">Edges:</div>
                    <div className="text-muted-foreground">{edges.length}</div>
                  </div>
                </div>
                <Button onClick={clearGraph} variant="destructive" size="sm" className="w-full">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Graph
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Center Panel - Network Graph */}
          <div className="lg:col-span-1">
            <Card className="h-[700px]">
              <CardHeader>
                <CardTitle>Network Visualization</CardTitle>
                <CardDescription>
                  Click nodes to view details. Colors indicate risk levels.
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[calc(100%-100px)]">
                {nodes.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <div className="text-center space-y-2">
                      <Network className="h-12 w-12 mx-auto opacity-50" />
                      <p>No data yet</p>
                      <p className="text-sm">Add links to visualize the network</p>
                    </div>
                  </div>
                ) : (
                  <NetworkGraph nodes={nodes} edges={edges} onNodeClick={handleNodeClick} />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Analysis Results */}
          <div className="lg:col-span-1 space-y-4">
            {selectedNode && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Selected Node</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="text-sm font-medium mb-1">Account ID</div>
                    <div className="text-lg font-mono">{selectedNode.id}</div>
                  </div>
                  <Separator />
                  <div>
                    <div className="text-sm font-medium mb-2">Risk Score</div>
                    <div className="flex items-center gap-2">
                      <div className="text-2xl font-bold">{selectedNode.risk}</div>
                      <Badge
                        variant={
                          selectedNode.risk > 70
                            ? "destructive"
                            : selectedNode.risk > 40
                            ? "default"
                            : "secondary"
                        }
                      >
                        {selectedNode.risk > 70 ? "High" : selectedNode.risk > 40 ? "Medium" : "Low"}
                      </Badge>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <div className="text-sm font-medium mb-2">Connections</div>
                    {edges
                      .filter((e) => e.source === selectedNode.id || e.target === selectedNode.id)
                      .map((edge, idx) => (
                        <div key={idx} className="text-sm py-1 flex items-center gap-2">
                          <Link2 className="h-3 w-3" />
                          <span className="font-mono text-xs">
                            {edge.source === selectedNode.id ? edge.target : edge.source}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {edge.type}
                          </Badge>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  Fraud Chains
                </CardTitle>
                <CardDescription>
                  Detected suspicious account groups
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[250px]">
                  {fraudChains.length === 0 ? (
                    <div className="text-sm text-muted-foreground text-center py-8">
                      <CheckCircle2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      No fraud chains detected
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {fraudChains.map((chain, idx) => (
                        <Alert key={idx} variant={chain.riskScore > 70 ? "destructive" : "default"}>
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle className="text-sm font-medium">
                            {chain.pattern}
                          </AlertTitle>
                          <AlertDescription className="text-xs space-y-1">
                            <div>Risk Score: {chain.riskScore}</div>
                            <div>{chain.reason}</div>
                            <div className="font-mono text-xs mt-1">
                              {chain.accounts.join(" → ")}
                            </div>
                          </AlertDescription>
                        </Alert>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="h-5 w-5 text-orange-500" />
                  Circular Patterns
                </CardTitle>
                <CardDescription>
                  Detected circular money flows
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[200px]">
                  {circularPatterns.length === 0 ? (
                    <div className="text-sm text-muted-foreground text-center py-8">
                      <CheckCircle2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      No circular patterns detected
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {circularPatterns.map((pattern, idx) => (
                        <Alert
                          key={idx}
                          variant={pattern.riskLevel === "high" ? "destructive" : "default"}
                        >
                          <TrendingUp className="h-4 w-4" />
                          <AlertTitle className="text-sm font-medium">
                            {pattern.riskLevel.toUpperCase()} Risk Circle
                          </AlertTitle>
                          <AlertDescription className="text-xs space-y-1">
                            <div>Total Flow: ${pattern.totalAmount.toLocaleString()}</div>
                            <div className="font-mono text-xs">
                              {pattern.path.join(" → ")}
                            </div>
                          </AlertDescription>
                        </Alert>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FraudAnalysis;
