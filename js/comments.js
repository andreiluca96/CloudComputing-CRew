(function ($) {
    var authToken;
    var ProjectId;
    var File;
    var Line;
    var Comments;

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

    $('#addCommentButton').click(handleAddComment);

    $.QueryString = (function (paramsArray) {
        let params = {};

        for (let i = 0; i < paramsArray.length; ++i) {
            let param = paramsArray[i]
                .split('=', 2);

            if (param.length !== 2)
                continue;

            params[param[0]] = decodeURIComponent(param[1].replace(/\+/g, " "));
        }

        return params;
    })(window.location.search.substr(1).split('&'));

    var onFailure = function registerSuccess(result) {
        console.log(result);
    };

    $(function onDocReady() {
        const projectId = $.QueryString.id;

        ProjectId = projectId;

        var fillFiles = function (result) {
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

                file.patch.split("\n").forEach(line => {
                    var lineWrapper = $("<div/>").attr("class", "line-wrapper").css("position", "relative");
                    var codeLine = $("<div/>").attr("class", "line").text(line);
                    if (line.startsWith("+")) {
                        codeLine.addClass("addition");
                    }
                    else if (line.startsWith("-")) {
                        codeLine.addClass("deletion");
                    }
                    lineWrapper.hover(function () {
                        const seeComments = $("<i/>").attr("class", "fa fa-eye comment").attr("aria-hidden", "true");
                        const addComments = $("<i/>").attr("class", "fa fa-plus comment").attr("aria-hidden", "true").css("right", "20px").hover(
                            function () {
                                $(this).css("color", "green");
                            }, function () {
                                $(this).css("color", "black"); //to remove property set it to ''
                            }
                        );

                        Line = $(this).index();

                        addComments.click(function () {
                            $('#addModal').modal('show');
                            File = file.sha;

                        });

                        var currentCommentaries = Comments.filter(comment => comment.File === file.sha && comment.Line == Line);

                        seeComments.click(function () {
                            $('#seeModal').modal('show');

                            console.log(Comments);


                            currentCommentaries.forEach(comment => {
                                var dateobj = new Date(comment.CommentDate);

                                var month = ('0' + (dateobj.getMonth() + 1)).slice(-2);
                                var date = ('0' + dateobj.getDate()).slice(-2);
                                var year = dateobj.getFullYear();
                                var shortDate = year + '-' + month + '-' + date;


                                const wrapperDiv = $("<div/>").attr("class", "list-group-item list-group-item-action flex-column align-items-start");
                                wrapperDiv.append($("<div/>").addClass("d-flex w-100 justify-content-between").append($("<h5/>").addClass("mb-1").text(shortDate)));
                                wrapperDiv.append($("<p/>").addClass("mb-1").text(comment.Content));

                                wrapperDiv.append($("<small/>").css("margin-left","40%").text("by " + comment.Username));
                                // $("#commentsList").append($("<div/>").attr("class", "list-group-item").text(comment.Content));

                                $('#commentsList').append(wrapperDiv);
                            });


                            // <div class="d-flex w-100 justify-content-between">
                            //         <h5 class="mb-1">List group item heading</h5>
                            //     <small>3 days ago</small>
                            //     </div>

                            // <a href="#" class="list-group-item list-group-item-action flex-column align-items-start active">
                            //         <div class="d-flex w-100 justify-content-between">
                            //         <h5 class="mb-1">List group item heading</h5>
                            //     <small>3 days ago</small>
                            //     </div>
                            //     <p class="mb-1">Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit.</p>
                            //     <small>Donec id elit non mi porta.</small>
                            //     </a>


                        });

                        if (currentCommentaries.length != 0) {
                            $(this).append(seeComments);
                        }

                        $(this).append(addComments);
                    }, function () {
                        $(".comment", this).remove();
                    });

                    lineWrapper.append(codeLine);
                    content.append(lineWrapper);
                });

                collapsableDiv.append(content);
                title.append(button);
                fileHeader.append(title);
                fileCard.append(fileHeader);
                fileCard.append(collapsableDiv);
                container.append(fileCard);
            });
        };

        var getFiles = function (project) {
            console.log(project[0]);
            $.ajax({
                method: 'GET',
                url: _config.api.projectInvokeUrl + '/commits/' + project[0].ProjectOwner + "/" + project[0].ProjectName + "/" + project[0].Commit,
                contentType: 'application/json',
                success: fillFiles,
                error: onFailure
            });
        };

        $.ajax({
            method: 'GET',
            url: _config.api.projectInvokeUrl + `/projects/${projectId}`,
            headers: {
                Authorization: authToken
            },
            contentType: 'application/json',
            success: getFiles,
            error: onFailure
        });

        $.ajax({
            method: 'GET',
            url: _config.api.projectInvokeUrl + `/comments/${projectId}`,
            headers: {
                Authorization: authToken
            },
            contentType: 'application/json',
            success: function (result) {
                Comments = result;
            },
            error: onFailure
        });
    });

    function handleAddComment(event) {
        console.log(ProjectId);
        console.log(File);
        console.log(Line);

        const commentContent = $("#descriptionTextareaId").val();

        $.ajax({
            method: 'POST',
            url: _config.api.projectInvokeUrl + '/comments',
            headers: {
                Authorization: authToken
            },
            data: JSON.stringify({
                ProjectId: ProjectId,
                File: File,
                Line: Line,
                Content: commentContent
            }),
            contentType: 'application/json',
            success: function () {
                $('#addModal').modal('hide');
            },
            error: onFailure
        });
    }

})(jQuery);