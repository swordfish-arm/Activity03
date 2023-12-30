import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Dialog } from 'react-native-alert-notification';

const CustomDialog = ({ visible, message, onYes, onNo }) => {
  return (
    <Dialog visible={visible}>
      <View>
        <Text>{message}</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
          <TouchableOpacity onPress={onYes}>
            <Text style={{ color: 'green' }}>Yes</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onNo}>
            <Text style={{ color: 'red' }}>No</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Dialog>
  );
};

export default CustomDialog;
