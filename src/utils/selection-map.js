export default function selectionMap( series, films ) {
  console.log("map inside", series,films)
  let series1 = series.filter((item) => item.genre === 'documentaries');
  let series2 = series.filter((item) => item.genre === 'comedies');
  let series3 = series.filter((item) => item.maturity<18 && item.genre === 'children');
  let series4 = series.filter((item) => item.genre === 'crime');
  let series5 = series.filter((item) => item.genre === 'feel-good')

  let film1 =  films.filter((item) => item.genre === 'drama');
  let film2 = films.filter((item) => item.genre === 'thriller');
  let film3 = films.filter((item) => item.genre === 'children');
  let film4 = films.filter((item) => item.genre === 'suspense');
  let film5 = films.filter((item) => item.genre === 'romance')

  return {
    series: [
      { title: series1.length>0 && 'Documentaries', data: series1},
      { title: series2.length>0 && 'Comedies', data:series2 },
      { title: series3.length>0 && 'Children', data: series3},
      { title: series4.length>0 && 'Crime', data: series4},
      { title: series5.length>0 &&'Feel Good', data: series5},
    ],
    films: [
     { title: film1.length>0 && 'Drama', data: films.filter((item) => item.genre === 'drama') },
     { title: film2.length>0 && 'Thriller', data: films.filter((item) => item.genre === 'thriller') },
     { title: film3.length>0 && 'Children', data: films.filter((item) => item.maturity<18 && item.genre === 'children') },
     { title: film4.length>0 && 'Suspense', data: films.filter((item) => item.genre === 'suspense') },
     { title: film5.length>0 && 'Romance', data: films.filter((item) => item.genre === 'romance') },
    ],
  };
}


// film1.length>0 && 
// film2.length>0 && 
// film3.length>0 && 
// film4.length>0 && 
// film5.length>0 && 