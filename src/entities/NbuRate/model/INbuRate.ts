export default interface INbuRate {
    r030: number,
    txt: string,
    rate: number,
    cc: string,
    exchangedate: string,
    special: string|null,
};

/*
  {
    "r030": 826,
    "txt": "Фунт стерлінгів",
    "rate": 58.5893,
    "cc": "GBP",
    "exchangedate": "18.03.2026",
    "special": null
  },
  {
    "r030": 840,
    "txt": "Долар США",
    "rate": 43.9497,
    "cc": "USD",
    "exchangedate": "18.03.2026",
    "special": "N"
  },
*/