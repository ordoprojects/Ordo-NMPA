import React from "react";
import { ProgressDialog } from "react-native-simple-dialogs";


export const LoadingView = ({ visible, message }) => {

    return (
        <ProgressDialog
            visible={visible}
            // title="Uploading file"
            dialogStyle={{ width: '50%', alignSelf: 'center' }}
            message={message}
            titleStyle={{ fontFamily: 'AvenirNextCyr-Medium', fontSize: 16 }}
            messageStyle={{ fontFamily: 'AvenirNextCyr-Medium', fontSize: 14 }}
        />
    )
}