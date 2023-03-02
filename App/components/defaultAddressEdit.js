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

export default class DefaultAddressEdit extends Component{
	
	state = {
		first_name: '',
		last_name:'',
		phone:'',
		address: '',
		city:'',
		province:'',
		country:'',
		zip:'',
		customer_id:'',
		address_id: '',
		navigateTo: '',
	}

	componentDidMount(){
		if(this.props.navigation.state.params.flag == 'address'){
			this.setState({
				navigateTo: 'address'
			})
		}else if(this.props.navigation.state.params.flag == 'account'){
			this.setState({
				navigateTo: 'account'
			})
		}
		BackHandler.addEventListener('hardwareBackbutton', this.handleBack.bind(this));
		var customer = this.props.navigation.state.params.customer;
		this.setState({
			first_name: customer.default_address.first_name,
			last_name: customer.default_address.last_name,
			phone: customer.default_address.phone,
			address: customer.default_address.address1,
			city: customer.default_address.city,
			province: customer.default_address.province,
			country: customer.default_address.country,
			zip: customer.default_address.zip,
			customer_id: customer.id,
			address_id: customer.default_address.id
		})
	}

	componentWillUnmount(){
		BackHandler.removeEventListener('hardwareBackbutton');
	}

	handleBack(){
 		this.props.navigation.navigate(this.state.navigateTo);
 		return true;
 	}

	updateDetails(){
		this.popupDialog.show();
		NetInfo.isConnected.fetch().then(isConnected => {
	      if (isConnected) {
	   fetch(Url.main + '/updateAddress', {
    		method : 'POST',
    		headers : {
    			'Accept': 'application/json',
      			'Content-Type': 'application/json'
    		},
    		body : JSON.stringify({
				"address1" : this.state.address,
				"city": this.state.city,
				"province": this.state.province,
				"country": this.state.country,
				"zip": this.state.zip,
				"phone" : this.state.phone,
				"shopFullName" : Url.shopFullName,
				"first_name" : this.state.first_name,
				"last_name" : this.state.last_name,
				"customer_id" : this.state.customer_id,
				"address_id": this.state.address_id
			})
    	}).then((response) => response.json())
    		.then((responseData) => {
    			if(responseData.code == 200){
    				this.popupDialog.dismiss();
    				Alert.alert('', "Address Updated.");
    				AsyncStorage.removeItem('Customer');
    				AsyncStorage.setItem('Customer', JSON.stringify(responseData.result));
    				this.props.navigation.navigate(this.state.navigateTo);
    			}else{
    				this.popupDialog.dismiss();
    				Alert.alert('', "Network Problem!");
    			}
    	}).done();
	      }else{
	        alert("No Network ,Try Again");
	      }
	  })
		
	}

	render(){
		return(
			<View style={{flex:1,}}>
				<View style = {{backgroundColor: '#232f3e', height: responsiveHeight(9), marginBottom: 5}}>
					<View style={{height: responsiveHeight(8),flexDirection: 'row',}}>
						<View style={{ width: responsiveWidth(15),alignItems:'center', justifyContent:'center'}}>
							<TouchableOpacity onPress={() => this.props.navigation.navigate('DrawerToggle')}>
								<Entypo name="menu" size={28} color="white"  />
							</TouchableOpacity>
						</View>
						<View style={{width: responsiveWidth(58), justifyContent: 'center'}}>
							<Text style = {{fontFamily:'Nunito-Bold', fontSize: responsiveFontSize(3), color: 'white'}} >Shopify App</Text>
						</View>
					</View>
				</View>
				<ScrollView>
					<View style = {{marginTop: 10, marginBottom: 10,width: responsiveWidth(95), alignSelf:'center', flexDirection:'row', justifyContent: 'center'}}>
						<Text style = {{fontSize: responsiveFontSize(3.2), color: '#000', fontFamily: 'Nunito-Bold'}}>Address</Text>
					</View>
					<View style ={{flexDirection: 'column', alignSelf:'center', }}>
						<View style = {{width: responsiveWidth(88), alignSelf:'center',marginTop: 10}}>
							<View style = {{marginBottom: 10}}>
								<Text style = {{fontFamily:'Nunito-Bold', fontSize: responsiveFontSize(2.2), color: 'black'}}>First Name</Text>
							</View>
							<TextInput
			  					underlineColorAndroid='transparent'
			  					placeholder="First Name"
			  					defaultValue = {this.state.first_name}
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
			  					placeholder="Last Name"
			  					defaultValue = {this.state.last_name}
			  					placeholderTextColor = "grey"
			  					onChangeText={(name) => this.setState({last_name:name})}
					            style={{width:responsiveWidth(88),fontFamily: 'Nunito-Regular',height:responsiveHeight(6.5),borderRadius: 3,backgroundColor:'white',borderWidth: 0.7,borderColor:'#e2e2e2'}}
			  				/>
						</View>
						<View style = {{width: responsiveWidth(88), alignSelf:'center', marginTop: 10}}>
							<View style = {{marginBottom: 10}}>
								<Text style = {{fontFamily:'Nunito-Bold', fontSize: responsiveFontSize(2.2), color: 'black'}}>Address</Text>
							</View>
							<TextInput
			  					underlineColorAndroid='transparent'
			  					placeholder="Address"
			  					defaultValue = {this.state.address}
			  					placeholderTextColor = "grey"
			  					onChangeText={(name) => this.setState({address:name})}
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
			  					onChangeText={(name) => this.setState({city:name})}
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
			  					defaultValue = {this.state.province}
			  					placeholderTextColor = "grey"
			  					onChangeText={(name) => this.setState({province:name})}
					            style={{width:responsiveWidth(88),fontFamily: 'Nunito-Regular',height:responsiveHeight(6.5),borderRadius: 3,backgroundColor:'white',borderWidth: 0.7,borderColor:'#e2e2e2'}}
			  				/>
						</View>
						<View style = {{width: responsiveWidth(88), alignSelf:'center', marginTop: 10}}>
							<View style = {{marginBottom: 10}}>
								<Text style = {{fontFamily:'Nunito-Bold', fontSize: responsiveFontSize(2.2), color: 'black'}}>Country</Text>
							</View>
							<TextInput
			  					underlineColorAndroid='transparent'
			  					placeholder="Country"
			  					defaultValue = {this.state.country}
			  					placeholderTextColor = "grey"
			  					onChangeText={(name) => this.setState({country:name})}
					            style={{width:responsiveWidth(88),fontFamily: 'Nunito-Regular',height:responsiveHeight(6.5),borderRadius: 3,backgroundColor:'white',borderWidth: 0.7,borderColor:'#e2e2e2'}}
			  				/>
						</View>
						<View style = {{width: responsiveWidth(88), alignSelf:'center', marginTop: 10}}>
							<View style = {{marginBottom: 10}}>
								<Text style = {{fontFamily:'Nunito-Bold', fontSize: responsiveFontSize(2.2), color: 'black'}}>Pincode</Text>
							</View>
							<TextInput
			  					underlineColorAndroid='transparent'
			  					placeholder="Pincode"
			  					defaultValue = {this.state.zip}
			  					placeholderTextColor = "grey"
			  					onChangeText={(name) => this.setState({zip:name})}
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
			  					defaultValue = {this.state.phone}
			  					placeholderTextColor = "grey"
			  					onChangeText={(name) => this.setState({phone:name})}
					            style={{width:responsiveWidth(88),fontFamily: 'Nunito-Regular',height:responsiveHeight(6.5),borderRadius: 3,backgroundColor:'white',borderWidth: 0.7,borderColor:'#e2e2e2'}}
			  				/>
						</View>
						<View style = {{width: responsiveWidth(88), alignSelf:'center', marginTop: 15, marginBottom: 15}}>
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