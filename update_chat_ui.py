import os
import re

os.makedirs("rails_app/app/services", exist_ok=True)
with open("rails_app/app/services/ai_chat_service.rb", "w") as f:
    f.write("""require 'net/http'
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
    http.read_timeout = 10

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
""")

with open("rails_app/config/routes.rb", "r") as f:
    routes = f.read()
routes = routes.replace("resource :profile, only: [:show]", "resource :profile, only: [:show] do\n    post :chat, on: :collection\n  end")
with open("rails_app/config/routes.rb", "w") as f:
    f.write(routes)

with open("rails_app/app/controllers/profiles_controller.rb", "r") as f:
    ctrl = f.read()
new_ctrl = """class ProfilesController < ApplicationController
  def show
    @profile = Profile.current
  end

  def chat
    @profile = Profile.current
    @user_message = params[:message]
    
    if @user_message.present?
      @ai_reply = AiChatService.new(@user_message).call
    end

    render :show
  end
end
"""
with open("rails_app/app/controllers/profiles_controller.rb", "w") as f:
    f.write(new_ctrl)

with open("rails_app/app/views/profiles/show.html.erb", "r") as f:
    view = f.read()
new_view = view + """
<hr style="margin-top: 40px;">
<h2>🤖 AIアシスタントに質問する</h2>
<p>ポートフォリオやスキルについて、AIが直接お答えします。</p>

<%= form_with url: chat_profile_path, method: :post, local: true do |form| %>
  <div style="display: flex; gap: 10px; margin-bottom: 20px;">
    <%= form.text_field :message, value: @user_message, placeholder: "例: あなたのスキルを教えてください", style: "flex-grow: 1; padding: 10px; border-radius: 4px; border: 1px solid #ccc;" %>
    <%= form.submit "質問する", style: "padding: 10px 20px; cursor: pointer; background-color: #007bff; color: white; border: none; border-radius: 4px;" %>
  </div>
<% end %>

<% if @ai_reply.present? %>
  <div style="padding: 15px; background-color: #e6f7ff; border-left: 5px solid #007bff; border-radius: 4px;">
    <strong>🤖 AIからの回答:</strong>
    <p style="margin-top: 10px; white-space: pre-wrap;"><%= @ai_reply %></p>
  </div>
<% end %>
"""
with open("rails_app/app/views/profiles/show.html.erb", "w") as f:
    f.write(new_view)
