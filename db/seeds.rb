require 'net/http'
require 'json'
require 'openssl'

api_key = 'a4ca6d84e8d747a6a7d25e76756d8085'

uri = URI("https://api.rawg.io/api/games")
uri.query = URI.encode_www_form({ key: api_key })

http = Net::HTTP.new(uri.host, uri.port)
http.use_ssl = true
http.verify_mode = OpenSSL::SSL::VERIFY_NONE

request = Net::HTTP::Get.new(uri)

response = http.request(request)

if response.code == '200'
  data = JSON.parse(response.body)

  # Extract the game data from the response
  games = data['results'].map { |game| { id: game['id'], title: game['name'], description: game['description_raw'], image_url: game['background_image'] } }

  # Create game records
  games.each do |game|
    Game.create(game)
   
  end

  puts 'Seed data created successfully.'
else
  puts "Failed to retrieve game data. Response code: #{response.code}"
  puts "Response body: #{response.body}"
end