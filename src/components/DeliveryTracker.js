// 'use client';

// import { Check, Package, Truck, Ship, MapPin } from 'lucide-react';

// const getStatusDetails = (status) => {
//   const allStatuses = [
//     { name: 'PENDING', icon: Package, date: 'JAN 28, 2026', description: 'Order confirmed, awaiting warehouse processing.' },
//     { name: 'SHIPPED', icon: Ship, date: 'JAN 29, 2026', description: 'Your package has left our facility.' },
//     { name: 'IN_TRANSIT', icon: Truck, date: 'JAN 30, 2026', description: 'Moving through the carrier network.' },
//     { name: 'DELIVERED', icon: MapPin, date: 'FEB 01, 2026', description: 'Your exhibit has arrived.' }
//   ];

//   const currentIndex = allStatuses.findIndex(s => s.name === status);
//   return allStatuses.map((s, index) => ({
//     ...s,
//     isCompleted: index <= currentIndex,
//     isCurrent: index === currentIndex,
//     progressPercent: index < currentIndex ? 100 : (index === currentIndex ? 50 : 0)
//   }));
// };

// const DeliveryTracker = ({ status, trackingNumber, isDark }) => {
//   const timeline = getStatusDetails(status);
//   const currentStatusIndex = timeline.findIndex(item => item.isCurrent);
//   // Calculate total progress for the top bar
//   const totalProgress = ((currentStatusIndex) / (timeline.length - 1)) * 100;

//   return (
//     <div className={`p-8 border-t-4 ${isDark ? 'border-yellow-500 bg-[#0c0c0c]' : 'border-black bg-white'} shadow-2xl`}>
//       {/* Header Section */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
//         <div>
//           <p className="font-mono text-[10px] uppercase tracking-[0.3em] opacity-50 mb-1">Logistics Serial</p>
//           <h3 className="font-black text-3xl italic tracking-tighter uppercase leading-none">
//             {trackingNumber || 'UNASSIGNED_ID'}
//           </h3>
//         </div>
//         <div className={`px-4 py-2 border font-mono text-xs font-bold uppercase tracking-widest ${isDark ? 'bg-yellow-500 text-black border-yellow-500' : 'bg-black text-white border-black'}`}>
//           Status: {status.replace(/_/g, ' ')}
//         </div>
//       </div>
      
//       {/* Visual Timeline Bar */}
//       <div className="relative w-full max-w-4xl mx-auto mb-20 px-4">
//         {/* Background Track */}
//         <div className={`absolute left-0 top-1/2 -translate-y-1/2 h-[2px] w-full ${isDark ? 'bg-white/10' : 'bg-black/10'}`} />
        
//         {/* Active Progress Track */}
//         <div 
//           className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-yellow-500 transition-all duration-1000 ease-in-out" 
//           style={{ width: `${totalProgress}%` }}
//         />
        
//         <div className="relative flex justify-between items-center w-full">
//           {timeline.map((item) => {
//             const Icon = item.icon;
//             return (
//               <div key={item.name} className="flex flex-col items-center group">
//                 <div 
//                   className={`relative z-10 flex items-center justify-center h-10 w-10 border-2 transition-all duration-500 ${
//                     item.isCompleted 
//                       ? 'bg-yellow-500 border-yellow-500 text-black scale-110 shadow-[0_0_15px_rgba(234,179,8,0.3)]' 
//                       : (isDark ? 'bg-zinc-900 border-white/20 text-white/30' : 'bg-white border-black/20 text-black/30')
//                   }`}
//                 >
//                   {item.isCompleted && !item.isCurrent ? <Check size={18} strokeWidth={3} /> : <Icon size={18} />}
                  
//                   {/* Pulse for Current Status */}
//                   {item.isCurrent && (
//                     <span className="absolute inset-0 h-full w-full animate-ping rounded-none bg-yellow-500/30 -z-10" />
//                   )}
//                 </div>
//                 <span className={`absolute -bottom-8 font-mono text-[9px] font-bold uppercase tracking-tighter transition-opacity ${item.isCompleted ? 'opacity-100' : 'opacity-0'}`}>
//                   {item.name.split('_')[0]}
//                 </span>
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       {/* Detailed Log Section */}
//       <div className="grid grid-cols-1 gap-1 border-t border-dashed border-white/10 pt-8">
//         {timeline.map((item) => (
//           <div 
//             key={item.name} 
//             className={`group relative overflow-hidden p-6 transition-all duration-300 border ${
//               item.isCurrent 
//                 ? (isDark ? 'bg-white/5 border-white/20' : 'bg-black/5 border-black/20')
//                 : 'border-transparent'
//             } ${item.isCompleted ? 'opacity-100' : 'opacity-20'}`}
//           >
//             {/* Sidebar indicator */}
//             <div className={`absolute left-0 top-0 h-full w-1 transition-all ${item.isCurrent ? 'bg-yellow-500' : 'bg-transparent'}`} />

//             <div className="flex flex-col md:flex-row md:items-center gap-4 relative z-10">
//               <div className="min-w-[120px]">
//                 <p className="font-mono text-[10px] tracking-widest opacity-50">{item.date}</p>
//               </div>
              
//               <div className="flex-grow">
//                 <h4 className={`text-lg font-black uppercase tracking-tight italic ${item.isCurrent ? 'text-yellow-500' : ''}`}>
//                   {item.name.replace(/_/g, ' ')}
//                 </h4>
//                 <p className="text-sm font-medium opacity-60 max-w-xl">{item.description}</p>
//               </div>

//               {item.isCurrent && (
//                 <div className="font-mono text-[10px] animate-pulse text-yellow-500">
//                   [ ACTIVE_NODE ]
//                 </div>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default DeliveryTracker;
'use client';

import { Check, Package, Truck, Ship, MapPin, Search, ChevronRight } from 'lucide-react';

const getStatusDetails = (status) => {
  const allStatuses = [
    { name: 'PENDING', icon: Package, date: 'JAN 28, 2026', description: 'Order confirmed, awaiting warehouse processing.' },
    { name: 'SHIPPED', icon: Ship, date: 'JAN 29, 2026', description: 'Your package has left our facility.' },
    { name: 'IN_TRANSIT', icon: Truck, date: 'JAN 30, 2026', description: 'Moving through the carrier network.' },
    { name: 'DELIVERED', icon: MapPin, date: 'FEB 01, 2026', description: 'Your exhibit has arrived.' }
  ];

  const currentIndex = allStatuses.findIndex(s => s.name === status);
  return allStatuses.map((s, index) => ({
    ...s,
    isCompleted: index <= currentIndex,
    isCurrent: index === currentIndex,
  }));
};

const DeliveryTracker = ({ status, trackingNumber, isDark }) => {
  const timeline = getStatusDetails(status);
  const currentStatusIndex = timeline.findIndex(item => item.isCurrent);
  const totalProgress = ((currentStatusIndex) / (timeline.length - 1)) * 100;

  // Theme Constants
  const activeColor = isDark ? 'yellow-500' : 'orange-600';
  const accentGradient = isDark ? 'from-yellow-400 to-yellow-600' : 'from-orange-500 to-red-600';

  return (
    <div className={`p-8 border-t-10 ${isDark ? 'border-yellow-500 bg-[#0a0a0a] text-white' : 'border-orange-600 bg-zinc-50 text-black'} shadow-2xl font-sans relative overflow-hidden transition-colors duration-500`}>
      
      {/* Dynamic Background Watermark */}
      <div className={`absolute top-0 right-0 opacity-[0.04] font-black text-9xl -mr-10 -mt-10 pointer-events-none select-none italic`}>
        {status.split('_')[0]}
      </div>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4 border-b border-zinc-500/20 pb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2 group">
            <Search size={14} className={`transition-colors ${isDark ? 'text-yellow-500' : 'text-orange-600'}`} />
            <p className="font-mono text-[10px] uppercase tracking-[0.4em] opacity-50">Logistics Node ID</p>
          </div>
          <h3 className="font-black text-4xl italic tracking-tighter uppercase leading-none">
            {trackingNumber || 'UNASSIGNED_ID'}
          </h3>
        </div>
        
        <div className={`flex flex-col items-end px-6 py-3 border-2 transition-all ${isDark ? 'border-yellow-500/50 bg-yellow-500/5' : 'border-orange-600/50 bg-orange-600/5'}`}>
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] opacity-60">System Phase</span>
          <span className={`font-mono text-sm font-black italic ${isDark ? 'text-yellow-500' : 'text-orange-600'}`}>
            {status.replace(/_/g, ' ')}
          </span>
        </div>
      </div>
      
      {/* Visual Timeline Bar */}
      <div className="relative w-full max-w-4xl mx-auto mb-24 px-4">
        <div className={`absolute left-0 top-1/2 -translate-y-1/2 h-0.5 w-full ${isDark ? 'bg-white/10' : 'bg-black/10'}`} />
        <div 
          className={`absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-linear-to-r ${accentGradient} shadow-lg transition-all duration-1000 ease-in-out`} 
          style={{ width: `${totalProgress}%` }}
        />
        
        <div className="relative flex justify-between items-center w-full">
          {timeline.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.name} className="flex flex-col items-center">
                <div 
                  className={`relative z-10 flex items-center justify-center h-14 w-14 transition-all duration-500 shadow-xl ${
                    item.isCompleted 
                      ? `bg-linear-to-br ${accentGradient} text-white scale-110` 
                      : (isDark ? 'bg-zinc-900 border border-white/10 text-white/20' : 'bg-white border-2 border-zinc-200 text-zinc-300')
                  }`}
                >
                  {item.isCompleted && !item.isCurrent ? <Check size={22} strokeWidth={3} /> : <Icon size={22} />}
                  
                  {item.isCurrent && (
                    <span className={`absolute inset-0 h-full w-full animate-ping opacity-25 -z-10 ${isDark ? 'bg-yellow-500' : 'bg-orange-600'}`} />
                  )}
                </div>
                <span className={`absolute -bottom-10 font-mono text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${item.isCurrent ? (isDark ? 'text-yellow-500' : 'text-orange-600') : 'opacity-40'}`}>
                  {item.name.split('_')[0]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Log Section */}
      <div className="grid grid-cols-1 gap-3">
        {timeline.map((item) => (
          <div 
            key={item.name} 
            className={`group relative p-6 transition-all duration-300 border-l-4 ${
              item.isCurrent 
                ? (isDark ? 'bg-white/3 border-yellow-500' : 'bg-orange-600/3 border-orange-600')
                : 'border-transparent opacity-40 hover:opacity-100'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center gap-6 relative z-10">
              <div className="min-w-25 font-mono text-xs tracking-tighter opacity-50 flex items-center gap-2">
                {item.isCurrent && <ChevronRight size={12} className={isDark ? 'text-yellow-500' : 'text-orange-600'} />}
                {item.date}
              </div>
              
              <div className="grow">
                <h4 className={`text-xl font-black uppercase tracking-tight italic leading-none mb-1 transition-colors ${item.isCurrent ? (isDark ? 'text-yellow-500' : 'text-orange-600') : ''}`}>
                  {item.name.replace(/_/g, ' ')}
                </h4>
                <p className="text-[10px] font-bold opacity-60 tracking-wider uppercase">{item.description}</p>
              </div>

              {item.isCurrent && (
                <div className="flex items-center gap-3 bg-current/5 px-4 py-2 rounded-full">
                    <div className={`h-2 w-2 rounded-full animate-pulse ${isDark ? 'bg-yellow-500' : 'bg-orange-600'}`} />
                    <span className={`font-mono text-[9px] font-black tracking-[0.2em] uppercase ${isDark ? 'text-yellow-500' : 'text-orange-600'}`}>
                        Active Node Connection
                    </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeliveryTracker;