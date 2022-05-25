import React, { useEffect } from 'react';
import { BrowseContainer } from '../containers/browse';
import { useContent } from '../hooks';
import { selectionMap } from '../utils';

export default function Browse() {

  const { series } = useContent('series');
  const { films } = useContent('films');
  let children = {series: [], films: []};
  let adult = {series: [], films: []};
  children.series = series.filter((mySeries) => mySeries.maturity <18)
  children.films = films.filter((mySeries) => mySeries.maturity <18)

  adult.series = series.filter((mySeries) => mySeries.maturity >= 18)
  adult.films = films.filter((mySeries) => mySeries.maturity >= 18)
  let childS =children['series']
  let childF = children['films']
  let adultS = adult['series']
  let adultF = adult['films']
  const slidesChild = selectionMap(childS, childF);
  const slidesAdult = selectionMap(adultS, adultF);
  // const slides = selectionMap({series,films})

  console.log('my data',series,'\n',children)
  let age = window.localStorage.getItem("age")
  let dataSet = age>18 ? slidesAdult :slidesChild
  return <BrowseContainer slides={dataSet} />
}
