import React, { useEffect, useState } from "react"
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  Platform,
  Image,
  
} from "react-native"

import  {
  requestSubscription,
} from "react-native-iap"
import { showMessage } from "react-native-flash-message"

const ApplePay = props => {
 

  const purchasePlan = async (sku) => {
    try {
      const product =  await requestSubscription({
                sku,
               subscriptionOffers: [{sku}]
              });
    //   if (product.transactionReceipt) {
        // onReceiptReceived(plan, product)
    //   }
    console.log(product,'product');
    } catch (error) {
      console.log("requestSubscription", error.message)
      const message = error?.message
        ? error.message
        : "Failed to request subscription"
      showMessage({ type: "danger", message })
    } finally {
    }
  } 
  return (
    
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <TouchableOpacity
              style={styles.btnView}
              onPress={() => purchasePlan('1262b11609ca3fd3c130d56e1cbd00ad')}
            >
             
                <View
                  style={{
                    flexDirection: "row",
                    flex: 1,
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <View
                    style={{ alignItems: "center", justifyContent: "center" }}
                  >
                    <Text style={styles.paymentIcon}>Purchase plan</Text>
                  </View>
                  
                </View>
              
            </TouchableOpacity>
   
        </ScrollView>
      {/* <Modal
        animationType="slide"
        transparent={true}
        visible={subscriptionModal}
        onRequestClose={() => setSubscriptionModal(false)}
      >
        <View style={styles.modalWrapper}>
          <TouchableOpacity
            disabled={requestingIndex}
            style={styles.topBarWrapper}
            onPress={() => setSubscriptionModal(false)}
          >
            <View style={styles.topBar} />
          </TouchableOpacity>
          {Platform.OS === "ios" && (
           
               <TouchableOpacity
       
                  style={styles.planWrapper}
                  disabled={requestingIndex}
                  onPress={() => }
                >
                  <View>
                    <Text style={styles.paymentIcon}>{'plan.title'}</Text>
                    <Text
                      style={styles.planDetails}
                    >{`${'plan.localizedPrice'} ${'plan.currency'}`}</Text>
                  </View>
                 
                </TouchableOpacity>
          )}
            
        </View>
      </Modal> */}
      </SafeAreaView>

  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F6F5"
  },

  btnView: {
    flexDirection: "row",
    backgroundColor: "#F0B6B0",
    marginHorizontal: 16,
    height: 56,
    marginTop: 24,
    borderRadius: 8,
    justifyContent: "center",
    paddingLeft: 20
  },
  paymentIcon: { color: "#4A4A4A", fontSize: 16, fontWeight: "400" },
  planDetails: { color: "#4A4A4A", fontSize: 12, fontWeight: "700" },
 
  planWrapper: {
    flexDirection: "row",
    height: 56,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    margin: 10,
    padding: 10,
    borderRadius: 10
  },
  modalWrapper: {
    marginTop: "100%",
    height: "100%",
    backgroundColor: "#F0B6B0",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  },
  topBarWrapper: {
    paddingTop: 10,
    height: 30,
    alignItems: "center",
    justifyContent: "center"
  },
  topBar: { width: 60, borderRadius: 10, height: 5, backgroundColor: "white" }
})




export default ApplePay

