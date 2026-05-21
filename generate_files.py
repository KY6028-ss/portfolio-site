import os

files = {
    "rails_app/db/migrate/20260517000003_create_portfolios.rb": """class CreatePortfolios < ActiveRecord::Migration[7.0]
  def change
    create_table :portfolios do |t|
      t.string :title, null: false
      t.text :description, null: false
      t.string :url
      t.string :image_url

      t.timestamps
    end
  end
end""",
    "rails_app/db/migrate/20260517000004_create_blogs.rb": """class CreateBlogs < ActiveRecord::Migration[7.0]
  def change
    create_table :blogs do |t|
      t.string :title, null: false
      t.text :content, null: false
      t.datetime :published_at

      t.timestamps
    end
  end
end""",
    "rails_app/app/models/application_record.rb": """class ApplicationRecord < ActiveRecord::Base
  primary_abstract_class
end""",
    "rails_app/app/controllers/application_controller.rb": """class ApplicationController < ActionController::Base
end""",
    "rails_app/config/routes.rb": """Rails.application.routes.draw do
  resource :profile, only: [:show]
  resources :announcements, only: [:index, :show]
  resources :portfolios, only: [:index, :show]
  resources :blogs, only: [:index, :show]
end""",
    "rails_app/app/models/profile.rb": """class Profile < ApplicationRecord
  validates :name, presence: true

  def self.current
    first || create!(name: "あなたの名前", bio: "自己紹介文をここに入力", site_description: "ポートフォリオサイトの趣旨")
  end
end""",
    "rails_app/app/models/announcement.rb": """class Announcement < ApplicationRecord
  validates :title, presence: true
  validates :content, presence: true

  scope :published, -> { where('published_at <= ?', Time.current) }
  scope :recent, -> { order(published_at: :desc) }
end""",
    "rails_app/app/models/portfolio.rb": """class Portfolio < ApplicationRecord
  validates :title, presence: true
  validates :description, presence: true

  scope :recent, -> { order(created_at: :desc) }
end""",
    "rails_app/app/models/blog.rb": """class Blog < ApplicationRecord
  validates :title, presence: true
  validates :content, presence: true

  scope :published, -> { where('published_at <= ?', Time.current) }
  scope :recent, -> { order(published_at: :desc) }
end""",
    "rails_app/app/controllers/profiles_controller.rb": """class ProfilesController < ApplicationController
  def show
    @profile = Profile.current
  end
end""",
    "rails_app/app/controllers/announcements_controller.rb": """class AnnouncementsController < ApplicationController
  def index
    @announcements = Announcement.published.recent
  end

  def show
    @announcement = Announcement.published.find(params[:id])
  end
end""",
    "rails_app/app/controllers/portfolios_controller.rb": """class PortfoliosController < ApplicationController
  def index
    @portfolios = Portfolio.recent
  end

  def show
    @portfolio = Portfolio.find(params[:id])
  end
end""",
    "rails_app/app/controllers/blogs_controller.rb": """class BlogsController < ApplicationController
  def index
    @blogs = Blog.published.recent
  end

  def show
    @blog = Blog.published.find(params[:id])
  end
end""",
    "rails_app/app/views/profiles/show.html.erb": """<h1>このサイトについて</h1>
<h2>プロフィール</h2>
<p><strong>名前:</strong> <%= @profile.name %></p>
<div>
  <h3>自己紹介</h3>
  <%= simple_format(@profile.bio) %>
</div>
<div>
  <h3>サイトの趣旨</h3>
  <%= simple_format(@profile.site_description) %>
</div>""",
    "rails_app/app/views/announcements/index.html.erb": """<h1>お知らせ</h1>
<ul>
  <% @announcements.each do |announcement| %>
    <li>
      <time><%= announcement.published_at.strftime('%Y-%m-%d') %></time>
      <%= link_to announcement.title, announcement_path(announcement) %>
    </li>
  <% end %>
</ul>""",
    "rails_app/app/views/announcements/show.html.erb": """<h1><%= @announcement.title %></h1>
<p><time><%= @announcement.published_at.strftime('%Y-%m-%d %H:%M') %></time></p>
<div>
  <%= simple_format(@announcement.content) %>
</div>
<%= link_to '一覧に戻る', announcements_path %>""",
    "rails_app/app/views/portfolios/index.html.erb": """<h1>ポートフォリオ / 実績</h1>
<div class="portfolio-list">
  <% @portfolios.each do |portfolio| %>
    <div class="portfolio-item">
      <h2><%= link_to portfolio.title, portfolio_path(portfolio) %></h2>
      <p><%= truncate(portfolio.description, length: 100) %></p>
    </div>
  <% end %>
</div>""",
    "rails_app/app/views/portfolios/show.html.erb": """<h1><%= @portfolio.title %></h1>
<% if @portfolio.image_url.present? %>
  <%= image_tag @portfolio.image_url, alt: @portfolio.title %>
<% end %>
<div>
  <%= simple_format(@portfolio.description) %>
</div>
<% if @portfolio.url.present? %>
  <p><%= link_to "プロジェクトのWebサイトへ", @portfolio.url, target: "_blank", rel: "noopener" %></p>
<% end %>
<%= link_to '一覧に戻る', portfolios_path %>""",
    "rails_app/app/views/blogs/index.html.erb": """<h1>技術ブログ</h1>
<div class="blog-list">
  <% @blogs.each do |blog| %>
    <article class="blog-item">
      <time><%= blog.published_at.strftime('%Y-%m-%d') %></time>
      <h2><%= link_to blog.title, blog_path(blog) %></h2>
    </article>
  <% end %>
</div>""",
    "rails_app/app/views/blogs/show.html.erb": """<h1><%= @blog.title %></h1>
<p><time><%= @blog.published_at.strftime('%Y-%m-%d') %></time></p>
<div class="blog-content">
  <%= simple_format(@blog.content) %>
</div>
<%= link_to '記事一覧に戻る', blogs_path %>""",
    "rails_app/spec/models/announcement_spec.rb": """require 'rails_helper'

RSpec.describe Announcement, type: :model do
  describe 'バリデーションのテスト' do
    it 'タイトルとコンテンツがあれば有効であること' do
      announcement = Announcement.new(title: 'サイト公開', content: 'ポートフォリオを作りました。', published_at: Time.current)
      expect(announcement).to be_valid
    end

    it 'タイトルが空の場合は無効であること' do
      announcement = Announcement.new(title: nil, content: '内容')
      expect(announcement).to be_invalid
    end
  end

  describe 'スコープのテスト' do
    it 'publishedスコープが「公開済み」のものだけを返すこと' do
      published_announcement = Announcement.create!(title: '公開', content: '内容', published_at: 1.day.ago)
      draft_announcement = Announcement.create!(title: '未公開', content: '内容', published_at: 1.day.from_now)

      expect(Announcement.published).to include(published_announcement)
      expect(Announcement.published).not_to include(draft_announcement)
    end
  end
end""",
    "rails_app/spec/requests/announcements_spec.rb": """require 'rails_helper'

RSpec.describe "Announcements", type: :request do
  describe "GET /announcements" do
    it "正常なレスポンスを返し、お知らせのタイトルが含まれていること" do
      Announcement.create!(title: 'テストお知らせ', content: 'テスト内容', published_at: Time.current)
      
      get announcements_path
      
      expect(response).to have_http_status(:success)
      expect(response.body).to include('テストお知らせ')
    end
  end
end""",
    "rails_app/spec/models/blog_spec.rb": """require 'rails_helper'

RSpec.describe Blog, type: :model do
  describe 'スコープのテスト' do
    describe '.published' do
      it '公開日時が過去の記事のみを取得できること' do
        published_blog = Blog.create!(title: 'Rubyの記事', content: '内容', published_at: 1.day.ago)
        draft_blog = Blog.create!(title: '下書き', content: '内容', published_at: 1.day.from_now)

        result = Blog.published

        expect(result).to include(published_blog)
        expect(result).not_to include(draft_blog)
      end
    end
  end
end""",
    "rails_app/spec/rails_helper.rb": """# Dummy rails_helper for demonstration
require 'spec_helper'
# In a real app this would load the Rails environment
"""
}

for path, content in files.items():
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
print("All files generated successfully.")