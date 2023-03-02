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
	Alert
} from 'react-native';

import { responsiveHeight, responsiveWidth, responsiveFontSize} from 'react-native-responsive-dimensions';
import Url from './../utils/Api';
import Entypo from 'react-native-vector-icons/Entypo';
import Zocial from 'react-native-vector-icons/Zocial';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Item from './item';
import NavigationHeader from './../utils/components/navigationHeader';
import Toast, {DURATION} from 'react-native-easy-toast';
import PopupDialog from 'react-native-popup-dialog';
import * as Progress from 'react-native-progress';
import StatusBarPaddingIOS from 'react-native-ios-status-bar-padding'

export default class BasicDetailEdit extends Component{

	state = {
		name: '',
		email: '',
		mobile:'',
		city:'',
		state:'',
		customer_id: '',
	}

	componentDidMount(){
		BackHandler.addEventListener('hardwareBackbutton', this.handleBack.bind(this));
		var customer = this.props.navigation.state.params.customer;
		this.setState({
			name: customer.name,
			email: customer.email,
			mobile: customer.mobile,
			city:customer.city,
			state:customer.state,
			customer_id: customer._id
		})


	}

	componentWillUnmount(){
		BackHandler.removeEventListener('hardwareBackbutton');
	}

	handleBack(){
 		this.props.navigation.navigate('account');
 		return true;
 	}

	updateDetails(){
		this.popupDialog.show();
		fetch(Url.domain + '/UpdateArchitect', {
    		method : 'POST',
    		headers : {
    			'Accept': 'application/json',
      			'Content-Type': 'application/json'
    		},
    		body : JSON.stringify({
				"email":  this.state.email,
				"name" : this.state.name,
				"mobile" : this.state.mobile,
				"city":this.state.city,
				"state":this.state.state,
				"_id" : this.state.customer_id
			})
    	}).then((response) => response.json())
    		.then((responseData) => {
    			var data = {
		         "email":  this.state.email,
				"name" : this.state.name,
				"mobile" : this.state.mobile,
				"city":this.state.city,
				"state":this.state.state,
				"_id" : this.state.customer_id
		       }
    			if(responseData.code == 200){
    				this.popupDialog.dismiss();
    				Alert.alert('', "Basic Details Updated.");
    				AsyncStorage.removeItem('Architect');
    				AsyncStorage.setItem('Architect', JSON.stringify(data));
    				this.props.navigation.navigate('account');
    			}else{
    				this.popupDialog.dismiss();
    				Alert.alert('', "Network Problem!");
    			}
    	}).done();
	}

	render(){
		return(
			<View style={{flex:1,}}>
			<StatusBarPaddingIOS/>
				<View style = {{backgroundColor: '#232f3e', height: responsiveHeight(9), marginBottom: 5}}>
					<View style={{height: responsiveHeight(8),flexDirection: 'row',}}>
						<View style={{ width: responsiveWidth(15),alignItems:'center', justifyContent:'center'}}>
							<TouchableOpacity onPress={() => this.props.navigation.goBack()}>
								<Entypo name="chevron-small-left" size={28} color="white"  />
							</TouchableOpacity>
						</View>
						<View style={{width: responsiveWidth(58), justifyContent: 'center'}}>
							<Text style = {{fontFamily:'Nunito-Bold', fontSize: responsiveFontSize(3), color: 'white'}} >{Url.title}</Text>
						</View>
					</View>
				</View>
				<ScrollView>
					<View style = {{marginTop: 10, marginBottom: 10,width: responsiveWidth(95), alignSelf:'center', flexDirection:'row', justifyContent: 'center'}}>
						<Text style = {{fontSize: responsiveFontSize(3.2), color: '#000', fontFamily: 'Nunito-Bold'}}>Basic Details</Text>
					</View>
					<View style ={{flexDirection: 'column', alignSelf:'center', }}>
						<View style = {{width: responsiveWidth(88), alignSelf:'center',marginTop: 10}}>
							<View style = {{marginBottom: 10}}>
								<Text style = {{fontFamily:'Nunito-Bold', fontSize: responsiveFontSize(2.2), color: 'black'}}>First Name</Text>
							</View>
							<TextInput
			  					underlineColorAndroid='transparent'
			  					placeholder="Name"
			  					defaultValue = {this.state.name}
			  					placeholderTextColor = "grey"
			  					onChangeText={(name) => this.setState({first_name:name})}
					            style={{width:responsiveWidth(88),fontFamily: 'Nunito-Regular',height:responsiveHeight(6.5),borderRadius: 3,backgroundColor:'white',borderWidth: 0.7,borderColor:'#e2e2e2'}}
			  				/>
						</View>
						<View style = {{width: responsiveWidth(88), alignSelf:'center', marginTop: 10}}>
							<View style = {{marginBottom: 10}}>
								<Text style = {{fontFamily:'Nunito-Bold', fontSize: responsiveFontSize(2.2), color: 'black'}}>Last Name</Text>
							</View>
							<TextInput
			  					underlineColorAndroid='transparent'
			  					placeholder="Email"
			  					defaultValue = {this.state.email}
			  					placeholderTextColor = "grey"
			  					onChangeText={(email) => this.setState({email:email})}
					            style={{width:responsiveWidth(88),fontFamily: 'Nunito-Regular',height:responsiveHeight(6.5),borderRadius: 3,backgroundColor:'white',borderWidth: 0.7,borderColor:'#e2e2e2'}}
			  				/>
						</View>
						<View style = {{width: responsiveWidth(88), alignSelf:'center', marginTop: 10}}>
							<View style = {{marginBottom: 10}}>
								<Text style = {{fontFamily:'Nunito-Bold', fontSize: responsiveFontSize(2.2), color: 'black'}}>Contact No.</Text>
							</View>
							<TextInput
			  					underlineColorAndroid='transparent'
			  					placeholder="Contact No."
			  					defaultValue = {this.state.mobile}
			  					placeholderTextColor = "grey"
			  					onChangeText={(mobile) => this.setState({mobile:mobile})}
					            style={{width:responsiveWidth(88),fontFamily: 'Nunito-Regular',height:responsiveHeight(6.5),borderRadius: 3,backgroundColor:'white',borderWidth: 0.7,borderColor:'#e2e2e2'}}
			  				/>
						</View>
						<View style = {{width: responsiveWidth(88), alignSelf:'center', marginTop: 10}}>
							<View style = {{marginBottom: 10}}>
								<Text style = {{fontFamily:'Nunito-Bold', fontSize: responsiveFontSize(2.2), color: 'black'}}>City</Text>
							</View>
							<TextInput
			  					underlineColorAndroid='transparent'
			  					placeholder="City"
			  					defaultValue = {this.state.city}
			  					placeholderTextColor = "grey"
			  					onChangeText={(city) => this.setState({city:city})}
					            style={{width:responsiveWidth(88),fontFamily: 'Nunito-Regular',height:responsiveHeight(6.5),borderRadius: 3,backgroundColor:'white',borderWidth: 0.7,borderColor:'#e2e2e2'}}
			  				/>
						</View>
						<View style = {{width: responsiveWidth(88), alignSelf:'center', marginTop: 10}}>
							<View style = {{marginBottom: 10}}>
								<Text style = {{fontFamily:'Nunito-Bold', fontSize: responsiveFontSize(2.2), color: 'black'}}>State</Text>
							</View>
							<TextInput
			  					underlineColorAndroid='transparent'
			  					placeholder="State"
			  					defaultValue = {this.state.state}
			  					placeholderTextColor = "grey"
			  					onChangeText={(state) => this.setState({state:state})}
					            style={{width:responsiveWidth(88),fontFamily: 'Nunito-Regular',height:responsiveHeight(6.5),borderRadius: 3,backgroundColor:'white',borderWidth: 0.7,borderColor:'#e2e2e2'}}
			  				/>
						</View>
						<View style = {{width: responsiveWidth(88), alignSelf:'center', marginTop: 15}}>
							<TouchableOpacity onPress = {() => this.updateDetails()} style = {{backgroundColor: '#F1C65A', width: responsiveWidth(88), height: responsiveHeight(6.5), borderRadius: 3, alignItems:'center', justifyContent:'center'}}>
								<Text style = {{fontFamily:'Nunito-Bold', fontSize: responsiveFontSize(2.2), color: 'black'}}>Update</Text>
							</TouchableOpacity>
						</View>
					</View>
				</ScrollView>
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