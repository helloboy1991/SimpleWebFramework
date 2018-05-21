
var load_comment_panel = function(options) {
    var ComponentName = "CommentPanel";
    var ComponentId = "#ybj-comment-panel";
    var SubComponents = [];

    var setItemsByMetadata;

    var Metadata = {

    };

    var comments = [
        {author: "User1", time: "2018-5-21", content: "Nice to here!"},
        {author: "User2", time: "2018-5-21", content: "Nice to here!"},
        {author: "User3", time: "2018-5-21", content: "Nice to here!"},
        {author: "User4", time: "2018-5-21", content: "Nice to here!"},
        {author: "User5", time: "2018-5-21", content: "Nice to here!"},
    ];

    var local_template = `
        <div>
            <div class="edit-area">
                <textarea maxlength="80">
                </textarea>
                <div class="edit-buttons">
                    <button id="clear-comment" class="edit-button">清空</button>
                    <button id="submit-comment" class="edit-button">提交</button>
                </div>
            </div>
            <div class="comment-content-area">
            </div>
        </div>
    `;

    var comment_template = `
        <div class="one-comment">
            <div class="comment-info">
                <span class="comment-user">username</span>
                <span class="comment-time">time</span>
            </div>
            <div class="comment-content">
                <p>Nice to here!</p>
            </div>
        </div>
    `;

    var local_style = `
        #ybj-comment-panel {
            margin-top: 20px; 
            display: block;
            width: 600px;
            height: fit-content;
            background-color: whitesmoke;
        }
        .edit-area {
            display: block;
        }
        #ybj-comment-panel textarea {
            width: 500px;
            height: 100px;
            margin: 5px;
            padding: 5px;
            font-size: large;
            display: inline-block;
        }
        .edit-buttons {
            display: inline-block;
            height: 100px;
            position: absolute;
        }
        .edit-button {
            display: block;
            width: 70px;
            height: 30px;
            margin: 5px;
        }
        .comment-content-area {
            display: block;
            margin: 5px;
        }
        .one-comment {
            display: block;
            margin-top: 10px;
            width: 590px;
            position: relative;
        }
        .comment-info, .comment-content {
            display: block;
        }
        .comment-info {
            background-color: gainsboro;
        }
        .comment-user {
            margin-left: 10px;
        }
        .comment-time {
            position: absolute;
            right: 5px;
        }
        .comment-info span {
            display: inline-block;
            margin-top: 5px;
        }
    `;

    var init_panel = function() {
        $text = $element.find('.edit-area textarea');
        $text.val('');
        $element.find('.comment-content-area').empty();
        $.ajax({
            url: '/comment',
            type: 'post',
            data: '',
        }).done((data) => {
            if (data!='Failed') {
                comments = JSON.parse(data);

                setItemsByMetadata();
            }
        });
    }

    var handle_submit = function() {
        $element.find('#submit-comment').click((event) => {
            var cookie = document.cookie;
            var cookie_pears = cookie.split(';');
            var cookies = {};
            $text = $element.find('.edit-area textarea');
            cookie_pears.forEach((cookie_pear) => {
                var key_value = cookie_pear.split('=');
                if (key_value.length == 2)
                    cookies[key_value[0].trim()] = key_value[1].trim();
            });

            var date = new Date();

            var comment = {
                action: 'add',
                username: cookies['nickname'] || '游客',
                content: $text.val(),
                time: date.toLocaleString(),
            };
            var comment_data = JSON.stringify(comment);
            $text.val('');
            $element.find('.comment-content-area').empty();
            $.ajax({
                url: '/comment',
                type: 'post',
                data: comment_data,
            }).done((data) => {
                if (data!='Failed') {
                    comments = JSON.parse(data);
    
                    setItemsByMetadata();
                }
            });
        });
    }

    $root = $(ComponentId);
    $element = $(local_template);
    styleId = 'comment-panel-style';

    var setStyleByMetadata = function() {
        if (Metadata.height)
            $element.css('height', Metadata.height);
        if (Metadata.width)
            $element.css('width', Metadata.width);

        $('#'+styleId).remove();
        $('head').append('<style id=' + styleId + '>' + local_style + '</style>');
    }

    setItemsByMetadata = function() {
        comments.forEach((comment, index) => {
            $comment_element = $(comment_template);
            $comment_element.find('.comment-user').text(decodeURI(comment.author));
            $comment_element.find('.comment-time').text(comment.time);
            $comment_element.find('.comment-content p').text(comment.content);
            
            $element.find('.comment-content-area').append($comment_element);
        });
    }

    var render = function() {
        setStyleByMetadata();
        setItemsByMetadata();
        return $element;
    }

    $root.empty();
    $root.append(render());
    init_panel();
    handle_submit();
}