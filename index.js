const window = require('svgdom');
const fs = require('fs');

const { document } = window;
const {
  SVG, registerWindow, Rect, G, Circle,
} = require('@svgdotjs/svg.js');

registerWindow(window, document);

// ++++++++++++++++++++++
// + Configurations     +
// ++++++++++++++++++++++

// 1mm = 1
const STROKE = 0.5;

const CASE_WIDTH = 350;
const CASE_HEIGHT = 110;
const CASE_ROUNDNESS = 10;

const LED_CARVING = 9;
const LED_MARGIN = 1;

const HOLE_MARGIN = 10;
const HOLE_RADIUS = 3;

// ++++++++++++++++++++++
// + Parts              +
// ++++++++++++++++++++++

const base = new Rect()
  .size(CASE_WIDTH, CASE_HEIGHT)
  .attr({
    rx: CASE_ROUNDNESS,
    yx: CASE_ROUNDNESS,
  })
  .fill('none')
  .stroke({ color: 'black', width: STROKE });

const holes = new G()
// left top
  .add(new Circle()
    .radius(HOLE_RADIUS)
    .fill('none')
    .stroke({ color: 'black', width: STROKE })
    .center(HOLE_MARGIN, HOLE_MARGIN))
// right top
  .add(new Circle()
    .radius(HOLE_RADIUS)
    .fill('none')
    .stroke({ color: 'black', width: STROKE })
    .center(CASE_WIDTH - HOLE_MARGIN, HOLE_MARGIN))
// left bottom
  .add(new Circle()
    .radius(HOLE_RADIUS)
    .fill('none')
    .stroke({ color: 'black', width: STROKE })
    .center(HOLE_MARGIN, CASE_HEIGHT - HOLE_MARGIN))
// right bottom
  .add(new Circle()
    .radius(HOLE_RADIUS)
    .fill('none')
    .stroke({ color: 'black', width: STROKE })
    .center(CASE_WIDTH - HOLE_MARGIN, CASE_HEIGHT - HOLE_MARGIN));

const leds = new G();
for (let x = 0; x < 32; x += 1) {
  for (let y = 0; y < 8; y += 1) {
    new Rect()
      .size(LED_CARVING, LED_CARVING)
      .move(x * LED_CARVING + x * LED_MARGIN, y * LED_CARVING + y * LED_MARGIN)
      .fill('none')
      .stroke({ color: 'black', width: STROKE })
      .addTo(leds);
  }
}

const innerCarving = new Rect()
  .size(32 * LED_CARVING + 31 * LED_MARGIN, 8 * LED_CARVING + 7 * LED_MARGIN)
  .fill('none')
  .stroke({ color: 'black', width: STROKE });

// ++++++++++++++++++++++
// + Files              +
// ++++++++++++++++++++++

if (!fs.existsSync('svg')) fs.mkdirSync('svg');

// frontplate
fs.writeFileSync('svg/frontplate.svg', SVG()
  .size(CASE_WIDTH, CASE_HEIGHT)
  .add(base)
  .add(leds.center(CASE_WIDTH / 2, CASE_HEIGHT / 2))
  .svg());

// frontplate with holes
fs.writeFileSync('svg/frontplate_holes.svg', SVG()
  .size(CASE_WIDTH, CASE_HEIGHT)
  .add(base)
  .add(holes)
  .add(leds.center(CASE_WIDTH / 2, CASE_HEIGHT / 2))
  .svg());

// backplate
fs.writeFileSync('svg/backplate.svg', SVG()
  .size(CASE_WIDTH, CASE_HEIGHT)
  .add(base)
  .svg());

// backplate with holes
fs.writeFileSync('svg/backplate_holes.svg', SVG()
  .size(CASE_WIDTH, CASE_HEIGHT)
  .add(base)
  .add(holes)
  .svg());

// middleplate
fs.writeFileSync('svg/middleplate.svg', SVG()
  .size(CASE_WIDTH, CASE_HEIGHT)
  .add(base)
  .add(holes)
  .add(innerCarving.center(CASE_WIDTH / 2, CASE_HEIGHT / 2))
  .svg());
