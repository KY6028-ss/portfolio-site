require 'rails_helper'

# published_at が nil でもビューがクラッシュしない（&.strftime ガード）ことを検証する。
RSpec.describe "blogs/index", type: :view do
  it "published_at が nil でも NoMethodError を発生させずに描画できること" do
    blog = Blog.create!(title: '下書き記事', content: '本文', published_at: nil)
    assign(:blogs, [blog])
    assign(:pagy, Pagy.new(count: 1))

    expect { render }.not_to raise_error
    expect(rendered).to include('下書き記事')
  end
end
