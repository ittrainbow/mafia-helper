export const getColor = (percentage) => {
  const red = percentage < 50 ? 255 : (255 - Math.floor(percentage * 2.55)) * 2
  const green = percentage < 50 ? 255 - Math.floor((50 - percentage) * 5.1) : 255
  return `rgba(${red}, ${green}, 0, 1)`
}
