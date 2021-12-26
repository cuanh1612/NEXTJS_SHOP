import { order_add_message } from '@/reduxState/actionTypes/orderAction'
import { addMessageCart, cartClearAll } from '@/reduxState/asyncActions/cartAsyncAction'
import { orderUpdateItem } from '@/reduxState/asyncActions/orderAsyncAction'
import { patchData } from '@/utils'
import { useEffect as UseEffect, useRef as UseRef } from 'react'
import { useDispatch as UseDispatch } from 'react-redux'

const paypalBtn = ({ orders, order, accessToken }) => {
    const refPaypalBtn = UseRef()

    //Dispatch
    const dispatch = UseDispatch()

    UseEffect(() => {
        paypal.Buttons({
            createOrder: function (data, actions) {
                // This function sets up the details of the transaction, including the amount and line item details.
                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            value: order.total
                        }
                    }]
                });
            },
            onApprove: function (data, actions) {
                // This function captures the funds from the transaction.
                return actions.order.capture().then(function (details) {
                    //Patch to update payment success
                    patchData(`order/payment/${order._id}`, {
                        paymentId: details.payer.payer_id
                    }, accessToken)
                        .then(res => {
                            if (res.err) return dispatch(order_add_message({
                                description: res.err,
                                status: "error"
                            }))

                            //Update payment order
                            dispatch(orderUpdateItem(orders, order._id, {
                                ...order,
                                paid: true,
                                dateOfPayment: details.create_time,
                                paymentId: details.payer.payer_id,
                                method: 'Paypal'
                            }))

                            return dispatch(order_add_message({
                                description: res.msg,
                                status: "success"
                            }))
                        })

                });
            }
        }).render(refPaypalBtn.current);
        //This function displays Smart Payment Buttons on your web page.
    }, [])

    return (
        <div ref={refPaypalBtn}></div>
    )
}

export default paypalBtn