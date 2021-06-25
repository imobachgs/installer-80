# lib/installer_options.rb

module Yast2
  class InstallerOptions
    DEFAULT_LANGUAGE = "en_US".freeze
    private_constant :DEFAULT_LANGUAGE

    # TODO: add some metaprogramming to define attributes and its types

    attr_accessor :language, :target, :product

    def initialize
      @language = DEFAULT_LANGUAGE
    end
  end
end
