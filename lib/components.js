export const bikeConfig = {
  road: {
    name: "Road Bike",
    description: "Optimized for speed and efficiency on paved roads",
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
    name: "Gravel Bike",
    description: "Versatile design for mixed terrain and adventure riding",
    wheelSizes: ["700c", "650b"],
    tireWidths: [32, 35, 38, 40, 42, 45, 47, 50, 2.0, 2.1, 2.2, 2.25, 2.35],
    defaultSetup: { 
      wheel: "700c", 
      tire: "40", 
      crankset: "shimano-grx-rx600", 
      cassette: "shimano-grx-rx600-11-42" 
    },
  },
  mtb: {
    name: "Mountain Bike",
    description: "Built for off-road trails and technical terrain",
    wheelSizes: ["26-inch", "27.5-inch", "29-inch"],
    tireWidths: [2.1, 2.25, 2.35, 2.4, 2.5, 2.6],
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
    // ================================
    // SHIMANO ROAD CRANKSETS
    // ================================

    // Claris (8-Speed)
    { id: "shimano-claris-r2000-50-34", model: "Shimano Claris R2000", variant: "50/34T", weight: 900, bikeType: "road", teeth: [50, 34], speeds: "8-speed" },
    { id: "shimano-claris-r2000-52-36", model: "Shimano Claris R2000", variant: "52/36T", weight: 920, bikeType: "road", teeth: [52, 36], speeds: "8-speed" },
    { id: "shimano-claris-r2000-50-39-30", model: "Shimano Claris R2000", variant: "50/39/30T", weight: 950, bikeType: "road", teeth: [50, 39, 30], speeds: "8-speed" },

    // Sora (9-Speed)
    { id: "shimano-sora-r3000-50-34", model: "Shimano Sora R3000", variant: "50/34T", weight: 850, bikeType: "road", teeth: [50, 34], speeds: "9-speed" },
    { id: "shimano-sora-r3000-52-36", model: "Shimano Sora R3000", variant: "52/36T", weight: 870, bikeType: "road", teeth: [52, 36], speeds: "9-speed" },
    { id: "shimano-sora-r3000-50-39-30", model: "Shimano Sora R3000", variant: "50/39/30T", weight: 900, bikeType: "road", teeth: [50, 39, 30], speeds: "9-speed" },

    // Tiagra (10-Speed)
    { id: "shimano-tiagra-r4700-50-34", model: "Shimano Tiagra R4700", variant: "50/34T", weight: 785, bikeType: "road", teeth: [50, 34], speeds: "10-speed" },
    { id: "shimano-tiagra-r4700-52-36", model: "Shimano Tiagra R4700", variant: "52/36T", weight: 795, bikeType: "road", teeth: [52, 36], speeds: "10-speed" },
    { id: "shimano-tiagra-r4700-48-34", model: "Shimano Tiagra R4700", variant: "48/34T", weight: 780, bikeType: "road", teeth: [48, 34], speeds: "10-speed" },

    // 105 R7000 (11-Speed)
    { id: "shimano-105-r7000-11-25", model: "Shimano 105 R7000", variant: "50/34T", weight: 760, bikeType: "road", teeth: [50, 34], speeds: "11-speed" },
    { id: "shimano-105-r7000", model: "Shimano 105 R7000", variant: "50/34T", weight: 760, bikeType: "road", teeth: [50, 34], speeds: "11-speed" },
    { id: "shimano-105-compact", model: "Shimano 105 R7000", variant: "52/36T", weight: 780, bikeType: "road", teeth: [52, 36], speeds: "11-speed" },
    { id: "shimano-105-r7000-53-39", model: "Shimano 105 R7000", variant: "53/39T", weight: 790, bikeType: "road", teeth: [53, 39], speeds: "11-speed" },

    // 105 R7100 (12-Speed)
    { id: "shimano-105-r7100-50-34", model: "Shimano 105 R7100", variant: "50/34T", weight: 750, bikeType: "road", teeth: [50, 34], speeds: "12-speed" },
    { id: "shimano-105-r7100-52-36", model: "Shimano 105 R7100", variant: "52/36T", weight: 760, bikeType: "road", teeth: [52, 36], speeds: "12-speed" },

    // Ultegra R8000 (11-Speed)
    { id: "shimano-ultegra-r8000", model: "Shimano Ultegra R8000", variant: "50/34T", weight: 680, bikeType: "road", teeth: [50, 34], speeds: "11-speed" },
    { id: "shimano-ultegra-compact", model: "Shimano Ultegra R8000", variant: "52/36T", weight: 700, bikeType: "road", teeth: [52, 36], speeds: "11-speed" },
    { id: "shimano-ultegra-r8000-53-39", model: "Shimano Ultegra R8000", variant: "53/39T", weight: 710, bikeType: "road", teeth: [53, 39], speeds: "11-speed" },
    { id: "shimano-ultegra-r8000-54-42", model: "Shimano Ultegra R8000", variant: "54/42T", weight: 710, bikeType: "road", teeth: [54, 42], speeds: "11-speed" },
    { id: "shimano-ultegra-r8000-55-42", model: "Shimano Ultegra R8000", variant: "55/42T", weight: 715, bikeType: "road", teeth: [55, 42], speeds: "11-speed" },

    // Ultegra R8100 (12-Speed)
    { id: "shimano-ultegra-r8100-50-34", model: "Shimano Ultegra R8100", variant: "50/34T", weight: 716, bikeType: "road", teeth: [50, 34], speeds: "12-speed" },
    { id: "shimano-ultegra-r8100-52-36", model: "Shimano Ultegra R8100", variant: "52/36T", weight: 700, bikeType: "road", teeth: [52, 36], speeds: "12-speed" },
    { id: "shimano-ultegra-r8100-54-40", model: "Shimano Ultegra R8100", variant: "54/40T", weight: 720, bikeType: "road", teeth: [54, 40], speeds: "12-speed" },

    // Dura-Ace R9100 (11-Speed)
    { id: "shimano-dura-ace-r9100", model: "Shimano Dura-Ace R9100", variant: "50/34T", weight: 590, bikeType: "road", teeth: [50, 34], speeds: "11-speed" },
    { id: "shimano-dura-ace-r9100-52-36", model: "Shimano Dura-Ace R9100", variant: "52/36T", weight: 600, bikeType: "road", teeth: [52, 36], speeds: "11-speed" },
    { id: "shimano-dura-ace-r9100-53-39", model: "Shimano Dura-Ace R9100", variant: "53/39T", weight: 610, bikeType: "road", teeth: [53, 39], speeds: "11-speed" },

    // Dura-Ace R9200 (12-Speed)
    { id: "shimano-dura-ace-r9200-50-34", model: "Shimano Dura-Ace R9200", variant: "50/34T", weight: 690, bikeType: "road", teeth: [50, 34], speeds: "12-speed" },
    { id: "shimano-dura-ace-r9200-52-36", model: "Shimano Dura-Ace R9200", variant: "52/36T", weight: 700, bikeType: "road", teeth: [52, 36], speeds: "12-speed" },
    { id: "shimano-dura-ace-r9200-54-40", model: "Shimano Dura-Ace R9200", variant: "54/40T", weight: 720, bikeType: "road", teeth: [54, 40], speeds: "12-speed" },

    // ================================
    // SHIMANO GRAVEL CRANKSETS
    // ================================

    // GRX RX400 (10-Speed)
    { id: "shimano-grx-rx400-46-30", model: "Shimano GRX RX400", variant: "46/30T", weight: 819, bikeType: "gravel", teeth: [46, 30], speeds: "10-speed" },

    // GRX RX600 (11-Speed)
    { id: "shimano-grx-rx600", model: "Shimano GRX RX600", variant: "46/30T", weight: 720, bikeType: "gravel", teeth: [46, 30], speeds: "11-speed" },
    { id: "shimano-grx-1x-40", model: "Shimano GRX RX600 1x", variant: "40T", weight: 580, bikeType: "gravel", teeth: [40], speeds: "11-speed" },
    { id: "shimano-grx-1x-42", model: "Shimano GRX RX600 1x", variant: "42T", weight: 590, bikeType: "gravel", teeth: [42], speeds: "11-speed" },
    { id: "shimano-grx-1x-44", model: "Shimano GRX RX600 1x", variant: "44T", weight: 600, bikeType: "gravel", teeth: [44], speeds: "11-speed" },

    // GRX RX810 (11-Speed)
    { id: "shimano-grx-rx810", model: "Shimano GRX RX810", variant: "48/31T", weight: 680, bikeType: "gravel", teeth: [48, 31], speeds: "11-speed" },
    { id: "shimano-grx-rx810-1x-40", model: "Shimano GRX RX810 1x", variant: "40T", weight: 655, bikeType: "gravel", teeth: [40], speeds: "11-speed" },
    { id: "shimano-grx-rx810-1x-42", model: "Shimano GRX RX810 1x", variant: "42T", weight: 665, bikeType: "gravel", teeth: [42], speeds: "11-speed" },

    // GRX Di2 (Electronic)
    { id: "shimano-grx-rx815-di2-48-31", model: "Shimano GRX RX815 Di2", variant: "48/31T", weight: 710, bikeType: "gravel", teeth: [48, 31], speeds: "11-speed" },
    { id: "shimano-grx-rx815-di2-1x-40", model: "Shimano GRX RX815 Di2 1x", variant: "40T", weight: 556, bikeType: "gravel", teeth: [40], speeds: "11-speed" },
    { id: "shimano-grx-rx815-di2-1x-42", model: "Shimano GRX RX815 Di2 1x", variant: "42T", weight: 556, bikeType: "gravel", teeth: [42], speeds: "11-speed" },

    // GRX RX820 Di2 (12-Speed)
    { id: "shimano-grx-rx820-di2-50-34", model: "Shimano GRX RX820 Di2", variant: "50/34T", weight: 716, bikeType: "gravel", teeth: [50, 34], speeds: "12-speed" },
    { id: "shimano-grx-rx820-di2-48-31", model: "Shimano GRX RX820 Di2", variant: "48/31T", weight: 710, bikeType: "gravel", teeth: [48, 31], speeds: "12-speed" },

    // ================================
    // SHIMANO MTB CRANKSETS
    // ================================

    // CUES U4000 (9-speed)
    { id: "shimano-cues-u4000-32", model: "Shimano CUES U4000", variant: "32T", weight: 720, bikeType: "mtb", teeth: [32], speeds: "9-speed" },
    { id: "shimano-cues-u4000-34", model: "Shimano CUES U4000", variant: "34T", weight: 720, bikeType: "mtb", teeth: [34], speeds: "9-speed" },

    // CUES U6000 (10/11-speed)
    { id: "shimano-cues-u6000-30", model: "Shimano CUES U6000", variant: "30T", weight: 680, bikeType: "mtb", teeth: [30], speeds: "10/11-speed" },
    { id: "shimano-cues-u6000-32", model: "Shimano CUES U6000", variant: "32T", weight: 680, bikeType: "mtb", teeth: [32], speeds: "10/11-speed" },
    { id: "shimano-cues-u6000-34", model: "Shimano CUES U6000", variant: "34T", weight: 680, bikeType: "mtb", teeth: [34], speeds: "10/11-speed" },

    // CUES U8000 (11-speed)
    { id: "shimano-cues-u8000-32", model: "Shimano CUES U8000", variant: "32T", weight: 650, bikeType: "mtb", teeth: [32], speeds: "11-speed" },
    { id: "shimano-cues-u8000-34", model: "Shimano CUES U8000", variant: "34T", weight: 650, bikeType: "mtb", teeth: [34], speeds: "11-speed" },

    // Deore (11-Speed)
    { id: "shimano-deore-m5100-30", model: "Shimano Deore M5100", variant: "30T", weight: 685, bikeType: "mtb", teeth: [30], speeds: "11-speed" },
    { id: "shimano-deore-m5100-32", model: "Shimano Deore M5100", variant: "32T", weight: 685, bikeType: "mtb", teeth: [32], speeds: "11-speed" },

    // Deore (12-Speed)
    { id: "shimano-deore-m6100-30", model: "Shimano Deore M6100", variant: "30T", weight: 685, bikeType: "mtb", teeth: [30], speeds: "12-speed" },
    { id: "shimano-deore-m6100-32", model: "Shimano Deore M6100", variant: "32T", weight: 685, bikeType: "mtb", teeth: [32], speeds: "12-speed" },

    // SLX (11-Speed)
    { id: "shimano-slx-m7000-30", model: "Shimano SLX M7000", variant: "30T", weight: 522, bikeType: "mtb", teeth: [30], speeds: "11-speed" },
    { id: "shimano-slx-m7000-32", model: "Shimano SLX M7000", variant: "32T", weight: 522, bikeType: "mtb", teeth: [32], speeds: "11-speed" },

    // SLX (12-Speed)
    { id: "shimano-slx-m7100", model: "Shimano SLX M7100", variant: "32T", weight: 522, bikeType: "mtb", teeth: [32], speeds: "12-speed" },
    { id: "shimano-slx-m7100-30", model: "Shimano SLX M7100", variant: "30T", weight: 522, bikeType: "mtb", teeth: [30], speeds: "12-speed" },
    { id: "shimano-slx-m7100-34", model: "Shimano SLX M7100", variant: "34T", weight: 522, bikeType: "mtb", teeth: [34], speeds: "12-speed" },

    // XT (11-Speed)
    { id: "shimano-xt-m8000-30", model: "Shimano XT M8000", variant: "30T", weight: 690, bikeType: "mtb", teeth: [30], speeds: "11-speed" },
    { id: "shimano-xt-m8000-32", model: "Shimano XT M8000", variant: "32T", weight: 690, bikeType: "mtb", teeth: [32], speeds: "11-speed" },
    { id: "shimano-xt-m8000-34", model: "Shimano XT M8000", variant: "34T", weight: 690, bikeType: "mtb", teeth: [34], speeds: "11-speed" },

    // XT (12-Speed)
    { id: "shimano-xt-m8100-28", model: "Shimano XT M8100", variant: "28T", weight: 690, bikeType: "mtb", teeth: [28], speeds: "12-speed" },
    { id: "shimano-xt-m8100-30", model: "Shimano XT M8100", variant: "30T", weight: 690, bikeType: "mtb", teeth: [30], speeds: "12-speed" },
    { id: "shimano-xt-m8100", model: "Shimano XT M8100", variant: "32T", weight: 690, bikeType: "mtb", teeth: [32], speeds: "12-speed" },
    { id: "shimano-xt-m8100-34", model: "Shimano XT M8100", variant: "34T", weight: 690, bikeType: "mtb", teeth: [34], speeds: "12-speed" },
    { id: "shimano-xt-m8100-36", model: "Shimano XT M8100", variant: "36T", weight: 690, bikeType: "mtb", teeth: [36], speeds: "12-speed" },
    { id: "shimano-xt-m8100-38", model: "Shimano XT M8100", variant: "38T", weight: 690, bikeType: "mtb", teeth: [38], speeds: "12-speed" },

    // XTR M9100 (12-Speed)
    { id: "shimano-xtr-m9100", model: "Shimano XTR M9100", variant: "30T", weight: 590, bikeType: "mtb", teeth: [30], speeds: "12-speed" },
    { id: "shimano-xtr-m9100-32", model: "Shimano XTR M9100", variant: "32T", weight: 590, bikeType: "mtb", teeth: [32], speeds: "12-speed" },
    { id: "shimano-xtr-m9100-34", model: "Shimano XTR M9100", variant: "34T", weight: 590, bikeType: "mtb", teeth: [34], speeds: "12-speed" },
    { id: "shimano-xtr-m9100-36", model: "Shimano XTR M9100", variant: "36T", weight: 590, bikeType: "mtb", teeth: [36], speeds: "12-speed" },
    { id: "shimano-xtr-m9100-38", model: "Shimano XTR M9100", variant: "38T", weight: 590, bikeType: "mtb", teeth: [38], speeds: "12-speed" },

    // XTR M9200 Di2 (12-Speed Wireless)
    { id: "shimano-xtr-m9200-28", model: "Shimano XTR M9200 XC", variant: "28T", weight: 490, bikeType: "mtb", teeth: [28], speeds: "12-speed" },
    { id: "shimano-xtr-m9200-30", model: "Shimano XTR M9200 XC", variant: "30T", weight: 490, bikeType: "mtb", teeth: [30], speeds: "12-speed" },
    { id: "shimano-xtr-m9200-32", model: "Shimano XTR M9200 XC", variant: "32T", weight: 490, bikeType: "mtb", teeth: [32], speeds: "12-speed" },
    { id: "shimano-xtr-m9200-34", model: "Shimano XTR M9200 XC", variant: "34T", weight: 490, bikeType: "mtb", teeth: [34], speeds: "12-speed" },
    { id: "shimano-xtr-m9200-36", model: "Shimano XTR M9200 XC", variant: "36T", weight: 490, bikeType: "mtb", teeth: [36], speeds: "12-speed" },
    { id: "shimano-xtr-m9200-38", model: "Shimano XTR M9200 XC", variant: "38T", weight: 490, bikeType: "mtb", teeth: [38], speeds: "12-speed" },
    { id: "shimano-xtr-m9220-30", model: "Shimano XTR M9220 Trail", variant: "30T", weight: 530, bikeType: "mtb", teeth: [30], speeds: "12-speed" },
    { id: "shimano-xtr-m9220-32", model: "Shimano XTR M9220 Trail", variant: "32T", weight: 530, bikeType: "mtb", teeth: [32], speeds: "12-speed" },
    { id: "shimano-xtr-m9220-34", model: "Shimano XTR M9220 Trail", variant: "34T", weight: 530, bikeType: "mtb", teeth: [34], speeds: "12-speed" },
    { id: "shimano-xtr-m9220-36", model: "Shimano XTR M9220 Trail", variant: "36T", weight: 530, bikeType: "mtb", teeth: [36], speeds: "12-speed" },
    
    // E-BIKE SPECIFIC
    { id: "shimano-steps-em600", model: "Shimano STEPS FC-EM600", variant: "E-MTB", weight: 580, bikeType: "mtb", teeth: [0], speeds: "e-bike" },
    { id: "shimano-steps-em800", model: "Shimano STEPS FC-EM800", variant: "E-MTB", weight: 556, bikeType: "mtb", teeth: [0], speeds: "e-bike" },
    { id: "shimano-steps-em900", model: "Shimano STEPS FC-EM900", variant: "E-MTB", weight: 540, bikeType: "mtb", teeth: [0], speeds: "e-bike" },

    // ================================
    // SRAM ROAD CRANKSETS
    // ================================

    // Apex (10-Speed)
    { id: "sram-apex-50-34", model: "SRAM Apex", variant: "50/34T", weight: 850, bikeType: "road", teeth: [50, 34], speeds: "10-speed" },
    { id: "sram-apex-52-36", model: "SRAM Apex", variant: "52/36T", weight: 860, bikeType: "road", teeth: [52, 36], speeds: "10-speed" },

    // Rival 22 (11-Speed)
    { id: "sram-rival-22-50-34", model: "SRAM Rival 22", variant: "50/34T", weight: 800, bikeType: "road", teeth: [50, 34], speeds: "11-speed" },
    { id: "sram-rival-22-52-36", model: "SRAM Rival 22", variant: "52/36T", weight: 810, bikeType: "road", teeth: [52, 36], speeds: "11-speed" },

    // Force 22 (11-Speed)
    { id: "sram-force-22-50-34", model: "SRAM Force 22", variant: "50/34T", weight: 720, bikeType: "road", teeth: [50, 34], speeds: "11-speed" },
    { id: "sram-force-22-52-36", model: "SRAM Force 22", variant: "52/36T", weight: 730, bikeType: "road", teeth: [52, 36], speeds: "11-speed" },
    { id: "sram-force-22-53-39", model: "SRAM Force 22", variant: "53/39T", weight: 740, bikeType: "road", teeth: [53, 39], speeds: "11-speed" },
    
    // Rival AXS (12-Speed)
    { id: "sram-rival-axs", model: "SRAM Rival eTap AXS", variant: "46/33T", weight: 710, bikeType: "road", teeth: [46, 33], speeds: "12-speed" },
    { id: "sram-rival-axs-48-35", model: "SRAM Rival eTap AXS", variant: "48/35T", weight: 720, bikeType: "road", teeth: [48, 35], speeds: "12-speed" },
    { id: "sram-rival-axs-1x-38", model: "SRAM Rival eTap AXS 1x", variant: "38T", weight: 673, bikeType: "road", teeth: [38], speeds: "12-speed" },
    { id: "sram-rival-axs-1x-40", model: "SRAM Rival eTap AXS 1x", variant: "40T", weight: 673, bikeType: "road", teeth: [40], speeds: "12-speed" },
    { id: "sram-rival-axs-1x-42", model: "SRAM Rival eTap AXS 1x", variant: "42T", weight: 673, bikeType: "road", teeth: [42], speeds: "12-speed" },
    { id: "sram-rival-axs-1x-44", model: "SRAM Rival eTap AXS 1x", variant: "44T", weight: 673, bikeType: "road", teeth: [44], speeds: "12-speed" },
    { id: "sram-rival-axs-1x-46", model: "SRAM Rival eTap AXS 1x", variant: "46T", weight: 673, bikeType: "road", teeth: [46], speeds: "12-speed" },

    // Force AXS (12-Speed)
    { id: "sram-force-axs-48-35", model: "SRAM Force eTap AXS", variant: "48/35T", weight: 750, bikeType: "road", teeth: [48, 35], speeds: "12-speed" },
    { id: "sram-force-axs-50-37", model: "SRAM Force eTap AXS", variant: "50/37T", weight: 760, bikeType: "road", teeth: [50, 37], speeds: "12-speed" },
    { id: "sram-force-axs-46-33", model: "SRAM Force eTap AXS", variant: "46/33T", weight: 750, bikeType: "road", teeth: [46, 33], speeds: "12-speed" },

    // Red AXS (12-Speed)
    { id: "sram-red-axs-48-35", model: "SRAM Red eTap AXS", variant: "48/35T", weight: 650, bikeType: "road", teeth: [48, 35], speeds: "12-speed" },
    { id: "sram-red-axs-50-37", model: "SRAM Red eTap AXS", variant: "50/37T", weight: 650, bikeType: "road", teeth: [50, 37], speeds: "12-speed" },
    { id: "sram-red-axs-54-41", model: "SRAM Red eTap AXS", variant: "54/41T", weight: 650, bikeType: "road", teeth: [54, 41], speeds: "12-speed" },

    // SRAM RED AXS 2024
    { id: "sram-red-axs-2024-46-33", model: "SRAM Red AXS 2024", variant: "46/33T", weight: 545, bikeType: "road", teeth: [46, 33], speeds: "12-speed" },
    { id: "sram-red-axs-2024-48-35", model: "SRAM Red AXS 2024", variant: "48/35T", weight: 545, bikeType: "road", teeth: [48, 35], speeds: "12-speed" },
    { id: "sram-red-axs-2024-50-37", model: "SRAM Red AXS 2024", variant: "50/37T", weight: 545, bikeType: "road", teeth: [50, 37], speeds: "12-speed" },
    { id: "sram-red-axs-2024-1x-44", model: "SRAM Red AXS 2024 1x", variant: "44T", weight: 480, bikeType: "road", teeth: [44], speeds: "12-speed" },
    { id: "sram-red-axs-2024-1x-46", model: "SRAM Red AXS 2024 1x", variant: "46T", weight: 480, bikeType: "road", teeth: [46], speeds: "12-speed" },
    { id: "sram-red-axs-2024-1x-48", model: "SRAM Red AXS 2024 1x", variant: "48T", weight: 480, bikeType: "road", teeth: [48], speeds: "12-speed" },
    { id: "sram-red-axs-2024-1x-50", model: "SRAM Red AXS 2024 1x", variant: "50T", weight: 480, bikeType: "road", teeth: [50], speeds: "12-speed" },

    // ================================
    // SRAM GRAVEL CRANKSETS
    // ================================

    // Apex (11-Speed)
    { id: "sram-apex-gravel-40", model: "SRAM Apex 1x", variant: "40T", weight: 762, bikeType: "gravel", teeth: [40], speeds: "11-speed" },
    { id: "sram-apex-gravel-42", model: "SRAM Apex 1x", variant: "42T", weight: 762, bikeType: "gravel", teeth: [42], speeds: "11-speed" },
    
    // SRAM Apex XPLR
    { id: "sram-apex-xplr-1x-36", model: "SRAM Apex XPLR 1x", variant: "36T", weight: 719, bikeType: "gravel", teeth: [36], speeds: "12-speed" },
    { id: "sram-apex-xplr-1x-38", model: "SRAM Apex XPLR 1x", variant: "38T", weight: 719, bikeType: "gravel", teeth: [38], speeds: "12-speed" },
    { id: "sram-apex-xplr-1x-40", model: "SRAM Apex XPLR 1x", variant: "40T", weight: 719, bikeType: "gravel", teeth: [40], speeds: "12-speed" },
    { id: "sram-apex-xplr-1x-42", model: "SRAM Apex XPLR 1x", variant: "42T", weight: 719, bikeType: "gravel", teeth: [42], speeds: "12-speed" },
    { id: "sram-apex-xplr-1x-44", model: "SRAM Apex XPLR 1x", variant: "44T", weight: 719, bikeType: "gravel", teeth: [44], speeds: "12-speed" },

    // Rival XPLR AXS (12-Speed)
    { id: "sram-rival-gravel", model: "SRAM Rival XPLR AXS", variant: "43/30T", weight: 715, bikeType: "gravel", teeth: [43, 30], speeds: "12-speed" },
    { id: "sram-rival-xplr-38", model: "SRAM Rival XPLR AXS 1x", variant: "38T", weight: 719, bikeType: "gravel", teeth: [38], speeds: "12-speed" },
    { id: "sram-rival-xplr-40", model: "SRAM Rival XPLR AXS 1x", variant: "40T", weight: 719, bikeType: "gravel", teeth: [40], speeds: "12-speed" },
    { id: "sram-rival-xplr-42", model: "SRAM Rival XPLR AXS 1x", variant: "42T", weight: 719, bikeType: "gravel", teeth: [42], speeds: "12-speed" },
    { id: "sram-rival-xplr-44", model: "SRAM Rival XPLR AXS 1x", variant: "44T", weight: 719, bikeType: "gravel", teeth: [44], speeds: "12-speed" },
    { id: "sram-rival-xplr-46", model: "SRAM Rival XPLR AXS 1x", variant: "46T", weight: 719, bikeType: "gravel", teeth: [46], speeds: "12-speed" },

    // Force XPLR AXS (12-Speed)
    { id: "sram-force-xplr-1x-36", model: "SRAM Force XPLR AXS 1x", variant: "36T", weight: 650, bikeType: "gravel", teeth: [36], speeds: "12-speed" },
    { id: "sram-force-xplr-1x-38", model: "SRAM Force XPLR AXS 1x", variant: "38T", weight: 650, bikeType: "gravel", teeth: [38], speeds: "12-speed" },
    { id: "sram-force-xplr-40", model: "SRAM Force XPLR AXS 1x", variant: "40T", weight: 750, bikeType: "gravel", teeth: [40], speeds: "12-speed" },
    { id: "sram-force-xplr-42", model: "SRAM Force XPLR AXS 1x", variant: "42T", weight: 750, bikeType: "gravel", teeth: [42], speeds: "12-speed" },
    { id: "sram-force-xplr-1x-44", model: "SRAM Force XPLR AXS 1x", variant: "44T", weight: 650, bikeType: "gravel", teeth: [44], speeds: "12-speed" },
    { id: "sram-force-xplr-1x-46", model: "SRAM Force XPLR AXS 1x", variant: "46T", weight: 650, bikeType: "gravel", teeth: [46], speeds: "12-speed" },
    { id: "sram-force-xplr-1x-48", model: "SRAM Force XPLR AXS 1x", variant: "48T", weight: 650, bikeType: "gravel", teeth: [48], speeds: "12-speed" },
    { id: "sram-force-xplr-1x-50", model: "SRAM Force XPLR AXS 1x", variant: "50T", weight: 650, bikeType: "gravel", teeth: [50], speeds: "12-speed" },

    // Force XPLR 2025 (13-Speed)
    { id: "sram-force-xplr-13-1x-38", model: "SRAM Force XPLR AXS 1x", variant: "38T", weight: 650, bikeType: "gravel", teeth: [38], speeds: "13-speed" },
    { id: "sram-force-xplr-13-1x-40", model: "SRAM Force XPLR AXS 1x", variant: "40T", weight: 650, bikeType: "gravel", teeth: [40], speeds: "13-speed" },
    { id: "sram-force-xplr-13-1x-42", model: "SRAM Force XPLR AXS 1x", variant: "42T", weight: 650, bikeType: "gravel", teeth: [42], speeds: "13-speed" },

    // Red XPLR AXS (13-Speed!)
    { id: "sram-red-xplr-38", model: "SRAM Red XPLR AXS 1x", variant: "38T", weight: 650, bikeType: "gravel", teeth: [38], speeds: "13-speed" },
    { id: "sram-red-xplr-40", model: "SRAM Red XPLR AXS 1x", variant: "40T", weight: 650, bikeType: "gravel", teeth: [40], speeds: "13-speed" },
    { id: "sram-red-xplr-42", model: "SRAM Red XPLR AXS 1x", variant: "42T", weight: 650, bikeType: "gravel", teeth: [42], speeds: "13-speed" },
    { id: "sram-red-xplr-44", model: "SRAM Red XPLR AXS 1x", variant: "44T", weight: 650, bikeType: "gravel", teeth: [44], speeds: "13-speed" },
    { id: "sram-red-xplr-46", model: "SRAM Red XPLR AXS 1x", variant: "46T", weight: 650, bikeType: "gravel", teeth: [46], speeds: "13-speed" },

    // Eagle Gravel Crossover
    { id: "sram-gx-gravel-46", model: "SRAM GX Eagle", variant: "46T", weight: 650, bikeType: "gravel", teeth: [46], speeds: "12-speed" },
    { id: "sram-gx-gravel-48", model: "SRAM GX Eagle", variant: "48T", weight: 660, bikeType: "gravel", teeth: [48], speeds: "12-speed" },

    // ================================
    // SRAM MTB CRANKSETS
    // ================================

    // SX Eagle (12-Speed)
    { id: "sram-sx-eagle-30", model: "SRAM SX Eagle", variant: "30T", weight: 750, bikeType: "mtb", teeth: [30], speeds: "12-speed" },
    { id: "sram-sx-eagle-32", model: "SRAM SX Eagle", variant: "32T", weight: 750, bikeType: "mtb", teeth: [32], speeds: "12-speed" },
    { id: "sram-sx-eagle-34", model: "SRAM SX Eagle", variant: "34T", weight: 750, bikeType: "mtb", teeth: [34], speeds: "12-speed" },

    // NX Eagle (12-Speed)
    { id: "sram-nx-eagle-30", model: "SRAM NX Eagle", variant: "30T", weight: 750, bikeType: "mtb", teeth: [30], speeds: "12-speed" },
    { id: "sram-nx-eagle", model: "SRAM NX Eagle", variant: "32T", weight: 750, bikeType: "mtb", teeth: [32], speeds: "12-speed" },
    { id: "sram-nx-eagle-34", model: "SRAM NX Eagle", variant: "34T", weight: 750, bikeType: "mtb", teeth: [34], speeds: "12-speed" },
    { id: "sram-nx-eagle-36", model: "SRAM NX Eagle", variant: "36T", weight: 750, bikeType: "mtb", teeth: [36], speeds: "12-speed" },
    { id: "sram-nx-eagle-38", model: "SRAM NX Eagle", variant: "38T", weight: 750, bikeType: "mtb", teeth: [38], speeds: "12-speed" },

    // GX Eagle (12-Speed)
    { id: "sram-gx-eagle-28", model: "SRAM GX Eagle", variant: "28T", weight: 680, bikeType: "mtb", teeth: [28], speeds: "12-speed" },
    { id: "sram-gx-30t", model: "SRAM GX Eagle", variant: "30T", weight: 670, bikeType: "mtb", teeth: [30], speeds: "12-speed" },
    { id: "sram-gx-eagle", model: "SRAM GX Eagle", variant: "32T", weight: 680, bikeType: "mtb", teeth: [32], speeds: "12-speed" },
    { id: "sram-gx-34t", model: "SRAM GX Eagle", variant: "34T", weight: 690, bikeType: "mtb", teeth: [34], speeds: "12-speed" },
    { id: "sram-gx-eagle-36", model: "SRAM GX Eagle", variant: "36T", weight: 700, bikeType: "mtb", teeth: [36], speeds: "12-speed" },
    { id: "sram-gx-eagle-38", model: "SRAM GX Eagle", variant: "38T", weight: 710, bikeType: "mtb", teeth: [38], speeds: "12-speed" },

    // X01 Eagle (12-Speed)
    { id: "sram-x01-eagle-30", model: "SRAM X01 Eagle", variant: "30T", weight: 590, bikeType: "mtb", teeth: [30], speeds: "12-speed" },
    { id: "sram-x01-eagle", model: "SRAM X01 Eagle", variant: "32T", weight: 590, bikeType: "mtb", teeth: [32], speeds: "12-speed" },
    { id: "sram-x01-eagle-34", model: "SRAM X01 Eagle", variant: "34T", weight: 590, bikeType: "mtb", teeth: [34], speeds: "12-speed" },
    { id: "sram-x01-eagle-36", model: "SRAM X01 Eagle", variant: "36T", weight: 590, bikeType: "mtb", teeth: [36], speeds: "12-speed" },
    { id: "sram-x01-eagle-38", model: "SRAM X01 Eagle", variant: "38T", weight: 590, bikeType: "mtb", teeth: [38], speeds: "12-speed" },

    // XX1 Eagle (12-Speed)
    { id: "sram-xx1-eagle-30", model: "SRAM XX1 Eagle", variant: "30T", weight: 424, bikeType: "mtb", teeth: [30], speeds: "12-speed" },
    { id: "sram-xx1-eagle-32", model: "SRAM XX1 Eagle", variant: "32T", weight: 424, bikeType: "mtb", teeth: [32], speeds: "12-speed" },
    { id: "sram-xx1-eagle-34", model: "SRAM XX1 Eagle", variant: "34T", weight: 424, bikeType: "mtb", teeth: [34], speeds: "12-speed" },
    { id: "sram-xx1-eagle-36", model: "SRAM XX1 Eagle", variant: "36T", weight: 424, bikeType: "mtb", teeth: [36], speeds: "12-speed" },
    { id: "sram-xx1-eagle-38", model: "SRAM XX1 Eagle", variant: "38T", weight: 424, bikeType: "mtb", teeth: [38], speeds: "12-speed" },

    // GX Eagle Transmission (T-Type)
    { id: "sram-gx-eagle-t-type-32", model: "SRAM GX Eagle T-Type", variant: "32T", weight: 716, bikeType: "mtb", teeth: [32], speeds: "12-speed" },
    { id: "sram-gx-eagle-t-type-34", model: "SRAM GX Eagle T-Type", variant: "34T", weight: 716, bikeType: "mtb", teeth: [34], speeds: "12-speed" },
    { id: "sram-gx-eagle-t-type-36", model: "SRAM GX Eagle T-Type", variant: "36T", weight: 716, bikeType: "mtb", teeth: [36], speeds: "12-speed" },

    // X0 Eagle Transmission (T-Type)
    { id: "sram-x0-eagle-t-type-32", model: "SRAM X0 Eagle T-Type", variant: "32T", weight: 595, bikeType: "mtb", teeth: [32], speeds: "12-speed" },
    { id: "sram-x0-eagle-t-type-34", model: "SRAM X0 Eagle T-Type", variant: "34T", weight: 595, bikeType: "mtb", teeth: [34], speeds: "12-speed" },
    { id: "sram-x0-eagle-t-type-36", model: "SRAM X0 Eagle T-Type", variant: "36T", weight: 595, bikeType: "mtb", teeth: [36], speeds: "12-speed" },

    // XX Eagle Transmission (T-Type)
    { id: "sram-xx-eagle-t-type-32", model: "SRAM XX Eagle T-Type", variant: "32T", weight: 493, bikeType: "mtb", teeth: [32], speeds: "12-speed" },
    { id: "sram-xx-eagle-t-type-34", model: "SRAM XX Eagle T-Type", variant: "34T", weight: 493, bikeType: "mtb", teeth: [34], speeds: "12-speed" },
    { id: "sram-xx-eagle-t-type-36", model: "SRAM XX Eagle T-Type", variant: "36T", weight: 493, bikeType: "mtb", teeth: [36], speeds: "12-speed" },

    // ================================
    // CAMPAGNOLO ROAD CRANKSETS
    // ================================

    // Chorus (12-Speed)
    { id: "campagnolo-chorus-50-34", model: "Campagnolo Chorus", variant: "50/34T", weight: 720, bikeType: "road", teeth: [50, 34], speeds: "12-speed" },
    { id: "campagnolo-chorus-52-36", model: "Campagnolo Chorus", variant: "52/36T", weight: 730, bikeType: "road", teeth: [52, 36], speeds: "12-speed" },
    { id: "campagnolo-chorus-48-32", model: "Campagnolo Chorus", variant: "48/32T", weight: 710, bikeType: "road", teeth: [48, 32], speeds: "12-speed" },

    // Record (12-Speed)
    { id: "campagnolo-record-50-34", model: "Campagnolo Record", variant: "50/34T", weight: 630, bikeType: "road", teeth: [50, 34], speeds: "12-speed" },
    { id: "campagnolo-record-52-36", model: "Campagnolo Record", variant: "52/36T", weight: 640, bikeType: "road", teeth: [52, 36], speeds: "12-speed" },
    { id: "campagnolo-record-53-39", model: "Campagnolo Record", variant: "53/39T", weight: 650, bikeType: "road", teeth: [53, 39], speeds: "12-speed" },

    // Super Record (12-Speed)
    { id: "campagnolo-super-record-50-34", model: "Campagnolo Super Record", variant: "50/34T", weight: 580, bikeType: "road", teeth: [50, 34], speeds: "12-speed" },
    { id: "campagnolo-super-record-52-36", model: "Campagnolo Super Record", variant: "52/36T", weight: 590, bikeType: "road", teeth: [52, 36], speeds: "12-speed" },
    { id: "campagnolo-super-record-53-39", model: "Campagnolo Super Record", variant: "53/39T", weight: 600, bikeType: "road", teeth: [53, 39], speeds: "12-speed" },

    // Super Record 13 (13-Speed Wireless)
    { id: "campagnolo-super-record-13-48-32", model: "Campagnolo Super Record 13", variant: "48/32T", weight: 615, bikeType: "road", teeth: [48, 32], speeds: "13-speed" },
    { id: "campagnolo-super-record-13-50-34", model: "Campagnolo Super Record 13", variant: "50/34T", weight: 620, bikeType: "road", teeth: [50, 34], speeds: "13-speed" },
    { id: "campagnolo-super-record-13-52-36", model: "Campagnolo Super Record 13", variant: "52/36T", weight: 625, bikeType: "road", teeth: [52, 36], speeds: "13-speed" },
    { id: "campagnolo-super-record-13-54-39", model: "Campagnolo Super Record 13", variant: "54/39T", weight: 630, bikeType: "road", teeth: [54, 39], speeds: "13-speed" },

    // ================================
    // CAMPAGNOLO GRAVEL CRANKSETS
    // ================================

    // Ekar (13-Speed)
    { id: "campagnolo-ekar-38", model: "Campagnolo Ekar", variant: "38T", weight: 615, bikeType: "gravel", teeth: [38], speeds: "13-speed" },
    { id: "campagnolo-ekar-40", model: "Campagnolo Ekar", variant: "40T", weight: 615, bikeType: "gravel", teeth: [40], speeds: "13-speed" },
    { id: "campagnolo-ekar-42", model: "Campagnolo Ekar", variant: "42T", weight: 615, bikeType: "gravel", teeth: [42], speeds: "13-speed" },
    { id: "campagnolo-ekar-44", model: "Campagnolo Ekar", variant: "44T", weight: 615, bikeType: "gravel", teeth: [44], speeds: "13-speed" },

    // Ekar GT (13-Speed)
    { id: "campagnolo-ekar-gt-36", model: "Campagnolo Ekar GT", variant: "36T", weight: 680, bikeType: "gravel", teeth: [36], speeds: "13-speed" },
    { id: "campagnolo-ekar-gt-38", model: "Campagnolo Ekar GT", variant: "38T", weight: 680, bikeType: "gravel", teeth: [38], speeds: "13-speed" },
    { id: "campagnolo-ekar-gt-40", model: "Campagnolo Ekar GT", variant: "40T", weight: 680, bikeType: "gravel", teeth: [40], speeds: "13-speed" },
    { id: "campagnolo-ekar-gt-42", model: "Campagnolo Ekar GT", variant: "42T", weight: 680, bikeType: "gravel", teeth: [42], speeds: "13-speed" },

    // ================================
    // FSA CRANKSETS
    // ================================

    // FSA Gossamer (Road)
    { id: "fsa-gossamer-50-34", model: "FSA Gossamer", variant: "50/34T", weight: 820, bikeType: "road", teeth: [50, 34], speeds: "road" },
    { id: "fsa-gossamer-52-36", model: "FSA Gossamer", variant: "52/36T", weight: 830, bikeType: "road", teeth: [52, 36], speeds: "road" },
    { id: "fsa-gossamer-46-30", model: "FSA Gossamer", variant: "46/30T", weight: 810, bikeType: "road", teeth: [46, 30], speeds: "road" },

    // FSA Energy (Road)
    { id: "fsa-energy-50-34", model: "FSA Energy", variant: "50/34T", weight: 750, bikeType: "road", teeth: [50, 34], speeds: "road" },
    { id: "fsa-energy-52-36", model: "FSA Energy", variant: "52/36T", weight: 760, bikeType: "road", teeth: [52, 36], speeds: "road" },
    { id: "fsa-energy-46-30", model: "FSA Energy", variant: "46/30T", weight: 740, bikeType: "road", teeth: [46, 30], speeds: "road" },

    // FSA SL-K (High-End Road)
    { id: "fsa-sl-k-50-34", model: "FSA SL-K", variant: "50/34T", weight: 650, bikeType: "road", teeth: [50, 34], speeds: "road" },
    { id: "fsa-sl-k-52-36", model: "FSA SL-K", variant: "52/36T", weight: 660, bikeType: "road", teeth: [52, 36], speeds: "road" },
    { id: "fsa-sl-k-53-39", model: "FSA SL-K", variant: "53/39T", weight: 670, bikeType: "road", teeth: [53, 39], speeds: "road" },

    // FSA K-Force WE (Electronic)
    { id: "fsa-k-force-we-50-34", model: "FSA K-Force WE", variant: "50/34T", weight: 626, bikeType: "road", teeth: [50, 34], speeds: "12-speed" },
    { id: "fsa-k-force-we-52-36", model: "FSA K-Force WE", variant: "52/36T", weight: 636, bikeType: "road", teeth: [52, 36], speeds: "12-speed" },
    { id: "fsa-k-force-we-54-40", model: "FSA K-Force WE", variant: "54/40T", weight: 646, bikeType: "road", teeth: [54, 40], speeds: "12-speed" },
    { id: "fsa-k-force-we-46-30", model: "FSA K-Force WE", variant: "46/30T", weight: 616, bikeType: "road", teeth: [46, 30], speeds: "12-speed" },

    // FSA Comet (Gravel)
    { id: "fsa-comet-46-30", model: "FSA Comet", variant: "46/30T", weight: 780, bikeType: "gravel", teeth: [46, 30], speeds: "gravel" },
    { id: "fsa-comet-1x-40", model: "FSA Comet 1x", variant: "40T", weight: 620, bikeType: "gravel", teeth: [40], speeds: "gravel" },
    { id: "fsa-comet-1x-42", model: "FSA Comet 1x", variant: "42T", weight: 630, bikeType: "gravel", teeth: [42], speeds: "gravel" },

    // FSA Gradient (Gravel)
    { id: "fsa-gradient-48-32", model: "FSA Gradient", variant: "48/32T", weight: 720, bikeType: "gravel", teeth: [48, 32], speeds: "gravel" },
    { id: "fsa-gradient-1x-38", model: "FSA Gradient 1x", variant: "38T", weight: 570, bikeType: "gravel", teeth: [38], speeds: "gravel" },
    { id: "fsa-gradient-1x-40", model: "FSA Gradient 1x", variant: "40T", weight: 580, bikeType: "gravel", teeth: [40], speeds: "gravel" },
    { id: "fsa-gradient-1x-42", model: "FSA Gradient 1x", variant: "42T", weight: 590, bikeType: "gravel", teeth: [42], speeds: "gravel" },

    // ================================
    // PRAXIS CRANKSETS
    // ================================

    // Praxis Alba (Road)
    { id: "praxis-alba-50-34", model: "Praxis Alba", variant: "50/34T", weight: 720, bikeType: "road", teeth: [50, 34], speeds: "road" },
    { id: "praxis-alba-52-36", model: "Praxis Alba", variant: "52/36T", weight: 730, bikeType: "road", teeth: [52, 36], speeds: "road" },
    { id: "praxis-alba-48-32", model: "Praxis Alba", variant: "48/32T", weight: 710, bikeType: "road", teeth: [48, 32], speeds: "road" },

    // Praxis Zayante Carbon (Road)
    { id: "praxis-zayante-50-34", model: "Praxis Zayante Carbon", variant: "50/34T", weight: 580, bikeType: "road", teeth: [50, 34], speeds: "road" },
    { id: "praxis-zayante-52-36", model: "Praxis Zayante Carbon", variant: "52/36T", weight: 590, bikeType: "road", teeth: [52, 36], speeds: "road" },
    { id: "praxis-zayante-48-32", model: "Praxis Zayante Carbon", variant: "48/32T", weight: 570, bikeType: "road", teeth: [48, 32], speeds: "road" },

    // Praxis Cadet (Gravel)
    { id: "praxis-cadet-48-32", model: "Praxis Cadet", variant: "48/32T", weight: 750, bikeType: "gravel", teeth: [48, 32], speeds: "gravel" },
    { id: "praxis-cadet-46-30", model: "Praxis Cadet", variant: "46/30T", weight: 740, bikeType: "gravel", teeth: [46, 30], speeds: "gravel" },
    { id: "praxis-cadet-1x-40", model: "Praxis Cadet 1x", variant: "40T", weight: 600, bikeType: "gravel", teeth: [40], speeds: "gravel" },
    { id: "praxis-cadet-1x-42", model: "Praxis Cadet 1x", variant: "42T", weight: 610, bikeType: "gravel", teeth: [42], speeds: "gravel" },

    // ================================
    // RACE FACE MTB CRANKSETS
    // ================================

    // Race Face Aeffect (MTB)
    { id: "race-face-aeffect-30", model: "Race Face Aeffect", variant: "30T", weight: 720, bikeType: "mtb", teeth: [30], speeds: "mtb" },
    { id: "race-face-aeffect-32", model: "Race Face Aeffect", variant: "32T", weight: 720, bikeType: "mtb", teeth: [32], speeds: "mtb" },
    { id: "race-face-aeffect-34", model: "Race Face Aeffect", variant: "34T", weight: 720, bikeType: "mtb", teeth: [34], speeds: "mtb" },

    // Race Face Aeffect R (MTB)
    { id: "race-face-aeffect-r-30", model: "Race Face Aeffect R", variant: "30T", weight: 590, bikeType: "mtb", teeth: [30], speeds: "mtb" },
    { id: "race-face-aeffect-r-32", model: "Race Face Aeffect R", variant: "32T", weight: 590, bikeType: "mtb", teeth: [32], speeds: "mtb" },
    { id: "race-face-aeffect-r-34", model: "Race Face Aeffect R", variant: "34T", weight: 590, bikeType: "mtb", teeth: [34], speeds: "mtb" },

    // Race Face Atlas (MTB)
    { id: "race-face-atlas-30", model: "Race Face Atlas", variant: "30T", weight: 680, bikeType: "mtb", teeth: [30], speeds: "mtb" },
    { id: "race-face-atlas-32", model: "Race Face Atlas", variant: "32T", weight: 680, bikeType: "mtb", teeth: [32], speeds: "mtb" },
    { id: "race-face-atlas-34", model: "Race Face Atlas", variant: "34T", weight: 680, bikeType: "mtb", teeth: [34], speeds: "mtb" },

    // Race Face Next SL (High-End MTB)
    { id: "race-face-next-sl-30", model: "Race Face Next SL", variant: "30T", weight: 520, bikeType: "mtb", teeth: [30], speeds: "mtb" },
    { id: "race-face-next-sl-32", model: "Race Face Next SL", variant: "32T", weight: 520, bikeType: "mtb", teeth: [32], speeds: "mtb" },
    { id: "race-face-next-sl-34", model: "Race Face Next SL", variant: "34T", weight: 520, bikeType: "mtb", teeth: [34], speeds: "mtb" },
    { id: "race-face-next-sl-36", model: "Race Face Next SL", variant: "36T", weight: 530, bikeType: "mtb", teeth: [36], speeds: "mtb" },

    // ================================
    // ROTOR CRANKSETS
    // ================================

    // Rotor Aldhu (Road)
    { id: "rotor-aldhu-50-34", model: "Rotor Aldhu", variant: "50/34T", weight: 650, bikeType: "road", teeth: [50, 34], speeds: "road" },
    { id: "rotor-aldhu-52-36", model: "Rotor Aldhu", variant: "52/36T", weight: 660, bikeType: "road", teeth: [52, 36], speeds: "road" },
    { id: "rotor-aldhu-53-39", model: "Rotor Aldhu", variant: "53/39T", weight: 670, bikeType: "road", teeth: [53, 39], speeds: "road" },

    // Rotor Vegast (Road)
    { id: "rotor-vegast-50-34", model: "Rotor Vegast", variant: "50/34T", weight: 580, bikeType: "road", teeth: [50, 34], speeds: "road" },
    { id: "rotor-vegast-52-36", model: "Rotor Vegast", variant: "52/36T", weight: 590, bikeType: "road", teeth: [52, 36], speeds: "road" },

    // Rotor Aldhu Gravel
    { id: "rotor-aldhu-gravel-46-30", model: "Rotor Aldhu Gravel", variant: "46/30T", weight: 680, bikeType: "gravel", teeth: [46, 30], speeds: "gravel" },
    { id: "rotor-aldhu-gravel-48-31", model: "Rotor Aldhu Gravel", variant: "48/31T", weight: 690, bikeType: "gravel", teeth: [48, 31], speeds: "gravel" },
    { id: "rotor-aldhu-gravel-1x-38", model: "Rotor Aldhu Gravel 1x", variant: "38T", weight: 540, bikeType: "gravel", teeth: [38], speeds: "gravel" },
    { id: "rotor-aldhu-gravel-1x-40", model: "Rotor Aldhu Gravel 1x", variant: "40T", weight: 550, bikeType: "gravel", teeth: [40], speeds: "gravel" },
    { id: "rotor-aldhu-gravel-1x-42", model: "Rotor Aldhu Gravel 1x", variant: "42T", weight: 560, bikeType: "gravel", teeth: [42], speeds: "gravel" },
    
    // TRACK/FIXED GEAR
    { id: "shimano-dura-ace-fc7710-48", model: "Shimano Dura-Ace FC-7710", variant: "48T", weight: 531, bikeType: "road", teeth: [48], speeds: "track" },
    { id: "shimano-dura-ace-fc7710-49", model: "Shimano Dura-Ace FC-7710", variant: "49T", weight: 531, bikeType: "road", teeth: [49], speeds: "track" },
    { id: "shimano-dura-ace-fc7710-50", model: "Shimano Dura-Ace FC-7710", variant: "50T", weight: 531, bikeType: "road", teeth: [50], speeds: "track" },
    { id: "sugino-75-dd-47", model: "Sugino 75 DD", variant: "47T", weight: 495, bikeType: "road", teeth: [47], speeds: "track" },
    { id: "sugino-75-dd-48", model: "Sugino 75 DD", variant: "48T", weight: 495, bikeType: "road", teeth: [48], speeds: "track" },
    { id: "sugino-75-dd-49", model: "Sugino 75 DD", variant: "49T", weight: 495, bikeType: "road", teeth: [49], speeds: "track" },
    { id: "sugino-75-dd-50", model: "Sugino 75 DD", variant: "50T", weight: 495, bikeType: "road", teeth: [50], speeds: "track" },
    { id: "sugino-75-dd-51", model: "Sugino 75 DD", variant: "51T", weight: 495, bikeType: "road", teeth: [51], speeds: "track" },

    // E-BIKE / THIRD PARTY / OVAL
    { id: "bosch-cx-spider", model: "Bosch CX Spider", variant: "E-MTB", weight: 395, bikeType: "mtb", teeth: [0], speeds: "e-bike" },
    { id: "absolute-black-oval-30", model: "AbsoluteBlack Oval", variant: "30T", weight: 48, bikeType: "mtb", teeth: [30], speeds: "oval" },
    { id: "absolute-black-oval-32", model: "AbsoluteBlack Oval", variant: "32T", weight: 52, bikeType: "mtb", teeth: [32], speeds: "oval" },
    { id: "absolute-black-oval-34", model: "AbsoluteBlack Oval", variant: "34T", weight: 56, bikeType: "mtb", teeth: [34], speeds: "oval" },
    { id: "absolute-black-oval-50-34", model: "AbsoluteBlack Oval Road", variant: "50/34T", weight: 166, bikeType: "road", teeth: [50, 34], speeds: "oval" },
    { id: "absolute-black-oval-52-36", model: "AbsoluteBlack Oval Road", variant: "52/36T", weight: 172, bikeType: "road", teeth: [52, 36], speeds: "oval" },
    { id: "rotor-qring-50-34", model: "Rotor Q-Ring", variant: "50/34T", weight: 170, bikeType: "road", teeth: [50, 34], speeds: "oval" },
    { id: "rotor-qring-52-36", model: "Rotor Q-Ring", variant: "52/36T", weight: 175, bikeType: "road", teeth: [52, 36], speeds: "oval" },
    { id: "rotor-qring-53-39", model: "Rotor Q-Ring", variant: "53/39T", weight: 180, bikeType: "road", teeth: [53, 39], speeds: "oval" },
  ],

  cassettes: [
    // ================================
    // SHIMANO ROAD CASSETTES
    // ================================

    // Entry Level (8-10 speed)
    { id: "shimano-claris-r2000-11-28", model: "Shimano Claris R2000", variant: "11-28T", weight: 280, bikeType: "road", teeth: [11, 28], speeds: "8-speed" },
    { id: "shimano-claris-r2000-11-32", model: "Shimano Claris R2000", variant: "11-32T", weight: 290, bikeType: "road", teeth: [11, 32], speeds: "8-speed" },
    { id: "shimano-claris-r2000-11-34", model: "Shimano Claris R2000", variant: "11-34T", weight: 300, bikeType: "road", teeth: [11, 34], speeds: "8-speed" },
    { id: "shimano-sora-r3000-11-28", model: "Shimano Sora R3000", variant: "11-28T", weight: 300, bikeType: "road", teeth: [11, 28], speeds: "9-speed" },
    { id: "shimano-sora-r3000-11-32", model: "Shimano Sora R3000", variant: "11-32T", weight: 310, bikeType: "road", teeth: [11, 32], speeds: "9-speed" },
    { id: "shimano-sora-r3000-11-34", model: "Shimano Sora R3000", variant: "11-34T", weight: 355, bikeType: "road", teeth: [11, 34], speeds: "9-speed" },
    { id: "shimano-tiagra-r4700-11-28", model: "Shimano Tiagra R4700", variant: "11-28T", weight: 290, bikeType: "road", teeth: [11, 28], speeds: "10-speed" },
    { id: "shimano-tiagra-r4700-11-32", model: "Shimano Tiagra R4700", variant: "11-32T", weight: 320, bikeType: "road", teeth: [11, 32], speeds: "10-speed" },
    { id: "shimano-tiagra-r4700-11-34", model: "Shimano Tiagra R4700", variant: "11-34T", weight: 365, bikeType: "road", teeth: [11, 34], speeds: "10-speed" },
    { id: "shimano-tiagra-r4700-12-28", model: "Shimano Tiagra R4700", variant: "12-28T", weight: 290, bikeType: "road", teeth: [12, 28], speeds: "10-speed" },

    // 105 R7000 (11-Speed)
    { id: "shimano-105-r7000-11-25", model: "Shimano 105 R7000", variant: "11-25T", weight: 266, bikeType: "road", teeth: [11, 25], speeds: "11-speed" },
    { id: "shimano-105-r7000-12-25", model: "Shimano 105 R7000", variant: "12-25T", weight: 266, bikeType: "road", teeth: [12, 25], speeds: "11-speed" },
    { id: "shimano-105-r7000-11-28", model: "Shimano 105 R7000", variant: "11-28T", weight: 280, bikeType: "road", teeth: [11, 28], speeds: "11-speed" },
    { id: "shimano-105-r7000-11-30", model: "Shimano 105 R7000", variant: "11-30T", weight: 295, bikeType: "road", teeth: [11, 30], speeds: "11-speed" },
    { id: "shimano-105-r7000-11-32", model: "Shimano 105 R7000", variant: "11-32T", weight: 310, bikeType: "road", teeth: [11, 32], speeds: "11-speed" },
    { id: "shimano-105-r7000-11-34", model: "Shimano 105 R7000", variant: "11-34T", weight: 325, bikeType: "road", teeth: [11, 34], speeds: "11-speed" },

    // 105 R7100 (12-Speed)
    { id: "shimano-105-r7100-11-34", model: "Shimano 105 R7100", variant: "11-34T", weight: 360, bikeType: "road", teeth: [11, 34], speeds: "12-speed" },
    { id: "shimano-105-r7100-11-36", model: "Shimano 105 R7100", variant: "11-36T", weight: 380, bikeType: "road", teeth: [11, 36], speeds: "12-speed" },

    // Ultegra R8000 (11-Speed)
    { id: "shimano-ultegra-r8000-11-25", model: "Shimano Ultegra R8000", variant: "11-25T", weight: 232, bikeType: "road", teeth: [11, 25], speeds: "11-speed" },
    { id: "shimano-ultegra-r8000-12-25", model: "Shimano Ultegra R8000", variant: "12-25T", weight: 232, bikeType: "road", teeth: [12, 25], speeds: "11-speed" },
    { id: "shimano-ultegra-r8000-11-28", model: "Shimano Ultegra R8000", variant: "11-28T", weight: 250, bikeType: "road", teeth: [11, 28], speeds: "11-speed" },
    { id: "shimano-ultegra-r8000-11-30", model: "Shimano Ultegra R8000", variant: "11-30T", weight: 265, bikeType: "road", teeth: [11, 30], speeds: "11-speed" },
    { id: "shimano-ultegra-r8000-11-32", model: "Shimano Ultegra R8000", variant: "11-32T", weight: 280, bikeType: "road", teeth: [11, 32], speeds: "11-speed" },
    { id: "shimano-ultegra-r8000-11-34", model: "Shimano Ultegra R8000", variant: "11-34T", weight: 295, bikeType: "road", teeth: [11, 34], speeds: "11-speed" },
    { id: "shimano-ultegra-r8000-14-28", model: "Shimano Ultegra R8000", variant: "14-28T", weight: 257, bikeType: "road", teeth: [14, 28], speeds: "11-speed" },

    // Ultegra R8100 (12-Speed)
    { id: "shimano-ultegra-r8100-11-28", model: "Shimano Ultegra R8100", variant: "11-28T", weight: 267, bikeType: "road", teeth: [11, 28], speeds: "12-speed" },
    { id: "shimano-ultegra-r8100-11-30", model: "Shimano Ultegra R8100", variant: "11-30T", weight: 291, bikeType: "road", teeth: [11, 30], speeds: "12-speed" },
    { id: "shimano-ultegra-r8100-11-34", model: "Shimano Ultegra R8100", variant: "11-34T", weight: 345, bikeType: "road", teeth: [11, 34], speeds: "12-speed" },

    // Dura-Ace R9100 (11-Speed)
    { id: "shimano-dura-ace-r9100-11-25", model: "Shimano Dura-Ace R9100", variant: "11-25T", weight: 175, bikeType: "road", teeth: [11, 25], speeds: "11-speed" },
    { id: "shimano-dura-ace-r9100-12-25", model: "Shimano Dura-Ace R9100", variant: "12-25T", weight: 175, bikeType: "road", teeth: [12, 25], speeds: "11-speed" },
    { id: "shimano-dura-ace-r9100-11-28", model: "Shimano Dura-Ace R9100", variant: "11-28T", weight: 195, bikeType: "road", teeth: [11, 28], speeds: "11-speed" },
    { id: "shimano-dura-ace-r9100-11-30", model: "Shimano Dura-Ace R9100", variant: "11-30T", weight: 220, bikeType: "road", teeth: [11, 30], speeds: "11-speed" },

    // Dura-Ace R9200 (12-Speed)
    { id: "shimano-dura-ace-r9200-11-28", model: "Shimano Dura-Ace R9200", variant: "11-28T", weight: 223, bikeType: "road", teeth: [11, 28], speeds: "12-speed" },
    { id: "shimano-dura-ace-r9200-11-30", model: "Shimano Dura-Ace R9200", variant: "11-30T", weight: 250, bikeType: "road", teeth: [11, 30], speeds: "12-speed" },
    { id: "shimano-dura-ace-r9200-11-34", model: "Shimano Dura-Ace R9200", variant: "11-34T", weight: 285, bikeType: "road", teeth: [11, 34], speeds: "12-speed" },

    // ================================
    // SHIMANO GRAVEL CASSETTES
    // ================================

    // GRX RX400 (10-Speed)
    { id: "shimano-grx-rx400-11-34", model: "Shimano GRX RX400", variant: "11-34T", weight: 350, bikeType: "gravel", teeth: [11, 34], speeds: "10-speed" },
    { id: "shimano-grx-rx400-11-36", model: "Shimano GRX RX400", variant: "11-36T", weight: 370, bikeType: "gravel", teeth: [11, 36], speeds: "10-speed" },

    // GRX RX600/RX810 (11-Speed)
    { id: "shimano-grx-rx600-11-34", model: "Shimano GRX RX600", variant: "11-34T", weight: 350, bikeType: "gravel", teeth: [11, 34], speeds: "11-speed" },
    { id: "shimano-grx-rx600-11-42", model: "Shimano GRX RX600", variant: "11-42T", weight: 390, bikeType: "gravel", teeth: [11, 42], speeds: "11-speed" },
    { id: "shimano-grx-rx810-11-34", model: "Shimano GRX RX810", variant: "11-34T", weight: 295, bikeType: "gravel", teeth: [11, 34], speeds: "11-speed" },
    { id: "shimano-grx-rx810-11-36", model: "Shimano GRX RX810", variant: "11-36T", weight: 348, bikeType: "gravel", teeth: [11, 36], speeds: "11-speed" },
    { id: "shimano-grx-rx810-11-40", model: "Shimano GRX RX810", variant: "11-40T", weight: 370, bikeType: "gravel", teeth: [11, 40], speeds: "11-speed" },

    // GRAVEL 'MULLET' OPTIONS
    { id: "shimano-xt-m8000-11-46", model: "Shimano XT M8000", variant: "11-46T", weight: 411, bikeType: "gravel", teeth: [11, 46], speeds: "11-speed" },
    { id: "shimano-slx-m7100-10-46", model: "Shimano SLX M7100", variant: "10-46T", weight: 493, bikeType: "gravel", teeth: [10, 46], speeds: "12-speed" },
    { id: "shimano-xt-m8100-10-46", model: "Shimano XT M8100", variant: "10-46T", weight: 434, bikeType: "gravel", teeth: [10, 46], speeds: "12-speed" },
    { id: "shimano-xt-m8100-10-51-gravel", model: "Shimano XT M8100", variant: "10-51T", weight: 470, bikeType: "gravel", teeth: [10, 51], speeds: "12-speed" },

    // ================================
    // SHIMANO MTB CASSETTES
    // ================================

    // CUES / Linkglide Technology
    { id: "shimano-cues-lg400-11-41", model: "Shimano CUES LG400", variant: "11-41T", weight: 582, bikeType: "mtb", teeth: [11, 41], speeds: "9-speed" },
    { id: "shimano-cues-lg400-11-46", model: "Shimano CUES LG400", variant: "11-46T", weight: 610, bikeType: "mtb", teeth: [11, 46], speeds: "9-speed" },
    { id: "shimano-cues-u4000-11-46", model: "Shimano CUES U4000", variant: "11-46T", weight: 480, bikeType: "mtb", teeth: [11, 46], speeds: "9-speed" },
    { id: "shimano-cues-lg600-11-50", model: "Shimano CUES LG600", variant: "11-50T", weight: 634, bikeType: "mtb", teeth: [11, 50], speeds: "10-speed" },
    { id: "shimano-cues-u6000-11-46", model: "Shimano CUES U6000", variant: "11-46T", weight: 460, bikeType: "mtb", teeth: [11, 46], speeds: "10-speed" },
    { id: "shimano-cues-u6000-11-48", model: "Shimano CUES U6000", variant: "11-48T", weight: 480, bikeType: "mtb", teeth: [11, 48], speeds: "10-speed" },
    { id: "shimano-cues-u6000-11-50-10s", model: "Shimano CUES U6000", variant: "11-50T", weight: 500, bikeType: "mtb", teeth: [11, 50], speeds: "10-speed" },
    { id: "shimano-cues-u6000-11-50-11s", model: "Shimano CUES U6000", variant: "11-50T", weight: 520, bikeType: "mtb", teeth: [11, 50], speeds: "11-speed" },
    { id: "shimano-cues-u8000-11-50", model: "Shimano CUES U8000", variant: "11-50T", weight: 500, bikeType: "mtb", teeth: [11, 50], speeds: "11-speed" },
    { id: "shimano-xt-m8130-11-50", model: "Shimano XT M8130 LinkGlide", variant: "11-50T", weight: 630, bikeType: "mtb", teeth: [11, 50], speeds: "11-speed" },

    // Deore M5100 (11-Speed)
    { id: "shimano-deore-m5100-11-42", model: "Shimano Deore M5100", variant: "11-42T", weight: 460, bikeType: "mtb", teeth: [11, 42], speeds: "11-speed" },
    { id: "shimano-deore-m5100-11-46", model: "Shimano Deore M5100", variant: "11-46T", weight: 482, bikeType: "mtb", teeth: [11, 46], speeds: "11-speed" },
    { id: "shimano-deore-m5100-11-51", model: "Shimano Deore M5100", variant: "11-51T", weight: 518, bikeType: "mtb", teeth: [11, 51], speeds: "11-speed" },

    // Deore M6100 (12-Speed)
    { id: "shimano-deore-m6100-10-46", model: "Shimano Deore M6100", variant: "10-46T", weight: 534, bikeType: "mtb", teeth: [10, 46], speeds: "12-speed" },
    { id: "shimano-deore-m6100-10-51", model: "Shimano Deore M6100", variant: "10-51T", weight: 593, bikeType: "mtb", teeth: [10, 51], speeds: "12-speed" },

    // SLX M7000 (11-Speed)
    { id: "shimano-slx-m7000-11-40", model: "Shimano SLX M7000", variant: "11-40T", weight: 360, bikeType: "mtb", teeth: [11, 40], speeds: "11-speed" },
    { id: "shimano-slx-m7000-11-42", model: "Shimano SLX M7000", variant: "11-42T", weight: 390, bikeType: "mtb", teeth: [11, 42], speeds: "11-speed" },
    { id: "shimano-slx-m7000-11-46", model: "Shimano SLX M7000", variant: "11-46T", weight: 411, bikeType: "mtb", teeth: [11, 46], speeds: "11-speed" },

    // SLX M7100 (12-Speed)
    { id: "shimano-slx-m7100-10-45", model: "Shimano SLX M7100", variant: "10-45T", weight: 461, bikeType: "mtb", teeth: [10, 45], speeds: "12-speed" },
    { id: "shimano-slx-m7100-10-51", model: "Shimano SLX M7100", variant: "10-51T", weight: 534, bikeType: "mtb", teeth: [10, 51], speeds: "12-speed" },

    // XT M8000 (11-Speed)
    { id: "shimano-xt-m8000-11-40", model: "Shimano XT M8000", variant: "11-40T", weight: 360, bikeType: "mtb", teeth: [11, 40], speeds: "11-speed" },
    { id: "shimano-xt-m8000-11-42", model: "Shimano XT M8000", variant: "11-42T", weight: 390, bikeType: "mtb", teeth: [11, 42], speeds: "11-speed" },

    // XT M8100 (12-Speed)
    { id: "shimano-xt-m8100-10-45", model: "Shimano XT M8100", variant: "10-45T", weight: 406, bikeType: "mtb", teeth: [10, 45], speeds: "12-speed" },
    { id: "shimano-xt-m8100-10-51", model: "Shimano XT M8100", variant: "10-51T", weight: 470, bikeType: "mtb", teeth: [10, 51], speeds: "12-speed" },

    // XTR M9100 (12-Speed)
    { id: "shimano-xtr-m9100-10-45", model: "Shimano XTR M9100", variant: "10-45T", weight: 366, bikeType: "mtb", teeth: [10, 45], speeds: "12-speed" },
    { id: "shimano-xtr-m9100-10-51", model: "Shimano XTR M9100", variant: "10-51T", weight: 390, bikeType: "mtb", teeth: [10, 51], speeds: "12-speed" },

    // XTR M9200 (12-Speed)
    { id: "shimano-xtr-m9200-9-45", model: "Shimano XTR M9200", variant: "9-45T", weight: 350, bikeType: "mtb", teeth: [9, 45], speeds: "12-speed" },

    // ================================
    // SRAM ROAD CASSETTES
    // ================================

    // Apex (10-Speed)
    { id: "sram-apex-11-32", model: "SRAM Apex", variant: "11-32T", weight: 320, bikeType: "road", teeth: [11, 32], speeds: "10-speed" },
    { id: "sram-apex-11-36", model: "SRAM Apex", variant: "11-36T", weight: 350, bikeType: "road", teeth: [11, 36], speeds: "10-speed" },

    // Rival 22 (11-Speed)
    { id: "sram-rival-22-11-28", model: "SRAM Rival 22", variant: "11-28T", weight: 230, bikeType: "road", teeth: [11, 28], speeds: "11-speed" },
    { id: "sram-rival-22-11-32", model: "SRAM Rival 22", variant: "11-32T", weight: 260, bikeType: "road", teeth: [11, 32], speeds: "11-speed" },
    { id: "sram-rival-22-11-36", model: "SRAM Rival 22", variant: "11-36T", weight: 290, bikeType: "road", teeth: [11, 36], speeds: "11-speed" },

    // Force 22 (11-Speed)
    { id: "sram-force-22-11-25", model: "SRAM Force 22", variant: "11-25T", weight: 185, bikeType: "road", teeth: [11, 25], speeds: "11-speed" },
    { id: "sram-force-22-11-28", model: "SRAM Force 22", variant: "11-28T", weight: 215, bikeType: "road", teeth: [11, 28], speeds: "11-speed" },
    { id: "sram-force-22-11-32", model: "SRAM Force 22", variant: "11-32T", weight: 245, bikeType: "road", teeth: [11, 32], speeds: "11-speed" },

    // Rival AXS (12-Speed)
    { id: "sram-rival-xg1250-10-28", model: "SRAM Rival XG-1250", variant: "10-28T", weight: 295, bikeType: "road", teeth: [10, 28], speeds: "12-speed" },
    { id: "sram-rival-xg1250-10-30", model: "SRAM Rival XG-1250", variant: "10-30T", weight: 308, bikeType: "road", teeth: [10, 30], speeds: "12-speed" },
    { id: "sram-rival-xg1251-10-36", model: "SRAM Rival XG-1251", variant: "10-36T", weight: 265, bikeType: "road", teeth: [10, 36], speeds: "12-speed" },

    // Force AXS (12-Speed)
    { id: "sram-force-xg1270-10-26", model: "SRAM Force XG-1270", variant: "10-26T", weight: 215, bikeType: "road", teeth: [10, 26], speeds: "12-speed" },
    { id: "sram-force-xg1270-10-28", model: "SRAM Force XG-1270", variant: "10-28T", weight: 240, bikeType: "road", teeth: [10, 28], speeds: "12-speed" },
    { id: "sram-force-xg1270-10-30", model: "SRAM Force XG-1270", variant: "10-30T", weight: 280, bikeType: "road", teeth: [10, 30], speeds: "12-speed" },
    { id: "sram-force-xg1270-10-33", model: "SRAM Force XG-1270", variant: "10-33T", weight: 270, bikeType: "road", teeth: [10, 33], speeds: "12-speed" },
    { id: "sram-force-xg1270-10-36", model: "SRAM Force XG-1270", variant: "10-36T", weight: 295, bikeType: "road", teeth: [10, 36], speeds: "12-speed" },

    // Red AXS (12-Speed)
    { id: "sram-red-xg1290-10-26", model: "SRAM Red XG-1290", variant: "10-26T", weight: 240, bikeType: "road", teeth: [10, 26], speeds: "12-speed" },
    { id: "sram-red-xg1290-10-28", model: "SRAM Red XG-1290", variant: "10-28T", weight: 250, bikeType: "road", teeth: [10, 28], speeds: "12-speed" },
    { id: "sram-red-xg1290-10-33", model: "SRAM Red XG-1290", variant: "10-33T", weight: 280, bikeType: "road", teeth: [10, 33], speeds: "12-speed" },
    
    // SRAM RED AXS 2024 CASSETTES
    { id: "sram-red-xg1290-2024-10-28", model: "SRAM Red XG-1290 2024", variant: "10-28T", weight: 226, bikeType: "road", teeth: [10, 28], speeds: "12-speed" },
    { id: "sram-red-xg1290-2024-10-30", model: "SRAM Red XG-1290 2024", variant: "10-30T", weight: 235, bikeType: "road", teeth: [10, 30], speeds: "12-speed" },
    { id: "sram-red-xg1290-2024-10-33", model: "SRAM Red XG-1290 2024", variant: "10-33T", weight: 260, bikeType: "road", teeth: [10, 33], speeds: "12-speed" },
    { id: "sram-red-xg1290-2024-10-36", model: "SRAM Red XG-1290 2024", variant: "10-36T", weight: 285, bikeType: "road", teeth: [10, 36], speeds: "12-speed" },

    // ================================
    // SRAM GRAVEL CASSETTES
    // ================================

    // Apex (11-Speed)
    { id: "sram-apex-gravel-11-42", model: "SRAM Apex PG-1130", variant: "11-42T", weight: 538, bikeType: "gravel", teeth: [11, 42], speeds: "11-speed" },

    // Apex XPLR (12-Speed)
    { id: "sram-apex-xplr-11-44", model: "SRAM Apex XPLR PG-1231", variant: "11-44T", weight: 615, bikeType: "gravel", teeth: [11, 44], speeds: "12-speed" },

    // Rival XPLR AXS (12-Speed)
    { id: "sram-rival-xg1251-10-36-gravel", model: "SRAM Rival XG-1251", variant: "10-36T", weight: 265, bikeType: "gravel", teeth: [10, 36], speeds: "12-speed" },
    { id: "sram-rival-xg1271-10-44", model: "SRAM Rival XG-1271", variant: "10-44T", weight: 345, bikeType: "gravel", teeth: [10, 44], speeds: "12-speed" },

    // Force XPLR AXS (12-Speed)
    { id: "sram-force-xg1271-10-36", model: "SRAM Force XPLR XG-1271", variant: "10-36T", weight: 308, bikeType: "gravel", teeth: [10, 36], speeds: "12-speed" },
    { id: "sram-force-xg1271-10-44", model: "SRAM Force XG-1271", variant: "10-44T", weight: 373, bikeType: "gravel", teeth: [10, 44], speeds: "12-speed" },

    // Force XPLR 2025 (13-Speed)
    { id: "sram-force-xg1381-10-46", model: "SRAM Force XG-1381", variant: "10-46T", weight: 300, bikeType: "gravel", teeth: [10, 46], speeds: "13-speed" },

    // Rival XPLR 2025 (13-Speed)
    { id: "sram-rival-xg1371-10-46", model: "SRAM Rival XG-1371", variant: "10-46T", weight: 355, bikeType: "gravel", teeth: [10, 46], speeds: "13-speed" },

    // Red XPLR AXS (13-Speed!)
    { id: "sram-red-xg1391-10-46", model: "SRAM Red XG-1391", variant: "10-46T", weight: 288, bikeType: "gravel", teeth: [10, 46], speeds: "13-speed" },

    // MTB Crossover for Gravel
    { id: "sram-gx-eagle-10-44", model: "SRAM GX Eagle XG-1275", variant: "10-44T", weight: 410, bikeType: "gravel", teeth: [10, 44], speeds: "12-speed" },
    { id: "sram-gx-eagle-10-50-gravel", model: "SRAM GX Eagle XG-1275", variant: "10-50T", weight: 430, bikeType: "gravel", teeth: [10, 50], speeds: "12-speed" },
    { id: "sram-gx-eagle-10-52-gravel", model: "SRAM GX Eagle XG-1275", variant: "10-52T", weight: 440, bikeType: "gravel", teeth: [10, 52], speeds: "12-speed" },

    // ================================
    // SRAM MTB CASSETTES
    // ================================

    // SX Eagle (12-Speed)
    { id: "sram-sx-eagle-11-50", model: "SRAM SX Eagle PG-1210", variant: "11-50T", weight: 650, bikeType: "mtb", teeth: [11, 50], speeds: "12-speed" },

    // NX Eagle (12-Speed)
    { id: "sram-nx-eagle-10-50", model: "SRAM NX Eagle XG-1230", variant: "11-50T", weight: 615, bikeType: "mtb", teeth: [11, 50], speeds: "12-speed" },

    // GX Eagle (12-Speed)
    { id: "sram-gx-eagle-10-50", model: "SRAM GX Eagle XG-1275", variant: "10-50T", weight: 430, bikeType: "mtb", teeth: [10, 50], speeds: "12-speed" },
    { id: "sram-gx-eagle-10-52", model: "SRAM GX Eagle XG-1275", variant: "10-52T", weight: 440, bikeType: "mtb", teeth: [10, 52], speeds: "12-speed" },

    // X01 Eagle (12-Speed)
    { id: "sram-x01-eagle-10-50", model: "SRAM X01 Eagle XG-1295", variant: "10-50T", weight: 339, bikeType: "mtb", teeth: [10, 50], speeds: "12-speed" },
    { id: "sram-x01-eagle-10-52", model: "SRAM X01 Eagle XG-1295", variant: "10-52T", weight: 350, bikeType: "mtb", teeth: [10, 52], speeds: "12-speed" },

    // XX1 Eagle (12-Speed)
    { id: "sram-xx1-eagle-10-50", model: "SRAM XX1 Eagle XG-1299", variant: "10-50T", weight: 360, bikeType: "mtb", teeth: [10, 50], speeds: "12-speed" },
    { id: "sram-xx1-eagle-10-52", model: "SRAM XX1 Eagle XG-1299", variant: "10-52T", weight: 371, bikeType: "mtb", teeth: [10, 52], speeds: "12-speed" },

    // Transmission T-Type Cassettes
    { id: "sram-gx-eagle-t-type-10-52", model: "SRAM GX Eagle T-Type", variant: "10-52T", weight: 452, bikeType: "mtb", teeth: [10, 52], speeds: "12-speed" },
    { id: "sram-x0-eagle-t-type-10-52", model: "SRAM X0 Eagle T-Type", variant: "10-52T", weight: 368, bikeType: "mtb", teeth: [10, 52], speeds: "12-speed" },
    { id: "sram-xx-eagle-t-type-10-52", model: "SRAM XX Eagle T-Type", variant: "10-52T", weight: 350, bikeType: "mtb", teeth: [10, 52], speeds: "12-speed" },

    // ================================
    // CAMPAGNOLO CASSETTES
    // ================================

    // Centaur (11-Speed)
    { id: "campagnolo-centaur-11-29", model: "Campagnolo Centaur", variant: "11-29T", weight: 280, bikeType: "road", teeth: [11, 29], speeds: "11-speed" },
    { id: "campagnolo-centaur-11-32", model: "Campagnolo Centaur", variant: "11-32T", weight: 300, bikeType: "road", teeth: [11, 32], speeds: "11-speed" },

    // Chorus (12-Speed)
    { id: "campagnolo-chorus-11-29", model: "Campagnolo Chorus", variant: "11-29T", weight: 250, bikeType: "road", teeth: [11, 29], speeds: "12-speed" },
    { id: "campagnolo-chorus-11-32", model: "Campagnolo Chorus", variant: "11-32T", weight: 270, bikeType: "road", teeth: [11, 32], speeds: "12-speed" },
    { id: "campagnolo-chorus-11-34", model: "Campagnolo Chorus", variant: "11-34T", weight: 290, bikeType: "road", teeth: [11, 34], speeds: "12-speed" },

    // Record (12-Speed)
    { id: "campagnolo-record-11-29", model: "Campagnolo Record", variant: "11-29T", weight: 220, bikeType: "road", teeth: [11, 29], speeds: "12-speed" },
    { id: "campagnolo-record-11-32", model: "Campagnolo Record", variant: "11-32T", weight: 240, bikeType: "road", teeth: [11, 32], speeds: "12-speed" },
    { id: "campagnolo-record-11-34", model: "Campagnolo Record", variant: "11-34T", weight: 260, bikeType: "road", teeth: [11, 34], speeds: "12-speed" },
    
    // Super Record (12-Speed)
    { id: "campagnolo-super-record-11-29", model: "Campagnolo Super Record", variant: "11-29T", weight: 195, bikeType: "road", teeth: [11, 29], speeds: "12-speed" },
    { id: "campagnolo-super-record-11-32", model: "Campagnolo Super Record", variant: "11-32T", weight: 215, bikeType: "road", teeth: [11, 32], speeds: "12-speed" },
    { id: "campagnolo-super-record-11-34", model: "Campagnolo Super Record", variant: "11-34T", weight: 235, bikeType: "road", teeth: [11, 34], speeds: "12-speed" },

    // Super Record 13 (13-Speed)
    { id: "campagnolo-super-record-13-9-32", model: "Campagnolo Super Record 13", variant: "9-32T", weight: 230, bikeType: "road", teeth: [9, 32], speeds: "13-speed" },
    { id: "campagnolo-super-record-13-9-34", model: "Campagnolo Super Record 13", variant: "9-34T", weight: 245, bikeType: "road", teeth: [9, 34], speeds: "13-speed" },
    { id: "campagnolo-super-record-13-9-36", model: "Campagnolo Super Record 13", variant: "9-36T", weight: 260, bikeType: "road", teeth: [9, 36], speeds: "13-speed" },
    { id: "campagnolo-super-record-13-10-36", model: "Campagnolo Super Record 13", variant: "10-36T", weight: 265, bikeType: "road", teeth: [10, 36], speeds: "13-speed" },

    // Ekar (13-Speed Gravel)
    { id: "campagnolo-ekar-9-36", model: "Campagnolo Ekar", variant: "9-36T", weight: 340, bikeType: "gravel", teeth: [9, 36], speeds: "13-speed" },
    { id: "campagnolo-ekar-9-42", model: "Campagnolo Ekar", variant: "9-42T", weight: 378, bikeType: "gravel", teeth: [9, 42], speeds: "13-speed" },
    { id: "campagnolo-ekar-10-44", model: "Campagnolo Ekar", variant: "10-44T", weight: 425, bikeType: "gravel", teeth: [10, 44], speeds: "13-speed" },

    // Ekar GT (13-Speed Gravel)
    { id: "campagnolo-ekar-gt-9-36", model: "Campagnolo Ekar GT", variant: "9-36T", weight: 385, bikeType: "gravel", teeth: [9, 36], speeds: "13-speed" },
    { id: "campagnolo-ekar-gt-9-42", model: "Campagnolo Ekar GT", variant: "9-42T", weight: 430, bikeType: "gravel", teeth: [9, 42], speeds: "13-speed" },
    { id: "campagnolo-ekar-gt-10-48", model: "Campagnolo Ekar GT", variant: "10-48T", weight: 485, bikeType: "gravel", teeth: [10, 48], speeds: "13-speed" },

    // ================================
    // FSA CASSETTES
    // ================================

    // FSA Road Cassettes
    { id: "fsa-pro-road-11-28", model: "FSA Pro Road", variant: "11-28T", weight: 320, bikeType: "road", teeth: [11, 28], speeds: "11-speed" },
    { id: "fsa-pro-road-11-32", model: "FSA Pro Road", variant: "11-32T", weight: 340, bikeType: "road", teeth: [11, 32], speeds: "11-speed" },
    { id: "fsa-k-force-11-25", model: "FSA K-Force", variant: "11-25T", weight: 250, bikeType: "road", teeth: [11, 25], speeds: "11-speed" },
    { id: "fsa-k-force-11-28", model: "FSA K-Force", variant: "11-28T", weight: 270, bikeType: "road", teeth: [11, 28], speeds: "11-speed" },
    { id: "fsa-k-force-11-32", model: "FSA K-Force", variant: "11-32T", weight: 290, bikeType: "road", teeth: [11, 32], speeds: "11-speed" },
    
    // FSA K-Force WE (12-Speed Electronic)
    { id: "fsa-k-force-we-11-25", model: "FSA K-Force WE", variant: "11-25T", weight: 265, bikeType: "road", teeth: [11, 25], speeds: "12-speed" },
    { id: "fsa-k-force-we-11-28", model: "FSA K-Force WE", variant: "11-28T", weight: 285, bikeType: "road", teeth: [11, 28], speeds: "12-speed" },
    { id: "fsa-k-force-we-11-32", model: "FSA K-Force WE", variant: "11-32T", weight: 305, bikeType: "road", teeth: [11, 32], speeds: "12-speed" },
    
    // FSA Gravel Cassettes
    { id: "fsa-gravel-11-40", model: "FSA Gravel", variant: "11-40T", weight: 420, bikeType: "gravel", teeth: [11, 40], speeds: "11-speed" },
    { id: "fsa-adventure-11-42", model: "FSA Adventure", variant: "11-42T", weight: 450, bikeType: "gravel", teeth: [11, 42], speeds: "11-speed" },

    // ================================
    // PRAXIS CASSETTES
    // ================================

    // Praxis Road Cassettes
    { id: "praxis-works-11-28", model: "Praxis Works", variant: "11-28T", weight: 285, bikeType: "road", teeth: [11, 28], speeds: "11-speed" },
    { id: "praxis-works-11-32", model: "Praxis Works", variant: "11-32T", weight: 305, bikeType: "road", teeth: [11, 32], speeds: "11-speed" },

    // Praxis Gravel Cassettes
    { id: "praxis-gravel-11-40", model: "Praxis Gravel", variant: "11-40T", weight: 430, bikeType: "gravel", teeth: [11, 40], speeds: "11-speed" },
    { id: "praxis-gravel-11-42", model: "Praxis Gravel", variant: "11-42T", weight: 450, bikeType: "gravel", teeth: [11, 42], speeds: "11-speed" },

    // ================================
    // ROTOR CASSETTES
    // ================================
    
    // Rotor Road Cassettes
    { id: "rotor-road-11-28", model: "Rotor Road", variant: "11-28T", weight: 225, bikeType: "road", teeth: [11, 28], speeds: "11-speed" },
    { id: "rotor-road-11-30", model: "Rotor Road", variant: "11-30T", weight: 240, bikeType: "road", teeth: [11, 30], speeds: "11-speed" },
    { id: "rotor-road-11-32", model: "Rotor Road", variant: "11-32T", weight: 255, bikeType: "road", teeth: [11, 32], speeds: "11-speed" },
    { id: "rotor-road-11-36", model: "Rotor Road", variant: "11-36T", weight: 280, bikeType: "road", teeth: [11, 36], speeds: "11-speed" },
    
    // Rotor 12-Speed Cassettes
    { id: "rotor-12s-11-36", model: "Rotor 12-Speed", variant: "11-36T", weight: 319, bikeType: "road", teeth: [11, 36], speeds: "12-speed" },
    { id: "rotor-12s-11-39", model: "Rotor 12-Speed", variant: "11-39T", weight: 338, bikeType: "road", teeth: [11, 39], speeds: "12-speed" },
    { id: "rotor-12s-11-46", model: "Rotor 12-Speed", variant: "11-46T", weight: 402, bikeType: "gravel", teeth: [11, 46], speeds: "12-speed" },
    
    // ================================
    // THIRD PARTY & SPECIALTY CASSETTES
    // ================================

    // Single Speed Cogs
    { id: "track-cog-13", model: "Track Cog", variant: "13T", weight: 23, bikeType: "road", teeth: [13, 13], speeds: "single" },
    { id: "track-cog-14", model: "Track Cog", variant: "14T", weight: 25, bikeType: "road", teeth: [14, 14], speeds: "single" },
    { id: "track-cog-15", model: "Track Cog", variant: "15T", weight: 28, bikeType: "road", teeth: [15, 15], speeds: "single" },
    { id: "track-cog-16", model: "Track Cog", variant: "16T", weight: 30, bikeType: "road", teeth: [16, 16], speeds: "single" },
    { id: "track-cog-17", model: "Track Cog", variant: "17T", weight: 35, bikeType: "road", teeth: [17, 17], speeds: "single" },
    { id: "track-cog-18", model: "Track Cog", variant: "18T", weight: 40, bikeType: "road", teeth: [18, 18], speeds: "single" },
    { id: "track-cog-19", model: "Track Cog", variant: "19T", weight: 45, bikeType: "road", teeth: [19, 19], speeds: "single" },
    { id: "track-cog-20", model: "Track Cog", variant: "20T", weight: 50, bikeType: "road", teeth: [20, 20], speeds: "single" },
    { id: "track-cog-21", model: "Track Cog", variant: "21T", weight: 55, bikeType: "road", teeth: [21, 21], speeds: "single" },
    
    // Aftermarket Extenders & Cassettes
    { id: "wolftooth-gc-40", model: "Wolf Tooth GC", variant: "40T", weight: 84, bikeType: "gravel", teeth: [40, 40], speeds: "10/11-speed" },
    { id: "wolftooth-gc-42", model: "Wolf Tooth GC", variant: "42T", weight: 92, bikeType: "gravel", teeth: [42, 42], speeds: "10/11-speed" },
    { id: "wolftooth-gc-44", model: "Wolf Tooth GC", variant: "44T", weight: 106, bikeType: "gravel", teeth: [44, 44], speeds: "10/11-speed" },
    { id: "wolftooth-gc-46", model: "Wolf Tooth GC", variant: "46T", weight: 120, bikeType: "gravel", teeth: [46, 46], speeds: "10/11-speed" },
    { id: "wolftooth-gc-49", model: "Wolf Tooth GC", variant: "49T", weight: 138, bikeType: "gravel", teeth: [49, 49], speeds: "10/11-speed" },
    { id: "oneup-45t-sprocket", model: "OneUp 45T Sprocket", variant: "45T", weight: 72, bikeType: "gravel", teeth: [45, 45], speeds: "add-on" },
    { id: "oneup-50t-sprocket", model: "OneUp 50T Sprocket", variant: "50T", weight: 98, bikeType: "mtb", teeth: [50, 50], speeds: "add-on" },
    { id: "garbaruk-11-50", model: "Garbaruk", variant: "11-50T", weight: 368, bikeType: "mtb", teeth: [11, 50], speeds: "11-speed" },
    { id: "garbaruk-10-50", model: "Garbaruk", variant: "10-50T", weight: 385, bikeType: "mtb", teeth: [10, 50], speeds: "12-speed" },
    { id: "garbaruk-10-52", model: "Garbaruk", variant: "10-52T", weight: 395, bikeType: "mtb", teeth: [10, 52], speeds: "12-speed" },
  ]
};

export const getComponentsForBikeType = (bikeType) => {
  // This function might need adjustment if you want to filter by new `speeds` categories like "track" or "single"
  const relevantBikeTypes = [bikeType];
  if (bikeType === 'gravel') {
    // Allow gravel bikes to use MTB components for 'mullet' setups
    relevantBikeTypes.push('mtb');
  }

  return {
    cranksets: componentDatabase.cranksets.filter(c => relevantBikeTypes.includes(c.bikeType)),
    cassettes: componentDatabase.cassettes.filter(c => relevantBikeTypes.includes(c.bikeType)),
  };
};