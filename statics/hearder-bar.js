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
                {Name: "game_page", Caption: "游 戏", Url: "#game"},
                {Name: "photo_page", Caption: "照 片", Url: "#photo"},
                {Name: "article_page", Caption: "文 章", Url: "#article"},
                {Name: "tool_page", Caption: "工 具", Url: "#tool"},
            ],
            right_items: [
                {Name: "register", Caption: "注 册", Url: "#register"},
                {Name: "login", Caption: "登 陆", Url: "#login"},
                {Name: "username", Caption: "游 客", Url: "#"},
            ],
            item_style_name: 'ybj-header-item',
            right_item_style_name: 'ybj-header-right-item',
            item_style: 'color: white; display: inline-block; margin: 2; padding: 15 10 15 10; text-decoration: none;',
        }

        var local_style = `
            .ybj-header-item, .ybj-header-right-item {
                color: lightgrey;
                display: inline-block;
                margin: 2;
                padding: 15px 10px 15px 10px;
                text-decoration: none;
            }
            .ybj-header-right-item {
                position: absolute;
            }
            .ybj-header-item:hover, .ybj-header-right-item:hover {
                color: white;
            }
        `;

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

            $('head').append('<style>'+local_style+'</style>');
        }

        var setItemsByMetadata = function() {
            Metadata.items.forEach(element => {
                $navItem = $('<a></a>');
                $navItem.attr('href', element.Url);
                $navItem.text(element.Caption);
                $navItem.addClass(Metadata.item_style_name);
                $navItem.attr('id', element.Name);

                $navItem.appendTo($element);
            });

            Metadata.right_items.forEach((element, index) => {
                $navItem = $('<a></a>');
                $navItem.attr('href', element.Url);
                $navItem.text(element.Caption);
                $navItem.addClass(Metadata.right_item_style_name);
                $navItem.css('right', 10+60*index);
                $navItem.attr('id', element.Name);

                $navItem.appendTo($element);
            });
        }

        var render = function() {
            setStyleByMetadata();
            setItemsByMetadata();
            return $element;
        }

        var update_login_status = function() {
            var cookie = document.cookie;
            var cookie_pears = cookie.split(';');
            var cookies = {};
            cookie_pears.forEach((cookie_pear) => {
                var key_value = cookie_pear.split('=');
                cookies[key_value[0].trim()] = key_value[1].trim();
            });

            if (cookies['username']) {
                $('#username').text(decodeURI(cookies['nickname']));
                $('#login').text("注 销");
                $('#login').attr('href', '#logout');
                $('#register').hide();
            }
        }

        $root.append(render());

        update_login_status();
    }
)();