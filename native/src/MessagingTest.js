import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  Dimensions,
  WebView,
} from 'react-native';

import ReactART from "ReactNativeART"

const {
  Group,
  Shape,
  Surface,
} = ReactART

var HEADER = '#3b5998';
var BGWASH = 'rgba(255,255,255,0.8)';
var DISABLED_WASH = 'rgba(255,255,255,0.25)';

class Button extends React.Component {
  _handlePress = () => {
    if (this.props.enabled !== false && this.props.onPress) {
      this.props.onPress();
    }
  };

  render() {
    return (
      <TouchableWithoutFeedback onPress={this._handlePress}>
        <View style={styles.button}>
          <Text>{this.props.text}</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

export default class MessagingTest extends React.Component {
  webview = null

  state = {
    path: '',
  }

  onMessage = e => this.setState({
    path: e.nativeEvent.data,
  })

  postMessage = () => {
    if (this.webview) {
      this.webview.postMessage('<svg style="background: white"><path d="M 10 10 L 90 10 70 90 10 90 Z"  /><path d="M 0 0 L 300 0 300 300 0 300 Z M 30 0 A 10,10 0 0,0 30,60 A 10,10 0 0,0 30,0" fill-rule="evenodd" fill="white" /></svg>');
    }
  }

  render(): ReactElement<any> {
    const { path } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.container}>
          <Text>{path || '(No path)'}</Text>
          <View style={styles.buttons}>
            <Button text="Send Message to Web View" enabled onPress={this.postMessage} />
          </View>
        </View>
        <Surface
          width={ 300 }
          height={ 150 }
          style={{ backgroundColor: "transparent" }}
        >
          <Group x={ 0 } y={ 0 }>
            <Shape
              d={ path }
              fill={ "rgba(0, 0, 0, .5)" }
            />
          </Group>
        </Surface>
        <WebView
          ref={webview => { this.webview = webview; }}
          style={styles.webView}
          source={require('./messagingtest.html')}
          onMessage={this.onMessage}
        />
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: HEADER,
  },
  addressBarRow: {
    flexDirection: 'row',
    padding: 8,
  },
  webView: {
    backgroundColor: BGWASH,
    position: 'absolute',
    flex: 1,
  },
  addressBarTextInput: {
    backgroundColor: BGWASH,
    borderColor: 'transparent',
    borderRadius: 3,
    borderWidth: 1,
    height: 24,
    paddingLeft: 10,
    paddingTop: 3,
    paddingBottom: 3,
    flex: 1,
    fontSize: 14,
  },
  navButton: {
    width: 20,
    padding: 3,
    marginRight: 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BGWASH,
    borderColor: 'transparent',
    borderRadius: 3,
  },
  disabledButton: {
    width: 20,
    padding: 3,
    marginRight: 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: DISABLED_WASH,
    borderColor: 'transparent',
    borderRadius: 3,
  },
  goButton: {
    height: 24,
    padding: 3,
    marginLeft: 8,
    alignItems: 'center',
    backgroundColor: BGWASH,
    borderColor: 'transparent',
    borderRadius: 3,
    alignSelf: 'stretch',
  },
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 5,
    height: 22,
  },
  statusBarText: {
    color: 'white',
    fontSize: 13,
  },
  spinner: {
    width: 20,
    marginRight: 6,
  },
  buttons: {
    flexDirection: 'row',
    height: 30,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  button: {
    flex: 0.5,
    width: 0,
    margin: 5,
    borderColor: 'gray',
    borderWidth: 1,
    backgroundColor: 'gray',
  },
});
