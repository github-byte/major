import React, { useEffect, useContext, useState } from 'react';
import { FirebaseContext } from '../context/firebase';
import { BrowseContainer } from '../containers/browse';
import { Header, Profiles } from '../components';
import {Button,Box} from '@material-ui/core'
import { useContent } from '../hooks';
import { selectionMap } from '../utils';
import logo from '../image2vector.svg'
import * as ROUTES from '../constants/routes';

export default function Browse() {

  const { series } = useContent('series');
  const { films } = useContent('films');
  const [showOver, setShowOver] = useState(false)
  let children = {series: [], films: []};
  let adult = {series: [], films: []};
  const { firebase } = useContext(FirebaseContext);
  const user = firebase.auth().currentUser || {};
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
  let age = window.localStorage.getItem("age") || ''
  let dataSet = age>18 ? slidesAdult :slidesChild

  useEffect(()=> {
    var starCountRef = firebase.database().ref('users/' + user.uid);
    console.log('my data2',starCountRef)
    starCountRef.on('value', (snapshot) => {
      const data = snapshot.val();
      if(data){
        const {isOver = null} = data;
        if(isOver && isOver == true){
          setShowOver(true)
        }
      }
    });
  },[user])

  const isEmpty = (obj) =>{
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
          return false;
    }

    return true;
}

  useEffect(() => {
    let age = window.localStorage.getItem("age") || ''
    let timeInterval = window.localStorage.getItem("timeLimit") || ''
    console.log("firebase login0",age,timeInterval,user)
    if(!age || !timeInterval || !user || isEmpty(user)) return
    console.log("firebase login1",age,timeInterval,user)
    firebase.database().ref('users/' + user['uid']).update({
      userId: user ? user.uid : null,
      age:age,
      timeLimit:timeInterval
    }, (error) => {
      if (error) {
        // The write failed...
          console.log(error)
      } else {
        // Data saved successfully!
        console.log("data saved")
      }
    });
  },[user])

  const handleHome = () => {
    firebase.auth().signOut();
    window.location.href = ROUTES.HOME
  }

  if(showOver) return <><Header bg={false}>
    <Header.Frame>
      <Header.Logo src={logo} alt="Netflix" />
    </Header.Frame>
  </Header>
  <Box display={'flex'} flexDirection={'column'} justifyContent="center" alignItems={'center'}>
  <Profiles>
    <Profiles.Title>Who's watching?</Profiles.Title>
    <Profiles.List>
      <Profiles.User>
        <Profiles.Picture src={user.photoURL} />
        <Profiles.Name>{user.displayName}</Profiles.Name>
        <Profiles.Name>{"Your streaming time for today is over come again tomorrow!"}</Profiles.Name>
      </Profiles.User>
    </Profiles.List>
  </Profiles>
  <Button onClick={() => handleHome()} color={'primary'} variant={'filled'} 
  style={{background:'#0F79AF',color:'white',marginTop:'120px'}}>Go Home</Button>
  </Box></>
  return <BrowseContainer slides={dataSet} />
}
