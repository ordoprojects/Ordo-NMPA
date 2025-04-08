sendOrderFunction = () => {

    var address = commonData.getActiveAdress();

    that.updatepayment(accountid);

    var type = "New";

    fetch(url, {

        method: 'POST',

        body: JSON.stringify(



            {

                __module_code__: "PO_17",

                __query__: "",

                __session_id__: commonData.getsessionId(),

                __name_value_list__: {

                    "name": "qname",

                    "date_modified": last_modified,

                    "description": qname,

                    "approval_issue": "",

                    "expiration": valid_to,

                    "orderid": that.state.orderid,

                    "billing_account_id": accountid,

                    "billing_account": cname,

                    "created_userval_c": uname,

                    "assigned_user_name": uname,

                    "initiated_by": uname,

                    "lastmodifiedby": custid,

                    "billing_address_street_2_c": bill1[0],

                    "billing_address_street": bill1[0],

                    "billing_address_city": "",

                    "billing_address_state": bill1[1],

                    "billing_address_postalcode": bill1[3],

                    "billing_address_country": bill1[2],

                    "line_items": commonData.getTotalItems(),

                    "tax_amount": gst,

                    "subtotal_amount": subtotal,

                    "subtotal_amount_usdollar": subtotal,

                    "discount_amount": savings,

                    "currency_id": "-99",

                    "stage": orderstatus,

                    "reason_for_return": that.state.Returnreson,

                    "term": "Neft15",

                    "terms_c": "",

                    "orderstatus_c": orderstatus,

                    "invoice_status": "Not Invoiced",

                    "total_amt": grandtotal,

                    "total_amount": grandtotal,

                    "total_amount_usdollar": grandtotal,

                    "lastmodified": last_modified,

                    "shipping_address_street": shippingadd[0],

                    "shipping_address_state ": shippingadd[1],

                    "shipping_address_country": shippingadd[2],

                    "shipping_address_postalcode": shippingadd[3],

                    "approval_status": "Approved",

                    "totalitems_c": totalitems,

                    "device_id": deviceid,

                    "os_name": brand,

                    "osversion_c": systemVersion,

                    "latitude": commonData.getlatitude(),

                    "longitude": commonData.getlongitude(),

                    "type": type

                }

            })

    }).then(function (response) {

        return response.json();

    }).then(function (result) {



        console.log("Order sent", result);

        // that.setState({isloading:false});

        if (TYPE == "RETURN") {



        } else {

            that.createGroupItemsrecord(result.id, custid + "Orders" + that.state.orderid, qname)

        }







    }).catch(function (error) {

        console.log("-------- error ------- " + error);

        console.log("Order not sent");

    });

}



createGroupItemsrecord = (orderid, name, qname) => {

    var that = this;

    that.setState({ isloading: true });

    var price = commonData.getTotalPrice().split("₹")[1];

    var savings = that.state.savings;



    var gst = that.state.gstvalue;

    var grandtotal = Number(gst) + Number(price);

    var subtotal = Number(savings) + Number(price);

    var url = SET_DATAURL

    fetch(url, {

        method: 'POST',

        body: JSON.stringify({

            __module_code__: "PO_28",

            __query__: "",

            __session_id__: commonData.getsessionId(),

            __name_value_list__: {

                "total_amt": price,

                "total_amt_usdollar": price,

                "name": name,

                "discount_amount": savings,

                "discount_amount_usdollar": savings,

                "subtotal_amount": subtotal,

                "subtotal_amount_usdollar": subtotal,

                "tax_amount": gst,

                "tax_amount_usdollar": grandtotal,

                "subtotal_tax_amount": grandtotal,

                "subtotal_tax_amount_usdollar": grandtotal,

                "total_amount": grandtotal,

                "total_amount_usdollar": grandtotal,

                "parent_type": "AOS_Quotes",

                "currency_id": -99,

                "assigned_user_id": 1,

                "parent_id": orderid,

                "number": 1

            }

        })

    }).then(function (response) {

        return response.json();

    }).then(function (result) {

        // that.setState({isloading:false});

        that.sendItems(orderid, name, result.id, qname)

    }).catch(function (error) {

        console.log("-------- error ------- " + error);

    });

}



sendItems = (parentid, name, groupid, qname) => {



    var createduser = commonData.getUserID()

    var date_entered = commonData.getCurrentDate()

    var that = this

    that.setState({ isloading: true });

    var url = SET_DATAURL

    let TYPE = this.props.navigation.getParam('TYPE', '')

    let return_id = "";

    let return_qty = 0;

    let custname = commonData.getcustomerName();

    var val = uuid.v4();

    // var groupid=val;

    var groupname = "grcd";

    var uname = commonData.getusername();

    var total_vat = 0, total_price = 0, grand_total = 0;

    for (var i = 0; i < that.state.arrayHolder.length; i++) {





        let id = that.state.arrayHolder[i].id;

        let part_num = that.state.arrayHolder[i].itemid;

        let qty = Number(that.state.arrayHolder[i].qty);

        let stock = Number(that.state.arrayHolder[i].stock) - qty;

        let rid = that.state.arrayHolder[i].rid;

        var returned = "0";



        if (TYPE == "RETURN") {

            stock = Number(that.state.arrayHolder[i].stock) + qty;

            returned = "1";

        } else {





            // if(qty>that.state.arrayHolder[i].stock){



            //   if(qty==0)

            //    continue;

            // }



        }

        // that.updateitemStock(id,stock); 

        // this.stockcountupdate(id,stock);

        //in this method we are setting the username user has typed and store it in the set_data_s.php url.     

        console.log("url:" + url);

        var oid = commonData.getOrderId()

        this.setState({

            isloading: true,

        });



        var vat_amt = Number(this.state.arrayHolder[i].price) * Number(this.state.arrayHolder[i].qty) * Number(this.state.arrayHolder[i].tax) / 100;

        var product_total_price = Number(this.state.arrayHolder[i].price) * Number(this.state.arrayHolder[i].qty) + vat_amt;

        total_vat = Number(total_vat) + Number(vat_amt);



        total_price = total_price + product_total_price;

        console.log("********total_vat", total_price)

        if (i == that.state.arrayHolder.length - 1) {

            console.log("mmmmm here", parentid, total_vat, total_price, grand_total)

            grand_total = total_price - this.state.totalsavings;

            this.updateOrderPrice(parentid, total_vat, total_price, grand_total, "");

            this.updateOrderPrice(groupid, total_vat, total_price, grand_total, "PO_28");

        }

        fetch(url, {

            method: 'POST',

            body: JSON.stringify({

                "__module_code__": "PO_18",

                "__name_value_list__": {

                    "name": this.state.arrayHolder[i].description,

                    "description": "",

                    "currency_id": "-99",

                    "modified_by_name": createduser,

                    "item_description": this.state.arrayHolder[i].description,

                    "number": i + 1,

                    "product_qty": qty,

                    "product_cost_price": this.state.arrayHolder[i].price,

                    "product_total_price": product_total_price,

                    "product_list_price": this.state.arrayHolder[i].price,

                    "product_unit_price": this.state.arrayHolder[i].price,

                    "vat": this.state.arrayHolder[i].tax,

                    "vat_amt": vat_amt,

                    "parent_name": qname,

                    "hsn": this.state.arrayHolder[i].hsn,

                    "parent_type": "AOS_Quotes",

                    "parent_id": parentid,

                    "product_id": id,

                    "part_number": part_num,

                    "group_id": groupid,

                    "returned": returned,

                    "assigned_user_name": uname,

                    "group_name": name,

                }

            })

        }).then(function (response) {

            return response.json();

        }).then(function (result) {

            console.log("this is sending order items")

            console.log(result);

            that.setState({

                isloading: true,

            });

            that.synccall();

            that.setState({

                loading: true,

            });



        }).catch(function (error) {

            console.log("-------- error ------- " + error);

        });



    }



    that.DeleteCurrentOrder();

    that.DeleteFunction();







}



updateOrderPrice = (id, total_vat, total_price, grand_total, modulecode) => {





    var that = this;



    var myHeaders = new Headers();

    myHeaders.append("Content-Type", "application/json");

    that.setState({ isloading: true });

    var raw = JSON.stringify({ "__module_code__": "PO_17", "__session_id__": commonData.getsessionId(), "__query__": "id='" + id + "'", "__name_value_list__": { "total_amt": total_price, "tax_amount": total_vat, "total_amount": grand_total, "id": id } });

    if (modulecode == "PO_28") {

        raw = JSON.stringify({
            "__module_code__": "PO_28", "__session_id__": commonData.getsessionId(), "__query__": "id='" + id + "'", "__name_value_list__": {

                "total_amt": commonData.getTotalPrice(),

                "total_amt_usdollar": commonData.getTotalPrice(),

                "discount_amount": 0,

                "discount_amount_usdollar": 0,

                "subtotal_amount": total_price,

                "subtotal_amount_usdollar": total_price,

                "tax_amount": total_vat,

                "tax_amount_usdollar": total_vat,

                "subtotal_tax_amount": total_vat,

                "subtotal_tax_amount_usdollar": total_vat,

                "total_amount": grand_total,

                "total_amount_usdollar": grand_total,

            }
        });

    }

    var requestOptions = {

        method: 'POST',

        headers: myHeaders,

        body: raw,

        redirect: 'follow'

    };



    fetch("https://dev.ordo.primesophic.com/set_data_s.php", requestOptions).then(function (response) {

        return response.json();

    }).then(function (result) {

        console.log(result);

        that.setState({ isloading: true });

        that.forceUpdate();







    }).catch(function (error) {

        console.log("-------- error ------- " + error);

    });





}

updatepayment = (id) => {

    this.setState({ isloading: true });

    var url = SET_DATAURL

    fetch(url, {

        method: 'POST',

        body: JSON.stringify({

            __module_code__: "PO_01",

            __query__: "id='" + id + "'",

            __session_id__: commonData.getsessionId(),

            __name_value_list__: {

                "due_amount_c": commonData.getTotalPrice(),

                "payment_due_c": "1",

                "id": id



            }

        })

    }).then(function (response) {

        return response.json();

    }).then(function (result) {

        // this.setState({isloading:false});

        console.log("item deleted", id, result)
    }).catch(function (error) {

        // this.setState({isloading:false});

        console.log("-------- error ------- " + error);

    });

}