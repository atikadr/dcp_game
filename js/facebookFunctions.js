function postToWall(facebookID){
	FB.ui(
	{
		method: 'feed',
		name: 'Glass',
		link: '',
		picture: 'https://dl.dropboxusercontent.com/u/8232065/background.png',
		caption: "Let the music flow",
		description: "You have just obtained a new highscore of 12430 on Glass"
	},
	function(response) {
		if (response && response.post_id) {
			alert('Your post has been published!');
		} 
	}
	);
}


function getFriends() {
	FB.api('/me/friends', function(response) {
		if(response.data) {
			var friendsArray = "";
			$.each(response.data,function(index,friend) {
				friendsArray += friend.name + ":" + friend.id + ",";
			});
			friendsArray = friendsArray.substring(0,friendsArray.length-1);
				localStorage.friendsList = friendsArray;
				getMe();
			} else {
				alert("Error!");
			}
		});
}

var newwindow;

function closePopupAndRedirect(){
	newwindow.close();
	window.location = "../html/gamePlay.html";
}

function makeRegisterPage(){
	newwindow = window.open("../html/popup.html","hello!","height=500,width=800");
}

/*
	Returns	0 if user is not yet registered
			1 if user has both display name and RFID
			2 if user has no display name but has RFID
			3 if user has display name but no RFID
			4 if user has none
*/

function serverLogin(facebookID){
	$.ajax({
		url:"../login/"+facebookID,
		type:"GET",
		success:function(data){
			console.log(data);
			if(data.match(/\d+/g) == null){ // name
				localStorage.displayName = data;
				window.location = "../html/gamePlay.html";
			}
			else{
				makeRegisterPage();
			}
		}
	});
}

function getMe(){
	FB.api('/me', function(response) {
		//loadNewPage(response.id,response.name,response.email);
		localStorage.userID = response.id;
		localStorage.username = response.name;
		localStorage.displayName = response.id;
		//postToWall(response.id);
		//window.location = "../html/gamePlay.html";
		serverLogin(response.id);
	});
}

function login() {
	FB.login(function(response) {
		if (response.authResponse) {
			getFriends();
		} else {
            // cancelled
        }
    },{scope:'email,publish_stream'});
}

window.fbAsyncInit = function() {
	FB.init({
      appId      : '589493871130102', // App ID
      channelUrl : '../channel.html', // Channel File
      status     : true, // check login status
      cookie     : true, // enable cookies to allow the server to access the session
      xfbml      : true,  // parse XFBML
      oauth : true // Enable oauth authentication
  });

    // Additional init code here

    FB.getLoginStatus(function(response) {
    	if (response.status === 'connected') {
    // connected
} else if (response.status === 'not_authorized') {
    // not_authorized
} else {
    // not_logged_in
}
});

};

  // Load the SDK Asynchronously
  (function(d){
  	var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
  	if (d.getElementById(id)) {return;}
  	js = d.createElement('script'); js.id = id; js.async = true;
  	js.src = "//connect.facebook.net/en_US/all.js";
  	ref.parentNode.insertBefore(js, ref);
  }(document));