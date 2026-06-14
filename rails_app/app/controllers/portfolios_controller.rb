class PortfoliosController < ApplicationController
  def index
    @pagy, @portfolios = pagy(Portfolio.recent)
  end

  def show
    @portfolio = Portfolio.find(params[:id])
  end
end