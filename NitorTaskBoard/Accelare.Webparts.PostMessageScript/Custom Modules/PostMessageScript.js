
    //register Custom Message event handler
    if (typeof window.addEventListener != 'undefined') {
        window.addEventListener('message', CustomAppIFramePostMsgHandler, false);
    }
    else if (typeof window.attachEvent != 'undefined') {
        window.attachEvent('onmessage', CustomAppIFramePostMsgHandler);
    }

    function CustomAppIFramePostMsgHandler(e) {
        var messageData = e.data;
        if (messageData.type != null && messageData.type == "OpenDialog") {
            SP.UI.ModalDialog.showModalDialog(messageData.options);
        }
        else if (messageData.type != null && messageData.type == "OpenList")
        {
           window.location.href = messageData.listUrl;
        }
    }
