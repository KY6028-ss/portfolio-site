class BlogsController < ApplicationController
  def index
    @blogs = Blog.published.recent
  end

  def show
    @blog = Blog.published.find(params[:id])
  end
end