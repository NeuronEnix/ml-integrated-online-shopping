const { STRIPE_SECRET_KEY } = process.env;
const stripe = require("stripe")( STRIPE_SECRET_KEY );
const { default: Stripe } = require("stripe");
const uuid = require("uuid");

module.exports.stripeCheckout = async ( token, amount, userEmail, userPhone, userName, userMetadata ) => {

    try {

        const customer = await stripe.customers.create( {
            source: token.id,
            email: userEmail,
            name: userName,
            phone: userPhone,
            metadata: userMetadata,
        });
        
        const idempotencyKey = uuid.v4();
    
        const charge = await stripe.charges.create (
            {
                amount: amount * 100,
                currency: "inr",
                customer: customer.id,
                receipt_email: token.email,
                description: "Envision: VIP Pass",
                shipping: {
                    name: token.card.name || userName,
                    address: {
                        line1: token.card.address_line1,
                        line2: token.card.address_line2,
                        city: token.card.address_city,
                        country: token.card.address_country,
                    }
                },
                metadata: userMetadata,
            }, {
                idempotencyKey
            }
        );
        
        const chargeMinifiedData = {
            status: charge.status,
            chargeID: charge.id,
            balance_transaction: charge.balance_transaction,
            livemode: charge.livemode,
            paid: charge.paid,
            receipt_email: charge.receipt_email,
            receipt_number: charge.receipt_number,
            receipt_url: charge.receipt_url,
            source: {
                id: charge.source.id,
                customer: charge.source.customer,
                fingerprint: charge.source.fingerprint,
            }
        }
        
        if ( chargeMinifiedData.paid == true ) 
            return chargeMinifiedData;
            

        chargeMinifiedData.status = "failed";
        chargeMinifiedData.msg = "Try After Sometime";
        return chargeMinifiedData;
            
            

    } catch ( err ) {
		if ( err.type && err.type.startsWith( "Stripe" ) ){
			return {
                status: "failed",
                errType: err.type,

                code: err.raw.code,
                declineCode: err.raw.decline_code,
                msg: err.raw.message,
                type: err.raw.type,

                charge: err.charge,
                reqID: err.requestId,
                stsCode: err.statusCode,
            }
		}
		throw err;
        
    }
    
}


