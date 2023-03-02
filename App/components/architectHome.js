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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { StackNavigator, navigation, DrawerNavigator } from 'react-navigation';
import PopupDialog from 'react-native-popup-dialog';
import * as Progress from 'react-native-progress';

var imageSlide = [];

export default class ArchitectHome extends Component{

	constructor(props) {
	        super(props);

	        this.state = {
	        	cart_count: 0,
	        	position: 1,
	            interval: null,
	            customerData:'',
	            customer: false,
	            bestSeller_id:'',
	        	dataSource: new ListView.DataSource({
					rowHasChanged: (row1, row2) => row1 !== row2,
				}),
				dataSource1: new ListView.DataSource({
					rowHasChanged: (row1, row2) => row1 !== row2,
				}),
	        };
	    }

    componentDidMount(){
    	this.popupDialog.show();
    	BackHandler.addEventListener('hardwareBackbutton', this.handleBack.bind(this));
    	this.setState({interval: setInterval(() => {
				 this.setState({position: this.state.position === 3 ? 0 : this.state.position + 1});
		 }, 2000)});

    	this.getNumberCart();
    	this.getCustomer();
    }

    componentWillUnmount(){
		BackHandler.removeEventListener('hardwareBackbutton');
	}

	handleBack(){
 		BackHandler.exitApp();
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
	        this.getCustomerDetails(tmp.id)
	      }else{
	        this.setState({
	          customerData: '',
	          customer: false,
	        })
          this.props.navigation.navigate('architectsignin')
	        //this.fetchcategories();
	      }
	    })
    }

    getCustomerDetails(id){
    	fetch(Url.domain + '/getArchitectDetails/'+ id, {
    		method : 'GET',
    		headers : {
    			'Accept': 'application/json',
      			'Content-Type': 'application/json'
    		}
    	}).then((response) => response.json())
    		.then((responseData) => {
          if(responseData.code === 200) {
            AsyncStorage.removeItem("Architect");
       			AsyncStorage.setItem("Architect", JSON.stringify(responseData.details));
            this.setState({
              customerData: responseData.details
            })
          }
    	}).done(() => {this.popupDialog.dismiss()});
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
				})
			}else{
				this.setState({
					cart_count: 0,
				})
			}
		}).done();
	}

	fetchBestSeller(){
		 fetch(Url.main + '/categorizedProduct?shopnamefull='+Url.shopFullName+ '&shopname='+ Url.shopName + '&collec_id='+ this.state.bestSeller_id, {
     		method : 'GET',
     		headers : {
     			'Accept': 'application/json',
       			'Content-Type': 'application/json'
     		}
     	}).then((response) => response.json())
     		.then((responseData) => {
     			this.setState({
     				 dataSource1: this.state.dataSource1.cloneWithRows(responseData),
    		})
     	}).done(() => this.popupDialog.dismiss());
	}


    fetchcategories(){
    	//alert(Url);
    	fetch(Url.main + '/categories?pageno='+1+'&shopnamefull='+Url.shopFullName+ '&shopname='+ Url.shopName, {
    		method : 'GET',
    		headers : {
    			'Accept': 'application/json',
      			'Content-Type': 'application/json'
    		}
    	}).then((response) => response.json())
    		.then((responseData) => {
    			this.setState({
    				dataSource: this.state.dataSource.cloneWithRows(responseData),
    		})
    		var tmp_best;
    		responseData.map(function (best) {
    			if(best.title == 'Best Sellers'){
    				//alert(JSON.stringify(best.id))
    				 tmp_best = best.id;
    			}
    		})
    		this.setState({
    					bestSeller_id: tmp_best
    				})
			Array.prototype.clean = function(deleteValue) {
				for (var i = 0; i < this.length; i++) {
					if (this[i] == deleteValue) {
							this.splice(i, 1);
							i--;
						}
					}
				return this;
			};
    		imageSlide = responseData.map(function (image) {
    			if(image.image != null){
    				return (image.image.src);
    			}
    		})
    		imageSlide.clean(undefined);
    		//alert(imageSlide)
    	}).done(() => {this.fetchBestSeller()});
    }

	render(){
		return(
			<View style = {{}} >
				<View style = {{backgroundColor: '#232f3e', height: responsiveHeight(8.5)}}>
						<View style={{height: responsiveHeight(8),flexDirection: 'row',}}>
								<View style={{ width: responsiveWidth(15),alignItems:'center', justifyContent:'center'}}>
									<TouchableOpacity onPress={() => this.props.navigation.navigate('DrawerToggle')}>
										<Entypo name="menu" size={28} color="white"  />
									</TouchableOpacity>
								</View>
								<View style={{width: responsiveWidth(66), justifyContent: 'center'}}>
									<Text style = {{fontFamily:'Nunito-Bold', fontSize: responsiveFontSize(3), color: 'white'}} >The Home</Text>
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
				<ScrollView>
					<View style = {{height: responsiveHeight(100)}}>
					   <View style={{}}>

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

	renderBestSeller(best){
		return(
			<TouchableOpacity onPress = {() => this.props.navigation.navigate('viewProduct', {product: best, flag: 'home'})}>
				<View style = {{width: responsiveWidth(35), backgroundColor: 'white', height: responsiveHeight(26), marginLeft: 10}}>
					<View style = {{height: responsiveHeight(17), alignItems: 'center', marginTop: 5}}>
						<Image source = {{uri: best.image.src}} style = {{height: responsiveHeight(17), width: responsiveWidth(33)}} />
					</View>
					<View style = {{height: responsiveHeight(3), marginTop: 5, alignItems:'center'}}>
						<Text numberOfLines = {1} style = {{fontSize: responsiveFontSize(1.7), fontFamily: 'Nunito-Bold', color: 'black', }}>{best.title}</Text>
					</View>
					<View style = {{height: responsiveHeight(3), marginTop: 5, alignItems:'center'}}>
						<Text style = {{fontSize: responsiveFontSize(1.7), fontFamily: 'Nunito-Bold', color: 'black',}}>$ {best.variants[0].price}</Text>
					</View>
				</View>
			</TouchableOpacity>
		);
	}


	renderCategories(cat){
		return(
			<TouchableOpacity onPress = {() => this.props.navigation.navigate('categorizedProduct', {collection_id : cat.id})}>
				<View style = {{width:responsiveWidth(30),height:responsiveHeight(5),alignItems:'center',justifyContent:'center'}}>
					<Text allowFontScaling = {false} numberOfLines = {1} style={{color:'white', fontSize : responsiveFontSize(1.9), fontFamily: 'Nunito-Bold'}}>{(cat.title).toUpperCase()}</Text>
				</View>
			</TouchableOpacity>
		);
	}
}
