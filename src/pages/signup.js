import React, { useState, useContext, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { FirebaseContext } from '../context/firebase';
import { Form } from '../components';
import { HeaderContainer } from '../containers/header';
import Tesseract from 'tesseract.js';
import preprocessImage from './preprocess';
import { FooterContainer } from '../containers/footer';
import * as ROUTES from '../constants/routes';

export default function Signup() {
  const history = useHistory();
  const { firebase } = useContext(FirebaseContext);

  const [firstName, setFirstName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [text, setText] = useState("");
  const [imagePath, setImagePath] = useState("");
  const [showPhone,setShowPhone] = useState({status:false,age:0})
  const [mynumber, setnumber] = useState("");
  const [otp, setotp] = useState({status:false,otp:''});
  const [show, setshow] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("")
  const [timeLimit,setTimeLimit] = useState("")
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  console.log('path',imagePath.length)
  const isInvalid = firstName === '' || password === '' || emailAddress === '' || imagePath.length <= 0 || mynumber.length<10;
  const NumInvalid = mynumber.length < 10;
  const OtpValid = otp.length < 6

  const handleChange = (event) => {
    // if(event.target.files[0] && event.target.files[0].length > 0)
    if(!event){
      alert(event)
      setError("Add image")
      return
    } 
    setImagePath(URL.createObjectURL(event.target.files[0]));
  }

  const validate = () => {
    let err = false
    if(password.length !== confirmPassword.length) {
      err = true
      setError("Password do not match")
    }
    if(timeLimit.length>0){
      if(isNaN(Number(timeLimit)) ||  Number(timeLimit) < 1) {
        err = true
        setError("Please enter valid watch time limit") 
      }
      if(Number(timeLimit) > 6) {
        err = true
        setError("You can set maximum Time Limit of 6 hours")
      }
      return;
    }
    if(isNaN(Number(mynumber)) || mynumber.length < 10  || mynumber.length > 10){
      err = true
      setError("Please enter valid phone number");
    }
    return err
  }

  const handleClick = (e) => {
    e.preventDefault()
    const canvas = canvasRef ? canvasRef.current : "";
    const ctx = canvas ? canvas.getContext('2d') : "";
    if(ctx && ctx.length>0){
      ctx.drawImage(imageRef.current, 0, 0);
      ctx.putImageData(preprocessImage(canvas),0,0);
      const dataUrl = canvas.toDataURL("image/jpeg");
    }

    if(validate()) return;
    timeLimit.length>0 && window.localStorage.setItem("timeLimit",timeLimit)
    Tesseract.recognize(
      imagePath,'eng',
      { 
        logger: m => console.log(m) 
      }
    )
    .catch (err => {
      console.error(err);
    })
    .then(result => {
      // Get Confidence score
      let confidence = result.confidence
     
      let text = result.data.text
      console.log('my text',result)
      setText(text);
      DOBAndMobileNumberextraction(text);
      // setShowPhone({status:true})
  
    })
  }

  function DOBAndMobileNumberextraction(text=''){
    // var text = document.getElementById("mydemo").innerText;
    var resultindex1 = text.indexOf("DOB:");
    // alert(text)
    // if(resultindex1==-1){
    //   // document.getElementById("DOB").innerHTML = "NA";
    //   setShowPhone({...showPhone,status:true})
    // }
    {
      let desiredstartindex1 = resultindex1+5;
      let desiredDOB = "";
      for(let i=desiredstartindex1; i<text.length && text[i] != ' '; i++){
        console.log(text[i]);
        desiredDOB += text[i];
      }
      let year = desiredDOB.slice(6,10)
      let age = 2022 - Number(year) 
      console.log('my age',text,age)
      window.localStorage.setItem("age",age)
      setShowPhone({status:true,age:age})
    }

    var resultindex2 = text.indexOf("Mobie:");
    console.log('my result',resultindex2);
    if(resultindex2 == -1){
    // document.getElementById("MobileNumber").innerHTML = "NA";
    }
    else{
      let desiredstartindex2 = resultindex2+8;
      let desiredMobileNo = "";
      for(let i=desiredstartindex2-1; i<text.length && text[i]!=' '; i++){
        desiredMobileNo += text[i];
      }
      console.log("desrs",desiredMobileNo)
      // setShowPhone({})
          // document.getElementById("MobileNumber").innerHTML = desiredMobileNo;
    }
   }

   const  configureCaptcha = () =>{
    window.recaptchaVerifier = new firebase.firebase_.auth.RecaptchaVerifier('recaptcha-container', {
      'size': 'invisible',
      'callback': (response) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
     
        onSignInSubmit();
        console.log('recaptcha verified')
      },
      defaultCountry:'IN'
    });
  }

   const onSignInSubmit = (e) => {
    e.preventDefault();
    configureCaptcha()
    
    const phoneNumber = '+91' + mynumber;
    console.log(mynumber)

    const appVerifier = window.recaptchaVerifier;
    console.log('senet',appVerifier)
    
    firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier)
    .then((confirmationResult) => {
      window.confirmationResult = confirmationResult;
      console.log("otp sent!!!",confirmationResult);
      setotp({status:true})
      // ...
    }).catch((error) => {
      // Error; SMS not sent
      // console.log(error)
      alert(error)
    });
 
  }
// Validate OTP
  const ValidateOtp = () => {
    console.log('my new otp',otp['otp'], showPhone['age'])
    if(!otp['otp']) return

    window.confirmationResult.confirm(otp['otp']).then((result) => {
      // User signed in successfully.
      const user = result.user;
      user.updateProfile({
        displayName: firstName,
        photoURL: Math.floor(Math.random() * 5) + 1,
        // age: age
      })
      console.log('my new otp',user)
      window.location.href= ROUTES.BROWSE
    
      console.log('MyUser',JSON.stringify(user));
    
      // ...
    }).catch((error) => {
      // User couldn't sign in (bad verification code?)
      // ...
      console.log(error)
    });
  }

  const handleSignup = (event) => {
    event.preventDefault();

    firebase
      .auth()
      .createUserWithEmailAndPassword(emailAddress, password)
      .then((result) =>
        result.user
          .updateProfile({
            displayName: firstName,
            photoURL: Math.floor(Math.random() * 5) + 1,
          })
          .then(() => {
            history.push(ROUTES.BROWSE);
          })
      )
      .catch((error) => {
        setEmailAddress('');
        setPassword('');
        setError(error.message);
      });
  };

  return (
    <>
      <HeaderContainer>
        <Form>
          <Form.Title>Sign Up</Form.Title>
          {error && <Form.Error>{error}</Form.Error>}

          { show['phone'] &&  otp['status'] ? 
            <><Form.Input
                placeholder="Otp"
                value={otp['otp']}
                id="otp"
                onChange={(e) => setotp({status:otp['status'],otp:e.target.value})}/>
              <Form.Submit disabled={OtpValid} type="submit" onClick={ValidateOtp}>{'Verify Otp' }</Form.Submit>
            </>
              :
  
            <Form.Base onSubmit={handleClick} method="POST">
            <Form.Input
              placeholder="Your Name"
              value={firstName}
              onChange={({ target }) => setFirstName(target.value)}
            />
            <Form.Input
              placeholder="Email address"
              value={emailAddress}
              onChange={({ target }) => setEmailAddress(target.value)}
            />
            <Form.Input
              type="password"
              value={password}
              autoComplete="off"
              placeholder="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
             <Form.Input
              type="password"
              value={confirmPassword}
              autoComplete="off"
              placeholder="Confirm Password"
              onChange={({ target }) => setConfirmPassword(target.value)}
            />
            <Form.Input
              type="text"
              value={timeLimit}
              autoComplete="off"
              placeholder="Maximum Watch Time Limit"
              onChange={({ target }) => setTimeLimit(target.value)}
            />

            <h5 style={{color:'grey'}}>Upload Aadhar Card</h5>
              <img src={imagePath} className="App-logo" ref={imageRef} />
              {/* <h3>Canvas</h3> */}
              <canvas ref={canvasRef} width={700} height={300} style={{display:'none'}}></canvas>
              {/* <div className="pin-box">
                <p style={{color:'white'}} id="mydemo"> {text} </p>
              </div> */}
              <div style={{display:'flex',justifyContent:'center',}}>
              {!imagePath && <i class="fa-solid fa-upload" style={{fontSize:"60px",cursor:'pointer'}} onClick={() => document.getElementById("selectFile").click()}></i>}
                <input type="file" id="selectFile" onChange={handleChange} style={{display:'none'}}/>
              </div>
              {/* <button onClick={handleClick} style={{height:50}}>Convert to text</button> */}
              <div style={{display:'flex',flexDirection:'column',marginTop:"30px"}}>  
                <Form.Input
                placeholder="Phone"
                value={mynumber}
                id="ph"
                onChange={({ target }) => setnumber(target.value)}
              />
              <div id="recaptcha-container"></div>
              {/* <Form.Submit disabled={otp['status'] ? OtpValid : NumInvalid} type="submit" onClick={otp['status'] ? ValidateOtp : onSignInSubmit}>{otp['status'] ? 'Verify Otp' :'Get Otp'}</Form.Submit> */}
            </div> 
            <Form.Submit disabled={isInvalid} type="submit">
              Sign Up
            </Form.Submit>
          </Form.Base>}

          <Form.Text>
            Already a user? <Form.Link to="/signin">Sign in now.</Form.Link>
          </Form.Text>
          <Form.TextSmall>
            This page is protected by Google reCAPTCHA to ensure you're not a bot. Learn more.
          </Form.TextSmall>
        </Form>
      </HeaderContainer>
      <FooterContainer />
    </>
  );
}
