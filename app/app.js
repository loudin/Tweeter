window.App = Ember.Application.create();

App.Tweet = Ember.Object.extend({
	created_at: new Date(),
	favorited: false,
	text: null,
	id: null,
	in_reply_to_screen_name: null,
	source: null,
	user: {}
});

App.Router.map(function(){
	this.route("index");
	this.resource("timeline",function(){
		
	});
	this.route("logout");
});

//Index
App.IndexRoute = Ember.Route.extend({
	redirect: function(){
		_this = this;
		$.get("/users/has_access_token",function(response){
			if (response.body)			_this.transitionTo("timeline");
		});
	}
});

//Timeline
//Timeline Controller. We can choose to save tweets with links or not. The CreateTweet function handles this logic.
App.TimelineIndexController = Ember.ArrayController.extend({
	saveTweetsWithLinks: true,
	createTweet: function(hash){
		if ( !this.saveTweetsWithLinks && ( (hash.entities && hash.entities.urls && hash.entities.urls.length > 0) || (hash.text.indexOf("http://") || hash.text.indexOf("https://")) ) )	return false;
		this.pushObject(App.Tweet.create(hash));
	}
});
//TimelineIndex Route gets the timeline from the server, determines whether to show the view, and passes JSON along to the controller
App.TimelineIndexRoute = Ember.Route.extend({
	setupController: function(controller) {
		$.get("/timeline",function(response){
			jsonFromTwitter = JSON.parse(response.body)
			if (!jsonFromTwitter)			return Ember.State.transitionTo("index");		//Redirect to the home page if the user is not logged in.
			
			//Otherwise, we have content to show. Let's load it up.
			controller.set('content', []);				    
			jsonFromTwitter.map(function(tweet){
				controller.createTweet(tweet);
			});				
		});
	},
	renderTemplate: function(){
		this._super();
		this.render('header', {outlet: "header"});
	}
});

//Logout
//Sends a query to the API to log out. When the API returns, we redirect to the index page.
App.LogoutRoute = Ember.Route.extend({
	redirect: function(){
		_this = this;
		$.get("/logout",function(response){
			_this.transitionTo("index");
		});		
	},
	renderTemplate: function(){}
});


