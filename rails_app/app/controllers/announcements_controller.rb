class AnnouncementsController < ApplicationController
  def index
    @announcements = Announcement.published.recent
  end

  def show
    @announcement = Announcement.published.find(params[:id])
  end
end