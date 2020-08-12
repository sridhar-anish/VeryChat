import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

const firebaseConfig = {
	apiKey: "AIzaSyDD3euaCmkpSW2Ub_2tZAqPsRNrZzdqP34",
	authDomain: "slack-clone-rfb.firebaseapp.com",
	databaseURL: "https://slack-clone-rfb.firebaseio.com",
	projectId: "slack-clone-rfb",
	storageBucket: "slack-clone-rfb.appspot.com",
	messagingSenderId: "311056762457",
	appId: "1:311056762457:web:e9d6321a489ebc1bd09348",
	measurementId: "G-DJ4MHGL3NB"
};
//Init firebase
firebase.initializeApp(firebaseConfig);

// Get a reference to the database service
var database = firebase.database();

export default firebase;
