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
        $("#card-wrapper").empty();
        result.forEach(item => {
            console.log(item);

            const id = item.ProjectId;

            var card = $("<div/>").attr("class", "card transition");
            var link = $("<a/>").attr({"class": "cta", "href": `comments.html?id=${id}`}).text("See CodeReview");
            var onClickDiv = $("<div/>").attr("class", "cta-container transition");
            var cardCircleTransition = $("<div/>")
                .attr("class", "card_circle transition")
                .attr("style", "background: url(\"" + item.Image + "\") no-repeat center bottom;");
            var title = $("<h2/>").attr("class", "transition").text(item.ProjectName);
            var description = $("<p/>").text(item.ProjectOwner + ": " + item.Description);

            card.append(title);
            card.append(description);
            onClickDiv.append(link);
            card.append(onClickDiv);
            card.append(cardCircleTransition);


            $("#card-wrapper").append(card);

        });
    };


    var onFailure = function registerSuccess(result) {
        console.log(result);
    };
}(jQuery));