import React, { useEffect } from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'
import FaceSDK, { Enum, FaceCaptureResponse, MatchFacesResponse, MatchFacesRequest, MatchFacesImage, MatchFacesSimilarityThresholdSplit, RNFaceApi } from '@regulaforensics/react-native-face-api'
const face = () => {
    useEffect(() => {
        //face sdk intialisation
        FaceSDK.init(json => {
            response = JSON.parse(json)
            console.log(response);
            if (!response["success"]) {
                console.log("Init failed: ");
                console.log(json);
            }
        }, e => { })
    })

    const faceRecognise = () => {
        console.log("inside");
        FaceSDK.presentFaceCaptureActivity(result => {
            let res = JSON.parse(result)
            //checking user cancle image picker
            if (res.exception) {
                console.log("User Canceled Face capture option");
                return;
            }
            //console.log("image uri", FaceCaptureResponse.fromJson(JSON.parse(result)).image.bitmap);
            let base64Img = FaceCaptureResponse.fromJson(JSON.parse(result)).image.bitmap;
            const firstImage = new MatchFacesImage();
            firstImage.imageType = Enum.ImageType.PRINTED; //captured image
            firstImage.bitmap = 'enter yourr base64 register image'  //user register image
            const secondImage = new MatchFacesImage();
            secondImage.imageType = Enum.ImageType.LIVE; //live image
            secondImage.bitmap = base64Img;
            request = new MatchFacesRequest()
            request.images = [firstImage, secondImage]
            //console.log("start compare", base64Img);
            //comparing two images
            FaceSDK.matchFaces(JSON.stringify(request), response => {
                response = MatchFacesResponse.fromJson(JSON.parse(response))
                console.log("ggg", response);
                FaceSDK.matchFacesSimilarityThresholdSplit(JSON.stringify(response.results), 0.75, str => {
                    var split = MatchFacesSimilarityThresholdSplit.fromJson(JSON.parse(str))
                    console.log("res", split.length);
                    if (split?.matchedFaces.length > 0) {

                        //face matched
                        let faceMatchPercentage = split.matchedFaces[0].similarity * 100
                        console.log("match percentage", faceMatchPercentage.toFixed(2))
                        console.log("face matched")
                        //additional code .....

                    }
                    else {
                        //face doe not match
                        alert('Face not recognised please try again.')
                    }
                }, e => { console.log("error") })
            }, e => { console.log("error") })


        }, e => { console.log("error", e) })



    }
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Button title="click" onPress={faceRecognise} />
        </View>
    )
}

export default face


