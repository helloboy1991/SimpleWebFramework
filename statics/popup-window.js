var load_popup_window = function(options) {
    var ComponentName = "PopupWindow";
    var ComponentId = "#ybj-popup-window";
    var SubComponents = [];

    var Metadata = {
        title: "注册账户",
        line_items: [
            {Name: 'username', Caption: '账 号', Type: 'text', onkeyup: "value=value.replace(/[^\\d|\\w]/g,'')", maxlength: "24"},
            {Name: 'nickname', Caption: '昵 称', Type: 'text', maxlength: "32"},
            {Name: 'password', Caption: '密 码', Type: 'password', maxlength: "16"},
            {Name: 'confirm', Caption: '确 认', Type: 'password', maxlength: "16"},
        ],
        button_items: [
            // {Name: 'clear', Caption: '清空', Type: 'button'},
            {Name: 'submit', Caption: '提 交', Type: 'submit'},
        ],
        height: "240px",
        width: "360px",
    }

    var LoginMetadata = {
        title: "登陆账户",
        line_items: [
            {Name: 'username', Caption: '账 号', Type: 'text', onkeyup: "value=value.replace(/[^\\d|\\w]/g,'')", maxlength: "24"},
            {Name: 'password', Caption: '密 码', Type: 'password', maxlength: "16"},
        ],
        button_items: [
            // {Name: 'clear', Caption: '清空', Type: 'button'},
            {Name: 'submit', Caption: '提 交', Type: 'submit'},
        ]
    }

    var LogoutMetadata = {
        title: "注销账户",
        line_items: [
        ],
        button_items: [
            // {Name: 'cacel', Caption: '取 消', Type: 'button'},
            {Name: 'submit', Caption: '确 认', Type: 'submit'},
        ],
        height: "100px",
        width: "200px",
    }

    var handle_submit = function() {
        $('form').submit((event) => {
            // alert(event);
            var username = $('input[name=username]').val();
            var password = $('input[name=password]').val();
            var confirm = $('input[name=confirm]').val();

            var error_message = null;
            if (username.length < 3) {
                error_message = "用户名错误";
            }
            else if (password.length < 6) {
                error_message = "密码过短";
            }
            else if (confirm != password) {
                error_message = "密码确认错误";
            }

            $('.error-message').text(error_message);
            event.preventDefault();

            var $form = $('form');
            if (!error_message) {
                $.ajax({
                    url: '/register',
                    type: 'post',
                    data: $form.serialize(),
                }).done((data) => {
                    if (data == 'OK') {
                        window.location.href = '/';
                    }
                    else {
                        $('.error-message').text("添加用户错误");
                    }
                }).fail((data) => {
                    window.location.href = '/statics/test.html';
                });
            }
        });
    }

    var login_handle_submit = function() {
        $('form').submit((event) => {
            // alert(event);
            var username = $('input[name=username]').val();
            var password = $('input[name=password]').val();

            var error_message = null;
            if (username.length < 3) {
                error_message = "用户名错误";
            }
            else if (password.length < 6) {
                error_message = "密码错误";
            }

            $('.error-message').text(error_message);
            event.preventDefault();

            var $form = $('form');
            if (!error_message) {
                $.ajax({
                    url: '/login',
                    type: 'post',
                    data: $form.serialize(),
                }).done((data) => {
                    if (data != 'Failed') {
                        window.location.href = '/';
                    }
                    else {
                        $('.error-message').text("登陆错误");
                    }
                }).fail((data) => {
                    window.location.href = '/statics/test.html';
                });
            }
        });
    }

    var logout_handle_submit = function() {
        $('form').submit((event) => {
            // alert(event);

            event.preventDefault();
            
            document.cookie = 'username=; Max-Age=0; Path=/;';
            document.cookie = 'nickname=; Max-Age=0; Path=/;';

            window.location.href = '/';
        });
    }

    if (options.name == 'Login') {
        Metadata = LoginMetadata;
        handle_submit = login_handle_submit;
    } else 
    if (options.name == 'Logout') {
        Metadata = LogoutMetadata;
        handle_submit = logout_handle_submit;
    }

    Metadata.title = options.title || Metadata.title;
    Metadata.line_items = options.line_items || Metadata.line_items;
    Metadata.button_items = options.button_items || Metadata.button_items;
    handle_submit = options.handle_submit || handle_submit;

    var local_template = `
        <div class='base-popup-window'>
            <div class="popup-window-header">
                <span class="popup-window-title"></span>
            </div>
            <div class="popup-window-content">
                <div>
                    <form method="POST">
                        <div class="input-lines"></div>
                        <div class="buttons-line"></div>
                    </form>
                </div>
                <div class="error-message"></div>
            </div>
        </div>
    `;

    var line_input_template = `
        <div class="line-input">
            <span class="input-label"></span>
        </div>
    `;

    var local_style = `
        .base-popup-window {
            display: block;
            width: 300px;
            height: 200px;
            background-color: whitesmoke;
            margin: 5px;
            border-color: black;
            border-width: 1px;
            border-style: solid;
        }
        .base-popup-window {
            margin: auto;
            margin-top: 200px;
        }
        .popup-window-header {
            background-color: lightblue;
            height: auto;
            padding: 3px;
        }
        .popup-window-content {
            margin-top: 25px;
            margin-left: auto;
            margin-right: auto;
            width: fit-content;
        }
        .line-input {
            margin-bottom: 10px;
        }
        .input-label {
            width: 50px;
            display: inline-block;
        }
        .line-input input {
            width: 150px;
        }
        .buttons-line {
            text-align: center;
            margin-top: 20px;
        }
        .buttons-line input {
            margin-left: 5px;
            width: 60px;
        }
        .error-message {
            color: red;
            text-align: center;
        }
        .base-popup-window form {
            margin-bottom: 5px;
        }
    `;

    $root = $(ComponentId);
    $element = $(local_template);
    
    var setStyleByMetadata = function() {
        if (Metadata.height)
            $element.css('height', Metadata.height);
        if (Metadata.width)
            $element.css('width', Metadata.width);

        $('#popup-window-style').remove();
        $('head').append('<style id="popup-window-style">'+local_style+'</style>');
    }

    var setItemsByMetadata = function() {
        $element.find('.popup-window-title').text(Metadata.title);
        Metadata.line_items.forEach((item) => {
            $line_element = $(line_input_template);
            $line_element.find('.input-label').text(item.Caption);
            var str = '<input name=' + item.Name + ' type=' + item.Type + '>';
            $input = $(str);
            if (item.onkeyup) {
                $input.attr('onkeyup', item.onkeyup);
            }
            if (item.maxlength) {
                $input.attr("maxlength", item.maxlength);
            }
            $line_element.append($input);

            $line_element.appendTo($element.find('.input-lines'));
        });
        Metadata.button_items.forEach((item) => {
            var str = '<input name=' + item.Name + ' type=' + item.Type + '>';
            $button = $(str);
            $button.val(item.Caption);

            $button.appendTo($element.find('.buttons-line'));
        });
    }

    var render = function() {
        setStyleByMetadata();
        setItemsByMetadata();
        return $element;
    }

    $root.empty();
    $('#ybj-content').empty();
    $root.append(render());

    handle_submit();
}