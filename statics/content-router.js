(
    function() {
        var CurrentRoute = this.location.hash;
        var PreviousRoute = '#home';
        
        var load_content = function() {
            switch(CurrentRoute) {
                case '#home': load_home_content();
                    break;
                case '#tool': load_tool_content();
                    break;
                case '#register': load_popup_window({});
                    break;
                case '#login': load_popup_window({name: 'Login'});
                    break;
                case '#logout': load_popup_window({name: 'Logout'});
                    break;
                default:
                    load_home_content();
            }
        }

        $('a').click((event) => {
            PreviousRoute = CurrentRoute;
            CurrentRoute = event.target.hash;
            
            load_content();
        });

        load_content();
    }
)();