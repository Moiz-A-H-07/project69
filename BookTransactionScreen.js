import React from 'react'
import {Text,View,TouchableOpacity,StyleSheet, TextInput, Alert,KeyboardAvoidingView,ToastAndroid} from 'react-native'
import * as Permissions from 'expo-permissions'
import {BarCodeScanner} from 'expo-barcode-scanner'
import * as firebase from 'firebase'
import db from '../config'

export default class Transactionscreen extends React.Component{
    constructor(){
        super()
        this.state={
            hasCameraPermissions:null,
            scanned:false,
            scannedBookID:'',
            scannedStudentID:'',
            Buttonstate:'normal',
            transactionMessage:''
        }
    }
    getCameraPermissions=async ()=>{
        const {status}=await Permissions.askAsync(Permissions.CAMERA)
        this.setState({
            hasCameraPermissions:status=="granted",
            Buttonstate:'clicked',
            scanned:false
        })
    }
   
    handleBarCodescanned=async ({
        type,data
    })=>{
       const {Buttonstate}=this.state
       if(Buttonstate=="bookID"){
           this.setState({
               scanned:true,
               scannedBookID:data,
               Buttonstate:'normal'
           })
       }else if(Buttonstate=="studentID"){
        this.setState({
            scanned:true,
            scannedStudentID:data,
            Buttonstate:'normal'
        })
       }
    }

initiateBookissue=async()=>{
    db.collection("transaction").add({
        'studentId' : this.state.scannedStudentID,
        'bookId': this.state.scannedBookID,
        'data': firebase.firestore.Timestamp.now().toDate(),
        'transactiontype': "issue"
    })
    db.collection("books").doc(this.state.scannedBookID).update({
        'bookavailability' : false
    })

    db.collection("students").doc(this.state.scannedStudentID).update({
        'numberofbooksissued': firebase.firestore.FieldValue.increment(1)    }) 
        this.setState({
scannedStudentID:'',scannedBookID:''
        })
}



initiateBookReturn=async()=>{
    db.collection("Transaction").add({
        'studentId' : this.state.scannedStudentID,
        'bookId': this.state.scannedBookID,
        'data': firebase.firestore.Timestamp.now().toDate(),
        'transactiontype': "Return"
    })
    db.collection("Books").doc(this.state.scannedBookID).update({
        'bookavailability' : true
    })

    db.collection("Students").doc(this.state.scannedStudentID).update({
        'numberofbooksissued': firebase.firestore.FieldValue.increment(-1)    }) 
        this.setState({
scannedStudentID:'',scannedBookID:''
        })
        Alert.alert("Book Returned")
}


handleTransaction=async()=>{
    var transactionMessage=null
    db.collection("Books").doc(this.state.scannedBookID).get().then((doc)=>{
        var book=doc.data()
        if(book.bookavailability){
            this.initiateBookissue()
            transactionMessage="issued"
            ToastAndroid.show(transactionMessage,ToastAndroid.SHORT)
        } else {
            this.initiateBookReturn()
            transactionMessage="returned"
            ToastAndroid.show(transactionMessage,ToastAndroid.SHORT)
        }
    })
    this.setState({
        transactionMessage:transactionMessage
    })
}


    render(){
        const hasCameraPermissions=this.state.hasCameraPermissions
        const scanned=this.state.scanned
        const Buttonstate= this.state.Buttonstate
        if(Buttonstate!=="normal" && hasCameraPermissions){
            return(
                <BarCodeScanner onBarCodeScanned={scanned?undefined:this.handleBarCodescanned}
                style={StyleSheet.absoluteFillObject}/>

                
            )
        } else if(Buttonstate=="normal"){
            return(
                <View style={styles.container}>
                    <View>
                        <Image
                        source={require("../assets/booklogo.jpg")
                        }style={{width:200,height:200}}>
                             </Image>
                             <Text style={{textAlign:'center', fontSize:30}}>
                Library App
                             </Text>
                             </View>
                  <View style={styles.inputView}>
<TextInput style={styles.inputBox}
  placeholder="Book Id" value={this.state.scannedBookID}>
</TextInput>
<TouchableOpacity style={styles.scanButton}
onPress={()=>{
    this.getCameraPermissions("Book Id")
}}>
    <Text style={styles.Buttontext}>
scan
    </Text>
</TouchableOpacity>
                  </View>

                  <View style={styles.inputView}>
<TextInput style={styles.inputBox}
  placeholder="Student Id" value={this.state.scannedStudentID}>
</TextInput>
<TouchableOpacity style={styles.scanButton}
onPress={()=>{
    this.getCameraPermissions("Student Id")
}}>
    <Text style={styles.Buttontext}>
scan
    </Text>
</TouchableOpacity>
                  </View>

        <Text style={styles.transactionAlert}>
{this.state.transactionMessage}
        </Text>
        <TouchableOpacity style={styles.submitButton}
         onPress={async()=>{
             var transactionMessage=await this.handleTransaction()
         }}>
             <Text style={styles.submitButtonText}>
submit
             </Text>
 </TouchableOpacity>
       
                    
 </View>
               
            )
        }
    }
}

const styles=StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'

    },
    displayText:{
        fontSize:15,
        textDecorationLine:'underline'
    },
    scanButton:{
        backgroundcolor:'red',
        padding:10,
        margin:10,
        width:50,
        borderWidth:1.5,
        borderLeftWidth:0
    },
    Buttontext:{
        fontSize:15,
        textAlign:'center',
        marginTop:10
    },
    inputView:{
      flexDirection:'row',
      margin:20  
    },
    inputBox:{
        width:200,
        height:40,
        borderWidth:1.5,
        borderRightWidth:0,
        fontSize:20
    },
    submitButton:{
        backgroundColor:'green',
        width:100,
        height:50
    },
    submitButtonText:{
        padding:10,
        textAlign:'center',
        fontSize:20,
        fontWeight:"bold",
        color:'white'
    }
})