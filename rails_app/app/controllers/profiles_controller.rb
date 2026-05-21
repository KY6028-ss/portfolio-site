class ProfilesController < ApplicationController
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
