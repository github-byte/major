import React,{useContext, useEffect, useState} from 'react';
import { FirebaseContext } from '../context/firebase';
import { useCountdown } from './useCountDown.js';

const CountdownTimer = ({ targetDate,expiredNotice=()=>{}, setTimeInHr= () => {} }) => {
  const [days, hours, minutes, seconds] = useCountdown(targetDate);

  const { firebase } = useContext(FirebaseContext);
  const user = firebase.auth().currentUser || {};
  
  const DateTimeDisplay = ({ value, type, isDanger }) => {
    return (
      <div className={isDanger ? 'countdown danger' : 'countdown'} style={{color:'white',textDecoration:'none', textUnderline:'none', marginLeft:'20px', fontSize:'20px'}}>
        <p style={{textUnderline:'none'}}>{value}  <span style={{width:'20px'}}></span>  {type}   <span style={{width:'20px'}}></span> </p>
      </div>
    );
  };
  console.log('time log',days,hours,minutes,seconds)

  useEffect(() => {
    let timeInHours = 0;
    let minSec = 0;
    if(seconds>0){
      minSec = minutes > 0 ? minutes*seconds : seconds;
    }
    timeInHours = (hours>0 ? hours * minutes * seconds : minSec) / 3600
    
    setTimeInHr(timeInHours)
  },[minutes])

  const ShowCounter = ({ days, hours }) => {
    return (
      <div className="show-counter">
        <a
          href=""
          target="_blank"
          rel="noopener noreferrer"
          className="countdown-link"
          style={{textDecoration:"none"}}
        >
          {/* <DateTimeDisplay value={days} type={'Days'} isDanger={days <= 3} />
          <p>:</p> */}
          <DateTimeDisplay value={hours} type={'Hr :'} isDanger={false} />
          <p>:</p>
          <DateTimeDisplay value={minutes} type={'Min :'} isDanger={false} />
          <p>:</p>
          <DateTimeDisplay value={seconds} type={'Sec'} isDanger={false} />
        </a>
      </div>
    );
  };


  if (days + hours + minutes + seconds <= 0) {
     expiredNotice();
  } else {
    return (<>
      <ShowCounter
        days={days}
        hours={hours}
        minutes={minutes}
        seconds={seconds}
      />
    </>
    );
  }
};


export default CountdownTimer;