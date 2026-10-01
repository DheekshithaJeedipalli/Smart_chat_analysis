import React, { useState } from 'react';
import { useChat } from '../src/context/ChatContext';
import { Clock, Calendar, CalendarDays, Moon, Sun, PieChart, BarChart2, Activity, ChevronLeft, ChevronRight, ArrowRight, Download, Filter } from 'lucide-react';
import Plot from 'react-plotly.js';

export const ActivityAnalytics: React.FC = () => {
  const { currentData } = useChat();
  const data = currentData.activityData;
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 4)); // Default to May 2026 for demo
  const [showCharts, setShowCharts] = useState(false);

  if (!data) return <div className="p-10">No activity data found.</div>;

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Calendar rendering logic (simplified)
  const renderCalendar = () => {
    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
    const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
    const blanks = Array(firstDay).fill(null);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const totalSlots = [...blanks, ...days];

    return (
      <div className="grid grid-cols-7 gap-2 mt-4 text-center">
        {daysOfWeek.map(d => <span key={d} className="text-[10px] font-bold text-textMuted uppercase">{d}</span>)}
        {totalSlots.map((d, i) => {
          if (!d) return <div key={i} className="p-2" />;
          const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
          const count = data.calendarData[dateStr] || 0;
          let bgColor = 'bg-slate-50';
          let textColor = 'text-textMain';
          if (count > 0 && count < 50) bgColor = 'bg-yellow-100';
          else if (count >= 50 && count < 150) { bgColor = 'bg-orange-100'; }
          else if (count >= 150) { bgColor = 'bg-red-500 text-white font-bold'; textColor = 'text-white'; }

          return (
            <div key={i} className={`p-2 rounded-lg text-xs flex items-center justify-center transition-colors ${bgColor} ${textColor}`}>
              {d}
            </div>
          );
        })}
      </div>
    );
  };

  // Heatmap rendering logic
  const renderHeatmap = () => {
    return (
      <div className="flex flex-col gap-1 mt-4 relative">
        <div className="flex justify-between text-[10px] text-textMuted font-bold mb-1 pl-8">
          <span>12 AM</span><span>6 AM</span><span>12 PM</span><span>6 PM</span><span>12 AM</span>
        </div>
        {daysOfWeek.map((day, dIdx) => (
          <div key={day} className="flex items-center gap-1">
            <span className="text-[10px] text-textMuted font-bold w-6 text-right">{day}</span>
            <div className="flex flex-1 gap-1">
              {data.heatmapData[dIdx].map((val, hIdx) => {
                let opacity = 0.1;
                if (val > 0) opacity = Math.min(0.2 + (val / 100), 1);
                const color = hIdx < 12 ? `rgba(168, 85, 247, ${opacity})` : `rgba(239, 68, 68, ${opacity})`;
                return (
                  <div 
                    key={hIdx} 
                    className="flex-1 aspect-square rounded-sm transition-all hover:scale-125 hover:z-10 cursor-pointer border border-black/5"
                    style={{ backgroundColor: color }}
                    title={`${val} messages at ${hIdx}:00 on ${day}`}
                  />
                );
              })}
            </div>
          </div>
        ))}
        <div className="flex items-center justify-between mt-3 text-[10px] text-textMuted font-bold pl-8">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-sm bg-purple-500/20" />
            <div className="w-3 h-3 rounded-sm bg-purple-500/50" />
            <div className="w-3 h-3 rounded-sm bg-purple-500/80" />
            <div className="w-3 h-3 rounded-sm bg-red-500/50" />
            <div className="w-3 h-3 rounded-sm bg-red-500/80" />
          </div>
          <span>More</span>
        </div>
      </div>
    );
  };

  if (showCharts) {
    const layoutBase = {
      paper_bgcolor: 'transparent',
      plot_bgcolor: 'transparent',
      font: { family: 'Inter, sans-serif', color: '#64748b', size: 10 },
      margin: { t: 10, r: 10, b: 20, l: 30 },
      xaxis: { gridcolor: 'rgba(0,0,0,0.03)', tickfont: { size: 9 } },
      yaxis: { gridcolor: 'rgba(0,0,0,0.05)', tickfont: { size: 9 } }
    };

    return (
      <div className="max-w-[1400px] mx-auto animate-in fade-in slide-in-from-right-8 duration-500 ease-out">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button onClick={() => setShowCharts(false)} className="p-2 hover:bg-black/5 rounded-xl transition-colors">
              <ChevronLeft className="w-5 h-5 text-textMuted" />
            </button>
            <div>
              <h1 className="text-2xl font-display font-extrabold text-textMain">Time Analysis - Charts</h1>
              <p className="text-xs text-textMuted mt-1 font-medium">Detailed comparison of your conversation activity over time.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 bg-white/60 border border-primary/60 rounded-xl px-4 py-2 shadow-sm text-xs font-bold text-textMain">
              {currentData.dateRange} <Calendar className="w-4 h-4 text-textMuted" />
            </div>
            <button className="flex items-center gap-2 bg-white/60 border border-primary/60 rounded-xl px-4 py-2 shadow-sm text-xs font-bold text-textMain hover:bg-white/80 transition-colors">
              <Download className="w-4 h-4 text-textMuted" /> Export Charts
            </button>
            <button className="flex items-center gap-2 bg-primary text-white rounded-xl px-4 py-2 shadow-sm text-xs font-bold hover:bg-primary/90 transition-colors">
              <Filter className="w-4 h-4" /> Filters <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Top 3 Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="glass-panel rounded-3xl p-6 relative">
            <h3 className="text-sm font-bold text-textMain mb-1">Hour vs Messages</h3>
            <p className="text-[10px] text-textMuted mb-4">Distribution of messages across hours of the day</p>
            <div className="h-48 w-full -ml-2">
              <Plot 
                data={[{ x: Array.from({length: 24}, (_, i) => `${i === 0 ? '12 AM' : i < 12 ? i + ' AM' : i === 12 ? '12 PM' : (i-12) + ' PM'}`), y: data.hourCounts, type: 'bar', marker: { color: '#8b5cf6', borderRadius: 4 } }]}
                layout={{ ...layoutBase, bargap: 0.3 }} config={{ displayModeBar: false, responsive: true }} style={{ width: '100%', height: '100%' }}
              />
            </div>
            <div className="absolute top-6 right-6 text-[10px] bg-primary/10 text-primary font-bold px-2 py-1 rounded-md">24 Hours</div>
            <div className="mt-4 flex justify-between items-end border-t border-black/5 pt-4">
               <div>
                 <span className="text-[10px] text-primary font-bold block mb-1">Most Active Hour</span>
                 <span className="text-sm font-bold text-textMain">{data.mostActiveHour}</span>
               </div>
               <div className="text-right">
                 <span className="text-sm font-bold text-textMain block">{Math.max(...data.hourCounts).toLocaleString()}</span>
                 <span className="text-[10px] text-textMuted">messages</span>
               </div>
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-6 relative">
            <h3 className="text-sm font-bold text-textMain mb-1">Day vs Messages</h3>
            <p className="text-[10px] text-textMuted mb-4">Distribution of messages across days of the week</p>
            <div className="h-48 w-full -ml-2">
              <Plot 
                data={[{ x: daysOfWeek, y: data.dayCounts, type: 'bar', marker: { color: '#22c55e', borderRadius: 4 } }]}
                layout={{ ...layoutBase, bargap: 0.4 }} config={{ displayModeBar: false, responsive: true }} style={{ width: '100%', height: '100%' }}
              />
            </div>
            <div className="absolute top-6 right-6 text-[10px] bg-green-500/10 text-green-600 font-bold px-2 py-1 rounded-md">7 Days</div>
            <div className="mt-4 flex justify-between items-end border-t border-black/5 pt-4">
               <div>
                 <span className="text-[10px] text-green-600 font-bold block mb-1">Most Active Day</span>
                 <span className="text-sm font-bold text-textMain">{data.mostActiveDay}</span>
               </div>
               <div className="text-right">
                 <span className="text-sm font-bold text-textMain block">{Math.max(...data.dayCounts).toLocaleString()}</span>
                 <span className="text-[10px] text-textMuted">messages</span>
               </div>
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-6 relative">
            <h3 className="text-sm font-bold text-textMain mb-1">Month vs Messages</h3>
            <p className="text-[10px] text-textMuted mb-4">Distribution of messages across months</p>
            <div className="h-48 w-full -ml-2">
              <Plot 
                data={[{ x: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], y: data.monthCountsArr, type: 'bar', marker: { color: '#3b82f6', borderRadius: 4 } }]}
                layout={{ ...layoutBase, bargap: 0.3 }} config={{ displayModeBar: false, responsive: true }} style={{ width: '100%', height: '100%' }}
              />
            </div>
            <div className="absolute top-6 right-6 text-[10px] bg-blue-500/10 text-blue-600 font-bold px-2 py-1 rounded-md">12 Months</div>
            <div className="mt-4 flex justify-between items-end border-t border-black/5 pt-4">
               <div>
                 <span className="text-[10px] text-blue-600 font-bold block mb-1">Most Active Month</span>
                 <span className="text-sm font-bold text-textMain">{data.mostActiveMonth.split(' ')[0]}</span>
               </div>
               <div className="text-right">
                 <span className="text-sm font-bold text-textMain block">{Math.max(...data.monthCountsArr).toLocaleString()}</span>
                 <span className="text-[10px] text-textMuted">messages</span>
               </div>
            </div>
          </div>
        </div>

        {/* Bottom 3 Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="glass-panel rounded-3xl p-6 relative">
            <h3 className="text-sm font-bold text-textMain mb-1">Year vs Messages</h3>
            <p className="text-[10px] text-textMuted mb-4">Yearly comparison of total messages</p>
            <div className="h-48 w-full -ml-2">
              <Plot 
                data={[{ x: Object.keys(data.yearCounts), y: Object.values(data.yearCounts), type: 'scatter', mode: 'lines+markers', line: { color: '#f59e0b', shape: 'spline', width: 3 }, marker: { size: 8 } }]}
                layout={layoutBase} config={{ displayModeBar: false, responsive: true }} style={{ width: '100%', height: '100%' }}
              />
            </div>
            <div className="absolute top-6 right-6 text-[10px] bg-amber-500/10 text-amber-600 font-bold px-2 py-1 rounded-md">All Years</div>
            <div className="mt-4 flex justify-between items-end border-t border-black/5 pt-4">
               <div>
                 <span className="text-[10px] text-amber-600 font-bold block mb-1">Most Active Year</span>
                 <span className="text-sm font-bold text-textMain">{data.mostActiveYear}</span>
               </div>
               <div className="text-right">
                 <span className="text-sm font-bold text-textMain block">{Object.values(data.yearCounts).length > 0 ? Math.max(...Object.values(data.yearCounts)).toLocaleString() : 0}</span>
                 <span className="text-[10px] text-textMuted">messages</span>
               </div>
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-6 relative">
            <h3 className="text-sm font-bold text-textMain mb-1">Weekly Trend</h3>
            <p className="text-[10px] text-textMuted mb-4">Weekly message activity trend</p>
            <div className="h-48 w-full -ml-2">
              <Plot 
                data={[{ x: data.weeklyTrend.map(d => d.date), y: data.weeklyTrend.map(d => d.count), type: 'scatter', mode: 'lines+markers', line: { color: '#a855f7', width: 2 }, marker: { size: 4 } }]}
                layout={{ ...layoutBase, xaxis: { ...layoutBase.xaxis, showticklabels: false } }} config={{ displayModeBar: false, responsive: true }} style={{ width: '100%', height: '100%' }}
              />
            </div>
            <div className="absolute top-6 right-6 text-[10px] bg-purple-500/10 text-purple-600 font-bold px-2 py-1 rounded-md">{data.weeklyTrend.length} Weeks</div>
            <div className="mt-4 flex justify-between items-end border-t border-black/5 pt-4">
               <div>
                 <span className="text-[10px] text-purple-600 font-bold block mb-1">Average per Week</span>
                 <span className="text-sm font-bold text-textMain">{Math.floor(data.weeklyTrend.reduce((sum, d) => sum + d.count, 0) / (data.weeklyTrend.length || 1)).toLocaleString()} messages</span>
               </div>
               <div className="text-right">
                 <span className="text-[10px] text-purple-600 font-bold block mb-1">Busiest Week</span>
                 <span className="text-sm font-bold text-textMain">{data.weeklyTrend.length > 0 ? Math.max(...data.weeklyTrend.map(d => d.count)).toLocaleString() : 0} messages</span>
               </div>
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-6 relative">
            <h3 className="text-sm font-bold text-textMain mb-1">Daily Trend</h3>
            <p className="text-[10px] text-textMuted mb-4">Daily message activity trend</p>
            <div className="h-48 w-full -ml-2">
              <Plot 
                data={[{ x: data.dailyTrend.map(d => d.date), y: data.dailyTrend.map(d => d.count), type: 'scatter', mode: 'lines', line: { color: '#22c55e', width: 1.5 }, fill: 'tozeroy', fillcolor: 'rgba(34, 197, 94, 0.1)' }]}
                layout={{ ...layoutBase, xaxis: { ...layoutBase.xaxis, showticklabels: false } }} config={{ displayModeBar: false, responsive: true }} style={{ width: '100%', height: '100%' }}
              />
            </div>
            <div className="absolute top-6 right-6 text-[10px] bg-green-500/10 text-green-600 font-bold px-2 py-1 rounded-md">{data.dailyTrend.length} Days</div>
            <div className="mt-4 flex justify-between items-end border-t border-black/5 pt-4">
               <div>
                 <span className="text-[10px] text-green-600 font-bold block mb-1">Average per Day</span>
                 <span className="text-sm font-bold text-textMain">{Math.floor(data.dailyTrend.reduce((sum, d) => sum + d.count, 0) / (data.dailyTrend.length || 1)).toLocaleString()} messages</span>
               </div>
               <div className="text-right">
                 <span className="text-[10px] text-green-600 font-bold block mb-1">Busiest Day</span>
                 <span className="text-sm font-bold text-textMain">{data.dailyTrend.length > 0 ? Math.max(...data.dailyTrend.map(d => d.count)).toLocaleString() : 0} messages</span>
               </div>
            </div>
          </div>
        </div>

        {/* Existing Breakdown Cards Re-used at the bottom */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          <div className="glass-panel rounded-3xl p-6 flex flex-col items-center text-center justify-center">
            <h3 className="text-xs font-bold text-textMain mb-1">Weekday vs Weekend</h3>
            <div className="w-24 h-24 relative flex items-center justify-center my-4">
               <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90 absolute inset-0">
                <path className="text-slate-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="6" />
                <path className="text-indigo-500" strokeDasharray={`${parseFloat(data.weekdayPercent)}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
              </svg>
              <div className="flex flex-col z-10">
                <span className="text-[10px] font-bold text-textMuted uppercase">Total</span>
                <span className="text-lg font-display font-extrabold text-textMain">{(data.morningCount + data.eveningCount + data.lateNightCount).toLocaleString()}</span>
              </div>
            </div>
            <div className="flex gap-4 text-[10px] font-medium text-textMuted">
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-indigo-500" /> Weekdays</div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-slate-200" /> Weekends</div>
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-6 flex flex-col items-center text-center justify-center">
            <h3 className="text-xs font-bold text-textMain mb-1">Morning vs Evening</h3>
            <div className="w-24 h-24 relative flex items-center justify-center my-4">
               <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90 absolute inset-0">
                <path className="text-indigo-500" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="6" />
                <path className="text-amber-500" strokeDasharray={`${parseFloat(data.morningPercent)}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
              </svg>
              <div className="flex flex-col z-10">
                <span className="text-[10px] font-bold text-textMuted uppercase">Total</span>
                <span className="text-lg font-display font-extrabold text-textMain">{(data.morningCount + data.eveningCount + data.lateNightCount).toLocaleString()}</span>
              </div>
            </div>
            <div className="flex gap-4 text-[10px] font-medium text-textMuted">
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-500" /> Morning</div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-indigo-500" /> Evening</div>
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-6 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-1">
              <Moon className="w-5 h-5 fill-purple-500 text-purple-500" />
              <h3 className="font-bold text-textMain">Late-night Activity</h3>
            </div>
            <p className="text-[10px] text-textMuted font-medium mb-4">Messages sent 12:00 AM - 5:00 AM</p>
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 relative flex items-center justify-center">
                 <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90 absolute inset-0">
                  <path className="text-slate-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="5" />
                  <path className="text-purple-500" strokeDasharray={`${parseFloat(data.lateNightPercent)}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
                </svg>
                <span className="text-sm font-display font-bold text-textMain z-10">{data.lateNightPercent}</span>
              </div>
              <div>
                <span className="text-lg font-bold text-textMain">{data.lateNightCount.toLocaleString()}</span>
                <span className="text-[10px] text-textMuted block">messages</span>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-6 flex flex-col justify-center">
             <h3 className="font-bold text-textMain mb-1">Quiet Hours</h3>
             <p className="text-[10px] text-textMuted font-medium mb-4">Your least active time</p>
             <div className="flex items-center gap-3 mb-4 text-indigo-600 font-bold bg-indigo-50 px-4 py-3 rounded-2xl">
               <Moon className="w-5 h-5" />
               <span className="text-sm">{data.quietHours}</span>
             </div>
             <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md inline-block self-start">Optimal quiet time for you</span>
          </div>
        </div>
        
        {/* Banner */}
        <div className="bg-gradient-to-r from-primary/10 to-transparent p-4 rounded-2xl border border-primary/20 flex items-start gap-4">
          <div className="bg-white rounded-full p-2 text-primary shadow-sm mt-1">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-textMain mb-0.5">Insights</h4>
            <p className="text-[11px] text-textMuted font-medium leading-relaxed">
              You are most active on {data.mostActiveDay} {data.eveningCount > data.morningCount ? 'evenings' : 'mornings'}, especially around {data.mostActiveHour}. 
              Your overall activity peaks in {data.mostActiveMonth.split(' ')[0]} and shows a consistent weekly pattern.
            </p>
          </div>
        </div>

      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3">
            <Clock className="w-7 h-7 text-textMain" />
            <h1 className="text-3xl font-display font-extrabold text-textMain">Time Analysis</h1>
          </div>
          <p className="text-sm text-textMuted mt-2 font-medium">Understand your conversation activity patterns over time.</p>
        </div>
        <div className="flex items-center gap-3 bg-white/60 border border-primary/60 rounded-2xl px-5 py-2.5 shadow-sm">
          <span className="text-xs font-bold text-textMain">{currentData.dateRange}</span>
          <Calendar className="w-4 h-4 text-textMuted" />
        </div>
      </div>

      {/* Top 6 KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {[
          { icon: <Clock className="w-5 h-5" />, color: 'bg-indigo-500/10 text-indigo-500', title: 'Most Active Hour', value: data.mostActiveHour, desc: 'Peak activity time' },
          { icon: <CalendarDays className="w-5 h-5" />, color: 'bg-emerald-500/10 text-emerald-500', title: 'Most Active Day', value: data.mostActiveDay, desc: 'Busiest day of week' },
          { icon: <Calendar className="w-5 h-5" />, color: 'bg-blue-500/10 text-blue-500', title: 'Most Active Month', value: data.mostActiveMonth, desc: 'Highest activity month' },
          { icon: <Moon className="w-5 h-5" />, color: 'bg-orange-500/10 text-orange-500', title: 'Quiet Hours', value: data.quietHours, desc: 'Least active time' },
          { icon: <Moon className="w-5 h-5 fill-current" />, color: 'bg-purple-500/10 text-purple-500', title: 'Late-night %', value: data.lateNightPercent, desc: 'Messages sent 12AM-5AM' },
          { icon: <Sun className="w-5 h-5" />, color: 'bg-amber-500/10 text-amber-500', title: 'Morning vs Evening', value: data.morningCount > data.eveningCount ? 'Morning' : 'Evening', desc: "You're more active in " + (data.morningCount > data.eveningCount ? 'morning' : 'evening') }
        ].map((kpi, i) => (
          <div key={i} className="glass-panel rounded-3xl p-5 flex flex-col justify-between hover:-translate-y-1 transition-transform cursor-default">
            <div className={`w-10 h-10 rounded-2xl ${kpi.color} flex items-center justify-center mb-4`}>
              {kpi.icon}
            </div>
            <div>
              <span className="text-[11px] font-bold text-textMuted block mb-1">{kpi.title}</span>
              <span className="text-lg font-display font-bold text-textMain block leading-tight">{kpi.value}</span>
              <span className="text-[10px] text-textLight mt-2 block">{kpi.desc}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Middle Row: Donut Chart & Charts Link */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="glass-panel rounded-3xl p-6 lg:col-span-1 flex items-center justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <PieChart className="w-5 h-5 text-indigo-500" />
              <h3 className="font-bold text-textMain text-sm">Weekend vs Weekday</h3>
            </div>
            <div className="text-3xl font-display font-extrabold text-textMain mb-1">
              {data.weekendPercent} <span className="text-lg text-textMuted">vs</span> {data.weekdayPercent}
            </div>
            <p className="text-xs text-textLight font-medium">Weekend vs Weekday messages</p>
          </div>
          {/* Faux Donut Chart SVG */}
          <div className="w-24 h-24 relative z-10">
            <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
              <path className="text-slate-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
              <path className="text-indigo-500" strokeDasharray={`${parseFloat(data.weekendPercent)}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
              <path className="text-orange-500" strokeDasharray={`${parseFloat(data.weekdayPercent)}, 100`} strokeDashoffset={`-${parseFloat(data.weekendPercent)}`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
            </svg>
          </div>
        </div>

        <div className="glass-panel rounded-3xl p-6 lg:col-span-2 flex justify-between items-center bg-gradient-to-br from-white/80 to-indigo-50/50">
          <div className="flex gap-6 items-center">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
              <BarChart2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-bold text-textMain text-lg mb-1">Charts</h3>
              <p className="text-xs text-textMuted font-medium max-w-[200px]">Deep dive into your activity with detailed charts and trends.</p>
            </div>
          </div>
          <div className="hidden md:grid grid-cols-2 gap-x-8 gap-y-3">
            {['Hour vs Messages', 'Day vs Messages', 'Month vs Messages', 'Year vs Messages', 'Weekly Trend', 'Daily Trend'].map(t => (
              <div key={t} className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border border-indigo-500/30 flex items-center justify-center"><div className="w-2 h-2 rounded-full bg-indigo-500/50" /></div>
                <span className="text-xs font-semibold text-textLight">{t}</span>
              </div>
            ))}
          </div>
          <button onClick={() => setShowCharts(true)} className="bg-indigo-50 text-indigo-600 px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-indigo-100 transition-colors flex items-center gap-2">
            View Charts <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bottom Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Heatmap */}
        <div className="glass-panel rounded-3xl p-6 lg:col-span-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Activity className="w-5 h-5 text-red-500" />
              <h3 className="font-bold text-textMain">Activity Heatmap</h3>
            </div>
            <p className="text-xs text-textMuted font-medium">Messages by day of week and hour of day.</p>
          </div>
          {renderHeatmap()}
        </div>

        {/* Calendar */}
        <div className="glass-panel rounded-3xl p-6 lg:col-span-1">
           <div className="flex items-center gap-2 mb-1">
              <CalendarDays className="w-5 h-5 text-blue-500" />
              <h3 className="font-bold text-textMain">Activity Calendar</h3>
            </div>
            <p className="text-xs text-textMuted font-medium mb-4">Messages by date</p>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                  className="p-1 hover:bg-black/5 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 text-textMuted" />
                </button>
                <span className="text-sm font-bold text-textMain">
                  {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </span>
                <button 
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                  className="p-1 hover:bg-black/5 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-4 h-4 text-textMuted" />
                </button>
              </div>
              <button 
                onClick={() => setCurrentMonth(new Date())}
                className="text-xs font-bold text-textMuted border border-black/10 px-3 py-1.5 rounded-lg hover:bg-black/5"
              >
                Today
              </button>
            </div>
            {renderCalendar()}
        </div>

        {/* Breakdown bars */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="glass-panel rounded-3xl p-6">
            <div className="flex items-center gap-2 mb-1">
              <Sun className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-textMain">Morning vs Evening</h3>
            </div>
            <p className="text-[11px] text-textMuted font-medium mb-6">Compare your activity in morning vs evening.</p>
            
            <div className="mb-4">
              <div className="flex justify-between text-xs font-bold mb-2">
                <span className="text-textMain">Morning (5 AM - 12 PM)</span>
                <span className="text-textMuted">{data.morningPercent} ({data.morningCount.toLocaleString()})</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full" style={{ width: data.morningPercent }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-2">
                <span className="text-textMain">Evening (12 PM - 12 AM)</span>
                <span className="text-textMuted">{data.eveningPercent} ({data.eveningCount.toLocaleString()})</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: data.eveningPercent }} />
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-6 flex items-center justify-between flex-1">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Moon className="w-5 h-5 fill-purple-500 text-purple-500" />
                <h3 className="font-bold text-textMain">Late-night Percentage</h3>
              </div>
              <p className="text-[11px] text-textMuted font-medium">Messages sent between 12:00 AM - 5:00 AM</p>
              
              <div className="mt-6 flex flex-col">
                <span className="text-[10px] font-bold text-textLight uppercase tracking-wider mb-1">Total Messages</span>
                <span className="text-xl font-display font-extrabold text-textMain">{data.lateNightCount.toLocaleString()}</span>
              </div>
            </div>
            <div className="w-24 h-24 relative flex items-center justify-center">
               <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90 absolute inset-0">
                <path className="text-slate-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                <path className="text-purple-500" strokeDasharray={`${parseFloat(data.lateNightPercent)}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              </svg>
              <span className="text-lg font-display font-bold text-textMain z-10">{data.lateNightPercent}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
