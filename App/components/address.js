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
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Item from './item';
import NavigationHeader from './../utils/components/navigationHeader';
import Toast, {DURATION} from 'react-native-easy-toast';
import PopupDialog from 'react-native-popup-dialog';
import * as Progress from 'react-native-progress';

export default class Address extends Component{
	
	state = {
		cart_count : 0,
		customerData:'',
		dataSource: new ListView.DataSource({
				rowHasChanged: (row1, row2) => row1 !== row2,
			}),
	}

	componentDidMount(){
		this.popupDialog.show();
		BackHandler.addEventListener('hardwareBackbutton', this.handleBack.bind(this));
		this.getCustomer();
		this.getNumberCart();

	}

	componentWillUnmount(){
		BackHandler.removeEventListener('hardwareBackbutton');
	}

	handleBack(){
 		this.props.navigation.navigate('home');
 		return true;
 	}

	getCustomer(){
		AsyncStorage.getItem('Customer').then((value) => {
	      var tmp = JSON.parse(value);
	      if(tmp != null){
	        this.setState({
	          customerData: tmp,
	          customer: true
	        })
	      }else{
	        this.setState({          
	          customerData: '',
	          customer: false,
	        })
	      }
	    }).done(() => this.getAddress());
	}

	getAddress(){
		fetch(Url.main + '/address?shopnamefull='+Url.shopFullName+'&shopname='+ Url.shopName + '&customer_id='+ this.state.customerData.id, {
    		method : 'GET',
    		headers : {
    			'Accept': 'application/json',
      			'Content-Type': 'application/json'
    		}
    	}).then((response) => response.json())
    		.then((responseData) => {
   			this.popupDialog.dismiss();
  			
    		this.setState({
    			dataSource: this.state.dataSource.cloneWithRows(responseData),
    		})
    	}).done(() => {});
	}

	getNumberCart(){
		var tmpproduct = {};
		AsyncStorage.getItem("cart").then((value) => {
			if(value != null){
				tmpproduct = JSON.parse(value);
				var tmppro = Object.keys(tmpproduct).map(function(key) {
					return(tmpproduct[key])
				});
				this.setState({
					cart_count: tmppro.length,
					productArray: tmppro
				})
			}else{
				this.setState({
					cart_count: 0,
				})
			}
		}).done();
	}

	render(){
		return(
			<View style={{flex:1,}}>
				<View style = {{backgroundColor: '#232f3e', height: responsiveHeight(9), marginBottom: 10}}>
					<View style={{height: responsiveHeight(8),flexDirection: 'row',}}>
						<View style={{ width: responsiveWidth(15),alignItems:'center', justifyContent:'center'}}>
							<TouchableOpacity onPress={() => this.props.navigation.navigate('DrawerToggle')}>
								<Entypo name="menu" size={28} color="white"  />
							</TouchableOpacity>
						</View>
						<View style={{width: responsiveWidth(58), justifyContent: 'center'}}>
							<Text style = {{fontFamily:'Nunito-Bold', fontSize: responsiveFontSize(3), color: 'white'}} >Shopify App</Text>
						</View>
						<View style={{width:responsiveWidth(8),justifyContent:"center",alignItems:'center',}}>
							<TouchableOpacity onPress={() => {this.props.navigation.navigate('search')}}>
								<FontAwesome name="search" size={20} color="white" />
							</TouchableOpacity>
					    </View>
						<View style={{width:responsiveWidth(22),justifyContent:"center",alignItems:'center',}}>
							<TouchableOpacity onPress={() => {this.props.navigation.navigate('cart')}} style = {{alignItems: 'flex-start'}} >
								<MaterialCommunityIcons name = 'cart-outline' size = {25} color = 'white'/>
							</TouchableOpacity>
							<View style = {{height: responsiveHeight(2.5), width: responsiveWidth(5), backgroundColor: 'white', borderRadius: 10, position: 'absolute', left: 45, top: 10, alignItems:'center', justifyContent:'center'}}>
								<Text style = {{fontSize: responsiveFontSize(1.5), color:'#232f3e', fontFamily: 'Nunito-Bold'}}>{this.state.cart_count}</Text>
							</View>
				    	</View>
					</View>
				</View>
				<ListView
				    dataSource = {this.state.dataSource}
				    renderRow = {this.renderAddress.bind(this)}
				/>
				<TouchableOpacity onPress = {() => this.props.navigation.navigate('addaddress', {customerId: this.state.customerData.id})} style = {{height: responsiveHeight(8), backgroundColor:'#F1C65A', justifyContent:'center', alignItems:'center'}}>
					<Text style = {{fontFamily: 'Nunito-Bold', fontSize: responsiveFontSize(2.5), color: 'black'}}>Add New Address</Text>
				</TouchableOpacity>
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
				<Toast ref="toast"/>
			</View>
		);
	}
	//
	renderAddress(address){
		return(
			<View style ={{backgroundColor: "white", width: responsiveWidth(95), alignSelf:'center', marginBottom:10}} >
					<View style = {{height: responsiveHeight(6), width: responsiveWidth(90), alignSelf:"center", borderBottomWidth: 1, borderColor: '#e2e2e2', flexDirection: 'row'}}>
						<View style = {{width: responsiveWidth(75), justifyContent:'center'}}>
							{address.default == false && <TouchableOpacity onPress = {() => this.makeDefaultAddress(address)} style = {{justifyContent:'center', alignItems: 'center', height: responsiveHeight(4), width: responsiveWidth(25), backgroundColor: '#F1C65A', borderRadius: 3}}>
															<Text style = {{fontSize: responsiveFontSize(1.5), color: '#000', fontFamily: 'Nunito-Regular'}}>Make as default</Text>
														</TouchableOpacity>}
							{address.default == true && <Text style = {{fontFamily: 'Nunito-Bold', fontSize: responsiveFontSize(2), color: 'black'}}>Default Address</Text>}
						</View>
						{address.default == false && <View style = {{width: responsiveWidth(7.5), justifyContent:'center', alignItems: 'flex-end'}}>
													<TouchableOpacity onPress = {() => this.editAddress(address)}>
														<MaterialIcons name = "edit" size = {20} color = "black"/>
													</TouchableOpacity>
												</View>}
						{address.default == true && <View style = {{width: responsiveWidth(15), justifyContent:'center', alignItems: 'flex-end'}}>
													<TouchableOpacity onPress = {() => this.editAddress(address)}>
														<MaterialIcons name = "edit" size = {20} color = "black"/>
													</TouchableOpacity>
												</View>}
						{address.default == false && <View style = {{width: responsiveWidth(7.5), justifyContent:'center', alignItems: 'flex-end'}}>
													<TouchableOpacity onPress = {() => this.deleteAddress(address)}>
														<MaterialIcons name = "delete" size = {20} color = "black"/>
													</TouchableOpacity>
												</View>}
					</View>
					<View style = {{flexDirection: 'column', width: responsiveWidth(90), alignSelf:'center',}}>
						<View style = {{marginTop: 5}}>
							<Text style = {{fontSize: responsiveFontSize(1.7), color: '#000', fontFamily: 'Nunito-Bold'}}>{address.first_name} {address.last_name}</Text>
						</View>
						<View style = {{marginTop: 5}}>
							<Text style = {{fontSize: responsiveFontSize(1.7), color: '#000', fontFamily: 'Nunito-Regular'}}>{address.address1}</Text>
						</View>
						<View style = {{marginTop: 5}}>
							<Text style = {{fontSize: responsiveFontSize(1.7), color: '#000', fontFamily: 'Nunito-Regular'}}>{address.city}, {address.province}, {address.zip}</Text>
						</View>
						<View style = {{marginTop: 5, marginBottom: 5}}>
							<Text style = {{fontSize: responsiveFontSize(1.7), color: '#000', fontFamily: 'Nunito-Regular'}}>Mobile: {address.phone}</Text>
						</View>
					</View>
				</View>
		)
	}
	

	deleteAddress(address){
		this.popupDialog.show();
		fetch(Url.main + '/deleteAddress', {
    		method : 'POST',
    		headers : {
    			'Accept': 'application/json',
      			'Content-Type': 'application/json'
    		},
    		body : JSON.stringify({
				"shopFullName" : Url.shopFullName,
				"customer_id" : address.customer_id,
				"address_id": address.id
			})
    	}).then((response) => response.json())
    		.then((responseData) => {
    			if(responseData.code == 200){
    				this.popupDialog.dismiss();
    				this.refs.toast.show('Address deleted Successfully', 700);
    				AsyncStorage.removeItem('Customer');
    				AsyncStorage.setItem('Customer', JSON.stringify(responseData.result));
    				this.getCustomer();
    			}else{
    				this.popupDialog.dismiss();
    				Alert.alert('', "Network Problem!");
    			}
    	}).done();
	}

	editAddress(address){
		this.props.navigation.navigate('defaultaddressedit', {customer: {default_address: address, id: address.customer_id}, flag: 'address'})
	}

	makeDefaultAddress(address){
		this.popupDialog.show();
		fetch(Url.main + '/makeDefault', {
    		method : 'POST',
    		headers : {
    			'Accept': 'application/json',
      			'Content-Type': 'application/json'
    		},
    		body : JSON.stringify({
				"shopFullName" : Url.shopFullName,
				"customer_id" : address.customer_id,
				"address_id": address.id,
				"default": "true"
			})
    	}).then((response) => response.json())
    		.then((responseData) => {
    			if(responseData.code == 200){
    				this.popupDialog.dismiss();
    				this.refs.toast.show('Default Address Changed', 700);
    				AsyncStorage.removeItem('Customer');
    				AsyncStorage.setItem('Customer', JSON.stringify(responseData.result));
    				this.getCustomer();
    			}else{
    				this.popupDialog.dismiss();
    				Alert.alert('', "Network Problem!");
    			}
    	}).done();
	}
}