import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(private configService: ConfigService) {
    const secretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (!secretKey) {
      console.warn('STRIPE_SECRET_KEY is missing in env');
    }
    this.stripe = new Stripe(secretKey || '', {
      // apiVersion: '2024-12-18.acacia', // Use default from package
    });
  }

  async createPaymentIntent(amount: number, currency: string = 'usd', metadata: any = {}) {
    try {
      // Amount in cents
      const amountInCents = Math.round(amount * 100);

      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: amountInCents,
        currency,
        payment_method_types: ['card'],
        metadata,
      });

      return {
        clientSecret: paymentIntent.client_secret,
        id: paymentIntent.id
      };
    } catch (error: any) {
      console.error('Error creating payment intent:', error);
      throw new InternalServerErrorException('Failed to create payment intent: ' + error.message);
    }
  }

  async getPaymentIntent(id: string) {
    try {
      return await this.stripe.paymentIntents.retrieve(id);
    } catch (error: any) {
      console.error('Error retrieving payment intent:', error);
      throw new InternalServerErrorException('Failed to retrieve payment intent');
    }
  }

  async refundPayment(paymentIntentId: string) {
    try {
      const refund = await this.stripe.refunds.create({
        payment_intent: paymentIntentId,
      });
      return refund;
    } catch (error: any) {
      console.error('Error refunding payment:', error);
      throw new BadRequestException('Refund failed: ' + error.message);
    }
  }

  constructEventFromPayload(signature: string, payload: Buffer) {
    const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');
    if (!webhookSecret) {
      throw new InternalServerErrorException('STRIPE_WEBHOOK_SECRET is missing');
    }
    try {
      return this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (err: any) {
      throw new BadRequestException(`Webhook Error: ${err.message}`);
    }
  }
}
