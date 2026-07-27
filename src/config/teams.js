export const TEAMS = [
  {id:'arg', nombre:'Argentina', cc:'ar', colores:['#6CACE4','#FFFFFF','#F6B40E']},
  {id:'bra', nombre:'Brasil', cc:'br', colores:['#009739','#FEDD00','#002776']},
  {id:'col', nombre:'Colombia', cc:'co', colores:['#FCD116','#003893','#CE1126']},
  {id:'ecu', nombre:'Ecuador', cc:'ec', colores:['#FFDD00','#034EA2','#ED1C24']},
  {id:'par', nombre:'Paraguay', cc:'py', colores:['#D52B1E','#FFFFFF','#0038A8']},
  {id:'uru', nombre:'Uruguay', cc:'uy', colores:['#75AADB','#FFFFFF','#FCD116']},
  {id:'esp', nombre:'España', cc:'es', colores:['#C60B1E','#FFC400','#C60B1E']},
  {id:'ale', nombre:'Alemania', cc:'de', colores:['#000000','#DD0000','#FFCE00']},
  {id:'fra', nombre:'Francia', cc:'fr', colores:['#0055A4','#FFFFFF','#EF4135']},
  {id:'por', nombre:'Portugal', cc:'pt', colores:['#006600','#FF0000','#FFCC00']},
  {id:'ned', nombre:'Países Bajos', cc:'nl', colores:['#FF6C00','#21468B','#FFFFFF']},
  {id:'ing', nombre:'Inglaterra', cc:'gb-eng', colores:['#FFFFFF','#CE1124','#FFFFFF']},
  {id:'bel', nombre:'Bélgica', cc:'be', colores:['#000000','#FAE042','#ED2939']},
  {id:'cro', nombre:'Croacia', cc:'hr', colores:['#FF0000','#FFFFFF','#171796']},
  {id:'sui', nombre:'Suiza', cc:'ch', colores:['#FF0000','#FFFFFF','#FF0000']},
  {id:'swe', nombre:'Suecia', cc:'se', colores:['#006AA7','#FECC02','#006AA7']},
  {id:'nor', nombre:'Noruega', cc:'no', colores:['#EF2B2D','#FFFFFF','#002868']},
  {id:'tur', nombre:'Turquía', cc:'tr', colores:['#E30A17','#FFFFFF','#E30A17']},
  {id:'mar', nombre:'Marruecos', cc:'ma', colores:['#C1272D','#006233','#C1272D']},
  {id:'sen', nombre:'Senegal', cc:'sn', colores:['#00853F','#FDEF42','#E31B23']},
  {id:'egy', nombre:'Egipto', cc:'eg', colores:['#CE1126','#FFFFFF','#000000']},
  {id:'gha', nombre:'Ghana', cc:'gh', colores:['#CE1126','#FCD116','#006B3F']},
  {id:'civ', nombre:'Costa de Marfil', cc:'ci', colores:['#F77F00','#FFFFFF','#009E60']},
  {id:'jpn', nombre:'Japón', cc:'jp', colores:['#FFFFFF','#BC002D','#FFFFFF']},
  {id:'kor', nombre:'Corea del Sur', cc:'kr', colores:['#FFFFFF','#CD2E3A','#0047A0']},
  {id:'aus', nombre:'Australia', cc:'au', colores:['#00843D','#FFCD00','#012169']},
  {id:'ksa', nombre:'Arabia Saudita', cc:'sa', colores:['#006C35','#FFFFFF','#006C35']},
  {id:'mex', nombre:'México', cc:'mx', colores:['#006847','#FFFFFF','#CE1126']},
  {id:'usa', nombre:'Estados Unidos', cc:'us', colores:['#3C3B6E','#B22234','#FFFFFF']},
  {id:'can', nombre:'Canadá', cc:'ca', colores:['#FF0000','#FFFFFF','#FF0000']},
  {id:'pan', nombre:'Panamá', cc:'pa', colores:['#D21034','#072357','#FFFFFF']},
  {id:'nzl', nombre:'Nueva Zelanda', cc:'nz', colores:['#000000','#FFFFFF','#C0C0C0']}
];

export function banderaEmoji(cc){
  if(cc === 'gb-eng'){
    return String.fromCodePoint(0x1F3F4, 0xE0067, 0xE0062, 0xE0065, 0xE006E, 0xE0067, 0xE007F);
  }
  return cc.toUpperCase().split('').map(ch => String.fromCodePoint(127397 + ch.charCodeAt(0))).join('');
}
