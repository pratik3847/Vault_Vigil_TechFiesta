import { Navbar } from "@/components/Navbar";
import { StatsCard } from "@/components/StatsCard";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";
import { weeklyFraudData, locationFraudData, riskDistributionData } from "@/data/mockData";
import { ShieldAlert, TrendingDown, Target, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6'];

const AnalyticsDashboard = () => {
  return (
    <div className="min-h-screen bg-background pb-12">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24">
        {/* Header Section */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            <span className="text-gradient">Analytics Dashboard</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Real-time insights and historical trends of fraud detection across the platform.
          </p>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-fade-in" style={{ animationDelay: "100ms" }}>
          <StatsCard
            title="Total Fraud Prevented"
            value="$2.4M"
            icon={ShieldAlert}
            trend={{ value: 14, isPositive: true }}
            variant="fraud"
          />
          <StatsCard
            title="Detection Accuracy"
            value="99.8%"
            icon={Target}
            trend={{ value: 0.2, isPositive: true }}
            variant="default"
          />
          <StatsCard
            title="Transactions Allowed"
            value="84,592"
            icon={ShieldCheck}
            trend={{ value: 5, isPositive: true }}
            variant="safe"
          />
          <StatsCard
            title="False Positives"
            value="0.12%"
            icon={TrendingDown}
            trend={{ value: -0.05, isPositive: true }}
            variant="warning"
          />
        </div>
        
        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in" style={{ animationDelay: "200ms" }}>
          
          {/* Bar Chart - Weekly Volume */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Weekly Transaction Volume</CardTitle>
              <CardDescription>Comparison of Normal vs Fraudulent transaction amounts.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={weeklyFraudData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                    <XAxis dataKey="day" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Legend />
                    <Bar dataKey="normalAmount" name="Normal ($)" fill="#22c55e" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="fraudAmount" name="Fraud ($)" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Pie Chart - Fraud Origins */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Fraud Origins by Location</CardTitle>
              <CardDescription>Geographic distribution of blocked transactions.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full flex items-center justify-center mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={locationFraudData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {locationFraudData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

        </div>
      </main>
    </div>
  );
};

export default AnalyticsDashboard;
