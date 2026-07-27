export let cv = null;
export let ctx = null;
export let W = 900;
export let H = 560;

export function initCanvas() {
  cv = document.getElementById('cancha');
  ctx = cv.getContext('2d');
  W = cv.width;
  H = cv.height;
}
