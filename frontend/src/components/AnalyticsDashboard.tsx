'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Shield, AlertTriangle } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';

const COLORS = ['#8b5cf6', '#06b6d4', '#f59e0b', '#ef4444', '#10b981'];

export default function AnalyticsDashboard() {
  const { assets, trackingResults } = useSelector((state: RootState) => state.assets);

  const analytics = useMemo(() => {
    const totalAssets = assets.length;
    const totalDetections = Object.values(trackingResults).reduce(
      (sum, result) => sum + result.totalDetections, 0
    );
    const totalUnauthorized = Object.values(trackingResults).reduce(
      (sum, result) => sum + result.unauthorizedCount, 0
    );

    // Platform distribution
    const platformData: { [key: string]: number } = {};
    Object.values(trackingResults).forEach(result => {
      result.detections.forEach(detection => {
        platformData[detection.platform] = (platformData[detection.platform] || 0) + 1;
      });
    });

    const platformChartData = Object.entries(platformData).map(([name, value]) => ({
      name,
      value,
      percentage: ((value / totalDetections) * 100).toFixed(1)
    }));

    // Monthly upload trend (mock data)
    const monthlyData = [
      { month: 'Jan', uploads: 12, detections: 45 },
      { month: 'Feb', uploads: 19, detections: 52 },
      { month: 'Mar', uploads: 15, detections: 38 },
      { month: 'Apr', uploads: 25, detections: 67 },
      { month: 'May', uploads: 22, detections: 58 },
      { month: 'Jun', uploads: totalAssets, detections: totalDetections },
    ];

    // Asset type distribution
    const typeData: { [key: string]: number } = {};
    assets.forEach(asset => {
      const type = asset.type.split('/')[0]; // image or video
      typeData[type] = (typeData[type] || 0) + 1;
    });

    const typeChartData = Object.entries(typeData).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value
    }));

    return {
      totalAssets,
      totalDetections,
      totalUnauthorized,
      authorizedDetections: totalDetections - totalUnauthorized,
      platformChartData,
      monthlyData,
      typeChartData
    };
  }, [assets, trackingResults]);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-6 rounded-2xl text-center"
        >
          <Shield className="text-purple-400 mx-auto mb-2" size={32} />
          <div className="text-3xl font-bold text-white mb-1">{analytics.totalAssets}</div>
          <div className="text-gray-400 text-sm">Total Assets</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass p-6 rounded-2xl text-center"
        >
          <BarChart3 className="text-cyan-400 mx-auto mb-2" size={32} />
          <div className="text-3xl font-bold text-white mb-1">{analytics.totalDetections}</div>
          <div className="text-gray-400 text-sm">Total Detections</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass p-6 rounded-2xl text-center"
        >
          <AlertTriangle className="text-red-400 mx-auto mb-2" size={32} />
          <div className="text-3xl font-bold text-white mb-1">{analytics.totalUnauthorized}</div>
          <div className="text-gray-400 text-sm">Unauthorized Uses</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass p-6 rounded-2xl text-center"
        >
          <TrendingUp className="text-green-400 mx-auto mb-2" size={32} />
          <div className="text-3xl font-bold text-white mb-1">
            {analytics.totalDetections > 0 ? ((analytics.authorizedDetections / analytics.totalDetections) * 100).toFixed(1) : 0}%
          </div>
          <div className="text-gray-400 text-sm">Authorized Rate</div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Monthly Trend */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="glass p-6 rounded-2xl"
        >
          <h3 className="text-xl font-semibold mb-6 text-white">Monthly Activity Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={analytics.monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px'
                }}
              />
              <Area
                type="monotone"
                dataKey="uploads"
                stackId="1"
                stroke="#8b5cf6"
                fill="#8b5cf6"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="detections"
                stackId="2"
                stroke="#06b6d4"
                fill="#06b6d4"
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Platform Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="glass p-6 rounded-2xl"
        >
          <h3 className="text-xl font-semibold mb-6 text-white">Platform Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics.platformChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(props: any) => {
                  const { name, percent = 0 } = props;
                  return `${name} ${(percent * 100).toFixed(0)}%`;
                }}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {analytics.platformChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Asset Types */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass p-6 rounded-2xl"
        >
          <h3 className="text-xl font-semibold mb-6 text-white">Asset Types</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.typeChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="value" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Detection Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="glass p-6 rounded-2xl"
        >
          <h3 className="text-xl font-semibold mb-6 text-white">Detection Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={[
                { name: 'Authorized', value: analytics.authorizedDetections, color: '#10b981' },
                { name: 'Unauthorized', value: analytics.totalUnauthorized, color: '#ef4444' }
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {[
                  { name: 'Authorized', value: analytics.authorizedDetections, color: '#10b981' },
                  { name: 'Unauthorized', value: analytics.totalUnauthorized, color: '#ef4444' }
                ].map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}