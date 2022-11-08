export const getError404 = (req, res, next) => {
  res
    .status(404)
    .render('404', { pageTitle: 'Pagina no encontrada', path: null });
};
