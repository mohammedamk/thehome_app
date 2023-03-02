import React, { Component } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  AsyncStorage,
  BackHandler,
  NetInfo
} from 'react-native'
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions'
import Url from './../utils/Api'
import { RadioGroup, RadioButton } from 'react-native-flexi-radio-button'
import Toast from 'react-native-easy-toast'
import PopupDialog from 'react-native-popup-dialog'
import * as Progress from 'react-native-progress'
import ModalDropdown from 'react-native-modal-dropdown'
import StatusBarPaddingIOS from 'react-native-ios-status-bar-padding'

export default class ArchitectSignin extends Component {
  constructor(props) {
    super(props)
    this.state = {
      customerlogin: true,
      createvisible: false,
      colorChangeLogin: 'white',
      colorChangeReg: 'grey',
      Name: '',
      MobileNo: '',
      Email: '',
      Login_Email: '',
      Login_Password: '',
      Address: '',
      City: '',
      State: '',
      selectedIndex: 1,
      stateData: [
        'Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam',
        'Bihar',
        'Chandigarh',
        'Chhattisgarh',
        'Dadra and Nagar Haveli',
        'Daman and Diu',
        'Delhi',
        'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand', 'Karnataka', 'Kerala', 'Lakshadweep', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Puducherry', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
      ]
    }
  }

  onSelect(index, value) {
    if (index === 0) {
      this.setState({
        customerlogin: false,
        createvisible: true,
        colorChangeLogin: 'grey',
        colorChangeReg: 'white'
      })
    } else {
      this.setState({
        customerlogin: true,
        createvisible: false,
        colorChangeLogin: 'white',
        colorChangeReg: 'grey'
      })
    }
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackbutton', this.handleBack.bind(this))
  }

  handleBack() {
    BackHandler.exitApp()
    return true
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackbutton')
  }

  registration() {
    this.popupDialog.show()
    NetInfo.isConnected.fetch().then(isConnected => {
      if (isConnected) {
    fetch(Url.domain + '/signup_main', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'name': this.state.Name,
        'email': this.state.Email,
        'mobile': this.state.MobileNo,
        'password':this.state.MobileNo,
        'city': this.state.City,
        'state': this.state.State
      })
    }).then((response) => response.json())
      .then((responseData) => {
        if (responseData.code === 404) {
          this.popupDialog.dismiss()
          this.refs.toast.show(responseData.msg, 2000)
        } else {
          this.popupDialog.dismiss()
          this.refs.toast.show(responseData.msg, 500)
          this.saveArchitect(responseData.result)
          this.setState({ selectedIndex: 1 })
        }
      })
    }else{
      alert("No Network, Try again")
    }
    });
  }

  login() {
    this.popupDialog.show()
    fetch(Url.domain + '/login', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'mobile': this.state.Login_Email,
        'password': this.state.Login_Password
      })
    }).then((response) => response.json())
      .then((responseData) => {
        if (responseData.code === 404) {
          this.popupDialog.dismiss()
          this.refs.toast.show(responseData.msg, 2000)
        } else {
          this.popupDialog.dismiss()
          this.refs.toast.show(responseData.msg, 500)
          this.saveArchitect(responseData.architectData)
        }
      })
  }

  saveArchitect(architect) {
    AsyncStorage.setItem('Architect', JSON.stringify(architect))
    setTimeout(() => { this.gotohome() }, 600)
  }

  gotohome() {
    this.props.navigation.navigate('categories')
  }

  onselectState(id, value) {
    this.setState({
      State: value
    })
  }

  onselectProfession(id, value) {
    this.setState({
      Profession: value
    })
  }

  render() {
    return (

      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <StatusBarPaddingIOS/>
        <View style={{ height: responsiveHeight(7.5), elevation: 1.5, alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff' }} >
          <Image source={require('./../../icon.png')} style={{ height: responsiveHeight(10), width: responsiveWidth(23) }} />
        </View>
        <ScrollView>
          <View style={{ flexDirection: 'column', paddingBottom: '8%' }}>
            <View style={{ width: responsiveWidth(92), alignSelf: 'center', marginTop: '4%', marginBottom: '4%' }} >
              <Text style={{ fontFamily: 'Nunito-ExtraBold', color: 'black', fontSize: responsiveFontSize(2.8) }}>Welcome</Text>
            </View>
            <View style={{ width: responsiveWidth(92), alignSelf: 'center', borderWidth: 1, borderColor: '#e2e2e2' }}>
              <RadioGroup color="grey" activeColor="orange" highlightColor="" selectedIndex={this.state.selectedIndex} onSelect={(index, value) => this.onSelect(index, value)}>
                <RadioButton style={{}}>
                  <View >
                    <View style={{ flexDirection: 'row' }}>
                      <View>
                        <Text style={{ fontSize: responsiveFontSize(2), fontFamily: 'Nunito-ExtraBold', color: 'black' }}>Create an account.</Text>
                      </View>
                      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontSize: responsiveFontSize(1.5), fontFamily: 'Nunito-Regular', color: 'black' }}>  New to thehome?</Text>
                      </View>
                    </View>
                    {this.state.createvisible &&
                      <View style={{ marginTop: 10, width: responsiveWidth(92) }}>
                        <View style={{ height: responsiveHeight(45), justifyContent: 'center' }}>
                          <View style={{ width: responsiveWidth(75) }}>
                            <TextInput
                              underlineColorAndroid="transparent"
                              placeholder="Name"
                              placeholderTextColor="grey"
                              onChangeText={(name) => this.setState({ Name: name })}
                              style={{ width: responsiveWidth(75), fontFamily: 'Nunito-Regular', height: responsiveHeight(6.5), borderRadius: 3, backgroundColor: 'white', borderWidth: 0.7, borderColor: '#e2e2e2' }}
                            />
                          </View>
                          <View style={{ marginTop: 5 }}>
                            <TextInput
                              underlineColorAndroid="transparent"
                              placeholder="Email Address"
                              placeholderTextColor="grey"
                              onChangeText={(email) => this.setState({ Email: email })}
                              style={{ width: responsiveWidth(75), fontFamily: 'Nunito-Regular', height: responsiveHeight(6.5), borderRadius: 3, backgroundColor: 'white', borderWidth: 0.7, borderColor: '#e2e2e2' }}
                            />
                          </View>
                          <View style={{ marginTop: 5 }}>
                            <TextInput
                              underlineColorAndroid="transparent"
                              placeholder="Mobile No."
                              placeholderTextColor="grey"
                              maxLength={10}
                              keyboardType="number-pad"
                              onChangeText={(mobileNo) => this.setState({ MobileNo: mobileNo })}
                              style={{ width: responsiveWidth(75), fontFamily: 'Nunito-Regular', height: responsiveHeight(6.5), borderRadius: 3, backgroundColor: 'white', borderWidth: 0.7, borderColor: '#e2e2e2' }}
                            />
                          </View>
                          <View style={{ marginTop: 5 }}>
                            <TextInput
                              underlineColorAndroid="transparent"
                              placeholder="City"
                              placeholderTextColor="grey"
                              onChangeText={(city) => this.setState({ unique_id: city })}
                              style={{ width: responsiveWidth(75), fontFamily: 'Nunito-Regular', height: responsiveHeight(6.5), borderRadius: 3, backgroundColor: 'white', borderWidth: 0.7, borderColor: '#e2e2e2' }}
                            />
                          </View>
                          <View style={{ marginTop: 5 }}>
                            <ModalDropdown
                              style={{ width: responsiveWidth(75), height: responsiveHeight(6.5), borderRadius: 3, backgroundColor: 'white', borderWidth: 0.7, borderColor: '#e2e2e2' }}
                              textStyle={{ fontFamily: 'Nunito-Regular', fontSize: responsiveFontSize(1.7), paddingTop: 10, color: 'grey', paddingLeft: 5 }}
                              defaultValue="Select State"
                              dropdownStyle={{ width: responsiveWidth(75), height: responsiveHeight(17), marginTop: 10, backgroundColor: 'transparent', borderColor: '#7A7A7A' }}
                              dropdownTextStyle={{ fontSize: responsiveFontSize(1.7), fontFamily: 'Nunito-Regular', paddingLeft: 10, backgroundColor: '#fff' }}
                              options={this.state.stateData}
                              onSelect={(idx, value) => this.onselectState(idx, value)} />
                          </View>
                          <View style={{ marginTop: 5 }}>
                            <TouchableOpacity onPress={() => this.registration()} style={{ height: responsiveHeight(7), width: responsiveWidth(75), borderRadius: 3, borderWidth: 1, alignItems: 'center', justifyContent: 'center', borderColor: '#e2e2e2', backgroundColor: '#F1C65A' }}>
                              <Text>Continue</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    }
                  </View>
                </RadioButton>
                <RadioButton style={{}}>
                  <View style={{}}>
                    <View style={{ flexDirection: 'row' }}>
                      <View>
                        <Text style={{ fontSize: responsiveFontSize(2), fontFamily: 'Nunito-ExtraBold', color: 'black' }}>Login.</Text>
                      </View>
                      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontSize: responsiveFontSize(1.5), fontFamily: 'Nunito-Regular', color: 'black' }}>  Already a customer?</Text>
                      </View>
                    </View>
                    {this.state.customerlogin &&
                      <View style={{ marginTop: 10, width: responsiveWidth(92) }}>
                        <View style={{ height: responsiveHeight(13), justifyContent: 'center' }}>
                          <View style={{ width: responsiveWidth(75) }}>
                            <TextInput
                              underlineColorAndroid="transparent"
                              placeholder="Mobile No."
                              placeholderTextColor="grey"
                              onChangeText={(loginEmail) => this.setState({ Login_Email: loginEmail })}
                              style={{ width: responsiveWidth(75), fontFamily: 'Nunito-Regular', height: responsiveHeight(6.5), borderRadius: 3, backgroundColor: 'white', borderWidth: 0.7, borderColor: '#e2e2e2e2' }}
                            />
                          </View>
                          <View style={{ marginTop: 5 }}>
                            <TextInput
                              underlineColorAndroid="transparent"
                              placeholder="password"
                              secureTextEntry={true}
                              placeholderTextColor="grey"
                              onChangeText={(loginPassword) => this.setState({ Login_Password: loginPassword })}
                              style={{ width: responsiveWidth(75), fontFamily: 'Nunito-Regular', height: responsiveHeight(6.5), borderRadius: 3, backgroundColor: 'white', borderWidth: 0.7, borderColor: '#e2e2e2e2' }}
                            />
                          </View>
                        </View>
                        <View style={{ width: responsiveWidth(75), marginTop: 5, justifyContent: 'center', alignItems: 'flex-end' }} >
                          <TouchableOpacity onPress={() => this.props.navigation.navigate('forgotpassword')}>
                            <Text style={{ fontFamily: 'Nunito-Regular', fontSize: 15, color: '#46b07b' }} >Forgot Password?</Text>
                          </TouchableOpacity>
                        </View>
                        <View style={{ width: responsiveWidth(75), height: responsiveHeight(7), marginTop: 5, alignItems: 'center', justifyContent: 'center' }}>
                          <TouchableOpacity onPress={() => this.login()} style={{ height: responsiveHeight(7), width: responsiveWidth(75), borderRadius: 3, borderWidth: 1, alignItems: 'center', justifyContent: 'center', borderColor: '#e2e2e2', backgroundColor: '#F1C65A' }}>
                            <Text>Continue</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    }
                  </View>
                </RadioButton>
              </RadioGroup>
            </View>
            <View style={{height: responsiveHeight(20)}}>
            </View>
            <View style={{ width: responsiveWidth(75), height: responsiveHeight(7), marginTop: 5, alignItems: 'center', justifyContent: 'center', alignSelf:'center' }}>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('categories')} style={{ height: responsiveHeight(7), width: responsiveWidth(75), borderRadius: 3, borderWidth: 1, alignItems: 'center', justifyContent: 'center', borderColor: 'transparent', backgroundColor: '#f4f4f4' }}>
                <Text style ={{color: 'black', fontFamily: 'Nunito-Bold', fontSize: responsiveFontSize(2.3)}}>Skip sign in</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
        <Toast ref="toast" />
        <PopupDialog dismissOnTouchOutside={false} dismissOnHardwareBackPress={false} overlayOpacity={0.9} overlayBackgroundColor="#A9A9A9" width={responsiveWidth(75)} height={responsiveHeight(10)} ref={(popupDialog) => { this.popupDialog = popupDialog }}>
          <View style={{ height: responsiveHeight(10), width: responsiveWidth(75), flexDirection: 'row' }}>
            <View style={{ width: responsiveWidth(20), justifyContent: 'center', alignItems: 'center' }}>
              <Progress.CircleSnail color={['#008744', '#0057e7', '#d62d20', '#ffa700', '#eee']} duration={700} />
            </View>
            <View style={{ justifyContent: 'center' }}>
              <Text style={{ fontFamily: 'Nunito-Regular', fontSize: responsiveFontSize(2), color: 'black' }}>Loading...</Text>
            </View>
          </View>
        </PopupDialog>
      </View>
    )
  }
}
