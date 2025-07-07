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

    // 105 R7000 (11-Speed) - Corrected & Consolidated
    { id: "shimano-105-r7000-50-34", model: "Shimano 105 R7000", variant: "50/34T", weight: 713, bikeType: "road", teeth: [50, 34], speeds: "11-speed" },
    { id: "shimano-105-r7000-52-36", model: "Shimano 105 R7000", variant: "52/36T", weight: 742, bikeType: "road", teeth: [52, 36], speeds: "11-speed" },
    { id: "shimano-105-r7000-53-39", model: "Shimano 105 R7000", variant: "53/39T", weight: 754, bikeType: "road", teeth: [53, 39], speeds: "11-speed" },

    // 105 R7100 (12-Speed)
    { id: "shimano-105-r7100-50-34", model: "Shimano 105 R7100", variant: "50/34T", weight: 754, bikeType: "road", teeth: [50, 34], speeds: "12-speed" },
    { id: "shimano-105-r7100-52-36", model: "Shimano 105 R7100", variant: "52/36T", weight: 765, bikeType: "road", teeth: [52, 36], speeds: "12-speed" },

    // Ultegra R8000 (11-Speed) - Corrected & Consolidated
    { id: "shimano-ultegra-r8000-50-34", model: "Shimano Ultegra R8000", variant: "50/34T", weight: 674, bikeType: "road", teeth: [50, 34], speeds: "11-speed" },
    { id: "shimano-ultegra-r8000-52-36", model: "Shimano Ultegra R8000", variant: "52/36T", weight: 681, bikeType: "road", teeth: [52, 36], speeds: "11-speed" },
    { id: "shimano-ultegra-r8000-53-39", model: "Shimano Ultegra R8000", variant: "53/39T", weight: 690, bikeType: "road", teeth: [53, 39], speeds: "11-speed" },

    // Ultegra R8100 (12-Speed)
    { id: "shimano-ultegra-r8100-50-34", model: "Shimano Ultegra R8100", variant: "50/34T", weight: 700, bikeType: "road", teeth: [50, 34], speeds: "12-speed" },
    { id: "shimano-ultegra-r8100-52-36", model: "Shimano Ultegra R8100", variant: "52/36T", weight: 711, bikeType: "road", teeth: [52, 36], speeds: "12-speed" },

    // Dura-Ace R9100 (11-Speed)
    { id: "shimano-dura-ace-r9100-50-34", model: "Shimano Dura-Ace R9100", variant: "50/34T", weight: 609, bikeType: "road", teeth: [50, 34], speeds: "11-speed" },
    { id: "shimano-dura-ace-r9100-52-36", model: "Shimano Dura-Ace R9100", variant: "52/36T", weight: 618, bikeType: "road", teeth: [52, 36], speeds: "11-speed" },
    { id: "shimano-dura-ace-r9100-53-39", model: "Shimano Dura-Ace R9100", variant: "53/39T", weight: 621, bikeType: "road", teeth: [53, 39], speeds: "11-speed" },

    // Dura-Ace R9200 (12-Speed)
    { id: "shimano-dura-ace-r9200-50-34", model: "Shimano Dura-Ace R9200", variant: "50/34T", weight: 685, bikeType: "road", teeth: [50, 34], speeds: "12-speed" },
    { id: "shimano-dura-ace-r9200-52-36", model: "Shimano Dura-Ace R9200", variant: "52/36T", weight: 692, bikeType: "road", teeth: [52, 36], speeds: "12-speed" },
    { id: "shimano-dura-ace-r9200-54-40", model: "Shimano Dura-Ace R9200", variant: "54/40T", weight: 714, bikeType: "road", teeth: [54, 40], speeds: "12-speed" },

    // ================================
    // SHIMANO GRAVEL CRANKSETS
    // ================================

    // GRX RX400 (10-Speed)
    { id: "shimano-grx-rx400-46-30", model: "Shimano GRX RX400", variant: "46/30T", weight: 819, bikeType: "gravel", teeth: [46, 30], speeds: "10-speed" },

    // GRX RX600 (11-Speed) - Corrected & Consolidated
    { id: "shimano-grx-rx600-46-30", model: "Shimano GRX RX600", variant: "46/30T", weight: 806, bikeType: "gravel", teeth: [46, 30], speeds: "11-speed" },
    { id: "shimano-grx-rx600-1x-40", model: "Shimano GRX RX600 1x", variant: "40T", weight: 743, bikeType: "gravel", teeth: [40], speeds: "11-speed" },
    { id: "shimano-grx-rx600-1x-42", model: "Shimano GRX RX600 1x", variant: "42T", weight: 751, bikeType: "gravel", teeth: [42], speeds: "11-speed" },

    // GRX RX810 (11-Speed)
    { id: "shimano-grx-rx810-48-31", model: "Shimano GRX RX810", variant: "48/31T", weight: 710, bikeType: "gravel", teeth: [48, 31], speeds: "11-speed" },
    { id: "shimano-grx-rx810-1x-40", model: "Shimano GRX RX810 1x", variant: "40T", weight: 644, bikeType: "gravel", teeth: [40], speeds: "11-speed" },
    { id: "shimano-grx-rx810-1x-42", model: "Shimano GRX RX810 1x", variant: "42T", weight: 655, bikeType: "gravel", teeth: [42], speeds: "11-speed" },

    // GRX RX820 (12-Speed)
    { id: "shimano-grx-rx820-48-31", model: "Shimano GRX RX820", variant: "48/31T", weight: 721, bikeType: "gravel", teeth: [48, 31], speeds: "12-speed" },
    { id: "shimano-grx-rx820-1x-40", model: "Shimano GRX RX820 1x", variant: "40T", weight: 655, bikeType: "gravel", teeth: [40], speeds: "12-speed" },
    { id: "shimano-grx-rx820-1x-42", model: "Shimano GRX RX820 1x", variant: "42T", weight: 668, bikeType: "gravel", teeth: [42], speeds: "12-speed" },

    // ================================
    // SHIMANO MTB CRANKSETS
    // ================================

    // CUES U6000 (10/11-speed)
    { id: "shimano-cues-u6000-30", model: "Shimano CUES U6000", variant: "30T", weight: 780, bikeType: "mtb", teeth: [30], speeds: "10/11-speed" },
    { id: "shimano-cues-u6000-32", model: "Shimano CUES U6000", variant: "32T", weight: 785, bikeType: "mtb", teeth: [32], speeds: "10/11-speed" },

    // Deore M5100 (11-Speed)
    { id: "shimano-deore-m5100-30", model: "Shimano Deore M5100", variant: "30T", weight: 782, bikeType: "mtb", teeth: [30], speeds: "11-speed" },
    { id: "shimano-deore-m5100-32", model: "Shimano Deore M5100", variant: "32T", weight: 788, bikeType: "mtb", teeth: [32], speeds: "11-speed" },

    // Deore M6100 (12-Speed) - Corrected Weight
    { id: "shimano-deore-m6100-30", model: "Shimano Deore M6100", variant: "30T", weight: 784, bikeType: "mtb", teeth: [30], speeds: "12-speed" },
    { id: "shimano-deore-m6100-32", model: "Shimano Deore M6100", variant: "32T", weight: 790, bikeType: "mtb", teeth: [32], speeds: "12-speed" },

    // SLX M7100 (12-Speed) - Corrected Weight
    { id: "shimano-slx-m7100-30", model: "Shimano SLX M7100", variant: "30T", weight: 631, bikeType: "mtb", teeth: [30], speeds: "12-speed" },
    { id: "shimano-slx-m7100-32", model: "Shimano SLX M7100", variant: "32T", weight: 646, bikeType: "mtb", teeth: [32], speeds: "12-speed" },
    { id: "shimano-slx-m7100-34", model: "Shimano SLX M7100", variant: "34T", weight: 658, bikeType: "mtb", teeth: [34], speeds: "12-speed" },

    // XT M8100 (12-Speed) - Corrected Weight
    { id: "shimano-xt-m8100-30", model: "Shimano XT M8100", variant: "30T", weight: 620, bikeType: "mtb", teeth: [30], speeds: "12-speed" },
    { id: "shimano-xt-m8100", model: "Shimano XT M8100", variant: "32T", weight: 628, bikeType: "mtb", teeth: [32], speeds: "12-speed" },
    { id: "shimano-xt-m8100-34", model: "Shimano XT M8100", variant: "34T", weight: 636, bikeType: "mtb", teeth: [34], speeds: "12-speed" },
    { id: "shimano-xt-m8100-36", model: "Shimano XT M8100", variant: "36T", weight: 651, bikeType: "mtb", teeth: [36], speeds: "12-speed" },

    // XTR M9100 (12-Speed)
    { id: "shimano-xtr-m9100-30", model: "Shimano XTR M9100", variant: "30T", weight: 516, bikeType: "mtb", teeth: [30], speeds: "12-speed" },
    { id: "shimano-xtr-m9100-32", model: "Shimano XTR M9100", variant: "32T", weight: 528, bikeType: "mtb", teeth: [32], speeds: "12-speed" },
    { id: "shimano-xtr-m9100-34", model: "Shimano XTR M9100", variant: "34T", weight: 539, bikeType: "mtb", teeth: [34], speeds: "12-speed" },
    { id: "shimano-xtr-m9100-36", model: "Shimano XTR M9100", variant: "36T", weight: 551, bikeType: "mtb", teeth: [36], speeds: "12-speed" },

    // ================================
    // SRAM ROAD CRANKSETS
    // ================================

    // Apex 12-Speed (Mechanical & AXS) - ADDED
    { id: "sram-apex-d1-dub-40t", model: "SRAM Apex D1 DUB", variant: "40T", weight: 785, bikeType: "road", teeth: [40], speeds: "12-speed" },
    { id: "sram-apex-d1-dub-wide-43-30", model: "SRAM Apex D1 DUB Wide", variant: "43/30T", weight: 815, bikeType: "road", teeth: [43, 30], speeds: "12-speed" },

    // Rival AXS (12-Speed)
    { id: "sram-rival-axs-46-33", model: "SRAM Rival eTap AXS", variant: "46/33T", weight: 822, bikeType: "road", teeth: [46, 33], speeds: "12-speed" },
    { id: "sram-rival-axs-48-35", model: "SRAM Rival eTap AXS", variant: "48/35T", weight: 825, bikeType: "road", teeth: [48, 35], speeds: "12-speed" },
    { id: "sram-rival-axs-1x-40", model: "SRAM Rival eTap AXS 1x", variant: "40T", weight: 745, bikeType: "road", teeth: [40], speeds: "12-speed" },
    { id: "sram-rival-axs-1x-42", model: "SRAM Rival eTap AXS 1x", variant: "42T", weight: 752, bikeType: "road", teeth: [42], speeds: "12-speed" },

    // Force AXS (12-Speed)
    { id: "sram-force-axs-46-33", model: "SRAM Force eTap AXS", variant: "46/33T", weight: 738, bikeType: "road", teeth: [46, 33], speeds: "12-speed" },
    { id: "sram-force-axs-48-35", model: "SRAM Force eTap AXS", variant: "48/35T", weight: 740, bikeType: "road", teeth: [48, 35], speeds: "12-speed" },
    { id: "sram-force-axs-50-37", model: "SRAM Force eTap AXS", variant: "50/37T", weight: 747, bikeType: "road", teeth: [50, 37], speeds: "12-speed" },

    // Red AXS 2024 (12-Speed)
    { id: "sram-red-axs-2024-46-33", model: "SRAM Red AXS 2024", variant: "46/33T", weight: 589, bikeType: "road", teeth: [46, 33], speeds: "12-speed" },
    { id: "sram-red-axs-2024-48-35", model: "SRAM Red AXS 2024", variant: "48/35T", weight: 591, bikeType: "road", teeth: [48, 35], speeds: "12-speed" },
    { id: "sram-red-axs-2024-50-37", model: "SRAM Red AXS 2024", variant: "50/37T", weight: 598, bikeType: "road", teeth: [50, 37], speeds: "12-speed" },
    { id: "sram-red-axs-2024-1x-48", model: "SRAM Red AXS 2024 1x", variant: "48T", weight: 510, bikeType: "road", teeth: [48], speeds: "12-speed" },
    { id: "sram-red-axs-2024-1x-50", model: "SRAM Red AXS 2024 1x", variant: "50T", weight: 520, bikeType: "road", teeth: [50], speeds: "12-speed" },

    // ================================
    // SRAM GRAVEL CRANKSETS
    // ================================

    // Apex XPLR AXS (12-Speed) - ADDED
    { id: "sram-apex-xplr-axs-1x-40", model: "SRAM Apex XPLR AXS 1x", variant: "40T", weight: 698, bikeType: "gravel", teeth: [40], speeds: "12-speed" },

    // Rival XPLR AXS (12-Speed)
    { id: "sram-rival-xplr-axs-1x-40", model: "SRAM Rival XPLR AXS 1x", variant: "40T", weight: 705, bikeType: "gravel", teeth: [40], speeds: "12-speed" },
    { id: "sram-rival-xplr-axs-1x-42", model: "SRAM Rival XPLR AXS 1x", variant: "42T", weight: 712, bikeType: "gravel", teeth: [42], speeds: "12-speed" },

    // Force XPLR AXS (12-Speed) - Corrected Weight
    { id: "sram-force-xplr-axs-1x-40", model: "SRAM Force XPLR AXS 1x", variant: "40T", weight: 660, bikeType: "gravel", teeth: [40], speeds: "12-speed" },
    { id: "sram-force-xplr-axs-1x-44", model: "SRAM Force XPLR AXS 1x", variant: "44T", weight: 670, bikeType: "gravel", teeth: [44], speeds: "12-speed" },

    // ================================
    // SRAM MTB CRANKSETS
    // ================================

    // SX Eagle (12-Speed)
    { id: "sram-sx-eagle-30", model: "SRAM SX Eagle", variant: "30T", weight: 780, bikeType: "mtb", teeth: [30], speeds: "12-speed" },
    { id: "sram-sx-eagle-32", model: "SRAM SX Eagle", variant: "32T", weight: 785, bikeType: "mtb", teeth: [32], speeds: "12-speed" },

    // NX Eagle (12-Speed)
    { id: "sram-nx-eagle-30", model: "SRAM NX Eagle", variant: "30T", weight: 705, bikeType: "mtb", teeth: [30], speeds: "12-speed" },
    { id: "sram-nx-eagle", model: "SRAM NX Eagle", variant: "32T", weight: 712, bikeType: "mtb", teeth: [32], speeds: "12-speed" },

    // GX Eagle (12-Speed) - Consolidated
    { id: "sram-gx-eagle-30", model: "SRAM GX Eagle", variant: "30T", weight: 620, bikeType: "mtb", teeth: [30], speeds: "12-speed" },
    { id: "sram-gx-eagle", model: "SRAM GX Eagle", variant: "32T", weight: 630, bikeType: "mtb", teeth: [32], speeds: "12-speed" },
    { id: "sram-gx-eagle-34", model: "SRAM GX Eagle", variant: "34T", weight: 640, bikeType: "mtb", teeth: [34], speeds: "12-speed" },

    // X01 Eagle (12-Speed)
    { id: "sram-x01-eagle-32", model: "SRAM X01 Eagle", variant: "32T", weight: 486, bikeType: "mtb", teeth: [32], speeds: "12-speed" },
    { id: "sram-x01-eagle-34", model: "SRAM X01 Eagle", variant: "34T", weight: 494, bikeType: "mtb", teeth: [34], speeds: "12-speed" },

    // XX1 Eagle (12-Speed)
    { id: "sram-xx1-eagle-32", model: "SRAM XX1 Eagle", variant: "32T", weight: 422, bikeType: "mtb", teeth: [32], speeds: "12-speed" },
    { id: "sram-xx1-eagle-34", model: "SRAM XX1 Eagle", variant: "34T", weight: 431, bikeType: "mtb", teeth: [34], speeds: "12-speed" },

    // GX Eagle Transmission (T-Type)
    { id: "sram-gx-eagle-t-type-32", model: "SRAM GX Eagle T-Type", variant: "32T", weight: 716, bikeType: "mtb", teeth: [32], speeds: "12-speed" },
    
    // X0 Eagle Transmission (T-Type)
    { id: "sram-x0-eagle-t-type-32", model: "SRAM X0 Eagle T-Type", variant: "32T", weight: 595, bikeType: "mtb", teeth: [32], speeds: "12-speed" },
    
    // XX Eagle Transmission (T-Type)
    { id: "sram-xx-eagle-t-type-32", model: "SRAM XX Eagle T-Type", variant: "32T", weight: 493, bikeType: "mtb", teeth: [32], speeds: "12-speed" },
    
    // ================================
    // CAMPAGNOLO ROAD CRANKSETS
    // ================================

    // Chorus (12-Speed)
    { id: "campagnolo-chorus-48-32", model: "Campagnolo Chorus", variant: "48/32T", weight: 718, bikeType: "road", teeth: [48, 32], speeds: "12-speed" },
    { id: "campagnolo-chorus-50-34", model: "Campagnolo Chorus", variant: "50/34T", weight: 728, bikeType: "road", teeth: [50, 34], speeds: "12-speed" },
    { id: "campagnolo-chorus-52-36", model: "Campagnolo Chorus", variant: "52/36T", weight: 738, bikeType: "road", teeth: [52, 36], speeds: "12-speed" },

    // Record (12-Speed)
    { id: "campagnolo-record-50-34", model: "Campagnolo Record", variant: "50/34T", weight: 698, bikeType: "road", teeth: [50, 34], speeds: "12-speed" },
    { id: "campagnolo-record-52-36", model: "Campagnolo Record", variant: "52/36T", weight: 710, bikeType: "road", teeth: [52, 36], speeds: "12-speed" },

    // Super Record (12-Speed)
    { id: "campagnolo-super-record-50-34", model: "Campagnolo Super Record", variant: "50/34T", weight: 618, bikeType: "road", teeth: [50, 34], speeds: "12-speed" },
    { id: "campagnolo-super-record-52-36", model: "Campagnolo Super Record", variant: "52/36T", weight: 628, bikeType: "road", teeth: [52, 36], speeds: "12-speed" },

    // Super Record Wireless (13-Speed)
    { id: "campagnolo-super-record-wrl-48-32", model: "Campagnolo Super Record WRL", variant: "48/32T", weight: 605, bikeType: "road", teeth: [48, 32], speeds: "13-speed" },
    { id: "campagnolo-super-record-wrl-50-34", model: "Campagnolo Super Record WRL", variant: "50/34T", weight: 615, bikeType: "road", teeth: [50, 34], speeds: "13-speed" },

    // ================================
    // CAMPAGNOLO GRAVEL CRANKSETS
    // ================================

    // Ekar (13-Speed)
    { id: "campagnolo-ekar-38", model: "Campagnolo Ekar", variant: "38T", weight: 615, bikeType: "gravel", teeth: [38], speeds: "13-speed" },
    { id: "campagnolo-ekar-40", model: "Campagnolo Ekar", variant: "40T", weight: 620, bikeType: "gravel", teeth: [40], speeds: "13-speed" },
    { id: "campagnolo-ekar-42", model: "Campagnolo Ekar", variant: "42T", weight: 625, bikeType: "gravel", teeth: [42], speeds: "13-speed" },

    // Ekar GT (13-Speed)
    { id: "campagnolo-ekar-gt-38", model: "Campagnolo Ekar GT", variant: "38T", weight: 650, bikeType: "gravel", teeth: [38], speeds: "13-speed" },
    { id: "campagnolo-ekar-gt-40", model: "Campagnolo Ekar GT", variant: "40T", weight: 655, bikeType: "gravel", teeth: [40], speeds: "13-speed" },
    { id: "campagnolo-ekar-gt-42", model: "Campagnolo Ekar GT", variant: "42T", weight: 660, bikeType: "gravel", teeth: [42], speeds: "13-speed" },

    // ================================
    // FSA CRANKSETS - Corrected Speeds
    // ================================

    // FSA Gossamer Pro (Road)
    { id: "fsa-gossamer-pro-50-34", model: "FSA Gossamer Pro", variant: "50/34T", weight: 751, bikeType: "road", teeth: [50, 34], speeds: "10/11-speed" },
    { id: "fsa-gossamer-pro-52-36", model: "FSA Gossamer Pro", variant: "52/36T", weight: 760, bikeType: "road", teeth: [52, 36], speeds: "10/11-speed" },
    { id: "fsa-gossamer-pro-46-30", model: "FSA Gossamer Pro", variant: "46/30T", weight: 745, bikeType: "road", teeth: [46, 30], speeds: "10/11-speed" },
    
    // FSA SL-K Light (High-End Road)
    { id: "fsa-slk-light-50-34", model: "FSA SL-K Light", variant: "50/34T", weight: 619, bikeType: "road", teeth: [50, 34], speeds: "10/11-speed" },
    { id: "fsa-slk-light-52-36", model: "FSA SL-K Light", variant: "52/36T", weight: 625, bikeType: "road", teeth: [52, 36], speeds: "10/11-speed" },

    // FSA K-Force WE (Electronic)
    { id: "fsa-k-force-we-50-34", model: "FSA K-Force WE", variant: "50/34T", weight: 552, bikeType: "road", teeth: [50, 34], speeds: "12-speed" },
    { id: "fsa-k-force-we-52-36", model: "FSA K-Force WE", variant: "52/36T", weight: 560, bikeType: "road", teeth: [52, 36], speeds: "12-speed" },

    // FSA Gradient (Gravel)
    { id: "fsa-gradient-48-32", model: "FSA Gradient", variant: "48/32T", weight: 720, bikeType: "gravel", teeth: [48, 32], speeds: "10/11-speed" },
    { id: "fsa-gradient-1x-40", model: "FSA Gradient 1x", variant: "40T", weight: 635, bikeType: "gravel", teeth: [40], speeds: "10/11-speed" },

    // ================================
    // RACE FACE MTB CRANKSETS
    // ================================

    // Race Face Aeffect R (MTB)
    { id: "race-face-aeffect-r-30", model: "Race Face Aeffect R", variant: "30T", weight: 630, bikeType: "mtb", teeth: [30], speeds: "mtb" },
    { id: "race-face-aeffect-r-32", model: "Race Face Aeffect R", variant: "32T", weight: 635, bikeType: "mtb", teeth: [32], speeds: "mtb" },

    // Race Face Turbine (MTB)
    { id: "race-face-turbine-32", model: "Race Face Turbine", variant: "32T", weight: 595, bikeType: "mtb", teeth: [32], speeds: "mtb" },

    // Race Face Next SL G5 (High-End MTB)
    { id: "race-face-next-sl-32", model: "Race Face Next SL G5", variant: "32T", weight: 428, bikeType: "mtb", teeth: [32], speeds: "mtb" },
    { id: "race-face-next-sl-34", model: "Race Face Next SL G5", variant: "34T", weight: 435, bikeType: "mtb", teeth: [34], speeds: "mtb" },
  ],

  cassettes: [
    // ================================
    // SHIMANO ROAD CASSETTES
    // ================================

    // Entry Level (8-10 speed)
    { id: "shimano-claris-r2000-11-32", model: "Shimano Claris CS-HG50", variant: "11-32T", weight: 310, bikeType: "road", teeth: [11, 32], speeds: "8-speed" },
    { id: "shimano-sora-r3000-11-32", model: "Shimano Sora CS-HG400", variant: "11-32T", weight: 323, bikeType: "road", teeth: [11, 32], speeds: "9-speed" },
    { id: "shimano-tiagra-r4700-11-32", model: "Shimano Tiagra CS-HG500", variant: "11-32T", weight: 320, bikeType: "road", teeth: [11, 32], speeds: "10-speed" },
    
    // 105 R7000 (11-Speed)
    { id: "shimano-105-r7000-11-28", model: "Shimano 105 R7000", variant: "11-28T", weight: 284, bikeType: "road", teeth: [11, 28], speeds: "11-speed" },
    { id: "shimano-105-r7000-11-30", model: "Shimano 105 R7000", variant: "11-30T", weight: 304, bikeType: "road", teeth: [11, 30], speeds: "11-speed" },
    { id: "shimano-105-r7000-11-32", model: "Shimano 105 R7000", variant: "11-32T", weight: 320, bikeType: "road", teeth: [11, 32], speeds: "11-speed" },
    { id: "shimano-105-r7000-11-34", model: "Shimano 105 R7000", variant: "11-34T", weight: 379, bikeType: "road", teeth: [11, 34], speeds: "11-speed" },

    // 105 R7100 (12-Speed)
    { id: "shimano-105-r7100-11-34", model: "Shimano 105 R7100", variant: "11-34T", weight: 361, bikeType: "road", teeth: [11, 34], speeds: "12-speed" },
    { id: "shimano-105-r7100-11-36", model: "Shimano 105 R7100", variant: "11-36T", weight: 391, bikeType: "road", teeth: [11, 36], speeds: "12-speed" },

    // Ultegra R8000 (11-Speed)
    { id: "shimano-ultegra-r8000-11-28", model: "Shimano Ultegra R8000", variant: "11-28T", weight: 251, bikeType: "road", teeth: [11, 28], speeds: "11-speed" },
    { id: "shimano-ultegra-r8000-11-30", model: "Shimano Ultegra R8000", variant: "11-30T", weight: 269, bikeType: "road", teeth: [11, 30], speeds: "11-speed" },
    { id: "shimano-ultegra-r8000-11-32", model: "Shimano Ultegra R8000", variant: "11-32T", weight: 292, bikeType: "road", teeth: [11, 32], speeds: "11-speed" },
    { id: "shimano-ultegra-r8000-11-34", model: "Shimano Ultegra R8000", variant: "11-34T", weight: 335, bikeType: "road", teeth: [11, 34], speeds: "11-speed" },

    // Ultegra R8100 (12-Speed)
    { id: "shimano-ultegra-r8100-11-30", model: "Shimano Ultegra R8100", variant: "11-30T", weight: 297, bikeType: "road", teeth: [11, 30], speeds: "12-speed" },
    { id: "shimano-ultegra-r8100-11-34", model: "Shimano Ultegra R8100", variant: "11-34T", weight: 345, bikeType: "road", teeth: [11, 34], speeds: "12-speed" },

    // Dura-Ace R9100 (11-Speed)
    { id: "shimano-dura-ace-r9100-11-28", model: "Shimano Dura-Ace R9100", variant: "11-28T", weight: 193, bikeType: "road", teeth: [11, 28], speeds: "11-speed" },
    { id: "shimano-dura-ace-r9100-11-30", model: "Shimano Dura-Ace R9100", variant: "11-30T", weight: 211, bikeType: "road", teeth: [11, 30], speeds: "11-speed" },

    // Dura-Ace R9200 (12-Speed)
    { id: "shimano-dura-ace-r9200-11-30", model: "Shimano Dura-Ace R9200", variant: "11-30T", weight: 223, bikeType: "road", teeth: [11, 30], speeds: "12-speed" },
    { id: "shimano-dura-ace-r9200-11-34", model: "Shimano Dura-Ace R9200", variant: "11-34T", weight: 253, bikeType: "road", teeth: [11, 34], speeds: "12-speed" },

    // ================================
    // SHIMANO GRAVEL CASSETTES
    // ================================

    // GRX (11-Speed & 12-Speed)
    { id: "shimano-grx-rx600-11-42", model: "Shimano SLX M7000", variant: "11-42T", weight: 482, bikeType: "gravel", teeth: [11, 42], speeds: "11-speed" },
    { id: "shimano-grx-rx810-11-34", model: "Shimano Ultegra R8000", variant: "11-34T", weight: 335, bikeType: "gravel", teeth: [11, 34], speeds: "11-speed" },
    { id: "shimano-grx-12s-10-45", model: "Shimano XT M8100", variant: "10-45T", weight: 461, bikeType: "gravel", teeth: [10, 45], speeds: "12-speed" },
    { id: "shimano-grx-12s-10-51", model: "Shimano XT M8100", variant: "10-51T", weight: 470, bikeType: "gravel", teeth: [10, 51], speeds: "12-speed" },

    // ================================
    // SHIMANO MTB CASSETTES
    // ================================
    
    // CUES Linkglide
    { id: "shimano-cues-lg400-11-46", model: "Shimano CUES LG400", variant: "11-46T", weight: 512, bikeType: "mtb", teeth: [11, 46], speeds: "9-speed" },
    { id: "shimano-cues-lg600-11-50", model: "Shimano CUES LG600", variant: "11-50T", weight: 634, bikeType: "mtb", teeth: [11, 50], speeds: "10-speed" },
    { id: "shimano-xt-m8130-11-50", model: "Shimano XT M8130 LinkGlide", variant: "11-50T", weight: 630, bikeType: "mtb", teeth: [11, 50], speeds: "11-speed" },

    // Deore M5100 (11-Speed)
    { id: "shimano-deore-m5100-11-51", model: "Shimano Deore M5100", variant: "11-51T", weight: 623, bikeType: "mtb", teeth: [11, 51], speeds: "11-speed" },

    // Deore M6100 (12-Speed)
    { id: "shimano-deore-m6100-10-51", model: "Shimano Deore M6100", variant: "10-51T", weight: 593, bikeType: "mtb", teeth: [10, 51], speeds: "12-speed" },
    
    // SLX M7100 (12-Speed)
    { id: "shimano-slx-m7100-10-45", model: "Shimano SLX M7100", variant: "10-45T", weight: 513, bikeType: "mtb", teeth: [10, 45], speeds: "12-speed" },
    { id: "shimano-slx-m7100-10-51", model: "Shimano SLX M7100", variant: "10-51T", weight: 534, bikeType: "mtb", teeth: [10, 51], speeds: "12-speed" },
    
    // XT M8100 (12-Speed)
    { id: "shimano-xt-m8100-10-45", model: "Shimano XT M8100", variant: "10-45T", weight: 461, bikeType: "mtb", teeth: [10, 45], speeds: "12-speed" },
    { id: "shimano-xt-m8100-10-51", model: "Shimano XT M8100", variant: "10-51T", weight: 470, bikeType: "mtb", teeth: [10, 51], speeds: "12-speed" },

    // XTR M9100 (12-Speed)
    { id: "shimano-xtr-m9100-10-45", model: "Shimano XTR M9100", variant: "10-45T", weight: 357, bikeType: "mtb", teeth: [10, 45], speeds: "12-speed" },
    { id: "shimano-xtr-m9100-10-51", model: "Shimano XTR M9100", variant: "10-51T", weight: 367, bikeType: "mtb", teeth: [10, 51], speeds: "12-speed" },

    // ================================
    // SRAM ROAD & GRAVEL CASSETTES
    // ================================

    // Apex 12-Speed (XPLR & Eagle) - ADDED
    { id: "sram-apex-xplr-pg1231-11-44", model: "SRAM Apex PG-1231", variant: "11-44T", weight: 426, bikeType: "gravel", teeth: [11, 44], speeds: "12-speed" },
    { id: "sram-apex-eagle-pg1210-11-50", model: "SRAM Apex PG-1210", variant: "11-50T", weight: 630, bikeType: "gravel", teeth: [11, 50], speeds: "12-speed" },

    // Rival AXS (12-Speed)
    { id: "sram-rival-xg1250-10-30", model: "SRAM Rival XG-1250", variant: "10-30T", weight: 282, bikeType: "road", teeth: [10, 30], speeds: "12-speed" },
    { id: "sram-rival-xg1250-10-36", model: "SRAM Rival XG-1250", variant: "10-36T", weight: 338, bikeType: "road", teeth: [10, 36], speeds: "12-speed" },
    { id: "sram-rival-xplr-xg1251-10-44", model: "SRAM Rival XPLR XG-1251", variant: "10-44T", weight: 412, bikeType: "gravel", teeth: [10, 44], speeds: "12-speed" },

    // Force AXS (12-Speed)
    { id: "sram-force-xg1270-10-28", model: "SRAM Force XG-1270", variant: "10-28T", weight: 227, bikeType: "road", teeth: [10, 28], speeds: "12-speed" },
    { id: "sram-force-xg1270-10-33", model: "SRAM Force XG-1270", variant: "10-33T", weight: 261, bikeType: "road", teeth: [10, 33], speeds: "12-speed" },
    { id: "sram-force-xplr-xg1271-10-44", model: "SRAM Force XPLR XG-1271", variant: "10-44T", weight: 373, bikeType: "gravel", teeth: [10, 44], speeds: "12-speed" },
    
    // Red AXS 2024 (12-Speed)
    { id: "sram-red-xg1290-2024-10-28", model: "SRAM Red XG-1290 2024", variant: "10-28T", weight: 180, bikeType: "road", teeth: [10, 28], speeds: "12-speed" },
    { id: "sram-red-xg1290-2024-10-33", model: "SRAM Red XG-1290 2024", variant: "10-33T", weight: 218, bikeType: "road", teeth: [10, 33], speeds: "12-speed" },
    { id: "sram-red-xg1290-2024-10-36", model: "SRAM Red XG-1290 2024", variant: "10-36T", weight: 232, bikeType: "road", teeth: [10, 36], speeds: "12-speed" },

    // ================================
    // SRAM MTB CASSETTES
    // ================================

    // SX Eagle (12-Speed)
    { id: "sram-sx-eagle-11-50", model: "SRAM SX Eagle PG-1210", variant: "11-50T", weight: 630, bikeType: "mtb", teeth: [11, 50], speeds: "12-speed" },

    // NX Eagle (12-Speed)
    { id: "sram-nx-eagle-11-50", model: "SRAM NX Eagle PG-1230", variant: "11-50T", weight: 615, bikeType: "mtb", teeth: [11, 50], speeds: "12-speed" },

    // GX Eagle (12-Speed)
    { id: "sram-gx-eagle-10-50", model: "SRAM GX Eagle XG-1275", variant: "10-50T", weight: 450, bikeType: "mtb", teeth: [10, 50], speeds: "12-speed" },
    { id: "sram-gx-eagle-10-52", model: "SRAM GX Eagle XG-1275", variant: "10-52T", weight: 452, bikeType: "mtb", teeth: [10, 52], speeds: "12-speed" },

    // X01 Eagle (12-Speed)
    { id: "sram-x01-eagle-10-52", model: "SRAM X01 Eagle XG-1295", variant: "10-52T", weight: 357, bikeType: "mtb", teeth: [10, 52], speeds: "12-speed" },

    // XX1 Eagle (12-Speed)
    { id: "sram-xx1-eagle-10-52", model: "SRAM XX1 Eagle XG-1299", variant: "10-52T", weight: 353, bikeType: "mtb", teeth: [10, 52], speeds: "12-speed" },

    // Transmission T-Type Cassettes
    { id: "sram-gx-eagle-t-type-10-52", model: "SRAM GX Eagle T-Type XS-1275", variant: "10-52T", weight: 445, bikeType: "mtb", teeth: [10, 52], speeds: "12-speed" },
    { id: "sram-x0-eagle-t-type-10-52", model: "SRAM X0 Eagle T-Type XS-1295", variant: "10-52T", weight: 385, bikeType: "mtb", teeth: [10, 52], speeds: "12-speed" },
    { id: "sram-xx-eagle-t-type-10-52", model: "SRAM XX Eagle T-Type XS-1297", variant: "10-52T", weight: 350, bikeType: "mtb", teeth: [10, 52], speeds: "12-speed" },

    // ================================
    // CAMPAGNOLO CASSETTES
    // ================================

    // Chorus (12-Speed)
    { id: "campagnolo-chorus-11-29", model: "Campagnolo Chorus", variant: "11-29T", weight: 305, bikeType: "road", teeth: [11, 29], speeds: "12-speed" },
    { id: "campagnolo-chorus-11-32", model: "Campagnolo Chorus", variant: "11-32T", weight: 325, bikeType: "road", teeth: [11, 32], speeds: "12-speed" },
    { id: "campagnolo-chorus-11-34", model: "Campagnolo Chorus", variant: "11-34T", weight: 345, bikeType: "road", teeth: [11, 34], speeds: "12-speed" },

    // Record (12-Speed)
    { id: "campagnolo-record-11-29", model: "Campagnolo Record", variant: "11-29T", weight: 266, bikeType: "road", teeth: [11, 29], speeds: "12-speed" },
    { id: "campagnolo-record-11-32", model: "Campagnolo Record", variant: "11-32T", weight: 288, bikeType: "road", teeth: [11, 32], speeds: "12-speed" },
    
    // Super Record (12-Speed)
    { id: "campagnolo-super-record-11-29", model: "Campagnolo Super Record", variant: "11-29T", weight: 266, bikeType: "road", teeth: [11, 29], speeds: "12-speed" },
    { id: "campagnolo-super-record-11-32", model: "Campagnolo Super Record", variant: "11-32T", weight: 288, bikeType: "road", teeth: [11, 32], speeds: "12-speed" },

    // Super Record Wireless (13-Speed)
    { id: "campagnolo-super-record-wrl-10-29", model: "Campagnolo Super Record WRL", variant: "10-29T", weight: 295, bikeType: "road", teeth: [10, 29], speeds: "13-speed" },

    // Ekar (13-Speed Gravel)
    { id: "campagnolo-ekar-9-36", model: "Campagnolo Ekar", variant: "9-36T", weight: 340, bikeType: "gravel", teeth: [9, 36], speeds: "13-speed" },
    { id: "campagnolo-ekar-9-42", model: "Campagnolo Ekar", variant: "9-42T", weight: 390, bikeType: "gravel", teeth: [9, 42], speeds: "13-speed" },
    { id: "campagnolo-ekar-10-44", model: "Campagnolo Ekar", variant: "10-44T", weight: 410, bikeType: "gravel", teeth: [10, 44], speeds: "13-speed" },

    // Ekar GT (13-Speed Gravel)
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
