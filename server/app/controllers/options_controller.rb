class OptionsController < ApplicationController
  def show
    # FIXME: options = Yast2::InstallerClient.instance.options
    render json: { data: { language: "en_US" } }
  end

  def update
    options = Yast2::Installer.instance.options
    given_options = params.require(:options).as_json
    updated_opts = given_options.each_with_object([]) do |(key, value), updated|
      meth = "#{key}="
      next unless options.respond_to?(meth)

      options.send(meth, value)
      updated << key
    end
    render json: { data: updated_opts }
  end
end
