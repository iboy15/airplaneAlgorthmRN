import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  Dimensions,
  Modal,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { white } from 'ansi-colors';

const { width, height } = Dimensions.get('screen');

export default class App extends React.Component {
  constructor() {
    super();

    this.state = {
      seats: [],
      array: [],
      groupRowLength: 0,
      pessengerCount: 0,
      seatGroupLength: [0, 1, 2, 3],
      modalInputRowCol: true
    };
  }

  fillWithMAandW() {
    var seats = [];
    const { array } = this.state;
    for (var i = 0; i < array.length; i++) {
      seats.push(
        Array(array[i][0])
          .fill()
          .map(() => Array(array[i][1]).fill('M'))
      );
    }

    for (var i = 0; i < seats.length; i++) {
      for (var j = 0; j < seats[i].length; j++) {
        seats[i][j][0] = 'A';
        seats[i][j][seats[i][j].length - 1] = 'A';
      }
    }

    for (var i = 0; i < seats[0].length; i++) seats[0][i][0] = 'W';
    for (var i = 0; i < seats[seats.length - 1].length; i++)
      seats[seats.length - 1][i][seats[seats.length - 1][i].length - 1] = 'W';
    this.setState({ seats: seats });

    return seats;
  }

  replaceWithNumber(val, counter, seats, colSize, rowSize) {
    for (var i = 0; i < colSize; i++) {
      for (var j = 0; j < rowSize; j++) {
        if (seats[j] == null || seats[j][i] == null) continue;
        for (var k = 0; k < seats[j][i].length; k++) {
          if (
            counter < this.state.pessengerCount + 1 &&
            seats[j] != null &&
            seats[j][i] != null &&
            seats[j][i][k] === val
          ) {
            seats[j][i][k] = counter;
            counter++;
          }
        }
      }
    }
    return { seats: seats, counter: counter };
  }

  onPressFillSeats = () => {
    const { array, pessengerCount } = this.state;
    if (pessengerCount !== '' && Number.isInteger(pessengerCount)) {
      var seats = this.fillWithMAandW(array);
      var rowSize = Math.max.apply(Math, array.map(e => e[1]));
      var colSize = Math.max.apply(Math, array.map(e => e[0]));

      var obj = {};
      obj = this.replaceWithNumber('A', 1, seats, colSize, rowSize);
      obj = this.replaceWithNumber(
        'W',
        obj.counter,
        obj.seats,
        colSize,
        rowSize
      );
      obj = this.replaceWithNumber(
        'M',
        obj.counter,
        obj.seats,
        colSize,
        rowSize
      );
      seats = obj.seats;
    } else {
      alert('Pessenger count cannot empty or must be number');
    }
  };

  renderSeats(item, i) {
    return (
      <View
        key={i}
        style={{
          flex: 1,
          alignItems: 'center',

          marginHorizontal: 2
        }}
      >
        {item.map((item, i) => (
          <View key={i} style={{ flexDirection: 'row' }}>
            {item.map((items, i) => (
              <View
                key={i}
                style={{
                  width: width / this.state.array.length / item.length - 3,
                  height: 22,
                  borderWidth: 1,
                  borderColor: 'white',
                  justifyContent: 'center',
                  backgroundColor:
                    items === 'A'
                      ? '#3498db'
                      : items === 'W'
                      ? '#2ecc71'
                      : items === 'M'
                      ? '#eb4d4b'
                      : Number.isInteger(items)
                      ? 'gray'
                      : 'white',
                  alignItems: 'center'
                }}
              >
                <Text style={{ fontSize: 10 }}>{items}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>
    );
  }

  createArraySeat(text, i) {
    const { array } = this.state;
    const arrHolder = this.state.array;
    const check = text.split(',');

    if (check.length === 2) {
      if (array[i] === undefined || array[i].length === 0) {
        arrHolder.push([]);
        arrHolder[i].push(new Array(check[1]));
        arrHolder[i].push(new Array(check[0]));
        this.setState({ array: arrHolder });
      } else {
        const tempArr = [];
        tempArr.push(parseInt(check[1]), parseInt(check[0]));

        arrHolder[i] = tempArr;
        this.setState({ array: arrHolder });
      }
    }
  }

  renderModalRowCol() {
    return (
      <View style={styles.modalBackground}>
        <View style={styles.modalRowColContainer}>
          <ScrollView>
            {this.state.seatGroupLength.map((item, i) => (
              <View style={{ padding: 5 }} key={i}>
                <Text>Row {i + 1}: </Text>
                <View style={{ flexDirection: 'row', padding: 2 }}>
                  <Text>Row,Col : </Text>
                  <TextInput
                    keyboardType="decimal-pad"
                    blurOnSubmit={false}
                    returnKeyType={
                      i === this.state.seatGroupLength ? 'go' : 'next'
                    }
                    autoFocus={i === 0 ? true : false}
                    onChangeText={text => this.createArraySeat(text, i)}
                    placeholder={'0,0'}
                    style={{ width: '20%', height: 20 }}
                  />
                </View>
              </View>
            ))}
          </ScrollView>

          <Text styles={{ marginTop: 10 }}>
            *Input must be Array 2D, eg : 3,4
          </Text>

          <TouchableOpacity
            style={styles.btn}
            onPress={() => this.clickCreateSeats()}
          >
            <Text style={styles.btnText}>Create Seats</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  clickCreateSeats() {
    this.setState({ modalInputRowCol: false });
    this.fillWithMAandW();
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{ width: '90%', alignItems: 'center' }}>
          <Text style={{ fontSize: 18 }}>Input Pessenger Count : </Text>
          <TextInput
            style={styles.textInput}
            onChangeText={text =>
              this.setState({ pessengerCount: parseInt(text) })
            }
            placeholder={'0'}
          />
        </View>
        <Button
          onPress={() => this.onPressFillSeats()}
          title="Fill Seats"
          color="#841584"
        />
        <View style={styles.seatsContainer}>
          {this.state.seats.map((item, i) => this.renderSeats(item, i))}
        </View>

        <TouchableOpacity
          style={{
            paddingVertical: 5,
            paddingHorizontal: 10,
            marginTop: 'auto',
            bottom: 20,
            backgroundColor: 'orange',
            borderRadius: 5
          }}
          onPress={() => this.setState({ modalInputRowCol: true })}
        >
          <Text style={styles.btnText}>Reset</Text>
        </TouchableOpacity>
        {this.state.modalInputRowCol ? this.renderModalRowCol() : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
    backgroundColor: '#fff',
    alignItems: 'center'
  },
  modalRowColContainer: {
    backgroundColor: 'white',
    height: '50%',
    width: '80%',

    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowRadius: 3,
    shadowOpacity: 0.2,
    borderRadius: 10,
    padding: 20,
    marginBottom: 100
  },

  seatsContainer: {
    marginTop: 100,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  modalBackground: {
    top: -40,
    width: width,
    height: height,
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,.7)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  textInput: {
    marginTop: 10,
    height: 40,
    fontSize: 24,
    width: '50%',
    textAlign: 'center'
  },
  btn: {
    marginTop: 10,
    paddingVertical: 7,
    paddingHorizontal: 10,
    backgroundColor: '#3498db',
    borderRadius: 5
  },
  btnText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center'
  }
});
