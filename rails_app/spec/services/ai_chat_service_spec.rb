require 'rails_helper'
require 'webmock/rspec'

RSpec.describe AiChatService do
  let(:message) { "こんにちは" }
  let(:service) { AiChatService.new(message) }
  let(:api_url) { AiChatService::API_URL }

  describe '#call' do
    it 'returns the reply from the AI API' do
      stub_request(:post, api_url)
        .with(body: { message: message }.to_json)
        .to_return(status: 200, body: { reply: "ハロー！" }.to_json)

      expect(service.call).to eq("ハロー！")
    end

    it 'returns an error message on API failure' do
      stub_request(:post, api_url).to_return(status: 500)

      expect(service.call).to include("エラーが発生しました: 500")
    end

    it 'returns a connection error message on network failure' do
      stub_request(:post, api_url).to_raise(StandardError.new("Connection refused"))

      expect(service.call).to include("通信エラーが発生しました")
    end
  end
end
