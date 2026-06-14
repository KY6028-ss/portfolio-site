class BlogsController < ApplicationController
  def index
    @pagy, @blogs = pagy(Blog.published.recent)
  end

  def show
    @blog = Blog.published.find(params[:id])
  end
end