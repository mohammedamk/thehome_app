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
//import Url from './../utils/Api';
import Entypo from 'react-native-vector-icons/Entypo';
import Zocial from 'react-native-vector-icons/Zocial';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default class NavigationHeader extends Component{
	
	state = {
		cart_count:0,
	}

	componentDidMount(){
		// BackHandler.addEventListener('hardwareBackbutton', this.handleBack.bind(this));
		// this.fetchProducts(this.props.navigation.state.params.collection_id)
		this.getNumberCart();
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
			<View style = {{backgroundColor: '#232f3e', height: responsiveHeight(9)}}>
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
		);
	}
}