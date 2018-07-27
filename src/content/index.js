console.log('content-script! aaa')
const getDirection = require('../backend/getDirection')
const stations = require('./stations.json')

const addElement = (info, train) => {
  console.log('now we can add', info, train)
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
    time: {
      start,
      end,
    },
  }
  info.direction = getDirection(info.pos.start, info.pos.end)
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
