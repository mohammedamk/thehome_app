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
	WebView,
	BackHandler
} from 'react-native';

import { responsiveHeight, responsiveWidth, responsiveFontSize} from 'react-native-responsive-dimensions';
import Url from './../utils/Api';
import ImageSlider from 'react-native-image-slider';
import Entypo from 'react-native-vector-icons/Entypo';
import Zocial from 'react-native-vector-icons/Zocial';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import NavigationHeader from './../utils/components/navigationHeader';
import ReadMore from 'react-native-read-more-text';
import Toast, {DURATION} from 'react-native-easy-toast';
import Item from './item';
import ModalDropdown from 'react-native-modal-dropdown';
import StatusBarPaddingIOS from 'react-native-ios-status-bar-padding'

let variant = [];
let product_discount;
let dis_type;
export default class ViewProduct extends Component{

	constructor(props) {
    super(props);
		this.state = {
			sliImage:['',''],
			title:'',
			price:0,
			compareprice:0,
			position: 1,
			quantity:1,
			amountChange:0,
			description:'',
			variant_id:'',
			var_id: 0,
			qntyOption:'',
			leftQuantity:'',
			addQuantity: 1,
		}
  }

	componentDidMount(){
		variant = [];
		var amount = this.props.navigation.state.params.product.productDetails.price;
		BackHandler.addEventListener('hardwareBackbutton', this.handleBack.bind(this));
		//alert(JSON.stringify(this.props.navigation.state.params.flag.collection_id))
		var product = this.props.navigation.state.params.product;
		var qnty=[];
		for(var i = 1; i <= product.productDetails.variants[0].inventory_quantity; i++){
			qnty.push(i);
		}
		this.setState({
			qntyOption: qnty
		})
		if(product.productDetails.variants.length > 1){
			product.productDetails.variants.map(function (pro) {
				variant.push(pro.title);
			})
		}

		if(product.productDiscount != null){
			if(product.productDiscount.type == 'fixed_amount'){
				 product_discount = product.productDiscount.value;
				 dis_type = (product.productDiscount.type).toString().charAt(0).toUpperCase() + (product.productDiscount.type).substr(1);
			}else if(product.productDiscount.type == 'percentage'){
				var dis_per = product.productDiscount.value;
				dis_type = (product.productDiscount.type).toString().charAt(0).toUpperCase() + (product.productDiscount.type).substr(1);
				product_discount = ((this.props.navigation.state.params.product.productDetails.variants[0].price * parseFloat(dis_per))/100).toFixed(2);
				//alert(product_discount);
			}else{

				 dis_type = "no_discount";
				 //alert(dis_type);
				 product_discount = 0;
			}
		}else{
			dis_type = "no_discount";
			//alert(dis_type);
			product_discount = 0;
		}

		//alert(JSON.stringify(variant))
		this.setState({
			amountChange: this.state.quantity* amount,
			title:this.props.navigation.state.params.product.productDetails.title,
			price:this.props.navigation.state.params.product.productDetails.variants[0].price - product_discount,
			compareprice:this.props.navigation.state.params.product.productDetails.variants[0].price,
			description:this.props.navigation.state.params.product.productDetails.body_html,
			leftQuantity: this.props.navigation.state.params.product.productDetails.variants[0].inventory_quantity
		});
		this.getProduct();
		this.getNumberCart();
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

	handleBack(){
		if(this.props.navigation.state.params.flag === 'generalcategory'){
			this.props.navigation.navigate('categorizedProducts', {collection_id:this.props.navigation.state.params.collection_id });
			return true;
		}else{
			this.props.navigation.navigate('exclusiveProduct');
			return true;
		}

 	}

	getProduct(){
		var product = this.props.navigation.state.params.product.productDetails.images;
		//alert(JSON.stringify(product))
		if(product.length == 0){
			var SliImage = ['https://www.123securityproducts.com/media/catalog/product/cache/1/image/265x/5e06319eda06f020e43594a9c230972d/placeholder/default/Pho_Unavail_base.jpg'];
			this.setState({
				sliImage: SliImage,
			});
		}else{
			var SliImage = product.map(function(product) {
				return(product.src);
			});
			this.setState({
				sliImage: SliImage,
			});
		}

	}

	on_select_variants(idx, value){
		var qnty = [];
		for(var i = 1; i <= this.props.navigation.state.params.product.productDetails.variants[idx].inventory_quantity; i++){
			qnty.push(i);
		}
		this.setState({
			price: this.props.navigation.state.params.product.productDetails.variants[idx].price - product_discount,
			compareprice: this.props.navigation.state.params.product.productDetails.variants[idx].price,
			variant_id: this.props.navigation.state.params.product.productDetails.variants[idx].id,
			var_id: idx,
			addQuantity: 1,
			leftQuantity: this.props.navigation.state.params.product.productDetails.variants[idx].inventory_quantity,
			qntyOption: qnty
		})
	}

	on_select_quanty(idx, value){
		this.setState({
			addQuantity: value
		}, function () {
			this.multiplyvalue()
		})

	}

	multiplyvalue(){
		var price = ((this.props.navigation.state.params.product.productDetails.variants[this.state.var_id].price - product_discount) * this.state.addQuantity).toFixed(2);
		var compareprice = (this.props.navigation.state.params.product.productDetails.variants[this.state.var_id].price * this.state.addQuantity).toFixed(2);
		this.setState({
			price: price,
			compareprice: compareprice
		})
	}

	 _renderTruncatedFooter = (handlePress) => {
    return (
      <Text style={{color:'blue', marginTop: 5, textAlign: 'center'}} onPress={handlePress}>
        Read more
      </Text>
    );
  }

  _renderRevealedFooter = (handlePress) => {
    return (
      <Text style={{color: 'blue', marginTop: 5, textAlign: 'center'}} onPress={handlePress}>
        Show less
      </Text>
    );
  }

	render(){
		 //let { text } ={this.state.description.replace(/(<([^>]+)>)/ig,"")};
		// alert(test);
		var discount = this.state.compareprice - this.state.price;
		var discountPer = Math.round((discount/this.state.compareprice)* 100);
		var showPerView = false;
		if(dis_type === 'Percentage') {
			showPerView = true;
		}
		var disType = '';
		if(dis_type === 'Percentage'){
			disType = dis_type;
		} else if(dis_type === 'Fixed_amount') {
			disType = 'Fixed Amount';
		}
		return(
			<View style={{flex:1}}>
				<StatusBarPaddingIOS/>
				<View style = {{backgroundColor: '#232f3e', height: responsiveHeight(9)}}>
					<View style={{height: responsiveHeight(8),flexDirection: 'row',}}>
						{Platform.OS === 'ios' && <View style={{ width: responsiveWidth(10), alignItems: 'center', justifyContent: 'center' }}>
							<TouchableOpacity onPress={() => this.handleBack()}>
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
						{/*<View style={{width:responsiveWidth(8),justifyContent:"center",alignItems:'center',}}>
													<TouchableOpacity onPress={() => {this.props.navigation.navigate('search')}}>
														<FontAwesome name="search" size={20} color="white" />
													</TouchableOpacity>
											    </View>*/}
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
					<View style ={{alignitems:'center',height:responsiveHeight(70)}}>
						<ImageSlider
							images = {this.state.sliImage}
							position={this.state.position}
							onPositionChanged={position => this.setState({position})}
							style={{height:responsiveHeight(70),backgroundColor:'white'}}
						/>
					</View>
					<View style={{flexDirection:'column'}}>
						<View style = {{ alignItems:'flex-start',paddingLeft: 10}}>
							<Text  style = {{fontSize: responsiveFontSize(2.8), color: 'black', fontFamily: 'Nunito-Regular'}} >{this.state.title}</Text>
						</View>
						<View style = {{flexDirection: 'row'}}>
							<View style = {{width:responsiveWidth(30),height: responsiveHeight(5), alignItems:'flex-start', marginTop: 8}}>
								<Text style = {{fontSize: responsiveFontSize(2.3), color: '#b12704', fontFamily: 'Nunito-Bold', paddingLeft: 10}} >{Url.symbol} {Math.round(this.state.price)} </Text>
							</View>
							{dis_type != 'no_discount' && <View style = {{width:responsiveWidth(30),height: responsiveHeight(5), alignSelf:'center',justifyContent:'center',}}>
								<Text style = {{fontSize: responsiveFontSize(2.3), color: 'grey', fontFamily: 'Nunito-Bold',textDecorationLine:'line-through'}} >{Url.symbol} {Math.round(this.state.compareprice)}</Text>
							</View>}
						{showPerView && <View style = {{backgroundColor: "#F1C65A", borderRadius: 5, height: responsiveHeight(3.3), width: responsiveWidth(12), alignSelf: 'center', alignItems: 'center', justifyContent:'center',marginLeft:5}} >
							<Text style = {{fontSize: responsiveFontSize(1.9), color: '#b12704', fontFamily: 'Nunito-Bold'}}>{discountPer}%</Text>
						</View>}
						</View>
					</View>
					{dis_type != 'no_discount' && <View style = {{width: responsiveWidth(95), height: responsiveHeight(5), flexDirection:'row', marginLeft:8}}>
						<Text style={{ fontFamily: 'Nunito-Bold', fontSize: responsiveFontSize(2), color: 'green' }}>You save: {Url.symbol} {Math.round(this.state.compareprice - this.state.price)}</Text>
					</View>}
					<View style = {{width: responsiveWidth(95), height: responsiveHeight(5), flexDirection:'row', marginLeft:8}}>
						{this.state.leftQuantity != 0 && <Entypo name = 'check' color = 'green' size = {20}/>}
						{this.state.leftQuantity != 0 && <Text style = {{fontFamily: 'Nunito-Regular', fontSize: responsiveFontSize(1.8),  color: 'green', paddingLeft: 5}} >In Stock {this.state.leftQuantity} Units Left</Text>}
						{this.state.leftQuantity == 0 && <Text style = {{fontFamily: 'Nunito-Regular', fontSize: responsiveFontSize(1.8),  color: 'red', paddingLeft: 5}} >Out of Stock</Text>}
					</View>
					{variant.length > 1 && <View style = {{width: responsiveWidth(95), marginTop: 10, alignSelf:'center'}}>
											<Text style = {{fontSize: responsiveFontSize(2.5), color: '#000', fontFamily: 'Nunito-Bold'}}>Select Variant</Text>
										</View>}
					{variant.length > 1 && <View style = {{justifyContent: 'center', alignItems:'center', marginBottom: 20, marginTop: 10}}>
											<ModalDropdown
							                    style={{width: responsiveWidth(95), backgroundColor: 'white', height:responsiveHeight(6),borderRadius: 3}}
						                   		textStyle={{fontFamily: 'Nunito-Light', fontSize: responsiveFontSize(1.7), color:'#000', paddingTop: 8.5, paddingLeft: 5}}
							                    defaultValue={variant[0]}
							                    dropdownStyle={{width: responsiveWidth(95),height: responsiveHeight(20.5), marginTop: 10, backgroundColor:'white'}}
						                        dropdownTextStyle={{color:'#000', fontSize: responsiveFontSize(1.7), fontFamily:'Nunito-Light', paddingLeft:10,backgroundColor:'#fff'}}
							                    options = {variant}
							                    //defaultIndex = {this.state.nameIndex}
							                    onSelect={(idx, value) => this.on_select_variants(idx, value)}
							                />
										</View>}
					{this.state.leftQuantity >1 && <View style = {{width: responsiveWidth(95), alignSelf:'center'}}>
											<Text style = {{fontSize: responsiveFontSize(2.5), color: '#000', fontFamily: 'Nunito-Bold'}}>Quantity</Text>
										</View>}
					{ this.state.leftQuantity >1 && <View style = {{justifyContent: 'center', alignItems:'center', marginTop: 10}}>
											<ModalDropdown
							                    style={{width: responsiveWidth(95), backgroundColor: 'white', height:responsiveHeight(6),borderRadius: 3}}
						                   		textStyle={{fontFamily: 'Nunito-Light', fontSize: responsiveFontSize(1.7), color:'#000', paddingTop: 8.5, paddingLeft: 5}}
							                    defaultValue={this.state.qntyOption[0]}
							                    dropdownStyle={{width: responsiveWidth(95),height: responsiveHeight(20.5), marginTop: 10, backgroundColor:'white'}}
						                        dropdownTextStyle={{color:'#000', fontSize: responsiveFontSize(1.7), fontFamily:'Nunito-Light', paddingLeft:10,backgroundColor:'#fff'}}
							                    options = {this.state.qntyOption}
							                    //defaultIndex = {this.state.nameIndex}
							                    onSelect={(idx, value) => this.on_select_quanty(idx, value)}
							         		/>
					</View>}
					{this.state.description != '' && <View style = {{width: responsiveWidth(95), marginTop: 10, marginBottom: 10, alignSelf:'center'}}>
											<Text style = {{fontSize: responsiveFontSize(2.5), color: '#000', fontFamily: 'Nunito-Bold'}}>Product Description</Text>
										</View>}
					{this.state.description != '' && <View style ={{backgroundColor: '#fff', width: responsiveWidth(95), alignSelf: 'center', marginBottom: 10}}>
					{this.state.description != '' &&<View style={{backgroundColor: '#fff', width: responsiveWidth(90), alignSelf: 'center', marginTop: 5, marginBottom: 5}}>
											<ReadMore
								              numberOfLines={3}
								              renderTruncatedFooter={this._renderTruncatedFooter}
								              renderRevealedFooter={this._renderRevealedFooter}
								              >
								              	<Text style = {{fontSize: responsiveFontSize(1.9), color: '#000', fontFamily: 'Nunito-Regular', paddingLeft: 5, paddingRight: 5}}>{(this.state.description.replace(/(<([^>]+)>)/ig,"")).trim()}</Text>
								            </ReadMore>
										</View>}</View>}
				</ScrollView>
				{this.state.leftQuantity != 0 && <View style={{height:responsiveHeight(6),alignitems:'center',flexDirection: 'row'}}>
					{this.state.leftQuantity != 0 && <View style = {{height: responsiveHeight(6),width:responsiveWidth(50), alignItems: 'flex-start'}}>
										<TouchableOpacity onPress={() => {this.buyNow(this.props.navigation.state.params.product)}} style = {{height: responsiveHeight(6), borderWidth: 1, alignItems: 'center', justifyContent:'center', borderColor:'#e2e2e2', width: responsiveWidth(50), backgroundColor:'#e2e2e2'}} >
											<Text style = {{fontSize: responsiveFontSize(2), color:'black', fontFamily:'Nunito-Regular'}} >Buy Now</Text>
										</TouchableOpacity>
									</View>}
				{this.state.leftQuantity != 0 && <View style = {{height: responsiveHeight(6),width:responsiveWidth(50), alignItems: 'flex-start'}}>
										<TouchableOpacity onPress={() => this.addToCart(this.props.navigation.state.params.product)} style = {{height: responsiveHeight(6), borderWidth: 1, alignItems: 'center', justifyContent:'center', borderColor:'#F1C65A', width: responsiveWidth(50), backgroundColor:'#F1C65A'}} >
											<Text style = {{fontSize: responsiveFontSize(2), color:'black', fontFamily:'Nunito-Regular'}} >Add to Cart</Text>
										</TouchableOpacity>
									</View>}
								</View>}
				<Toast ref="toast"/>
			</View>
		);
	}

	buyNow(products){
		// console.log("Add to cart called");
		this.refs.toast.show('Added to cart', 500);
		var product = new Item();
		product.node = products.productDetails;
		product.variant_id = products.productDetails.variants[this.state.var_id].id;
		product.var_id = this.state.var_id;
		product.discount_details = products.productDiscount;
		//alert(JSON.stringify(product));
		var tmpCartDictionary ={};
		var tmpCartDictionaryImmutable = {}
		AsyncStorage.getItem("Architect_cart").then((value) => {
			if(value != null)
			{
				tmpCartDictionary = JSON.parse(value);
			}
				if(tmpCartDictionary!=null && tmpCartDictionary[product.variant_id])
				{
					console.log("temp dict had data");
					var tmpQuantity = (tmpCartDictionary[product.variant_id]).quantity;
					//alert(tmpQuantity)
					console.log("tmp quantity:- "+ tmpQuantity);
					//condn to check total qty
					if(tmpQuantity === products.productDetails.variants[this.state.var_id].inventory_quantity){
						product.quantity = tmpQuantity
						console.log('when quantity is same')
					}else{
						if((tmpQuantity + this.state.addQuantity) > products.productDetails.variants[this.state.var_id].inventory_quantity){
							product.quantity = products.productDetails.variants[this.state.var_id].inventory_quantity;
						}else{
							product.quantity = tmpQuantity + this.state.addQuantity;
							console.log('when quantity is different')
						}

					}

					tmpCartDictionary[product.variant_id] = product;
					//alert(JSON.stringify(tmpCartDictionary))
					AsyncStorage.mergeItem("Architect_cart", JSON.stringify(tmpCartDictionary));
				}else {
					if(tmpCartDictionary ==null)
					{
							tmpCartDictionary = {};
					}

					console.log("temp dict didn't had data");
					product.quantity = this.state.addQuantity;
					tmpCartDictionary[product.variant_id] = product;
					//alert(JSON.stringify(tmpCartDictionary))
					AsyncStorage.setItem("Architect_cart",JSON.stringify(tmpCartDictionary));
			}
 		}).done(() => {this.props.navigation.navigate('cart')});
	 console.log("After set item to cart:- " +JSON.stringify(tmpCartDictionary));
			console.log("After set item to cart:- " + JSON.stringify(tmpCartDictionary));

	}

	addToCart(products){
		console.log("Add to cart called");
		this.refs.toast.show('Added to cart', 500);
		var product = new Item();
		product.node = products.productDetails;
		product.variant_id = products.productDetails.variants[this.state.var_id].id;
		product.var_id = this.state.var_id;
		product.discount_details = products.productDiscount;
		console.log(product);
		var tmpCartDictionary ={};
		var tmpCartDictionaryImmutable = {}
		AsyncStorage.getItem("Architect_cart").then((value) => {
			if(value != null)
			{
				tmpCartDictionary = JSON.parse(value);
			}
				if(tmpCartDictionary!=null && tmpCartDictionary[product.variant_id])
				{
					console.log("temp dict had data");
					var tmpQuantity = (tmpCartDictionary[product.variant_id]).quantity;
					//alert(tmpQuantity)
					console.log("tmp quantity:- "+ tmpQuantity);
					//condn to check total qty
					if(tmpQuantity === products.productDetails.variants[this.state.var_id].inventory_quantity){
						product.quantity = tmpQuantity
					}else{
						if((tmpQuantity + this.state.addQuantity) > products.productDetails.variants[this.state.var_id].inventory_quantity){
							product.quantity = products.productDetails.variants[this.state.var_id].inventory_quantity;
						}else{
							product.quantity = tmpQuantity + this.state.addQuantity;
							console.log('when quantity is different')
						}
					}

					tmpCartDictionary[product.variant_id] = product;
					AsyncStorage.mergeItem("Architect_cart", JSON.stringify(tmpCartDictionary));
				}else {
					if(tmpCartDictionary ==null)
					{
							tmpCartDictionary = {};
					}

					console.log("temp dict didn't had data");
					product.quantity = this.state.addQuantity;
					tmpCartDictionary[product.variant_id] = product;
					AsyncStorage.setItem("Architect_cart",JSON.stringify(tmpCartDictionary));
			}
 		}).done(() => {this.getNumberCart()});
	 console.log("After set item to cart:- " +JSON.stringify(tmpCartDictionary));
			console.log("After set item to cart:- " + JSON.stringify(tmpCartDictionary));

	}
}
