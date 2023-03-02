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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import PopupDialog from 'react-native-popup-dialog';
import * as Progress from 'react-native-progress';

export default class Search extends Component{

	constructor(props){
			super(props);
			this.data = [];
			this.cartDictionary = [];
			AsyncStorage.setItem("Architect_cart", {});
			this.state = {
				cart_count:0,
				dataSource: new ListView.DataSource({
			        rowHasChanged: (row1, row2) => true,
			    }),
	      		page: 1,
				limit: 100,
				isOnline: true,
				isLoading: false,
				finish: false,
				showLoader: true,
				myCount:6,
	      		search:'',
	      		var_id:0,
	      		variant_id:''
			};
			prod;
		}

	renderLoader() {
			if(this.state.myCount == 6){
						if(this.state.page == 1){
								return(
						      this.state.showLoader?<View style={{justifyContent: 'center',alignItems:'center'}}><Progress.CircleSnail color={['red', 'green', 'blue']} style = {{marginLeft:165,marginTop:200}} /></View>:null
						    );
						}else{
						    return(
						      this.state.showLoader?<View style={{justifyContent: 'center',alignItems:'center'}}><Progress.CircleSnail color={['red', 'green', 'blue']} style = {{marginLeft:165}} /></View>:null
						    );
					}
		}
	}

	componentDidMount(){
		BackHandler.addEventListener('hardwareBackbutton', this.handleBack.bind(this));
		this.getNumberCart();
	}

	componentWillUnmount(){
		BackHandler.removeEventListener('hardwareBackbutton');
	}

	handleBack(){
		if(this.props.navigation.state.params.screen=='cat'){
			this.props.navigation.navigate('categories');
 			return true;
		}else{
	 		this.props.navigation.navigate('categorizedProducts',{collection_id:this.props.navigation.state.params.collection_id});
	 		return true;
 		}
 	}

 	getNumberCart(){
		var tmpproduct = {};
		AsyncStorage.getItem("Architect_cart").then((value) => {
			if(value != null)
			{
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

	getDataSource(products) {
   		return this.state.dataSource.cloneWithRows(products);
 	}

 	change(text){
      this.setState({
        search: text
      })
      this.search(text);
    }

    search(key){
      var searchprod = this.searchStringInArray(key, prod);
      // /alert(JSON.stringify(searchprod));
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(searchprod)
      })
    }

    searchStringInArray (str, strArray) {
      const regex = new RegExp(`${str.trim()}`, 'i');
      var result = strArray.filter(product => product.title.search(regex) >= 0);
      //alert(result[0].title);
      return result;
    }

	searchProduct(key){
    	this.popupDialog.show();
    	fetch(Url.main + '/search?page='+this.pageno+'&shopnamefull='+Url.shopFullName+ '&shopname='+ Url.shopName+ '&searchkey='+key, {
    		method : 'GET',
    		headers : {
    			'Accept': 'application/json',
      			'Content-Type': 'application/json'
    		}
    	}).then((response) => response.json())
    		.then((responseData) => {
    			this.setState({
    				finish: responseData.length < this.state.limit,
    				dataSource: this.getDataSource(responseData),
    		})
			
    	}).done(() => this.popupDialog.dismiss());
    }

	render(){
		return(
				<View style={{flex:1,}}>
					<View style = {{backgroundColor: '#232f3e', height: responsiveHeight(18)}}>
						<View style={{height: responsiveHeight(8),flexDirection: 'row',}}>
								<View style={{ width: responsiveWidth(15),alignItems:'center', justifyContent:'center'}}>
									<TouchableOpacity onPress={() => this.props.navigation.goBack()}>
										<MaterialCommunityIcons name="keyboard-backspace" size={28} color="white"  />
									</TouchableOpacity>
								</View>
								<View style={{width: responsiveWidth(58), justifyContent: 'center'}}>
									<Text style = {{fontFamily:'Nunito-Bold', fontSize: responsiveFontSize(3), color: 'white'}} >{Url.title}</Text>
								</View>
								<View style={{width:responsiveWidth(22),justifyContent:"center",alignItems:'flex-end',}}>
									<TouchableOpacity onPress={() => {}} style = {{alignItems: 'flex-end'}} >
										<MaterialCommunityIcons name = 'cart-outline' size = {25} color = 'white'/>
									</TouchableOpacity>
									<View style = {{height: responsiveHeight(2.5), width: responsiveWidth(5), backgroundColor: 'white', borderRadius: 10, position: 'absolute', left: 75, top: 10, alignItems:'center', justifyContent:'center'}}>
										<Text style = {{fontSize: responsiveFontSize(1.5), color:'#232f3e', fontFamily: 'Nunito-Bold'}}>{this.state.cart_count}</Text>
									</View>
							    </View>
						</View>
						<View style={{marginTop:5, flexDirection: 'column',alignItems:'center'}}>
							<TextInput
		  					 underlineColorAndroid='transparent'
		  					 placeholder="Search"
		  					 placeholderTextColor = "grey"
		  					 style={{backgroundColor:'white',width:responsiveWidth(96),height:responsiveHeight(7),justifyContent:'center',alignItems:'center',paddingLeft:45,paddingBottom:5.8,marginBottom: 10,borderRadius: 5,borderColor:'orange',borderWidth:2,}}
		  					 onChangeText={(search) => this.change(search)}
				             onSubmitEditing ={() => this.search(this.state.search)}
				             onEndEditing={() => this.search(this.state.search)}
				             onFocus ={() => this.clearData()}
				  			/>
				  			<FontAwesome name="search" size = {22} color = 'orange' style = {{ position: 'absolute',left: 21,top: 10}}/>
				  			
						</View>
					</View>
					<ListView
					    dataSource = {this.state.dataSource}
					    renderRow = {this.renderProduct.bind(this)}
						contentContainerStyle = {{flexDirection: 'row',flexWrap: 'wrap', marginBottom: 10}}
					/>
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

	clearData(){
	    this.setState({
	      dataSource: this.state.dataSource.cloneWithRows({}),
				finish: false,
	    })
  	}

  	onEndReached() {
		this.fetchData();
	}

  renderLoadingView() {
		return (
			<View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
				<Progress.CircleSnail color={['red', 'green', 'blue']} />
			</View>
		);
	}
  	renderProduct(product){
		var compare = true;
		if(product.variants[0].compare_at_price==null){
			compare=false;
		}else{
			var discount = product.variants[0].compare_at_price - product.variants[0].price;
			var discountPer = Math.round((discount/product.variants[0].compare_at_price)* 100);
		}
		return(
			<View style = {{height: responsiveHeight(44), width: responsiveWidth(45.8), borderRightWidth: 1, borderColor: '#e2e2e2', marginTop: 10, borderBottomWidth: 1, backgroundColor: 'white', marginLeft: 10, flexDirection: 'column'}}>
				<View style = {{height: responsiveHeight(25), alignItems: 'center'}}>
					<Image source = {{uri: product.images[0].src}} style = {{height: responsiveHeight(25), width: responsiveWidth(45)}} />
				</View>
				<View style={{flexDirection:'row'}}>
					<View style = {{width:responsiveWidth(20),height: responsiveHeight(5), alignItems:'flex-start', marginTop: 10}}>
						<Text style = {{fontSize: responsiveFontSize(2), color: '#b12704', fontFamily: 'Nunito-Bold', paddingLeft: 10}} >$ {product.variants[0].price}</Text>
					</View>
					{compare &&
						<View style = {{flexDirection: 'row'}}>
							<View style = {{width:responsiveWidth(15),height: responsiveHeight(3), alignSelf:'center',justifyContent:'center',}}>
								<Text numberOfLines = {1} style = {{fontSize: responsiveFontSize(2), color: 'grey', fontFamily: 'Nunito-Light',textDecorationLine:'line-through'}} >$ {product.variants[0].compare_at_price}</Text>
							</View>
							<View style = {{backgroundColor: "#F1C65A", borderRadius: 5, height: responsiveHeight(3), width: responsiveWidth(8), alignSelf: 'center', alignItems: 'center', justifyContent:'center'}} >
								<Text numberOfLines = {1} style = {{fontSize: responsiveFontSize(1.6), color: '#b12704', fontFamily: 'Nunito-Bold'}}>{discountPer}%</Text>
							</View>
						</View>
					}
				</View>
				<View style = {{height: responsiveHeight(5), width: responsiveWidth(40), alignItems:'flex-start', alignSelf: 'center'}}>
					<Text numberOfLines = {1} style = {{fontSize: responsiveFontSize(2), color: 'black', fontFamily: 'Nunito-Regular'}} >{product.title}</Text>
				</View>
				<View style = {{height: responsiveHeight(6), alignItems: 'center'}}>
					<TouchableOpacity onPress={() => this.addToCart(product)} style = {{height: responsiveHeight(5), borderRadius: 3, borderWidth: 1, alignItems: 'center', justifyContent:'center', borderColor:'#e2e2e2', width: responsiveWidth(40), backgroundColor:'#F1C65A'}} >
						<Text style = {{fontSize: responsiveFontSize(2), color:'black', fontFamily:'Nunito-Regular'}} >Add to Cart</Text>
					</TouchableOpacity>
				</View>
			</View>
		);
	}

	addToCart(products){
		console.log("Add to cart called");
		var product = new Item();
		product.node = products;
		product.variant_id = products.variants[this.state.var_id].id;
		product.var_id = this.state.var_id;
		console.log(product);
		var tmpCartDictionary ={};
		var tmpCartDictionaryImmutable = {}
		AsyncStorage.getItem("cart").then((value) => {
			if(value != null)
			{
				tmpCartDictionary = JSON.parse(value);
			}
				if(tmpCartDictionary!=null && tmpCartDictionary[product.variant_id])
				{
					console.log("temp dict had data");
					var tmpQuantity = tmpCartDictionary[product.quantity];
					console.log("tmp quantity:- "+ tmpQuantity);
					product.quantity = tmpQuantity + 1;
					tmpCartDictionary[product.variant_id] = product;
					AsyncStorage.mergeItem("cart", JSON.stringify(tmpCartDictionary));
				}else {
					if(tmpCartDictionary ==null)
					{
							tmpCartDictionary = {};
					}

					console.log("temp dict didn't had data");
					product.quantity = 1;
					tmpCartDictionary[product.variant_id] = product;
					AsyncStorage.setItem("cart",JSON.stringify(tmpCartDictionary));
			}
 		}).done(() => this.getNumberCart());
	 console.log("After set item to cart:- " +JSON.stringify(tmpCartDictionary));
			console.log("After set item to cart:- " + JSON.stringify(tmpCartDictionary));

	}
}