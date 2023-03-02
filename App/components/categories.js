import React, { Component } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  AsyncStorage,
  ListView,
  BackHandler,
  RefreshControl,
  TextInput,
  NetInfo
} from 'react-native'

import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions'
import Url from './../utils/Api'
import Entypo from 'react-native-vector-icons/Entypo'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Toast from 'react-native-easy-toast'
import PopupDialog from 'react-native-popup-dialog'
import * as Progress from 'react-native-progress'
import StatusBarPaddingIOS from 'react-native-ios-status-bar-padding'

export default class Categories extends Component {
state = {
  position: 1,
  interval: null,
  refreshing:false,
  dataSource: new ListView.DataSource({
    rowHasChanged: (row1, row2) => row1 !== row2
  }),
  
};
prod;
componentDidMount() {
  this.popupDialog.show()
  BackHandler.addEventListener('hardwareBackbutton', this.handleBack.bind(this))
  this.getCustomer()
  this.getNumberCart()
  NetInfo.isConnected.fetch().then(isConnected => {
    if (isConnected) {
  this.fetchcategories()
    }else{
      alert("No Network ,Try Again");
    }
})
}

componentWillUnmount() {
  BackHandler.removeEventListener('hardwareBackbutton')
}

handleBack() {
  BackHandler.exitApp();
  return true
}

getCustomer() {
  AsyncStorage.getItem('Architect').then((value) => {
    const tmp = JSON.parse(value)
    if (tmp !== null) {
      this.setState({
        customerData: tmp,
        customer: true
      })
    } else {
      this.setState({
        customerData: '',
        customer: false
      })
    }
  })
}

getNumberCart() {
  let tmpproduct = {}
  AsyncStorage.getItem('Architect_cart').then((value) => {
    if (value !== null) {
      tmpproduct = JSON.parse(value)
      const tmppro = Object.keys(tmpproduct).map((key) => {
        return (tmpproduct[key])
      })
      this.setState({
        cart_count: tmppro.length
      })
    } else {
      this.setState({
        cart_count: 0
      })
    }
  }).done()
}

fetchcategories() {
  fetch(Url.domain + '/getCollections', {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }).then((response) => response.json())
    .then((responseData) => {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(responseData.Collection)
      })
      prod=responseData.Collection
      console.log(prod);
    }).done(() => { this.popupDialog.dismiss();  this.setState({refreshing:false}) })
}

    change(text){
      this.setState({
        search: text
      })
      this.search(text);
    }

    search(key){
      var searchprod = this.searchStringInArray(key, prod);
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(searchprod)
      })
    }

    searchStringInArray (str, strArray) {
      const regex = new RegExp(`${str.trim()}`, 'i');
      var result = strArray.filter(product => product.collection_title.search(regex) >= 0);
      return result;
    }

    clearData(){
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows({}),
        
      })
    }

render() {
  return (
    <View style={{ flex: 1 }}>
      <StatusBarPaddingIOS/>
      <View style={{ backgroundColor: '#232f3e', height: responsiveHeight(17) }}>
        <View style={{ height: responsiveHeight(8), flexDirection: 'row' }}>
          <View style={{ width: responsiveWidth(15), alignItems: 'center', justifyContent: 'center' }}>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('DrawerToggle')}>
              <Entypo name="menu" size={28} color="white" />
            </TouchableOpacity>
          </View>
          <View style={{ width: responsiveWidth(66), justifyContent: 'center' }}>
            <Text style={{ fontFamily: 'Nunito-Bold', fontSize: responsiveFontSize(3), color: 'white' }}>{Url.title}</Text>
          </View>
          <View style={{ width: responsiveWidth(22), justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => { this.props.navigation.navigate('cart') }} style={{ alignItems: 'flex-start' }} >
              <MaterialCommunityIcons name="cart-outline" size={25} color="white" />
            </TouchableOpacity>
            <View style={{ height: responsiveHeight(2.5), width: responsiveWidth(5), backgroundColor: 'white', borderRadius: 10, position: 'absolute', left: 45, top: 10, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: responsiveFontSize(1.5), color: '#232f3e', fontFamily: 'Nunito-Bold' }}>{this.state.cart_count}</Text>
            </View>
          </View>
        </View>
        <View style={{width:responsiveWidth(100),justifyContent:"center",alignItems:'center',}}>
             <TextInput
                 underlineColorAndroid='transparent'
                 placeholder="Search"
                 placeholderTextColor = "grey"
                 style={{backgroundColor:'white',width:responsiveWidth(96),height:responsiveHeight(7),justifyContent:'center',alignItems:'center',paddingLeft:45,paddingBottom:5.8,marginBottom: 10,borderRadius: 5,borderColor:'orange',borderWidth:2,}}
                 onChangeText={(search) => this.change(search)}
                 onSubmitEditing ={() => this.search(this.state.search)}
                 onEndEditing={() => this.search(this.state.search)}
                 
                />
                <FontAwesome name="search" size = {22} color = 'orange' style = {{ position: 'absolute',left: 21,top: 10}}/>
          </View>
      </View>
      <ListView
        dataSource={this.state.dataSource}
        refreshControl={this._refreshControl()}
        renderRow={this.renderCategory.bind(this)}
        contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10 }}
      />
      <Toast ref="toast" />
      <PopupDialog dismissOnTouchOutside={false} dismissOnHardwareBackPress={false} overlayOpacity={0.9} overlayBackgroundColor="#A9A9A9" width={responsiveWidth(75)} height={responsiveHeight(10)} ref={(popupDialog) => { this.popupDialog = popupDialog }}>
        <View style={{ height: responsiveHeight(10), width: responsiveWidth(75), flexDirection: 'row' }}>
          <View style={{ width: responsiveWidth(20), justifyContent: 'center', alignItems: 'center' }}>
            <Progress.CircleSnail color={['#008744', '#0057e7', '#d62d20', '#ffa700', '#eee']} duration={700} />
          </View>
          <View style={{ justifyContent: 'center' }}>
            <Text style={{ fontFamily: 'Nunito-Regular', fontSize: responsiveFontSize(2), color: 'black' }}>Loading...</Text>
          </View>
        </View>
      </PopupDialog>
    </View>
  )
}

_refreshControl(){
    return (
      <RefreshControl
        refreshing={this.state.refreshing}
        onRefresh={()=>this._refreshListView()} />
    )
  }

_refreshListView(){
    //Start Rendering Spinner
    this.setState({refreshing:true,
    })
    //Updating the dataSource with new data
   this.fetchcategories();

  }

renderCategory(cat) {
  let image
  if (cat.collection_image) {
    image = cat.collection_image
  } else {
    image = 'https://cdn.shopify.com/s/images/admin/no-image-large.gif?da5ac9ca38617f8fcfb1ee46268f66d451ca66b4'
  }
  return (
    <TouchableOpacity onPress={() => this.props.navigation.navigate('categorizedProducts', { collection_id: cat.collection_id })}>
      <View style={{ height: responsiveHeight(43), width: responsiveWidth(45.8), borderRightWidth: 1, borderColor: '#e2e2e2', marginTop: 10, borderBottomWidth: 1, backgroundColor: 'white', marginLeft: 10, flexDirection: 'column' }}>
        <View style={{ height: responsiveHeight(30), alignItems: 'center' }}>
          <Image source={{ uri: image }} resizeMode="contain" style={{ height: responsiveHeight(30), width: responsiveWidth(45) }} />
        </View>
        <View style={{ height: responsiveHeight(13), width: responsiveWidth(40), alignItems: 'flex-start', alignSelf: 'center', paddingTop: 2 }}>
          <Text numberOfLines={3} style={{ fontSize: responsiveFontSize(2.2), color: 'black', fontFamily: 'Nunito-Regular' }} >{cat.collection_title}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}
}
