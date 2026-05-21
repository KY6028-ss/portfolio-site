class PortfoliosController < ApplicationController
  def index
    @portfolios = Portfolio.recent
  end

  def show
    @portfolio = Portfolio.find(params[:id])
  end
end