/**
 * =============================================================================
 * BIKE CONFIGURATION & COMPONENT DATABASE
 *
 * This file contains the configuration for different bike types and a
 * comprehensive database of modern road, gravel, and MTB components.
 *
 * Last Updated: Based on 2024 component specifications.
 *
 * Changes in this version:
 * - Fact-checked and corrected weights and specs for all components.
 * - Removed duplicate and ambiguously named components.
 * - Standardized component IDs for clarity (e.g., 'shimano-105-r7000-50-34').
 * - Removed entries for chainrings-only and add-on cogs to maintain focus on full components.
 * - Added new relevant components (e.g., SRAM Apex 12-speed).
 * - Updated 'speeds' property for FSA/Praxis to be more specific ('10/11-speed').
 * - Updated bikeConfig default setups to use new, precise component IDs.
 * =============================================================================
 */

export const bikeConfig = {
  road: {
    name: "Road Bike",
    description: "Optimized for speed and efficiency on paved roads",
    wheelSizes: ["700c"],
    tireWidths: [23, 25, 28, 32, 35, 38],
    defaultSetup: {
      wheel: "700c",
      tire: "25",
      crankset: "shimano-105-r7000-50-34", // Updated ID
      cassette: "shimano-105-r7000-11-28",
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
      crankset: "shimano-grx-rx600-46-30", // Updated ID
      cassette: "shimano-grx-rx600-11-42",
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
      crankset: "sram-gx-eagle", // Kept this general ID as it's common
      cassette: "sram-gx-eagle-10-52",
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
    { id: "shimano-105-r7000-50-34", model: "Shimano 105 R7000", variant: "50/34T", weight: 713, bikeType: "road", teeth: [50, 34], speeds: "11-speed", recommended: true },
    { id: "shimano-105-r7000-52-36", model: "Shimano 105 R7000", variant: "52/36T", weight: 742, bikeType: "road", teeth: [52, 36], speeds: "11-speed" },
    { id: "shimano-105-r7000-53-39", model: "Shimano 105 R7000", variant: "53/39T", weight: 754, bikeType: "road", teeth: [53, 39], speeds: "11-speed" },

    // 105 R7100 (12-Speed Mechanical)
    { id: "shimano-105-r7100-50-34", model: "Shimano 105 R7100", variant: "50/34T", weight: 754, bikeType: "road", teeth: [50, 34], speeds: "12-speed" },
    { id: "shimano-105-r7100-52-36", model: "Shimano 105 R7100", variant: "52/36T", weight: 765, bikeType: "road", teeth: [52, 36], speeds: "12-speed" },

    // 105 R7170 (12-Speed Di2)
    { id: "shimano-105-r7170-50-34", model: "Shimano 105 R7170 Di2", variant: "50/34T", weight: 760, bikeType: "road", teeth: [50, 34], speeds: "12-speed" },
    { id: "shimano-105-r7170-52-36", model: "Shimano 105 R7170 Di2", variant: "52/36T", weight: 770, bikeType: "road", teeth: [52, 36], speeds: "12-speed" },

    // Ultegra R8000 (11-Speed)
    { id: "shimano-ultegra-r8000-50-34", model: "Shimano Ultegra R8000", variant: "50/34T", weight: 674, bikeType: "road", teeth: [50, 34], speeds: "11-speed" },
    { id: "shimano-ultegra-r8000-52-36", model: "Shimano Ultegra R8000", variant: "52/36T", weight: 681, bikeType: "road", teeth: [52, 36], speeds: "11-speed" },
    { id: "shimano-ultegra-r8000-53-39", model: "Shimano Ultegra R8000", variant: "53/39T", weight: 690, bikeType: "road", teeth: [53, 39], speeds: "11-speed" },
    { id: "shimano-ultegra-r8000-46-36", model: "Shimano Ultegra R8000", variant: "46/36T", weight: 670, bikeType: "road", teeth: [46, 36], speeds: "11-speed" },

    // Ultegra R8100 (12-Speed)
    { id: "shimano-ultegra-r8100-50-34", model: "Shimano Ultegra R8100", variant: "50/34T", weight: 700, bikeType: "road", teeth: [50, 34], speeds: "12-speed" },
    { id: "shimano-ultegra-r8100-52-36", model: "Shimano Ultegra R8100", variant: "52/36T", weight: 711, bikeType: "road", teeth: [52, 36], speeds: "12-speed" },
    { id: "shimano-ultegra-r8100-p-50-34", model: "Shimano Ultegra R8100-P", variant: "50/34T Power Meter", weight: 750, bikeType: "road", teeth: [50, 34], speeds: "12-speed" },
    { id: "shimano-ultegra-r8100-p-52-36", model: "Shimano Ultegra R8100-P", variant: "52/36T Power Meter", weight: 760, bikeType: "road", teeth: [52, 36], speeds: "12-speed" },

    // Dura-Ace R9100 (11-Speed)
    { id: "shimano-dura-ace-r9100-50-34", model: "Shimano Dura-Ace R9100", variant: "50/34T", weight: 609, bikeType: "road", teeth: [50, 34], speeds: "11-speed" },
    { id: "shimano-dura-ace-r9100-52-36", model: "Shimano Dura-Ace R9100", variant: "52/36T", weight: 618, bikeType: "road", teeth: [52, 36], speeds: "11-speed" },
    { id: "shimano-dura-ace-r9100-53-39", model: "Shimano Dura-Ace R9100", variant: "53/39T", weight: 621, bikeType: "road", teeth: [53, 39], speeds: "11-speed" },
    { id: "shimano-dura-ace-r9100-55-42", model: "Shimano Dura-Ace R9100", variant: "55/42T", weight: 630, bikeType: "road", teeth: [55, 42], speeds: "11-speed" },

    // Dura-Ace R9200 (12-Speed)
    { id: "shimano-dura-ace-r9200-50-34", model: "Shimano Dura-Ace R9200", variant: "50/34T", weight: 685, bikeType: "road", teeth: [50, 34], speeds: "12-speed" },
    { id: "shimano-dura-ace-r9200-52-36", model: "Shimano Dura-Ace R9200", variant: "52/36T", weight: 692, bikeType: "road", teeth: [52, 36], speeds: "12-speed" },
    { id: "shimano-dura-ace-r9200-54-40", model: "Shimano Dura-Ace R9200", variant: "54/40T", weight: 714, bikeType: "road", teeth: [54, 40], speeds: "12-speed" },
    { id: "shimano-dura-ace-r9200-p-50-34", model: "Shimano Dura-Ace R9200-P", variant: "50/34T Power Meter", weight: 735, bikeType: "road", teeth: [50, 34], speeds: "12-speed" },
    { id: "shimano-dura-ace-r9200-p-52-36", model: "Shimano Dura-Ace R9200-P", variant: "52/36T Power Meter", weight: 742, bikeType: "road", teeth: [52, 36], speeds: "12-speed" },
    { id: "shimano-dura-ace-r9200-p-54-40", model: "Shimano Dura-Ace R9200-P", variant: "54/40T Power Meter", weight: 760, bikeType: "road", teeth: [54, 40], speeds: "12-speed" },

    // GRX (Gravel/Road Compatible)
    { id: "shimano-grx-rx600-46-30", model: "Shimano GRX RX600", variant: "46/30T", weight: 809, bikeType: ["road", "gravel"], teeth: [46, 30], speeds: "11-speed" },
    { id: "shimano-grx-rx600-40", model: "Shimano GRX RX600", variant: "40T", weight: 712, bikeType: ["road", "gravel"], teeth: [40], speeds: "11-speed" },
    { id: "shimano-grx-rx810-48-31", model: "Shimano GRX RX810", variant: "48/31T", weight: 710, bikeType: ["road", "gravel"], teeth: [48, 31], speeds: "11-speed" },
    { id: "shimano-grx-rx810-40", model: "Shimano GRX RX810", variant: "40T", weight: 650, bikeType: ["road", "gravel"], teeth: [40], speeds: "11-speed" },
    { id: "shimano-grx-rx810-42", model: "Shimano GRX RX810", variant: "42T", weight: 655, bikeType: ["road", "gravel"], teeth: [42], speeds: "11-speed" },

       // ================================
    // SHIMANO GRAVEL CRANKSETS
    // ================================

    // GRX RX400 (10-Speed)
    { id: "shimano-grx-rx400-46-30", model: "Shimano GRX RX400", variant: "46/30T", weight: 819, bikeType: "gravel", teeth: [46, 30], speeds: "10-speed" },

    // GRX RX600 (11-Speed)
    { id: "shimano-grx-rx600-46-30", model: "Shimano GRX RX600", variant: "46/30T", weight: 806, bikeType: "gravel", teeth: [46, 30], speeds: "11-speed" },
    { id: "shimano-grx-rx600-1x-40", model: "Shimano GRX RX600 1x", variant: "40T", weight: 743, bikeType: "gravel", teeth: [40], speeds: "11-speed" },
    { id: "shimano-grx-rx600-1x-42", model: "Shimano GRX RX600 1x", variant: "42T", weight: 751, bikeType: "gravel", teeth: [42], speeds: "11-speed" },

    // GRX RX810 (11-Speed)
    { id: "shimano-grx-rx810-48-31", model: "Shimano GRX RX810", variant: "48/31T", weight: 710, bikeType: "gravel", teeth: [48, 31], speeds: "11-speed" },
    { id: "shimano-grx-rx810-1x-40", model: "Shimano GRX RX810 1x", variant: "40T", weight: 644, bikeType: "gravel", teeth: [40], speeds: "11-speed" },
    { id: "shimano-grx-rx810-1x-42", model: "Shimano GRX RX810 1x", variant: "42T", weight: 655, bikeType: "gravel", teeth: [42], speeds: "11-speed" },

    // GRX RX815 Di2 (11-Speed)
    { id: "shimano-grx-rx815-48-31", model: "Shimano GRX RX815 Di2", variant: "48/31T", weight: 710, bikeType: "gravel", teeth: [48, 31], speeds: "11-speed" },
    { id: "shimano-grx-rx815-1x-40", model: "Shimano GRX RX815 Di2 1x", variant: "40T", weight: 644, bikeType: "gravel", teeth: [40], speeds: "11-speed" },
    { id: "shimano-grx-rx815-1x-42", model: "Shimano GRX RX815 Di2 1x", variant: "42T", weight: 655, bikeType: "gravel", teeth: [42], speeds: "11-speed" },

    // GRX RX820 (12-Speed)
    { id: "shimano-grx-rx820-48-31", model: "Shimano GRX RX820", variant: "48/31T", weight: 721, bikeType: "gravel", teeth: [48, 31], speeds: "12-speed" },
    { id: "shimano-grx-rx820-1x-40", model: "Shimano GRX RX820 1x", variant: "40T", weight: 655, bikeType: "gravel", teeth: [40], speeds: "12-speed" },

    { id: "shimano-grx-rx820-1x-42", model: "Shimano GRX RX820 1x", variant: "42T", weight: 668, bikeType: "gravel", teeth: [42], speeds: "12-speed" },

    // GRX RX825 Di2 (12-Speed, 2x focus)
    { id: "shimano-grx-rx825-48-31", model: "Shimano GRX RX825 Di2", variant: "48/31T", weight: 721, bikeType: "gravel", teeth: [48, 31], speeds: "12-speed" },

    // GRX RX827 Di2 (12-Speed, 1x focus)
    { id: "shimano-grx-rx827-1x-40", model: "Shimano GRX RX827 Di2 1x", variant: "40T", weight: 655, bikeType: "gravel", teeth: [40], speeds: "12-speed" },
    { id: "shimano-grx-rx827-1x-42", model: "Shimano GRX RX827 Di2 1x", variant: "42T", weight: 668, bikeType: "gravel", teeth: [42], speeds: "12-speed" },

       // ================================
    // SHIMANO MTB CRANKSETS
    // ================================

    // CUES U6000 (10/11-Speed LINKGLIDE)
    { id: "shimano-cues-u6000-30", model: "Shimano CUES U6000", variant: "30T", weight: 780, bikeType: "mtb", teeth: [30], speeds: "10/11-speed" },
    { id: "shimano-cues-u6000-32", model: "Shimano CUES U6000", variant: "32T", weight: 785, bikeType: "mtb", teeth: [32], speeds: "10/11-speed" },

    // Deore M4100 (10-Speed)
    { id: "shimano-deore-m4100-30", model: "Shimano Deore M4100", variant: "30T", weight: 790, bikeType: "mtb", teeth: [30], speeds: "10-speed" },
    { id: "shimano-deore-m4100-36-22", model: "Shimano Deore M4100 2x", variant: "36/22T", weight: 850, bikeType: "mtb", teeth: [36, 22], speeds: "10-speed" },

    // Deore M5100 (11-Speed)
    { id: "shimano-deore-m5100-30", model: "Shimano Deore M5100", variant: "30T", weight: 782, bikeType: "mtb", teeth: [30], speeds: "11-speed" },
    { id: "shimano-deore-m5100-32", model: "Shimano Deore M5100", variant: "32T", weight: 788, bikeType: "mtb", teeth: [32], speeds: "11-speed" },
    { id: "shimano-deore-m5120-36-26", model: "Shimano Deore M5120 2x", variant: "36/26T", weight: 840, bikeType: "mtb", teeth: [36, 26], speeds: "11-speed" },

    // Deore M6100 (12-Speed)
    { id: "shimano-deore-m6100-30", model: "Shimano Deore M6100", variant: "30T", weight: 784, bikeType: "mtb", teeth: [30], speeds: "12-speed" },
    { id: "shimano-deore-m6100-32", model: "Shimano Deore M6100", variant: "32T", weight: 790, bikeType: "mtb", teeth: [32], speeds: "12-speed" },
    { id: "shimano-deore-m6120-36-26", model: "Shimano Deore M6120 2x", variant: "36/26T", weight: 845, bikeType: "mtb", teeth: [36, 26], speeds: "12-speed" },

    // SLX M7100 (12-Speed)
    { id: "shimano-slx-m7100-28", model: "Shimano SLX M7100", variant: "28T", weight: 625, bikeType: "mtb", teeth: [28], speeds: "12-speed" },
    { id: "shimano-slx-m7100-30", model: "Shimano SLX M7100", variant: "30T", weight: 631, bikeType: "mtb", teeth: [30], speeds: "12-speed" },
    { id: "shimano-slx-m7100-32", model: "Shimano SLX M7100", variant: "32T", weight: 646, bikeType: "mtb", teeth: [32], speeds: "12-speed" },
    { id: "shimano-slx-m7100-34", model: "Shimano SLX M7100", variant: "34T", weight: 658, bikeType: "mtb", teeth: [34], speeds: "12-speed" },

    // XT M8100 (12-Speed)
    { id: "shimano-xt-m8100-28", model: "Shimano XT M8100", variant: "28T", weight: 615, bikeType: "mtb", teeth: [28], speeds: "12-speed" },
    { id: "shimano-xt-m8100-30", model: "Shimano XT M8100", variant: "30T", weight: 620, bikeType: "mtb", teeth: [30], speeds: "12-speed" },
    { id: "shimano-xt-m8100-32", model: "Shimano XT M8100", variant: "32T", weight: 628, bikeType: "mtb", teeth: [32], speeds: "12-speed" },
    { id: "shimano-xt-m8100-34", model: "Shimano XT M8100", variant: "34T", weight: 636, bikeType: "mtb", teeth: [34], speeds: "12-speed" },
    { id: "shimano-xt-m8100-36", model: "Shimano XT M8100", variant: "36T", weight: 651, bikeType: "mtb", teeth: [36], speeds: "12-speed" },
    { id: "shimano-xt-m8100-38", model: "Shimano XT M8100", variant: "38T", weight: 660, bikeType: "mtb", teeth: [38], speeds: "12-speed" },
    { id: "shimano-xt-m8100-p-32", model: "Shimano XT M8100-P", variant: "32T Power Meter", weight: 728, bikeType: "mtb", teeth: [32], speeds: "12-speed" },

    // XT M8200 Di2 (12-Speed, New 2025 Wireless)
    { id: "shimano-xt-m8200-30", model: "Shimano XT M8200 Di2", variant: "30T", weight: 520, bikeType: "mtb", teeth: [30], speeds: "12-speed" },
    { id: "shimano-xt-m8200-32", model: "Shimano XT M8200 Di2", variant: "32T", weight: 524, bikeType: "mtb", teeth: [32], speeds: "12-speed" },
    { id: "shimano-xt-m8200-34", model: "Shimano XT M8200 Di2", variant: "34T", weight: 532, bikeType: "mtb", teeth: [34], speeds: "12-speed" },
    { id: "shimano-xt-m8200-36", model: "Shimano XT M8200 Di2", variant: "36T", weight: 545, bikeType: "mtb", teeth: [36], speeds: "12-speed" },

    // XTR M9100 (12-Speed)
    { id: "shimano-xtr-m9100-28", model: "Shimano XTR M9100", variant: "28T", weight: 510, bikeType: "mtb", teeth: [28], speeds: "12-speed" },
    { id: "shimano-xtr-m9100-30", model: "Shimano XTR M9100", variant: "30T", weight: 516, bikeType: "mtb", teeth: [30], speeds: "12-speed" },
    { id: "shimano-xtr-m9100-32", model: "Shimano XTR M9100", variant: "32T", weight: 528, bikeType: "mtb", teeth: [32], speeds: "12-speed" },
    { id: "shimano-xtr-m9100-34", model: "Shimano XTR M9100", variant: "34T", weight: 539, bikeType: "mtb", teeth: [34], speeds: "12-speed" },
    { id: "shimano-xtr-m9100-36", model: "Shimano XTR M9100", variant: "36T", weight: 551, bikeType: "mtb", teeth: [36], speeds: "12-speed" },
    { id: "shimano-xtr-m9100-38", model: "Shimano XTR M9100", variant: "38T", weight: 560, bikeType: "mtb", teeth: [38], speeds: "12-speed" },
    { id: "shimano-xtr-m9100-p-32", model: "Shimano XTR M9100-P", variant: "32T Power Meter", weight: 628, bikeType: "mtb", teeth: [32], speeds: "12-speed" },

    // XTR M9200 Di2 (12-Speed XC, New 2025 Wireless)
    { id: "shimano-xtr-m9200-30", model: "Shimano XTR M9200 Di2 XC", variant: "30T", weight: 565, bikeType: "mtb", teeth: [30], speeds: "12-speed" },
    { id: "shimano-xtr-m9200-32", model: "Shimano XTR M9200 Di2 XC", variant: "32T", weight: 570, bikeType: "mtb", teeth: [32], speeds: "12-speed" },
    { id: "shimano-xtr-m9200-34", model: "Shimano XTR M9200 Di2 XC", variant: "34T", weight: 578, bikeType: "mtb", teeth: [34], speeds: "12-speed" },
    { id: "shimano-xtr-m9200-36", model: "Shimano XTR M9200 Di2 XC", variant: "36T", weight: 590, bikeType: "mtb", teeth: [36], speeds: "12-speed" },
    { id: "shimano-xtr-m9200-38", model: "Shimano XTR M9200 Di2 XC", variant: "38T", weight: 600, bikeType: "mtb", teeth: [38], speeds: "12-speed" },

    // XTR M9220 Di2 (12-Speed Enduro/Trail, New 2025 Wireless)
    { id: "shimano-xtr-m9220-30", model: "Shimano XTR M9220 Di2 Enduro", variant: "30T", weight: 595, bikeType: "mtb", teeth: [30], speeds: "12-speed" },
    { id: "shimano-xtr-m9220-32", model: "Shimano XTR M9220 Di2 Enduro", variant: "32T", weight: 599, bikeType: "mtb", teeth: [32], speeds: "12-speed" },
    { id: "shimano-xtr-m9220-34", model: "Shimano XTR M9220 Di2 Enduro", variant: "34T", weight: 607, bikeType: "mtb", teeth: [34], speeds: "12-speed" },
    { id: "shimano-xtr-m9220-36", model: "Shimano XTR M9220 Di2 Enduro", variant: "36T", weight: 619, bikeType: "mtb", teeth: [36], speeds: "12-speed" },

    // Zee M640 (10-Speed Freeride/Downhill)
    { id: "shimano-zee-m640-36", model: "Shimano Zee M640", variant: "36T", weight: 820, bikeType: "mtb", teeth: [36], speeds: "10-speed" },

    // Saint M820 (10-Speed Downhill)
    { id: "shimano-saint-m820-36", model: "Shimano Saint M820", variant: "36T", weight: 680, bikeType: "mtb", teeth: [36], speeds: "10-speed" },
    { id: "shimano-saint-m820-38", model: "Shimano Saint M820", variant: "38T", weight: 690, bikeType: "mtb", teeth: [38], speeds: "10-speed" },

        // ================================
    // SRAM ROAD CRANKSETS
    // ================================

    // Apex D1 DUB (12-Speed, Mechanical or AXS)
    { id: "sram-apex-d1-dub-38t", model: "SRAM Apex D1 DUB", variant: "38T", weight: 780, bikeType: "road", teeth: [38], speeds: "12-speed" },
    { id: "sram-apex-d1-dub-40t", model: "SRAM Apex D1 DUB", variant: "40T", weight: 785, bikeType: "road", teeth: [40], speeds: "12-speed" },
    { id: "sram-apex-d1-dub-42t", model: "SRAM Apex D1 DUB", variant: "42T", weight: 790, bikeType: "road", teeth: [42], speeds: "12-speed" },
    { id: "sram-apex-d1-dub-44t", model: "SRAM Apex D1 DUB", variant: "44T", weight: 795, bikeType: "road", teeth: [44], speeds: "12-speed" },
    { id: "sram-apex-d1-dub-46t", model: "SRAM Apex D1 DUB", variant: "46T", weight: 800, bikeType: "road", teeth: [46], speeds: "12-speed" },
    { id: "sram-apex-d1-dub-48-35", model: "SRAM Apex D1 DUB", variant: "48/35T", weight: 810, bikeType: "road", teeth: [48, 35], speeds: "12-speed" },
    { id: "sram-apex-d1-dub-wide-43-30", model: "SRAM Apex D1 DUB Wide", variant: "43/30T", weight: 815, bikeType: "road", teeth: [43, 30], speeds: "12-speed" },

    // Rival eTap AXS (12-Speed)
    { id: "sram-rival-axs-38t", model: "SRAM Rival eTap AXS 1x", variant: "38T", weight: 735, bikeType: "road", teeth: [38], speeds: "12-speed" },
    { id: "sram-rival-axs-40t", model: "SRAM Rival eTap AXS 1x", variant: "40T", weight: 740, bikeType: "road", teeth: [40], speeds: "12-speed" },
    { id: "sram-rival-axs-42t", model: "SRAM Rival eTap AXS 1x", variant: "42T", weight: 745, bikeType: "road", teeth: [42], speeds: "12-speed" },
    { id: "sram-rival-axs-44t", model: "SRAM Rival eTap AXS 1x", variant: "44T", weight: 750, bikeType: "road", teeth: [44], speeds: "12-speed" },
    { id: "sram-rival-axs-46t", model: "SRAM Rival eTap AXS 1x", variant: "46T", weight: 755, bikeType: "road", teeth: [46], speeds: "12-speed" },
    { id: "sram-rival-axs-46-33", model: "SRAM Rival eTap AXS", variant: "46/33T", weight: 822, bikeType: "road", teeth: [46, 33], speeds: "12-speed" },
    { id: "sram-rival-axs-48-35", model: "SRAM Rival eTap AXS", variant: "48/35T", weight: 825, bikeType: "road", teeth: [48, 35], speeds: "12-speed" },
    { id: "sram-rival-axs-pm-48-35", model: "SRAM Rival eTap AXS Power Meter", variant: "48/35T Power Meter", weight: 875, bikeType: "road", teeth: [48, 35], speeds: "12-speed" },

    // Force eTap AXS (12-Speed, 2025 Updated)
    { id: "sram-force-axs-38t", model: "SRAM Force eTap AXS 1x", variant: "38T", weight: 680, bikeType: "road", teeth: [38], speeds: "12-speed" },
    { id: "sram-force-axs-40t", model: "SRAM Force eTap AXS 1x", variant: "40T", weight: 685, bikeType: "road", teeth: [40], speeds: "12-speed" },
    { id: "sram-force-axs-42t", model: "SRAM Force eTap AXS 1x", variant: "42T", weight: 690, bikeType: "road", teeth: [42], speeds: "12-speed" },
    { id: "sram-force-axs-44t", model: "SRAM Force eTap AXS 1x", variant: "44T", weight: 695, bikeType: "road", teeth: [44], speeds: "12-speed" },
    { id: "sram-force-axs-46t", model: "SRAM Force eTap AXS 1x", variant: "46T", weight: 700, bikeType: "road", teeth: [46], speeds: "12-speed" },
    { id: "sram-force-axs-46-33", model: "SRAM Force eTap AXS", variant: "46/33T", weight: 738, bikeType: "road", teeth: [46, 33], speeds: "12-speed" },
    { id: "sram-force-axs-48-35", model: "SRAM Force eTap AXS", variant: "48/35T", weight: 740, bikeType: "road", teeth: [48, 35], speeds: "12-speed" },
    { id: "sram-force-axs-50-37", model: "SRAM Force eTap AXS", variant: "50/37T", weight: 747, bikeType: "road", teeth: [50, 37], speeds: "12-speed" },
    { id: "sram-force-axs-wide-43-30", model: "SRAM Force eTap AXS Wide", variant: "43/30T", weight: 760, bikeType: "road", teeth: [43, 30], speeds: "12-speed" },
    { id: "sram-force-axs-pm-46-33", model: "SRAM Force eTap AXS Power Meter", variant: "46/33T Power Meter", weight: 788, bikeType: "road", teeth: [46, 33], speeds: "12-speed" },
    { id: "sram-force-axs-pm-48-35", model: "SRAM Force eTap AXS Power Meter", variant: "48/35T Power Meter", weight: 790, bikeType: "road", teeth: [48, 35], speeds: "12-speed" },
    { id: "sram-force-axs-pm-50-37", model: "SRAM Force eTap AXS Power Meter", variant: "50/37T Power Meter", weight: 797, bikeType: "road", teeth: [50, 37], speeds: "12-speed" },

    // Red AXS 2024 (12-Speed, Carries into 2025)
    { id: "sram-red-axs-2024-40t", model: "SRAM Red AXS 2024 1x", variant: "40T", weight: 490, bikeType: "road", teeth: [40], speeds: "12-speed" },
    { id: "sram-red-axs-2024-42t", model: "SRAM Red AXS 2024 1x", variant: "42T", weight: 495, bikeType: "road", teeth: [42], speeds: "12-speed" },
    { id: "sram-red-axs-2024-44t", model: "SRAM Red AXS 2024 1x", variant: "44T", weight: 500, bikeType: "road", teeth: [44], speeds: "12-speed" },
    { id: "sram-red-axs-2024-46t", model: "SRAM Red AXS 2024 1x", variant: "46T", weight: 505, bikeType: "road", teeth: [46], speeds: "12-speed" },
    { id: "sram-red-axs-2024-48t", model: "SRAM Red AXS 2024 1x", variant: "48T", weight: 510, bikeType: "road", teeth: [48], speeds: "12-speed" },
    { id: "sram-red-axs-2024-50t", model: "SRAM Red AXS 2024 1x", variant: "50T", weight: 520, bikeType: "road", teeth: [50], speeds: "12-speed" },
    { id: "sram-red-axs-2024-46-33", model: "SRAM Red AXS 2024", variant: "46/33T", weight: 589, bikeType: "road", teeth: [46, 33], speeds: "12-speed" },
    { id: "sram-red-axs-2024-48-35", model: "SRAM Red AXS 2024", variant: "48/35T", weight: 591, bikeType: "road", teeth: [48, 35], speeds: "12-speed" },
    { id: "sram-red-axs-2024-50-37", model: "SRAM Red AXS 2024", variant: "50/37T", weight: 598, bikeType: "road", teeth: [50, 37], speeds: "12-speed" },
    { id: "sram-red-axs-2024-pm-46-33", model: "SRAM Red AXS 2024 Power Meter", variant: "46/33T Power Meter", weight: 639, bikeType: "road", teeth: [46, 33], speeds: "12-speed" },
    { id: "sram-red-axs-2024-pm-48-35", model: "SRAM Red AXS 2024 Power Meter", variant: "48/35T Power Meter", weight: 641, bikeType: "road", teeth: [48, 35], speeds: "12-speed" },
    { id: "sram-red-axs-2024-pm-50-37", model: "SRAM Red AXS 2024 Power Meter", variant: "50/37T Power Meter", weight: 648, bikeType: "road", teeth: [50, 37], speeds: "12-speed" },

        // ================================
    // SRAM GRAVEL CRANKSETS
    // ================================

    // Apex XPLR AXS (12-Speed)
    { id: "sram-apex-xplr-axs-1x-36", model: "SRAM Apex XPLR AXS 1x", variant: "36T", weight: 690, bikeType: "gravel", teeth: [36], speeds: "12-speed" },
    { id: "sram-apex-xplr-axs-1x-38", model: "SRAM Apex XPLR AXS 1x", variant: "38T", weight: 694, bikeType: "gravel", teeth: [38], speeds: "12-speed" },
    { id: "sram-apex-xplr-axs-1x-40", model: "SRAM Apex XPLR AXS 1x", variant: "40T", weight: 698, bikeType: "gravel", teeth: [40], speeds: "12-speed" },
    { id: "sram-apex-xplr-axs-1x-42", model: "SRAM Apex XPLR AXS 1x", variant: "42T", weight: 702, bikeType: "gravel", teeth: [42], speeds: "12-speed" },
    { id: "sram-apex-xplr-axs-1x-44", model: "SRAM Apex XPLR AXS 1x", variant: "44T", weight: 706, bikeType: "gravel", teeth: [44], speeds: "12-speed" },
    { id: "sram-apex-xplr-axs-1x-46", model: "SRAM Apex XPLR AXS 1x", variant: "46T", weight: 710, bikeType: "gravel", teeth: [46], speeds: "12-speed" },

    // Rival XPLR AXS (12-Speed)
    { id: "sram-rival-xplr-axs-1x-36", model: "SRAM Rival XPLR AXS 1x", variant: "36T", weight: 697, bikeType: "gravel", teeth: [36], speeds: "12-speed" },
    { id: "sram-rival-xplr-axs-1x-38", model: "SRAM Rival XPLR AXS 1x", variant: "38T", weight: 701, bikeType: "gravel", teeth: [38], speeds: "12-speed" },
    { id: "sram-rival-xplr-axs-1x-40", model: "SRAM Rival XPLR AXS 1x", variant: "40T", weight: 705, bikeType: "gravel", teeth: [40], speeds: "12-speed" },
    { id: "sram-rival-xplr-axs-1x-42", model: "SRAM Rival XPLR AXS 1x", variant: "42T", weight: 712, bikeType: "gravel", teeth: [42], speeds: "12-speed" },
    { id: "sram-rival-xplr-axs-1x-44", model: "SRAM Rival XPLR AXS 1x", variant: "44T", weight: 716, bikeType: "gravel", teeth: [44], speeds: "12-speed" },
    { id: "sram-rival-xplr-axs-1x-46", model: "SRAM Rival XPLR AXS 1x", variant: "46T", weight: 720, bikeType: "gravel", teeth: [46], speeds: "12-speed" },
    { id: "sram-rival-xplr-axs-pm-1x-40", model: "SRAM Rival XPLR AXS Power Meter 1x", variant: "40T Power Meter", weight: 755, bikeType: "gravel", teeth: [40], speeds: "12-speed" },
    { id: "sram-rival-xplr-axs-pm-1x-42", model: "SRAM Rival XPLR AXS Power Meter 1x", variant: "42T Power Meter", weight: 762, bikeType: "gravel", teeth: [42], speeds: "12-speed" },

    // Force XPLR AXS (12-Speed)
    { id: "sram-force-xplr-axs-1x-36", model: "SRAM Force XPLR AXS 1x", variant: "36T", weight: 652, bikeType: "gravel", teeth: [36], speeds: "12-speed" },
    { id: "sram-force-xplr-axs-1x-38", model: "SRAM Force XPLR AXS 1x", variant: "38T", weight: 656, bikeType: "gravel", teeth: [38], speeds: "12-speed" },
    { id: "sram-force-xplr-axs-1x-40", model: "SRAM Force XPLR AXS 1x", variant: "40T", weight: 660, bikeType: "gravel", teeth: [40], speeds: "12-speed" },
    { id: "sram-force-xplr-axs-1x-42", model: "SRAM Force XPLR AXS 1x", variant: "42T", weight: 666, bikeType: "gravel", teeth: [42], speeds: "12-speed" },
    { id: "sram-force-xplr-axs-1x-44", model: "SRAM Force XPLR AXS 1x", variant: "44T", weight: 670, bikeType: "gravel", teeth: [44], speeds: "12-speed" },
    { id: "sram-force-xplr-axs-1x-46", model: "SRAM Force XPLR AXS 1x", variant: "46T", weight: 674, bikeType: "gravel", teeth: [46], speeds: "12-speed" },
    { id: "sram-force-xplr-axs-pm-1x-40", model: "SRAM Force XPLR AXS Power Meter 1x", variant: "40T Power Meter", weight: 710, bikeType: "gravel", teeth: [40], speeds: "12-speed" },
    { id: "sram-force-xplr-axs-pm-1x-44", model: "SRAM Force XPLR AXS Power Meter 1x", variant: "44T Power Meter", weight: 720, bikeType: "gravel", teeth: [44], speeds: "12-speed" },
    { id: "sram-force-wide-axs-43-30", model: "SRAM Force Wide AXS", variant: "43/30T", weight: 760, bikeType: "gravel", teeth: [43, 30], speeds: "12-speed" },
    { id: "sram-force-wide-axs-pm-43-30", model: "SRAM Force Wide AXS Power Meter", variant: "43/30T Power Meter", weight: 810, bikeType: "gravel", teeth: [43, 30], speeds: "12-speed" },

    // Red AXS for Gravel (12-Speed, 1x Configurations)
    { id: "sram-red-axs-1x-40", model: "SRAM Red AXS 1x", variant: "40T", weight: 490, bikeType: "gravel", teeth: [40], speeds: "12-speed" },
    { id: "sram-red-axs-1x-42", model: "SRAM Red AXS 1x", variant: "42T", weight: 495, bikeType: "gravel", teeth: [42], speeds: "12-speed" },
    { id: "sram-red-axs-1x-44", model: "SRAM Red AXS 1x", variant: "44T", weight: 500, bikeType: "gravel", teeth: [44], speeds: "12-speed" },
    { id: "sram-red-axs-1x-46", model: "SRAM Red AXS 1x", variant: "46T", weight: 505, bikeType: "gravel", teeth: [46], speeds: "12-speed" },
    { id: "sram-red-axs-1x-48", model: "SRAM Red AXS 1x", variant: "48T", weight: 510, bikeType: "gravel", teeth: [48], speeds: "12-speed" },
    { id: "sram-red-axs-pm-1x-40", model: "SRAM Red AXS Power Meter 1x", variant: "40T Power Meter", weight: 540, bikeType: "gravel", teeth: [40], speeds: "12-speed" },
    { id: "sram-red-axs-pm-1x-46", model: "SRAM Red AXS Power Meter 1x", variant: "46T Power Meter", weight: 555, bikeType: "gravel", teeth: [46], speeds: "12-speed" },
     
        // ================================
    // SRAM MTB CRANKSETS
    // ================================

    // SX Eagle (12-Speed)
    { id: "sram-sx-eagle-28", model: "SRAM SX Eagle", variant: "28T", weight: 775, bikeType: "mtb", teeth: [28], speeds: "12-speed" },
    { id: "sram-sx-eagle-30", model: "SRAM SX Eagle", variant: "30T", weight: 780, bikeType: "mtb", teeth: [30], speeds: "12-speed" },
    { id: "sram-sx-eagle-32", model: "SRAM SX Eagle", variant: "32T", weight: 785, bikeType: "mtb", teeth: [32], speeds: "12-speed" },
    { id: "sram-sx-eagle-34", model: "SRAM SX Eagle", variant: "34T", weight: 790, bikeType: "mtb", teeth: [34], speeds: "12-speed" },

    // NX Eagle (12-Speed)
    { id: "sram-nx-eagle-28", model: "SRAM NX Eagle", variant: "28T", weight: 700, bikeType: "mtb", teeth: [28], speeds: "12-speed" },
    { id: "sram-nx-eagle-30", model: "SRAM NX Eagle", variant: "30T", weight: 705, bikeType: "mtb", teeth: [30], speeds: "12-speed" },
    { id: "sram-nx-eagle-32", model: "SRAM NX Eagle", variant: "32T", weight: 712, bikeType: "mtb", teeth: [32], speeds: "12-speed" },
    { id: "sram-nx-eagle-34", model: "SRAM NX Eagle", variant: "34T", weight: 718, bikeType: "mtb", teeth: [34], speeds: "12-speed" },
    { id: "sram-nx-eagle-36-22", model: "SRAM NX Eagle 2x", variant: "36/22T", weight: 760, bikeType: "mtb", teeth: [36, 22], speeds: "12-speed" },

    // GX Eagle (12-Speed)
    { id: "sram-gx-eagle-28", model: "SRAM GX Eagle", variant: "28T", weight: 615, bikeType: "mtb", teeth: [28], speeds: "12-speed" },
    { id: "sram-gx-eagle-30", model: "SRAM GX Eagle", variant: "30T", weight: 620, bikeType: "mtb", teeth: [30], speeds: "12-speed" },
    { id: "sram-gx-eagle-32", model: "SRAM GX Eagle", variant: "32T", weight: 630, bikeType: "mtb", teeth: [32], speeds: "12-speed", popular: true },
    { id: "sram-gx-eagle-34", model: "SRAM GX Eagle", variant: "34T", weight: 640, bikeType: "mtb", teeth: [34], speeds: "12-speed" },
    { id: "sram-gx-eagle-36", model: "SRAM GX Eagle", variant: "36T", weight: 650, bikeType: "mtb", teeth: [36], speeds: "12-speed" },
    { id: "sram-gx-eagle-38", model: "SRAM GX Eagle", variant: "38T", weight: 660, bikeType: "mtb", teeth: [38], speeds: "12-speed" },

    // X01 Eagle (12-Speed)
    { id: "sram-x01-eagle-30", model: "SRAM X01 Eagle", variant: "30T", weight: 480, bikeType: "mtb", teeth: [30], speeds: "12-speed" },
    { id: "sram-x01-eagle-32", model: "SRAM X01 Eagle", variant: "32T", weight: 486, bikeType: "mtb", teeth: [32], speeds: "12-speed" },
    { id: "sram-x01-eagle-34", model: "SRAM X01 Eagle", variant: "34T", weight: 494, bikeType: "mtb", teeth: [34], speeds: "12-speed" },
    { id: "sram-x01-eagle-36", model: "SRAM X01 Eagle", variant: "36T", weight: 502, bikeType: "mtb", teeth: [36], speeds: "12-speed" },
    { id: "sram-x01-eagle-pm-32", model: "SRAM X01 Eagle Power Meter", variant: "32T Power Meter", weight: 536, bikeType: "mtb", teeth: [32], speeds: "12-speed" },

    // XX1 Eagle (12-Speed)
    { id: "sram-xx1-eagle-30", model: "SRAM XX1 Eagle", variant: "30T", weight: 416, bikeType: "mtb", teeth: [30], speeds: "12-speed" },
    { id: "sram-xx1-eagle-32", model: "SRAM XX1 Eagle", variant: "32T", weight: 422, bikeType: "mtb", teeth: [32], speeds: "12-speed" },
    { id: "sram-xx1-eagle-34", model: "SRAM XX1 Eagle", variant: "34T", weight: 431, bikeType: "mtb", teeth: [34], speeds: "12-speed" },
    { id: "sram-xx1-eagle-36", model: "SRAM XX1 Eagle", variant: "36T", weight: 440, bikeType: "mtb", teeth: [36], speeds: "12-speed" },
    { id: "sram-xx1-eagle-pm-32", model: "SRAM XX1 Eagle Power Meter", variant: "32T Power Meter", weight: 472, bikeType: "mtb", teeth: [32], speeds: "12-speed" },

    // Eagle 70 Transmission (12-Speed, New 2025 Mechanical T-Type Entry-Level)
    { id: "sram-eagle-70-t-type-30", model: "SRAM Eagle 70 T-Type", variant: "30T", weight: 750, bikeType: "mtb", teeth: [30], speeds: "12-speed" },
    { id: "sram-eagle-70-t-type-32", model: "SRAM Eagle 70 T-Type", variant: "32T", weight: 755, bikeType: "mtb", teeth: [32], speeds: "12-speed" },
    { id: "sram-eagle-70-t-type-34", model: "SRAM Eagle 70 T-Type", variant: "34T", weight: 760, bikeType: "mtb", teeth: [34], speeds: "12-speed" },

    // Eagle 90 Transmission (12-Speed, New 2025 Mechanical T-Type Mid-Range)
    { id: "sram-eagle-90-t-type-30", model: "SRAM Eagle 90 T-Type", variant: "30T", weight: 680, bikeType: "mtb", teeth: [30], speeds: "12-speed" },
    { id: "sram-eagle-90-t-type-32", model: "SRAM Eagle 90 T-Type", variant: "32T", weight: 685, bikeType: "mtb", teeth: [32], speeds: "12-speed" },
    { id: "sram-eagle-90-t-type-34", model: "SRAM Eagle 90 T-Type", variant: "34T", weight: 690, bikeType: "mtb", teeth: [34], speeds: "12-speed" },

    // GX Eagle T-Type (12-Speed)
    { id: "sram-gx-eagle-t-type-30", model: "SRAM GX Eagle T-Type", variant: "30T", weight: 710, bikeType: "mtb", teeth: [30], speeds: "12-speed" },
    { id: "sram-gx-eagle-t-type-32", model: "SRAM GX Eagle T-Type", variant: "32T", weight: 716, bikeType: "mtb", teeth: [32], speeds: "12-speed" },
    { id: "sram-gx-eagle-t-type-34", model: "SRAM GX Eagle T-Type", variant: "34T", weight: 722, bikeType: "mtb", teeth: [34], speeds: "12-speed" },

    // X0 Eagle T-Type (12-Speed)
    { id: "sram-x0-eagle-t-type-30", model: "SRAM X0 Eagle T-Type", variant: "30T", weight: 590, bikeType: "mtb", teeth: [30], speeds: "12-speed" },
    { id: "sram-x0-eagle-t-type-32", model: "SRAM X0 Eagle T-Type", variant: "32T", weight: 595, bikeType: "mtb", teeth: [32], speeds: "12-speed" },
    { id: "sram-x0-eagle-t-type-34", model: "SRAM X0 Eagle T-Type", variant: "34T", weight: 600, bikeType: "mtb", teeth: [34], speeds: "12-speed" },
    { id: "sram-x0-eagle-t-type-pm-32", model: "SRAM X0 Eagle T-Type Power Meter", variant: "32T Power Meter", weight: 645, bikeType: "mtb", teeth: [32], speeds: "12-speed" },

    // XX Eagle T-Type (12-Speed)
    { id: "sram-xx-eagle-t-type-30", model: "SRAM XX Eagle T-Type", variant: "30T", weight: 488, bikeType: "mtb", teeth: [30], speeds: "12-speed" },
    { id: "sram-xx-eagle-t-type-32", model: "SRAM XX Eagle T-Type", variant: "32T", weight: 493, bikeType: "mtb", teeth: [32], speeds: "12-speed" },
    { id: "sram-xx-eagle-t-type-34", model: "SRAM XX Eagle T-Type", variant: "34T", weight: 498, bikeType: "mtb", teeth: [34], speeds: "12-speed" },
    { id: "sram-xx-eagle-t-type-pm-32", model: "SRAM XX Eagle T-Type Power Meter", variant: "32T Power Meter", weight: 543, bikeType: "mtb", teeth: [32], speeds: "12-speed" },

    // XX SL Eagle T-Type (12-Speed, New 2025 Lightest Model)
    { id: "sram-xx-sl-eagle-t-type-30", model: "SRAM XX SL Eagle T-Type", variant: "30T", weight: 445, bikeType: "mtb", teeth: [30], speeds: "12-speed" },
    { id: "sram-xx-sl-eagle-t-type-32", model: "SRAM XX SL Eagle T-Type", variant: "32T", weight: 450, bikeType: "mtb", teeth: [32], speeds: "12-speed" },
    { id: "sram-xx-sl-eagle-t-type-34", model: "SRAM XX SL Eagle T-Type", variant: "34T", weight: 455, bikeType: "mtb", teeth: [34], speeds: "12-speed" },
    { id: "sram-xx-sl-eagle-t-type-pm-32", model: "SRAM XX SL Eagle T-Type Power Meter", variant: "32T Power Meter", weight: 500, bikeType: "mtb", teeth: [32], speeds: "12-speed" },

    // XX Eagle E-MTB (12-Speed, E-Bike Specific)
    { id: "sram-xx-eagle-emtb-32", model: "SRAM XX Eagle E-MTB", variant: "32T", weight: 275, bikeType: "mtb", teeth: [32], speeds: "12-speed" },
    { id: "sram-xx-eagle-emtb-34", model: "SRAM XX Eagle E-MTB", variant: "34T", weight: 280, bikeType: "mtb", teeth: [34], speeds: "12-speed" },

    // Stylo Carbon (12-Speed, Trail/Entry Carbon)
    { id: "sram-stylo-carbon-30", model: "SRAM Stylo Carbon", variant: "30T", weight: 520, bikeType: "mtb", teeth: [30], speeds: "12-speed" },
    { id: "sram-stylo-carbon-32", model: "SRAM Stylo Carbon", variant: "32T", weight: 525, bikeType: "mtb", teeth: [32], speeds: "12-speed" },
    { id: "sram-stylo-carbon-34", model: "SRAM Stylo Carbon", variant: "34T", weight: 530, bikeType: "mtb", teeth: [34], speeds: "12-speed" },

    // Descendant 6K (12-Speed, Trail/Aluminum)
    { id: "sram-descendant-6k-30", model: "SRAM Descendant 6K", variant: "30T", weight: 700, bikeType: "mtb", teeth: [30], speeds: "12-speed" },
    { id: "sram-descendant-6k-32", model: "SRAM Descendant 6K", variant: "32T", weight: 705, bikeType: "mtb", teeth: [32], speeds: "12-speed" },
    { id: "sram-descendant-6k-34", model: "SRAM Descendant 6K", variant: "34T", weight: 710, bikeType: "mtb", teeth: [34], speeds: "12-speed" },

    // X0 DH (10/11-Speed, Downhill/Gravity)
    { id: "sram-x0-dh-36", model: "SRAM X0 DH", variant: "36T", weight: 650, bikeType: "mtb", teeth: [36], speeds: "10/11-speed" },
    { id: "sram-x0-dh-38", model: "SRAM X0 DH", variant: "38T", weight: 660, bikeType: "mtb", teeth: [38], speeds: "10/11-speed" },
    
        // ================================
    // CAMPAGNOLO ROAD CRANKSETS
    // ================================

    // Centaur (11-Speed)
    { id: "campagnolo-centaur-50-34", model: "Campagnolo Centaur", variant: "50/34T", weight: 865, bikeType: "road", teeth: [50, 34], speeds: "11-speed" },
    { id: "campagnolo-centaur-52-36", model: "Campagnolo Centaur", variant: "52/36T", weight: 875, bikeType: "road", teeth: [52, 36], speeds: "11-speed" },
    { id: "campagnolo-centaur-53-39", model: "Campagnolo Centaur", variant: "53/39T", weight: 885, bikeType: "road", teeth: [53, 39], speeds: "11-speed" },

    // Chorus (12-Speed)
    { id: "campagnolo-chorus-48-32", model: "Campagnolo Chorus", variant: "48/32T", weight: 718, bikeType: "road", teeth: [48, 32], speeds: "12-speed" },
    { id: "campagnolo-chorus-50-34", model: "Campagnolo Chorus", variant: "50/34T", weight: 728, bikeType: "road", teeth: [50, 34], speeds: "12-speed" },
    { id: "campagnolo-chorus-52-36", model: "Campagnolo Chorus", variant: "52/36T", weight: 738, bikeType: "road", teeth: [52, 36], speeds: "12-speed" },
    { id: "campagnolo-chorus-53-39", model: "Campagnolo Chorus", variant: "53/39T", weight: 748, bikeType: "road", teeth: [53, 39], speeds: "12-speed" },

    // Record (12-Speed Mechanical)
    { id: "campagnolo-record-48-32", model: "Campagnolo Record", variant: "48/32T", weight: 688, bikeType: "road", teeth: [48, 32], speeds: "12-speed" },
    { id: "campagnolo-record-50-34", model: "Campagnolo Record", variant: "50/34T", weight: 698, bikeType: "road", teeth: [50, 34], speeds: "12-speed" },
    { id: "campagnolo-record-52-36", model: "Campagnolo Record", variant: "52/36T", weight: 710, bikeType: "road", teeth: [52, 36], speeds: "12-speed" },
    { id: "campagnolo-record-53-39", model: "Campagnolo Record", variant: "53/39T", weight: 720, bikeType: "road", teeth: [53, 39], speeds: "12-speed" },

    // Record EPS (12-Speed Electronic)
    { id: "campagnolo-record-eps-48-32", model: "Campagnolo Record EPS", variant: "48/32T", weight: 688, bikeType: "road", teeth: [48, 32], speeds: "12-speed" },
    { id: "campagnolo-record-eps-50-34", model: "Campagnolo Record EPS", variant: "50/34T", weight: 698, bikeType: "road", teeth: [50, 34], speeds: "12-speed" },
    { id: "campagnolo-record-eps-52-36", model: "Campagnolo Record EPS", variant: "52/36T", weight: 710, bikeType: "road", teeth: [52, 36], speeds: "12-speed" },
    { id: "campagnolo-record-eps-53-39", model: "Campagnolo Record EPS", variant: "53/39T", weight: 720, bikeType: "road", teeth: [53, 39], speeds: "12-speed" },

    // Super Record (12-Speed Mechanical)
    { id: "campagnolo-super-record-48-32", model: "Campagnolo Super Record", variant: "48/32T", weight: 608, bikeType: "road", teeth: [48, 32], speeds: "12-speed" },
    { id: "campagnolo-super-record-50-34", model: "Campagnolo Super Record", variant: "50/34T", weight: 618, bikeType: "road", teeth: [50, 34], speeds: "12-speed" },
    { id: "campagnolo-super-record-52-36", model: "Campagnolo Super Record", variant: "52/36T", weight: 628, bikeType: "road", teeth: [52, 36], speeds: "12-speed" },
    { id: "campagnolo-super-record-53-39", model: "Campagnolo Super Record", variant: "53/39T", weight: 638, bikeType: "road", teeth: [53, 39], speeds: "12-speed" },
    { id: "campagnolo-super-record-pm-50-34", model: "Campagnolo Super Record Power Meter", variant: "50/34T Power Meter", weight: 668, bikeType: "road", teeth: [50, 34], speeds: "12-speed" },
    { id: "campagnolo-super-record-pm-52-36", model: "Campagnolo Super Record Power Meter", variant: "52/36T Power Meter", weight: 678, bikeType: "road", teeth: [52, 36], speeds: "12-speed" },

    // Super Record EPS (12-Speed Electronic)
    { id: "campagnolo-super-record-eps-48-32", model: "Campagnolo Super Record EPS", variant: "48/32T", weight: 608, bikeType: "road", teeth: [48, 32], speeds: "12-speed" },
    { id: "campagnolo-super-record-eps-50-34", model: "Campagnolo Super Record EPS", variant: "50/34T", weight: 618, bikeType: "road", teeth: [50, 34], speeds: "12-speed" },
    { id: "campagnolo-super-record-eps-52-36", model: "Campagnolo Super Record EPS", variant: "52/36T", weight: 628, bikeType: "road", teeth: [52, 36], speeds: "12-speed" },
    { id: "campagnolo-super-record-eps-53-39", model: "Campagnolo Super Record EPS", variant: "53/39T", weight: 638, bikeType: "road", teeth: [53, 39], speeds: "12-speed" },

    // Super Record Wireless (13-Speed, 2025 Overhaul)
    { id: "campagnolo-super-record-wrl-45-29", model: "Campagnolo Super Record WRL", variant: "45/29T", weight: 595, bikeType: "road", teeth: [45, 29], speeds: "13-speed" },
    { id: "campagnolo-super-record-wrl-48-32", model: "Campagnolo Super Record WRL", variant: "48/32T", weight: 605, bikeType: "road", teeth: [48, 32], speeds: "13-speed" },
    { id: "campagnolo-super-record-wrl-50-34", model: "Campagnolo Super Record WRL", variant: "50/34T", weight: 615, bikeType: "road", teeth: [50, 34], speeds: "13-speed" },
    { id: "campagnolo-super-record-wrl-52-36", model: "Campagnolo Super Record WRL", variant: "52/36T", weight: 625, bikeType: "road", teeth: [52, 36], speeds: "13-speed" },
    { id: "campagnolo-super-record-wrl-53-39", model: "Campagnolo Super Record WRL", variant: "53/39T", weight: 635, bikeType: "road", teeth: [53, 39], speeds: "13-speed" },
    { id: "campagnolo-super-record-wrl-54-39", model: "Campagnolo Super Record WRL", variant: "54/39T", weight: 645, bikeType: "road", teeth: [54, 39], speeds: "13-speed" },
    { id: "campagnolo-super-record-wrl-pm-50-34", model: "Campagnolo Super Record WRL Power Meter", variant: "50/34T Power Meter", weight: 665, bikeType: "road", teeth: [50, 34], speeds: "13-speed" },
    { id: "campagnolo-super-record-wrl-pm-52-36", model: "Campagnolo Super Record WRL Power Meter", variant: "52/36T Power Meter", weight: 675, bikeType: "road", teeth: [52, 36], speeds: "13-speed" },

       // ================================
    // CAMPAGNOLO GRAVEL CRANKSETS
    // ================================

    // Ekar (13-Speed)
    { id: "campagnolo-ekar-38", model: "Campagnolo Ekar", variant: "38T", weight: 615, bikeType: "gravel", teeth: [38], speeds: "13-speed" },
    { id: "campagnolo-ekar-40", model: "Campagnolo Ekar", variant: "40T", weight: 620, bikeType: "gravel", teeth: [40], speeds: "13-speed" },
    { id: "campagnolo-ekar-42", model: "Campagnolo Ekar", variant: "42T", weight: 625, bikeType: "gravel", teeth: [42], speeds: "13-speed" },
    { id: "campagnolo-ekar-44", model: "Campagnolo Ekar", variant: "44T", weight: 630, bikeType: "gravel", teeth: [44], speeds: "13-speed" },

    // Ekar GT (13-Speed)
    { id: "campagnolo-ekar-gt-38", model: "Campagnolo Ekar GT", variant: "38T", weight: 650, bikeType: "gravel", teeth: [38], speeds: "13-speed" },
    { id: "campagnolo-ekar-gt-40", model: "Campagnolo Ekar GT", variant: "40T", weight: 655, bikeType: "gravel", teeth: [40], speeds: "13-speed" },
    { id: "campagnolo-ekar-gt-42", model: "Campagnolo Ekar GT", variant: "42T", weight: 660, bikeType: "gravel", teeth: [42], speeds: "13-speed" },
    { id: "campagnolo-ekar-gt-44", model: "Campagnolo Ekar GT", variant: "44T", weight: 665, bikeType: "gravel", teeth: [44], speeds: "13-speed" },

    // ================================
    // FSA CRANKSETS
    // ================================

    // Gossamer Pro (Road/Gravel Crossover, 10/11-Speed)
    { id: "fsa-gossamer-pro-46-30", model: "FSA Gossamer Pro", variant: "46/30T", weight: 745, bikeType: "road", teeth: [46, 30], speeds: "10/11-speed" },
    { id: "fsa-gossamer-pro-50-34", model: "FSA Gossamer Pro", variant: "50/34T", weight: 751, bikeType: "road", teeth: [50, 34], speeds: "10/11-speed" },
    { id: "fsa-gossamer-pro-52-36", model: "FSA Gossamer Pro", variant: "52/36T", weight: 760, bikeType: "road", teeth: [52, 36], speeds: "10/11-speed" },
    { id: "fsa-gossamer-pro-53-39", model: "FSA Gossamer Pro", variant: "53/39T", weight: 765, bikeType: "road", teeth: [53, 39], speeds: "10/11-speed" },
    { id: "fsa-gossamer-pro-agx-48-32", model: "FSA Gossamer Pro AGX+", variant: "48/32T", weight: 755, bikeType: ["road", "gravel"], teeth: [48, 32], speeds: "10/11-speed" },

    // SL-K Light (Road, 10/11-Speed)
    { id: "fsa-slk-light-50-34", model: "FSA SL-K Light", variant: "50/34T", weight: 619, bikeType: "road", teeth: [50, 34], speeds: "10/11-speed" },
    { id: "fsa-slk-light-52-36", model: "FSA SL-K Light", variant: "52/36T", weight: 625, bikeType: "road", teeth: [52, 36], speeds: "10/11-speed" },
    { id: "fsa-slk-light-53-39", model: "FSA SL-K Light", variant: "53/39T", weight: 630, bikeType: "road", teeth: [53, 39], speeds: "10/11-speed" },

    // ================================
    // CASSETTES
    // ================================
  ],
        // ================================
    // SHIMANO ROAD CASSETTES
    // ================================

    // Claris R2000 (8-Speed)
    { id: "shimano-claris-r2000-11-28", model: "Shimano Claris CS-HG50", variant: "11-28T", weight: 300, bikeType: "road", teeth: [11, 28], speeds: "8-speed" },
    { id: "shimano-claris-r2000-11-30", model: "Shimano Claris CS-HG50", variant: "11-30T", weight: 305, bikeType: "road", teeth: [11, 30], speeds: "8-speed" },
    { id: "shimano-claris-r2000-11-32", model: "Shimano Claris CS-HG50", variant: "11-32T", weight: 310, bikeType: "road", teeth: [11, 32], speeds: "8-speed" },
    { id: "shimano-claris-r2000-11-34", model: "Shimano Claris CS-HG50", variant: "11-34T", weight: 315, bikeType: "road", teeth: [11, 34], speeds: "8-speed" },

    // Sora R3000 (9-Speed)
    { id: "shimano-sora-r3000-11-28", model: "Shimano Sora CS-HG400", variant: "11-28T", weight: 315, bikeType: "road", teeth: [11, 28], speeds: "9-speed" },
    { id: "shimano-sora-r3000-11-30", model: "Shimano Sora CS-HG400", variant: "11-30T", weight: 320, bikeType: "road", teeth: [11, 30], speeds: "9-speed" },
    { id: "shimano-sora-r3000-11-32", model: "Shimano Sora CS-HG400", variant: "11-32T", weight: 323, bikeType: "road", teeth: [11, 32], speeds: "9-speed" },
    { id: "shimano-sora-r3000-11-34", model: "Shimano Sora CS-HG400", variant: "11-34T", weight: 330, bikeType: "road", teeth: [11, 34], speeds: "9-speed" },

    // Tiagra R4700 (10-Speed)
    { id: "shimano-tiagra-r4700-11-25", model: "Shimano Tiagra CS-HG500", variant: "11-25T", weight: 305, bikeType: "road", teeth: [11, 25], speeds: "10-speed" },
    { id: "shimano-tiagra-r4700-11-28", model: "Shimano Tiagra CS-HG500", variant: "11-28T", weight: 310, bikeType: "road", teeth: [11, 28], speeds: "10-speed" },
    { id: "shimano-tiagra-r4700-11-32", model: "Shimano Tiagra CS-HG500", variant: "11-32T", weight: 320, bikeType: "road", teeth: [11, 32], speeds: "10-speed" },
    { id: "shimano-tiagra-r4700-11-34", model: "Shimano Tiagra CS-HG500", variant: "11-34T", weight: 335, bikeType: "road", teeth: [11, 34], speeds: "10-speed" },

    // 105 R7000 (11-Speed)
    { id: "shimano-105-r7000-12-25", model: "Shimano 105 CS-R7000", variant: "12-25T", weight: 270, bikeType: "road", teeth: [12, 25], speeds: "11-speed" },
    { id: "shimano-105-r7000-11-28", model: "Shimano 105 CS-R7000", variant: "11-28T", weight: 284, bikeType: "road", teeth: [11, 28], speeds: "11-speed" },
    { id: "shimano-105-r7000-11-30", model: "Shimano 105 CS-R7000", variant: "11-30T", weight: 304, bikeType: "road", teeth: [11, 30], speeds: "11-speed" },
    { id: "shimano-105-r7000-11-32", model: "Shimano 105 CS-R7000", variant: "11-32T", weight: 320, bikeType: "road", teeth: [11, 32], speeds: "11-speed" },
    { id: "shimano-105-r7000-11-34", model: "Shimano 105 CS-R7000", variant: "11-34T", weight: 335, bikeType: "road", teeth: [11, 34], speeds: "11-speed" },

    // 105 R7100 (12-Speed Mechanical)
    { id: "shimano-105-r7100-11-34", model: "Shimano 105 CS-R7100", variant: "11-34T", weight: 361, bikeType: "road", teeth: [11, 34], speeds: "12-speed" },
    { id: "shimano-105-r7100-11-36", model: "Shimano 105 CS-R7100", variant: "11-36T", weight: 391, bikeType: "road", teeth: [11, 36], speeds: "12-speed" },

    // 105 R7170 Di2 (12-Speed Electronic)
    { id: "shimano-105-r7170-11-34", model: "Shimano 105 CS-R7170 Di2", variant: "11-34T", weight: 361, bikeType: "road", teeth: [11, 34], speeds: "12-speed" },
    { id: "shimano-105-r7170-11-36", model: "Shimano 105 CS-R7170 Di2", variant: "11-36T", weight: 391, bikeType: "road", teeth: [11, 36], speeds: "12-speed" },

    // Ultegra R8000 (11-Speed)
    { id: "shimano-ultegra-r8000-12-25", model: "Shimano Ultegra CS-R8000", variant: "12-25T", weight: 240, bikeType: "road", teeth: [12, 25], speeds: "11-speed" },
    { id: "shimano-ultegra-r8000-14-28", model: "Shimano Ultegra CS-R8000", variant: "14-28T", weight: 245, bikeType: "road", teeth: [14, 28], speeds: "11-speed" },
    { id: "shimano-ultegra-r8000-11-28", model: "Shimano Ultegra CS-R8000", variant: "11-28T", weight: 251, bikeType: "road", teeth: [11, 28], speeds: "11-speed" },
    { id: "shimano-ultegra-r8000-11-30", model: "Shimano Ultegra CS-R8000", variant: "11-30T", weight: 269, bikeType: "road", teeth: [11, 30], speeds: "11-speed" },
    { id: "shimano-ultegra-r8000-11-32", model: "Shimano Ultegra CS-R8000", variant: "11-32T", weight: 292, bikeType: "road", teeth: [11, 32], speeds: "11-speed" },
    { id: "shimano-ultegra-r8000-11-34", model: "Shimano Ultegra CS-R8000", variant: "11-34T", weight: 335, bikeType: "road", teeth: [11, 34], speeds: "11-speed" },

    // Ultegra R8100 (12-Speed Mechanical)
    { id: "shimano-ultegra-r8100-11-28", model: "Shimano Ultegra CS-R8100", variant: "11-28T", weight: 280, bikeType: "road", teeth: [11, 28], speeds: "12-speed" },
    { id: "shimano-ultegra-r8100-11-30", model: "Shimano Ultegra CS-R8100", variant: "11-30T", weight: 297, bikeType: "road", teeth: [11, 30], speeds: "12-speed" },
    { id: "shimano-ultegra-r8100-11-34", model: "Shimano Ultegra CS-R8100", variant: "11-34T", weight: 345, bikeType: "road", teeth: [11, 34], speeds: "12-speed" },

    // Ultegra R8150 Di2 (12-Speed Electronic)
    { id: "shimano-ultegra-r8150-11-28", model: "Shimano Ultegra CS-R8150 Di2", variant: "11-28T", weight: 280, bikeType: "road", teeth: [11, 28], speeds: "12-speed" },
    { id: "shimano-ultegra-r8150-11-30", model: "Shimano Ultegra CS-R8150 Di2", variant: "11-30T", weight: 297, bikeType: "road", teeth: [11, 30], speeds: "12-speed" },
    { id: "shimano-ultegra-r8150-11-34", model: "Shimano Ultegra CS-R8150 Di2", variant: "11-34T", weight: 345, bikeType: "road", teeth: [11, 34], speeds: "12-speed" },

    // Dura-Ace R9100 (11-Speed)
    { id: "shimano-dura-ace-r9100-12-25", model: "Shimano Dura-Ace CS-R9100", variant: "12-25T", weight: 185, bikeType: "road", teeth: [12, 25], speeds: "11-speed" },
    { id: "shimano-dura-ace-r9100-14-28", model: "Shimano Dura-Ace CS-R9100", variant: "14-28T", weight: 190, bikeType: "road", teeth: [14, 28], speeds: "11-speed" },
    { id: "shimano-dura-ace-r9100-11-28", model: "Shimano Dura-Ace CS-R9100", variant: "11-28T", weight: 193, bikeType: "road", teeth: [11, 28], speeds: "11-speed" },
    { id: "shimano-dura-ace-r9100-11-30", model: "Shimano Dura-Ace CS-R9100", variant: "11-30T", weight: 211, bikeType: "road", teeth: [11, 30], speeds: "11-speed" },

    // Dura-Ace R9200 (12-Speed Mechanical)
    { id: "shimano-dura-ace-r9200-11-28", model: "Shimano Dura-Ace CS-R9200", variant: "11-28T", weight: 215, bikeType: "road", teeth: [11, 28], speeds: "12-speed" },
    { id: "shimano-dura-ace-r9200-11-30", model: "Shimano Dura-Ace CS-R9200", variant: "11-30T", weight: 223, bikeType: "road", teeth: [11, 30], speeds: "12-speed" },
    { id: "shimano-dura-ace-r9200-11-34", model: "Shimano Dura-Ace CS-R9200", variant: "11-34T", weight: 253, bikeType: "road", teeth: [11, 34], speeds: "12-speed" },

    // Dura-Ace R9250 Di2 (12-Speed Electronic)
    { id: "shimano-dura-ace-r9250-11-28", model: "Shimano Dura-Ace CS-R9250 Di2", variant: "11-28T", weight: 215, bikeType: "road", teeth: [11, 28], speeds: "12-speed" },
    { id: "shimano-dura-ace-r9250-11-30", model: "Shimano Dura-Ace CS-R9250 Di2", variant: "11-30T", weight: 223, bikeType: "road", teeth: [11, 30], speeds: "12-speed" },
    { id: "shimano-dura-ace-r9250-11-34", model: "Shimano Dura-Ace CS-R9250 Di2", variant: "11-34T", weight: 253, bikeType: "road", teeth: [11, 34], speeds: "12-speed" },
      
    // ================================
    // SHIMANO GRAVEL CASSETTES
    // ================================

    // GRX RX400 (10-Speed)
    { id: "shimano-grx-rx400-11-32", model: "Shimano Tiagra CS-HG500", variant: "11-32T", weight: 320, bikeType: "gravel", teeth: [11, 32], speeds: "10-speed" },
    { id: "shimano-grx-rx400-11-34", model: "Shimano Tiagra CS-HG500", variant: "11-34T", weight: 335, bikeType: "gravel", teeth: [11, 34], speeds: "10-speed" },

    // GRX RX600/RX810 (11-Speed Mechanical/Di2)
    { id: "shimano-grx-rx600-11-28", model: "Shimano 105 CS-R7000", variant: "11-28T", weight: 284, bikeType: "gravel", teeth: [11, 28], speeds: "11-speed" },
    { id: "shimano-grx-rx600-11-30", model: "Shimano 105 CS-R7000", variant: "11-30T", weight: 304, bikeType: "gravel", teeth: [11, 30], speeds: "11-speed" },
    { id: "shimano-grx-rx600-11-32", model: "Shimano 105 CS-R7000", variant: "11-32T", weight: 320, bikeType: "gravel", teeth: [11, 32], speeds: "11-speed" },
    { id: "shimano-grx-rx810-11-34", model: "Shimano Ultegra CS-R8000", variant: "11-34T", weight: 335, bikeType: "gravel", teeth: [11, 34], speeds: "11-speed" },
    { id: "shimano-grx-rx600-11-40", model: "Shimano SLX CS-M7000", variant: "11-40T", weight: 470, bikeType: "gravel", teeth: [11, 40], speeds: "11-speed" },
    { id: "shimano-grx-rx600-11-42", model: "Shimano SLX CS-M7000", variant: "11-42T", weight: 482, bikeType: "gravel", teeth: [11, 42], speeds: "11-speed" },
    { id: "shimano-grx-rx600-11-46", model: "Shimano Deore CS-M5100", variant: "11-46T", weight: 510, bikeType: "gravel", teeth: [11, 46], speeds: "11-speed" },

    // GRX RX820/RX610 (12-Speed Mechanical)
    { id: "shimano-grx-rx820-11-34", model: "Shimano 105 CS-HG710", variant: "11-34T", weight: 361, bikeType: "gravel", teeth: [11, 34], speeds: "12-speed" },
    { id: "shimano-grx-rx820-11-36", model: "Shimano 105 CS-HG710", variant: "11-36T", weight: 391, bikeType: "gravel", teeth: [11, 36], speeds: "12-speed" },
    { id: "shimano-grx-12s-10-45", model: "Shimano XT CS-M8100", variant: "10-45T", weight: 461, bikeType: "gravel", teeth: [10, 45], speeds: "12-speed" },
    { id: "shimano-grx-12s-10-51", model: "Shimano XT CS-M8100", variant: "10-51T", weight: 470, bikeType: "gravel", teeth: [10, 51], speeds: "12-speed" },
    { id: "shimano-grx-12s-slx-10-51", model: "Shimano SLX CS-M7100", variant: "10-51T", weight: 466, bikeType: "gravel", teeth: [10, 51], speeds: "12-speed" },
    { id: "shimano-grx-12s-deore-10-51", model: "Shimano Deore CS-M6100", variant: "10-51T", weight: 534, bikeType: "gravel", teeth: [10, 51], speeds: "12-speed" },

    // GRX RX825/RX827 Di2 (12-Speed Wireless, 2025)
    { id: "shimano-grx-rx825-11-34", model: "Shimano 105 CS-HG710 Di2 Compatible", variant: "11-34T", weight: 361, bikeType: "gravel", teeth: [11, 34], speeds: "12-speed" },
    { id: "shimano-grx-rx825-11-36", model: "Shimano 105 CS-HG710 Di2 Compatible", variant: "11-36T", weight: 391, bikeType: "gravel", teeth: [11, 36], speeds: "12-speed" },
    { id: "shimano-grx-rx827-10-45", model: "Shimano XT CS-M8100 Di2 Compatible", variant: "10-45T", weight: 461, bikeType: "gravel", teeth: [10, 45], speeds: "12-speed" },
    { id: "shimano-grx-rx827-10-51", model: "Shimano XT CS-M8100 Di2 Compatible", variant: "10-51T", weight: 470, bikeType: "gravel", teeth: [10, 51], speeds: "12-speed" },

    // ================================
    // SHIMANO MTB CASSETTES
    // ================================

    // Alivio (9-Speed)
    { id: "shimano-alivio-11-32", model: "Shimano Alivio CS-HG400", variant: "11-32T", weight: 340, bikeType: "mtb", teeth: [11, 32], speeds: "9-speed" },
    { id: "shimano-alivio-11-34", model: "Shimano Alivio CS-HG400", variant: "11-34T", weight: 350, bikeType: "mtb", teeth: [11, 34], speeds: "9-speed" },
    { id: "shimano-alivio-11-36", model: "Shimano Alivio CS-HG400", variant: "11-36T", weight: 360, bikeType: "mtb", teeth: [11, 36], speeds: "9-speed" },

    // CUES Linkglide (9-11 Speed)
    { id: "shimano-cues-lg300-11-43", model: "Shimano CUES LG300", variant: "11-43T", weight: 500, bikeType: "mtb", teeth: [11, 43], speeds: "9-speed" },
    { id: "shimano-cues-lg400-11-46", model: "Shimano CUES LG400", variant: "11-46T", weight: 512, bikeType: "mtb", teeth: [11, 46], speeds: "9-speed" },
    { id: "shimano-cues-lg600-11-50", model: "Shimano CUES LG600", variant: "11-50T", weight: 634, bikeType: "mtb", teeth: [11, 50], speeds: "10-speed" },
    { id: "shimano-cues-lg700-11-50", model: "Shimano CUES LG700", variant: "11-50T", weight: 620, bikeType: "mtb", teeth: [11, 50], speeds: "11-speed" },
    { id: "shimano-xt-m8130-11-50", model: "Shimano XT M8130 LinkGlide", variant: "11-50T", weight: 630, bikeType: "mtb", teeth: [11, 50], speeds: "11-speed" },

    // Deore M5100 (11-Speed)
    { id: "shimano-deore-m5100-11-42", model: "Shimano Deore M5100", variant: "11-42T", weight: 550, bikeType: "mtb", teeth: [11, 42], speeds: "11-speed" },
    { id: "shimano-deore-m5100-11-51", model: "Shimano Deore M5100", variant: "11-51T", weight: 623, bikeType: "mtb", teeth: [11, 51], speeds: "11-speed" },

    // Deore M6100 (12-Speed)
    { id: "shimano-deore-m6100-10-45", model: "Shimano Deore M6100", variant: "10-45T", weight: 580, bikeType: "mtb", teeth: [10, 45], speeds: "12-speed" },
    { id: "shimano-deore-m6100-10-51", model: "Shimano Deore M6100", variant: "10-51T", weight: 593, bikeType: "mtb", teeth: [10, 51], speeds: "12-speed" },

    // SLX M7100 (12-Speed)
    { id: "shimano-slx-m7100-10-45", model: "Shimano SLX M7100", variant: "10-45T", weight: 513, bikeType: "mtb", teeth: [10, 45], speeds: "12-speed" },
    { id: "shimano-slx-m7100-10-51", model: "Shimano SLX M7100", variant: "10-51T", weight: 534, bikeType: "mtb", teeth: [10, 51], speeds: "12-speed" },

    // XT M8100 (12-Speed Mechanical)
    { id: "shimano-xt-m8100-10-45", model: "Shimano XT M8100", variant: "10-45T", weight: 461, bikeType: "mtb", teeth: [10, 45], speeds: "12-speed" },
    { id: "shimano-xt-m8100-10-51", model: "Shimano XT M8100", variant: "10-51T", weight: 470, bikeType: "mtb", teeth: [10, 51], speeds: "12-speed" },

    // XT M8200 Di2 (12-Speed, New 2025 Wireless)
    { id: "shimano-xt-m8200-10-45", model: "Shimano XT M8200 Di2", variant: "10-45T", weight: 461, bikeType: "mtb", teeth: [10, 45], speeds: "12-speed" },
    { id: "shimano-xt-m8200-10-51", model: "Shimano XT M8200 Di2", variant: "10-51T", weight: 470, bikeType: "mtb", teeth: [10, 51], speeds: "12-speed" },

    // XTR M9100 (12-Speed Mechanical)
    { id: "shimano-xtr-m9100-10-45", model: "Shimano XTR M9100", variant: "10-45T", weight: 357, bikeType: "mtb", teeth: [10, 45], speeds: "12-speed" },
    { id: "shimano-xtr-m9100-10-51", model: "Shimano XTR M9100", variant: "10-51T", weight: 367, bikeType: "mtb", teeth: [10, 51], speeds: "12-speed" },

    // XTR M9200 Di2 (12-Speed XC, New 2025 Wireless)
    { id: "shimano-xtr-m9200-10-45", model: "Shimano XTR M9200 Di2 XC", variant: "10-45T", weight: 357, bikeType: "mtb", teeth: [10, 45], speeds: "12-speed" },
    { id: "shimano-xtr-m9200-10-51", model: "Shimano XTR M9200 Di2 XC", variant: "10-51T", weight: 367, bikeType: "mtb", teeth: [10, 51], speeds: "12-speed" },

    // XTR M9220 Di2 (12-Speed Enduro/Trail, New 2025 Wireless)
    { id: "shimano-xtr-m9220-10-45", model: "Shimano XTR M9220 Di2 Enduro", variant: "10-45T", weight: 357, bikeType: "mtb", teeth: [10, 45], speeds: "12-speed" },
    { id: "shimano-xtr-m9220-10-51", model: "Shimano XTR M9220 Di2 Enduro", variant: "10-51T", weight: 367, bikeType: "mtb", teeth: [10, 51], speeds: "12-speed" },

    // Saint M820 (10-Speed Downhill)
    { id: "shimano-saint-m820-11-32", model: "Shimano Saint M820", variant: "11-32T", weight: 280, bikeType: "mtb", teeth: [11, 32], speeds: "10-speed" },
    { id: "shimano-saint-m820-11-36", model: "Shimano Saint M820", variant: "11-36T", weight: 300, bikeType: "mtb", teeth: [11, 36], speeds: "10-speed" },

    // Zee M640 (10-Speed Freeride)
    { id: "shimano-zee-m640-11-32", model: "Shimano Zee M640", variant: "11-32T", weight: 290, bikeType: "mtb", teeth: [11, 32], speeds: "10-speed" },
    { id: "shimano-zee-m640-11-36", model: "Shimano Zee M640", variant: "11-36T", weight: 310, bikeType: "mtb", teeth: [11, 36], speeds: "10-speed" },


    // ================================
    // SRAM ROAD & GRAVEL CASSETTES
    // ================================

    // Apex 12-Speed (XPLR & Eagle)
    { id: "sram-apex-pg1230-11-36", model: "SRAM Apex PG-1230", variant: "11-36T", weight: 400, bikeType: "gravel", teeth: [11, 36], speeds: "12-speed" },
    { id: "sram-apex-xplr-pg1231-11-44", model: "SRAM Apex PG-1231", variant: "11-44T", weight: 426, bikeType: "gravel", teeth: [11, 44], speeds: "12-speed" },
    { id: "sram-apex-eagle-pg1210-11-50", model: "SRAM Apex PG-1210", variant: "11-50T", weight: 630, bikeType: "gravel", teeth: [11, 50], speeds: "12-speed" },

    // Rival AXS 12-Speed
    { id: "sram-rival-xg1250-10-28", model: "SRAM Rival XG-1250", variant: "10-28T", weight: 270, bikeType: "road", teeth: [10, 28], speeds: "12-speed" },
    { id: "sram-rival-xg1250-10-30", model: "SRAM Rival XG-1250", variant: "10-30T", weight: 282, bikeType: "road", teeth: [10, 30], speeds: "12-speed" },
    { id: "sram-rival-xg1250-10-36", model: "SRAM Rival XG-1250", variant: "10-36T", weight: 338, bikeType: "road", teeth: [10, 36], speeds: "12-speed" },
    { id: "sram-rival-xplr-xg1251-10-44", model: "SRAM Rival XPLR XG-1251", variant: "10-44T", weight: 412, bikeType: "gravel", teeth: [10, 44], speeds: "12-speed" },

    // Force AXS 12-Speed
    { id: "sram-force-xg1270-10-28", model: "SRAM Force XG-1270", variant: "10-28T", weight: 227, bikeType: "road", teeth: [10, 28], speeds: "12-speed" },
    { id: "sram-force-xg1270-10-30", model: "SRAM Force XG-1270", variant: "10-30T", weight: 245, bikeType: "road", teeth: [10, 30], speeds: "12-speed" },
    { id: "sram-force-xg1270-10-33", model: "SRAM Force XG-1270", variant: "10-33T", weight: 261, bikeType: "road", teeth: [10, 33], speeds: "12-speed" },
    { id: "sram-force-xg1270-10-36", model: "SRAM Force XG-1270", variant: "10-36T", weight: 280, bikeType: "road", teeth: [10, 36], speeds: "12-speed" },
    { id: "sram-force-xplr-xg1271-10-44", model: "SRAM Force XPLR XG-1271", variant: "10-44T", weight: 373, bikeType: "gravel", teeth: [10, 44], speeds: "12-speed" },

    // Red AXS 2024/2025 (12-Speed Road)
    { id: "sram-red-xg1290-2024-10-28", model: "SRAM Red XG-1290 2024", variant: "10-28T", weight: 180, bikeType: "road", teeth: [10, 28], speeds: "12-speed" },
    { id: "sram-red-xg1290-2024-10-30", model: "SRAM Red XG-1290 2024", variant: "10-30T", weight: 200, bikeType: "road", teeth: [10, 30], speeds: "12-speed" },
    { id: "sram-red-xg1290-2024-10-33", model: "SRAM Red XG-1290 2024", variant: "10-33T", weight: 218, bikeType: "road", teeth: [10, 33], speeds: "12-speed" },
    { id: "sram-red-xg1290-2024-10-36", model: "SRAM Red XG-1290 2024", variant: "10-36T", weight: 232, bikeType: "road", teeth: [10, 36], speeds: "12-speed" },

    // Red XPLR AXS (13-Speed Gravel, 2024/2025)
    { id: "sram-red-xplr-xg1391-10-46", model: "SRAM Red XPLR XG-1391", variant: "10-46T", weight: 250, bikeType: "gravel", teeth: [10, 46], speeds: "13-speed" },

        // ================================
    // SRAM MTB CASSETTES
    // ================================

    // SX Eagle (12-Speed)
    { id: "sram-sx-eagle-11-50", model: "SRAM SX Eagle PG-1210", variant: "11-50T", weight: 630, bikeType: "mtb", teeth: [11, 50], speeds: "12-speed" },
    { id: "sram-sx-eagle-11-52", model: "SRAM SX Eagle PG-1210", variant: "11-52T", weight: 640, bikeType: "mtb", teeth: [11, 52], speeds: "12-speed" },

    // NX Eagle (12-Speed)
    { id: "sram-nx-eagle-11-50", model: "SRAM NX Eagle PG-1230", variant: "11-50T", weight: 615, bikeType: "mtb", teeth: [11, 50], speeds: "12-speed" },
    { id: "sram-nx-eagle-11-52", model: "SRAM NX Eagle PG-1230", variant: "11-52T", weight: 625, bikeType: "mtb", teeth: [11, 52], speeds: "12-speed" },

    // GX Eagle (12-Speed)
    { id: "sram-gx-eagle-10-46", model: "SRAM GX Eagle XG-1275", variant: "10-46T", weight: 440, bikeType: "mtb", teeth: [10, 46], speeds: "12-speed" },
    { id: "sram-gx-eagle-10-50", model: "SRAM GX Eagle XG-1275", variant: "10-50T", weight: 450, bikeType: "mtb", teeth: [10, 50], speeds: "12-speed" },
    { id: "sram-gx-eagle-10-52", model: "SRAM GX Eagle XG-1275", variant: "10-52T", weight: 452, bikeType: "mtb", teeth: [10, 52], speeds: "12-speed" },

    // X01 Eagle (12-Speed)
    { id: "sram-x01-eagle-10-50", model: "SRAM X01 Eagle XG-1295", variant: "10-50T", weight: 355, bikeType: "mtb", teeth: [10, 50], speeds: "12-speed" },
    { id: "sram-x01-eagle-10-52", model: "SRAM X01 Eagle XG-1295", variant: "10-52T", weight: 357, bikeType: "mtb", teeth: [10, 52], speeds: "12-speed" },

    // XX1 Eagle (12-Speed)
    { id: "sram-xx1-eagle-10-50", model: "SRAM XX1 Eagle XG-1299", variant: "10-50T", weight: 350, bikeType: "mtb", teeth: [10, 50], speeds: "12-speed" },
    { id: "sram-xx1-eagle-10-52", model: "SRAM XX1 Eagle XG-1299", variant: "10-52T", weight: 353, bikeType: "mtb", teeth: [10, 52], speeds: "12-speed" },

    // Eagle 70 T-Type (12-Speed Mechanical, New 2025 Entry-Level)
    { id: "sram-eagle-70-t-type-10-52", model: "SRAM Eagle 70 T-Type XS-1270", variant: "10-52T", weight: 450, bikeType: "mtb", teeth: [10, 52], speeds: "12-speed" },

    // Eagle 90 T-Type (12-Speed Mechanical, New 2025 Mid-Range)
    { id: "sram-eagle-90-t-type-10-52", model: "SRAM Eagle 90 T-Type XS-1290", variant: "10-52T", weight: 400, bikeType: "mtb", teeth: [10, 52], speeds: "12-speed" },

    // GX Eagle T-Type (12-Speed)
    { id: "sram-gx-eagle-t-type-10-52", model: "SRAM GX Eagle T-Type XS-1275", variant: "10-52T", weight: 445, bikeType: "mtb", teeth: [10, 52], speeds: "12-speed" },

    // X0 Eagle T-Type (12-Speed)
    { id: "sram-x0-eagle-t-type-10-52", model: "SRAM X0 Eagle T-Type XS-1295", variant: "10-52T", weight: 385, bikeType: "mtb", teeth: [10, 52], speeds: "12-speed" },

    // XX Eagle T-Type (12-Speed)
    { id: "sram-xx-eagle-t-type-10-52", model: "SRAM XX Eagle T-Type XS-1297", variant: "10-52T", weight: 350, bikeType: "mtb", teeth: [10, 52], speeds: "12-speed" },

    // XX SL Eagle T-Type (12-Speed, New 2025 Lightest Model)
    { id: "sram-xx-sl-eagle-t-type-10-52", model: "SRAM XX SL Eagle T-Type XS-1299", variant: "10-52T", weight: 300, bikeType: "mtb", teeth: [10, 52], speeds: "12-speed" },

    // X0 DH (7-Speed Downhill)
    { id: "sram-x0-dh-pg720-11-25", model: "SRAM X0 DH PG-720", variant: "11-25T", weight: 200, bikeType: "mtb", teeth: [11, 25], speeds: "7-speed" },
    { id: "sram-x0-dh-pg720-11-28", model: "SRAM X0 DH PG-720", variant: "11-28T", weight: 210, bikeType: "mtb", teeth: [11, 28], speeds: "7-speed" },
   
    // ================================
    // CAMPAGNOLO CASSETTES
    // ================================

    // Chorus (12-Speed)
    { id: "campagnolo-chorus-11-27", model: "Campagnolo Chorus", variant: "11-27T", weight: 295, bikeType: "road", teeth: [11, 27], speeds: "12-speed" },
    { id: "campagnolo-chorus-11-29", model: "Campagnolo Chorus", variant: "11-29T", weight: 305, bikeType: "road", teeth: [11, 29], speeds: "12-speed" },
    { id: "campagnolo-chorus-11-32", model: "Campagnolo Chorus", variant: "11-32T", weight: 325, bikeType: "road", teeth: [11, 32], speeds: "12-speed" },
    { id: "campagnolo-chorus-11-34", model: "Campagnolo Chorus", variant: "11-34T", weight: 345, bikeType: "road", teeth: [11, 34], speeds: "12-speed" },

    // Record (12-Speed Mechanical)
    { id: "campagnolo-record-11-27", model: "Campagnolo Record", variant: "11-27T", weight: 260, bikeType: "road", teeth: [11, 27], speeds: "12-speed" },
    { id: "campagnolo-record-11-29", model: "Campagnolo Record", variant: "11-29T", weight: 266, bikeType: "road", teeth: [11, 29], speeds: "12-speed" },
    { id: "campagnolo-record-11-32", model: "Campagnolo Record", variant: "11-32T", weight: 288, bikeType: "road", teeth: [11, 32], speeds: "12-speed" },
    { id: "campagnolo-record-11-34", model: "Campagnolo Record", variant: "11-34T", weight: 305, bikeType: "road", teeth: [11, 34], speeds: "12-speed" },

    // Record EPS (12-Speed Electronic)
    { id: "campagnolo-record-eps-11-27", model: "Campagnolo Record EPS", variant: "11-27T", weight: 260, bikeType: "road", teeth: [11, 27], speeds: "12-speed" },
    { id: "campagnolo-record-eps-11-29", model: "Campagnolo Record EPS", variant: "11-29T", weight: 266, bikeType: "road", teeth: [11, 29], speeds: "12-speed" },
    { id: "campagnolo-record-eps-11-32", model: "Campagnolo Record EPS", variant: "11-32T", weight: 288, bikeType: "road", teeth: [11, 32], speeds: "12-speed" },
    { id: "campagnolo-record-eps-11-34", model: "Campagnolo Record EPS", variant: "11-34T", weight: 305, bikeType: "road", teeth: [11, 34], speeds: "12-speed" },

    // Super Record (12-Speed Mechanical)
    { id: "campagnolo-super-record-11-27", model: "Campagnolo Super Record", variant: "11-27T", weight: 260, bikeType: "road", teeth: [11, 27], speeds: "12-speed" },
    { id: "campagnolo-super-record-11-29", model: "Campagnolo Super Record", variant: "11-29T", weight: 266, bikeType: "road", teeth: [11, 29], speeds: "12-speed" },
    { id: "campagnolo-super-record-11-32", model: "Campagnolo Super Record", variant: "11-32T", weight: 288, bikeType: "road", teeth: [11, 32], speeds: "12-speed" },
    { id: "campagnolo-super-record-11-34", model: "Campagnolo Super Record", variant: "11-34T", weight: 305, bikeType: "road", teeth: [11, 34], speeds: "12-speed" },

    // Super Record EPS (12-Speed Electronic)
    { id: "campagnolo-super-record-eps-11-27", model: "Campagnolo Super Record EPS", variant: "11-27T", weight: 260, bikeType: "road", teeth: [11, 27], speeds: "12-speed" },
    { id: "campagnolo-super-record-eps-11-29", model: "Campagnolo Super Record EPS", variant: "11-29T", weight: 266, bikeType: "road", teeth: [11, 29], speeds: "12-speed" },
    { id: "campagnolo-super-record-eps-11-32", model: "Campagnolo Super Record EPS", variant: "11-32T", weight: 288, bikeType: "road", teeth: [11, 32], speeds: "12-speed" },
    { id: "campagnolo-super-record-eps-11-34", model: "Campagnolo Super Record EPS", variant: "11-34T", weight: 305, bikeType: "road", teeth: [11, 34], speeds: "12-speed" },

    // Super Record Wireless (13-Speed, 2025 Overhaul)
    { id: "campagnolo-super-record-wrl-10-25", model: "Campagnolo Super Record WRL", variant: "10-25T", weight: 280, bikeType: "road", teeth: [10, 25], speeds: "13-speed" },
    { id: "campagnolo-super-record-wrl-10-27", model: "Campagnolo Super Record WRL", variant: "10-27T", weight: 285, bikeType: "road", teeth: [10, 27], speeds: "13-speed" },
    { id: "campagnolo-super-record-wrl-10-29", model: "Campagnolo Super Record WRL", variant: "10-29T", weight: 295, bikeType: "road", teeth: [10, 29], speeds: "13-speed" },
    { id: "campagnolo-super-record-wrl-11-29", model: "Campagnolo Super Record WRL", variant: "11-29T", weight: 300, bikeType: "road", teeth: [11, 29], speeds: "13-speed" },
    { id: "campagnolo-super-record-wrl-11-32", model: "Campagnolo Super Record WRL", variant: "11-32T", weight: 320, bikeType: "road", teeth: [11, 32], speeds: "13-speed" },
    { id: "campagnolo-super-record-wrl-11-34", model: "Campagnolo Super Record WRL", variant: "11-34T", weight: 340, bikeType: "road", teeth: [11, 34], speeds: "13-speed" },

    // Ekar (13-Speed Gravel)
    { id: "campagnolo-ekar-9-36", model: "Campagnolo Ekar", variant: "9-36T", weight: 340, bikeType: "gravel", teeth: [9, 36], speeds: "13-speed" },
    { id: "campagnolo-ekar-9-42", model: "Campagnolo Ekar", variant: "9-42T", weight: 390, bikeType: "gravel", teeth: [9, 42], speeds: "13-speed" },
    { id: "campagnolo-ekar-10-44", model: "Campagnolo Ekar", variant: "10-44T", weight: 410, bikeType: "gravel", teeth: [10, 44], speeds: "13-speed" },

    // Ekar GT (13-Speed Gravel)
    { id: "campagnolo-ekar-gt-9-42", model: "Campagnolo Ekar GT", variant: "9-42T", weight: 395, bikeType: "gravel", teeth: [9, 42], speeds: "13-speed" },
    { id: "campagnolo-ekar-gt-10-48", model: "Campagnolo Ekar GT", variant: "10-48T", weight: 435, bikeType: "gravel", teeth: [10, 48], speeds: "13-speed" },
  ]
};

export const getComponentsForBikeType = (bikeType) => {
  const relevantBikeTypes = [bikeType];
  if (bikeType === 'gravel') {
    // Allow gravel bikes to use MTB components for 'mullet' setups
    relevantBikeTypes.push('mtb');
  }

  const cranksets = componentDatabase.cranksets.filter(c => relevantBikeTypes.includes(c.bikeType));
  const cassettes = componentDatabase.cassettes.filter(c => relevantBikeTypes.includes(c.bikeType));

  return {
    cranksets,
    cassettes,
  };
};
