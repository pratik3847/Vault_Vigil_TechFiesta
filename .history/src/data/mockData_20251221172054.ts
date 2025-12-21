/**
 * MOCK DATA FOR FRAUD DETECTION SYSTEM
 * 
 * This file contains simulated data for demonstration purposes.
 * In production, this would be replaced with:
 * - Real transaction data from payment gateway
 * - ML model predictions from backend API
 * - Live network analysis from graph database
 * 
 * DATA PATTERNS:
 * - Normal transactions: Amounts $100-$5000, trusted locations, unique devices
 * - Fraud transactions: High amounts (>$10,000), suspicious locations, shared devices/IPs
 * - Network data shows: 2 fraud accounts (ACC-9012, ACC-3456) sharing device & IP
 */

export interface Transaction {
  id: string;
  senderId: string;
  receiverId: string;
  amount: number;
  location: string;
  deviceId: string;
  ipAddress: string;
  timestamp: Date;
  status: "normal" | "fraud";
  riskScore: number;
}

/**
 * SAMPLE TRANSACTIONS
 * Mix of normal and fraudulent transactions for testing
 */
export const mockTransactions: Transaction[] = [
  {
    id: "TXN-001",
    senderId: "ACC-1234",
    receiverId: "ACC-5678",
    amount: 1500,
    location: "New York, US",
    deviceId: "DEV-A1B2",
    ipAddress: "192.168.1.1",
    timestamp: new Date("2024-01-15T10:30:00"),
    status: "normal",
    riskScore: 15,
  },
  {
    id: "TXN-002",
    senderId: "ACC-9012",
    receiverId: "ACC-3456",
    amount: 25000,
    location: "Lagos, NG",
    deviceId: "DEV-C3D4",
    ipAddress: "10.0.0.55",
    timestamp: new Date("2024-01-15T11:45:00"),
    status: "fraud",
    riskScore: 92,
  },
  {
    id: "TXN-003",
    senderId: "ACC-7890",
    receiverId: "ACC-1234",
    amount: 3200,
    location: "London, UK",
    deviceId: "DEV-E5F6",
    ipAddress: "172.16.0.12",
    timestamp: new Date("2024-01-15T12:00:00"),
    status: "normal",
    riskScore: 22,
  },
  {
    id: "TXN-004",
    senderId: "ACC-3456",
    receiverId: "ACC-9012",
    amount: 8500,
    location: "Moscow, RU",
    deviceId: "DEV-C3D4",
    ipAddress: "10.0.0.55",
    timestamp: new Date("2024-01-15T13:15:00"),
    status: "fraud",
    riskScore: 88,
  },
  {
    id: "TXN-005",
    senderId: "ACC-5678",
    receiverId: "ACC-7890",
    amount: 450,
    location: "Tokyo, JP",
    deviceId: "DEV-G7H8",
    ipAddress: "192.168.2.100",
    timestamp: new Date("2024-01-15T14:30:00"),
    status: "normal",
    riskScore: 8,
  },
];

export const networkNodes = [
  { id: "ACC-1234", x: 20, y: 30, type: "account" as const, isFraud: false, label: "ACC-1234" },
  { id: "ACC-5678", x: 50, y: 20, type: "account" as const, isFraud: false, label: "ACC-5678" },
  { id: "ACC-9012", x: 80, y: 35, type: "account" as const, isFraud: true, label: "ACC-9012" },
  { id: "ACC-3456", x: 70, y: 60, type: "account" as const, isFraud: true, label: "ACC-3456" },
  { id: "ACC-7890", x: 30, y: 65, type: "account" as const, isFraud: false, label: "ACC-7890" },
  { id: "DEV-C3D4", x: 75, y: 45, type: "device" as const, isFraud: false, label: "DEV-C3D4" },
  { id: "IP-10.0.0.55", x: 85, y: 70, type: "ip" as const, isFraud: false, label: "10.0.0.55" },
];

export const networkEdges = [
  { from: "ACC-1234", to: "ACC-5678", type: "transaction" as const, isSuspicious: false },
  { from: "ACC-9012", to: "ACC-3456", type: "transaction" as const, isSuspicious: true },
  { from: "ACC-7890", to: "ACC-1234", type: "transaction" as const, isSuspicious: false },
  { from: "ACC-3456", to: "ACC-9012", type: "transaction" as const, isSuspicious: true },
  { from: "ACC-5678", to: "ACC-7890", type: "transaction" as const, isSuspicious: false },
  { from: "ACC-9012", to: "DEV-C3D4", type: "shared_device" as const, isSuspicious: true },
  { from: "ACC-3456", to: "DEV-C3D4", type: "shared_device" as const, isSuspicious: true },
  { from: "ACC-9012", to: "IP-10.0.0.55", type: "shared_ip" as const, isSuspicious: true },
  { from: "ACC-3456", to: "IP-10.0.0.55", type: "shared_ip" as const, isSuspicious: true },
];

export const riskFactors = [
  { factor: "Linked to known fraud accounts", severity: "high" as const, score: 35 },
  { factor: "Abnormal transaction amount", severity: "medium" as const, score: 20 },
  { factor: "Location mismatch detected", severity: "high" as const, score: 25 },
  { factor: "Device/IP reuse from flagged transactions", severity: "high" as const, score: 30 },
  { factor: "Multiple failed attempts", severity: "low" as const, score: 10 },
];

export const generateRandomTransaction = (isFraud: boolean): Transaction => {
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
