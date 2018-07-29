const getDirection = require('./getDirection')
const SunCalc = require('suncalc')
const stations = require('./stations.json')

const setElementStyle = (info, sun, time, train, text) => {
  const sunInfo = SunCalc.getPosition(
    time ? time : info.time.start,
    info.pos.start.lat,
    info.pos.start.lng,
  )

  // get the position of the sun based on which direction we're traveling.
  const azimuthAngle = (sunInfo.azimuth * 180) / Math.PI - info.direction.angle
  const altitudeAngle = (sunInfo.altitude * 180) / Math.PI
  const trainWidth = train.getBoundingClientRect().width

  const style = `
    pointer-events: none;
    position: absolute;
    top: ${info.direction.angle > 0 ? -100 : 75}px;
    right: -${trainWidth / 2 - 250}px;
    width: 0;
    height: 0;
    border-left: 750px solid transparent;
    border-right: 750px solid transparent;
    border-top: 400px solid yellow;
    border-radius: 50%;
    transform: rotate(${-azimuthAngle}deg);
    opacity: 0.5;
  `
  sun.setAttribute('style', style)
}

const addElement = (info, train) => {
  const sun = document.createElement('div')
  train.appendChild(sun)

  const text = document.createElement('span')

  const slider = document.createElement('input')
  slider.setAttribute('type', 'range')
  slider.setAttribute('min', info.time.start.valueOf())
  slider.setAttribute('max', info.time.end.valueOf())
  slider.addEventListener('input', function() {
    const time = new Date(parseInt(this.value))
    setElementStyle(info, sun, time, train, text)
  })
  train.appendChild(slider)

  setElementStyle(info, sun, info.time.start, train, text)
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
  const [departure, destination] = text[0].split(' – ')
  const [start, end] = text[1].split(',')[1].split(' – ')

  if (!departure || !destination) {
    throw new Error('oh no didnt find departure or destination info')
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

  // just assume we arrive same day for now.
  info.time.end = new Date()
  info.time.end.setHours(parseInt(end.split(':')[0]))
  info.time.end.setMinutes(parseInt(end.split(':')[1]))

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

  // keep looking at the page until we find the seatmap.
  setTimeout(start, 1000)
}

start()
