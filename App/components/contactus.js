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
	WebView
} from 'react-native';

import { responsiveHeight, responsiveWidth, responsiveFontSize} from 'react-native-responsive-dimensions';
import Url from './../utils/Api';
import Entypo from 'react-native-vector-icons/Entypo';
import Zocial from 'react-native-vector-icons/Zocial';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Foundation from 'react-native-vector-icons/Foundation';
import Item from './item';
import Toast, {DURATION} from 'react-native-easy-toast';
import NavigationHeader from './../utils/components/navigationHeader';
import PopupDialog from 'react-native-popup-dialog';
import * as Progress from 'react-native-progress';
import StatusBarPaddingIOS from 'react-native-ios-status-bar-padding'

export default class Contactus extends Component{


	componentDidMount(){
		BackHandler.addEventListener('hardwareBackbutton', this.handleBack.bind(this));
	}

	componentWillUnmount(){
		BackHandler.removeEventListener('hardwareBackbutton');
	}

	handleBack(){
 		this.props.navigation.goBack();
 		return true;
 	}

	render(){
		return(
			<View style={{flex:1,}}>
				<StatusBarPaddingIOS/>
				<View style = {{backgroundColor: '#232f3e', height: responsiveHeight(9)}}>
					<View style={{height: responsiveHeight(8),flexDirection: 'row',}}>
						<View style={{ width: responsiveWidth(15),alignItems:'center', justifyContent:'center'}}>
							<TouchableOpacity onPress={() => this.props.navigation.navigate('DrawerToggle')}>
								<Entypo name="menu" size={28} color="white"  />
							</TouchableOpacity>
						</View>
						<View style={{ width: Platform.OS === 'ios' ? responsiveWidth(56) : responsiveWidth(66), justifyContent: 'center'}}>
							<Text style = {{fontFamily:'Nunito-Bold', fontSize: responsiveFontSize(3), color: 'white'}} >{Url.title}</Text>
						</View>
					</View>
				</View>
				<View style={{height:responsiveHeight(10),width: responsiveWidth(90), justifyContent: 'center',alignItems:'center'}}>
					<Text style = {{fontFamily:'Nunito-Bold', fontSize: responsiveFontSize(2.5), color: 'Black'}} >CONTACT US</Text>
				</View>
				<View style={{height:responsiveHeight(50),width:responsiveWidth(100),justifyContent:'center'}}>
						<View style={{flexDirection:'row',height:responsiveHeight(12),width:responsiveWidth(85),alignSelf:'center',marginTop:20}}>
							<View style={{width:responsiveWidth(10)}}>
								<Entypo name="location-pin" size={28} color="black"  />
							</View>
							<View style={{width:responsiveWidth(80)}}>
								<Text style = {{fontFamily:'Nunito-Regular', fontSize: responsiveFontSize(2.3), color: 'black',justifyContent:'center',alignItems:'center'}} >Visit our Store
									48 Hill Road, Between
									Ravinagar to Ramnagar Sq.
									Gokulpeth, Nagpur
									Maharashtra 440010
								</Text>
							</View>
						</View>
						<View style={{flexDirection:'row',height:responsiveHeight(8),width:responsiveWidth(85),alignSelf:'center',marginTop:20}}>
							<View style={{width:responsiveWidth(10)}}>
								<Entypo name="mail" size={28} color="black"  />
							</View>
							<View style={{width:responsiveWidth(80)}}>
								<Text style = {{fontFamily:'Nunito-Regular', fontSize: responsiveFontSize(2.3), color: 'black',justifyContent:'center',alignItems:'center'}} >Visit our Store
									customercare@thehomeindia.com
								</Text>
							</View>
						</View>
						<View style={{flexDirection:'row',height:responsiveHeight(8),width:responsiveWidth(85),alignSelf:'center',marginTop:20}}>
							<View style={{width:responsiveWidth(10)}}>
								<Foundation name="telephone" size={28} color="black"  />
							</View>
							<View style={{width:responsiveWidth(80)}}>
								<Text style = {{fontFamily:'Nunito-Regular', fontSize: responsiveFontSize(2.3), color: 'black',justifyContent:'center',alignItems:'center'}} >
									07122531119
								</Text>
							</View>
						</View>
						<View style={{flexDirection:'row',height:responsiveHeight(8),width:responsiveWidth(85),alignSelf:'center',marginTop:20}}>
							<View style={{width:responsiveWidth(10)}}>
								<FontAwesome name="whatsapp" size={28} color="black"  />
							</View>
							<View style={{width:responsiveWidth(80)}}>
								<Text style = {{fontFamily:'Nunito-Regular', fontSize: responsiveFontSize(2.3), color: 'black',justifyContent:'center',alignItems:'center'}} >
									8411977867
								</Text>
							</View>
						</View>
					</View>
			</View>
		);
	}
}
