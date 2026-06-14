# frozen_string_literal: true

# Pagy initializer
# https://ddnexus.github.io/pagy/docs/api/pagy/

# Default number of items per page
require "pagy/extras/overflow"
Pagy::DEFAULT[:limit] = 10
Pagy::DEFAULT[:overflow] = :last_page
