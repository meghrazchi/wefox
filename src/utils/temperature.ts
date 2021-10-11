const fahrenheitToCelsius = (fahrenheitTemp: number) => {
  return Math.round(((fahrenheitTemp - 32) * 5) / 9);
};

export { fahrenheitToCelsius };
