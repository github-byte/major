import Firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
// import { seedDatabase } from '../seed'

const config = {
  // apiKey: "AIzaSyDCo7wZpSLxw6X87EkQAIdnrbPUaJYynlo",
  // authDomain: "minorproject-fb093.firebaseapp.com",
  // databaseURL: "https://minorproject-fb093-default-rtdb.asia-southeast1.firebasedatabase.app",
  // projectId: "minorproject-fb093",
  // storageBucket: "minorproject-fb093.appspot.com",
  // messagingSenderId: "798049006149",
  // appId: "1:798049006149:web:9a5226996230adb385692c"
  // apiKey: "AIzaSyCzKnyASkhxcpGl6CHSPBQju8kANdRC6Ro",
  // authDomain: "major-project-b74b9.firebaseapp.com",
  // databaseURL: "https://minorproject-fb093-default-rtdb.asia-southeast1.firebasedatabase.app",
  // projectId: "major-project-b74b9",
  // storageBucket: "major-project-b74b9.appspot.com",
  // messagingSenderId: "672257085914",
  // appId: "1:672257085914:web:95915e62913016e78970e3"
  apiKey: "AIzaSyCkq1uIy6aWxTkzEiy0HCst6h0pGraElMk",
  authDomain: "fp-2-3f4f9.firebaseapp.com",
  projectId: "fp-2-3f4f9",
  //https://fp-2-3f4f9-default-rtdb.firebaseio.com/
  databaseURL:"https://fp-2-3f4f9-default-rtdb.firebaseio.com/",
  storageBucket: "fp-2-3f4f9.appspot.com",
  messagingSenderId: "236110241782",
  appId: "1:236110241782:web:d0d7c329c96abe7cdaf1d7"
};

const firebase = Firebase.initializeApp(config);
// seedDatabase(firebase);
export { firebase };
