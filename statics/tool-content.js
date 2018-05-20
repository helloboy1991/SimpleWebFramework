var load_tool_content = function() {
    var ComponentName = "ToolContent";
    var ComponentId = "#ybj-content";
    var SubComponents = [];

    var Metadata = {
        timezone_cities: [
            {Name: "city_Beijing", Caption: "北京", Zone: +8},
            {Name: "city_Tokyo", Caption: "东京", Zone: +9},
            {Name: "city_NewYork", Caption: "纽约", Zone: -5},
            {Name: "city_London", Caption: "伦敦", Zone: 0},
        ],
    }

    var local_template = `
        <div class='tool-page-content'>
            <div id='ybj-timezone-panel' class='base-tool-panel'></div>
        </div>
    `;

    var timezone_item_template = `
        <div class="timezone-item">
            <span class="timezone-item-name"></span>
            <span class="timezone-item-time"></span>
        </div>
    `;

    var local_style = `
        .tool-page-content {
            display: block;
            width: auto;
        }
        .base-tool-panel {
            border-color: darkgray;
            border-style: dashed;
            width: fit-content;
            margin: 10px;
            padding: 10px;
            background-color: aliceblue;
        }
        .timezone-item {
            margin-bottom: 2px;
        }
        #ybj-timezone-panel {
            right: 40px;
            position: fixed;
        }
    `;

    $root = $(ComponentId);
    $element = $(local_template);
    $timezonePanel = $element.find('#ybj-timezone-panel');
    var date = new Date();
    
    var setStyleByMetadata = function() {
        $element.css('display', 'block');
        $element.css('width', 'auto');
        $element.css('height', Metadata.height || 'auto');
        $element.css('background-color', Metadata.background_color || 'white');

        $('#tool-content-style').remove();
        $('head').append('<style id="tool-content-style">'+local_style+'</style>');
    }

    var setItemsByMetadata = function() {
        Metadata.timezone_cities.forEach((city) => {
            $item = $(timezone_item_template);
            $item.find('.timezone-item-name').text(city.Caption);
            $item.appendTo($timezonePanel);
        });
    }

    var updateTimeValue = function() {
        date = new Date();
        var utc_time = date.getTime();
        var offset = date.getTimezoneOffset();
        $timezonePanel.find('.timezone-item-time').each((index, item) => {
            date.setTime(utc_time + 1000 * 60 * (60 * Metadata.timezone_cities[index].Zone + offset));
            $(item).text(date.toLocaleString());
        });
    }

    var render = function() {
        setStyleByMetadata();
        setItemsByMetadata();
        return $element;
    }

    $root.empty();
    $root.append(render());

    updateTimeValue();

    setInterval(() => {
        updateTimeValue();
    }, 1000);
}