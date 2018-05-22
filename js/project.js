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

        $('#msform').submit(handleAddProject);
    });

    function handleAddProject(event) {
        var owner = $("#projectOwnerId").val();
        var name = $("#projectNameId").val();
        var sha = $("#projectFileId").val();

        console.log(sha);

        event.preventDefault();
        addProject(name, owner, sha,
            function addProjectSuccess() {
                console.log('Successfully added project!');
                window.location.href = 'index.html';
            },
            function signinError(err) {
                alert(err);
            }
        );
    }

    function addProject(name, owner, commit, onSuccess, onFailure) {
        $.ajax({
            method: 'POST',
            url: _config.api.projectInvokeUrl + '/projects',
            headers: {
                Authorization: authToken
            },
            data: JSON.stringify({
                Name: name,
                Owner: owner,
                Commit: commit
            }),
            contentType: 'application/json',
            success: onSuccess,
            error: onFailure
        });
    }
}(jQuery));
