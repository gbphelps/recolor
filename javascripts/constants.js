let hueSlider;

export default {
  hueSlider: {
    svgMargin: 20,
    radius: 140,
    trackThickness: 8,
    set(that) { hueSlider = that; },
    get() { return hueSlider; },
  },
  triangleSlider: {
  },
};
