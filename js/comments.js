(function($) {
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

    $.QueryString = (function(paramsArray) {
        let params = {};

        for (let i = 0; i < paramsArray.length; ++i)
        {
            let param = paramsArray[i]
                .split('=', 2);

            if (param.length !== 2)
                continue;

            params[param[0]] = decodeURIComponent(param[1].replace(/\+/g, " "));
        }

        return params;
    })(window.location.search.substr(1).split('&'))

    $.FillFiles = function (result) {
        var container = $("#accordion");
        result.forEach(file => {
            var fileCard = $("<div/>").attr("class", "card");

            var fileHeader = $("<div/>").attr({
                "class": "card-header",
                "id": "heading" + file.sha
            });

            var title = $("<h2/>").attr("class", "mb-0");
            var button = $("<button/>").attr({
                "class": "btn btn-link",
                "data-toggle": "collapse",
                "data-target": "#collapse" + file.sha,
                "aria-expanded": "true",
                "aria-controls": "collapseOne"
            })
                .text(file.filename);

            var collapsableDiv = $("<div/>").attr({
                "id": "collapse" + file.sha,
                "class": "collapse",
                "aria-labelledby": "heading" + file.sha,
                "data-parent": "#accordion"
            });

            var content = $("<div/>").attr({"class": "card-body"});

            window.test = file;

            file.patch.split("\n").forEach(line => {
                var codeLine = $("<div/>").attr("class", "line").text(line);
                if (line.startsWith("+")) {
                    codeLine.addClass("addition");
                }
                else if (line.startsWith("-")) {
                    codeLine.addClass("deletion");
                }
                content.append(codeLine);
            });

            collapsableDiv.append(content);
            title.append(button);
            fileHeader.append(title);
            fileCard.append(fileHeader);
            fileCard.append(collapsableDiv);
            container.append(fileCard);
        });
    };

    $(function onDocReady() {
        const projectId = $.QueryString.id;

        var fillFiles = function (result) {
            console.log(result);
            // var container = $("#accordion");
            // result.forEach(file => {
            //     var fileCard = $("<div/>").attr("class", "card");
            //
            //     var fileHeader = $("<div/>").attr({
            //         "class": "card-header",
            //         "id": "heading" + file.sha
            //     });
            //
            //     var title = $("<h2/>").attr("class", "mb-0");
            //     var button = $("<button/>").attr({
            //         "class": "btn btn-link",
            //         "data-toggle": "collapse",
            //         "data-target": "#collapse" + file.sha,
            //         "aria-expanded": "true",
            //         "aria-controls": "collapseOne"
            //     })
            //         .text(file.filename);
            //
            //     var collapsableDiv = $("<div/>").attr({
            //         "id": "collapse" + file.sha,
            //         "class": "collapse",
            //         "aria-labelledby": "heading" + file.sha,
            //         "data-parent": "#accordion"
            //     });
            //
            //     var content = $("<div/>").attr({"class": "card-body"});
            //
            //     window.test = file;
            //
            //     file.patch.split("\n").forEach(line => {
            //         var codeLine = $("<div/>").attr("class", "line").text(line);
            //         if (line.startsWith("+")) {
            //             codeLine.addClass("addition");
            //         }
            //         else if (line.startsWith("-")) {
            //             codeLine.addClass("deletion");
            //         }
            //         content.append(codeLine);
            //     });
            //
            //     collapsableDiv.append(content);
            //     title.append(button);
            //     fileHeader.append(title);
            //     fileCard.append(fileHeader);
            //     fileCard.append(collapsableDiv);
            //     container.append(fileCard);
            // });
        };

        var onFailure = function registerSuccess(result) {
            console.log(result);
        };

        console.log(authToken);

        $.ajax({
            method: 'GET',
            url: _config.api.projectInvokeUrl + `/projects/${projectId}`,
            headers: {
                Authorization: authToken
            },
            contentType: 'application/json',
            success: fillFiles,
            error: onFailure
        });
    });

})(jQuery);