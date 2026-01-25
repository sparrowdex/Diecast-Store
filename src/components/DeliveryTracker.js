"use client";
import { motion } from "framer-motion";

const stages = [
  { id: 'PENDING', label: 'GRID_POSITION', desc: 'Order Placed' },
  { id: 'PROCESSING', label: 'PIT_LANE', desc: 'Packing Exhibit' },
  { id: 'SHIPPED', label: 'ON_TRACK', desc: 'In Transit' },
  { id: 'DELIVERED', label: 'CHECKERED_FLAG', desc: 'Delivered' }
];

export default function DeliveryTracker({ status, trackingNumber }) {
  const currentStageIndex = stages.findIndex(s => s.id === status);
  
  return (
    <div className="w-full py-8">
      {/* Progress Bar Container */}
      <div className="relative flex justify-between items-center mb-8">
        {/* Background Track */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-gray-100 z-0" />
        
        {/* Active Progress Line */}
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${(currentStageIndex / (stages.length - 1)) * 100}%` }}
          className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-black z-10 transition-all duration-1000"
        />

        {/* Stage Nodes */}
        {stages.map((stage, index) => {
          const isActive = index <= currentStageIndex;
          const isCurrent = index === currentStageIndex;
          
          return (
            <div key={stage.id} className="relative z-20 flex flex-col items-center">
              {/* Node Circle */}
              <motion.div 
                animate={{ 
                  scale: isCurrent ? 1.2 : 1,
                  backgroundColor: isActive ? "#000" : "#f3f4f6"
                }}
                className={`w-3 h-3 rounded-full border-2 ${isActive ? 'border-black' : 'border-gray-200'}`}
              />
              
              {/* Label */}
              <div className="absolute top-6 flex flex-col items-center whitespace-nowrap">
                <span className={`text-[8px] font-black uppercase tracking-tighter ${isActive ? 'text-black' : 'text-gray-300'}`}>
                  {stage.label}
                </span>
                <span className={`text-[7px] font-mono uppercase mt-0.5 ${isCurrent ? 'text-red-600' : 'text-gray-400'}`}>
                  {stage.desc}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tracking Details Footer */}
      {trackingNumber && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 p-4 bg-gray-50 border border-black/5 rounded flex justify-between items-center"
        >
          <div>
            <p className="text-[8px] font-mono text-gray-400 uppercase tracking-widest mb-1">Telemetry_ID</p>
            <p className="text-[10px] font-black uppercase">{trackingNumber}</p>
          </div>
          <button 
            onClick={() => window.open(`https://www.google.com/search?q=track+package+${trackingNumber}`, '_blank')}
            className="text-[9px] font-bold uppercase tracking-widest bg-black text-white px-4 py-2 rounded-sm hover:bg-red-600 transition-colors"
          >
            Live_Track →
          </button>
        </motion.div>
      )}
    </div>
  );
}