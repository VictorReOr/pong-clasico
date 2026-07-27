export function generarCodigo(){
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let c = '';
  for(let i=0; i<5; i++){
    c += chars[Math.floor(Math.random() * chars.length)];
  }
  return c;
}
