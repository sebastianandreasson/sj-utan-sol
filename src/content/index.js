console.log('content-script! aaa')
const getDirection = require('./getDirection')
const SunCalc = require('suncalc')
const stations = require('./stations.json')

const addElement = (info, train) => {
  console.log('now we can add', info, train)
  const sunInfo = SunCalc.getPosition(
    info.time.start,
    info.pos.start.lat,
    info.pos.start.lng,
  )
  console.log('sunInfo', sunInfo)
  const sunAngle = (sunInfo.azimuth * 180) / Math.PI
  const sun = document.createElement('div')
  const style = `
    position: absolute;
    top: -150px;
    right: 0px;
    width: 0;
    height: 0;
    border-left: 325px solid transparent;
    border-right: 325px solid transparent;
    border-top: 450px solid yellow;
    border-radius: 50%;
    transform: rotate(${sunAngle}deg);
    opacity: 0.5;
  `
  sun.setAttribute('style', style)

  train.appendChild(sun)
}

const replaceSwedishLetters = string => {
  return string
    .replace(/å/g, 'a')
    .replace(/ä/g, 'a')
    .replace(/ö/g, 'o')
}

const extractInfo = journeyElement => {
  // looks like:
  // 'Göteborg C – Sthlm Central↵Mån 27 aug 2018, 05:54 – 08:49, 2 klass Kan ej ombokas↵'
  const text = journeyElement.innerText.split('\n')
  console.log(text)
  const [departure, destination] = text[0].split(' – ')
  console.log({ departure, destination })
  const [start, end] = text[1].split(',')[1].split(' – ')
  console.log({ start, end })

  if (!departure || !destination) {
    throw new Error('oh no didnt departure or destination info')
  }

  const departureStation = stations.find(station => {
    return (
      station.slug ===
      replaceSwedishLetters(departure.replace(' ', '-').toLowerCase())
    )
  })
  const destinationStation = stations.find(station => {
    return (
      station.slug ===
      replaceSwedishLetters(destination.replace(' ', '-').toLowerCase())
    )
  })

  if (!departureStation || !destinationStation) {
    throw new Error('stations not found')
  }

  const info = {
    pos: {
      start: {
        lat: departureStation.lat,
        lng: departureStation.lng,
      },
      end: {
        lat: destinationStation.lat,
        lng: destinationStation.lng,
      },
    },
    time: {},
  }
  info.direction = getDirection(info.pos.start, info.pos.end)

  info.time.start = new Date()
  info.time.start.setHours(parseInt(start.split(':')[0]))
  info.time.start.setMinutes(parseInt(start.split(':')[1]))

  info.time.end = new Date()
  info.time.end.setHours(parseInt(start.split(':')[0]))
  info.time.end.setMinutes(parseInt(start.split(':')[1]))

  return info
}

const start = () => {
  const journeyInfo = document.getElementsByClassName(
    'action-bar__journey-container',
  )
  const train = document.getElementById('seatmap--outbound-1')
  if (journeyInfo.length && train) {
    return addElement(extractInfo(journeyInfo[0]), train)
  }

  setTimeout(start, 1000)
}

start()
