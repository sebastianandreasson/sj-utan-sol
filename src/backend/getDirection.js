const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW', 'N']

module.exports = (start, end) => {
  const radians = Math.atan2(end.lng - start.lng, end.lat - start.lat)

  const compassReading = radians * (180 / Math.PI)
  let index = Math.round(compassReading / 45)
  if (index < 0) index = index + 8

  return directions[index]
}
