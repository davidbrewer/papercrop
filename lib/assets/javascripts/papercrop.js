(function ($) {
  window.init_papercrop = function() {
    $("div.papercrop_container").each(function() {
      var id_string = $(this).attr('data-id-string');
      var id_attributes_string = $(this).attr('data-id-attributes-string');

      var preview    = !!$("#" + id_string + "_crop_preview").length;
      var aspect     = $("input#" + id_attributes_string + "_aspect").val();
      var width      = $(this).width();
      var min_size   = $("input#" + id_attributes_string + "_min_size").val().split('x');
      var max_size   = $("input#" + id_attributes_string + "_max_size").val().split('x');
      var original_w = $("input#" + id_attributes_string + "_original_w").val();
      var original_h = $("input#" + id_attributes_string + "_original_h").val();
      var set_select = $("input#" + id_attributes_string + "_set_select").val();

      var jcrop_api;

      if (set_select == "minimum") {
        var left = Math.round((original_w - min_size[0]) / 2);
        var top = Math.round((original_h - min_size[1]) / 2);
        set_select = [left, top, left + parseInt(min_size[0]), top + parseInt(min_size[1])];
      } else if (set_select == "maximum") {
        var left = Math.round((original_w - max_size[0]) / 2);
        var top = Math.round((original_h - max_size[1]) / 2);
        set_select = [left, top, left + parseInt(min_size[0]), top + parseInt(min_size[1])];
      } else if (set_select) {
        set_select = set_select.split(',');
      } else {
        set_select = false;
      }


      update_crop = function(coords) {
        var preview_width, rx, ry;

        if (preview) {
          preview_width = $("#" + id_string + "_crop_preview_wrapper").width();

          rx = preview_width / coords.w;
          ry = preview_width / coords.h;

          $("img#" + id_string + "_crop_preview").css({
            width      : Math.round(rx * original_w) + "px",
            height     : Math.round((ry * original_h) / aspect) + "px",
            marginLeft : "-" + Math.round(rx * coords.x) + "px",
            marginTop  : "-" + Math.round((ry * coords.y) / aspect) + "px"
          });
        }

        $("#" + id_attributes_string + "_crop_x").val(Math.round(coords.x));
        $("#" + id_attributes_string + "_crop_y").val(Math.round(coords.y));
        $("#" + id_attributes_string + "_crop_w").val(Math.round(coords.w));
        $("#" + id_attributes_string + "_crop_h").val(Math.round(coords.h));
      };

      var jcrop_options =  {
        onChange    : update_crop,
        onSelect    : update_crop,
        aspectRatio : aspect,
        minSize     : min_size,
        maxSize     : max_size,
        boxWidth    : $("input#" + id_attributes_string + "_box_w").val()
      };

      $(this).find("div[id$=_cropbox]").find("img").Jcrop(jcrop_options, function() {
        jcrop_api = this;
      });

      var hideCropper = function() {
        $('.papercrop_cropper_container').removeClass('active');
        $('#papercrop_scrim').remove();
      }

      var updatePreview = function() {
        $preview = $('#papercrop_container_' + id_string + ' .papercrop_preview_container a');
        $preview_img = $preview.find('img');
        $live_preview = $('#' + id_string + '_crop_preview_wrapper');
        $live_preview_img = $live_preview.find('img');

        $preview_img.attr('src', $live_preview_img.attr('src'));
        $preview_img.attr('style', $live_preview_img.attr('style'));
        $preview.attr('style', $live_preview.attr('style'));
        $preview.css({display: 'inline-block'});
      }

      var handleCropDone = function(e) {
        e.preventDefault();
        updatePreview();
        hideCropper();
      }

      var handleCropCancel = function(e) {
        e.preventDefault();
        $("#" + id_attributes_string + "_crop_x").val('');
        $("#" + id_attributes_string + "_crop_y").val('');
        $("#" + id_attributes_string + "_crop_w").val('');
        $("#" + id_attributes_string + "_crop_h").val('');
        hideCropper();
      }

      var handleActivateCropper = function(e) {
        e.preventDefault();
        $(this).parents('.papercrop_preview_container').
          siblings('.papercrop_cropper_container').
          addClass('active');

        $('body').append('<div id="papercrop_scrim"></div>');
        $('.papercrop_done_button').on('click', handleCropDone);
        $('#papercrop_scrim').on('click', handleCropCancel);
        $('.papercrop_cancel_button').on('click', handleCropCancel);
        jcrop_api.setSelect(set_select);
      }

      $('#papercrop_container_' + id_string + ' button.papercrop_crop_button').on('click', handleActivateCropper);
    });
  };

  $(document).ready(function() {
    init_papercrop();
  });

}(jQuery));
