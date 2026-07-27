export function celebrarGol(confetiArray, colores, W, H) {
  for(let i=0; i<26; i++){
    confetiArray.push({
      x: W/2 + (Math.random()*60 - 30), 
      y: H*0.15 + Math.random()*30,
      vx: (Math.random()*4 - 2), 
      vy: 1 + Math.random()*2.5,
      w: 5 + Math.random()*4, 
      h: 3 + Math.random()*3,
      rot: Math.random()*Math.PI, 
      vrot: (Math.random()*.3 - .15),
      color: colores[Math.floor(Math.random() * colores.length)],
      vida: 90
    });
  }
}

export function actualizarConfeti(confetiArray) {
  confetiArray.forEach(c => {
    c.x += c.vx; 
    c.y += c.vy; 
    c.vy += 0.05; 
    c.rot += c.vrot; 
    c.vida--;
  });
  return confetiArray.filter(c => c.vida > 0);
}

export function dibujarConfeti(ctx, confetiArray) {
  confetiArray.forEach(c => {
    ctx.save();
    ctx.globalAlpha = Math.max(c.vida / 90, 0);
    ctx.translate(c.x, c.y);
    ctx.rotate(c.rot);
    ctx.fillStyle = c.color;
    ctx.fillRect(-c.w/2, -c.h/2, c.w, c.h);
    ctx.restore();
  });
}
