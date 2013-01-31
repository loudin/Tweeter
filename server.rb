require 'sinatra'
require "sinatra/json"
require 'oauth'
require 'json'

set :public_folder, File.dirname(__FILE__) + '/app'
use Rack::Session::Pool

#Render the file on the server in the root directory.
get '/' do
  File.read('app.html')
end

#API
#Link the user clicks on to begin the Twitter OAuth Process
get '/twitter/oauth' do
  consumer = OAuth::Consumer.new(ENV["TWITTER_API_KEY"], ENV["TWITTER_API_SECRET"],{ 
    :site => "https://api.twitter.com",
    :scheme => :header
  })
  token = consumer.get_request_token(:oauth_callback => "http://127.0.0.1:9292/users/login")
  session[:request_token] = token
  redirect token.authorize_url(:oauth_callback => "http://127.0.0.1:9292/users/login")
end

#OAuth Callback - where Twitter redirects after the initial interaction.
get '/users/login' do
  request_token = session[:request_token]  
  session[:access_token] = request_token.get_access_token
  puts session[:access_token]
  redirect "/#/timeline"
end

#AJAX call to get the user's timeline
get '/timeline' do
  return json :body => false if !session || !session[:access_token]
    
  json :body => session[:access_token].get("/1/statuses/home_timeline.json?include_entities=true").body
end

#Logout of the app
get '/logout' do
  session[:request_token] = nil
  session[:access_token] = nil
  redirect "/"
end

#Check to see if the user has an access token
get '/users/me/has_access_token' do
  json :body => session && session[:access_token] ? true : false
end