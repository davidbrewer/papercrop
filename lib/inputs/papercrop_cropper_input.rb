require 'papercrop/helpers'
class PapercropCropperInput
  include Formtastic::Inputs::Base

  def to_html
    return '' unless can_preview?

    id_string = @builder.id_string_for(method)
    id_attributes_string = @builder.id_attributes_string_for(method)

    input_wrapping do
      label_html <<
      "<div id=\"papercrop_container_#{id_string}\" class=\"papercrop_container\" data-id-string=\"#{id_string}\" data-id-attributes-string=\"#{id_attributes_string}\">".html_safe <<
      image_preview_content <<
      cropper_html <<
      "</div>".html_safe 
    end
  end

  private

  def can_preview?
    image = @object.send(method)
    not (image.nil? or image.staged?)
  end

  def image_preview_content
    preview_size ? image_preview_html : ""
  end

  def preview_size
    options[:preview_size] || false
  end

  def link_size
    options[:link_size] || false
  end

  def image_preview_html
    if (link_size)
      preview = template.link_to template.image_tag(@object.send(method).url(preview_size), :class => "papercrop_image_preview"),
        @object.send(method).url(link_size), :target => "_blank"
    else
      preview = template.image_tag(@object.send(method).url(preview_size), :class => "papercrop_image_preview")
    end

    "<div class=\"papercrop_preview_container\">
      #{preview}
      <button class=\"papercrop_crop_button\">Crop Image</button>
    </div>".html_safe
  end

  def cropper_html
    cropper_width = @options[:cropper_width] || 500
    preview_width = @options[:preview_width] || 200
    set_select = @options[:set_select] || nil
    done_button_text = @options[:done_button_text] || "Done"
    cancel_button_text = @options[:cancel_button_text] || "Cancel"
    help_text = @options[:help_text] || nil

    
    cropper_html = '<div class="papercrop_cropper_container">' <<
      '<div class="papercrop_cropper">' <<
        builder.cropbox(method, :width => cropper_width, :set_select => set_select) <<
      '</div>' <<
      '<div class="papercrop_live_preview">' <<
        builder.crop_preview(method, :width => preview_width) <<
      '</div>' <<
      ((help_text.nil?) ? "" : '<div class="papercrop_help">' << help_text << '</div>') <<
      "<button class=\"papercrop_done_button\">#{done_button_text}</button>" <<
      "<button class=\"papercrop_cancel_button\">#{cancel_button_text}</button>" <<
    '</div>'

    cropper_html.html_safe
  end
end

