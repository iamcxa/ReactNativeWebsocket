import React from 'react'
import {
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Button,
  Text,
  Alert,
} from 'react-native'
import websocket from 'reconnecting-websocket';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    paddingTop: 16,
  },
  content: {
    fontSize: 12,
    textAlign: 'center',
  },
  button: {
    backgroundColor: 'lightblue',
    width: 200,
    height: 50,
  },
});

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: '',
      error: '',
      ws: null,
      isOpen: false,
    };
  }

  componentDidMount() {
    this.setState({
      ws: new websocket('ws://localhost:8080'),
    }, () => {
      const { ws } = this.state;
      ws.onopen = () => {
        // connection opened
        // ws.send(new Date().getTime()); // send a message
      };
  
      ws.onmessage = (e) => {
        // a message was received
        console.log(e.data);
        this.setState({
          data: e.data,
        });
        if (e.data.includes('received')) {
          Alert.alert('Cool', `Server has received message sent by this app.(${e.data}'`);
        }
        if (e.data.includes('token')) {
          const data = JSON.parse(e.data);
          Alert.alert('Cool', `JWT Token:\n ${data.token}`);
        }
      };
  
      ws.onerror = (e) => {
        // an error occurred
        console.log(e.message);
        this.setState({
          error: e.data,
        });
      };
  
      ws.onclose = (e) => {
        // connection closed
        console.log(e.code, e.reason);
      };
    });
  }

  onSendData = () => {
    const { ws } = this.state;
    ws.send(`send-at-${new Date().getTime()}`); // send a message
  }

  onLogin = () => {
    const { ws } = this.state;
    ws.send(JSON.stringify({
      username: 'username',
      password: 'password',
    })); // send a message
  }

  render() {
    const {
      data,
      error,
    } = this.state;
    return (
      <SafeAreaView>
        <Text style={styles.title}>Received data</Text>
        <Text style={styles.content}>{data}</Text>
        <Text style={styles.title}>Error</Text>
        <Text style={styles.content}>{error}</Text>
        <Text>  </Text>
        <Button
          title="Login"
          style={styles.button}
          onPress={this.onLogin}
        />
        <Button
          title="Send Data"
          style={styles.button}
          onPress={this.onSendData}
        />
      </SafeAreaView>
    )
  }
}