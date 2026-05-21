require 'net/http'
require 'uri'
require 'json'

class AiChatService
  API_URL = ENV.fetch('AI_API_URL', 'http://host.docker.internal:8000/api/chat')

  def initialize(message)
    @message = message
  end

  def call
    uri = URI.parse(API_URL)
    http = Net::HTTP.new(uri.host, uri.port)
    http.read_timeout = 30

    request = Net::HTTP::Post.new(uri.request_uri, { 'Content-Type' => 'application/json' })
    request.body = { message: @message }.to_json

    begin
      response = http.request(request)
      if response.is_a?(Net::HTTPSuccess)
        result = JSON.parse(response.body)
        return result['reply']
      else
        return "エラーが発生しました: #{response.code}"
      end
    rescue StandardError => e
      return "通信エラーが発生しました: #{e.message}"
    end
  end
end