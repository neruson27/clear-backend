import config from '../config'

export default function pagination(page, count, limit){
  const pg = {};
  pg.page = (page && parseInt(page) <= count) ? parseInt(page) : 1; // pagina actual
  pg.limit = (limit && parseInt(limit))  ? parseInt(limit): config.pagination.limit; // documetos por pagina
  //pg.pages = 0;
  pg.total = (count)? count:0;
  pg.pages = pg.total/pg.limit;
  pg.pages = (pg.pages > Math.floor(pg.pages)) ? Math.floor(pg.pages) + 1 : Math.floor(pg.pages);
  // si page es mayor que total de paginas o page == 1, entonce se asigna 0 al offset
  pg.offset = (pg.page > pg.pages || pg.page == 1 ) ? 0 : (pg.page -1) * pg.limit; // documento incial para la consulta
  return pg;
}