require 'sinatra'

get '/' do
  File.read('index.html')
end

get '/test' do
  File.read('test.html')
end

get '/arnie_test' do
  File.read('arnie_test.html')
end

