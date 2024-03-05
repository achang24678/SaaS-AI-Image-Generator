"use server"

import { redirect } from 'next/navigation';
import Stripe from 'stripe';
import { handleError } from '../utils';
import { connectToDatabase } from '../database/mongoose';
import Transaction from '../database/models/transaction.model';
import { updateCredits } from './user.actions';

// process the checkout and the payment
export async function checkoutCredits(transaction: CheckoutTransactionParams) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!); // add ! to let typescript know it actually exists

    const amount = Number(transaction.amount) * 100; // * 100 cuz stripe process in cents

    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                price_data: {
                    currency: "usd",
                    unit_amount: amount,
                    product_data: {
                        name: transaction.plan,
                    }
                },
                quantity: 1
            }
        ],
        metadata: {
            plan: transaction.plan,
            credits: transaction.credits,
            buyerId: transaction.buyerId,
        },
        mode: 'payment',
        success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/profile`, // go to profile page
        cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/`, //go to home
    });

    redirect(session.url!);
}

// create transaction record in our database
export async function createTransaction(transaction: CreateTransactionParams) {
    try {
        await connectToDatabase();

        // create new txn with buyerId
        const newTransaction = await Transaction.create({
            ...transaction, 
            buyer: transaction.buyerId
        })
        await updateCredits(transaction.buyerId, transaction.credits)

        return JSON.parse(JSON.stringify(newTransaction))
    } catch (error) {
        handleError(error)
    }
}