export const bikeConfig = {
  road: {
    wheelSizes: ["700c"],
    tireWidths: [23, 25, 28, 32, 35, 38],
    defaultSetup: { wheel: "700c", tire: "25", crankset: "50/34t", cassette: "11-28t" },
  },
  gravel: {
    wheelSizes: ["700c", "650b"],
    tireWidths: [32, 35, 38, 40, 42, 45, 47, 50],
    defaultSetup: { wheel: "700c", tire: "40", crankset: "46/30t", cassette: "11-34t" },
  },
  mtb: {
    wheelSizes: ["26-inch", "27.5-inch", "29-inch"],
    tireWidths: [50, 55, 60, 65, 70],
    defaultSetup: { wheel: "29-inch", tire: "60", crankset: "32t", cassette: "10-50t" },
  },
};

export const componentDatabase = {
  cranksets: [
    { id: "50/34t", model: "Shimano", variant: "50/34t", weight: 713, price: 150, bikeType: "road", teeth: [50, 34] },
    { id: "52/36t", model: "Shimano", variant: "52/36t", weight: 743, price: 160, bikeType: "road", teeth: [52, 36] },
    { id: "53/39t", model: "Shimano", variant: "53/39t", weight: 760, price: 170, bikeType: "road", teeth: [53, 39] },
    { id: "44t", model: "Shimano", variant: "44t", weight: 650, price: 120, bikeType: "road", teeth: [44] },
    { id: "46t", model: "Shimano", variant: "46t", weight: 660, price: 125, bikeType: "road", teeth: [46] },
    { id: "48t", model: "Shimano", variant: "48t", weight: 670, price: 130, bikeType: "road", teeth: [48] },
    { id: "46/30t", model: "Shimano", variant: "46/30t", weight: 780, price: 180, bikeType: "gravel", teeth: [46, 30] },
    { id: "48/31t", model: "Shimano", variant: "48/31t", weight: 722, price: 175, bikeType: "gravel", teeth: [48, 31] },
    { id: "38t", model: "Shimano", variant: "38t", weight: 650, price: 120, bikeType: "gravel", teeth: [38] },
    { id: "40t", model: "Shimano", variant: "40t", weight: 660, price: 125, bikeType: "gravel", teeth: [40] },
    { id: "42t", model: "Shimano", variant: "42t", weight: 670, price: 130, bikeType: "gravel", teeth: [42] },
    { id: "44t-gravel", model: "Shimano", variant: "44t", weight: 680, price: 135, bikeType: "gravel", teeth: [44] },
    { id: "46t-gravel", model: "Shimano", variant: "46t", weight: 690, price: 140, bikeType: "gravel", teeth: [46] },
    { id: "28t", model: "Shimano", variant: "28t", weight: 580, price: 100, bikeType: "mtb", teeth: [28] },
    { id: "30t", model: "Shimano", variant: "30t", weight: 590, price: 105, bikeType: "mtb", teeth: [30] },
    { id: "32t", model: "Shimano", variant: "32t", weight: 600, price: 110, bikeType: "mtb", teeth: [32] },
    { id: "34t", model: "Shimano", variant: "34t", weight: 610, price: 115, bikeType: "mtb", teeth: [34] },
    { id: "36t", model: "Shimano", variant: "36t", weight: 620, price: 120, bikeType: "mtb", teeth: [36] },
  ],
  cassettes: [
    { id: "11-25t", model: "Shimano", variant: "11-25t", weight: 250, price: 70, bikeType: "road", teeth: [11, 25] },
    { id: "11-28t", model: "Shimano", variant: "11-28t", weight: 284, price: 80, bikeType: "road", teeth: [11, 28] },
    { id: "11-30t", model: "Shimano", variant: "11-30t", weight: 304, price: 85, bikeType: "road", teeth: [11, 30] },
    { id: "11-32t", model: "Shimano", variant: "11-32t", weight: 320, price: 90, bikeType: "road", teeth: [11, 32] },
    { id: "11-34t", model: "Shimano", variant: "11-34t", weight: 340, price: 95, bikeType: "road", teeth: [11, 34] },
    { id: "10-33t", model: "Shimano", variant: "10-33t", weight: 350, price: 100, bikeType: "road", teeth: [10, 33] },
    { id: "10-36t", model: "Shimano", variant: "10-36t", weight: 360, price: 105, bikeType: "road", teeth: [10, 36] },
    { id: "10-42t", model: "Shimano", variant: "10-42t", weight: 400, price: 120, bikeType: "road", teeth: [10, 42] },

    { id: "11-32t-gravel", model: "Shimano", variant: "11-32t", weight: 320, price: 90, bikeType: "gravel", teeth: [11, 32] },
    { id: "11-34t-gravel", model: "Shimano", variant: "11-34t", weight: 340, price: 95, bikeType: "gravel", teeth: [11, 34] },
    { id: "11-36t", model: "Shimano", variant: "11-36t", weight: 360, price: 100, bikeType: "gravel", teeth: [11, 36] },
    { id: "10-42t-gravel", model: "Shimano", variant: "10-42t", weight: 400, price: 120, bikeType: "gravel", teeth: [10, 42] },
    { id: "10-50t", model: "Shimano", variant: "10-50t", weight: 450, price: 150, bikeType: "gravel", teeth: [10, 50] },
    { id: "10-51t", model: "Shimano", variant: "10-51t", weight: 460, price: 155, bikeType: "gravel", teeth: [10, 51] },

    { id: "10-42t-mtb", model: "Shimano", variant: "10-42t", weight: 400, price: 120, bikeType: "mtb", teeth: [10, 42] },
    { id: "10-50t-mtb", model: "Shimano", variant: "10-50t", weight: 450, price: 150, bikeType: "mtb", teeth: [10, 50] },
    { id: "10-51t-mtb", model: "Shimano", variant: "10-51t", weight: 460, price: 155, bikeType: "mtb", teeth: [10, 51] },
    { id: "11-50t", model: "Shimano", variant: "11-50t", weight: 440, price: 145, bikeType: "mtb", teeth: [11, 50] },

    // SRAM Road
    { id: "10-26t", model: "SRAM", variant: "10-26t", weight: 260, price: 110, bikeType: "road", teeth: [10, 26] },
    { id: "10-28t", model: "SRAM", variant: "10-28t", weight: 270, price: 115, bikeType: "road", teeth: [10, 28] },
    { id: "10-33t-sram", model: "SRAM", variant: "10-33t", weight: 300, price: 130, bikeType: "road", teeth: [10, 33] },

    // SRAM Gravel
    { id: "10-36t-sram", model: "SRAM", variant: "10-36t", weight: 320, price: 135, bikeType: "gravel", teeth: [10, 36] },
    { id: "10-44t", model: "SRAM", variant: "10-44t", weight: 420, price: 145, bikeType: "gravel", teeth: [10, 44] },
    { id: "10-52t", model: "SRAM", variant: "10-52t", weight: 470, price: 160, bikeType: "gravel", teeth: [10, 52] },

    // SRAM MTB
    { id: "10-50t-sram", model: "SRAM", variant: "10-50t", weight: 460, price: 155, bikeType: "mtb", teeth: [10, 50] },
    { id: "10-52t-mtb", model: "SRAM", variant: "10-52t", weight: 470, price: 160, bikeType: "mtb", teeth: [10, 52] },
  ]
};

export const getComponentsForBikeType = (bikeType) => {
  return {
    cranksets: componentDatabase.cranksets.filter(c => c.bikeType === bikeType),
    cassettes: componentDatabase.cassettes.filter(c => c.bikeType === bikeType),
  };
};
