import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { NetworkGraph } from "@/components/NetworkGraph";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { networkNodes, networkEdges } from "@/data/mockData";

interface LinkedAccount {
  id: string;
  type: "direct" | "shared_device" | "shared_ip";
  riskLevel: "safe" | "warning" | "fraud";
  connection: string;
}

const FraudAnalysis = () => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const getLinkedAccounts = (nodeId: string): LinkedAccount[] => {
    if (!nodeId) return [];

    const linked: LinkedAccount[] = [];
    networkEdges.forEach((edge) => {
      if (edge.from === nodeId) {
        const node = networkNodes.find((n) => n.id === edge.to);
        if (node) {
          linked.push({
            id: node.id,
            type: edge.type === "transaction" ? "direct" : edge.type === "shared_device" ? "shared_device" : "shared_ip",
            riskLevel: node.isFraud ? "fraud" : edge.isSuspicious ? "warning" : "safe",
            connection: edge.type,
          });
        }
      } else if (edge.to === nodeId) {
        const node = networkNodes.find((n) => n.id === edge.from);
        if (node && node.type === "account") {
          linked.push({
            id: node.id,
            type: edge.type === "transaction" ? "direct" : edge.type === "shared_device" ? "shared_device" : "shared_ip",
            riskLevel: node.isFraud ? "fraud" : edge.isSuspicious ? "warning" : "safe",
            connection: edge.type,
          });
        }
      }
    });

    return linked;
  };

  const selectedNodeData = networkNodes.find((n) => n.id === selectedNode);
  const linkedAccounts = selectedNode ? getLinkedAccounts(selectedNode) : [];

  const fraudChains = [
    {
      id: "chain-1",
      accounts: ["ACC-9012", "ACC-3456"],
      sharedDevices: ["DEV-C3D4"],
      sharedIPs: ["10.0.0.55"],
      totalTransactions: 5,
      totalAmount: 33500,
    },
  ];

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
                <Button variant="ghost" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
              <NetworkGraph
                nodes={networkNodes}
                edges={networkEdges}
                onNodeClick={setSelectedNode}
                selectedNode={selectedNode}
              />
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

            {/* Fraud Chains */}
            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-fraud" />
                Detected Fraud Chains
              </h2>

              <div className="space-y-4">
                {fraudChains.map((chain) => (
                  <div
                    key={chain.id}
                    className="rounded-lg border border-fraud/30 bg-fraud/5 p-4"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      {chain.accounts.map((acc, i) => (
                        <div key={acc} className="flex items-center">
                          <Badge
                            variant="fraud"
                            className="cursor-pointer hover:opacity-80"
                            onClick={() => setSelectedNode(acc)}
                          >
                            {acc}
                          </Badge>
                          {i < chain.accounts.length - 1 && (
                            <ArrowRight className="h-4 w-4 mx-1 text-fraud" />
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4 text-warning" />
                        <span className="text-muted-foreground">
                          {chain.sharedDevices.length} Shared Device(s)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-primary" />
                        <span className="text-muted-foreground">
                          {chain.sharedIPs.length} Shared IP(s)
                        </span>
                      </div>
                      <div className="col-span-2 pt-2 border-t border-fraud/20 mt-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total Amount</span>
                          <span className="font-mono font-semibold text-fraud">
                            ${chain.totalAmount.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FraudAnalysis;