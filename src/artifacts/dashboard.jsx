import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  PieChart, Pie, RadarChart, Radar, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const generateRandomData = () => {
  const lineData = Array.from({ length: 7 }, (_, i) => ({
    name: `D${i + 1}`,
    value: Math.floor(Math.random() * 1000),
    value2: Math.floor(Math.random() * 800)
  }));

  const barData = Array.from({ length: 6 }, (_, i) => ({
    name: `C${i + 1}`,
    value: Math.floor(Math.random() * 1000),
    value2: Math.floor(Math.random() * 1000)
  }));

  const pieData = Array.from({ length: 4 }, (_, i) => ({
    name: `S${i + 1}`,
    value: Math.floor(Math.random() * 100)
  }));

  const radarData = Array.from({ length: 6 }, (_, i) => ({
    subject: `M${i + 1}`,
    A: Math.floor(Math.random() * 100),
    B: Math.floor(Math.random() * 100)
  }));

  const scatterData = Array.from({ length: 20 }, () => ({
    x: Math.floor(Math.random() * 100),
    y: Math.floor(Math.random() * 100)
  }));

  const areaData = Array.from({ length: 7 }, (_, i) => ({
    name: `P${i + 1}`,
    value: Math.floor(Math.random() * 1000),
    value2: Math.floor(Math.random() * 800)
  }));

  return { lineData, barData, pieData, radarData, scatterData, areaData };
};

const Dashboard = () => {
  const [data, setData] = useState(generateRandomData());

  useEffect(() => {
    const interval = setInterval(() => {
      setData(generateRandomData());
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full p-4">
      <h1 className="text-2xl font-bold mb-4">Live Analytics Dashboard</h1>
      <div className="grid grid-cols-3 gap-4">
        {/* Line Chart */}
        <Card>
          <CardHeader className="p-2">
            <CardTitle className="text-sm">Line Chart</CardTitle>
          </CardHeader>
          <CardContent className="p-1">
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.lineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{fontSize: 10}} />
                  <YAxis tick={{fontSize: 10}} />
                  <Tooltip />
                  <Legend wrapperStyle={{fontSize: '10px'}} />
                  <Line type="monotone" dataKey="value" stroke="#8884d8" />
                  <Line type="monotone" dataKey="value2" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Bar Chart */}
        <Card>
          <CardHeader className="p-2">
            <CardTitle className="text-sm">Bar Chart</CardTitle>
          </CardHeader>
          <CardContent className="p-1">
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{fontSize: 10}} />
                  <YAxis tick={{fontSize: 10}} />
                  <Tooltip />
                  <Legend wrapperStyle={{fontSize: '10px'}} />
                  <Bar dataKey="value" fill="#8884d8" />
                  <Bar dataKey="value2" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Area Chart */}
        <Card>
          <CardHeader className="p-2">
            <CardTitle className="text-sm">Area Chart</CardTitle>
          </CardHeader>
          <CardContent className="p-1">
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.areaData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{fontSize: 10}} />
                  <YAxis tick={{fontSize: 10}} />
                  <Tooltip />
                  <Legend wrapperStyle={{fontSize: '10px'}} />
                  <Area type="monotone" dataKey="value" fill="#8884d8" stroke="#8884d8" />
                  <Area type="monotone" dataKey="value2" fill="#82ca9d" stroke="#82ca9d" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card>
          <CardHeader className="p-2">
            <CardTitle className="text-sm">Pie Chart</CardTitle>
          </CardHeader>
          <CardContent className="p-1">
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={50}
                    fill="#8884d8"
                    label={{fontSize: 10}}
                  />
                  <Tooltip />
                  <Legend wrapperStyle={{fontSize: '10px'}} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Radar Chart */}
        <Card>
          <CardHeader className="p-2">
            <CardTitle className="text-sm">Radar Chart</CardTitle>
          </CardHeader>
          <CardContent className="p-1">
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="50%" data={data.radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" tick={{fontSize: 10}} />
                  <PolarRadiusAxis tick={{fontSize: 10}} />
                  <Radar name="A" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  <Radar name="B" dataKey="B" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                  <Legend wrapperStyle={{fontSize: '10px'}} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Scatter Chart */}
        <Card>
          <CardHeader className="p-2">
            <CardTitle className="text-sm">Scatter Chart</CardTitle>
          </CardHeader>
          <CardContent className="p-1">
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" dataKey="x" name="x" tick={{fontSize: 10}} />
                  <YAxis type="number" dataKey="y" name="y" tick={{fontSize: 10}} />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter name="Values" data={data.scatterData} fill="#8884d8" />
                  <Legend wrapperStyle={{fontSize: '10px'}} />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;