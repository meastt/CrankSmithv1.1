// lib/components.js - Redesigned with real components matching your format

export const bikeConfig = {
  road: {
    wheelSizes: ["700c"],
    tireWidths: [23, 25, 28, 32, 35, 38],
    defaultSetup: { 
      wheel: "700c", 
      tire: "25", 
      crankset: "shimano-105-r7000", 
      cassette: "shimano-105-r7000-11-28" 
    },
  },
  gravel: {
    wheelSizes: ["700c", "650b"],
    tireWidths: [32, 35, 38, 40, 42, 45, 47, 50, 2.0, 2.1, 2.2, 2.25, 2.35], // mm then inches for MTB crossover
    defaultSetup: { 
      wheel: "700c", 
      tire: "40", 
      crankset: "shimano-grx-rx600", 
      cassette: "shimano-grx-rx600-11-42" 
    },
  },
  mtb: {
    wheelSizes: ["26-inch", "27.5-inch", "29-inch"],
    tireWidths: [2.1, 2.25, 2.35, 2.4, 2.5, 2.6], // Standard MTB inch widths
    defaultSetup: { 
      wheel: "29-inch", 
      tire: "2.35", 
      crankset: "sram-gx-eagle", 
      cassette: "sram-gx-eagle-10-52" 
    },
  },
};

export const componentDatabase = {
  cranksets: [
    // ROAD CRANKSETS
    { id: "shimano-105-r7000", model: "Shimano 105 R7000", variant: "50/34T", weight: 760, bikeType: "road", teeth: [50, 34] },
    { id: "shimano-ultegra-r8000", model: "Shimano Ultegra R8000", variant: "50/34T", weight: 680, bikeType: "road", teeth: [50, 34] },
    { id: "shimano-dura-ace-r9100", model: "Shimano Dura-Ace R9100", variant: "50/34T", weight: 590, bikeType: "road", teeth: [50, 34] },
    { id: "shimano-105-compact", model: "Shimano 105 R7000", variant: "52/36T", weight: 780, bikeType: "road", teeth: [52, 36] },
    { id: "shimano-ultegra-compact", model: "Shimano Ultegra R8000", variant: "52/36T", weight: 700, bikeType: "road", teeth: [52, 36] },
    { id: "sram-rival-axs", model: "SRAM Rival eTap AXS", variant: "46/33T", weight: 710, bikeType: "road", teeth: [46, 33] },

    // GRAVEL CRANKSETS
    { id: "shimano-grx-rx600", model: "Shimano GRX RX600", variant: "46/30T", weight: 720, bikeType: "gravel", teeth: [46, 30] },
    { id: "shimano-grx-rx810", model: "Shimano GRX RX810", variant: "48/31T", weight: 680, bikeType: "gravel", teeth: [48, 31] },
    { id: "sram-rival-gravel", model: "SRAM Rival eTap AXS", variant: "43/30T", weight: 715, bikeType: "gravel", teeth: [43, 30] },
    { id: "shimano-grx-1x-40", model: "Shimano GRX RX600", variant: "40T", weight: 580, bikeType: "gravel", teeth: [40] },
    { id: "shimano-grx-1x-42", model: "Shimano GRX RX600", variant: "42T", weight: 590, bikeType: "gravel", teeth: [42] },
    { id: "shimano-grx-1x-44", model: "Shimano GRX RX600", variant: "44T", weight: 600, bikeType: "gravel", teeth: [44] },
    { id: "sram-gx-gravel-46", model: "SRAM GX Eagle", variant: "46T", weight: 650, bikeType: "gravel", teeth: [46] },
    { id: "sram-gx-gravel-48", model: "SRAM GX Eagle", variant: "48T", weight: 660, bikeType: "gravel", teeth: [48] },

    // MTB CRANKSETS
    { id: "sram-nx-eagle", model: "SRAM NX Eagle", variant: "32T", weight: 750, bikeType: "mtb", teeth: [32] },
    { id: "sram-gx-eagle", model: "SRAM GX Eagle", variant: "32T", weight: 680, bikeType: "mtb", teeth: [32] },
    { id: "sram-x01-eagle", model: "SRAM X01 Eagle", variant: "32T", weight: 590, bikeType: "mtb", teeth: [32] },
    { id: "shimano-xt-m8100", model: "Shimano XT M8100", variant: "32T", weight: 690, bikeType: "mtb", teeth: [32] },
    { id: "shimano-xtr-m9100", model: "Shimano XTR M9100", variant: "30T", weight: 590, bikeType: "mtb", teeth: [30] },
    { id: "sram-gx-30t", model: "SRAM GX Eagle", variant: "30T", weight: 670, bikeType: "mtb", teeth: [30] },
    { id: "sram-gx-34t", model: "SRAM GX Eagle", variant: "34T", weight: 690, bikeType: "mtb", teeth: [34] },
  ],

  cassettes: [
    // ROAD CASSETTES
    { id: "shimano-105-r7000-11-28", model: "Shimano 105 R7000", variant: "11-28T", weight: 280, bikeType: "road", teeth: [11, 28] },
    { id: "shimano-105-r7000-11-30", model: "Shimano 105 R7000", variant: "11-30T", weight: 295, bikeType: "road", teeth: [11, 30] },
    { id: "shimano-105-r7000-11-32", model: "Shimano 105 R7000", variant: "11-32T", weight: 310, bikeType: "road", teeth: [11, 32] },
    { id: "shimano-ultegra-r8000-11-28", model: "Shimano Ultegra R8000", variant: "11-28T", weight: 250, bikeType: "road", teeth: [11, 28] },
    { id: "shimano-ultegra-r8000-11-30", model: "Shimano Ultegra R8000", variant: "11-30T", weight: 265, bikeType: "road", teeth: [11, 30] },
    { id: "shimano-dura-ace-r9100-11-28", model: "Shimano Dura-Ace R9100", variant: "11-28T", weight: 195, bikeType: "road", teeth: [11, 28] },
    { id: "sram-rival-xg1251-10-36", model: "SRAM Rival XG-1251", variant: "10-36T", weight: 265, bikeType: "road", teeth: [10, 36] },

    // GRAVEL CASSETTES
    { id: "shimano-grx-rx600-11-34", model: "Shimano GRX RX600", variant: "11-34T", weight: 350, bikeType: "gravel", teeth: [11, 34] },
    { id: "shimano-grx-rx600-11-42", model: "Shimano GRX RX600", variant: "11-42T", weight: 390, bikeType: "gravel", teeth: [11, 42] },
    { id: "shimano-grx-rx810-11-40", model: "Shimano GRX RX810", variant: "11-40T", weight: 370, bikeType: "gravel", teeth: [11, 40] },
    { id: "sram-rival-xg1251-10-36-gravel", model: "SRAM Rival XG-1251", variant: "10-36T", weight: 265, bikeType: "gravel", teeth: [10, 36] },
    { id: "sram-rival-xg1271-10-44", model: "SRAM Rival XG-1271", variant: "10-44T", weight: 345, bikeType: "gravel", teeth: [10, 44] },
    // MTB CROSSOVER CASSETTES FOR GRAVEL
    { id: "shimano-xt-m8100-10-51-gravel", model: "Shimano XT M8100", variant: "10-51T", weight: 470, bikeType: "gravel", teeth: [10, 51] },
    { id: "sram-gx-eagle-10-50-gravel", model: "SRAM GX Eagle XG-1275", variant: "10-50T", weight: 430, bikeType: "gravel", teeth: [10, 50] },
    { id: "sram-gx-eagle-10-52-gravel", model: "SRAM GX Eagle XG-1275", variant: "10-52T", weight: 440, bikeType: "gravel", teeth: [10, 52] },

    // MTB CASSETTES
    { id: "sram-nx-eagle-10-50", model: "SRAM NX Eagle XG-1230", variant: "11-50T", weight: 615, bikeType: "mtb", teeth: [11, 50] },
    { id: "sram-gx-eagle-10-52", model: "SRAM GX Eagle XG-1275", variant: "10-52T", weight: 440, bikeType: "mtb", teeth: [10, 52] },
    { id: "sram-x01-eagle-10-52", model: "SRAM X01 Eagle XG-1295", variant: "10-52T", weight: 350, bikeType: "mtb", teeth: [10, 52] },
    { id: "shimano-xt-m8100-10-51", model: "Shimano XT M8100", variant: "10-51T", weight: 470, bikeType: "mtb", teeth: [10, 51] },
    { id: "shimano-xtr-m9100-10-51", model: "Shimano XTR M9100", variant: "10-51T", weight: 390, bikeType: "mtb", teeth: [10, 51] },
    { id: "sram-gx-eagle-10-50", model: "SRAM GX Eagle XG-1275", variant: "10-50T", weight: 430, bikeType: "mtb", teeth: [10, 50] },
    { id: "shimano-slx-m7100-10-51", model: "Shimano SLX M7100", variant: "10-51T", weight: 534, bikeType: "mtb", teeth: [10, 51] },
  ]
};

export const getComponentsForBikeType = (bikeType) => {
  return {
    cranksets: componentDatabase.cranksets.filter(c => c.bikeType === bikeType),
    cassettes: componentDatabase.cassettes.filter(c => c.bikeType === bikeType),
  };
};