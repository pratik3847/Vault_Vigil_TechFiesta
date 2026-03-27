import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { StatsCard } from "@/components/StatsCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Skull,
  Trash2,
  Send,
  MapPin,
  Smartphone,
  Globe,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { apiGet } from "@/lib/api";

interface Transaction {
  id: string;
  senderId: string;
  receiverId: string;
  amount: number;
  location: string;
  deviceId: string;
  ipAddress: string;
  timestamp: string | Date;
  status: "normal" | "fraud";
  riskScore: number;
}

const generateRandomTransaction = (isFraud: boolean): Transaction => {
  const locations = isFraud
    ? ["Lagos, NG", "Moscow, RU", "Unknown", "Pyongyang, KP"]
    : ["New York, US", "London, UK", "Tokyo, JP", "Berlin, DE", "Sydney, AU"];

  const id = `TXN-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  const senderId = `ACC-${Math.floor(Math.random() * 9000 + 1000)}`;
  const receiverId = `ACC-${Math.floor(Math.random() * 9000 + 1000)}`;

  return {
    id,
    senderId,
    receiverId,
    amount: isFraud ? Math.floor(Math.random() * 50000 + 10000) : Math.floor(Math.random() * 5000 + 100),
    location: locations[Math.floor(Math.random() * locations.length)],
    deviceId: isFraud ? "DEV-SUSP01" : `DEV-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
    ipAddress: isFraud ? "10.0.0.55" : `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    timestamp: new Date(),
    status: isFraud ? "fraud" : "normal",
    riskScore: isFraud ? Math.floor(Math.random() * 30 + 70) : Math.floor(Math.random() * 30),
  };
};

const TransactionSimulator = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [formData, setFormData] = useState({
    senderId: "",
    receiverId: "",
    amount: "",
    location: "",
    deviceId: "",
    ipAddress: "",
  });

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const txs = await apiGet<Transaction[]>("/api/transactions");
        if (cancelled) return;
        setTransactions(txs);
      } catch {
        toast({
          title: "Backend Unavailable",
          description: "Could not load initial transactions from the API.",
          variant: "destructive",
        });
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generateTransaction = (isFraud: boolean) => {
    const newTransaction = generateRandomTransaction(isFraud);
    setTransactions([newTransaction, ...transactions]);
    toast({
      title: isFraud ? "Fraudulent Transaction Generated" : "Normal Transaction Generated",
      description: `Transaction ${newTransaction.id} has been added to the list.`,
      variant: isFraud ? "destructive" : "default",
    });
  };

  const submitCustomTransaction = () => {
    if (!formData.senderId || !formData.receiverId || !formData.amount) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const isFraud = parseFloat(formData.amount) > 10000 || formData.location.toLowerCase().includes("unknown");
    const newTransaction: Transaction = {
      id: `TXN-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      senderId: formData.senderId,
      receiverId: formData.receiverId,
      amount: parseFloat(formData.amount),
      location: formData.location || "Unknown",
      deviceId: formData.deviceId || `DEV-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
      ipAddress: formData.ipAddress || `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      timestamp: new Date(),
      status: isFraud ? "fraud" : "normal",
      riskScore: isFraud ? Math.floor(Math.random() * 30 + 70) : Math.floor(Math.random() * 30),
    };

    setTransactions([newTransaction, ...transactions]);
    setFormData({ senderId: "", receiverId: "", amount: "", location: "", deviceId: "", ipAddress: "" });
    toast({
      title: "Transaction Submitted",
      description: `Transaction ${newTransaction.id} has been analyzed and added.`,
    });
  };

  const clearTransactions = () => {
    setTransactions([]);
    toast({
      title: "Transactions Cleared",
      description: "All transactions have been removed.",
    });
  };

  const normalCount = transactions.filter((t) => t.status === "normal").length;
  const fraudCount = transactions.filter((t) => t.status === "fraud").length;
  const avgRisk = transactions.length
    ? Math.round(transactions.reduce((sum, t) => sum + t.riskScore, 0) / transactions.length)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Transaction <span className="text-gradient">Simulator</span>
          </h1>
          <p className="text-muted-foreground">
            Generate and analyze transaction patterns to test fraud detection capabilities.
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-3">
            
            {/* <Badge variant="outline">Simulated AI Logic</Badge> */}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Flow: Input 3 Analysis 3 Risk Scoring 3 Decision 3 Explanation
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatsCard
            title="Total Transactions"
            value={transactions.length}
            icon={Activity}
          />
          <StatsCard
            title="Normal Transactions"
            value={normalCount}
            icon={CheckCircle2}
            variant="safe"
          />
          <StatsCard
            title="Fraud Detected"
            value={fraudCount}
            icon={AlertTriangle}
            variant="fraud"
          />
          <StatsCard
            title="Avg. Risk Score"
            value={avgRisk}
            icon={Activity}
            variant={avgRisk > 50 ? "warning" : "default"}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Form */}
          <div className="lg:col-span-1">
            <div className="glass-card p-6 space-y-6">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Send className="h-5 w-5 text-primary" />
                Custom Transaction
              </h2>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="senderId">Sender Account ID *</Label>
                  <Input
                    id="senderId"
                    name="senderId"
                    placeholder="ACC-1234"
                    value={formData.senderId}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="receiverId">Receiver Account ID *</Label>
                  <Input
                    id="receiverId"
                    name="receiverId"
                    placeholder="ACC-5678"
                    value={formData.receiverId}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Amount ($) *</Label>
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    placeholder="1000"
                    value={formData.amount}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location" className="flex items-center gap-2">
                    <MapPin className="h-3 w-3" /> Location
                  </Label>
                  <Input
                    id="location"
                    name="location"
                    placeholder="New York, US"
                    value={formData.location}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deviceId" className="flex items-center gap-2">
                    <Smartphone className="h-3 w-3" /> Device ID
                  </Label>
                  <Input
                    id="deviceId"
                    name="deviceId"
                    placeholder="DEV-A1B2"
                    value={formData.deviceId}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ipAddress" className="flex items-center gap-2">
                    <Globe className="h-3 w-3" /> IP Address
                  </Label>
                  <Input
                    id="ipAddress"
                    name="ipAddress"
                    placeholder="192.168.1.1"
                    value={formData.ipAddress}
                    onChange={handleInputChange}
                  />
                </div>

                <Button onClick={submitCustomTransaction} className="w-full">
                  <Plus className="h-4 w-4" />
                  Submit Transaction
                </Button>
              </div>

              <div className="border-t border-border pt-6 space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground">Quick Generate</h3>
                <Button
                  variant="safe"
                  className="w-full"
                  onClick={() => generateTransaction(false)}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Generate Normal Transaction
                </Button>
                <Button
                  variant="fraud"
                  className="w-full"
                  onClick={() => generateTransaction(true)}
                >
                  <Skull className="h-4 w-4" />
                  Generate Fraudulent Transaction
                </Button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="lg:col-span-2">
            <div className="glass-card overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h2 className="text-lg font-semibold">Transaction History</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearTransactions}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                  Clear All
                </Button>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Sender</TableHead>
                      <TableHead>Receiver</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Risk</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          No transactions yet. Generate or submit a transaction to begin.
                        </TableCell>
                      </TableRow>
                    ) : (
                      transactions.map((tx) => (
                        <TableRow key={tx.id} className="hover:bg-secondary/50">
                          <TableCell className="font-mono text-sm">{tx.id}</TableCell>
                          <TableCell className="font-mono text-sm">{tx.senderId}</TableCell>
                          <TableCell className="font-mono text-sm">{tx.receiverId}</TableCell>
                          <TableCell className="text-right font-mono">
                            ${tx.amount.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-sm">{tx.location}</TableCell>
                          <TableCell>
                            <span
                              className={`font-mono font-semibold ${
                                tx.riskScore > 70
                                  ? "text-fraud"
                                  : tx.riskScore > 30
                                  ? "text-warning"
                                  : "text-safe"
                              }`}
                            >
                              {tx.riskScore}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge variant={tx.status === "fraud" ? "fraud" : "normal"}>
                              {tx.status === "fraud" ? "FRAUD" : "NORMAL"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TransactionSimulator;
