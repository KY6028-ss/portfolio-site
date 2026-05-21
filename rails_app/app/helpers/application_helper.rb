module ApplicationHelper
  def markdown(text)
    return "" if text.blank?
    Commonmarker.to_html(text).html_safe
  rescue StandardError
    simple_format(text)
  end
end
