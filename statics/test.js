(
    function () {
        var ComponentName = "HeaderBar";
        var ComponentId = "#ybj-header-bar";
        var SubComponents = [];

        $root = $(ComponentId);
        $element = $('<div></div>');
        
        $element.css('display', 'block');
        $element.css('width', 'auto');
        $element.css('height', '200px');
        $element.css('background-color', 'black');

        var render = function() {
            return $element;
        }

        $root.append(render());
    }
)();