var load_home_content = function() {
    var ComponentName = "HomeContent";
    var ComponentId = "#ybj-content";
    var SubComponents = ['#ybj-comment-panel'];

    var Metadata = {
        height: '800px',
        background_color: '#f1f1f1',
    }

    var local_template = `
        <div class='home-page-content'>
            <div id='ybj-comment-panel'></div>
        </div>
    `;

    var local_style = `
        .home-page-content {
            display: block;
        }
    `;

    $root = $(ComponentId);
    $element = $(local_template);
    
    var setStyleByMetadata = function() {
        $element.css('display', 'block');
        $element.css('width', 'auto');
        $element.css('height', Metadata.height || 'auto');
        $element.css('background-color', Metadata.background_color || 'white');

        $('#home-content-style').remove();
        $('head').append('<style id="home-content-style">'+local_style+'</style>');
    }

    var setItemsByMetadata = function() {
        // Metadata.items.forEach(element => {
        //     $navItem = $('<a></a>');
        //     $navItem.attr('href', element.Url);
        //     $navItem.text(element.Caption);
        //     $navItem.addClass(Metadata.item_style_name);

        //     $navItem.appendTo($element);
        // });
    }

    var render = function() {
        setStyleByMetadata();
        setItemsByMetadata();
        return $element;
    }

    $root.empty();
    $('#ybj-popup-window').empty();
    $root.append(render());

    // load_popup_window({});
    load_comment_panel();
}