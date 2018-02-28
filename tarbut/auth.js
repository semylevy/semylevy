var config = {
    apiKey: "AIzaSyDNR3HFRSLQCGdOuoGF62rbukFrP0A-Suk",
    authDomain: "test01-e6079.firebaseapp.com",
    databaseURL: "https://test01-e6079.firebaseio.com",
    projectId: "test01-e6079",
    storageBucket: "",
    messagingSenderId: "13845522477"
  };
firebase.initializeApp(config);

var ref = firebase.database().ref();
var name, email, photoUrl, uid, emailVerified;

firebase.auth().onAuthStateChanged(function(user) {
if (user) {
    // User is signed in.
    var user = firebase.auth().currentUser;

    if (user != null) {
    name = user.displayName;
    email = user.email;
    photoUrl = user.photoURL;
    emailVerified = user.emailVerified;
    uid = user.uid;  // The user's ID, unique to the Firebase project. Do NOT use
                    // this value to authenticate with your backend server, if
                    // you have one. Use User.getToken() instead.
    var nameField = document.getElementById('name');
    nameField.innerText = name;
    }

    ref.child('users').child(uid).on('child_added', function (snapshot) {
        var data = snapshot.val();
        var message = data.text;
    
        if (message != undefined) {
            showPost(name, message);
        }
    });
} else {
    login();
}
});

var provider = new firebase.auth.GoogleAuthProvider();

function login() {
firebase.auth().signInWithRedirect(provider).then(function(result) {
    // This gives you a Google Access Token. You can use it to access the Google API.
    var token = result.credential.accessToken;
    // The signed-in user info.
    var user = result.user;
    // ...
}).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...
});
}

function logout() {
firebase.auth().signOut().then(function() {
    // Sign-out successful.
    }).catch(function(error) {
    // An error happened.
    });
}

function createPostRedirect() {
    window.location.replace("createPost.html");
}

// Save data to firebase
function savedata(){
  var messageField = document.getElementById('messageInput');
  var message = messageField.value;

  ref.child('users').child(uid).push(
  {
  fieldName:'messageField', 
  text:message
  });
  messageField.value = '';
}

function showPost(name, message) {
    var table = document.getElementById("post_table");
    var row = table.insertRow(0);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    cell1.innerHTML = name;
    cell2.innerHTML = message;
}