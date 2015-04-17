(function ($) {
  window.jcrop_api = null;

  window.init_papercrop = function() {
    $("div[id$=_cropbox]").each(function() {

      var attachment = $(this).attr("id").replace("_cropbox", "");
      var preview    = !!$("#" + attachment + "_crop_preview").length;
      var aspect     = $("input#" + attachment + "_aspect").val();
      var width      = $(this).width();
      var min_size   = $("input#" + attachment + "_min_size").val().split('x');
      var max_size   = $("input#" + attachment + "_max_size").val().split('x');
      var original_w = $("input[id$='_" + attachment + "_original_w']").val();
      var original_h = $("input[id$='_" + attachment + "_original_h']").val();

      var set_select = $("input[id$='_" + attachment + "_set_select']").val();

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
          preview_width = $("#" + attachment + "_crop_preview_wrapper").width();

          rx = preview_width / coords.w;
          ry = preview_width / coords.h;

          $("img#" + attachment + "_crop_preview").css({
            width      : Math.round(rx * original_w) + "px",
            height     : Math.round((ry * original_h) / aspect) + "px",
            marginLeft : "-" + Math.round(rx * coords.x) + "px",
            marginTop  : "-" + Math.round((ry * coords.y) / aspect) + "px"
          });
        }

        $("#" + attachment + "_crop_x").val(Math.round(coords.x));
        $("#" + attachment + "_crop_y").val(Math.round(coords.y));
        $("#" + attachment + "_crop_w").val(Math.round(coords.w));
        $("#" + attachment + "_crop_h").val(Math.round(coords.h));
      };

      var jcrop_options =  {
        onChange    : update_crop,
        onSelect    : update_crop,
        aspectRatio : aspect,
        minSize     : min_size,
        maxSize     : max_size,
        boxWidth    : $("input[id$='_" + attachment + "_box_w']").val()
      };

      if (set_select) {
        jcrop_options.setSelect = set_select;
      }

      $(this).find("img").Jcrop(jcrop_options, function() {
        jcrop_api = this;
      });
    });
  };

  $(document).ready(function() {
    init_papercrop();
  });

}(jQuery));
