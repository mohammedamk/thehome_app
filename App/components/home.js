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

export default class Home extends Component{

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
 		BackAndroid.exitApp();
 		return true;
 	}

    getCustomer(){
    	AsyncStorage.getItem('Customer').then((value) => {
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
	        this.fetchcategories();
	      }
	    })
    }

    getCustomerDetails(id){
    	fetch(Url.main + '/getCustomerById?shopnamefull='+Url.shopFullName+'&shopname='+ Url.shopName + '&customer_id='+ id, {
    		method : 'GET',
    		headers : {
    			'Accept': 'application/json',
      			'Content-Type': 'application/json'
    		}
    	}).then((response) => response.json())
    		.then((responseData) => {
    		AsyncStorage.removeItem("Customer");
   			AsyncStorage.setItem("Customer", JSON.stringify(responseData[0]));
    	}).done(() => {this.fetchcategories(); this.fetchBestSeller();});
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
				<View style = {{backgroundColor: '#232f3e', height: responsiveHeight(18)}}>
						<View style={{height: responsiveHeight(8),flexDirection: 'row',}}>
								<View style={{ width: responsiveWidth(15),alignItems:'center', justifyContent:'center'}}>
									<TouchableOpacity onPress={() => this.props.navigation.navigate('DrawerToggle')}>
										<Entypo name="menu" size={28} color="white"  />
									</TouchableOpacity>
								</View>
								<View style={{width: responsiveWidth(66), justifyContent: 'center'}}>
									<Text style = {{fontFamily:'Nunito-Bold', fontSize: responsiveFontSize(3), color: 'white'}} >Shopify App</Text>
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
						<View style={{height: responsiveHeight(10),flexDirection: 'row',marginLeft:10,marginTop:10}}>
							<View style={{ width: responsiveWidth(30),alignItems:'center'}}>
								<TouchableWithoutFeedback onPress = {() =>this.props.navigation.navigate('categories') }>
						            <View style={{width:responsiveWidth(30),height:responsiveHeight(6.5),paddingLeft:10,backgroundColor:"white",borderRadius:3,}}>
						              <Text style = {{fontFamily: 'Nunito-Regular'}}>Shop by</Text>
						              <Text style={{color:'black', fontFamily: 'Nunito-Bold'}}>Category</Text>
						            </View>
					          </TouchableWithoutFeedback>
							</View>
							<View style={{width:responsiveWidth(5)}}>
							</View>
							<TouchableWithoutFeedback onPress = {() => this.props.navigation.navigate('search')}>
								<View style={{width:responsiveWidth(65),flexDirection: 'column'}}>
									<TextInput
				  					 underlineColorAndroid='transparent'
				  					 placeholder="Search"
				  					 placeholderTextColor = "grey"
				  					 editable = {false}
						             style={{width:responsiveWidth(60), fontFamily: 'Nunito-Regular',height:responsiveHeight(6.5),borderRadius: 3,backgroundColor:'white',paddingLeft:25,paddingRight:20,alignItems:'center',justifyContent:'center'}}
				  					/>
				  					<EvilIcons name = "search" size = {25} color ="grey" style={{position: 'absolute',top: 8}}/>
								</View>
							</TouchableWithoutFeedback>
						</View>
				</View>
				<ScrollView>
					<View style = {{height: responsiveHeight(100)}}>
					    <View style={{height:responsiveHeight(6.5),backgroundColor: '#232f3e',flexDirection: 'column'}}>
					    	<ScrollView horizontal= {true}>
						    	<ListView
								    dataSource = {this.state.dataSource}
								    renderRow = {this.renderCategories.bind(this)}
									contentContainerStyle = {{flexDirection: 'row'}}
								/>
							</ScrollView>
					    </View>
					    {this.state.customer && <TouchableOpacity onPress = {() => this.props.navigation.navigate('account')}>
					    						    <View style = {{height: responsiveHeight(6), backgroundColor: 'white', flexDirection: 'row', alignItems: 'center'}} >
					    						    	<View style = {{width: responsiveWidth(65)}}>
					    						    		<Text style = {{fontSize: responsiveFontSize(2), color: 'black', paddingLeft: 10, fontFamily: 'Nunito-Regular'}} > Hello, {this.state.customerData.first_name} {this.state.customerData.last_name}</Text>
					    						    	</View>
					    						    	<View style = {{flexDirection: 'row', alignItems: 'center'}} >
					    						    		<Text style ={{fontSize: responsiveFontSize(2), color: 'black', paddingLeft: 10, fontFamily: 'Nunito-Regular'}}>Your Account</Text>
					    						    		<Ionicons name = 'ios-arrow-forward-outline' size = {18} color = 'grey' style = {{paddingLeft: 10, alignSelf: 'center'}}/>
					    						    	</View>
					    						    </View>
					    					    </TouchableOpacity>
					    }
					    <View style = {{height: responsiveHeight(30)}}>
							<ImageSlider
								images = {imageSlide}
								position={this.state.position}
	              				onPositionChanged={position => this.setState({position})}
								style = {{height: responsiveHeight(30), backgroundColor: 'transparent'}}
							/>
						</View>
						<View style = {{marginTop: 10, marginBottom: 10,width: responsiveWidth(95), alignSelf:'center', flexDirection:'row', justifyContent: 'center'}}>
							<Text style = {{fontSize: responsiveFontSize(3.2), color: '#000', fontFamily: 'Nunito-Bold'}}>Best Sellers</Text>
						</View>
						<View style = {{backgroundColor: 'white', height: responsiveHeight(30), justifyContent: 'center',  marginBottom: 10}}>
							<ScrollView horizontal= {true} showsHorizontalScrollIndicator = {false}>
								<ListView
								    dataSource = {this.state.dataSource1}
								    renderRow = {this.renderBestSeller.bind(this)}
									contentContainerStyle = {{flexDirection: 'row'}}
								/>
							</ScrollView>
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