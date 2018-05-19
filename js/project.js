/**
 * Created by Luca Andrei on 5/19/2018.
 */

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
        $('#addProjectForm').submit(handleAddProject);
    });

    function handleAddProject(event) {
        console.log("hello");
        var projectName = $('#projectNameId').val();
        var projectLink = $('#projectLinkId').val();
        event.preventDefault();
        addProject(projectName, projectLink,
            function addProjectSuccess() {
                console.log('Successfully added project!');
                window.location.href = 'index.html';
            },
            function signinError(err) {
                alert(err);
            }
        );
    }

    function addProject(projectName, projectLink, onSuccess, onFailure) {
        $.ajax({
            method: 'POST',
            url: _config.api.projectInvokeUrl + '/projects',
            headers: {
                Authorization: authToken
            },
            data: JSON.stringify({
                ProjectName: projectName,
                ProjectLink: projectLink
            }),
            contentType: 'application/json',
            success: onSuccess,
            error: onFailure
        });
    }
}(jQuery));
