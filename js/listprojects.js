var WildRydes = window.WildRydes || {};
WildRydes.map = WildRydes.map || {};


(function rideScopeWrapper($) {
    var authToken;
    WildRydes.authToken.then(function setAuthToken(token) {
        if (token) {
            authToken = token;
        } else {
            window.location.href = '/signin.html';
        }
    }).catch(function handleTokenError(error) {
        alert(error);
        window.location.href = '/signin.html';
    });

    $(function onDocReady() {
        listYoursProjects();

        $("#myonoffswitch").click( function(){
            if($(this).is(':checked') ) {
                listYoursProjects();
            } else {
                listOthersProjects();
            }
        });
    });

    function listYoursProjects() {
        $.ajax({
            method: 'GET',
            url: _config.api.projectInvokeUrl + '/projects',
            headers: {
                Authorization: authToken
            },
            contentType: 'application/json',
            success: fillProjects,
            error: onFailure
        });
    }

    function listOthersProjects() {
        $.ajax({
            method: 'GET',
            url: _config.api.projectInvokeUrl + '/projects/others',
            headers: {
                Authorization: authToken
            },
            contentType: 'application/json',
            success: fillProjects,
            error: onFailure
        });
    }

    var fillProjects = function (result) {
        console.log(result);
    };


    var onFailure = function registerSuccess(result) {
        console.log(result);
    };
}(jQuery));