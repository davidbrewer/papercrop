require 'papercrop/helpers'
class PapercropCropperInput
  include Formtastic::Inputs::Base
  def to_html
    cropper_width = @options[:cropper_width] || 500
    preview_width = @options[:preview_width] || 200

    input_wrapping do
      label_html <<
      '<div class="papercrop_container">'.html_safe <<
        '<div class="papercrop_cropper">'.html_safe <<
          builder.cropbox(method, :width => cropper_width) <<
        '</div>'.html_safe <<
        '<div class="papercrop_preview">'.html_safe <<
          builder.crop_preview(method, :width => preview_width) <<
        '</div>'.html_safe <<
      '</div>'.html_safe
    end
  end
end

