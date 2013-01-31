window.App = Ember.Application.create();

App.Store = DS.Store.extend({
  revision: 11
});

//Tweet Model.
App.Tweet = DS.Model.extend({
	created_at: DS.attr("date"),
	favorited: DS.attr("boolean"),
	text: DS.attr("string"),
	in_reply_to_screen_name: DS.attr("string"),
	source: DS.attr("string"),
	user: {}
});

//Router for the app. We have an index, timeline resource, and a logout path.
App.Router.map(function(){
	this.route("index");
	this.resource("timeline",function(){});
	this.route("logout");
});

//Index. Redirect to the timeline if the user has an access token already.
App.IndexRoute = Ember.Route.extend({
	redirect: function(){
		_this = this;
		$.get("/users/me/has_access_token",function(response){
			if (response.body)			_this.transitionTo("timeline");
		});
	}
});

//TIMELINE
//Timeline Controller. We can choose to save tweets with links or not. The CreateTweet function handles this logic.
App.TimelineIndexController = Ember.ArrayController.extend({
	saveTweetsWithLinks: false,
	createTweet: function(hash){
		if ( !this.saveTweetsWithLinks && ((hash.entities && hash.entities.urls && hash.entities.urls.length > 0) || hash.text.indexOf("http://") != -1 || hash.text.indexOf("https://") != -1) )	return false;
		this.pushObject(App.Tweet.createRecord(hash));
	}
});
//TimelineIndex Route gets the timeline from the server, determines whether to show the view, and passes JSON along to the controller
App.TimelineIndexRoute = Ember.Route.extend({
	setupController: function(controller) {
		$.get("/timeline",function(response){
			jsonFromTwitter = JSON.parse(response.body)
			if (!jsonFromTwitter)			return Ember.State.transitionTo("index");		//Redirect to the home page if the user is not logged in.

			if (jsonFromTwitter && jsonFromTwitter.errors){
				return controller.set('error','Error fetching data from the Twitter API.')
			}
			//if (jsonFromTwitter && jsonFromTwitte)
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


