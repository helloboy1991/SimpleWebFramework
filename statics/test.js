(
    function () {
        var ComponentName = "HeaderBar";
        var ComponentId = "#ybj-header-bar";
        var SubComponents = [];

        var Metadata = {
            height: '55px',
            background_color: '#24292e',
            items: [
                {Name: "home_page", Caption: "首 页", Url: "#home"},
                {Name: "photo_page", Caption: "照 片", Url: "#photo"},
            ],
            item_style_name: 'ybj-header-item',
            item_style: 'color: white; display: inline-block; margin: 2; padding: 15 10 15 10; text-decoration: none;',
        }

        $root = $(ComponentId);
        $element = $('<div></div>');
        
        var BuildStyle = function(class_name, content) {
            return '.'+class_name+'{'+content+'}';
        }
        
        var setStyleByMetadata = function() {
            $element.css('display', 'block');
            $element.css('width', 'auto');
            $element.css('height', Metadata.height || '100px');
            $element.css('background-color', Metadata.background_color || 'black');

            $('head').append('<style>'+BuildStyle(Metadata.item_style_name, Metadata.item_style)+'</style>');
        }

        var setItemsByMetadata = function() {
            Metadata.items.forEach(element => {
                $navItem = $('<a></a>');
                $navItem.attr('href', element.Url);
                $navItem.text(element.Caption);
                $navItem.addClass(Metadata.item_style_name);

                $navItem.appendTo($element);
            });
        }

        var render = function() {
            setStyleByMetadata();
            setItemsByMetadata();
            return $element;
        }

        $root.append(render());
    }
)();