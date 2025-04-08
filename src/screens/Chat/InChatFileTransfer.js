import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Colors from '../../constants/Colors';

const InChatFileTransfer = ({ filePath, name, type, send }) => {
  // console.log("file path", filePath);
  // console.log("name", name);
  // console.log("type", type);

  var fileType = '';
  const [img, setImg] = useState('');
  // if (filePath !== undefined) {
  //   name = filePath.split('/').pop();
  //   fileType = filePath.split('.').pop();
  // }


  useEffect(() => {
    fileType = filePath.split('.').pop();
    //pdf icon
    if (type == 'pdf') {
      setImg(require('../../assets/images/pdf.png'))
    }
    //gogole docs icon
    else if (type == 'docx' || type == 'doc') {
      setImg(require('../../assets/images/docs.png'))
    }
    //excel sheet icon
    else if (type == 'xlsx' || type == 'csv' || type == 'xls') {
      setImg(require('../../assets/images/sheets.png'))
    }
    //ppt icon
    else if (type == 'ppt' || type == 'pptx') {
      setImg(require('../../assets/images/ppt.png'))
    }
    else if (type == 'mp3') {
      setImg(require('../../assets/images/music.png'))
    }
  }, [])
  return (
    <View style={styles.container}>
      <View
        style={styles.frame}
      >
        <Image
          source={img ? img : require('../../assets/images/unknownfile.png')}
          style={{ height: 60, width: 60 }}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.text}>
            {name}
          </Text>
          <Text style={styles.textType}>{type}</Text>
          {send && <TouchableOpacity onPress={send}>
            <Text style={styles.send}>Send document</Text>
          </TouchableOpacity>}
        </View>
      </View>
    </View>
  );
};
export default InChatFileTransfer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 5,
    borderRadius: 15,
    padding: 5,
  },
  text: {
    color: 'black',
    fontFamily: 'AvenirNextCyr-Thin',
    //marginTop: 10,
    fontSize: 16,
    lineHeight: 20,
    marginLeft: 5,
    //marginRight: 5,
  },
  textType: {
    color: 'black',
    //marginTop: 5,
    fontFamily: 'AvenirNextCyr-Medium',
    fontSize: 14,
    marginLeft: 10,
    marginLeft: 5,
    //marginRight: 5,

  },
  send: {
    color: Colors.primary,
    //marginTop: 5,
    fontFamily: 'AvenirNextCyr-Medium',
    fontSize: 14,
    marginLeft: 5,

  },
  frame: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    borderRadius: 10,
    padding: 5,
    marginTop: -4,
  },
});