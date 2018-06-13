import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import VideoPlayer from 'react-native-video-player';

import Button from './Button';
import { productViewers } from './theme';

export default class ProductViewer extends Component {
  constructor(props){
    super(props)
    this.state = {
      product: {
      },
      video: { width: undefined, height: undefined, duration: undefined },
      thumbnailUrl: undefined,
      videoUrl: undefined,
    }
    this.getProduct = this.getProduct.bind(this)
    this.transit = this.transit.bind(this)
  }

  componentWillMount() {
    let { navigation } = this.props
    const productId = navigation.getParam('productId', '')
    this.getProduct(productId)
  }

  getProduct(productId) {
    let url = 'http://192.168.28.30:8080/SmartShop/product/product?id=' + productId
    fetch(url, {  
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.productId != '') {
        this.setState({
          product: responseJson
        })
        this.getVideo(responseJson.video)
      }
    })    
  }

  getVideo(videoId){
    global.fetch(`https://player.vimeo.com/video/${videoId}/config`)
      .then(res => res.json())
      .then(res => {
        this.setState({
          thumbnailUrl: res.video.thumbs['640'],
          videoUrl: res.request.files.hls.cdns[res.request.files.hls.default_cdn].url,
          video: res.video,
        })
      });
  }

  transit() {
    let { navigate } = this.props.navigation
    navigate('ProductViewer')
  }

  render() {
    const { product } = this.state
    let guide = []
    guide.push(product)
    productList = guide.map((product, i) => {
      return (
        <View 
          style={productViewers.pageStyle} 
          key={i}>
          <Image 
            source={{
              uri: 'https://drive.google.com/uc?id=' + product.photo,
              method: 'POST',
            }}
            style={productViewers.image} />
          <View style={productViewers.video}>
            <VideoPlayer
              endWithThumbnail
              thumbnail={{ uri: this.state.thumbnailUrl }}
              video={{ uri: this.state.videoUrl }}
              videoWidth={this.state.video.width}
              videoHeight={this.state.video.height}
              ref={r => this.player = r}
            />
          </View> 
          <Text 
            style={productViewers.heading}>
            {product.name}
          </Text>
          <Text 
            style={productViewers.heading}>
            {product.description}
          </Text>
        </View>
      )
    })

    return (
      <View
        style={productViewers.viewPager}>
        {productList}
      </View>
    )
  }
}
