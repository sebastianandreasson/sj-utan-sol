const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW', 'N']

module.exports = (pos1, pos2) => {
  const radians = Math.atan2(pos1.y - pos2.y, pos1.x - pos2.x)

  const compassReading = radians * (180 / Math.PI)
  let index = Math.round(compassReading / 45)
  if (index < 0) index = index + 8

  return directions[index]
}
