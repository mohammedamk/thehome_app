import React, { Component } from 'react';
import {
  AppRegistry,
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  children,
  AsyncStorage,
  Platform,
  ListView,
  TouchableHighlight
} from 'react-native';

import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import StatusBarPaddingIOS from 'react-native-ios-status-bar-padding'
import Url from './../Api'

export default class NavigationDrawer extends Component{

  state = {
    customer: false,
    customerData: '',
    customerName: '',
    dataSource: new ListView.DataSource({
    rowHasChanged: (row1, row2) => row1 !== row2
  }),
  }

  componentDidMount(){
    this.getCustomer();
    this.fetchcategories();
  }

  getCustomer(){
    AsyncStorage.getItem('Architect').then((value) => {
      var tmp = JSON.parse(value);
      if(tmp != null){
        if(tmp.last_name == null){
          this.setState({
          customer: true,
          customerData: tmp,
          customerName: tmp.name + ' '
        })
        }else{
          this.setState({
          customer: true,
          customerData: tmp,
          customerName: tmp.name+ ' '
        })
        }

        //alert('helloooooo')
      }else{
        this.setState({
          customer: false,
          customerData: '',
          customerName: ''
        })
      }
    })
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
    })
}


  render(){
    return(
      <View style={{flex:1, backgroundColor: 'white'}}>
        <StatusBarPaddingIOS />
        <View style = {{height: responsiveHeight(9.5), backgroundColor: '#232f3e', flexDirection: 'row'}}>
          <View style = {{justifyContent: 'center'}}>
            <Text style = {{fontSize: responsiveFontSize(2.5), color: 'white', paddingLeft: 10, fontFamily: 'Nunito-Italic'}} >Hello. {this.state.customer ? this.state.customerName : "Sign in"}</Text>
          </View>
        </View>
        <ScrollView>
         <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderCategory.bind(this)}
          contentContainerStyle={{ flexDirection: 'column', flexWrap: 'wrap' }}
        />
        {this.state.customer &&<TouchableOpacity onPress = {() => this.props.navigation.navigate('orders')}>
          <View style = {{height: responsiveHeight(8), justifyContent:'center'}}>
            <Text style = {{fontSize: responsiveFontSize(2), color: 'black', fontFamily: 'Nunito-Regular', paddingLeft: 30 }} >Orders</Text>
          </View>
        </TouchableOpacity>}
        <TouchableOpacity onPress = {() => this.props.navigation.navigate('cart')}>
          <View style = {{height: responsiveHeight(8), justifyContent:'center'}}>
            <Text style = {{fontSize: responsiveFontSize(2), color: 'black', fontFamily: 'Nunito-Regular', paddingLeft: 30 }} >My Cart</Text>
          </View>
        </TouchableOpacity>
        
        {this.state.customer &&
          <TouchableOpacity onPress = {() => this.props.navigation.navigate('account')}>
                  <View style = {{height: responsiveHeight(8), justifyContent:'center'}}>
                    <Text style = {{fontSize: responsiveFontSize(2), color: 'black', fontFamily: 'Nunito-Regular', paddingLeft: 30 }} >Account</Text>
                  </View>
          </TouchableOpacity>}

          <TouchableOpacity onPress = {() => this.props.navigation.navigate('contact')}>
                  <View style = {{height: responsiveHeight(8), justifyContent:'center'}}>
                    <Text style = {{fontSize: responsiveFontSize(2), color: 'black', fontFamily: 'Nunito-Regular', paddingLeft: 30 }} >Contact us</Text>
                  </View>
          </TouchableOpacity>

          <TouchableOpacity onPress = {() => this.props.navigation.navigate('privacy')}>
                  <View style = {{height: responsiveHeight(8), justifyContent:'center'}}>
                    <Text style = {{fontSize: responsiveFontSize(2), color: 'black', fontFamily: 'Nunito-Regular', paddingLeft: 30 }} >Privacy Policy</Text>
                  </View>
          </TouchableOpacity>

        {this.state.customer && <TouchableOpacity onPress = {() => this.logout()}>
                  <View style = {{height: responsiveHeight(8), justifyContent:'center'}}>
                    <Text style = {{fontSize: responsiveFontSize(2), color: 'black', fontFamily: 'Nunito-Regular', paddingLeft: 30 }} >Sign Out</Text>
                  </View>
                </TouchableOpacity>}
        {!this.state.customer && <TouchableOpacity onPress = {() => this.props.navigation.navigate('architectsignin')}>
                  <View style = {{height: responsiveHeight(8), justifyContent:'center'}}>
                    <Text style = {{fontSize: responsiveFontSize(2), color: 'black', fontFamily: 'Nunito-Regular', paddingLeft: 30 }} >Sign in</Text>
                  </View>
                </TouchableOpacity>}
        </ScrollView>
      </View>
    );
  }

  logout(){
    AsyncStorage.removeItem('Architect');
    AsyncStorage.removeItem('Architect_cart');
    this.props.navigation.navigate('architectsignin');
  }


  renderCategory(cat) {
  
    return (
        <TouchableOpacity onPress = {() => this.props.navigation.navigate('categorizedProducts', { collection_id: cat.collection_id })}>
          <View style = {{height: responsiveHeight(8), justifyContent:'center'}}>
            <Text numberOfLines={1} style = {{fontSize: responsiveFontSize(2), color: 'black', fontFamily: 'Nunito-Regular', paddingLeft: 30,paddingRight:30 }} >{cat.collection_title}</Text>
          </View>
        </TouchableOpacity>
    )
  }
}


// {this.state.customer && <TouchableOpacity onPress = {() => this.props.navigation.navigate('orders')}>
       //           <View style = {{height: responsiveHeight(8), justifyContent:'center'}}>
       //             <Text style = {{fontSize: responsiveFontSize(2.3), color: 'black', fontFamily: 'Nunito-Regular', paddingLeft: 30 }} >Your Orders</Text>
       //           </View>
       //         </TouchableOpacity>}
       //  {this.state.customer && <TouchableOpacity onPress = {() => this.props.navigation.navigate('account')}>
       //    <View style = {{height: responsiveHeight(8), justifyContent:'center'}}>
       //      <Text style = {{fontSize: responsiveFontSize(2.3), color: 'black', fontFamily: 'Nunito-Regular', paddingLeft: 30 }} >Your Account</Text>
       //    </View>
       //  </TouchableOpacity>}
       //  {this.state.customer && <TouchableOpacity onPress = {() => this.props.navigation.navigate('address')}>
       //           <View style = {{height: responsiveHeight(8), justifyContent:'center'}}>
       //             <Text style = {{fontSize: responsiveFontSize(2.3), color: 'black', fontFamily: 'Nunito-Regular', paddingLeft: 30 }} >Your Addressess</Text>
       //           </View>
       //         </TouchableOpacity>}
       //  {!this.state.customer && <TouchableOpacity onPress = {() => this.props.navigation.navigate('signin')}>
       //            <View style = {{height: responsiveHeight(8), justifyContent:'center'}}>
       //              <Text style = {{fontSize: responsiveFontSize(2.3), color: 'black', fontFamily: 'Nunito-Regular', paddingLeft: 30 }} >Sign In</Text>
       //            </View>
       //          </TouchableOpacity>}
       //  {this.state.customer && <TouchableOpacity onPress = {() => this.logout()}>
       //            <View style = {{height: responsiveHeight(8), justifyContent:'center'}}>
       //              <Text style = {{fontSize: responsiveFontSize(2.3), color: 'black', fontFamily: 'Nunito-Regular', paddingLeft: 30 }} >Sign Out</Text>
       //            </View>
       //          </TouchableOpacity>}
