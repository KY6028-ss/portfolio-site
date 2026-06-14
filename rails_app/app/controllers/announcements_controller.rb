class AnnouncementsController < ApplicationController
  def index
    @pagy, @announcements = pagy(Announcement.published.recent)
  end

  def show
    @announcement = Announcement.published.find(params[:id])
  end
end