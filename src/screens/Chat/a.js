import { StyleSheet, Button, View, Platform } from 'react-native'
import React from 'react'
import RNFS from "react-native-fs";
import FileViewer from "react-native-file-viewer";

const OpenFile = () => {

    
    const open = () => {
        const url = 'http://s29.q4cdn.com/175625835/files/doc_downloads/test.pdf'
        // "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
        // *IMPORTANT*: The correct file extension is always required.
        // You might encounter issues if the file's extension isn't included
        // or if it doesn't match the mime type of the file.
        // https://stackoverflow.com/a/47767860
        function getUrlExtension(url) {
            return url.split(/[#?]/)[0].split(".").pop().trim();
        }
        const extension = getUrlExtension(url);
        // Feel free to change main path according to your requirements.
        const localFile = `${RNFS.DocumentDirectoryPath}/sample1.${extension}`;
        const options = {
            fromUrl: url,
            toFile: localFile,  //Will overwrite any previously existing file
        };
        console.log("path :",localFile);
        //saving file in local storage 
        RNFS.downloadFile(options)
            .promise.then(() => {
                //opening file
                FileViewer.open(localFile, {showOpenWithDialog: true }) // absolute-path-to-my-local-file.
                .then(() => {
                    // success
                    console.log("file opened");
                })
                .catch((error) => {
                    alert(`Can't find an application to open this file`)
                    // error
                    console.log("error", error)
                });
            })
            .catch((error) => {
                // error
        });
        // //checking file exsits
        // RNFS.exists(localFile)
        //     .then((exists) => {
        //         if (exists) {
        //             console.log('File already  exists');
        //             //opening file
        //             openDocument(localFile);
        //         } else {
        //             console.log('File does not exist');
        //             const options = {
        //                 fromUrl: url,
        //                 toFile: localFile,
        //             };
        //             RNFS.downloadFile(options)
        //                 .promise.then(() => openDocument(localFile))
        //                 .catch((error) => {
        //                     // error
        //                 });
        //         }
        //     })
        //     .catch((error) => {
        //         console.log(error);
        //     });

      


    }


    return (
        <View style={styles.container}>
            <Button title='open' onPress={open} />
        </View>
    )
}

export default OpenFile

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})