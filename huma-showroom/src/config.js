// Edit this file to change contact details, products and hotspots.
export const CFG = {
  whatsapp: '263000000000', // replace with HUMA's real number: country code + number, no + or spaces
  item: 'basin mixer and wall-hung vanity',
}
export const wa = (text) => `https://wa.me/${CFG.whatsapp}?text=${encodeURIComponent(text)}`

// Dots on /public/img/sink.jpg. x and y are percentages of the image.
export const HOTSPOTS = [
  { x: 18, y: 25, title: 'Cup washer', text: 'Press a glass onto the washer and the jets rinse it from the inside.', img: '/img/inset-cup-washer.jpg' },
  { x: 55.6, y: 30, title: 'Waterfall flow', text: 'A wide curtain of water rinses a whole tray of dishes at once.', img: '/img/inset-waterfall.jpg' },
  { x: 44.4, y: 37, title: 'Pull-out tap', text: 'A tall gooseneck tap that pulls out to reach the whole basin.', img: '/img/inset-pull-out-tap.jpg' },
  { x: 67.6, y: 18.5, title: 'Temperature display', text: 'A digital display shows the water temperature, with a knob to set it.', img: '/img/inset-temperature-display.jpg' },
]
