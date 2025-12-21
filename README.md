# Guardian AI Dashboard

## 🛡️ AI-Powered Fraud Detection & Risk Management System

A comprehensive, enterprise-grade fraud detection and risk management system built with modern web technologies. This dashboard provides real-time transaction monitoring, advanced network analysis, intelligent risk scoring, and automated decision-making capabilities to protect businesses from financial fraud.

---

## 📑 Table of Contents

- [Project Overview](#-project-overview)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Technology Stack](#-technology-stack)
- [Installation & Setup](#-installation--setup)
- [Project Structure](#-project-structure)
- [Detailed Feature Documentation](#-detailed-feature-documentation)
  - [Landing Page](#1-landing-page-indextsxsrcpagesindextsx)
  - [Transaction Simulator](#2-transaction-simulator-transactionsimulatortsx)
  - [Fraud Link Analysis](#3-fraud-link-analysis-fraudanalysistsx)
  - [Risk Scoring Engine](#4-risk-scoring-engine-riskscoringtsx)
  - [Scam / Phishing Link Detection](#5-scam--phishing-link-detection-scamlinkdetectiontsxsrcpagesscamlinkdetectiontsx)
  - [Decision Engine](#6-decision-engine-decisionenginetsxsrcpagesdecisionenginetsx)
- [Data Models](#-data-models)
- [UI Components](#-ui-components)
- [Mock Data & Testing](#-mock-data--testing)
- [Deployment](#-deployment)
- [Development Guidelines](#-development-guidelines)
- [Future Enhancements](#-future-enhancements)
- [License & Contributing](#-license--contributing)

---

## 🎯 Project Overview

**Guardian AI Dashboard** is a sophisticated web application designed to demonstrate advanced fraud detection capabilities using artificial intelligence and machine learning principles. The system provides a complete fraud prevention pipeline from transaction simulation to automated decision-making.

### Purpose

This application serves multiple purposes:
- **Demonstration Platform**: Showcase AI/ML fraud detection capabilities
- **Educational Tool**: Understand how fraud detection systems work
- **Prototype System**: Foundation for building production-ready fraud detection solutions
- **Hackathon/Competition Project**: Comprehensive solution for fintech/security competitions

### Target Audience

- Financial institutions and fintech companies
- E-commerce platforms handling online transactions
- Risk management teams and fraud analysts
- Developers and data scientists working on fraud detection
- Hackathon participants and evaluators

---

## 🚀 Key Features

### 1. **Transaction Simulator**
- Generate realistic transaction data with both normal and fraudulent patterns
- Create custom transactions with specific parameters (sender, receiver, amount, location, device, IP)
- Instant fraud detection with risk scoring
- Visual statistics dashboard showing fraud rates and average risk
- Real-time transaction table with status badges and risk indicators

### 2. **Fraud Link Analysis**
- Interactive network graph visualization powered by Force-Directed Graph algorithm
- Shows relationships between accounts, devices, and IP addresses
- Identifies fraud chains and shared resource patterns
- Color-coded nodes: green (safe), yellow (suspicious), red (fraud)
- Click nodes to view detailed account information and linked entities
- Fraud chain detection showing suspicious account clusters

### 3. **Scam / Phishing Link Detection**
- Analyze a URL using explainable heuristic signals (frontend-only)
- Risk score (0-100) and classification (safe / suspicious / scam)
- Factor list explaining why the score changed
- Clear action recommendation (Allow / Warn / Block)

### 4. **Risk Scoring Engine**
- Multi-factor risk assessment for transactions and accounts
- Real-time risk meter visualization (0-100 scale)
- Analyzes multiple risk factors:
  - Linked fraud accounts
  - Abnormal transaction amounts
  - Location mismatches
  - Device and IP reuse patterns
  - Behavioral anomalies
- Detailed breakdown of risk contributors
- Color-coded risk levels: Safe (green), Warning (yellow), High Risk (red)

### 5. **Decision Engine**
- Automated decision-making for both **transactions** and **links** with three actions:
  - **Allow**: Low-risk transactions (0-30% risk)
  - **Alert**: Medium-risk requiring review (31-70% risk)
  - **Block**: High-risk fraudulent transactions (71-100% risk)
- Transparent reasoning with detailed explanations
- Fraud/scam probability calculation (simulated)
- Actionable recommendations for each decision
- Risk score visualization with color-coded indicators

### 6. **Modern UI/UX**
- Glassmorphism design with animated backgrounds
- Responsive layout for desktop, tablet, and mobile
- Dark mode optimized color scheme
- Smooth animations and transitions
- Accessible components following WCAG guidelines
- Professional data visualizations and charts

---

## 🏗️ System Architecture

Guardian AI Dashboard is a **frontend-only prototype** that demonstrates two distinct use cases with the same conceptual flow:

**Input → Analysis → Risk Scoring → Decision → Explanation**

```
┌───────────┐   ┌───────────┐   ┌──────────────┐   ┌───────────┐   ┌──────────────┐
│   Input   │ → │  Analysis  │ → │ Risk Scoring │ → │ Decision  │ → │ Explanation  │
└───────────┘   └───────────┘   └──────────────┘   └───────────┘   └──────────────┘
```

### Use Case A: Fraudulent Payment Detection
- **Input**: Transaction parameters (sender, receiver, amount, location, device, IP)
- **Analysis**: Relationship/network signals (accounts/devices/IPs)
- **Risk Scoring**: 0–100 risk score (simulated)
- **Decision**: Allow / Alert / Block
- **Explanation**: Factor list and recommendation

### Use Case B: Scam / Phishing Link Detection
- **Input**: URL
- **Analysis**: Heuristic signals (e.g., missing https, lookalike patterns)
- **Risk Scoring**: 0–100 risk score (simulated)
- **Decision**: Allow / Warn / Block
- **Explanation**: Factor list and recommendation

### Stage 1: Input
- **Payments**: Create/generate transactions in the simulator
- **Links**: Paste a URL to analyze

### Stage 2: Analysis
- Extract relationship signals (payments) or URL signals (links)

### Stage 3: Risk Scoring
- Combine signals into a score (0–100) and a risk level (safe/warning/fraud or safe/suspicious/scam)

### Stage 4: Decision
- Apply thresholds to produce an action recommendation

### Stage 5: Explanation
- Present an explainable breakdown of contributing factors

---

## 🛠️ Technology Stack

### Frontend Framework
- **React 18.3**: Modern UI library with hooks and functional components
- **TypeScript**: Type-safe JavaScript for robust code
- **Vite 7.3**: Lightning-fast build tool and dev server

### UI & Styling
- **shadcn/ui**: High-quality, accessible component library
  - 40+ pre-built components (Button, Card, Table, Dialog, etc.)
  - Built on Radix UI primitives for accessibility
- **Tailwind CSS 3.4**: Utility-first CSS framework
- **Lucide React**: 1000+ beautiful SVG icons
- **CSS Animations**: Custom animations for enhanced UX

### State Management & Routing
- **React Hooks**: useState, useEffect for local state
- **React Router DOM 6.30**: Client-side routing with nested routes
- **React Query (TanStack)**: Server state management and caching

### Data Visualization
- **Custom NetworkGraph Component**: Force-directed graph for fraud network visualization
- **Custom RiskMeter Component**: Circular progress indicator for risk scores
- **Custom Force-Layout Logic**: Physics-based layout algorithms (no direct D3 dependency)

### Form Handling & Validation
- **React Hook Form**: Performant form management
- **Zod**: TypeScript-first schema validation

### Development Tools
- **ESLint**: Code linting and quality checks
- **TypeScript Compiler**: Type checking and IntelliSense
- **Vite Plugin**: Hot Module Replacement (HMR) for instant updates

---

## 📦 Installation & Setup

### Prerequisites

Ensure you have the following installed:
- **Node.js** (v18.0.0 or higher) - [Download](https://nodejs.org/)
- **npm** (v9.0.0 or higher) - Comes with Node.js
- **Git** (optional, for cloning) - [Download](https://git-scm.com/)

### Step 1: Clone the Repository

```bash
# Using Git
git clone <YOUR_GIT_URL>

# Navigate to project directory
cd guardian-ai-dashboard-main
```

Alternatively, download the ZIP file and extract it.

### Step 2: Install Dependencies

```bash
# Install all required packages
npm install

# This will install:
# - React, React DOM, React Router
# - TypeScript and type definitions
# - Vite and build tools
# - shadcn/ui components and Radix UI primitives
# - Tailwind CSS and PostCSS
# - Lucide React icons
# - React Hook Form, Zod, and other utilities
```

### Step 3: Start Development Server

```bash
# Start Vite dev server (usually on http://localhost:5173)
npm run dev
```

The application will automatically open in your default browser. If not, navigate to the URL shown in the terminal (usually `http://localhost:5173`).

### Step 4: Build for Production

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

The production build will be created in the `dist/` directory.

---

## 📂 Project Structure

```
guardian-ai-dashboard-main/
│
├── public/                          # Static assets
│   ├── favicon.svg                  # Shield icon favicon
│   └── robots.txt                   # SEO crawler instructions
│
├── src/                             # Source code
│   ├── components/                  # Reusable UI components
│   │   ├── ui/                      # shadcn/ui component library (40+ components)
│   │   │   ├── button.tsx           # Button component with variants
│   │   │   ├── card.tsx             # Card container component
│   │   │   ├── table.tsx            # Data table component
│   │   │   ├── badge.tsx            # Status badge component
│   │   │   ├── input.tsx            # Form input component
│   │   │   ├── dialog.tsx           # Modal dialog component
│   │   │   └── ... (30+ more)       # Other UI components
│   │   │
│   │   ├── FeatureCard.tsx          # Landing page feature card
│   │   ├── Navbar.tsx               # Navigation bar component
│   │   ├── NavLink.tsx              # Navigation link with active state
│   │   ├── NetworkGraph.tsx         # Force-directed graph visualization
│   │   ├── RiskMeter.tsx            # Circular risk score indicator
│   │   └── StatsCard.tsx            # Statistics display card
│   │
│   ├── pages/                       # Main application pages/routes
│   │   ├── Index.tsx                # Landing/home page
│   │   ├── TransactionSimulator.tsx # Transaction generation & testing
│   │   ├── FraudAnalysis.tsx        # Network graph & link analysis
│   │   ├── RiskScoring.tsx          # Risk assessment page
│   │   ├── DecisionEngine.tsx       # Automated decision-making
│   │   └── NotFound.tsx             # 404 error page
│   │
│   ├── data/                        # Data models and mock data
│   │   └── mockData.ts              # Sample transactions, network data, risk factors
│   │
│   ├── lib/                         # Utility functions
│   │   └── utils.ts                 # Helper functions (cn, classNames merger)
│   │
│   ├── hooks/                       # Custom React hooks
│   │   ├── use-toast.ts             # Toast notification hook
│   │   └── use-mobile.tsx           # Mobile device detection hook
│   │
│   ├── App.tsx                      # Root application component with routing
│   ├── main.tsx                     # Application entry point
│   ├── App.css                      # Global application styles
│   ├── index.css                    # Tailwind CSS imports & global styles
│   └── vite-env.d.ts                # Vite environment type definitions
│
├── index.html                       # HTML entry point
├── package.json                     # Project dependencies and scripts
├── tsconfig.json                    # TypeScript configuration
├── tsconfig.app.json                # App-specific TypeScript config
├── tsconfig.node.json               # Node-specific TypeScript config
├── vite.config.ts                   # Vite build configuration
├── tailwind.config.ts               # Tailwind CSS configuration
├── postcss.config.js                # PostCSS configuration
├── eslint.config.js                 # ESLint linting rules
├── components.json                  # shadcn/ui components configuration
└── README.md                        # This file
```

---

## 📖 Detailed Feature Documentation

### 1. Landing Page ([Index.tsx](src/pages/Index.tsx))

**Purpose**: Introduce the system and provide navigation to all features.

**Key Sections**:

#### Hero Section
- **Animated Background**: Data grid pattern with glowing orbs
- **Headline**: "AI-Powered Fraud Detection & Risk Management"
- **Description**: Explains the system's capabilities
- **CTA Buttons**: "Simulate Transactions" and "View Risk Analysis"
- **Statistics Cards**: Display key metrics
  - 99.7% Detection Accuracy
  - <50ms Response Time
  - 24/7 Real-time Monitoring
  - $2.1B+ Fraud Prevented

#### Features Section
Includes a **Use Case Selection** block that highlights the two demo tracks:
1. **Fraudulent Payment Detection** → route: `/simulator`
2. **Scam / Phishing Link Detection** → route: `/link-analysis`

The page also contains feature cards and CTA buttons for deeper modules like network analysis, risk scoring, and decision output.

#### Visual Design
- **Glassmorphism Effect**: Translucent cards with backdrop blur
- **Gradient Text**: Eye-catching gradient on key phrases
- **Fade-in Animations**: Staggered animations for smooth page load
- **Responsive Grid**: Adapts to screen size (mobile, tablet, desktop)

**Code Highlights**:
```tsx
// Example: Hero section with animated elements
<section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
  <div className="absolute inset-0 data-grid" /> {/* Animated grid background */}
  <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-primary/20 blur-[128px] animate-pulse-subtle" />
  {/* Hero content */}
</section>
```

---

### 2. Transaction Simulator ([TransactionSimulator.tsx](src/pages/TransactionSimulator.tsx))

**Purpose**: Generate and test transaction data with fraud detection capabilities.

**Route**: `/simulator`

**Prototype Labels**:
- "Frontend-only Prototype"
- "Simulated AI Logic"

**Features**:

#### Quick Generation Buttons
- **"Generate Normal Transaction"**: Creates low-risk transaction
  - Amount: $100-$5,000
  - Common locations: New York, London, Tokyo
  - Risk score: 5-30
- **"Generate Fraud Transaction"**: Creates high-risk transaction
  - Amount: $10,000-$50,000
  - Suspicious locations: Unknown, Lagos, Moscow
  - Risk score: 70-95

#### Custom Transaction Form
Manual input fields:
- **Sender ID**: Account initiating the transaction (e.g., ACC-1234)
- **Receiver ID**: Account receiving funds (e.g., ACC-5678)
- **Amount**: Transaction value in dollars
- **Location**: Geographic location (optional)
- **Device ID**: Device identifier (optional, auto-generated if empty)
- **IP Address**: Network IP (optional, auto-generated if empty)

#### Fraud Detection Logic
```typescript
// Simplified fraud detection algorithm
const detectFraud = (transaction: Transaction): boolean => {
  // High amount threshold
  if (transaction.amount > 10000) return true;
  
  // Suspicious locations
  if (transaction.location.includes('Unknown')) return true;
  
  // More complex patterns can be added:
  // - Velocity (multiple transactions in short time)
  // - Geo-impossibility (locations too far apart)
  // - Device/IP reuse across accounts
  
  return false;
};
```

#### Transaction Table
Displays all transactions with:
- **ID**: Unique transaction identifier
- **Sender → Receiver**: Account flow visualization
- **Amount**: Dollar value with formatting
- **Location**: Geographic origin
- **Device/IP**: Technical identifiers with icons
- **Risk Score**: Color-coded progress bar
- **Status Badge**: Normal (green) or Fraud (red)
- **Timestamp**: Transaction date/time

#### Statistics Cards
Real-time metrics:
- **Normal Transactions**: Count of safe transactions
- **Fraud Detected**: Count of fraudulent transactions
- **Average Risk**: Mean risk score across all transactions

**Code Highlights**:
```typescript
// Risk calculation based on multiple factors
const calculateRiskScore = (transaction: Transaction): number => {
  let risk = 0;
  
  // Amount factor (0-40 points)
  if (transaction.amount > 50000) risk += 40;
  else if (transaction.amount > 10000) risk += 25;
  else if (transaction.amount > 5000) risk += 10;
  
  // Location factor (0-30 points)
  const suspiciousLocations = ['Unknown', 'Lagos', 'Moscow', 'Pyongyang'];
  if (suspiciousLocations.some(loc => transaction.location.includes(loc))) {
    risk += 30;
  }
  
  // Device/IP reuse factor (0-30 points)
  // Check if device/IP appears in multiple fraud transactions
  
  return Math.min(risk, 100); // Cap at 100
};
```

---

### 3. Fraud Link Analysis ([FraudAnalysis.tsx](src/pages/FraudAnalysis.tsx))

**Purpose**: Visualize account networks and detect suspicious connection patterns.

**Route**: `/analysis`

**Features**:

#### Relationship Input (Prototype)
- Add relationships via a form or bulk JSON
- Each relationship generates a **Link Risk Score (0–100)** and an overall risk level (safe / warning / fraud)
- A "Suspicious Links" panel lists contributing factors and why the score changed

#### Network Graph Visualization
- **Force-Directed Layout**: Physics-based node positioning
- **Node Types**:
  - **Accounts** (circles): Individual user accounts
  - **Devices** (squares): Shared devices
  - **IP Addresses** (triangles): Shared network locations
- **Color Coding**:
  - Green: Safe/Normal
  - Yellow: Suspicious/Warning
  - Red: Confirmed Fraud
- **Interactive**: Click nodes to view details

#### Graph Algorithm
```typescript
// Simplified force-directed graph physics
const updateNodePositions = () => {
  nodes.forEach(node => {
    // Repulsion force (nodes push apart)
    nodes.forEach(other => {
      if (node !== other) {
        const dx = node.x - other.x;
        const dy = node.y - other.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const force = (1 / distance) * repulsionStrength;
        node.vx += (dx / distance) * force;
        node.vy += (dy / distance) * force;
      }
    });
    
    // Attraction force (connected nodes pull together)
    edges.forEach(edge => {
      if (edge.from === node.id || edge.to === node.id) {
        const other = edge.from === node.id ? edge.to : edge.from;
        const dx = other.x - node.x;
        const dy = other.y - node.y;
        const force = attractionStrength;
        node.vx += dx * force;
        node.vy += dy * force;
      }
    });
    
    // Update position
    node.x += node.vx;
    node.y += node.vy;
    
    // Damping
    node.vx *= 0.9;
    node.vy *= 0.9;
  });
};
```

#### Inspection Panel
Selecting a node shows what it represents (account/device/ip) and highlights the relevant risky connections.

---

### 4. Risk Scoring Engine ([RiskScoring.tsx](src/pages/RiskScoring.tsx))

**Purpose**: Comprehensive risk assessment for transactions and accounts.

**Route**: `/risk`

**Prototype Labels**:
- "Frontend-only Prototype"
- "Simulated AI Logic"

> Note: This page simulates an evaluation step; it does not call a backend.

**Features**:

#### Search Interface
- **Input**: Transaction ID or Account ID
- **Search Button**: Triggers risk evaluation
- **Loading State**: Shows analysis in progress

#### Risk Meter Visualization
- **Circular Progress**: 0-100 risk score display
- **Color-Coded**:
  - 0-30: Green (Safe)
  - 31-70: Yellow (Warning)
  - 71-100: Red (High Risk)
- **Animated**: Smooth progress animation

#### Multi-Factor Risk Analysis
Evaluates multiple risk factors:

1. **Linked Fraud Accounts** (0-25 points)
   - Checks if account has connections to known fraud accounts
   - Each linked fraud account adds 8-10 points

2. **Abnormal Amount** (0-25 points)
   - Compares transaction amount to account history
   - Flags transactions >3x average as abnormal

3. **Location Mismatch** (0-20 points)
   - Compares current location to account origin
   - Flags impossible travel (geo-impossibility)

4. **Device Reuse** (0-15 points)
   - Checks if device ID appears across multiple accounts
   - Higher score for devices used in fraud

5. **IP Reuse** (0-15 points)
   - Checks if IP address appears across multiple accounts
   - Higher score for IPs associated with fraud

**Risk Calculation Example**:
```typescript
const evaluateRisk = (id: string): number => {
  let totalRisk = 0;
  
  // Factor 1: Linked fraud accounts (0-25)
  const linkedFraudCount = getLinkedFraudAccounts(id);
  totalRisk += Math.min(linkedFraudCount * 8, 25);
  
  // Factor 2: Abnormal amount (0-25)
  const avgAmount = getAverageTransactionAmount(id);
  const currentAmount = getCurrentTransaction(id).amount;
  if (currentAmount > avgAmount * 3) {
    totalRisk += 25;
  } else if (currentAmount > avgAmount * 2) {
    totalRisk += 15;
  }
  
  // Factor 3: Location mismatch (0-20)
  const locationDistance = calculateLocationDistance(id);
  if (locationDistance > 5000) totalRisk += 20; // km
  else if (locationDistance > 1000) totalRisk += 10;
  
  // Factor 4: Device reuse (0-15)
  const deviceReuseCount = getDeviceReuseCount(id);
  totalRisk += Math.min(deviceReuseCount * 5, 15);
  
  // Factor 5: IP reuse (0-15)
  const ipReuseCount = getIPReuseCount(id);
  totalRisk += Math.min(ipReuseCount * 5, 15);
  
  return Math.min(totalRisk, 100);
};
```

#### Detailed Risk Breakdown
Shows specific risk contributors:
- ✅ **No Risk**: Green checkmark
- ⚠️ **Moderate Risk**: Yellow warning icon
- ❌ **High Risk**: Red X icon

**Example Output**:
```
Risk Score: 78/100 (High Risk)

Risk Factors:
✅ Normal transaction amount ($1,250)
❌ 3 linked fraud accounts detected
⚠️ Location mismatch: 2,400 km from origin
❌ Device ID reused across 4 accounts
⚠️ IP address flagged in 2 fraud cases

Recommendation: Block transaction and initiate investigation
```

---

### 5. Scam / Phishing Link Detection ([ScamLinkDetection.tsx](src/pages/ScamLinkDetection.tsx))

**Purpose**: Analyze a URL for scam/phishing indicators and produce an explainable risk score.

**Route**: `/link-analysis`

**What it demonstrates**:
- URL input → heuristic analysis → 0–100 risk score → allow/warn/block recommendation
- A factor list that explains why a link looks suspicious (simulated logic)

---

### 6. Decision Engine ([DecisionEngine.tsx](src/pages/DecisionEngine.tsx))

**Purpose**: Automated decision-making with transparent reasoning for **transactions** and **links**.

**Route**: `/decision`

**Modes**:
- Transaction decision (fraud probability)
- Link decision (scam probability)

**Features**:

#### Decision Actions
Three possible outcomes based on risk score:

**1. ALLOW (Risk: 0-30%)**
- **Action**: Process transaction normally
- **Reasoning**:
  - No linked fraud accounts detected
  - Transaction amount within normal range
  - Location consistent with account history
  - Device and IP address are trusted
- **Recommendation**: "This transaction shows no indicators of fraud and can be processed normally."

**2. ALERT (Risk: 31-70%)**
- **Action**: Flag for manual review
- **Reasoning**:
  - Slightly elevated transaction amount
  - Minor location deviation detected
  - Account flagged for review recently
  - Recommend secondary verification
- **Recommendation**: "This transaction has moderate risk indicators. Consider implementing step-up authentication or manual review."

**3. BLOCK (Risk: 71-100%)**
- **Action**: Reject transaction immediately
- **Reasoning**:
  - Multiple linked fraud accounts detected
  - Transaction amount significantly above normal
  - Location mismatch with account origin
  - Device/IP associated with previous fraud
  - High velocity of transactions detected
- **Recommendation**: "This transaction has high fraud probability. Immediate blocking recommended with investigation initiated."

#### Decision Logic
```typescript
const makeDecision = (riskScore: number): Decision => {
  if (riskScore <= 30) {
    return {
      action: 'allow',
      confidence: 95,
      reasoning: [
        'All verification checks passed',
        'No fraud indicators detected',
        'Normal transaction pattern'
      ]
    };
  } else if (riskScore <= 70) {
    return {
      action: 'alert',
      confidence: 75,
      reasoning: [
        'Moderate risk factors present',
        'Manual review recommended',
        'Consider step-up authentication'
      ]
    };
  } else {
    return {
      action: 'block',
      confidence: 98,
      reasoning: [
        'High fraud probability',
        'Multiple risk factors detected',
        'Immediate action required'
      ]
    };
  }
};
```

#### Visual Decision Display
- **Large Action Badge**: Allow (green), Alert (yellow), Block (red)
- **Fraud Probability**: Percentage likelihood of fraud
- **Risk Score Meter**: Visual representation with color coding
- **Detailed Reasoning**: Bulleted list of decision factors
- **Recommendation Card**: Actionable next steps

---

## 📊 Data Models

### Transaction Interface
```typescript
interface Transaction {
  id: string;              // Unique identifier (e.g., "TXN-001")
  senderId: string;        // Sending account ID (e.g., "ACC-1234")
  receiverId: string;      // Receiving account ID (e.g., "ACC-5678")
  amount: number;          // Transaction amount in dollars
  location: string;        // Geographic location (e.g., "New York, US")
  deviceId: string;        // Device identifier (e.g., "DEV-A1B2")
  ipAddress: string;       // IP address (e.g., "192.168.1.1")
  timestamp: Date;         // Transaction date/time
  status: "normal" | "fraud";  // Classification result
  riskScore: number;       // Risk score (0-100)
}
```

### Network Node Interface
```typescript
interface NetworkNode {
  id: string;              // Node identifier
  x: number;               // X coordinate (percentage)
  y: number;               // Y coordinate (percentage)
  type: "account" | "device" | "ip";  // Node type
  isFraud: boolean;        // Fraud status
  label: string;           // Display label
  riskLevel?: "safe" | "warning" | "fraud";  // Optional risk level for coloring
}
```

### Network Edge Interface
```typescript
interface NetworkEdge {
  from: string;            // Source node ID
  to: string;              // Target node ID
  type: "transaction" | "shared_device" | "shared_ip";  // Connection type
  isSuspicious: boolean;   // Risk indicator
  riskLevel?: "safe" | "warning" | "fraud";  // Optional risk level for coloring
}
```

### Risk Factor Interface
```typescript
interface RiskFactor {
  name: string;            // Factor name
  weight: number;          // Importance weight (0-1)
  description: string;     // Explanation
}
```

---

## 🎨 UI Components

### Core Components

**Button** ([button.tsx](src/components/ui/button.tsx))
- Variants: default, destructive, outline, secondary, ghost, link, hero, heroOutline
- Sizes: sm, md, lg, xl, icon
- Features: Loading state, disabled state, icon support

**Card** ([card.tsx](src/components/ui/card.tsx))
- Sections: CardHeader, CardTitle, CardDescription, CardContent, CardFooter
- Glassmorphism styling with backdrop blur
- Responsive padding and spacing

**Table** ([table.tsx](src/components/ui/table.tsx))
- Components: Table, TableHeader, TableBody, TableRow, TableCell, TableHead
- Features: Striped rows, hover effects, responsive overflow
- Sortable columns (customizable)

**Badge** ([badge.tsx](src/components/ui/badge.tsx))
- Variants: default, secondary, destructive, outline, success, warning
- Use cases: Status indicators, tags, labels

**Input** ([input.tsx](src/components/ui/input.tsx))
- Types: text, number, email, password, etc.
- Features: Validation states, error messages, icons
- Fully accessible with ARIA labels

### Custom Components

**NetworkGraph** ([NetworkGraph.tsx](src/components/NetworkGraph.tsx))
- Force-directed graph visualization
- Interactive node selection
- Dynamic edge rendering
- Zoom and pan capabilities
- Color-coded risk levels

**RiskMeter** ([RiskMeter.tsx](src/components/RiskMeter.tsx))
- Circular progress indicator
- Animated score updates
- Color transitions based on risk level
- Percentage display in center

**FeatureCard** ([FeatureCard.tsx](src/components/FeatureCard.tsx))
- Icon, title, description layout
- Hover effects with scale animation
- Glassmorphism styling
- Link integration for navigation

**StatsCard** ([StatsCard.tsx](src/components/StatsCard.tsx))
- Large value display
- Descriptive label
- Icon support
- Trend indicators (optional)

---

## 🧪 Mock Data & Testing

### Mock Transactions ([mockData.ts](src/data/mockData.ts))

The system includes 5 pre-defined transactions:
- **TXN-001**: Normal ($1,500) - Risk: 15
- **TXN-002**: Fraud ($25,000) - Risk: 92
- **TXN-003**: Normal ($3,200) - Risk: 22
- **TXN-004**: Fraud ($8,500) - Risk: 88
- **TXN-005**: Normal ($450) - Risk: 8

### Network Data

**Nodes**: 10 accounts, 3 devices, 2 IP addresses
**Edges**: 15 connections (transactions, shared devices, shared IPs)

**Fraud Patterns**:
- ACC-9012 and ACC-3456 both use DEV-C3D4
- Both accounts connected to IP 10.0.0.55
- Multiple high-value transactions between them

### Random Generation

```typescript
export const generateRandomTransaction = (isFraud: boolean): Transaction => {
  const id = `TXN-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  const amount = isFraud 
    ? Math.floor(Math.random() * 40000 + 10000)  // $10k-$50k
    : Math.floor(Math.random() * 4900 + 100);     // $100-$5k
  
  const locations = isFraud
    ? ['Unknown', 'Lagos, NG', 'Moscow, RU', 'Pyongyang, KP']
    : ['New York, US', 'London, UK', 'Tokyo, JP', 'Paris, FR'];
  
  const location = locations[Math.floor(Math.random() * locations.length)];
  const riskScore = isFraud ? 70 + Math.floor(Math.random() * 25) : Math.floor(Math.random() * 30);
  
  return {
    id,
    senderId: `ACC-${Math.floor(Math.random() * 9000 + 1000)}`,
    receiverId: `ACC-${Math.floor(Math.random() * 9000 + 1000)}`,
    amount,
    location,
    deviceId: `DEV-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
    ipAddress: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    timestamp: new Date(),
    status: isFraud ? 'fraud' : 'normal',
    riskScore
  };
};
```

---

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Deploy on Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel auto-detects Vite configuration
   - Click "Deploy"

3. **Configuration** (if needed):
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

### Netlify

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Deploy**:
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop the `dist` folder
   - Or connect to GitHub for continuous deployment

3. **Configuration** (netlify.toml):
   ```toml
   [build]
     command = "npm run build"
     publish = "dist"

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

### GitHub Pages

1. **Install gh-pages**:
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Update package.json**:
   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     },
     "homepage": "https://<username>.github.io/<repo-name>"
   }
   ```

3. **Deploy**:
   ```bash
   npm run deploy
   ```

### Docker

```dockerfile
# Dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Build and run:
```bash
docker build -t guardian-ai-dashboard .
docker run -p 8080:80 guardian-ai-dashboard
```

---

## 💻 Development Guidelines

### Code Style

- **TypeScript**: Use strict type checking
- **Components**: Functional components with TypeScript interfaces
- **Naming**: PascalCase for components, camelCase for functions/variables
- **File Organization**: One component per file
- **Comments**: JSDoc for functions, inline for complex logic

### State Management

- **Local State**: Use `useState` for component-specific data
- **Shared State**: Pass props or use context for shared data
- **Server State**: Use React Query for API calls (when integrated)

### Performance

- **Code Splitting**: Use React.lazy() for route-based splitting
- **Memoization**: Use React.memo() for expensive components
- **Debouncing**: Debounce search inputs and expensive operations
- **Virtual Scrolling**: For large lists (consider react-window)

### Accessibility

- **ARIA Labels**: Add aria-label to interactive elements
- **Keyboard Navigation**: Ensure all features work with keyboard
- **Focus Management**: Maintain logical focus order
- **Color Contrast**: Follow WCAG AA standards (4.5:1 ratio)

### Testing (Future)

```typescript
// Example test with Jest and React Testing Library
import { render, screen, fireEvent } from '@testing-library/react';
import { TransactionSimulator } from './TransactionSimulator';

test('generates normal transaction', () => {
  render(<TransactionSimulator />);
  const button = screen.getByText('Generate Normal Transaction');
  fireEvent.click(button);
  
  const normalBadges = screen.getAllByText('Normal');
  expect(normalBadges.length).toBeGreaterThan(0);
});
```

---

## 🔮 Future Enhancements

### Backend Integration
- [ ] Connect to real fraud detection API
- [ ] Implement user authentication and authorization
- [ ] Store transactions in database (PostgreSQL/MongoDB)
- [ ] Real-time WebSocket updates for fraud alerts

### Advanced ML Features
- [ ] Actual machine learning models (TensorFlow.js, ONNX)
- [ ] Anomaly detection using autoencoders
- [ ] Behavioral biometrics (typing patterns, mouse movements)
- [ ] Time-series analysis for transaction velocity

### Enhanced Analytics
- [ ] Historical fraud trend charts (Chart.js, Recharts)
- [ ] Detailed dashboards with multiple visualizations
- [ ] Export reports as PDF/Excel
- [ ] Customizable alerts and notifications

### Additional Features
- [ ] Multi-language support (i18n)
- [ ] Dark/light theme toggle
- [ ] Mobile app version (React Native)
- [ ] Admin panel for system configuration
- [ ] Bulk transaction import (CSV, JSON)
- [ ] API documentation (Swagger/OpenAPI)

### Performance Optimizations
- [ ] Implement React Query for caching
- [ ] Add service workers for offline support
- [ ] Optimize bundle size with tree shaking
- [ ] Implement lazy loading for routes and components

---

## 📄 License & Contributing

### License
This project is available for educational and demonstration purposes. Check with your organization for commercial use.

### Contributing

Contributions are welcome! To contribute:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/YourFeature`
3. **Make your changes** and commit: `git commit -m "Add YourFeature"`
4. **Push to the branch**: `git push origin feature/YourFeature`
5. **Open a Pull Request** with a clear description

### Code of Conduct
- Be respectful and inclusive
- Follow the existing code style
- Write clear commit messages
- Test your changes before submitting

---

## 📞 Support & Contact

For questions, issues, or feature requests:
- **GitHub Issues**: [Create an issue](https://github.com/yourusername/guardian-ai-dashboard/issues)
- **Email**: your.email@example.com
- **Documentation**: This README and inline code comments

---

## 🙏 Acknowledgments

- **shadcn/ui**: Beautiful component library
- **Radix UI**: Accessible component primitives
- **Lucide**: Comprehensive icon set
- **Tailwind CSS**: Utility-first CSS framework
- **React Team**: Amazing frontend library
- **Vite Team**: Lightning-fast build tool

---

**Built with ❤️ for TechFiesta Hackathon**

Last Updated: December 2024
