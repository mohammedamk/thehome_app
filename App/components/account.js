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
	BackHandler
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

export default class Account extends Component{
	
	state = {
		cart_count : 0,
		customerData:'',
		default_address: {name: '', email: '', mobile: '', city: '', state: ''}
	}

	componentDidMount(){
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
		AsyncStorage.getItem('Architect').then((value) => {
	      var tmp = JSON.parse(value);
	      if(tmp != null){
	      		this.setState({
					customerData: tmp,
					customer: true,
				})

	      }else{
	        this.setState({          
	          customerData: '',
	          customer: false,
	        })
	      }
	    }).done();
	}

	getNumberCart(){
		var tmpproduct = {};
		AsyncStorage.getItem("Architect_cart").then((value) => {
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
				<StatusBarPaddingIOS/>
				<View style = {{backgroundColor: '#232f3e', height: responsiveHeight(9), marginBottom: 5}}>
					<View style={{height: responsiveHeight(8),flexDirection: 'row',}}>
					{Platform.OS === 'ios' && <View style={{ width: responsiveWidth(10), alignItems: 'center', justifyContent: 'center' }}>
							<TouchableOpacity onPress={() => this.props.navigation.navigate('categories')}>
								<Entypo name="chevron-small-left" size={28} color="white" />
							</TouchableOpacity>
						</View>}
						<View style={{ width: responsiveWidth(15),alignItems:'center', justifyContent:'center'}}>
							<TouchableOpacity onPress={() => this.props.navigation.navigate('DrawerToggle')}>
								<Entypo name="menu" size={28} color="white"  />
							</TouchableOpacity>
						</View>
						<View style={{width: Platform.OS === 'ios' ? responsiveWidth(56) : responsiveWidth(66), justifyContent: 'center'}}>
							<Text style = {{fontFamily:'Nunito-Bold', fontSize: responsiveFontSize(3), color: 'white'}} >{Url.title}</Text>
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
				<View style = {{marginTop: 10, marginBottom: 10,width: responsiveWidth(95), alignSelf:'center', flexDirection:'row'}}>
					<View style = {{width: responsiveWidth(90)}}>
						<Text style = {{fontSize: responsiveFontSize(2.5), color: '#000', fontFamily: 'Nunito-Bold'}}>Basic Details</Text>
					</View>
					<TouchableOpacity onPress = {() => this.props.navigation.navigate('basicdetailedit', {customer: this.state.customerData})}>
						<View style = {{alignSelf: "flex-end", justifyContent:'flex-end'}}>
							<FontAwesome name = "pencil-square-o" color = "black" size = {20}/>
						</View>
					</TouchableOpacity>
				</View>
				<View style ={{backgroundColor: "white", width: responsiveWidth(95), alignSelf:'center', marginBottom:10}} >
					<View style = {{flexDirection: 'column', width: responsiveWidth(90), alignSelf:'center',}}>
						<View style = {{marginTop: 5, flexDirection: 'row'}}>
							<View style = {{width: responsiveWidth(15)}}>
								<Text style = {{fontSize: responsiveFontSize(1.7), color: '#000', fontFamily: 'Nunito-Bold'}}>Name : </Text>
							</View>
							<View style = {{}}>
								<Text style = {{fontSize: responsiveFontSize(1.7), color: '#000', fontFamily: 'Nunito-Regular'}}>{this.state.customerData.name}</Text>
							</View>
						</View>
						<View style = {{marginTop: 5, flexDirection: 'row'}}>
							<View style = {{width: responsiveWidth(15)}}>
								<Text style = {{fontSize: responsiveFontSize(1.7), color: '#000', fontFamily: 'Nunito-Bold'}}>Email : </Text>
							</View>
							<View style = {{}}>
								<Text style = {{fontSize: responsiveFontSize(1.7), color: '#000', fontFamily: 'Nunito-Regular'}}>{this.state.customerData.email}</Text>
							</View>
						</View>
						<View style = {{marginTop: 5, flexDirection: 'row', marginBottom: 5}}>
							<View style = {{width: responsiveWidth(15)}}>
								<Text style = {{fontSize: responsiveFontSize(1.7), color: '#000', fontFamily: 'Nunito-Bold'}}>phone : </Text>
							</View>
							<View style = {{}}>
								<Text style = {{fontSize: responsiveFontSize(1.7), color: '#000', fontFamily: 'Nunito-Regular'}}>{this.state.customerData.mobile}</Text>
							</View>
						</View>
						<View style = {{marginTop: 5, flexDirection: 'row', marginBottom: 5}}>
							<View style = {{width: responsiveWidth(15)}}>
								<Text style = {{fontSize: responsiveFontSize(1.7), color: '#000', fontFamily: 'Nunito-Bold'}}>city : </Text>
							</View>
							<View style = {{}}>
								<Text style = {{fontSize: responsiveFontSize(1.7), color: '#000', fontFamily: 'Nunito-Regular'}}>{this.state.customerData.city}</Text>
							</View>
						</View>
						<View style = {{marginTop: 5, flexDirection: 'row', marginBottom: 5}}>
							<View style = {{width: responsiveWidth(15)}}>
								<Text style = {{fontSize: responsiveFontSize(1.7), color: '#000', fontFamily: 'Nunito-Bold'}}>state : </Text>
							</View>
							<View style = {{}}>
								<Text style = {{fontSize: responsiveFontSize(1.7), color: '#000', fontFamily: 'Nunito-Regular'}}>{this.state.customerData.state}</Text>
							</View>
						</View>
					</View>
				</View>
				{this.state.customerData.default_address != null && <View style = {{marginTop: 10, marginBottom: 10,width: responsiveWidth(95), alignSelf:'center', flexDirection:'row'}}>
									<View style = {{width: responsiveWidth(90)}}>
										<Text style = {{fontSize: responsiveFontSize(2.5), color: '#000', fontFamily: 'Nunito-Bold'}}>Address</Text>
									</View>
									<TouchableOpacity onPress = {() => this.props.navigation.navigate('defaultaddressedit', {customer: this.state.customerData, flag: 'account'})}>
										<View style = {{alignSelf: "flex-end", justifyContent:'flex-end'}}>
											<FontAwesome name = "pencil-square-o" color = "black" size = {20}/>
										</View>
									</TouchableOpacity>
								</View>}
				{this.state.customerData.default_address != null && <View style ={{backgroundColor: "white", width: responsiveWidth(95), alignSelf:'center', marginBottom:10}} >
					<View style = {{flexDirection: 'column', width: responsiveWidth(90), alignSelf:'center',}}>
						<View style = {{marginTop: 5}}>
							<Text style = {{fontSize: responsiveFontSize(1.7), color: '#000', fontFamily: 'Nunito-Bold'}}>{this.state.default_address.first_name} {this.state.default_address.last_name}</Text>
						</View>
						<View style = {{marginTop: 5}}>
							<Text style = {{fontSize: responsiveFontSize(1.7), color: '#000', fontFamily: 'Nunito-Regular'}}>{this.state.default_address.address1}, {this.state.default_address.city}</Text>
						</View>
						<View style = {{marginTop: 5}}>
							<Text style = {{fontSize: responsiveFontSize(1.7), color: '#000', fontFamily: 'Nunito-Regular'}}>{this.state.default_address.city}, {this.state.default_address.state}, {this.state.default_address.pincode}</Text>
						</View>
						<View style = {{marginTop: 5, marginBottom: 5}}>
							<Text style = {{fontSize: responsiveFontSize(1.7), color: '#000', fontFamily: 'Nunito-Regular'}}>Mobile: {this.state.default_address.phone}</Text>
						</View>
					</View>
				</View>}
			</View>
		);
	}
}