export interface ShipmentPreset {
  weight: number; // in kg
  length: number; // in cm
  breadth: number; // in cm
  height: number; // in cm
}

const PRESETS: Record<string, ShipmentPreset> = {
  '1:64': { weight: 0.3, length: 10, breadth: 5, height: 5 },
  '1:43': { weight: 0.5, length: 15, breadth: 8, height: 8 },
  '1:32': { weight: 0.8, length: 20, breadth: 10, height: 10 },
  '1:24': { weight: 1.2, length: 25, breadth: 12, height: 12 },
  '1:18': { weight: 2.0, length: 35, breadth: 15, height: 15 },
  'default': { weight: 0.5, length: 15, breadth: 10, height: 10 },
};

export const getPresetForScale = (scale: string | null | undefined): ShipmentPreset => {
  if (scale && PRESETS[scale]) {
    return PRESETS[scale];
  }
  return PRESETS['default'];
};

interface OrderItemForShipping {
  quantity: number;
  product: {
    scale?: string | null;
  };
}

// This function now calculates the total weight and finds the largest dimensions
export const calculateShipmentDetails = (items: OrderItemForShipping[]) => {
  let totalWeight = 0;
  let maxLength = 0;
  let maxBreadth = 0;
  let maxHeight = 0;

  items.forEach(item => {
    const preset = getPresetForScale(item.product.scale);
    totalWeight += preset.weight * item.quantity;
    
    if (preset.length > maxLength) maxLength = preset.length;
    if (preset.breadth > maxBreadth) maxBreadth = preset.breadth;
    if (preset.height > maxHeight) maxHeight = preset.height;
  });
  
  // Simple heuristic: add a little extra height for each additional item
  // A better algorithm could be implemented later if needed.
  const consolidatedHeight = maxHeight + (items.length > 1 ? (items.length -1) * 2 : 0);

  return {
    weight: parseFloat(totalWeight.toFixed(2)),
    length: maxLength,
    breadth: maxBreadth,
    height: consolidatedHeight,
  };
};
