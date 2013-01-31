Tweeter
===

Setup
---
Install Ruby.
Navigate to the root directory.

Type `bundle install`
Set Twitter API Keys and Secret as environment variables. (You should have received them via email).
Type `ruby server.rb -p 9292` to start the Thin web server.

Navigate to http://127.0.0.1:9292/    (It MUST be 127.0.0.1 or the Twitter API will not work.)

Thoughts
---
I tried to separate the API layer responsible for logging in, logging out, and fetching the timeline as much as possible from the actual web app. However, due to Twitter's OAuth 1.0 system, it's not a secure option to handle this all in Ember on the client-side. Hence, why I have some server-side redirects to implement the system.
Currently, the code just supports a single user, as I'm using session variables to keep track of the Twitter Access Token to fetch a feed.

Here's what's going on structurally:
* app
  * app.js (Main Ember file. Because there is not much complexity to this app, I am just inserting all the routes, models, etc. into one file. Otherwise, I'd use RequireJS.)
  * css 
  * img
  * lib (Contains JS libraries for use with my app.js)
* app.html (The App's HTML file)
* Gemfile
* Gemfile.lock
* README.md
* sass (Folder containing the sass source files for my app. I don't want to include these files in the public app folder, so I hide it here. It's not optimal, but it works for this project.)
* server.rb (Sinatra server file)
