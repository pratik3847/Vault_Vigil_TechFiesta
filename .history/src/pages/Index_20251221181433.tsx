import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FeatureCard } from "@/components/FeatureCard";
import { Navbar } from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Activity,
  Network,
  Gauge,
  Scale,
  Shield,
  Zap,
  Lock,
  BarChart3,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    title: "Transaction Simulator",
    description:
      "Generate and test both normal and fraudulent transaction patterns with realistic data scenarios.",
    icon: Activity,
  },
  {
    title: "Fraud Link Analysis",
    description:
      "Visualize complex networks of connected accounts, shared devices, and suspicious transaction chains.",
    icon: Network,
  },
  {
    title: "Risk Scoring Engine",
    description:
      "Real-time risk assessment with multi-factor analysis including behavioral patterns and anomaly detection.",
    icon: Gauge,
  },
  {
    title: "Decision Engine",
    description:
      "Automated decision-making with transparent reasoning, supporting Allow, Alert, or Block actions.",
    icon: Scale,
  },
];

const stats = [
  { value: "99.7%", label: "Detection Accuracy" },
  { value: "<50ms", label: "Response Time" },
  { value: "24/7", label: "Real-time Monitoring" },
  { value: "$2.1B+", label: "Fraud Prevented" },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Animated background */}
        <div className="absolute inset-0 data-grid" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
        
        {/* Glowing orbs */}
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-primary/20 blur-[128px] animate-pulse-subtle" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-fraud/10 blur-[128px] animate-pulse-subtle animation-delay-200" />

        <div className="container relative z-10 px-4 py-20">
          <div className="mx-auto max-w-4xl text-center">
            {/* Badge */}
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm text-primary opacity-0 animate-fade-in">
              <Shield className="h-4 w-4" />
              <span>Enterprise-Grade Fraud Protection</span>
            </div>

            {/* Headline */}
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl opacity-0 animate-fade-in animation-delay-100">
              <span className="text-foreground">AI-Powered </span>
              <span className="text-gradient">Fraud Detection</span>
              <br />
              <span className="text-foreground">& Risk Management</span>
            </h1>

            {/* Subtitle */}
            <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl opacity-0 animate-fade-in animation-delay-200">
              Protect your business with intelligent transaction monitoring, 
              real-time link analysis, and automated risk scoring powered by 
              advanced machine learning algorithms.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-fade-in animation-delay-300">
              <Link to="/simulator">
                <Button variant="hero" size="xl" className="group">
                  <Activity className="h-5 w-5" />
                  Simulate Transactions
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/risk">
                <Button variant="heroOutline" size="xl" className="group">
                  <Gauge className="h-5 w-5" />
                  Analyze Risk
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 gap-4 sm:grid-cols-4 md:gap-8 opacity-0 animate-fade-in animation-delay-400">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-border/50 bg-card/50 p-6 text-center backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:bg-card"
              >
                <p className="text-2xl font-bold text-gradient md:text-3xl font-mono">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Use Case Selection */}
          <div className="mt-10 opacity-0 animate-fade-in animation-delay-500">
            <div className="mx-auto max-w-5xl">
              <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-left">
                  <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                    Use Case <span className="text-gradient">Selection</span>
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Follow the flow: Input → Analysis → Risk Scoring → Decision → Explanation.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">Frontend-only Prototype</Badge>
                  <Badge variant="outline">Simulated AI Logic</Badge>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-primary" />
                      Fraud Payment Detection
                    </CardTitle>
                    <CardDescription>
                      Simulate transactions, detect suspicious patterns, score risk, and review the final decision.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex items-center justify-between gap-3">
                    <div className="text-sm text-muted-foreground">
                      Starts at: <span className="font-medium text-foreground">Transaction Simulator</span>
                    </div>
                    <Link to="/simulator">
                      <Button className="group">
                        Open
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5 text-primary" />
                      Scam / Phishing Link Detection
                    </CardTitle>
                    <CardDescription>
                      Start with link-focused analysis. (A dedicated URL analyzer will be added on the next step.)
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex items-center justify-between gap-3">
                    <div className="text-sm text-muted-foreground">
                      Starts at: <span className="font-medium text-foreground">Link Analysis</span>
                    </div>
                    <Link to="/analysis">
                      <Button className="group">
                        Open
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-0 animate-fade-in animation-delay-400">
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <span className="text-xs">Scroll to explore</span>
            <div className="h-8 w-5 rounded-full border border-muted-foreground/50 p-1">
              <div className="h-2 w-1.5 rounded-full bg-primary animate-bounce" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 md:py-32">
        <div className="container px-4">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Complete <span className="text-gradient">Fraud Prevention</span> Suite
            </h2>
            <p className="text-muted-foreground">
              Everything you need to detect, analyze, and prevent fraudulent activities
              in real-time across your entire transaction ecosystem.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
                delay={(index + 1) * 100}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section className="relative py-20 border-t border-border/50">
        <div className="container px-4">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
                Built for <span className="text-gradient">Enterprise Scale</span>
              </h2>
              <div className="space-y-4">
                {[
                  { icon: Zap, text: "Process millions of transactions per second" },
                  { icon: Lock, text: "Bank-grade security and compliance" },
                  { icon: BarChart3, text: "Real-time analytics and reporting" },
                  { icon: Network, text: "Graph-based relationship analysis" },
                ].map((item) => (
                  <div
                    key={item.text}
                    className="flex items-center gap-4 rounded-lg border border-border/50 bg-card/50 p-4 transition-all duration-300 hover:border-primary/50"
                  >
                    <div className="rounded-lg bg-primary/10 p-2">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <p className="text-foreground">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-2xl border border-border/50 bg-card/30 p-8 scan-line">
                <div className="h-full w-full rounded-xl bg-gradient-to-br from-primary/10 to-fraud/10 flex items-center justify-center">
                  <div className="text-center">
                    <Shield className="h-24 w-24 text-primary mx-auto mb-4 animate-float" />
                    <p className="text-2xl font-bold text-gradient">FraudGuard AI</p>
                    <p className="text-muted-foreground mt-2">Protecting your assets</p>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 h-32 w-32 rounded-full bg-primary/20 blur-3xl" />
              <div className="absolute -top-4 -left-4 h-24 w-24 rounded-full bg-fraud/20 blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="container px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <span className="font-semibold">FraudGuard</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 FraudGuard. AI-Powered Fraud Detection.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
