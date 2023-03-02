import React, { Component } from 'react';
import {
	View,
	Text,
	StatusBar,
	TouchableOpacity,
  	StyleSheet,
	TouchableHighlight,
	Image,
	ImageBackground,
	ScrollView,
	TextInput,
	AsyncStorage,
	ListView,
	Platform,
	TouchableWithoutFeedback,
	BackHandler,
	BackAndroid
} from 'react-native';

import ImageSlider from 'react-native-image-slider';
import { responsiveHeight, responsiveWidth, responsiveFontSize} from 'react-native-responsive-dimensions';
import Url from './../utils/Api';
import Entypo from 'react-native-vector-icons/Entypo';
import Zocial from 'react-native-vector-icons/Zocial';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { StackNavigator, navigation, DrawerNavigator } from 'react-navigation';
import PopupDialog from 'react-native-popup-dialog';
import * as Progress from 'react-native-progress';
import Toast, {DURATION} from 'react-native-easy-toast';
import StatusBarPaddingIOS from 'react-native-ios-status-bar-padding'

var imageSlide = [];

export default class ForgotPassword extends Component{

	constructor(props) {
	        super(props);

	        this.state = {
	        	cart_count: 0,
	        	position: 1,
	            interval: null,
	            customerData:'',
	            customer: false,
	            bestSeller_id:'',
              otpblock:false,
              passwordblock:false,
							mobileno: '',
							otp: '',
							user_id: '',
							otptext: '',
							otpbutton: true,
							newpass: '',
							confPass: '',
	        	dataSource: new ListView.DataSource({
					rowHasChanged: (row1, row2) => row1 !== row2,
				}),
				dataSource1: new ListView.DataSource({
					rowHasChanged: (row1, row2) => row1 !== row2,
				}),
	        };
	    }

    componentDidMount(){
    	//this.popupDialog.show();
    	BackHandler.addEventListener('hardwareBackbutton', this.handleBack.bind(this));
    	// this.setState({interval: setInterval(() => {
			// 	 this.setState({position: this.state.position === 3 ? 0 : this.state.position + 1});
		 // }, 2000)});
     //
    	// this.getNumberCart();
    	// this.getCustomer();
    }

    componentWillUnmount(){
		BackHandler.removeEventListener('hardwareBackbutton');
	}

	handleBack(){
 		this.props.navigation.goBack();
 		return true;
 	}

    forgetPassword(){
			this.popupDialog.show();
		NetInfo.isConnected.fetch().then(isConnected => {
			if (isConnected) {
				fetch(Url.domain + '/ForgetPassWord', {
    		method : 'POST',
    		headers : {
    			'Accept': 'application/json',
      			'Content-Type': 'application/json'
    		},
				body: JSON.stringify({
					'mobile': this.state.mobileno
				})
    	}).then((response) => response.json())
    		.then((responseData) => {
          if(responseData.code === 200) {
						this.popupDialog.dismiss()
          	this.refs.toast.show(responseData.msg, 900)
						this.setState({ otpblock: true, otp: responseData.OTP, user_id: responseData.user })
          }
    	}).done(() => {this.popupDialog.dismiss()});
				}else{
				alert("No Network ,Try Again");
			}
		})
    	
    }

		buttondisable() {
			if(this.state.otptext){
				this.setState({
					otpbutton: false
				})
			}else{
				this.setState({
					otpbutton: true
				})
			}
		}

		verfiyotp() {
			// this.popupDialog.show()
			if(this.state.otp === this.state.otptext){

				this.refs.toast.show("OTP has been send successfully verified", 900)
				this.setState({
					passwordblock: true
				})
				// this.popupDialog.dismiss()
			}else{
				// this.popupDialog.dismiss()
				this.refs.toast.show("Invalid OTP", 900)
			}
		}

		changePassword() {
			this.popupDialog.show()
				fetch(Url.domain + '/resetPass', {
	    		method : 'POST',
	    		headers : {
	    			'Accept': 'application/json',
	      			'Content-Type': 'application/json'
	    		},
					body: JSON.stringify({
						'mobile': this.state.mobileno,
						'id': this.state.user_id,
						'newPass': this.state.newpass
					})
	    	}).then((response) => response.json())
	    		.then((responseData) => {
	          if(responseData.code === 200) {
							this.popupDialog.dismiss()
	          	this.refs.toast.show(responseData.msg, 900)
							this.props.navigation.navigate('architectsignin')
	          }else{
							this.popupDialog.dismiss()
							this.refs.toast.show(responseData.msg, 900)
						}
	    	}).done(() => {this.popupDialog.dismiss()});
		}

	render(){
		return(
			<View style = {{flex: 1,backgroundColor: 'white'}} >
				<StatusBarPaddingIOS/>
        <View style={{height: responsiveHeight(7.5), elevation: 1.5, alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff'}}>
          <View style={{flexDirection: 'row'}}>
            <View style={{ width: responsiveWidth(40), alignItems: 'flex-start', justifyContent: 'center',}}>
              <TouchableOpacity style={{marginLeft: '5%'}} onPress={() => this.props.navigation.goBack()}>
                <MaterialIcons name="arrow-back" size={28} color="black" />
              </TouchableOpacity>
            </View>
            <View style={{ width: responsiveWidth(60), alignItems: 'flex-start', justifyContent: 'center' }}>
              <Image source={require('./../../icon.png')} style={{ height: responsiveHeight(10), width: responsiveWidth(23) }} />
            </View>
          </View>
        </View>
        <View style={{flexDirection: 'column',marginLeft: 20,marginTop: 10}}>
    			<View style = {{ }}>
    			   	<Text style = {{fontFamily:'Nunito-Bold', fontSize: responsiveFontSize(3.2), color: 'black'}} >Password assistance</Text>
    			</View>
          {this.state.otpblock===false && this.state.passwordblock===false && <View style = {{marginTop:10 }}>
    			   	<Text style = {{fontFamily:'Nunito-Regular', fontSize: responsiveFontSize(1.8), color: 'black'}} >Enter the mobile phone number assosiated with your thehome account</Text>
    			</View>}
          { this.state.otpblock===false && this.state.passwordblock===false &&<View style={{ marginTop: 30 }}>
            <TextInput
              underlineColorAndroid="transparent"
              placeholder="Your mobile phone number"
              placeholderTextColor="grey"
							keyboardType="number-pad"
              onChangeText={(mobileno) => this.setState({ mobileno: mobileno })}
              style={{ width: responsiveWidth(86), fontFamily: 'Nunito-Regular', height: responsiveHeight(6.5), borderRadius: 3, backgroundColor: 'white', borderWidth: 0.7, borderColor: '#e2e2e2' }}
            />
          </View>}
          {this.state.otpblock===false && this.state.passwordblock===false &&<TouchableOpacity style ={{backgroundColor: '#F1C65A',width: responsiveWidth(90),borderRadius: 3, height: responsiveHeight(7), alignItems:'center', justifyContent:'center',marginTop:20}} onPress={() => {this.forgetPassword()}} >
            <Text style = {{fontSize: responsiveFontSize(2), color: 'black', fontFamily: 'Nunito-Bold'}}>Continue</Text>
          </TouchableOpacity>}
          { this.state.otpblock && this.state.passwordblock===false &&<View style={{ marginTop: 20 }}>
            <TextInput
              underlineColorAndroid="transparent"
              placeholder="Enter your OTP "
              placeholderTextColor="grey"
							keyboardType="number-pad"
							onSubmitEditing={() => this.buttondisable()}
							onEndEditing={() => this.buttondisable()}
              onChangeText={(otp) => {this.setState({ otptext: otp }); this.buttondisable()}}
							style={{ width: responsiveWidth(86), fontFamily: 'Nunito-Regular', height: responsiveHeight(6.5), borderRadius: 3, backgroundColor: 'white', borderWidth: 0.7, borderColor: '#e2e2e2' }}
            />
          </View>}
          {this.state.otpblock && this.state.passwordblock===false &&<TouchableOpacity disabled={this.state.otpbutton} style ={{backgroundColor: '#F1C65A',width: responsiveWidth(90),borderRadius: 3, height: responsiveHeight(7), alignItems:'center', justifyContent:'center',marginTop:20}} onPress={() => {this.verfiyotp()}} >
            <Text style = {{fontSize: responsiveFontSize(2), color: 'black', fontFamily: 'Nunito-Bold'}}>Submit</Text>
          </TouchableOpacity>}
          { this.state.otpblock && this.state.passwordblock &&<View style={{ marginTop: 20 }}>
            <TextInput
              underlineColorAndroid="transparent"
              placeholder="Enter your new password "
              placeholderTextColor="grey"
              onChangeText={(pass) => this.setState({ newpass: pass })}
							style={{ width: responsiveWidth(86), fontFamily: 'Nunito-Regular', height: responsiveHeight(6.5), borderRadius: 3, backgroundColor: 'white', borderWidth: 0.7, borderColor: '#e2e2e2' }}
            />
          </View>}
          {this.state.otpblock && this.state.passwordblock &&<TouchableOpacity style ={{backgroundColor: '#F1C65A',width: responsiveWidth(90),borderRadius: 3, height: responsiveHeight(7), alignItems:'center', justifyContent:'center',marginTop:20}} onPress={() => {this.changePassword()}} >
            <Text style = {{fontSize: responsiveFontSize(2), color: 'black', fontFamily: 'Nunito-Bold'}}>Submit</Text>
          </TouchableOpacity>}
        </View>
        <Toast ref="toast"/>
				<PopupDialog dismissOnTouchOutside = {false} dismissOnHardwareBackPress = {false} overlayOpacity = {0.9} overlayBackgroundColor = '#A9A9A9' width = {responsiveWidth(75)} height = {responsiveHeight(10)} ref={(popupDialog) => { this.popupDialog = popupDialog; }}>
					<View style = {{height: responsiveHeight(10), width: responsiveWidth(75), flexDirection: 'row'}}>
						<View style = {{width: responsiveWidth(20), justifyContent:'center', alignItems:'center'}}>
							<Progress.CircleSnail color={['#008744','#0057e7', '#d62d20', '#ffa700', '#eee']} duration = {700} />
						</View>
						<View style = {{justifyContent:'center'}}>
							<Text style = {{fontFamily: 'Nunito-Regular', fontSize: responsiveFontSize(2), color: 'black'}}>Loading...</Text>
						</View>
					</View>
				</PopupDialog>
			</View>
		);
	}


}
