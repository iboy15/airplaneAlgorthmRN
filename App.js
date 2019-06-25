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

const { width, height } = Dimensions.get('screen');

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      seats: [],
      array: [],
      groupRowLength: 0,
      pessengerCount: 0,
      seatGroupLength: [],
      modalInputGroup: true,
      modalInputRowCol: false
    };
  }

  componentDidMount() {
    const rArray = [];
    for (var i = 0; i < this.state.array.length; i++) {
      rArray.push(this.state.array[i].reverse());
    }
    this.setState({ array: rArray });
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
        for (k = 0; k < seats[j][i].length; k++) {
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

  setSeatGroupLength() {
    const { groupRowLength } = this.state;
    console.log(groupRowLength);
    if (groupRowLength !== '' && Number.isInteger(groupRowLength)) {
      const arr = [];
      if (groupRowLength == 0) return this.setState({ seatGroupLength: [] });
      for (var i = 0; i < groupRowLength; i++) {
        arr.push(i);
      }
      this.setState({
        seatGroupLength: arr,
        modalInputGroup: false,
        modalInputRowCol: true
      });
    } else {
      alert('Input cannot empty or must be number');
    }
  }

  renderModalGroupRow() {
    return (
      <Modal visible={this.state.modalInputGroup} transparent={true} style={{}}>
        <View style={styles.modalBackground}>
          <View style={styles.modalGroupRow}>
            <Text>Input number of rows of group seats : </Text>

            <TextInput
              onChangeText={text =>
                this.setState({ groupRowLength: parseInt(text) })
              }
              placeholder={'0'}
              style={styles.textInput}
            />
            <Button
              onPress={() => this.setSeatGroupLength()}
              title="Next"
              color="#841584"
            />
          </View>
        </View>
      </Modal>
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
      <Modal
        visible={this.state.modalInputRowCol}
        transparent={true}
        style={{}}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalRowColContainer}>
            <View
              style={{
                width: '100%',
                top: -15,
                left: -15,
                alignItems: 'flex-start'
              }}
            >
              <Button title="< Back" onPress={() => this.backPress()} />
            </View>
            <ScrollView>
              {this.state.seatGroupLength.map((item, i) => (
                <View style={{ padding: 5 }} key={i}>
                  <Text>Row {i + 1}: </Text>
                  <View style={{ flexDirection: 'row', padding: 2 }}>
                    <Text>Row,Col : </Text>
                    <TextInput
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

            <Button
              onPress={() => this.clickCreateSeats()}
              title="Create Seats"
              color="#841584"
            />
          </View>
        </View>
      </Modal>
    );
  }

  clickCreateSeats() {
    this.setState({ modalInputRowCol: false });
    this.fillWithMAandW();
  }

  backPress() {
    this.setState({
      modalInputGroup: true,
      modalInputRowCol: false
    });
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderModalGroupRow()}
        {this.renderModalRowCol()}
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
    height: '80%',
    width: '80%',
    alignSelf: 'center',
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowRadius: 3,
    shadowOpacity: 0.2,
    borderRadius: 10,
    padding: 20
  },
  modalGroupRow: {
    backgroundColor: 'white',
    height: '20%',
    width: '80%',
    alignSelf: 'center',
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowRadius: 3,
    shadowOpacity: 0.2,
    alignItems: 'center',
    borderRadius: 10,
    padding: 20
  },
  seatsContainer: {
    marginTop: 100,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  modalBackground: {
    flex: 1,
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
  }
});
